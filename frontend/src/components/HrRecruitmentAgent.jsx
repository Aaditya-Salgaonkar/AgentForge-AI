"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, Clock, FileText, Send } from "lucide-react";
import HrRecruitmentService from "./hrRecruitmentService";
import { gapi } from "gapi-script";

// IMPORTANT: Move these to environment variables in production
const CLIENT_ID = "608829134548-k8skvvh5bo9cgh9savt95l28j47iqdi9.apps.googleusercontent.com";
const API_KEY = "AIzaSyDAsj4Ya-34WgI5qu9zZ-qrf0dNa-ZuueQ";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];
const SCOPES = "https://www.googleapis.com/auth/gmail.send";

const agent = new HrRecruitmentService("AIzaSyDouKGIdQVnVXJg7AFTH36mehk6n25RAfg");

// Define the TimelineStep component
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

const HrRecruitmentAgent = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [files, setFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("idle");
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);

  const steps = [
    {
      icon: Clock,
      title: "Uploading Resumes",
      description: "Processing the uploaded resumes...",
      key: "uploading",
    },
    {
      icon: FileText,
      title: "Evaluating Resumes",
      description: "Matching resumes with the job description...",
      key: "evaluating",
    },
    {
      icon: Send,
      title: "Sending Emails",
      description: "Sending interview emails to approved candidates...",
      key: "sending",
    },
    {
      icon: CheckCircle2,
      title: "Process Completed",
      description: "All steps completed successfully!",
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

  const handleSignIn = () => {
    const authInstance = gapi.auth2.getAuthInstance();
    authInstance.signIn().then(() => {
      setIsSignedIn(true);
      console.log("User signed in.");
    });
  };

  const handleSignOut = () => {
    const authInstance = gapi.auth2.getAuthInstance();
    authInstance.signOut().then(() => {
      setIsSignedIn(false);
      console.log("User signed out.");
    });
  };

  const handleFileUpload = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles(uploadedFiles);
  };

  const handleEvaluateResumes = async () => {
    try {
      setStatus("uploading");
      setActiveStep(0);
      setCompletedSteps([]);

      // Step 1: Upload resumes
      const resumeContents = await agent.extractResumeContents(files);
      setStatus("evaluating");
      setActiveStep(1);
      setCompletedSteps([0]);

      // Step 2: Evaluate resumes
      const evaluationResults = await agent.evaluateResumes(resumeContents, jobDescription, keywords);
      setResults(evaluationResults);

      setStatus("sending");
      setActiveStep(2);
      setCompletedSteps([0, 1]);

      // Step 3: Send emails to approved candidates
      for (const result of evaluationResults) {
        if (result.status === "Approved" && result.email) {
          await sendEmail(result.email, "Interview Scheduling for Your Application", `
            Dear Candidate,

            Congratulations! Based on your resume, we are pleased to inform you that you have been shortlisted for an interview.

            Please reply to this email to confirm your availability for the interview.

            Best regards,
            HR Team
          `);
          console.log("Email sent to approved candidates.");
        }
      }

      setStatus("completed");
      
      setActiveStep(3);
      setCompletedSteps([0, 1, 2]);
    } catch (err) {
      console.error("Error evaluating resumes:", err);
      setError("Failed to evaluate resumes.");
    }
  };

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
      console.log(`Email sent to ${recipient}`);
    } catch (err) {
      console.error(`Error sending email to ${recipient}:`, err);
      throw err;
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">HR Recruitment Agent</h1>

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
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Enter the job description..."
        className="w-full p-2 border rounded mb-4"
        rows={4}
      />

      <input
        type="text"
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        placeholder="Enter keywords (comma-separated)..."
        className="w-full p-2 border rounded mb-4"
      />

      <input
        type="file"
        multiple
        accept=".doc,.docx"
        onChange={handleFileUpload}
        className="w-full p-2 border rounded mb-4"
      />

      <button
        onClick={handleEvaluateResumes}
        disabled={files.length === 0 || !jobDescription}
        className={`w-full px-4 py-2 rounded ${
          files.length > 0 && jobDescription
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        Evaluate Resumes
      </button>

      {error && <div className="mt-4 p-2 bg-red-100 text-red-800 rounded">{error}</div>}

      {status !== "idle" && (
        <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-center">Recruitment Process</h2>
          <div className="relative pl-4 border-l-2 border-gray-200">
            {steps.map((step, index) => {
              const { key, ...props } = step;
              return (
                <TimelineStep
                  key={key}
                  {...props}
                  isActive={activeStep === index}
                  isCompleted={completedSteps.includes(index)}
                />
              );
            })}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow-md text-black">
          <h2 className="text-lg font-bold mb-2">Evaluation Results:</h2>
          <ul className="list-disc pl-5">
            {results.map((result, index) => (
              <li key={index} className="mb-2">
                <p><strong>Resume:</strong> {result.fileName}</p>
                <p><strong>Status:</strong> {result.status}</p>
                <p><strong>Email:</strong> {result.email || "Not Found"}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default HrRecruitmentAgent;