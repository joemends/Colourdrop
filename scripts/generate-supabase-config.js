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

window.supabaseConfig = {
  url: "https://nyjptohnkwucslrziiqs.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im55anB0b2hua3d1Y3NscnppaXFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MTY4ODQsImV4cCI6MjEwMjE5Mjg4NH0.cy1CYzixkfwOOdMkX7oriCesLzkZVMlF19rhyyzA2lE"
};
