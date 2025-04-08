
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface SessionSkeletonsProps {
  count?: number;
}

const SessionSkeletons: React.FC<SessionSkeletonsProps> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array(count).fill(0).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="flex">
            <div className="w-1/3">
              <Skeleton className="h-full w-full" />
            </div>
            <CardContent className="w-2/3 p-3">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-5 w-full mb-1" />
              <Skeleton className="h-4 w-3/4 mb-3" />
              <Skeleton className="h-4 w-5/6 mb-4" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default SessionSkeletons;
