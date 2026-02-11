
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, ExternalLink, Heart, Users, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/ClerkAuthBridge";

const About = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
            onClick={() => navigate("/community/forum")}
          >
            Community Forum
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => navigate("/community/feedback")}
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
            onClick={() => navigate("/legal/privacy")}
          >
            Privacy Policy
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => navigate("/legal/terms")}
          >
            Terms of Service
            <ExternalLink className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            className="w-full justify-between"
            onClick={() => navigate("/legal/support")}
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
