import React from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, TrendingUp, Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";

const Forum = () => {
    const navigate = useNavigate();

    const categories = [
        { title: "Health & Wellness", description: "Discuss tips for staying active and healthy", count: 124, icon: TrendingUp },
        { title: "Technology Tips", description: "Helping each other with gadgets and apps", count: 86, icon: Search },
        { title: "Hobbies & Crafts", description: "Share your latest projects and crafts", count: 215, icon: Users },
        { title: "General Chit-chat", description: "A place for everyday conversations", count: 542, icon: MessageSquare },
    ];

    return (
        <MobileLayout>
            <div className="p-4 space-y-6">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/profile?tab=settings&section=about")}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold text-primary">Community Forum</h1>
                </div>

                <Card className="bg-gradient-to-br from-dhayan-teal/10 to-dhayan-purple/10 border-none">
                    <CardHeader>
                        <CardTitle className="text-xl">Welcome to our Community!</CardTitle>
                        <CardDescription>
                            A safe space for GUDPALS members to connect, share, and grow together.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input className="pl-9 bg-white" placeholder="Search discussions..." />
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-4">
                    <h2 className="text-lg font-semibold px-1">Discussion Categories</h2>
                    <div className="grid gap-4">
                        {categories.map((cat, index) => (
                            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer border-dhayan-teal/20">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-dhayan-teal/10 flex items-center justify-center text-dhayan-teal">
                                            <cat.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-800">{cat.title}</h3>
                                            <p className="text-xs text-muted-foreground">{cat.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-bold text-dhayan-teal bg-dhayan-teal/5 px-2 py-1 rounded-full">
                                            {cat.count}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="pt-4">
                    <Card className="border-dashed border-2 bg-gray-50/50">
                        <CardContent className="p-8 text-center space-y-3">
                            <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto">
                                <Users className="h-6 w-6 text-dhayan-purple" />
                            </div>
                            <h3 className="font-semibold">Join the Conversation</h3>
                            <p className="text-sm text-muted-foreground">
                                The full forum experience is launching soon. Get ready to connect with GUDPALS from around the world!
                            </p>
                            <Button className="mt-2">Enable Notifications</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MobileLayout>
    );
};

export default Forum;
