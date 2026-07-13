export async function authFetch(url: string, options?: RequestInit) {
    const response = await fetch(url, options);
    
    if (response.status === 401) {
      window.location.href = "/auth";
      throw new Error("Session expired");
    }
    
    return response;
  }