import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Hardcoded Supabase keys
const SUPABASE_URL = "https://mbzjjnszzzwbyngcdqyk.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iempqbnN6enp3YnluZ2NkcXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5Njk3NjEsImV4cCI6MjA1ODU0NTc2MX0.BCwHIqvr6k0xDRrzcuNC6jr1G7q1m9QhnLzEl6KEY1k";

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const AgentBuilderForm = () => {
  const [agentName, setAgentName] = useState("");
  const [agentType, setAgentType] = useState("");
  const [price, setPrice] = useState("");
  const [additionalData, setAdditionalData] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState(null); // Store logged-in user's ID

  const agentTypes = ["HR Recruitment Agent", "Email Agent", "Event Extractor", "Custom Agent"];

  // Check for active session and fetch user details on component mount
  useEffect(() => {
    const fetchUser = async () => {
      // Check if a session exists
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        setError("No active session found. Please log in.");
        return;
      }

      // Fetch the authenticated user's details
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        setError("User not authenticated. Please log in.");
      } else if (data?.user) {
        setUserId(data.user.id);
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form
    if (!agentName) {
      setError("Please enter the name of the agent.");
      return;
    }
    if (!agentType) {
      setError("Please select an agent type.");
      return;
    }
    if (!price || isNaN(price) || price <= 0) {
      setError("Please enter a valid price.");
      return;
    }
    if (!userId) {
      setError("User not authenticated. Please log in.");
      return;
    }

    // Clear errors and success message
    setError(null);
    setSuccess(false);

    // Process the form data
    const formData = {
      name: agentName,
      agent_type: agentType,
      amount: parseFloat(price),
      finetuning_data: additionalData || null,
      user_id: userId, // Include the logged-in user's ID
    };

    console.log("Form submitted:", formData);

    // Submit data to Supabase
    try {
      const { data, error } = await supabase.from("agents").insert([formData]);

      if (error) {
        console.error("Error inserting data:", error);
        setError("Failed to create the agent. Please try again.");
        return;
      }

      console.log("Data inserted successfully:", data);
      setSuccess(true);
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg text-black">
      <h1 className="text-2xl font-bold mb-4 text-center text-black">Create Your Custom Agent</h1>
      <form onSubmit={handleSubmit}>
        {/* Agent Name Input */}
        <div className="mb-4">
          <label htmlFor="agentName" className="block text-sm font-medium text-gray-700">
            Agent Name
          </label>
          <input
            type="text"
            id="agentName"
            value={agentName}
            onChange={(e) => setAgentName(e.target.value)}
            placeholder="Enter the name of the agent"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Agent Type Dropdown */}
        <div className="mb-4">
          <label htmlFor="agentType" className="block text-sm font-medium text-gray-700">
            Select Agent Type
          </label>
          <select
            id="agentType"
            value={agentType}
            onChange={(e) => setAgentType(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- Select an Agent Type --</option>
            {agentTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Price Input */}
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price (in USD)
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter the price"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Additional Data Textarea */}
        <div className="mb-4">
          <label htmlFor="additionalData" className="block text-sm font-medium text-gray-700">
            Additional Data (Optional)
          </label>
          <textarea
            id="additionalData"
            value={additionalData}
            onChange={(e) => setAdditionalData(e.target.value)}
            placeholder="Enter any additional data to fine-tune the model"
            rows={4}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        {/* Error Message */}
        {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

        {/* Success Message */}
        {success && <div className="mb-4 text-green-500 text-sm">Agent created successfully!</div>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Agent
        </button>
      </form>
    </div>
  );
};

export default AgentBuilderForm;
