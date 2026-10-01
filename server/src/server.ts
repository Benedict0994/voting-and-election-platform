import app from "./app";
import { env } from "./config/env";
import { supabase } from "./lib/supabase";

async function startServer() {
  try {
    const { error } = await supabase.from("award_spaces").select("id").limit(1);
    if (error) throw error;

    console.log("Supabase connected");
    app.listen(env.PORT, () => console.log(`Server running on port ${env.PORT}`));
  } catch (error) {
    console.error("Server error:", error);
    process.exit(1);
  }
}

startServer();
