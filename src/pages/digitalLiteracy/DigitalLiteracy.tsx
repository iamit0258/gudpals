
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Laptop, BookOpen, Video, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";
import { supabase } from "@/integrations/supabase/client";

const DigitalLiteracy = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { registerForActivity, user } = useAuth();
  const [courses, setCourses] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('digital_literacy_courses')
          .select('*')
          .eq('is_published', true);

        if (error) throw error;
        setCourses(data || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  React.useEffect(() => {
    if (location.state?.registered && location.state?.activityName) {
      toast({
        title: "Registration Successful",
        description: `You've registered for ${location.state.activityName}`,
      });

      navigate(location.pathname, { replace: true });
    }
  }, [location, toast, navigate]);

  const handleCourseEnroll = (course: any) => {
    if (!user) {
      navigate('/register', { state: { from: '/digital-literacy' } });
      return;
    }

    registerForActivity(
      "course",
      course.title,
      "/digital-literacy"
    );
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold text-dhayan-purple-dark">Digital Literacy</h1>
        <p className="text-sm text-dhayan-gray">Learn essential digital skills to stay connected in today's world</p>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10 text-dhayan-gray">Loading courses...</div>
          ) : courses.length === 0 ? (
            <div className="text-center py-10 text-dhayan-gray">No courses available.</div>
          ) : (
            courses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="relative h-32">
                  <img
                    src={course.image_url || "https://images.unsplash.com/photo-1522125670776-3c7abb882bc2?q=80&w=300&auto=format&fit=crop"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-dhayan-purple text-white text-xs px-2 py-1 rounded-full">
                    {course.difficulty_level || "Beginner"}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg">{course.title}</h3>
                  <p className="text-sm text-dhayan-gray mt-1">{course.description}</p>

                  <div className="flex items-center mt-3 text-xs text-dhayan-gray-dark">
                    <Users className="h-3.5 w-3.5 mr-1" />
                    <span className="mr-3">{course.participants || 0} enrolled</span>
                    <BookOpen className="h-3.5 w-3.5 mr-1" />
                    <span>{course.duration_minutes ? `${course.duration_minutes} mins` : "Self-paced"}</span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    className="w-full bg-dhayan-purple hover:bg-dhayan-purple-dark text-white"
                    onClick={() => handleCourseEnroll(course)}
                  >
                    <Laptop className="h-4 w-4 mr-2" />
                    Enroll Now
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </MobileLayout>
  );
};

export default DigitalLiteracy;
