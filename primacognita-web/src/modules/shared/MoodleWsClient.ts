export class MoodleWsClient {
  private readonly serverPhpUrl: string;
  private readonly token: string;

  constructor(serverPhpUrl: string, token: string) {
    this.serverPhpUrl = serverPhpUrl;
    this.token = token;
  }

  async call<T>(wsfunction: string, params: Record<string, any> = {}): Promise<T> {
    const body = new URLSearchParams();
    body.set("wstoken", this.token);
    body.set("wsfunction", wsfunction);
    body.set("moodlewsrestformat", "json");

    for (const [k, v] of Object.entries(params)) body.set(k, String(v));

    const res = await fetch(this.serverPhpUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    const json = await res.json();
    if (json?.exception || json?.errorcode) throw json;
    return json as T;
  }
}
