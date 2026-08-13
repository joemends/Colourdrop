
const fs = require("fs");
const path = require("path");

const url = process.env.SUPABASE_URL || "";
const anonKey = process.env.SUPABASE_ANON_KEY || "";

if (!url || !anonKey) {
  console.warn("WARNING: SUPABASE_URL and/or SUPABASE_ANON_KEY are not set. The site will deploy but Supabase features will not work.");
}

const output = `window.supabaseConfig = ${JSON.stringify({url, anonKey}, null, 2)};\n`;
fs.writeFileSync(path.join(process.cwd(), "js", "supabase-config.js"), output);
console.log("Generated js/supabase-config.js");
