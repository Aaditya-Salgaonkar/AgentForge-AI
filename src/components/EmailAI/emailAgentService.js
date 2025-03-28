import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchFineTuningData } from "../fetchAgentData";

class EmailAgentService {
  constructor(AGENT_ID, apikey, userName) {
    this.genAI = new GoogleGenerativeAI(apikey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  async generateResponse(prompt) {
    try {
      this.initializeName();
      const fineTuningData = await fetchFineTuningData(AGENT_ID);
      const systemPrompt = `
        You are an AI email assistant for ${userName}.
        ${
          fineTuningData
            ? `Use the following fine-tuning data to guide your responses:\n${fineTuningData}`
            : ""
        }
        
        Extract key details like:
        - Recipient name
        - Email subject
        - Purpose (e.g., request, apology, follow-up)
        - Action items (if any)
        - Deadline (if mentioned)

        Then, generate a well-structured email response in a professional tone. 
        Format the response as:
        Subject: [Subject Line]
        Email body: [Email Body]
        Only mention these things in your response and strictly adhere to the format.
      `;

      // Generate the response using the system prompt and user input
      const result = await this.model.generateContent(
        `${systemPrompt}\n\nUserInput: ${prompt}`
      );
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating response:", error);
      throw new Error("Failed to generate email response.");
    }
  }
}

export default EmailAgentService;
