import { useState, useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
  memoryUsage?: number;
  connectionType?: string;
}

interface ResourceTiming {
  name: string;
  duration: number;
  size: number;
  type: string;
}

export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [resources, setResources] = useState<ResourceTiming[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const measurePerformance = useCallback(async () => {
    if (!('performance' in window)) {
      setIsLoading(false);
      return;
    }

    try {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      const metrics: PerformanceMetrics = {
        pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
        largestContentfulPaint: 0,
        cumulativeLayoutShift: 0,
        firstInputDelay: 0,
        timeToInteractive: navigation.domInteractive - navigation.fetchStart,
      };

      // Get memory info if available
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // MB
      }

      // Get connection info if available
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        metrics.connectionType = connection.effectiveType;
      }

      // Measure Web Vitals using PerformanceObserver
      if ('PerformanceObserver' in window) {
        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          metrics.largestContentfulPaint = lastEntry.startTime;
          setMetrics({ ...metrics });
        }).observe({ entryTypes: ['largest-contentful-paint'] });

        // Cumulative Layout Shift
        new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          metrics.cumulativeLayoutShift = clsValue;
          setMetrics({ ...metrics });
        }).observe({ entryTypes: ['layout-shift'] });

        // First Input Delay
        new PerformanceObserver((list) => {
          const firstEntry = list.getEntries()[0];
          metrics.firstInputDelay = (firstEntry as any).processingStart - firstEntry.startTime;
          setMetrics({ ...metrics });
        }).observe({ entryTypes: ['first-input'] });
      }

      // Get resource timings
      const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const resourceTimings: ResourceTiming[] = resourceEntries.map(entry => ({
        name: entry.name,
        duration: entry.duration,
        size: entry.transferSize || 0,
        type: entry.initiatorType,
      }));

      setMetrics(metrics);
      setResources(resourceTimings);
      setIsLoading(false);

    } catch (error) {
      console.error('Error measuring performance:', error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, [measurePerformance]);

  const getPerformanceScore = useCallback(() => {
    if (!metrics) return 0;

    let score = 100;

    // Deduct points for slow metrics
    if (metrics.pageLoadTime > 3000) score -= 20;
    if (metrics.firstContentfulPaint > 1500) score -= 15;
    if (metrics.largestContentfulPaint > 2500) score -= 15;
    if (metrics.cumulativeLayoutShift > 0.1) score -= 20;
    if (metrics.firstInputDelay > 100) score -= 15;
    if (metrics.timeToInteractive > 3800) score -= 15;

    return Math.max(0, score);
  }, [metrics]);

  const getSlowResources = useCallback(() => {
    return resources
      .filter(resource => resource.duration > 1000)
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10);
  }, [resources]);

  const getLargeResources = useCallback(() => {
    return resources
      .filter(resource => resource.size > 100000) // > 100KB
      .sort((a, b) => b.size - a.size)
      .slice(0, 10);
  }, [resources]);

  return {
    metrics,
    resources,
    isLoading,
    performanceScore: getPerformanceScore(),
    slowResources: getSlowResources(),
    largeResources: getLargeResources(),
    refresh: measurePerformance,
  };
};

// Hook for monitoring real-time performance
export const useRealTimePerformance = () => {
  const [currentMetrics, setCurrentMetrics] = useState({
    fps: 0,
    memoryUsage: 0,
    domNodes: 0,
    networkRequests: 0,
  });

  useEffect(() => {
    let animationId: number;
    let frameCount = 0;
    let lastTime = performance.now();

    const updateMetrics = (currentTime: number) => {
      frameCount++;
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        
        const metrics = {
          fps,
          memoryUsage: 'memory' in performance ? 
            Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) : 0,
          domNodes: document.querySelectorAll('*').length,
          networkRequests: performance.getEntriesByType('resource').length,
        };

        setCurrentMetrics(metrics);
        frameCount = 0;
        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(updateMetrics);
    };

    animationId = requestAnimationFrame(updateMetrics);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return currentMetrics;
};