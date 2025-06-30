
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, ExternalLink, Heart, Users, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const About = () => {
  const { toast } = useToast();

  const handleContactSupport = () => {
    toast({
      title: "Contact Support",
      description: "Support contact form would open here (Demo)"
    });
  };

  const handleOpenLink = (url: string, title: string) => {
    toast({
      title: `Opening ${title}`,
      description: `Would open ${url} in browser (Demo)`
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Info className="h-5 w-5" />
            <span>About GUDPAL'S</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-primary">GUDPAL'S</h3>
            <p className="text-sm text-muted-foreground">Version 1.0.0</p>
            <p className="text-sm">Built with ❤️ for seniors</p>
          </div>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            GUDPAL'S is a comprehensive platform designed specifically for senior citizens, 
            offering health products, social connections, learning opportunities, and 
            personalized experiences to enhance quality of life.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5" />
            <span>Our Mission</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To empower senior citizens with technology that connects, educates, and enriches 
            their lives while maintaining simplicity and accessibility.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Community</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={() => handleOpenLink("https://gudpals.community", "Community Forum")}
          >
            Community Forum
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={() => handleOpenLink("https://gudpals.app/feedback", "Feedback")}
          >
            Send Feedback
            <ExternalLink className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Legal</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={() => handleOpenLink("https://gudpals.app/privacy", "Privacy Policy")}
          >
            Privacy Policy
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={() => handleOpenLink("https://gudpals.app/terms", "Terms of Service")}
          >
            Terms of Service
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={handleContactSupport}
          >
            Contact Support
            <ExternalLink className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default About;
