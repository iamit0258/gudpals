
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Laptop, BookOpen, Video, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";

const DigitalLiteracy = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { registerForActivity } = useAuth();
  
  React.useEffect(() => {
    if (location.state?.registered && location.state?.activityName) {
      toast({
        title: "Registration Successful",
        description: `You've registered for ${location.state.activityName}`,
      });
      
      navigate(location.pathname, { replace: true });
    }
  }, [location, toast, navigate]);
  
  const courses = [
    {
      id: 1,
      title: "Smartphone Basics",
      description: "Learn how to use your smartphone effectively for daily tasks.",
      participants: 128,
      schedule: "Self-paced",
      image: "https://images.unsplash.com/photo-1522125670776-3c7abb882bc2?q=80&w=300&auto=format&fit=crop",
      category: "Beginner",
    },
    {
      id: 2,
      title: "Internet Safety",
      description: "Protect yourself online with essential internet safety skills.",
      participants: 95,
      schedule: "Weekly sessions",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=300&auto=format&fit=crop",
      category: "Intermediate",
    },
    {
      id: 3,
      title: "Video Calling",
      description: "Connect with family and friends through video calls.",
      participants: 210,
      schedule: "Self-paced",
      image: "https://images.unsplash.com/photo-1609749178460-3fed32112f86?q=80&w=300&auto=format&fit=crop",
      category: "Beginner",
    },
  ];

  const handleCourseEnrollment = (course: any) => {
    registerForActivity(
      "course",
      course.title,
      "/digitalLiteracy"
    );
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold text-dhayan-purple-dark">Digital Literacy</h1>
        <p className="text-sm text-dhayan-gray">Learn essential digital skills to stay connected in today's world</p>
        
        <div className="space-y-4">
          {courses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <div className="relative h-32">
                <img 
                  src={course.image} 
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-dhayan-purple text-white text-xs px-2 py-1 rounded-full">
                  {course.category}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg">{course.title}</h3>
                <p className="text-sm text-dhayan-gray mt-1">{course.description}</p>
                
                <div className="flex items-center mt-3 text-xs text-dhayan-gray-dark">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  <span className="mr-3">{course.participants} enrolled</span>
                  <BookOpen className="h-3.5 w-3.5 mr-1" />
                  <span>{course.schedule}</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  className="w-full bg-dhayan-purple hover:bg-dhayan-purple-dark text-white"
                  onClick={() => handleCourseEnrollment(course)}
                >
                  <Laptop className="h-4 w-4 mr-2" />
                  Enroll Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default DigitalLiteracy;
