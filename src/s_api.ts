import { ApiClient } from "donau/src/api_client";

class APIService {
  private _api = new ApiClient({
    port: import.meta.env.VITE_API_PORT ?? null,
  });

  getHello(name: string): Promise<string> {
    return this._api.get("/hello", { query: { name } });
  }
}

export const apiService = new APIService();
