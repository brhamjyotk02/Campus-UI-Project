import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CommunityProvider } from "./context/CommunityContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/global.css";
import "./styles/app.css";
import "./styles/theme.css";
import "./styles/community.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <CommunityProvider>
            <App />
          </CommunityProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
