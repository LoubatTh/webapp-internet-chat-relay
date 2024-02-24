export async function fetchApi<T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  body?: T
): Promise<{ data: T; status: number }> {
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

  const response = await fetch(`/api/${endpoint}`, config);
  const data = await response.json();

  return { data, status: response.status };
}
