import AgoraRTC, {
    IAgoraRTCClient,
    ICameraVideoTrack,
    IMicrophoneAudioTrack,
    UID
} from "agora-rtc-sdk-ng";

const APP_ID = import.meta.env.VITE_AGORA_APP_ID;

if (!APP_ID) {
    console.error("Agora App ID is missing in .env");
}

export const agoraClient: IAgoraRTCClient = AgoraRTC.createClient({
    mode: "live",
    codec: "vp8"
});

export const agoraService = {
    // Join a channel
    joinChannel: async (
        channelName: string,
        token: string | null,
        uid: UID | null,
        role: "host" | "audience"
    ) => {
        if (!APP_ID) throw new Error("Agora App ID not found");

        await agoraClient.setClientRole(role);
        const userId = await agoraClient.join(APP_ID, channelName, token, uid);
        return userId;
    },

    // Leave channel
    leaveChannel: async (localTracks?: [IMicrophoneAudioTrack, ICameraVideoTrack]) => {
        if (localTracks) {
            localTracks.forEach(track => {
                track.stop();
                track.close();
            });
        }
        await agoraClient.leave();
    },

    // Create local tracks (audio + video)
    createLocalTracks: async (): Promise<[IMicrophoneAudioTrack, ICameraVideoTrack]> => {
        const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
        return [audioTrack, videoTrack];
    },

    // Publish tracks
    publishTracks: async (tracks: [IMicrophoneAudioTrack, ICameraVideoTrack]) => {
        await agoraClient.publish(tracks);
    },

    // Unpublish tracks
    unpublishTracks: async (tracks: [IMicrophoneAudioTrack, ICameraVideoTrack]) => {
        await agoraClient.unpublish(tracks);
    }
};
