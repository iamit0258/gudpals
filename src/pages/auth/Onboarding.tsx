import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Cake, MapPin, Target, Heart, ArrowRight, SkipForward } from "lucide-react";
import OnboardingStep1 from "@/components/onboarding/OnboardingStep1";
import OnboardingStep2 from "@/components/onboarding/OnboardingStep2";
import OnboardingStep3 from "@/components/onboarding/OnboardingStep3";

export interface OnboardingData {
  age: number | null;
  location: string;
  interests: string[];
  hobbies: string[];
}

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<OnboardingData>({
    age: null,
    location: "",
    interests: [],
    hobbies: [],
  });

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  useEffect(() => {
    // Check if profile is already completed
    const checkProfileStatus = async () => {
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("profile_completed")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.profile_completed) {
        navigate("/");
      }
    };

    checkProfileStatus();
  }, [user, navigate]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    if (!user) return;

    try {
      setIsSubmitting(true);
      
      await supabase
        .from("profiles")
        .update({ profile_completed: true })
        .eq("id", user.id);

      toast({
        title: "Onboarding Skipped",
        description: "You can complete your profile later in settings.",
      });

      navigate("/");
    } catch (error) {
      console.error("Error skipping onboarding:", error);
      toast({
        title: "Error",
        description: "Failed to skip onboarding. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    try {
      setIsSubmitting(true);

      // Determine provider from Clerk user data
      const provider = user.externalAccounts?.[0]?.provider || "email";

      const { error } = await supabase
        .from("profiles")
        .update({
          age: formData.age,
          location: formData.location,
          interests: formData.interests,
          hobbies: formData.hobbies,
          profile_completed: true,
          provider: provider,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Welcome to Gudpals! 🎉",
        description: "Your profile has been set up successfully.",
      });

      navigate("/");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepIcons = [Cake, MapPin, Target];
  const StepIcon = stepIcons[currentStep - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Let's personalize your Gudpals experience!
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSkip}
              disabled={isSubmitting}
              className="text-muted-foreground"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Skip for now
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <StepIcon className="w-5 h-5" />
                Step {currentStep} of {totalSteps}
              </span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <OnboardingStep1
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 && (
            <OnboardingStep2
              formData={formData}
              setFormData={setFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && (
            <OnboardingStep3
              formData={formData}
              setFormData={setFormData}
              onBack={handleBack}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
