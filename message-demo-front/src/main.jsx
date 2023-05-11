import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { SocketProvider } from "./components/SocketProvider.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <SocketProvider>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </SocketProvider>
);
