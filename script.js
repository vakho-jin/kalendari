"use strict";

/* ── Locale ─────────────────────────────────────────────────────── */
const MONTHS   = ["იანვარი","თებერვალი","მარტი","აპრილი","მაისი","ივნისი",
                  "ივლისი","აგვისტო","სექტემბერი","ოქტომბერი","ნოემბერი","დეკემბერი"];
const WEEKDAYS = ["კვირა","ორშაბათი","სამშაბათი","ოთხშაბათი",
                  "ხუთშაბათი","პარასკევი","შაბათი"];

const FALLBACKS = [
  "დედამიწა კიდევ ერთხელ შემობრუნდა თავისი ღერძის ირგვლივ.",
  "ამ დღეს მსოფლიოში დაახლოებით 385 000 ადამიანი იბადება.",
  "ყოველი დღე არის 86 400 წამი ახალი შესაძლებლობებისათვის.",
  "დღეს ერთი ჩვეულებრივი დღეა, რომელიც შეიძლება გახდეს არაჩვეულებრივი.",
  "დღეს კარგი დღეა, რომ ისწავლოს რამე ახალი.",
  "დროის მხოლოდ წინ მიდის, ამიტომ ყოველი წამი ძვირფასია.",
  "დღეს ის ხვალინდელი დღეა, რომელზეც გუშინ ასე ნერვიულობდი.",
  "მზის ამოსვლა არ არის უბრალოდ ბუნების მოვლენა, ეს არის ახალი დასაწყისი.",
  "ყოველი დილა ცარიელი ფურცელია, რომელზეც შენს ისტორიას დაწერ.",
  "86 400 წამი გაქვს იმისთვის, რომ ვინმეს ცხოვრება უკეთესობისკენ შეცვალო.",
  "დღეს შეიძლება სწორედ ის დღე იყოს, რომელიც შენს ცხოვრებას შეცვლის.",
  "ნუ დაელოდები ხვალინდელ დღეს, რომ დაიწყო ის, რისი გაკეთებაც დღეს შეგიძლია.",
  "დღეს დაახლოებით 8 მილიარდი ადამიანი ცდილობს, იპოვოს საკუთარი ბედნიერება.",
  "ჩვეულებრივობა მხოლოდ ილუზიაა — ყოველი დღე სავსეა პატარა სასწაულებით.",
  "დღეს კარგი დღეა, რომ აპატიო საკუთარ თავს წარსული შეცდომები.",
  "დრო არ ელოდება არავის, მაგრამ ის ყოველთვის გაძლევს მეორე შანსს.",
  "ყოველი ამოსუნთქვა არის შეხსენება, რომ ცოცხალი ხარ და შეგიძლია იმოქმედო.",
  "დღეს ვიღაც პირველად ხვდება სიყვარულს, ვიღაც კი — საკუთარ თავს.",
  "დღეს შეიძლება შენი ცხოვრების საუკეთესო დღე იყოს, უბრალოდ ჯერ ვერ გააცნობიერე.",
  "ნუ შეაფასებ დღევანდელ დღეს იმით, რაც გუშინ მოხდა.",
  "ყოველი წამი არის შესაძლებლობა, აირჩიო სიყვარული შიშის ნაცვლად.",
  "დღეს მსოფლიოში ადამიანები ათასობით აღმოჩენას აკეთებენ — შენც შეგიძლია იყო ერთ-ერთი მათგანი.",
  "დღეს ის დღეა, როცა შეგიძლია შეწყვიტო გეგმების შედგენა და დაიწყო მოქმედება.",
  "მზე რომ ამოვა, არ გეკითხება მზად ხარ თუ არა — ის უბრალოდ ანათებს.",
  "ყოველი დღე პატარა ცხოვრებაა — იცხოვრე ისე, თითქოს ეს შენი ბოლო შანსი იყოს.",
  "დღეს კარგი დღეა, რომ გაუღიმო უცნობს და იქნებ მეგობარიც შეიძინო.",
  "დღეს ათასობით ოცნება იბადება და იღუპება — აირჩიე, რომელი გინდა, რომ გადარჩეს.",
  "დრო არ კურნავს ჭრილობებს, ის გასწავლის მათთან ცხოვრებას.",
  "დღევანდელი დღე ხვალინდელი დღის მოგონება იქნება. როგორი გინდა, რომ ის იყოს?",
  "შესაძლებლობები ისე მოდიან და მიდიან, როგორც ღრუბლები — ნუ გაუშვებ ხელიდან.",
  "დღეს ვიღაც იბრძვის გადარჩენისთვის — დააფასე, რომ შენ შეგიძლია იბრძოლო ცხოვრების ხარისხისთვის.",
  "დღეს კარგი დღეა, რომ დაიწყო იმ წიგნის წერა, რაზეც ყოველთვის ოცნებობდი.",
  "ყოველი დილა გვახსენებს, რომ სიცოცხლე თავიდან იწყება.",
  "დღეს შენი გადაწყვეტილებები ქმნის იმას, ვინ იქნები ხვალ.",
  "ნუ დაკარგავ დღეს იმაზე ფიქრში, რაც შენს კონტროლს არ ექვემდებარება.",
  "დღეს შეიძლება სწორედ ის დღე იყოს, როცა უნდა უთხრა 'მადლობა' საკუთარ თავს, რომ არ დანებდი.",
  "ყოველი დღე არის შესაძლებლობა გახდე ოდნავ უკეთესი, ვიდრე გუშინ იყავი.",
  "დღეს მსოფლიოში მილიონობით ადამიანი პოულობს ძალას გააგრძელოს წინსვლა.",
  "დღეს ის დღეა, როცა შეგიძლია უთხრა ვინმეს, რომ გიყვარს — ნუ გადადებ.",
  "ჩვეულებრივი დღე შეიძლება გახდეს არაჩვეულებრივი, თუ მასში საკუთარ თავს ჩადებ.",
  "დროის თითოეული მომენტი უნიკალურია, ისევე როგორც შენი თითის ანაბეჭდი.",
  "დღეს ვიღაც იწყებს მოგზაურობას, რომელიც მის ცხოვრებას შეცვლის.",
  "დღეს კარგი დღეა, რომ აღიარო შენი შეცდომები და გააგრძელო წინსვლა.",
  "ყოველი დღე გვასწავლის რაღაცას, თუ ჩვენ მზად ვართ გაკვეთილის მისაღებად.",
  "ნუ ელოდები სრულყოფილ მომენტს — აიღე ეს მომენტი და აქციე სრულყოფილად.",
  "დღეს შენს გარდა კიდევ მილიარდობით ადამიანი ეძებს თავის ადგილს ამქვეყნად.",
  "დღეს ის დღეა, როცა შეგიძლია პატიება ითხოვო და მშვიდობა დაამყარო.",
  "ყოველი დღე ჰგავს ცარიელ ტილოს — შენი განწყობაა ფუნჯი, შენი მოქმედებები კი — საღებავი.",
  "დღეს სადღაც მსოფლიოში ვიღაც შენს ღიმილს ელოდება, თუმცა არც კი იცის ამის შესახებ.",
  "დღეს კარგი დღეა, რომ გააკეთო ის, რისიც ყოველთვის გეშინოდა.",
  "დრო არის ყველაზე ძვირფასი რესურსი — დახარჯე ის გონივრულად.",
  "დღეს შენს გულში შეიძლება აღმოცენდეს ის თესლი, რომელიც მთელ ცხოვრებას შეგიცვლის.",
  "დღეს იმაზე ფიქრი ღირს, რაც გაქვს, იმის მაგივრად, რაც არ გაქვს.",
  "ყოველი დღე მოგზაურობაა საკუთარ თავში — აღმოაჩინე ახალი კონტინენტები.",
  "დღეს გახსოვდეს, რომ შენ ხარ საკუთარი ბედისწერის არქიტექტორი.",
  "დღეს ის დღეა, რომლის შესახებაც გუშინ ოცნებობდი — იცხოვრე აწმყოში.",
  ];

