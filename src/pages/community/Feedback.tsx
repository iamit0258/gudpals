import React, { useState } from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const Feedback = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setIsSubmitted(true);
            toast({
                title: "Feedback Sent",
                description: "Thank you for helping us improve GUDPALS!",
            });
        }, 1500);
    };

    if (isSubmitted) {
        return (
            <MobileLayout>
                <div className="p-4 flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-dhayan-teal/10 flex items-center justify-center text-dhayan-teal">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-gray-800">Feedback Received!</h1>
                        <p className="text-muted-foreground">
                            We appreciate you taking the time to share your thoughts with us.
                            Our team will review your feedback carefully.
                        </p>
                    </div>
                    <Button onClick={() => navigate("/")} className="w-full max-w-xs">
                        Return Home
                    </Button>
                </div>
            </MobileLayout>
        );
    }

    return (
        <MobileLayout>
            <div className="p-4 space-y-6">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/profile?tab=settings&section=about")}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold text-primary">Send Feedback</h1>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>How are we doing?</CardTitle>
                        <CardDescription>
                            Your feedback is crucial in helping us build a better experience for our silver community.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Feedback Category</Label>
                                <Select required>
                                    <SelectTrigger id="category">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="app">App Features</SelectItem>
                                        <SelectItem value="products">Physical Products</SelectItem>
                                        <SelectItem value="sessions">Live Sessions</SelectItem>
                                        <SelectItem value="astrology">Astrology Services</SelectItem>
                                        <SelectItem value="bug">Report a Bug</SelectItem>
                                        <SelectItem value="suggestion">General Suggestion</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input id="subject" placeholder="What's your feedback about?" required />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Your Message</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Tell us what's on your mind... we're listening!"
                                    className="min-h-[150px] resize-none"
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full h-12 text-lg" disabled={loading}>
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Sending...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Send className="h-5 w-5" />
                                        Submit Feedback
                                    </span>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </MobileLayout>
    );
};

export default Feedback;
