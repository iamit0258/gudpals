import React from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    return (
        <MobileLayout>
            <div className="p-4 space-y-6">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/profile?tab=settings&section=about")}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold text-primary">Privacy Policy</h1>
                </div>

                <Card>
                    <CardHeader className="text-center pb-2">
                        <div className="w-12 h-12 rounded-full bg-dhayan-teal/10 flex items-center justify-center text-dhayan-teal mx-auto mb-2">
                            <Shield className="h-6 w-6" />
                        </div>
                        <CardTitle>Your Privacy Matters</CardTitle>
                        <CardDescription>Last Updated: February 5, 2026</CardDescription>
                    </CardHeader>
                    <CardContent className="prose prose-sm max-w-none text-gray-700 space-y-4">
                        <section>
                            <h3 className="text-lg font-semibold text-gray-900">1. Information We Collect</h3>
                            <p>
                                At GUDPALS, we collect information that you provide directly to us when you create an account,
                                purchase products, or use our astrology and session services. This includes your name,
                                email address, phone number, and physical address for deliveries.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-gray-900">2. How We Use Your Information</h3>
                            <p>
                                We use the information we collect to provide, maintain, and improve our services,
                                including processing transactions, providing customer support, and personalizing
                                your experience on GUDPALS.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-gray-900">3. Information Sharing</h3>
                            <p>
                                We do not share your personal information with third parties except as necessary
                                to provide our services (e.g., sharing your address with delivery partners)
                                or as required by law.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-gray-900">4. Data Security</h3>
                            <p>
                                We implement industry-standard security measures to protect your information
                                from unauthorized access, disclosure, or destruction.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-gray-900">5. Your Choices</h3>
                            <p>
                                You can access and update your profile information at any time through the
                                Settings menu in the app. You may also request the deletion of your account
                                by contacting our support team.
                            </p>
                        </section>
                    </CardContent>
                </Card>
            </div>
        </MobileLayout>
    );
};

export default PrivacyPolicy;
