import { useState } from "react";
import { Target, Heart, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OnboardingData } from "@/pages/auth/Onboarding";

interface OnboardingStep3Props {
  formData: OnboardingData;
  setFormData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const POPULAR_INTERESTS = [
  "Technology",
  "Travel",
  "Music",
  "Art",
  "Sports",
  "Food",
  "Reading",
  "Gaming",
  "Photography",
  "Fitness",
];

const POPULAR_HOBBIES = [
  "Cooking",
  "Painting",
  "Yoga",
  "Hiking",
  "Dancing",
  "Gardening",
  "Writing",
  "Cycling",
  "Swimming",
  "Chess",
];

const OnboardingStep3 = ({
  formData,
  setFormData,
  onBack,
  onSubmit,
  isSubmitting,
}: OnboardingStep3Props) => {
  const [interestInput, setInterestInput] = useState("");
  const [hobbyInput, setHobbyInput] = useState("");

  const addInterest = (interest: string) => {
    if (interest && !formData.interests.includes(interest)) {
      setFormData({
        ...formData,
        interests: [...formData.interests, interest],
      });
      setInterestInput("");
    }
  };

  const removeInterest = (interest: string) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter((i) => i !== interest),
    });
  };

  const addHobby = (hobby: string) => {
    if (hobby && !formData.hobbies.includes(hobby)) {
      setFormData({
        ...formData,
        hobbies: [...formData.hobbies, hobby],
      });
      setHobbyInput("");
    }
  };

  const removeHobby = (hobby: string) => {
    setFormData({
      ...formData,
      hobbies: formData.hobbies.filter((h) => h !== hobby),
    });
  };

  const canSubmit = formData.interests.length > 0 || formData.hobbies.length > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-full">
          <Target className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">What are you into?</h3>
          <p className="text-sm text-muted-foreground">
            Select your interests and hobbies to get personalized recommendations
          </p>
        </div>
      </div>

      {/* Interests Section */}
      <div className="space-y-3">
        <Label htmlFor="interests" className="flex items-center gap-2">
          <Target className="w-4 h-4" />
          Interests
        </Label>
        
        <div className="flex gap-2">
          <Input
            id="interests"
            type="text"
            placeholder="Type an interest and press Enter"
            value={interestInput}
            onChange={(e) => setInterestInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addInterest(interestInput.trim());
              }
            }}
          />
          <Button
            type="button"
            onClick={() => addInterest(interestInput.trim())}
            disabled={!interestInput.trim()}
          >
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {POPULAR_INTERESTS.map((interest) => (
            <Badge
              key={interest}
              variant={formData.interests.includes(interest) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() =>
                formData.interests.includes(interest)
                  ? removeInterest(interest)
                  : addInterest(interest)
              }
            >
              {interest}
            </Badge>
          ))}
        </div>

        {formData.interests.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
            <span className="text-sm font-medium">Selected:</span>
            {formData.interests.map((interest) => (
              <Badge key={interest} variant="secondary" className="gap-1">
                {interest}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => removeInterest(interest)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Hobbies Section */}
      <div className="space-y-3">
        <Label htmlFor="hobbies" className="flex items-center gap-2">
          <Heart className="w-4 h-4" />
          Hobbies
        </Label>
        
        <div className="flex gap-2">
          <Input
            id="hobbies"
            type="text"
            placeholder="Type a hobby and press Enter"
            value={hobbyInput}
            onChange={(e) => setHobbyInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addHobby(hobbyInput.trim());
              }
            }}
          />
          <Button
            type="button"
            onClick={() => addHobby(hobbyInput.trim())}
            disabled={!hobbyInput.trim()}
          >
            Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-2">
          {POPULAR_HOBBIES.map((hobby) => (
            <Badge
              key={hobby}
              variant={formData.hobbies.includes(hobby) ? "default" : "outline"}
              className="cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() =>
                formData.hobbies.includes(hobby)
                  ? removeHobby(hobby)
                  : addHobby(hobby)
              }
            >
              {hobby}
            </Badge>
          ))}
        </div>

        {formData.hobbies.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
            <span className="text-sm font-medium">Selected:</span>
            {formData.hobbies.map((hobby) => (
              <Badge key={hobby} variant="secondary" className="gap-1">
                {hobby}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => removeHobby(hobby)}
                />
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button onClick={onBack} variant="outline" className="flex-1">
          Back
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!canSubmit || isSubmitting}
          className="flex-1"
          size="lg"
        >
          {isSubmitting ? "Completing..." : "Complete Setup"}
        </Button>
      </div>
    </div>
  );
};
export default OnboardingStep3;