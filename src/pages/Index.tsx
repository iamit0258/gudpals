
import React from "react";
import { Link } from "react-router-dom";
import { PlayCircle, Brain, Coffee, Briefcase, Map, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import MobileLayout from "@/components/layout/MobileLayout";
import FeaturedSessions from "@/components/home/FeaturedSessions";
import WelcomeBanner from "@/components/home/WelcomeBanner";
import { useLanguage } from "@/context/language/LanguageContext";

const Index = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: PlayCircle,
      name: t("live_sessions"),
      description: t("join_interactive"),
      path: "/sessions",
      color: "bg-gradient-to-br from-teal-400 to-primary"
    },
    {
      icon: Brain,
      name: t("digital_literacy"),
      description: t("learn_smartphone"),
      path: "/digital-literacy",
      color: "bg-gradient-to-br from-green-200 to-teal-300"
    },
    {
      icon: Coffee,
      name: t("activities"),
      description: t("arts_crafts"),
      path: "/activities",
      color: "bg-gradient-to-br from-amber-200 to-yellow-300"
    },
    {
      icon: Briefcase,
      name: t("employment"),
      description: t("part_time"),
      path: "/employment",
      color: "bg-gradient-to-br from-orange-200 to-amber-300"
    },
    {
      icon: Map,
      name: t("travel_plans"),
      description: t("senior_friendly"),
      path: "/travel",
      color: "bg-gradient-to-br from-emerald-300 to-green-400"
    },
    {
      icon: Star,
      name: "Astrology",
      description: "Daily horoscope and predictions",
      path: "/astrology",
      color: "bg-gradient-to-br from-purple-300 to-indigo-400"
    }
  ];

  return (
    <MobileLayout>
      <WelcomeBanner />

      <section className="px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">{t("upcoming_sessions")}</h2>
        <FeaturedSessions />
      </section>

      <section className="px-4 py-8 bg-gradient-to-b from-secondary/50 to-transparent">
        <h2 className="text-2xl font-bold mb-6">{t("our_services")}</h2>
        <div className="grid grid-cols-2 gap-4">
          {services.map(service => (
            <Link
              to={service.path}
              key={service.name}
              className="focus-visible-ring transform transition-transform duration-300 hover:scale-105"
            >
              <Card className="h-full overflow-hidden border-none shadow-md">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-3 ${service.color} shadow-md`}>
                    <service.icon className="h-7 w-7 text-white" />
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
