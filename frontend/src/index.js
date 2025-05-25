import React from "react";
import * as ReactDOM from "react-dom/client";
import App from "./App";

import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";

import { BrowserRouter } from "react-router-dom"; // ✅ import this

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter> {/* ✅ wrap everything here */}
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </BrowserRouter>
);
