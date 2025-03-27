# **AgentForge-AI: AI Agent Creation & Monetization Platform** 🚀  

## **1️⃣ Team Name**  
**Team INITIATORS**  

---

## **2️⃣ Team Members & Contact Info**  

| Name               | Role                         | Email                        | Contact No.    |
|--------------------|----------------------------|------------------------------|---------------|
| **Aaditya Salgaonkar** | Team Lead | aadityasalgaonkar@gmail.com | 📞 9834696195 |
| **Adarsh Naik**     | AI agents lead| adarshnayak108@gmail.com     | 📞 7020515434 |
| **Areen Dessai**    | Frontend lead  | areendessai6161@gmail.com    | 📞 9322578406 |

---

## **3️⃣ Individual Contributions**  

- **Aaditya Salgaonkar**  
  🔹 Designed and implemented the **db architecture** using **Supabase**  
  🔹 Integrated **AI models (GPT, Gemini)** for dynamic AI agent responses  
  🔹 Developed **API routes** for payment configuration
  🔹 Integrated payment gateways ie **Stripe**  

- **Adarsh Naik**  
  🔹 Designed the **AI agents**   
  🔹 Created a **Templatised user friendly ai agent builder**  
  🔹 Worked with google cloud to set up scopes and Oauth  

- **Areen Dessai**  
  🔹 Designed and implemented the **database schema** using **Supabase**  
  🔹 Integrated the **code modules** and led the **UI UX design** 
  🔹 Developed the **AI agent marketplace & transaction system UI**  

---

## **4️⃣ Folder Structure**  

```
AGENTFORGE-AI/
│── .next/                  # Next.js build files
│── node_modules/           # Dependencies
│── public/                 # Static assets
│── src/
│   ├── app/
│   │   ├── agentbuilder/   # AI agent creation page
│   │   ├── api/checkout/   # Stripe payment API
│   │   ├── home/           # Landing page
│   │   ├── login/          # Authentication page
│   │   ├── marketplace/    # AI agent marketplace
│   │   ├── myagents/       # User-created AI agents
│   │   ├── signup/         # Signup page
│   │   ├── success/        # Payment success page
│   ├── components/         # UI components
│   ├── lib/                # Supabase client & utility functions
│── .env                    # Environment variables
│── next.config.mjs         # Next.js config
│── package.json            # Dependencies
```

---

## **5️⃣ Approach to Solve the Problem**  

### **🚨 Problem Statement:**  
Non-technical users struggle to build and monetize AI agents efficiently. Existing tools require coding knowledge, limiting accessibility.

### **✅ Our Solution: AgentForge-AI**  
We built a **no-code/low-code AI agent creation platform** that allows users to:  
- **Easily create AI agents** via a drag-and-drop interface  under development still!
- **Customize & fine-tune AI models** without writing code  under development still!
- **Integrate APIs & tools** (Google Calender for now)  under development still!
- **Monetize AI agents** via subscriptions, and a marketplace  under development still!

Our **Next.js + Supabase** approach ensures a **scalable, secure, and real-time AI agent creation experience.**  

---

## **6️⃣ Tech Stack**  

✅ **Frontend:** Next.js (App Router, Server Actions)  
✅ **Backend:** Supabase (Auth, Database, Edge Functions)  
✅ **AI Models:** Google Gemini
✅ **Payments:** Stripe (Subscriptions, Pay-per-use)  
✅ **Storage:** Supabase Storage (For AI agent configurations & files)  

---

## **7️⃣ Build & Run Commands**  

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/your-repo/agentforge-ai.git
cd agentforge-ai
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Configure Environment Variables**
Create a `.env.local` file and add:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
NEXT_PUBLIC_STRIPE_KEY=your-stripe-key
```

### **4️⃣ Run the Development Server**
```sh
npm run dev
```

🔹 The app will be live at **http://localhost:3000** 🎉  

---
**🚀 Built with ❤️ by Team INITIATORS**
