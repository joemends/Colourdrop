const fs = require("fs");
const path = require("path");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase environment variables.");

  console.error(
    "SUPABASE_URL:",
    supabaseUrl ? "DEFINED" : "MISSING"
  );

  console.error(
    "SUPABASE_ANON_KEY:",
    supabaseAnonKey ? "DEFINED" : "MISSING"
  );

  process.exit(1);
}

const config = `window.supabaseConfig = {
  url: ${JSON.stringify(supabaseUrl)},
  anonKey: ${JSON.stringify(supabaseAnonKey)}
};`;

const outputPath = path.join(
  __dirname,
  "..",
  "supabase-config.js"
);

fs.writeFileSync(outputPath, config, "utf8");

console.log("✅ Supabase configuration generated successfully.");
console.log("URL: Defined");
console.log("KEY: Defined");
console.log(`Output: ${outputPath}`);
