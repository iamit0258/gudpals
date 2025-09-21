
import React from "react";
import { SessionListSkeleton } from "@/components/ui/loading-states";

interface SessionSkeletonsProps {
  count?: number;
}

const SessionSkeletons: React.FC<SessionSkeletonsProps> = ({ count = 3 }) => {
  return <SessionListSkeleton count={count} />;
};

export default SessionSkeletons;
