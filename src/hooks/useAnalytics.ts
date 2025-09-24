import { useEffect, useCallback } from 'react';

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: number;
}

interface UserProperties {
  userId?: string;
  email?: string;
  name?: string;
  plan?: string;
  [key: string]: any;
}

class Analytics {
  private static instance: Analytics;
  private events: AnalyticsEvent[] = [];
  private userProperties: UserProperties = {};
  private isEnabled = true;

  private constructor() {
    // Private constructor for singleton
  }

  public static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  // Track an event
  track(event: string, properties?: Record<string, any>, userId?: string) {
    if (!this.isEnabled) return;

    const eventData: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      },
      userId: userId || this.userProperties.userId,
      timestamp: Date.now(),
    };

    this.events.push(eventData);
    
    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', eventData);
    }

    // Send to analytics service (implement your preferred service)
    this.sendEvent(eventData);
  }

  // Set user properties
  identify(userId: string, properties?: UserProperties) {
    this.userProperties = {
      ...this.userProperties,
      ...properties,
      userId,
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('👤 User Identified:', this.userProperties);
    }

    // Send to analytics service
    this.sendUserProperties();
  }

  // Track page views
  page(pageName?: string, properties?: Record<string, any>) {
    this.track('page_view', {
      page: pageName || document.title,
      path: window.location.pathname,
      ...properties,
    });
  }

  // Track errors
  error(error: Error, context?: Record<string, any>) {
    this.track('error', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      ...context,
    });
  }

  // Track performance metrics
  performance(metricName: string, value: number, properties?: Record<string, any>) {
    this.track('performance', {
      metric: metricName,
      value,
      ...properties,
    });
  }

  // Track user interactions
  interaction(element: string, action: string, properties?: Record<string, any>) {
    this.track('interaction', {
      element,
      action,
      ...properties,
    });
  }

  // Enable/disable analytics
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  // Get all events (for debugging)
  getEvents() {
    return this.events;
  }

  // Clear events
  clearEvents() {
    this.events = [];
  }

  // Private method to send event to analytics service
  private async sendEvent(event: AnalyticsEvent) {
    try {
      // Replace with your analytics service endpoint
      // await fetch('/api/analytics/track', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event),
      // });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  // Private method to send user properties
  private async sendUserProperties() {
    try {
      // Replace with your analytics service endpoint
      // await fetch('/api/analytics/identify', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(this.userProperties),
      // });
    } catch (error) {
      console.error('Failed to send user properties:', error);
    }
  }
}

// Hook for using analytics in React components
export const useAnalytics = () => {
  const analytics = Analytics.getInstance();

  // Track page view on mount
  useEffect(() => {
    analytics.page();
  }, [analytics]);

  // Track performance metrics
  useEffect(() => {
    const measurePerformance = () => {
      if ('performance' in window) {
        const navigation = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          analytics.performance('page_load_time', navigation.loadEventEnd - navigation.fetchStart);
          analytics.performance('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.fetchStart);
          analytics.performance('first_contentful_paint', navigation.loadEventStart - navigation.fetchStart);
        }
      }
    };

    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      window.addEventListener('load', measurePerformance);
      return () => window.removeEventListener('load', measurePerformance);
    }
  }, [analytics]);

  // Provide analytics methods
  const track = useCallback((event: string, properties?: Record<string, any>) => {
    analytics.track(event, properties);
  }, [analytics]);

  const identify = useCallback((userId: string, properties?: UserProperties) => {
    analytics.identify(userId, properties);
  }, [analytics]);

  const page = useCallback((pageName?: string, properties?: Record<string, any>) => {
    analytics.page(pageName, properties);
  }, [analytics]);

  const error = useCallback((error: Error, context?: Record<string, any>) => {
    analytics.error(error, context);
  }, [analytics]);

  const performance = useCallback((metricName: string, value: number, properties?: Record<string, any>) => {
    analytics.performance(metricName, value, properties);
  }, [analytics]);

  const interaction = useCallback((element: string, action: string, properties?: Record<string, any>) => {
    analytics.interaction(element, action, properties);
  }, [analytics]);

  return {
    track,
    identify,
    page,
    error,
    performance,
    interaction,
    setEnabled: analytics.setEnabled.bind(analytics),
    getEvents: analytics.getEvents.bind(analytics),
    clearEvents: analytics.clearEvents.bind(analytics),
  };
};

// Hook for tracking component interactions
export const useComponentAnalytics = (componentName: string) => {
  const { interaction } = useAnalytics();

  const trackClick = useCallback((elementName: string, properties?: Record<string, any>) => {
    interaction(`${componentName}.${elementName}`, 'click', properties);
  }, [componentName, interaction]);

  const trackView = useCallback((properties?: Record<string, any>) => {
    interaction(componentName, 'view', properties);
  }, [componentName, interaction]);

  const trackInteraction = useCallback((action: string, elementName?: string, properties?: Record<string, any>) => {
    interaction(`${componentName}${elementName ? `.${elementName}` : ''}`, action, properties);
  }, [componentName, interaction]);

  return {
    trackClick,
    trackView,
    trackInteraction,
  };
};

export default Analytics;