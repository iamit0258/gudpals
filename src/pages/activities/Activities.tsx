import React from "react";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Calendar, MapPin } from "lucide-react";
import { useAuth } from "@/context/auth";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/context/language/LanguageContext";
import { useToast } from "@/hooks/use-toast";

const Activities = () => {
  const { registerForActivity, user } = useAuth();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [activities, setActivities] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('activities')
          .select('*')
          .eq('is_active', true)
          .eq('activity_type', 'activity');

        if (error) throw error;
        setActivities(data || []);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const handleActivityJoin = (activity: any) => {
    if (!user) {
      navigate('/register', { state: { from: '/activities' } });
      return;
    }

    registerForActivity(
      "activity",
      activity.title,
      "/activities"
    );
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold text-dhayan-purple-dark">Activities</h1>
        <p className="text-sm text-dhayan-gray">Discover engaging activities to keep you active and connected</p>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10 text-dhayan-gray">Loading activities...</div>
          ) : activities.length === 0 ? (
            <div className="text-center py-10 text-dhayan-gray">No activities available.</div>
          ) : (
            activities.map((activity) => {
              const title = language === 'hi' && activity.title_hi ? activity.title_hi : activity.title;
              const description = language === 'hi' && activity.description_hi ? activity.description_hi : activity.description;
              const instructor = language === 'hi' && activity.instructor_hi ? activity.instructor_hi : activity.instructor;
              const category = language === 'hi' && activity.category_hi ? activity.category_hi : activity.category;

              return (
                <Card key={activity.id} className="overflow-hidden">
                  <div className="relative h-32">
                    <img
                      src={activity.image_url || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=300&auto=format&fit=crop"}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                    {category && (
                      <div className="absolute top-2 right-2 bg-dhayan-purple text-white text-xs px-2 py-1 rounded-full">
                        {category}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <p className="text-sm text-dhayan-gray mt-1">{description}</p>

                    <div className="flex items-center mt-3 text-xs text-dhayan-gray-dark">
                      <Users className="h-3.5 w-3.5 mr-1" />
                      <span className="mr-3">{activity.participants || 0} participants</span>
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>{activity.schedule || "Regular"}</span>
                    </div>
                    {(activity.location || instructor) && (
                      <div className="flex items-center mt-1 text-xs text-dhayan-gray-dark">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        <span>{activity.location || instructor}</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      className="w-full bg-dhayan-purple hover:bg-dhayan-purple-dark text-white"
                      onClick={() => handleActivityJoin(activity)}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Join Activity
                    </Button>
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Activities;
