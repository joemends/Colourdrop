
/* Print Innovation — Supabase-powered frontend */
let supabaseClient = null;

async function initSupabase() {
  if (window.supabaseClient) return window.supabaseClient;
  if (!window.supabaseConfig || !window.supabaseConfig.url || !window.supabaseConfig.anonKey) {
    console.warn("Supabase is not configured yet. Add SUPABASE_URL and SUPABASE_ANON_KEY in Netlify.");
    return null;
  }
  if (!window.supabase) {
    console.error("Supabase SDK was not loaded.");
    return null;
  }
  supabaseClient = window.supabase.createClient(
    window.supabaseConfig.url,
    window.supabaseConfig.anonKey,
    { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
  );
  window.supabaseClient = supabaseClient;
  return supabaseClient;
}

function showNotice(message, type="success") {
  let el = document.querySelector("#site-notice");
  if (!el) {
    el = document.createElement("div");
    el.id = "site-notice";
    el.style.cssText = "position:fixed;right:20px;bottom:20px;z-index:9999;max-width:360px;padding:15px 18px;border-radius:14px;background:#0b0b0d;color:#fff;box-shadow:0 15px 45px rgba(0,0,0,.2);font-weight:600";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.style.borderLeft = `5px solid ${type === "error" ? "#e23b3b" : "#a51aa8"}`;
  clearTimeout(window.noticeTimer);
  window.noticeTimer = setTimeout(()=>el.remove(), 4500);
}

async function submitInquiry(form) {
  const client = await initSupabase();
  if (!client) {
    showNotice("Supabase is not configured yet.", "error");
    return;
  }
  const fd = new FormData(form);
  const payload = {
    name: fd.get("name")?.trim(),
    email: fd.get("email")?.trim(),
    phone: fd.get("phone")?.trim(),
    company: fd.get("company")?.trim() || null,
    service: fd.get("service") || null,
    quantity: fd.get("quantity") ? Number(fd.get("quantity")) : null,
    message: fd.get("message")?.trim()
  };
  const { error } = await client.from("inquiries").insert(payload);
  if (error) {
    console.error(error);
    showNotice("We could not submit your enquiry. Please try again.", "error");
    return;
  }
  form.reset();
  showNotice("Your enquiry has been sent successfully.");
}

async function signIn(email, password) {
  const client = await initSupabase();
  if (!client) return;
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  location.href = "admin.html";
}

async function signOut() {
  const client = await initSupabase();
  if (client) await client.auth.signOut();
  location.href = "sign-in.html";
}

async function protectAdmin() {
  const client = await initSupabase();
  if (!client) return null;
  const { data: { session } } = await client.auth.getSession();
  if (!session) {
    location.href = "sign-in.html";
    return null;
  }
  const email = document.querySelector("[data-user-email]");
  if (email) email.textContent = session.user.email || "";
  return session;
}

async function loadInquiries() {
  const client = await initSupabase();
  if (!client) return;
  const { data, error } = await client.from("inquiries").select("*").order("created_at", { ascending:false });
  const tbody = document.querySelector("#inquiries-body");
  if (!tbody) return;
  if (error) {
    tbody.innerHTML = `<tr><td colspan="6">Could not load enquiries.</td></tr>`;
    return;
  }
  tbody.innerHTML = data.map(row => `
    <tr>
      <td>${escapeHtml(row.name || "")}</td>
      <td>${escapeHtml(row.email || "")}</td>
      <td>${escapeHtml(row.phone || "")}</td>
      <td>${escapeHtml(row.service || "")}</td>
      <td>${escapeHtml(row.message || "")}</td>
      <td>${new Date(row.created_at).toLocaleString()}</td>
    </tr>
  `).join("") || `<tr><td colspan="6">No enquiries yet.</td></tr>`;
}

async function loadServices() {
  const client = await initSupabase();
  if (!client) return;
  const { data, error } = await client.from("services").select("*").eq("published", true).order("sort_order");
  const grid = document.querySelector("[data-services-grid]");
  if (!grid || error || !data?.length) return;
  grid.innerHTML = data.map((s,i)=>`
    <article class="service-card reveal visible">
      <div class="service-img">${s.image_url ? `<img src="${escapeAttr(s.image_url)}" alt="${escapeAttr(s.title)}">` : ""}</div>
      <div class="service-body">
        <div><div class="service-no">${String(i+1).padStart(2,"0")} — ${escapeHtml(s.category || "Service")}</div>
        <h3 style="margin-top:12px">${escapeHtml(s.title)}</h3>
        <p style="margin-top:16px">${escapeHtml(s.description || "")}</p></div>
        <div class="tags">${(s.tags || []).map(t=>`<span>${escapeHtml(t)}</span>`).join("")}</div>
      </div>
    </article>`).join("");
}

async function uploadImage(file, bucket="site-images") {
  const client = await initSupabase();
  if (!client) throw new Error("Supabase is not configured");
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]/g,"-");
  const path = `${Date.now()}-${safeName}`;
  const { error } = await client.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type
  });
  if (error) throw error;
  const { data } = client.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
function escapeAttr(value) { return escapeHtml(value); }

document.addEventListener("DOMContentLoaded", async () => {
  const menu = document.querySelector(".menu");
  const navLinks = document.querySelector(".nav-links");
  if(menu) {
    menu.addEventListener("click",()=>navLinks?.classList.toggle("open"));
    navLinks?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>navLinks.classList.remove("open")));
  }

  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{ if(entry.isIntersecting) entry.target.classList.add("visible"); });
  },{threshold:.12});
  document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));

  document.querySelectorAll("[data-map]").forEach(card=>{
    card.addEventListener("click",()=>{
      document.querySelectorAll("[data-map]").forEach(x=>x.classList.remove("selected"));
      card.classList.add("selected");
      const iframe=document.querySelector("#location-map");
      if(iframe) iframe.src=card.dataset.map;
    });
  });

  document.querySelectorAll("form[data-inquiry-form]").forEach(form=>{
    form.addEventListener("submit",async e=>{
      e.preventDefault();
      const button=form.querySelector("button[type=submit]");
      const old=button?.textContent;
      if(button){button.disabled=true;button.textContent="Sending…";}
      try { await submitInquiry(form); }
      finally { if(button){button.disabled=false;button.textContent=old;}}
    });
  });

  document.querySelectorAll("form[data-demo]").forEach(form=>{
    form.addEventListener("submit",e=>{
      e.preventDefault();
      showNotice("This form is ready to connect to your backend.");
    });
  });

  const year=document.querySelector("[data-year]");
  if(year) year.textContent=new Date().getFullYear();

  if (document.body.dataset.admin === "true") {
    const session = await protectAdmin();
    if (session) {
      await loadInquiries();
    }
  }
  await initSupabase();
  await loadServices();
});
