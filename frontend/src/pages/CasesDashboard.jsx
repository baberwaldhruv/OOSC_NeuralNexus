import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { rtiService } from "../services/apiServices";
import { useAuth } from "../Context/AuthContext";

export default function CasesDashboard() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const res = await rtiService.listCases();
      setCases(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load cases");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCase = async () => {
    try {
      setCreating(true);
      const res = await rtiService.createCase();
      const newSessionId = res.data?.session_id;
      if (newSessionId) {
        navigate(`/cases/${newSessionId}`);
      }
    } catch (err) {
      setError(err.message || "Failed to start a new RTI case");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">RTI Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, {user?.name}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleCreateCase}
              disabled={creating}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {creating ? "Creating..." : "+ New RTI Draft"}
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Case List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-700">Your Cases</h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading cases...</div>
          ) : cases.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No RTI cases found. Click <strong>+ New RTI Draft</strong> to start.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {cases.map((c) => (
                <div
                  key={c.id}
                  onClick={() => navigate(`/cases/${c.session_id}`)}
                  className="p-5 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="space-y-1">
                    <h3 className="font-semibold text-gray-800">
                      {c.issue || "Untitled Case (In Progress)"}
                    </h3>
                    <div className="text-xs text-gray-500 flex gap-3">
                      <span>Location: {c.district || c.state || "Not specified"}</span>
                      <span>•</span>
                      <span>Created: {new Date(c.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        c.ready_to_draft
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {c.ready_to_draft ? "Ready to Draft" : "Gathering Info"}
                    </span>
                    <span className="text-gray-400 font-bold">→</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}