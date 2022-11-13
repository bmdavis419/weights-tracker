import { FBAuthProvider } from "@matterhorn-studios/react-fb-auth";
import { browserLocalPersistence } from "firebase/auth";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { auth, gProvider } from "./firebase";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <FBAuthProvider
      fb_auth={auth}
      g_provider={gProvider}
      persistence_type={browserLocalPersistence}
    >
      <App />
    </FBAuthProvider>
  </React.StrictMode>
);
