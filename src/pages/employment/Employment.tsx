
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Building, Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";

const Employment = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { registerForActivity } = useAuth();
  
  React.useEffect(() => {
    if (location.state?.registered && location.state?.activityName) {
      toast({
        title: "Application Submitted",
        description: `You've applied for ${location.state.activityName}`,
      });
      
      navigate(location.pathname, { replace: true });
    }
  }, [location, toast, navigate]);
  
  const jobs = [
    {
      id: 1,
      title: "Community Advisor",
      company: "Silver Years Foundation",
      description: "Share your experience by mentoring youths in the community.",
      type: "Part-time",
      schedule: "10 hours per week",
      image: "https://images.unsplash.com/photo-1573497491765-dccce02b29df?q=80&w=300&auto=format&fit=crop",
      category: "Advisory",
    },
    {
      id: 2,
      title: "Online Customer Support",
      company: "Assist Connect",
      description: "Help customers solve issues from the comfort of your home.",
      type: "Flexible",
      schedule: "15-20 hours per week",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=300&auto=format&fit=crop",
      category: "Remote",
    },
    {
      id: 3,
      title: "Library Assistant",
      company: "City Public Library",
      description: "Help organize and recommend books to library visitors.",
      type: "Part-time",
      schedule: "Weekdays, 4 hours per day",
      image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=300&auto=format&fit=crop",
      category: "Community",
    },
  ];

  const handleJobApply = (job: any) => {
    registerForActivity(
      "job",
      job.title,
      "/employment"
    );
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold text-dhayan-purple-dark">Employment Opportunities</h1>
        <p className="text-sm text-dhayan-gray">Discover fulfilling post-retirement job opportunities</p>
        
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="overflow-hidden">
              <div className="relative h-32">
                <img 
                  src={job.image} 
                  alt={job.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-dhayan-purple text-white text-xs px-2 py-1 rounded-full">
                  {job.category}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                  <span className="bg-dhayan-purple/10 text-dhayan-purple text-xs px-2 py-1 rounded">
                    {job.type}
                  </span>
                </div>
                <p className="text-sm font-medium text-dhayan-purple-dark mb-1">
                  <Building className="h-3.5 w-3.5 inline mr-1" />
                  {job.company}
                </p>
                <p className="text-sm text-dhayan-gray">{job.description}</p>
                
                <div className="flex items-center mt-3 text-xs text-dhayan-gray-dark">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>{job.schedule}</span>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button 
                  className="w-full bg-dhayan-purple hover:bg-dhayan-purple-dark text-white"
                  onClick={() => handleJobApply(job)}
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Apply Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Employment;
