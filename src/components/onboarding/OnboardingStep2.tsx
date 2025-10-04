import { useState, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OnboardingData } from "@/pages/auth/Onboarding";
import { useToast } from "@/hooks/use-toast";

interface OnboardingStep2Props {
  formData: OnboardingData;
  setFormData: React.Dispatch<React.SetStateAction<OnboardingData>>;
  onNext: () => void;
  onBack: () => void;
}

const OnboardingStep2 = ({
  formData,
  setFormData,
  onNext,
  onBack,
}: OnboardingStep2Props) => {
  const { toast } = useToast();
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    // Auto-detect location on mount
    detectLocation();
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Please enter your location manually.",
        variant: "destructive",
      });
      return;
    }

    setIsDetecting(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding to get location name
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          
          const data = await response.json();
          const location = data.address?.city || data.address?.town || data.address?.county || data.display_name;
          
          setFormData({ ...formData, location });
          
          toast({
            title: "Location detected",
            description: `We found you in ${location}`,
          });
        } catch (error) {
          console.error("Error getting location name:", error);
          toast({
            title: "Could not detect location",
            description: "Please enter your location manually.",
            variant: "destructive",
          });
        } finally {
          setIsDetecting(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsDetecting(false);
        toast({
          title: "Location access denied",
          description: "Please enter your location manually.",
          variant: "destructive",
        });
      }
    );
  };

  const handleNext = () => {
    if (formData.location.trim()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-full">
          <MapPin className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">Where are you located?</h3>
          <p className="text-sm text-muted-foreground">
            Connect with people and events near you
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <div className="flex gap-2">
          <Input
            id="location"
            type="text"
            placeholder="Enter your city or region"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="text-lg flex-1"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={detectLocation}
            disabled={isDetecting}
          >
            {isDetecting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Click the map icon to auto-detect your location
        </p>
      </div>

      <div className="flex gap-3">
        <Button onClick={onBack} variant="outline" className="flex-1">
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!formData.location.trim()}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default OnboardingStep2;
