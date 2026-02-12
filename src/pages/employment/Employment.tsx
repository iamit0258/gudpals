import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import MobileLayout from "@/components/layout/MobileLayout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Building, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth";
import { supabase } from "@/integrations/supabase/client";

const Employment = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { registerForActivity } = useAuth();

  const [jobs, setJobs] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (location.state?.registered && location.state?.activityName) {
      toast({
        title: "Application Submitted",
        description: `You've applied for ${location.state.activityName}`,
      });

      navigate(location.pathname, { replace: true });
    }
  }, [location, toast, navigate]);

  React.useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data, error } = await supabase
          .from('employment_opportunities')
          .select('*')
          .eq('is_active', true);

        if (error) throw error;
        setJobs(data || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleJobApply = (job: any) => {
    navigate(`/employment/apply/${job.id}`);
  };

  return (
    <MobileLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold text-dhayan-purple-dark">Employment Opportunities</h1>
        <p className="text-sm text-dhayan-gray">Discover fulfilling post-retirement job opportunities</p>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-10 text-dhayan-gray">Loading opportunities...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-10 text-dhayan-gray">No openings available at the moment.</div>
          ) : (
            jobs.map((job) => (
              <Card key={job.id} className="overflow-hidden">
                <div className="relative h-32 bg-gray-100">
                  <img
                    src={job.image_url || "https://images.unsplash.com/photo-1573497491765-dccce02b29df?q=80&w=300&auto=format&fit=crop"}
                    alt={job.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-dhayan-purple text-white text-xs px-2 py-1 rounded-full">
                    {job.job_type || "Flexible"}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <span className="bg-dhayan-purple/10 text-dhayan-purple text-xs px-2 py-1 rounded">
                      {job.location || "Remote"}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-dhayan-purple-dark mb-1">
                    <Building className="h-3.5 w-3.5 inline mr-1" />
                    {job.company_name}
                  </p>
                  <p className="text-sm text-dhayan-gray line-clamp-2">{job.description}</p>

                  <div className="flex items-center mt-3 text-xs text-dhayan-gray-dark">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    <span>{job.salary_range || "Volunteer"}</span>
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
            )))}
        </div>
      </div>
    </MobileLayout>
  );
};

export default Employment;
