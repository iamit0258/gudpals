
import React from "react";
import { Link } from "react-router-dom";
import { 
  Users, PlayCircle, Brain, Shield, 
  Gamepad2, Coffee, Briefcase, Heart,
  Map
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import MobileLayout from "@/components/layout/MobileLayout";
import FeaturedSessions from "@/components/home/FeaturedSessions";
import WelcomeBanner from "@/components/home/WelcomeBanner";

const Index = () => {
  const services = [
    {
      icon: PlayCircle,
      name: "Live Sessions",
      description: "Join interactive live sessions",
      path: "/sessions",
      color: "bg-dhayan-yellow",
    },
    {
      icon: Users,
      name: "Yoga Classes",
      description: "Virtual yoga and wellness",
      path: "/yoga",
      color: "bg-dhayan-green",
    },
    {
      icon: Brain,
      name: "Digital Literacy",
      description: "Learn digital skills",
      path: "/learn",
      color: "bg-dhayan-green-light",
    },
    {
      icon: Shield,
      name: "Safety",
      description: "Security tips and workshops",
      path: "/safety",
      color: "bg-dhayan-pink",
    },
    {
      icon: Gamepad2,
      name: "Tambola",
      description: "Play housie with friends",
      path: "/games",
      color: "bg-dhayan-purple-light",
    },
    {
      icon: Coffee,
      name: "Activities",
      description: "Arts, crafts and more",
      path: "/activities",
      color: "bg-dhayan-yellow",
    },
    {
      icon: Briefcase,
      name: "Employment",
      description: "Post-retirement opportunities",
      path: "/employment",
      color: "bg-dhayan-orange",
    },
    {
      icon: Heart,
      name: "Loyalty Program",
      description: "GUDPALS membership benefits",
      path: "/loyalty",
      color: "bg-dhayan-pink",
    },
    {
      icon: Map,
      name: "Travel Plans",
      description: "Senior-friendly experiences",
      path: "/travel",
      color: "bg-dhayan-green",
    },
  ];

  return (
    <MobileLayout>
      <WelcomeBanner />
      
      <section className="px-4 py-6">
        <h2 className="text-2xl font-bold mb-4">Upcoming Sessions</h2>
        <FeaturedSessions />
      </section>

      <section className="px-4 py-6 bg-dhayan-purple/5">
        <h2 className="text-2xl font-bold mb-4">Our Services</h2>
        <div className="grid grid-cols-2 gap-4">
          {services.map((service) => (
            <Link 
              to={service.path} 
              key={service.name}
              className="focus-visible-ring"
            >
              <Card className="h-full transition-transform hover:scale-105">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className={`w-12 h-12 rounded-full ${service.color} flex items-center justify-center mb-3`}>
                    <service.icon className="h-6 w-6 text-dhayan-purple-dark" />
                  </div>
                  <h3 className="font-medium text-lg">{service.name}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </MobileLayout>
  );
};

export default Index;
