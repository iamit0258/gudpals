import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  autoFetch?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  showToast?: boolean;
}

export const useApi = <T = any>(
  apiFunction: () => Promise<T>,
  options: UseApiOptions = {}
) => {
  const { autoFetch = false, onSuccess, onError, showToast = false } = options;
  const { toast } = useToast();
  
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await apiFunction();
      setState(prev => ({ ...prev, data: result, loading: false }));
      
      onSuccess?.(result);
      
      if (showToast) {
        toast({
          title: "Success",
          description: "Operation completed successfully",
        });
      }
      
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Something went wrong';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      
      onError?.(errorMessage);
      
      if (showToast) {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      throw err;
    }
  }, [apiFunction, onSuccess, onError, showToast, toast]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  useEffect(() => {
    if (autoFetch) {
      execute();
    }
  }, [autoFetch, execute]);

  return {
    ...state,
    execute,
    reset,
    refetch: execute
  };
};

// Specialized hook for mutations with optimistic updates
export const useMutation = <T = any, U = any>(
  mutationFunction: (variables: U) => Promise<T>,
  options: UseApiOptions = {}
) => {
  const { onSuccess, onError, showToast = true } = options;
  const { toast } = useToast();
  
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const mutate = useCallback(async (variables: U) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await mutationFunction(variables);
      setState(prev => ({ ...prev, data: result, loading: false }));
      
      onSuccess?.(result);
      
      if (showToast) {
        toast({
          title: "Success",
          description: "Changes saved successfully",
        });
      }
      
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to save changes';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      
      onError?.(errorMessage);
      
      if (showToast) {
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
      
      throw err;
    }
  }, [mutationFunction, onSuccess, onError, showToast, toast]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    mutate,
    reset
  };
};