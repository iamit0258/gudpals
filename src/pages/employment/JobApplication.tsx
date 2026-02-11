
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/ClerkAuthBridge";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase, MapPin, User, Phone, Brain, ArrowLeft } from "lucide-react";

const JobApplication = () => {
    const { id: jobId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [jobDetails, setJobDetails] = useState<any>(null);
    const [formData, setFormData] = useState({
        applicant_name: "",
        email: "",
        phone: "",
        age: "",
        location: "",
        skills: "",
        experience: "",
    });

    useEffect(() => {
        // Pre-fill user data
        if (user) {
            setFormData(prev => ({
                ...prev,
                applicant_name: user.displayName || "",
                email: user.email || "",
                phone: user.phoneNumber || "",
            }));

            // Try to fetch extended profile data if available
            const fetchProfile = async () => {
                const { data } = await supabase
                    .from('profiles')
                    .select('age, location, interests')
                    .eq('id', user.uid)
                    .single();

                if (data) {
                    setFormData(prev => ({
                        ...prev,
                        age: data.age?.toString() || "",
                        location: data.location || "",
                        skills: data.interests?.join(", ") || ""
                    }));
                }
            };
            fetchProfile();
        }
    }, [user]);

    // Fetch Job Details (Simulated for now if DB fetch fails, to ensure UI works)
    useEffect(() => {
        const fetchJob = async () => {
            // Ideally fetching from employment_opportunities table
            // For now we can just show a generic header or try to fetch
            if (!jobId) return;

            const { data, error } = await supabase
                .from('employment_opportunities')
                .select('*')
                .eq('id', jobId)
                .single();

            if (data) {
                setJobDetails(data);
            } else {
                // Fallback for demo/dev if generic IDs used
                console.log("Job not found or error:", error);
                setJobDetails({ title: "Job Application" });
            }
        };
        fetchJob();
    }, [jobId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!user) {
                toast({
                    title: "Authentication Error",
                    description: "You must be logged in to apply.",
                    variant: "destructive"
                });
                return;
            }

            // @ts-ignore: Table 'job_applications' created via migration, types not yet generated
            const { error } = await supabase
                .from('job_applications')
                .insert({
                    job_id: jobId,
                    user_id: user.uid,
                    applicant_name: formData.applicant_name,
                    email: formData.email,
                    phone: formData.phone,
                    age: formData.age ? parseInt(formData.age) : null,
                    location: formData.location,
                    skills: formData.skills,
                    experience: formData.experience,
                    status: 'pending'
                });

            if (error) throw error;

            toast({
                title: "Application Submitted",
                description: "Good luck! Your application has been sent successfully."
            });

            navigate('/employment');

        } catch (error: any) {
            console.error("Submission error:", error);
            toast({
                title: "Error",
                description: error.message || "Failed to submit application.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <MobileLayout>
            <div className="p-4 space-y-4">
                <Button
                    variant="ghost"
                    className="pl-0 hover:bg-transparent text-dhayan-gray-dark"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>Apply for {jobDetails?.title || "Job Opportunity"}</CardTitle>
                        <CardDescription>Please complete the form below to apply.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="applicant_name">Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="applicant_name"
                                        name="applicant_name"
                                        value={formData.applicant_name}
                                        onChange={handleChange}
                                        className="pl-9"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="age">Age</Label>
                                    <Input
                                        id="age"
                                        name="age"
                                        type="number"
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder="e.g. 65"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="pl-9"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="City, Area"
                                        className="pl-9"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="skills">Key Skills</Label>
                                <div className="relative">
                                    <Brain className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Textarea
                                        id="skills"
                                        name="skills"
                                        value={formData.skills}
                                        onChange={handleChange}
                                        placeholder="List your relevant skills..."
                                        className="pl-9 min-h-[80px]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="experience">Relevant Experience</Label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Textarea
                                        id="experience"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        placeholder="Briefly describe your past experience..."
                                        className="pl-9 min-h-[100px]"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-dhayan-purple hover:bg-dhayan-purple-dark text-white"
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : "Submit Application"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </MobileLayout>
    );
};

export default JobApplication;
