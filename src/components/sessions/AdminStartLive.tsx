import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Video, Mic, MicOff, VideoOff, PhoneOff } from "lucide-react";
import { agoraService, agoraClient } from "@/services/agoraService";
import { sessionLiveService } from "@/services/sessionLiveService";
import { useToast } from "@/hooks/use-toast";
import { ICameraVideoTrack, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";

interface AdminStartLiveProps {
    sessionId: string;
    channelName: string;
    token: string;
    onEnd: () => void;
}

const AdminStartLive: React.FC<AdminStartLiveProps> = ({
    sessionId,
    channelName,
    token,
    onEnd
}) => {
    const [isLive, setIsLive] = useState(false);
    const [micOn, setMicOn] = useState(true);
    const [cameraOn, setCameraOn] = useState(true);
    const [localTracks, setLocalTracks] = useState<[IMicrophoneAudioTrack, ICameraVideoTrack] | null>(null);
    const videoRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        return () => {
            // Cleanup on unmount
            if (localTracks) {
                localTracks[0].close();
                localTracks[1].close();
            }
            agoraService.leaveChannel();
        };
    }, []);

    const startBroadcast = async () => {
        try {
            // 1. Join Agora Channel
            await agoraService.joinChannel(channelName, token, null, "host");

            // 2. Create and Publish Tracks
            const tracks = await agoraService.createLocalTracks();
            setLocalTracks(tracks);
            await agoraService.publishTracks(tracks);

            // 3. Play Local Video
            if (videoRef.current) {
                tracks[1].play(videoRef.current);
            }

            // 4. Update Supabase
            await sessionLiveService.startLiveSession(sessionId, channelName, token);

            setIsLive(true);
            toast({ title: "Live", description: "You are now live!" });
        } catch (error: any) {
            console.error("Error starting broadcast:", error);
            toast({
                title: "Error",
                description: "Failed to start broadcast: " + error.message,
                variant: "destructive"
            });
        }
    };

    const stopBroadcast = async () => {
        try {
            if (localTracks) {
                await agoraService.unpublishTracks(localTracks);
                await agoraService.leaveChannel(localTracks);
                setLocalTracks(null);
            }

            await sessionLiveService.stopLiveSession(sessionId);
            setIsLive(false);
            onEnd();
            toast({ title: "Ended", description: "Broadcast ended" });
        } catch (error) {
            console.error("Error stopping broadcast:", error);
        }
    };

    const toggleMic = async () => {
        if (localTracks) {
            await localTracks[0].setEnabled(!micOn);
            setMicOn(!micOn);
        }
    };

    const toggleCamera = async () => {
        if (localTracks) {
            await localTracks[1].setEnabled(!cameraOn);
            setCameraOn(!cameraOn);
        }
    };

    return (
        <div className="flex flex-col h-full space-y-4">
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                <div ref={videoRef} className="w-full h-full" />

                {!isLive && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                        <p>Click "Go Live" to start broadcasting</p>
                    </div>
                )}

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
                    <Button
                        variant={micOn ? "secondary" : "destructive"}
                        size="icon"
                        onClick={toggleMic}
                        disabled={!isLive}
                        className="rounded-full"
                    >
                        {micOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                    </Button>

                    <Button
                        variant={cameraOn ? "secondary" : "destructive"}
                        size="icon"
                        onClick={toggleCamera}
                        disabled={!isLive}
                        className="rounded-full"
                    >
                        {cameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                    </Button>

                    <Button
                        variant="destructive"
                        size="icon"
                        onClick={stopBroadcast}
                        disabled={!isLive}
                        className="rounded-full"
                    >
                        <PhoneOff className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {!isLive && (
                <Button onClick={startBroadcast} className="w-full bg-red-600 hover:bg-red-700 text-white">
                    Go Live
                </Button>
            )}
        </div>
    );
};

export default AdminStartLive;
