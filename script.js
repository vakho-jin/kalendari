"use strict";

/* ─── Holiday keys (inline set for file:// compatibility) ────────── */
const HOLIDAY_KEYS = new Set(["01-01","01-02","01-03","01-04","01-05","01-06","01-07","01-08","01-09","01-10","01-11","01-12","01-13","01-14","01-15","01-16","01-17","01-18","01-19","01-20","01-21","01-22","01-23","01-24","01-25","01-26","01-27","01-28","01-29","01-30","01-31","02-01","02-02","02-03","02-04","02-05","02-06","02-07","02-08","02-09","02-10","02-11","02-12","02-13","02-14","02-15","02-16","02-17","02-18","02-19","02-20","02-21","02-22","02-23","02-24","02-25","02-26","02-27","02-28","02-29","03-01","03-03","03-08","03-14","03-17","03-19","03-20","03-21","03-22","03-23","03-25","03-27","04-01","04-02","04-07","04-11","04-12","04-18","04-22","04-23","04-26","05-01","05-03","05-07","05-08","05-09","05-15","05-17","05-18","05-19","05-22","05-24","05-27","05-31","06-01","06-05","06-06","06-08","06-12","06-14","06-17","06-20","06-21","06-22","06-23","06-26","07-04","07-07","07-08","07-11","07-14","07-30","08-02","08-09","08-12","08-14","08-19","08-22","08-27","08-28","09-01","09-08","09-15","09-16","09-21","09-22","09-26","09-27","10-01","10-02","10-04","10-05","10-09","10-10","10-14","10-16","10-17","10-24","10-27","10-30","10-31","11-01","11-04","11-10","11-11","11-14","11-16","11-18","11-20","11-25","12-01","12-03","12-05","12-09","12-10","12-12","12-18","12-19","12-22","12-24","12-25","12-31"]);

/* ─── Locale ─────────────────────────────────────────────────────── */
const MONTHS_GEN = ["იანვარი","თებერვალი","მარტი","აპრილი","მაისი","ივნისი",
                    "ივლისი","აგვისტო","სექტემბერი","ოქტომბერი","ნოემბერი","დეკემბერი"];
const MONTHS_NOM = ["იანვარი","თებერვალი","მარტი","აპრილი","მაისი","ივნისი",
                    "ივლისი","აგვისტო","სექტემბერი","ოქტომბერი","ნოემბერი","დეკემბერი"];
const WEEKDAYS   = ["კვირა","ორშაბათი","სამშაბათი","ოთხშაბათი",
                    "ხუთშაბათი","პარასკევი","შაბათი"];

/* ─── State ──────────────────────────────────────────────────────── */
let current = new Date();
current.setHours(0, 0, 0, 0);
const today = new Date(current);

let mcYear  = current.getFullYear();
let mcMonth = current.getMonth();

/* ─── DOM refs ───────────────────────────────────────────────────── */
const card    = document.getElementById("day-card");
const elDay   = document.getElementById("day-num");
const elMY    = document.getElementById("month-yr");
const elWD    = document.getElementById("weekday");
const elList  = document.getElementById("holidays");
const mcGrid  = document.getElementById("mc-grid");
const mcTitle = document.getElementById("mc-title");

/* ─── Helpers ────────────────────────────────────────────────────── */
const pad     = n  => String(n).padStart(2, "0");
const dateKey = d  => `${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const delay   = ms => new Promise(r => setTimeout(r, ms));

function imgUrl(query, sig) {
  return `https://source.unsplash.com/featured/260x200/?${encodeURIComponent(query)}&sig=${sig}`;
}

/* ─── Script-tag loader (works on file://) ───────────────────────── */
let _resolve = null;
window.__dayDataCallback__ = data => {
  if (_resolve) { _resolve(data); _resolve = null; }
};

function loadDay(key) {
  return new Promise(resolve => {
    const prev = document.getElementById("__ds__");
    if (prev) prev.remove();
    _resolve = resolve;
    const s   = document.createElement("script");
    s.id      = "__ds__";
    s.src     = `data/${key}.js`;
    s.onerror = () => { s.remove(); _resolve = null; resolve(null); };
    document.head.appendChild(s);
  });
}

/* ─── Render: date hero ──────────────────────────────────────────── */
function renderDate(d) {
  elDay.textContent = d.getDate();
  elMY.textContent  = `${MONTHS_GEN[d.getMonth()]} ${d.getFullYear()}`;
  elWD.textContent  = WEEKDAYS[d.getDay()];
}

