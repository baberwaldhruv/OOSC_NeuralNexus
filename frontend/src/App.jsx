import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import RtiGeminiChat from "./components/chat/RtiGeminiChat";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Direct Gemini Workspace */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<RtiGeminiChat />} />
            <Route path="/:sessionId" element={<RtiGeminiChat />} />
            {/* Redirect any legacy /cases route directly to home */}
            <Route path="/cases" element={<Navigate to="/" replace />} />
            <Route path="/cases/:sessionId" element={<RtiGeminiChat />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}