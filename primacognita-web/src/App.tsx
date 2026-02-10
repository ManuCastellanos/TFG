import { useEffect } from "react";
import { moodleWsClient } from "./modules/shared/moodleClientFactory"; // ajusta ruta/alias

export default function App() {
  useEffect(() => {
    moodleWsClient
      .call("core_webservice_get_site_info")
      .then((x) => console.log("SITE INFO:", x))
      .catch((e) => console.error("MOODLE ERROR FULL:", JSON.stringify(e, null, 2)));

  }, []);

  return <h1>Prima Cognita</h1>;
}
