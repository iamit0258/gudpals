import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/ClerkAuthBridge";
import { supabase } from "@/integrations/supabase/client";
import MobileLayout from "@/components/layout/MobileLayout";
import AdminStartLive from "@/components/sessions/AdminStartLive";
import WatchLiveSession from "@/components/sessions/WatchLiveSession";
import LiveChat from "@/components/sessions/LiveChat";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { MOCK_SESSIONS } from "@/data/mockSessions";

const SessionLive = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchSession = async () => {
            console.log("SessionLive: Fetching session for ID:", id);
            if (!id) return;

            try {
                // Fetch session details
                let { data: sessionData, error } = await supabase
                    .from('activities')
                    .select('*')
                    .eq('id', id)
                    .maybeSingle();

                console.log("SessionLive: Initial fetch result:", { sessionData, error });

                // If not found in DB, check if it's a mock session and insert it
                if (!sessionData && !error) {
                    console.log("SessionLive: Session not found in DB. Checking mocks...");
                    const mockSession = MOCK_SESSIONS.find(s => s.id === id);
                    console.log("SessionLive: Found mock session?", mockSession);

                    if (mockSession) {
                        console.log("SessionLive: Inserting mock session into DB...");
                        // Insert mock session into DB so we can update it later
                        const { data: newSession, error: insertError } = await supabase
                            .from('activities')
                            .insert({
                                id: mockSession.id,
                                title: mockSession.title, // Default to English for DB
                                instructor: mockSession.instructor,
                                activity_type: 'session',
                                category: mockSession.category,
                                image_url: mockSession.image_url,
                                start_time: mockSession.start_time,
                                end_time: mockSession.end_time,
                                description: "Mock session auto-created"
                            })
                            .select()
                            .single();

                        console.log("SessionLive: Insert result:", { newSession, insertError });

                        if (!insertError && newSession) {
                            sessionData = newSession;
                        } else {
                            console.error("SessionLive: Failed to insert mock session:", insertError);
                        }
                    }
                }

                if (error && error.code !== 'PGRST116') throw error; // Ignore "no rows" error if we handled it

                if (sessionData) {
                    setSession(sessionData);
                    console.log("SessionLive: Session set successfully:", sessionData);

                    // Check if user is the specific admin
                    if (user && user.email === "mevarun.arcade@gmail.com") {
                        setIsAdmin(true);
                    }
                } else {
                    console.warn("SessionLive: Session still null after checks.");
                }

            } catch (error) {
                console.error("Error fetching session:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSession();
    }, [id, user]);

    if (loading) {
        return (
            <MobileLayout>
                <div className="flex items-center justify-center h-[80vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </MobileLayout>
        );
    }

    if (!session) {
        return (
            <MobileLayout>
                <div className="p-4 text-center">Session not found</div>
            </MobileLayout>
        );
    }

    // Use the token provided by user for demo purposes if not in DB
    // In production, this should come from your backend generation logic
    const DEMO_TOKEN = "007eJxTYFCSXGXqxfeH+dA105borg2/Vgn+P9g39ctrn3YbRVPT2JsKDIaWhkmJKUnmRmlmpiZGKcYWlhbJqUapJiamFmZJFuaJR2TVMhsCGRmYz+gwMjJAIIjPzuBemhKQmFPMwAAAfdAfSg==";
    const channelName = session.agora_channel || "GudPals";
    const token = session.agora_token || DEMO_TOKEN;

    return (
        <MobileLayout hideNavigation>
            <div className="flex flex-col h-[calc(100vh-64px)] p-4 gap-4">
                <div className="flex-none">
                    <h1 className="text-xl font-bold mb-1">{session.title}</h1>
                    <p className="text-sm text-gray-500">
                        {isAdmin ? "You are the Host" : "Live Session"}
                    </p>
                </div>

                <div className="flex-1 flex flex-col gap-4 min-h-0">
                    {/* Video Area */}
                    <div className="flex-1 bg-black rounded-lg overflow-hidden min-h-[200px]">
                        {isAdmin ? (
                            <AdminStartLive
                                sessionId={session.id}
                                channelName={channelName}
                                token={token}
                                onEnd={() => navigate("/sessions")}
                            />
                        ) : (
                            session.is_live ? (
                                <WatchLiveSession
                                    channelName={channelName}
                                    token={token}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-white">
                                    <p>The host has not started the live stream yet.</p>
                                </div>
                            )
                        )}
                    </div>

                    {/* Chat Area */}
                    <div className="h-1/3 min-h-[200px]">
                        <LiveChat sessionId={session.id} />
                    </div>
                </div>
            </div>
        </MobileLayout>
    );
};

export default SessionLive;
