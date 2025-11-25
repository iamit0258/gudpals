import React, { useEffect, useRef, useState } from "react";
import { agoraService, agoraClient } from "@/services/agoraService";
import { IRemoteVideoTrack, IRemoteAudioTrack } from "agora-rtc-sdk-ng";

interface WatchLiveSessionProps {
    channelName: string;
    token: string;
}

const WatchLiveSession: React.FC<WatchLiveSessionProps> = ({ channelName, token }) => {
    const videoRef = useRef<HTMLDivElement>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [remoteUsers, setRemoteUsers] = useState<any[]>([]);

    useEffect(() => {
        let mounted = true;

        const joinSession = async () => {
            try {
                // 1. Join as Audience
                await agoraService.joinChannel(channelName, token, null, "audience");
                if (mounted) setIsConnected(true);

                // 2. Listen for published streams
                agoraClient.on("user-published", async (user, mediaType) => {
                    await agoraClient.subscribe(user, mediaType);

                    if (mediaType === "video") {
                        const remoteVideoTrack = user.videoTrack;
                        if (remoteVideoTrack && videoRef.current) {
                            remoteVideoTrack.play(videoRef.current);
                        }
                    }

                    if (mediaType === "audio") {
                        const remoteAudioTrack = user.audioTrack;
                        remoteAudioTrack?.play();
                    }
                });

                agoraClient.on("user-unpublished", (user) => {
                    // Handle user leaving if needed
                });

            } catch (error) {
                console.error("Error joining live session:", error);
            }
        };

        joinSession();

        return () => {
            mounted = false;
            agoraService.leaveChannel();
            agoraClient.removeAllListeners();
        };
    }, [channelName, token]);

    return (
        <div className="w-full h-full flex flex-col">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                <div ref={videoRef} className="w-full h-full" />

                {!isConnected && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                        <p>Connecting to live stream...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WatchLiveSession;
