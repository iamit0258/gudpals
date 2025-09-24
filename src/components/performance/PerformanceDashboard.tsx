import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Zap, 
  Monitor, 
  Wifi, 
  Database,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { usePerformanceMonitoring, useRealTimePerformance } from '@/hooks/usePerformanceMonitoring';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Button } from '@/components/ui/button';

const PerformanceDashboard: React.FC = () => {
  const { metrics, resources, isLoading, performanceScore, slowResources, largeResources, refresh } = usePerformanceMonitoring();
  const realTimeMetrics = useRealTimePerformance();
  const { track } = useAnalytics();

  useEffect(() => {
    track('performance_dashboard_viewed');
  }, [track]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return 'default';
    if (score >= 70) return 'secondary';
    return 'destructive';
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5 animate-spin" />
          <span>Analyzing performance...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Performance Score
            </span>
            <Button onClick={refresh} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(performanceScore)}`}>
              {performanceScore}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              <Badge variant={getScoreBadgeVariant(performanceScore)}>
                {performanceScore >= 90 ? 'Excellent' : 
                 performanceScore >= 70 ? 'Good' : 'Needs Improvement'}
              </Badge>
            </div>
            <Progress value={performanceScore} className="mt-4" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="metrics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          {metrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Page Load Time */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Page Load Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatTime(metrics.pageLoadTime)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {metrics.pageLoadTime < 3000 ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        Good
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="h-3 w-3" />
                        Slow
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* First Contentful Paint */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    First Contentful Paint
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatTime(metrics.firstContentfulPaint)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {metrics.firstContentfulPaint < 1500 ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        Good
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="h-3 w-3" />
                        Slow
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Memory Usage */}
              {metrics.memoryUsage && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Database className="h-4 w-4" />
                      Memory Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round(metrics.memoryUsage)} MB
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {metrics.memoryUsage < 50 ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          Optimal
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-yellow-600">
                          <AlertTriangle className="h-3 w-3" />
                          High
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Connection Type */}
              {metrics.connectionType && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Wifi className="h-4 w-4" />
                      Connection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold capitalize">
                      {metrics.connectionType}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Network speed
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* DOM Content Loaded */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    DOM Content Loaded
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatTime(metrics.domContentLoaded)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    DOM ready time
                  </div>
                </CardContent>
              </Card>

              {/* Time to Interactive */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Time to Interactive
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatTime(metrics.timeToInteractive)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {metrics.timeToInteractive < 3800 ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="h-3 w-3" />
                        Good
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600">
                        <AlertTriangle className="h-3 w-3" />
                        Slow
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Slow Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Slow Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                {slowResources.length > 0 ? (
                  <div className="space-y-2">
                    {slowResources.map((resource, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="truncate flex-1" title={resource.name}>
                          {resource.name.split('/').pop()}
                        </span>
                        <Badge variant="destructive" className="ml-2">
                          {formatTime(resource.duration)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No slow resources detected</p>
                )}
              </CardContent>
            </Card>

            {/* Large Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-yellow-500" />
                  Large Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                {largeResources.length > 0 ? (
                  <div className="space-y-2">
                    {largeResources.map((resource, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="truncate flex-1" title={resource.name}>
                          {resource.name.split('/').pop()}
                        </span>
                        <Badge variant="secondary" className="ml-2">
                          {formatBytes(resource.size)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No large resources detected</p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* FPS */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">FPS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{realTimeMetrics.fps}</div>
                <div className="text-xs text-muted-foreground">Frames per second</div>
              </CardContent>
            </Card>

            {/* Memory Usage */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Memory</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{realTimeMetrics.memoryUsage} MB</div>
                <div className="text-xs text-muted-foreground">Current usage</div>
              </CardContent>
            </Card>

            {/* DOM Nodes */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">DOM Nodes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{realTimeMetrics.domNodes.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total elements</div>
              </CardContent>
            </Card>

            {/* Network Requests */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{realTimeMetrics.networkRequests}</div>
                <div className="text-xs text-muted-foreground">Network calls</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceDashboard;