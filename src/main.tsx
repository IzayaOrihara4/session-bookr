import * as Sentry from "@sentry/react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || "https://examplePublicKey@o0.ingest.sentry.io/0",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, 
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  // Environment marking
  environment: import.meta.env.MODE,
});

createRoot(document.getElementById("root")!).render(
  <Sentry.ErrorBoundary 
    fallback={
      <div className="flex flex-col items-center justify-center min-h-screen bg-ivory p-4 text-center">
        <h1 className="text-2xl font-bold text-espresso mb-4">Something went wrong</h1>
        <p className="text-espresso/70 mb-8">An error has occurred. Our team has been notified and we're looking into it.</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-semibold"
        >
          Reload Page
        </button>
      </div>
    } 
    showDialog
  >
    <AuthProvider>
      <App />
    </AuthProvider>
  </Sentry.ErrorBoundary>
);

