import React from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
    const navigate = useNavigate();

    return (
        <MobileLayout>
            <div className="p-4 space-y-6">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/profile?tab=settings&section=about")}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold text-primary">Terms of Service</h1>
                </div>

                <Card>
                    <CardHeader className="text-center pb-2">
                        <div className="w-12 h-12 rounded-full bg-dhayan-purple/10 flex items-center justify-center text-dhayan-purple mx-auto mb-2">
                            <FileText className="h-6 w-6" />
                        </div>
                        <CardTitle>GUDPAL'S Service Terms</CardTitle>
                        <CardDescription>Last Updated: February 5, 2026</CardDescription>
                    </CardHeader>
                    <CardContent className="prose prose-sm max-w-none text-gray-700 space-y-4">
                        <section>
                            <h3 className="text-lg font-semibold text-gray-900">1. Acceptance of Terms</h3>
                            <p>
                                By accessing or using the GUDPALS platform, you agree to be bound by these
                                Terms of Service and our Privacy Policy. If you do not agree, please do
                                not use our services.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-gray-900">2. Description of Service</h3>
                            <p>
                                GUDPALS provides a platform specifically designed for senior citizens,
                                offering e-commerce, social interaction, and consultation services.
                                We reserve the right to modify or discontinue any part of the service
                                at any time.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-gray-900">3. User Responsibilities</h3>
                            <p>
                                You are responsible for maintaining the confidentiality of your account
                                credentials and for all activities that occur under your account.
                                You agree to use GUDPALS in compliance with all applicable laws.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-gray-900">4. Purchases and Payments</h3>
                            <p>
                                All purchases made through GUDPALS are subject to our return and refund
                                policies. Payments are processed securely through our payment partners.
                            </p>
                        </section>

                        <section>
                            <h3 className="text-lg font-semibold text-gray-900">5. Limitation of Liability</h3>
                            <p>
                                GUDPALS shall not be liable for any indirect, incidental, special,
                                consequential, or punitive damages resulting from your use of the service.
                            </p>
                        </section>
                    </CardContent>
                </Card>
            </div>
        </MobileLayout>
    );
};

export default TermsOfService;
