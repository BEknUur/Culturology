import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Router from "./router/Router";
import "./index.css";           

const queryClient = new QueryClient();
const CLERK_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

// Находим корневой элемент и проверяем его наличие
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element with id 'root' was not found in the document");
}

// Создаем корень с гарантированно не-null элементом
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ClerkProvider 
      publishableKey={CLERK_KEY} 
      afterSignInUrl="/"  // После входа направляем на главную
      afterSignUpUrl="/"  // После регистрации направляем на главную
      afterSignOutUrl="/" // После выхода направляем на главную (будет редирект на вход)
    >
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </QueryClientProvider>
    </ClerkProvider>
  </React.StrictMode>
);