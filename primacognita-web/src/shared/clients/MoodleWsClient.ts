type MoodleWsError = {
  exception?: string;
  errorcode?: string;
  message?: string;
  debuginfo?: string;
};

function isMoodleWsError(x: unknown): x is MoodleWsError {
  return (
    typeof x === "object" &&
    x !== null &&
    ("exception" in x || "errorcode" in x)
  );
}

export class MoodleWsClient {
  private readonly serverPhpUrl: string;
  private readonly token: string;

  constructor(serverPhpUrl: string, token: string) {
    this.serverPhpUrl = serverPhpUrl;
    this.token = token;
  }

  async call<T>(
    wsfunction: string,
    params: Record<string, unknown> = {}
  ): Promise<T> {
    const body = new URLSearchParams();
    body.set("wstoken", this.token);
    body.set("wsfunction", wsfunction);
    body.set("moodlewsrestformat", "json");

    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null) continue;
      body.set(k, String(v));
    }

    const res = await fetch(this.serverPhpUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });

    // Manejo básico si no es 2xx (Moodle a veces devuelve JSON igual, pero esto ayuda)
    const data: unknown = await res.json();

    if (isMoodleWsError(data)) {
      // Lanza un Error “normal” (más cómodo de capturar/loguear)
      throw new Error(
        data.message ??
          data.errorcode ??
          data.exception ??
          "Moodle WS error"
      );
    }

    return data as T;
  }
}
