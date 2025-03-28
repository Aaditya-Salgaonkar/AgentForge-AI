"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase configuration
const SUPABASE_URL = "https://mbzjjnszzzwbyngcdqyk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iempqbnN6enp3YnluZ2NkcXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5Njk3NjEsImV4cCI6MjA1ODU0NTc2MX0.BCwHIqvr6k0xDRrzcuNC6jr1G7q1m9QhnLzEl6KEY1k";

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const UserModels = () => {
  const [models, setModels] = useState([]); // Store fetched models
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchModels = async () => {
      try {
        // Get the currently logged-in user's session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !sessionData?.session) {
          setError("No active session found. Please log in.");
          setLoading(false);
          return;
        }

        // Get the logged-in user's ID
        const userId = sessionData.session.user.id;

        // Fetch models from the agents table where userid matches the logged-in user's ID
        const { data, error } = await supabase
          .from("agents")
          .select("id, user_id, name, agent_type, finetuning_data")
          .eq("user_id", userId);

        if (error) {
          setError("Failed to fetch models. Please try again.");
          console.error("Error fetching models:", error);
        } else {
          setModels(data || []);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-500">Loading models...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center text-black">Your Models</h1>
      {models.length === 0 ? (
        <p className="text-center text-gray-500">No models found for your account.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 text-black">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Agent Type</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Fine Tuning Data</th>
            </tr>
          </thead>
          <tbody>
            {models.map((model) => (
              <tr key={model.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">{model.id}</td>
                <td className="border border-gray-300 px-4 py-2">{model.name}</td>
                <td className="border border-gray-300 px-4 py-2">{model.agent_type}</td>
                <td className="border border-gray-300 px-4 py-2">{model.finetuning_data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserModels;