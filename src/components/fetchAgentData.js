import supabase from "../../../supabase";

export const fetchFineTuningData = async (AGENT_ID) => {
  try {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError || !sessionData?.session) {
      console.error(
        "Error fetching session or no active session found:",
        sessionError?.message
      );
      return null;
    }

    const userId = sessionData.session.user.id;

    const { data, error } = await supabase
      .from("agents")
      .select("finetuning_data")
      .eq("id", AGENT_ID)
      .eq("user_id", userId)
      .maybeSingle(); // Allows 0 or 1 result

    if (error) {
      console.error("Error fetching finetuning_data:", error.message);
      return null;
    }

    if (!data) {
      console.warn(
        "No matching record found for the given AGENT_ID and user_id."
      );
      return null;
    }

    console.log("Fetched finetuning_data:", data.finetuning_data);
    return data.finetuning_data;
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
};
