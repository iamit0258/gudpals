
import React from "react";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Book, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const Learn = () => {
  const courses = [
    {
      id: 1,
      title: "Digital Basics",
      description: "Learn the fundamentals of using smartphones and tablets",
      progress: 30,
      icon: "📱",
    },
    {
      id: 2,
      title: "Internet Safety",
      description: "Stay safe while browsing the internet and using online services",
      progress: 15,
      icon: "🔒",
    },
    {
      id: 3,
      title: "Social Media 101",
      description: "Connect with family and friends through popular social platforms",
      progress: 0,
      icon: "👥",
    },
    {
      id: 4,
      title: "Online Banking",
      description: "Manage your finances securely from your device",
      progress: 0,
      icon: "🏦",
    },
  ];

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold text-dhayan-purple-dark">Learning Center</h1>
        
        <div className="space-y-4">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start">
                  <div className="text-3xl mr-3">{course.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-base">{course.title}</h3>
                    <p className="text-sm text-dhayan-gray mb-2">{course.description}</p>
                    {course.progress > 0 ? (
                      <div className="space-y-1">
                        <Progress value={course.progress} className="h-2" />
                        <p className="text-xs text-dhayan-gray">{course.progress}% complete</p>
                      </div>
                    ) : (
                      <p className="text-xs text-dhayan-purple">Start Learning</p>
                    )}
                  </div>
                  <ChevronRight className="h-5 w-5 text-dhayan-gray mt-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="bg-dhayan-purple-light border-none">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="flex-1">
                <h3 className="font-semibold">Need Help?</h3>
                <p className="text-sm">Schedule a one-on-one digital literacy session</p>
              </div>
              <Book className="h-8 w-8 text-dhayan-purple" />
            </div>
          </CardContent>
        </Card>
      </div>
    </MobileLayout>
  );
};

export default Learn;
