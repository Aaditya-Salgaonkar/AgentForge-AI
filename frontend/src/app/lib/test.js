import { TwitterApi } from "twitter-api-v2";

const client = new TwitterApi({
  appKey: "ue1eDO6BFqlyxZoaFlAt032Gx",
  appSecret: "aL05tjMyvGmDSNwMcfY552DvjyFbOxLbmNknHyaFE3SnwBC2KV",
  accessToken: "1905211005640343552-p8gTHGmcY6DJvYA1BlwM83Uw6DYIG3",
  accessSecret: "kdGEFeBkFFkGvn0yETsx23AYkolC57O2C2qGC2vseIHz4",
});

async function sendTweet() {
  try {
    const tweet = await client.v2.tweet(
      "Hello Twitter from Node.js! second 🚀"
    );
    console.log("✅ Tweet Sent:", tweet);
  } catch (error) {
    console.error("❌ Failed to Send Tweet:", error);
  }
}

sendTweet();