/* ── State ──────────────────────────────────────────────────────── */
let current = new Date();
current.setHours(0,0,0,0);
const today = new Date(current);

/* ── Helpers ────────────────────────────────────────────────────── */
const pad     = n  => String(n).padStart(2,"0");
const dateKey = d  => `${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const delay   = ms => new Promise(r => setTimeout(r, ms));

function fallbackFact(key) {
  let h = 0;
  for (const c of key) h = (h * 31 + c.charCodeAt(0)) | 0;
  return FALLBACKS[Math.abs(h) % FALLBACKS.length];
}

function imgUrl(query, sig) {
  return `https://source.unsplash.com/featured/260x220/?${encodeURIComponent(query)}&sig=${sig}`;
}

/* ── DOM ────────────────────────────────────────────────────────── */
const card   = document.querySelector(".card");
const elDay  = document.getElementById("day-num");
const elMY   = document.getElementById("month-yr");
const elWD   = document.getElementById("weekday");
const elList = document.getElementById("holidays");

/* ── Load day file via <script> tag (works on file://) ──────────── */
function loadDayScript(key) {
  return new Promise(resolve => {
    // დროებითი თეგის მოხსნა, თუ აქვს
    const old = document.getElementById("__day_script__");
    if (old) old.remove();

    window.__dayDataCallback__ = data => {
      delete window.__dayDataCallback__;
      resolve(data);
    };

    const s = document.createElement("script");
    s.id  = "__day_script__";
    s.src = `data/${key}.js`;
    s.onerror = () => {
      s.remove();
      delete window.__dayDataCallback__;
      resolve(null); // ფაილი არ არის
    };
    document.head.appendChild(s);
  });
}

