import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mbzjjnszzzwbyngcdqyk.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iempqbnN6enp3YnluZ2NkcXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI5Njk3NjEsImV4cCI6MjA1ODU0NTc2MX0.BCwHIqvr6k0xDRrzcuNC6jr1G7q1m9QhnLzEl6KEY1k";

export const supabase = createClient(supabaseUrl, supabaseKey);
