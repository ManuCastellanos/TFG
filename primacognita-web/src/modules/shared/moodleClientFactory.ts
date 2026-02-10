import { env } from "./env";
import { MoodleWsClient } from "./MoodleWsClient";

export const moodleWsClient = new MoodleWsClient(env.moodleWsUrl, env.moodleToken);