/* ── Render date ────────────────────────────────────────────────── */
function renderDate(d) {
  elDay.textContent = d.getDate();
  elMY.textContent  = `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  elWD.textContent  = WEEKDAYS[d.getDay()];
}

/* ── Render holidays ────────────────────────────────────────────── */
function renderHolidays(key, data) {
  elList.innerHTML = "";

  if (!data || !data.length) {
    const p = document.createElement("p");
    p.className   = "no-holidays";
    p.textContent = fallbackFact(key);
    elList.appendChild(p);
    return;
  }

  data.forEach((h, idx) => {
    const sig = Math.abs((key + idx).split("").reduce((a,c)=>(a*31+c.charCodeAt(0))|0, 0));

    const hcard = document.createElement("div");
    hcard.className = "holiday-card";

    // image
    const imgWrap = document.createElement("div");
    imgWrap.className = "h-img";
    const ph = document.createElement("div");
    ph.className = "h-img-placeholder";
    ph.textContent = "✦";
    const img = document.createElement("img");
    img.alt     = h.name;
    img.loading = "lazy";
    img.src     = imgUrl(h.img, sig);
    img.addEventListener("load",  () => img.classList.add("loaded"));
    img.addEventListener("error", () => { img.style.display = "none"; });
    imgWrap.append(ph, img);

    // text
    const body = document.createElement("div");
    body.className = "h-body";
    const name = document.createElement("div");
    name.className   = "h-name";
    name.textContent = h.name;
    const fact = document.createElement("div");
    fact.className   = "h-fact";
    fact.textContent = h.fact;
    body.append(name, fact);

    hcard.append(imgWrap, body);
    elList.appendChild(hcard);
  });
}

/* ── Animated update ────────────────────────────────────────────── */
async function update(d) {
  card.classList.add("fade-out");
  await delay(190);

  const key  = dateKey(d);
  const data = await loadDayScript(key);

  renderDate(d);
  renderHolidays(key, data);

  card.classList.remove("fade-out");
}

/* ── Navigation ─────────────────────────────────────────────────── */
const step      = n  => { current.setDate(current.getDate() + n); update(current); };
const jumpToday = () => { current = new Date(today); current.setHours(0,0,0,0); update(current); };

document.getElementById("btn-prev").addEventListener("click",  () => step(-1));
document.getElementById("btn-next").addEventListener("click",  () => step(+1));
document.getElementById("btn-today").addEventListener("click", jumpToday);
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft")          step(-1);
  if (e.key === "ArrowRight")         step(+1);
  if (e.key === "t" || e.key === "T") jumpToday();
});

/* ── Init ───────────────────────────────────────────────────────── */
update(current);
