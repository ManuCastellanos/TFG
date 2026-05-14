import { env } from "@/shared/utils/env";
import type { MoodleWsError } from "./moodle-errors";
import type IMoodleClient from "./IMoodleClient";

const isMoodleWsError = (value: unknown): value is MoodleWsError => {
  if (typeof value !== "object" || value === null) return false;
  return "error" in value;
};

const isMoodleWsException = (value: unknown): value is { exception: string; message: string; errorcode?: string } => {
  if (typeof value !== "object" || value === null) return false;
  return "exception" in value;
};

export default class MoodleClient implements IMoodleClient {
  async call<TResponse>( token: string, wsFunction: string, params: Record<string, string>,): Promise<TResponse> {
    const body = new URLSearchParams({
      wstoken: token,
      wsfunction: wsFunction,
      moodlewsrestformat: "json",
      ...params,
    });

    const res = await fetch(`${env.baseUrl}/webservice/rest/server.php`, {
      method: "POST",
      body,
    });

    const json = (await res.json()) as unknown;

    if (isMoodleWsError(json)) {
      const code = json.errorcode ? ` (${json.errorcode})` : "";
      console.warn('[MoodleClient] Error en', wsFunction, params, json);
      throw new Error(`${json.error}${code}`);
    }

    if (isMoodleWsException(json)) {
      const code = json.errorcode ? ` (${json.errorcode})` : "";
      console.warn('[MoodleClient] Excepción en', wsFunction, params, json);
      throw new Error(`${json.message}${code}`);
    }

    return json as TResponse;
  }
}