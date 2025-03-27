"use client";
import React, { useState, useEffect } from "react";
import EmailAgentService from "./emailAgentService";
import { gapi } from "gapi-script";
import { CheckCircle2, Clock, Mail, Send } from "lucide-react";

// IMPORTANT: Move these to environment variables in production
const CLIENT_ID = "608829134548-k8skvvh5bo9cgh9savt95l28j47iqdi9.apps.googleusercontent.com";
const API_KEY = "AIzaSyDAsj4Ya-34WgI5qu9zZ-qrf0dNa-ZuueQ";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];
const SCOPES = "https://www.googleapis.com/auth/gmail.send";

const agent = new EmailAgentService("AIzaSyDouKGIdQVnVXJg7AFTH36mehk6n25RAfg");

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
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle");
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const steps = [
    {
      icon: Clock,
      title: "Analyzing Prompt",
      description: "Processing your input to generate an email...",
      key: "analyzing",
    },
    {
      icon: Mail,
      title: "Generating Email",
      description: "Creating a professional email response...",
      key: "generating",
    },
    {
      icon: Send,
      title: "Sending Email",
      description: "Sending the email to the recipient...",
      key: "sending",
    },
    {
      icon: CheckCircle2,
      title: "Email Sent",
      description: "Your email has been successfully sent!",
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

  // Handle email generation and sending
  const handleGenerateAndSend = async () => {
    try {
      setStatus("analyzing");
      setActiveStep(0);
      setCompletedSteps([]);

      const generatedResponse = await agent.generateResponse(input);
      setResponse(generatedResponse);

      setStatus("generating");
      setActiveStep(1);
      setCompletedSteps([0]);

      // Extract subject and body from the generated response
      const subjectMatch = generatedResponse.match(/Subject:\s*(.+)/i);
      const bodyMatch = generatedResponse.match(/Email body:\s*([\s\S]+)/i);
      const subject = subjectMatch ? subjectMatch[1].trim() : "No Subject";
      const body = bodyMatch ? bodyMatch[1].trim() : "No Email Body";

      setStatus("sending");
      setActiveStep(2);
      setCompletedSteps([0, 1]);

      // Send the email using Gmail API
      await sendEmail("adarshnayak108@gmail.com", subject, body);

      setStatus("completed");
      setActiveStep(3);
      setCompletedSteps([0, 1, 2]);

      alert("Email sent successfully!");
    } catch (err) {
      console.error("Error generating or sending email:", err);
      setError("Failed to generate or send email.");
    }
  };

  // Function to send email using Gmail API
  const sendEmail = async (recipient, subject, body) => {
    const email = [`To: ${recipient}`, `Subject: ${subject}`, "", body].join("\n");

    const encodedMessage = btoa(email)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    try {
      await gapi.client.gmail.users.messages.send({
        userId: "me",
        resource: {
          raw: encodedMessage,
        },
      });
    } catch (err) {
      console.error("Error sending email via Gmail API:", err);
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

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your email prompt..."
        className="w-full p-2 border rounded mb-4"
        rows={4}
      />

      <button
        onClick={handleGenerateAndSend}
        disabled={!isSignedIn || !input}
        className={`w-full px-4 py-2 rounded ${
          isSignedIn && input
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        Generate and Send Email
      </button>

      {error && <div className="mt-4 p-2 bg-red-100 text-red-800 rounded">{error}</div>}

      {status !== "idle" && (
        <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-center">Email Sending Process</h2>
          <div className="relative pl-4 border-l-2 border-gray-200">
            {steps.map((step, index) => (
              <TimelineStep
                key={step.key}
                {...step}
                isActive={activeStep === index}
                isCompleted={completedSteps.includes(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailAgent;