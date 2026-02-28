require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenAI } = require('@google/genai');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const geminiKey = process.env.VITE_GEMINI_API_KEY;

if (!supabaseUrl || !supabaseKey || !geminiKey) {
  console.error("Missing environment variables. Check .env file.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const ai = new GoogleGenAI({ apiKey: geminiKey });

async function verifyConnections() {
  console.log("Verifying Supabase Connection...");
  try {
    // A simple query to test connection. This might fail if no tables exist, but the network request will succeed if auth is correct.
    const { data, error } = await supabase.from('users').select('*').limit(1);
    
    // We expect an error if the table doesn't exist, but NOT a 401 Unauthorized or network error.
    if (error && error.code === '42P01') {
      console.log("✅ Supabase Connected (Tables not yet created, which is expected)");
    } else if (error && error.code !== 'PGRST116') {
      console.error("❌ Supabase Error:", error.message);
    } else {
       console.log("✅ Supabase Connected");
    }
  } catch(e) {
    console.error("❌ Supabase Connection Failed:", e.message);
  }

  console.log("\nVerifying Gemini API Connection...");
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Respond with exactly one word: "OK"',
    });
    console.log(`✅ Gemini Connected (Response: ${response.text.trim()})`);
  } catch (e) {
    console.error("❌ Gemini Connection Failed:", e.message);
  }
}

verifyConnections();
