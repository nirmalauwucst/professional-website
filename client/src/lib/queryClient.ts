import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Get auth token from localStorage with debug logging
const getCMSAuthToken = (): string | null => {
  const token = localStorage.getItem('cms_auth_token');
  console.log(`[getCMSAuthToken] Token ${token ? 'found' : 'not found'} in localStorage`);
  if (token) {
    console.log(`[getCMSAuthToken] Token: ${token.substring(0, 15)}...`);
  }
  return token;
};

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  console.log(`[apiRequest] ${method} ${url}`);
  
  // Get the auth token
  const token = getCMSAuthToken();
  
  // Prepare headers
  const headers: Record<string, string> = {};
  
  // Add content type if we have data
  if (data && !(data instanceof FormData)) {
    headers["Content-Type"] = "application/json";
    console.log(`[apiRequest] Content-Type set to application/json`);
  }
  
  // Add auth token if available
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    console.log(`[apiRequest] Authorization header set with Bearer token`);
  } else {
    console.log(`[apiRequest] No Authorization header set (no token available)`);
  }
  
  console.log(`[apiRequest] Request headers:`, headers);
  
  const res = await fetch(url, {
    method,
    headers,
    body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined),
    credentials: "include",
  });

  console.log(`[apiRequest] Response status: ${res.status} ${res.statusText}`);
  
  try {
    await throwIfResNotOk(res);
    console.log(`[apiRequest] Request successful`);
    return res;
  } catch (error) {
    console.error(`[apiRequest] Request failed:`, error);
    throw error;
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey[0] as string;
    console.log(`[getQueryFn] Fetching: ${url}`);
    
    // Get the auth token
    const token = getCMSAuthToken();
    
    // Prepare headers with auth token if available
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      console.log(`[getQueryFn] Authorization header set for request to ${url}`);
    } else {
      console.log(`[getQueryFn] No Authorization header for request to ${url} (no token available)`);
    }
    
    console.log(`[getQueryFn] Headers for ${url}:`, headers);
    
    try {
      const res = await fetch(url, {
        headers,
        credentials: "include",
      });

      console.log(`[getQueryFn] Response from ${url}: ${res.status} ${res.statusText}`);
      
      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        console.log(`[getQueryFn] Returning null for 401 response (as configured)`);
        return null;
      }

      await throwIfResNotOk(res);
      const data = await res.json();
      console.log(`[getQueryFn] Successful response data from ${url}:`, data);
      return data;
    } catch (error) {
      console.error(`[getQueryFn] Error fetching ${url}:`, error);
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
