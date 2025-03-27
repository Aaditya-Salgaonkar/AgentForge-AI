"use client";
import React, { useState, useEffect } from "react";
import { gapi } from "gapi-script";
import { CheckCircle2, Clock, Mail, List } from "lucide-react";
import EmailSummaryService from "./emailSummaryService";

// IMPORTANT: Move these to environment variables in production
const CLIENT_ID = "608829134548-k8skvvh5bo9cgh9savt95l28j47iqdi9.apps.googleusercontent.com";
const API_KEY = "AIzaSyDAsj4Ya-34WgI5qu9zZ-qrf0dNa-ZuueQ";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];
const SCOPES = "https://www.googleapis.com/auth/gmail.readonly";

const agent = new EmailSummaryService("AIzaSyDouKGIdQVnVXJg7AFTH36mehk6n25RAfg");

const TimelineStep = ({ icon: Icon, title, description, isActive, isCompleted }) => {
  return (
    <div className={`flex items-center mb-4 transition-all duration-500 ease-in-out ${isActive ? "opacity-100" : "opacity-50"}`}>
      <div className={`mr-4 ${isCompleted ? "text-green-500" : "text-gray-400"}`}>
        <Icon size={24} />
      </div>
      <div>
        <h3 className={`font-semibold ${isActive ? "text-black" : "text-gray-600"}`}>{title}</h3>
        {isActive && <p className="text-sm text-gray-500 animate-pulse">{description}</p>}
      </div>
    </div>
  );
};

const EmailAgent = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle");
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [summaries, setSummaries] = useState([]);

  const steps = [
    {
      icon: Clock,
      title: "Fetching Emails",
      description: "Retrieving the latest 5 emails from your inbox...",
      key: "fetching",
    },
    {
      icon: List,
      title: "Summarizing Emails",
      description: "Generating summaries for the retrieved emails...",
      key: "summarizing",
    },
    {
      icon: CheckCircle2,
      title: "Summaries Ready",
      description: "Your email summaries are ready!",
      key: "completed",
    },
  ];

  // Initialize Google API client on component mount
  useEffect(() => {
    const initGapiClient = () => {
      gapi.load("client:auth2", async () => {
        try {
          await gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES,
          });

          const authInstance = gapi.auth2.getAuthInstance();
          setIsSignedIn(authInstance.isSignedIn.get());

          // Listen for sign-in state changes
          authInstance.isSignedIn.listen((signedIn) => {
            setIsSignedIn(signedIn);
          });
        } catch (err) {
          console.error("Error initializing Google API client", err);
          setError("Failed to initialize Google API client");
        }
      });
    };

    if (window.gapi) {
      initGapiClient();
    } else {
      console.warn("Google API script not loaded. Make sure to include it.");
      setError("Google API script not loaded");
    }
  }, []);

  // Handle user sign-in
  const handleSignIn = () => {
    const authInstance = gapi.auth2.getAuthInstance();
    authInstance.signIn().then(() => {
      setIsSignedIn(true);
      console.log("User signed in.");
    });
  };

  // Handle user sign-out
  const handleSignOut = () => {
    const authInstance = gapi.auth2.getAuthInstance();
    authInstance.signOut().then(() => {
      setIsSignedIn(false);
      console.log("User signed out.");
    });
  };

  // Handle fetching and summarizing emails
  const handleFetchAndSummarize = async () => {
    try {
      setStatus("fetching");
      setActiveStep(0);
      setCompletedSteps([]);

      // Fetch the latest 5 emails
      const emails = await fetchEmails();
      setStatus("summarizing");
      setActiveStep(1);
      setCompletedSteps([0]);

      // Summarize the emails
      const emailSummaries = await agent.summarizeEmails(emails);
      setSummaries(emailSummaries);

      setStatus("completed");
      setActiveStep(2);
      setCompletedSteps([0, 1]);
    } catch (err) {
      console.error("Error fetching or summarizing emails:", err);
      setError("Failed to fetch or summarize emails.");
    }
  };

  // Function to fetch the latest 5 emails using Gmail API
  const fetchEmails = async () => {
    try {
      const response = await gapi.client.gmail.users.messages.list({
        userId: "me",
        maxResults: 5,
        q: "",
      });

      const messages = response.result.messages || [];
      const emailPromises = messages.map(async (message) => {
        const email = await gapi.client.gmail.users.messages.get({
          userId: "me",
          id: message.id,
        });
        return email.result;
      });

      return Promise.all(emailPromises);
    } catch (err) {
      console.error("Error fetching emails:", err);
      throw err;
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Email Agent</h1>

      {!isSignedIn ? (
        <button
          onClick={handleSignIn}
          className="w-full px-4 py-2 mb-4 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Sign in with Google
        </button>
      ) : (
        <button
          onClick={handleSignOut}
          className="w-full px-4 py-2 mb-4 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sign out
        </button>
      )}

      <button
        onClick={handleFetchAndSummarize}
        disabled={!isSignedIn}
        className={`w-full px-4 py-2 rounded ${
          isSignedIn
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        Fetch and Summarize Emails
      </button>

      {error && <div className="mt-4 p-2 bg-red-100 text-red-800 rounded">{error}</div>}

      {status !== "idle" && (
        <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-center">Email Summarization Process</h2>
          <div className="relative pl-4 border-l-2 border-gray-200">
            {steps.map((step, index) => {
              const { key, ...props } = step; // Destructure key separately
              return (
                <TimelineStep
                  key={key} // Pass key directly
                  {...props} // Spread the remaining props
                  isActive={activeStep === index}
                  isCompleted={completedSteps.includes(index)}
                />
              );
            })}
          </div>
        </div>
      )}

      {summaries.length > 0 && (
        <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-md text-black">
          <h2 className="text-lg font-bold mb-2">Email Summaries:</h2>
          <ul className="list-disc pl-5">
            {summaries.map((summary, index) => (
              <li key={index} className="mb-2">
                {summary}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmailAgent;