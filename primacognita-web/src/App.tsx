import { useState } from "react";
import Login from "./components/login/Login";
import TokenStorage from "./modules/login/infrastructure/TokenStorage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    TokenStorage.get() !== null
  );

  if (!isLoggedIn) {
    return (
      <Login
        baseUrl="http://localhost:8080"
        serviceShortName="dev_api"
        onLoggedIn={() => setIsLoggedIn(true)}
      />
    );
  }

  return <h1>LOGIN OK</h1>;
}
