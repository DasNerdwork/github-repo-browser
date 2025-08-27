import { ApolloProvider } from "@apollo/client";
import client from "./apollo/client";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // <-- neu
import Root from "./Root"; // <-- Root enthält alle Routes
import "./index.css";
import "./i18n";

// Set up Apollo client and insert React app into DOM
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Root />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>
);