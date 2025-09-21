import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

// Enhanced loading skeleton for cards with better UX
export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <Card className={cn("animate-pulse", className)}>
    <CardHeader>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-32 w-full mb-4" />
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>
    </CardContent>
  </Card>
);

// Enhanced loading state for session lists
export const SessionListSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="space-y-6">
    {Array(count).fill(0).map((_, i) => (
      <Card key={i} className="overflow-hidden animate-pulse">
        <div className="flex">
          <div className="w-1/3 relative">
            <Skeleton className="h-48 w-full" />
            {/* Image loading shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
          <CardContent className="w-2/3 p-4">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-4 w-5/6 mb-3" />
            <div className="space-y-2 mb-4">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-3/5" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </div>
      </Card>
    ))}
  </div>
);

// Loading spinner with better accessibility
export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex items-center justify-center" role="status" aria-label="Loading">
      <div className={cn(
        "animate-spin rounded-full border-2 border-primary/20 border-t-primary",
        sizeClasses[size]
      )} />
      <span className="sr-only">Loading...</span>
    </div>
  );
};

// Page loading state
export const PageLoadingSkeleton: React.FC = () => (
  <div className="container mx-auto px-4 py-8 space-y-8">
    {/* Header skeleton */}
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
    </div>
    
    {/* Content skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6).fill(0).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  </div>
);

// Profile loading skeleton
export const ProfileSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Profile header */}
    <div className="flex items-center space-x-4">
      <Skeleton className="h-20 w-20 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
    </div>
    
    {/* Profile sections */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array(4).fill(0).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);