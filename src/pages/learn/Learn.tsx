
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Book, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const Learn = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { registerForActivity } = useAuth();
  
  // Check if user just registered for an activity
  React.useEffect(() => {
    if (location.state?.registered && location.state?.activityName) {
      toast({
        title: "Registration Successful",
        description: `You've been registered for ${location.state.activityName}`,
      });
      
      // Remove the state to prevent showing the toast again on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location, toast, navigate]);
  
  const courses = [
    {
      id: 1,
      title: "Digital Literacy Basics",
      description: "Learn essential skills for navigating the digital world.",
      students: 156,
      duration: "4 weeks (self-paced)",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=300&auto=format&fit=crop",
      category: "Technology",
    },
    {
      id: 2,
      title: "Smartphone Mastery",
      description: "Get comfortable using smartphones for everyday tasks.",
      students: 203,
      duration: "2 weeks (2 hours/week)",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=300&auto=format&fit=crop",
      category: "Technology",
    },
    {
      id: 3,
      title: "Online Safety & Security",
      description: "Learn how to stay safe and protect your information online.",
      students: 128,
      duration: "3 weeks (self-paced)",
      image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?q=80&w=300&auto=format&fit=crop",
      category: "Safety",
    },
  ];

  const handleCourseRegister = (course: any) => {
    registerForActivity(
      "learning",
      course.title,
      "/learn"
    );
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold text-dhayan-purple-dark">Learning & Courses</h1>
        
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
                  <span className="mr-3">{course.students} students</span>
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>{course.duration}</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  className="w-full bg-dhayan-purple hover:bg-dhayan-purple-dark text-white"
                  onClick={() => handleCourseRegister(course)}
                >
                  <Book className="h-4 w-4 mr-2" />
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

export default Learn;
