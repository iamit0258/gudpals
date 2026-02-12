import React from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, MessageCircle, HelpCircle, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const ContactSupport = () => {
    const navigate = useNavigate();

    const faqs = [
        { q: "How do I track my order?", a: "Go to Profile > Account Settings > Orders to see your latest order status." },
        { q: "Can I cancel a session?", a: "Yes, sessions can be cancelled up to 2 hours before the start time." },
        { q: "How do I update my address?", a: "Go to Profile > Account Settings > Shipping to manage your saved addresses." },
    ];

    return (
        <MobileLayout>
            <div className="p-4 space-y-6">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/profile?tab=settings&section=about")}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold text-primary">Contact Support</h1>
                </div>

                <div className="space-y-4">
                    <Card className="border-dhayan-teal/20">
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <MessageCircle className="h-5 w-5 text-dhayan-teal" />
                                Get in Touch
                            </CardTitle>
                            <CardDescription>We're here to help you around the clock.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg border bg-gray-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-dhayan-teal shadow-sm">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Email Support</p>
                                        <p className="text-xs text-muted-foreground">Response within 24h</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => window.location.href = 'mailto:support@gudpals.com'}>
                                    Write to us
                                </Button>
                            </div>

                            <div className="flex items-center justify-between p-3 rounded-lg border bg-gray-50/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-dhayan-teal shadow-sm">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Phone Support</p>
                                        <p className="text-xs text-muted-foreground">Mon-Fri, 9am - 6pm</p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => window.location.href = 'tel:+918000000000'}>
                                    Call Now
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-3">
                        <h2 className="text-lg font-semibold px-1">Common Questions</h2>
                        <div className="space-y-3">
                            {faqs.map((faq, index) => (
                                <Card key={index} className="bg-gray-50/30">
                                    <CardContent className="p-4 space-y-1">
                                        <h3 className="text-sm font-bold flex items-start gap-2">
                                            <HelpCircle className="h-4 w-4 text-dhayan-purple mt-0.5 shrink-0" />
                                            {faq.q}
                                        </h3>
                                        <p className="text-sm text-muted-foreground pl-6">{faq.a}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <Card>
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                                <span className="text-sm font-medium">Visit Help Center</span>
                            </div>
                            <Button variant="link" className="text-dhayan-teal" onClick={() => navigate("/help")}>
                                View all articles
                                <ExternalLink className="h-4 w-4 ml-1" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MobileLayout>
    );
};

export default ContactSupport;
