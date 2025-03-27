"use client";
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GeminiChat = ({ onLocationFound }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

  const extractLocation = async (userInput) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `
      Analyze this text and extract location information: "${userInput}".
      
      Respond ONLY with JSON in this exact format:
      {
        "location": "extracted location name or address",
        "confidence": "high/medium/low",
        "type": "city/landmark/address/coordinates"
      }
      
      If no location is found, return:
      {
        "error": "No location found"
      }`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      // Clean the response (Gemini sometimes adds markdown backticks)
      const cleanText = text.replace(/```json|```/g, "");
      return JSON.parse(cleanText);
    } catch (error) {
      console.error("Error extracting location:", error);
      return { error: "Location extraction failed" };
    }
  };

  const geocodeLocation = async (locationName) => {
    try {
      const response = await fetch(
        `/api/geocode?address=${encodeURIComponent(locationName)}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Step 1: Extract location from user input
      const locationData = await extractLocation(input);

      if (locationData.error) {
        setMessages((prev) => [
          ...prev,
          {
            text: "I couldn't find a location in your message. Try something like 'Show me Paris' or 'Where is the Eiffel Tower?'",
            sender: "bot",
          },
        ]);
        return;
      }

      // Step 2: Geocode the location to get coordinates
      const geoData = await geocodeLocation(locationData.location);

      if (!geoData || geoData.error) {
        setMessages((prev) => [
          ...prev,
          {
            text: `I found "${locationData.location}" but couldn't locate it on the map.`,
            sender: "bot",
          },
        ]);
        return;
      }

      // Step 3: Update state with location
      const coordinates = {
        lat: geoData.lat,
        lng: geoData.lng,
      };

      setMessages((prev) => [
        ...prev,
        {
          text: `Showing ${locationData.location} on the map`,
          sender: "bot",
        },
      ]);

      onLocationFound(coordinates);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          text: "Something went wrong. Please try again.",
          sender: "bot",
        },
      ]);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && <div className="message bot">Locating...</div>}
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a location (e.g., 'Show me Paris')"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Searching..." : "Find"}
        </button>
      </form>
    </div>
  );
};

export default GeminiChat;
