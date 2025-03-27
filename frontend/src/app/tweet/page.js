// app/tweet/page.js
// "use client";
// import { useState } from "react";

// export default function TweetButton() {
//   const [status, setStatus] = useState("");

//   const sendTweet = async () => {
//     setStatus("Sending...");
//     const res = await fetch("/api/tweet", { method: "POST" });
//     const data = await res.json();
//     setStatus(data.success ? "Tweet sent!" : `Error: ${data.error}`);
//   };

//   return (
//     <div>
//       <button onClick={sendTweet}>Tweet</button>
//       <p>{status}</p>
//     </div>
//   );
// }
