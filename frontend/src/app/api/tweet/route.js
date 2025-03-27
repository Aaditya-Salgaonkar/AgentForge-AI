// app/api/tweet/route.js
// import { TwitterApi } from "twitter-api-v2";

// export async function POST() {
//   const client = new TwitterApi({
//     appKey: process.env.TWITTER_API_KEY,
//     appSecret: process.env.TWITTER_API_SECRET,
//     accessToken: process.env.TWITTER_ACCESS_TOKEN,
//     accessSecret: process.env.TWITTER_ACCESS_SECRET,
//   });

//   try {
//     const tweet = await client.v2.tweet("Hello from Next.js API Route! 🚀");
//     return Response.json({ success: true, tweet });
//   } catch (error) {
//     return Response.json({ error: error.message }, { status: 500 });
//   }
// }
