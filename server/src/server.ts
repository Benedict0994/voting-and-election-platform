import app from "./app";
import { env } from "./config/env";
import { supabase } from "./lib/supabase";

function validateProductionEnvironment(){
  if(env.NODE_ENV!=="production")return;
  const failures:string[]=[];
  if(!env.SUPABASE_URL)failures.push("SUPABASE_URL");
  if(!env.SUPABASE_SERVICE_ROLE_KEY)failures.push("SUPABASE_SERVICE_ROLE_KEY");
  if(!env.JWT_SECRET||env.JWT_SECRET.length<32)failures.push("JWT_SECRET (minimum 32 characters)");
  if(!process.env.VOTER_AUTH_SECRET||process.env.VOTER_AUTH_SECRET.length<32)failures.push("VOTER_AUTH_SECRET (minimum 32 characters)");
  if(!env.CLIENT_URL||env.CLIENT_URL.includes("localhost"))failures.push("CLIENT_URL (production URL required)");
  if(!env.ELECTION_MONITOR_SECRET||env.ELECTION_MONITOR_SECRET.length<32)failures.push("ELECTION_MONITOR_SECRET (minimum 32 characters)");
  if(failures.length)throw new Error("Production environment is not launch-ready: "+failures.join(", "));
}

async function startServer() {
  try {
    validateProductionEnvironment();
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
