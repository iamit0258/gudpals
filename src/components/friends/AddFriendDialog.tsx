import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/ClerkAuthBridge";

interface AddFriendDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const AddFriendDialog: React.FC<AddFriendDialogProps> = ({ open, onOpenChange }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const { t, language } = useLanguage();
    const { user } = useAuth();

    const handleSearch = async () => {
        if (!searchQuery.trim() || !user) return;

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("profiles")
                .select("id, display_name, photo_url")
                .ilike("display_name", `%${searchQuery}%`)
                .neq("id", user.uid)
                .limit(10);

            if (error) throw error;

            setSearchResults(data || []);
        } catch (error: any) {
            console.error("Search error:", error);
            toast({
                title: language === "en" ? "Error" : "त्रुटि",
                description: language === "en" ? "Failed to search users" : "उपयोगकर्ताओं को खोजने में विफल",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSendRequest = async (receiverId: string, receiverName: string) => {
        if (!user) return;

        try {
            const { error } = await supabase
                .from("friend_requests")
                .insert({
                    sender_id: user.uid,
                    receiver_id: receiverId,
                    status: "pending",
                });

            if (error) throw error;

            toast({
                title: language === "en" ? "Request Sent" : "अनुरोध भेजा गया",
                description: language === "en"
                    ? `Friend request sent to ${receiverName}`
                    : `${receiverName} को मित्र अनुरोध भेजा गया`,
            });

            // Remove from search results
            setSearchResults(prev => prev.filter(u => u.id !== receiverId));
        } catch (error: any) {
            console.error("Friend request error:", error);
            toast({
                title: language === "en" ? "Error" : "त्रुटि",
                description: language === "en"
                    ? "Failed to send friend request"
                    : "मित्र अनुरोध भेजने में विफल",
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {language === "en" ? "Add Friend" : "मित्र जोड़ें"}
                    </DialogTitle>
                    <DialogDescription>
                        {language === "en"
                            ? "Search for friends by name"
                            : "नाम से मित्रों को खोजें"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Search Input */}
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                            <Input
                                className="pl-10"
                                placeholder={language === "en" ? "Enter name..." : "नाम दर्ज करें..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </div>
                        <Button onClick={handleSearch} disabled={loading || !searchQuery.trim()}>
                            {language === "en" ? "Search" : "खोजें"}
                        </Button>
                    </div>

                    {/* Search Results */}
                    <div className="max-h-[300px] overflow-y-auto space-y-2">
                        {loading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : searchResults.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>
                                    {searchQuery
                                        ? (language === "en" ? "No users found" : "कोई उपयोगकर्ता नहीं मिला")
                                        : (language === "en" ? "Search for friends" : "मित्रों को खोजें")}
                                </p>
                            </div>
                        ) : (
                            searchResults.map((result) => (
                                <div
                                    key={result.id}
                                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                                >
                                    <div className="flex items-center gap-3">
                                        {result.photo_url ? (
                                            <img
                                                src={result.photo_url}
                                                alt={result.display_name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold">
                                                {result.display_name?.charAt(0).toUpperCase() || "U"}
                                            </div>
                                        )}
                                        <span className="font-medium">{result.display_name || "Unknown User"}</span>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => handleSendRequest(result.id, result.display_name)}
                                    >
                                        <UserPlus className="h-4 w-4 mr-1" />
                                        {language === "en" ? "Add" : "जोड़ें"}
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AddFriendDialog;