/* ─── Render: holidays list ──────────────────────────────────────── */
function renderHolidays(key, data) {
  elList.innerHTML = "";

  const named = data ? data.filter(h => h.name && h.name.trim()) : [];
  const plain = data ? data.filter(h => !h.name || !h.name.trim()) : [];

  /* დღესასწაულების გარეშე - ერთ სტრიქონზე */
  // if (!named.length) {
  //   const p = document.createElement("p");
  //   p.className   = "no-holidays";
  //   p.textContent = plain.length ? plain[0].fact : "დღესასწაულების გარეშე<br>(დაემატება უმოკლეს დროში)";
  //   elList.appendChild(p);
  //   return;
  // }

  if (!named.length) {
    const p = document.createElement("p");
    p.className = "no-holidays";
    
    if (plain.length) {
        p.textContent = plain[0].fact;
    } else {
        const span1 = document.createElement("span");
        span1.textContent = "დღესასწაულების გარეშე";
        const span2 = document.createElement("span");
        span2.textContent = "(დაემატება უმოკლეს დროში)";
        
        p.appendChild(span1);
        p.appendChild(document.createElement("br"));
        p.appendChild(span2);
    }
    
    elList.appendChild(p);
    return;
}

  named.forEach((h, idx) => {
    const sig = Math.abs(
      (key + idx).split("").reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 0)
    );

    const card = document.createElement("div");
    card.className = "holiday-card";

    /* image */
    const imgWrap = document.createElement("div");
    imgWrap.className = "h-img";
    const ph  = document.createElement("div");
    ph.className = "h-img-ph";
    ph.textContent = "✦";
    const img = document.createElement("img");
    img.alt     = h.name;
    img.loading = "lazy";
    img.src     = imgUrl(h.img || h.name, sig);
    img.addEventListener("load",  () => img.classList.add("loaded"));
    img.addEventListener("error", () => { img.style.display = "none"; });
    imgWrap.append(ph, img);

    /* text */
    const body = document.createElement("div");
    body.className = "h-body";
    const name = document.createElement("div");
    name.className   = "h-name";
    name.textContent = h.name;
    const fact = document.createElement("div");
    fact.className   = "h-fact";
    fact.textContent = h.fact || "";
    body.append(name, fact);

    card.append(imgWrap, body);
    elList.appendChild(card);
  });
}

/* ─── Render: mini-calendar ──────────────────────────────────────── */
function renderMiniCal() {
  mcTitle.textContent = `${MONTHS_NOM[mcMonth]} ${mcYear}`;

  const firstDow   = new Date(mcYear, mcMonth, 1).getDay();
  const startDow   = firstDow === 0 ? 6 : firstDow - 1;   // Mon-based
  const daysInMonth = new Date(mcYear, mcMonth + 1, 0).getDate();
  const daysInPrev  = new Date(mcYear, mcMonth,     0).getDate();

  mcGrid.innerHTML = "";

  const todayKey = dateKey(today);
  const selKey   = dateKey(current);

  /* prev-month fillers */
  for (let i = startDow - 1; i >= 0; i--) {
    const btn = document.createElement("button");
    btn.className   = "mc-day other-month";
    btn.textContent = daysInPrev - i;
    const d = new Date(mcYear, mcMonth - 1, daysInPrev - i);
    btn.addEventListener("click", () => jumpTo(d));
    mcGrid.appendChild(btn);
  }

  /* current month */
  for (let d = 1; d <= daysInMonth; d++) {
    const btn  = document.createElement("button");
    btn.className   = "mc-day";
    btn.textContent = d;

    const date = new Date(mcYear, mcMonth, d);
    const key  = dateKey(date);
    const dow  = date.getDay();

    if (dow === 0 || dow === 6)  btn.classList.add("wknd");
    if (key === todayKey)        btn.classList.add("is-today");
    if (key === selKey)          btn.classList.add("selected");
    if (HOLIDAY_KEYS.has(key))  btn.classList.add("has-holiday");

    btn.addEventListener("click", () => jumpTo(date));
    mcGrid.appendChild(btn);
  }

  /* next-month fillers */
  const tail = (7 - ((startDow + daysInMonth) % 7)) % 7;
  for (let d = 1; d <= tail; d++) {
    const btn = document.createElement("button");
    btn.className   = "mc-day other-month";
    btn.textContent = d;
    const date = new Date(mcYear, mcMonth + 1, d);
    btn.addEventListener("click", () => jumpTo(date));
    mcGrid.appendChild(btn);
  }
}

/* ─── Animated update ────────────────────────────────────────────── */
async function update(d, instant) {
  if (!instant) {
    card.classList.add("fade-out");
    await delay(175);
  }

  const key  = dateKey(d);
  const data = await loadDay(key);

  renderDate(d);
  renderHolidays(key, data);

  if (mcYear !== d.getFullYear() || mcMonth !== d.getMonth()) {
    mcYear  = d.getFullYear();
    mcMonth = d.getMonth();
  }
  renderMiniCal();

  if (!instant) card.classList.remove("fade-out");
}

/* ─── Navigation ─────────────────────────────────────────────────── */
const step    = n => { current.setDate(current.getDate() + n); update(current); };
const jumpTo  = d => { current = new Date(d); current.setHours(0,0,0,0); update(current); };
const goToday = () => { current = new Date(today); current.setHours(0,0,0,0); update(current); };

document.getElementById("btn-prev").addEventListener("click",  () => step(-1));
document.getElementById("btn-next").addEventListener("click",  () => step(+1));
document.getElementById("btn-today").addEventListener("click", goToday);

document.getElementById("mc-prev").addEventListener("click", () => {
  if (--mcMonth < 0) { mcMonth = 11; mcYear--; }
  renderMiniCal();
});
document.getElementById("mc-next").addEventListener("click", () => {
  if (++mcMonth > 11) { mcMonth = 0; mcYear++; }
  renderMiniCal();
});

document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft")          step(-1);
  if (e.key === "ArrowRight")         step(+1);
  if (e.key === "t" || e.key === "T") goToday();
});

/* ─── Init ───────────────────────────────────────────────────────── */
update(current, true);

/* ─── Theme toggle ───────────────────────────────────────────────── */
(function() {
  const html     = document.documentElement;
  const btn      = document.getElementById("theme-toggle");
  const saved    = localStorage.getItem("cal-theme") || "light";
  html.setAttribute("data-theme", saved);
  if (btn) btn.addEventListener("click", () => {
    const next = html.getAttribute("data-theme") === "light" ? "dark" : "light";
    html.setAttribute("data-theme", next);
    try { localStorage.setItem("cal-theme", next); } catch(e) {}
  });
})();
