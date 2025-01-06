interface FetchApiParams {
  method?: string; // HTTP method (GET, POST, etc.)
  endpoint: string; // API endpoint URL
  body?: Record<string, string | number | boolean>; // Body for POST/PUT requests
  params?: Record<string, string | number | boolean>; // Query parameters for GET requests
  headers?: Record<string, string>; // Headers for the request
  onSuccess?: (data: unknown) => void; // Optional success callback
  onFail?: (error: unknown) => void; // Optional failure callback
}

interface FetchApiResponse {
  success: boolean; // Indicates if the request was successful
  statusCode?: number; // HTTP status code of the response
  data?: unknown; // Data returned from the API
  error?: unknown; // Error information if the request failed
}

const fetchApi = async ({
  method = "GET",
  endpoint,
  body = {},
  params = {},
  headers = {},
  onSuccess,
  onFail,
}: FetchApiParams): Promise<FetchApiResponse> => {
  try {
    // Set up headers as a Headers instance with any additional headers passed in
    const requestHeaders = new Headers(headers);

    // Configure options based on method type
    const options: RequestInit = {
      method,
      headers: requestHeaders,
      cache: "no-cache",
    };

    if (method === "GET" || method === "HEAD") {
      // For GET and HEAD requests, convert params to URLSearchParams
      const urlParams = new URLSearchParams(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      );
      endpoint += `?${urlParams.toString()}`;
    } else {
      // For POST and other methods, use FormData for the body
      const formData = new FormData();
      Object.entries(body).forEach(([key, value]) => {
        formData.append(key, String(value)); // Append each key-value pair to FormData
      });
      options.body = formData; // Set the FormData as the request body
      requestHeaders.delete("Content-Type"); // Remove Content-Type header so that the browser sets it correctly for FormData
    }

    const response = await fetch(endpoint, options);
    const statusCode = response.status; // Get the HTTP status code
    const contentType = response.headers.get("content-type");

    let responseData;
    if (contentType && contentType.includes("application/json")) {
      // Parse JSON response if content type is application/json
      responseData = await response.json();
    } else if (contentType && contentType.includes("text/html")) {
      // If the response is HTML, treat it as an error
      return {
        success: false,
        statusCode: 500,
        error: "Unexpected HTML response.",
      };
    } else if (
      contentType &&
      (contentType.includes("application/octet-stream") ||
        contentType.startsWith("image/") ||
        contentType.startsWith("audio/"))
    ) {
      // Allow binary file types (like images, audio, etc.)
      responseData = await response.blob();
    } else {
      // For any other response type, treat as a server error
      return {
        success: false,
        statusCode: 500,
        error: "Unexpected response format.",
      };
    }

    if (response.ok) {
      // Check if the response status is in the range 200-299
      if (onSuccess) onSuccess(responseData); // Call onSuccess if defined
      return { success: true, statusCode, data: responseData }; // Return data and status code
    } else {
      if (onFail) onFail(responseData); // Call onFail if defined
      return { success: false, statusCode, error: responseData }; // Return error and status code
    }
  } catch (error) {
    if (onFail) onFail(error); // Call onFail if defined
    return { success: false, error }; // Return error
  }
};

export default fetchApi;
