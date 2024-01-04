import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://sqaijbzefsdyjanqsnjm.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxYWlqYnplZnNkeWphbnFzbmptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIyMDA5MDAsImV4cCI6MjAxNzc3NjkwMH0.y9wZ8HtaBd2bcGyc-lAs3PRRIycvz9ln3I27IcdHGxM";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
