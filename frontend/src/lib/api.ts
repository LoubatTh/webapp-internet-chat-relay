export async function fetchApi<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  body?: T
): Promise<T> {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  const config: RequestInit = {
    method: method,
    headers: headers,
    body: body ? JSON.stringify(body) : null,
  };

  if (method === "GET") {
    delete config.body;
  }

  try {
    const response = await fetch(endpoint, config);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    throw new Error(`Network error: ${error}`);
  }
}
