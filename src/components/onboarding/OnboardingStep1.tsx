import { Cake } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OnboardingData } from "@/pages/auth/Onboarding";

interface OnboardingStep1Props {
  formData: OnboardingData;
  setFormData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  onNext: () => void;
}

const OnboardingStep1 = ({ formData, setFormData, onNext }: OnboardingStep1Props) => {
  const handleNext = () => {
    if (formData.age && formData.age > 0) {
      onNext();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-full">
          <Cake className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">How old are you?</h3>
          <p className="text-sm text-muted-foreground">
            This helps us personalize your experience
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          min="1"
          max="120"
          placeholder="Enter your age"
          value={formData.age || ""}
          onChange={(e) =>
            setFormData({ ...formData, age: parseInt(e.target.value) || null })
          }
          className="text-lg"
        />
      </div>

      <Button
        onClick={handleNext}
        disabled={!formData.age || formData.age <= 0}
        className="w-full"
        size="lg"
      >
        Continue
      </Button>
    </div>
  );
};

export default OnboardingStep1;
