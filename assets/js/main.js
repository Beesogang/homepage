/* =========================================================================
   BEE Lab — shared scripts
   헤더/푸터 삽입, 네비게이션, 각 페이지 렌더링 함수
   ========================================================================= */

/* --- 로고 이미지 경로. 실제 파일을 넣은 뒤 경로만 바꾸세요. ------------
   비워두면(빈 문자열) 벌 모티프 텍스트 마크("B")가 대신 표시됩니다. */
const LOGO_SRC = "assets/img/logo.png";

const NAV_ITEMS = [
  { href: "index.html",        label: "Home" },
  { href: "research.html",     label: "Research" },
  { href: "pi.html",           label: "PI" },
  { href: "team.html",         label: "Team" },
  { href: "publications.html", label: "Publications" },
  { href: "gallery.html",      label: "Gallery" },
];

/* --------------------------------------------------------- helpers */
function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}
function initials(name) {
  const p = name.trim().split(/\s+/);
  return ((p[0]?.[0] || "") + (p[1]?.[0] || "")).toUpperCase();
}
function esc(s = "") {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* --------------------------------------------------- header + footer */
function buildHeader(active) {
  const logo = LOGO_SRC
    ? `<img src="${LOGO_SRC}" alt="BEE Lab logo" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'mark',textContent:'B'}))">`
    : `<div class="mark">B</div>`;

  const links = NAV_ITEMS.map(n =>
    `<a href="${n.href}"${n.href === active ? ' class="active" aria-current="page"' : ""}>${n.label}</a>`
  ).join("");

  const header = el(`
    <header class="site-header">
      <div class="wrap">
        <a class="brand" href="index.html" aria-label="BEE Lab home">
          ${logo}
          <span class="brand-text">
            <span class="brand-name">BEE Lab</span>
            <span class="brand-sub">Battery Energy Engineering · Sogang University</span>
          </span>
        </a>
        <button class="nav-toggle" aria-label="Menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
        <nav class="nav">${links}</nav>
      </div>
    </header>
  `);

  const btn = header.querySelector(".nav-toggle");
  const nav = header.querySelector(".nav");
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  return header;
}

function buildFooter() {
  return el(`
    <footer class="site-footer">
      <div class="wrap">
        <div class="f-col">
          <div class="f-brand">BEE Laboratory</div>
          <p>Battery Energy Engineering Lab<br>
          Disruptive battery technologies by chemistry, materials, engineering.</p>
        </div>
        <div class="f-col">
          <h4>Contact</h4>
          <p>Dept. of Chemical &amp; Biomolecular Engineering<br>
          Sogang University, Seoul 04107, Korea<br>
          Office R517A · Lab RA306B<br>
          <a href="mailto:jryu@sogang.ac.kr">jryu@sogang.ac.kr</a></p>
        </div>
        <div class="f-col">
          <h4>Links</h4>
          <p>
            <a href="https://scholar.google.com/citations?user=4YCWJb8AAAAJ&hl=en">Google Scholar</a><br>
            <a href="https://orcid.org/0000-0002-5290-6192">ORCID</a><br>
            <a href="https://sites.google.com/view/jryugroup/home">Legacy site</a>
          </p>
        </div>
      </div>
    </footer>
  `);
}

/* Mount shared chrome. 각 페이지에서 data-active 속성으로 현재 페이지 지정. */
function mountChrome() {
  const active = document.body.dataset.active || "index.html";
  document.body.prepend(buildHeader(active));
  document.body.append(buildFooter());
}

/* --------------------------------------------------- render: NEWS */
function renderNews(mountId, { grouped = false } = {}) {
  const mount = document.getElementById(mountId);
  if (!mount || typeof NEWS === "undefined") return;

  const tagLabel = { paper:"Paper", award:"Award", welcome:"Welcome", congrats:"News", misc:"Update" };

  const itemHTML = (n) => `
    <div class="news-item">
      <div class="date">${esc(n.date)}</div>
      <div class="body">
        <span class="tag ${n.type}">${tagLabel[n.type] || "News"}</span>
        <span class="text">${esc(n.text)}</span>
      </div>
    </div>`;

  if (!grouped) {
    // Home: 최신 8개 + 더보기
    const recent = NEWS.slice(0, 8);
    const rest = NEWS.slice(8);
    mount.innerHTML = `<div class="news-list">${recent.map(itemHTML).join("")}</div>`;
    if (rest.length) {
      const more = el(`<button class="news-toggle">Show earlier news (${rest.length})</button>`);
      const hidden = el(`<div class="news-list" style="display:none">${rest.map(itemHTML).join("")}</div>`);
      more.addEventListener("click", () => {
        const show = hidden.style.display === "none";
        hidden.style.display = show ? "grid" : "none";
        more.textContent = show ? "Show less" : `Show earlier news (${rest.length})`;
      });
      mount.append(hidden, more);
    }
    return;
  }

  // grouped by year
  const byYear = {};
  NEWS.forEach(n => { const y = n.date.slice(0,4); (byYear[y] ||= []).push(n); });
  const years = Object.keys(byYear).sort((a,b) => b-a);
  mount.innerHTML = years.map(y =>
    `<div class="news-year">${y}</div><div class="news-list">${byYear[y].map(itemHTML).join("")}</div>`
  ).join("");
}

/* --------------------------------------------------- render: TEAM */
function renderTeam(mountId) {
  const mount = document.getElementById(mountId);
  if (!mount || typeof TEAM === "undefined") return;

  const photoBlock = (m) => m.photo
    ? `<div class="photo"><img src="${m.photo}" alt="${esc(m.name)}" onerror="this.parentElement.innerHTML='<div class=&quot;avatar&quot;>${initials(m.name)}</div>'"></div>`
    : `<div class="photo"><div class="avatar">${initials(m.name)}</div></div>`;

  const memberCard = (m) => {
    const tag = m.tag ? `<span class="m-tag">${esc(m.tag)}</span>` : "";
    const research = m.research ? `<div class="m-research">${esc(m.research)}</div>` : "";
    const email = m.email ? `<a class="m-email" href="mailto:${m.email}">${esc(m.email)}</a>` : "";
    const notes = m.notes?.length ? `<ul class="m-notes">${m.notes.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>` : "";
    const period = m.period ? `<div class="m-research">${esc(m.period)}</div>` : "";
    const current = m.current ? `<div class="m-current">Now at <b>${esc(m.current)}</b></div>` : "";
    return `
      <div class="member">
        ${photoBlock(m)}
        <div class="info">
          <div class="m-name">${esc(m.name)}${m.nameKo?`<span class="ko">${esc(m.nameKo)}</span>`:""}${tag}</div>
          ${period}${research}${email}${notes}${current}
        </div>
      </div>`;
  };

  // 현재 멤버: PI와 alumni를 제외한 전원을 구분 없이 하나의 그리드로.
  const members = TEAM.filter(m => m.role !== "pi" && m.role !== "alumni");
  const alumni  = TEAM.filter(m => m.role === "alumni");

  let html = "";
  if (members.length) {
    html += `<div class="team-grid">${members.map(memberCard).join("")}</div>`;
  }
  if (alumni.length) {
    html += `<h2 class="team-section-title">Alumni</h2>`;
    html += `<div class="team-grid">${alumni.map(memberCard).join("")}</div>`;
  }
  mount.innerHTML = html;
}

/* --------------------------------------------------- render: RESEARCH */
function renderResearch(mountId) {
  const mount = document.getElementById(mountId);
  if (!mount || typeof RESEARCH_AREAS === "undefined") return;
  mount.innerHTML = RESEARCH_AREAS.map(a => `
    <article class="research-area">
      <div class="ra-media">${a.image ? `<img src="${a.image}" alt="${esc(a.title)}">` : "Figure — add image"}</div>
      <div>
        <h3>${esc(a.title)}</h3>
        <div class="ra-sub">${esc(a.subtitle)}</div>
        <p class="ra-body">${esc(a.body)}</p>
        ${a.refs?.length ? `
        <div class="ra-refs">
          <div class="ra-refs-title">Relevant publications</div>
          <ul>${a.refs.map(r=>`<li>${esc(r)}</li>`).join("")}</ul>
        </div>` : ""}
      </div>
    </article>`).join("");
}

/* --------------------------------------------------- render: PUBLICATIONS */
function renderPublications(mountId) {
  const mount = document.getElementById(mountId);
  if (!mount || typeof PUBLICATIONS === "undefined") return;

  const statusBadge = (s) => {
    if (s === "revision")  return `<span class="badge status-revision">In revision</span>`;
    if (s === "submitted") return `<span class="badge status-submitted">Submitted</span>`;
    if (s === "inprep")    return `<span class="badge status-inprep">In preparation</span>`;
    return "";
  };

  const pubHTML = (p) => {
    const titleHTML = p.doi
      ? `<a href="${p.doi}" target="_blank" rel="noopener">${esc(p.title)}</a>`
      : esc(p.title);
    const badges = [];
    if (p.impact) badges.push(`<span class="badge impact">${esc(p.impact)}</span>`);
    (p.tags||[]).forEach(t => badges.push(`<span class="badge cover">${esc(t)}</span>`));
    if (p.openAccess) badges.push(`<span class="badge oa">Open Access</span>`);
    const sb = statusBadge(p.status); if (sb) badges.push(sb);
    const press = p.press?.length
      ? `<div class="pub-press">Press: ${p.press.map(x=>`<a href="${x.url}" target="_blank" rel="noopener">${esc(x.name)}</a>`).join(" · ")}</div>`
      : "";
    return `
      <div class="pub" data-status="${p.status}">
        <div class="pub-num">${p.num ? esc(p.num) : "—"}</div>
        <div>
          <div class="pub-title">${titleHTML}</div>
          <div class="pub-authors">${esc(p.authors)}</div>
          <div class="pub-venue">${esc(p.venue)}</div>
          ${badges.length?`<div class="pub-badges">${badges.join("")}</div>`:""}
          ${press}
        </div>
      </div>`;
  };

  // Filters
  const filters = el(`
    <div class="pub-filters">
      <button data-f="all" class="active">All</button>
      <button data-f="published">Published</button>
      <button data-f="pipeline">In press / prep</button>
    </div>`);

  const listWrap = el(`<div id="pub-list"></div>`);

  function draw(mode) {
    let pubs = PUBLICATIONS;
    if (mode === "published") pubs = PUBLICATIONS.filter(p => p.status === "published");
    if (mode === "pipeline")  pubs = PUBLICATIONS.filter(p => p.status !== "published");

    // pipeline group first (no year head), then published grouped by year
    let html = "";
    const pipeline = pubs.filter(p => p.status !== "published");
    const published = pubs.filter(p => p.status === "published");

    if (pipeline.length) {
      html += `<div class="pub-year-head">In preparation · Submitted · In revision</div>`;
      html += pipeline.map(pubHTML).join("");
    }
    if (published.length) {
      const byYear = {};
      published.forEach(p => (byYear[p.year] ||= []).push(p));
      Object.keys(byYear).sort((a,b)=>b-a).forEach(y => {
        html += `<div class="pub-year-head">${y}</div>`;
        html += byYear[y].map(pubHTML).join("");
      });
    }
    listWrap.innerHTML = html;
  }

  filters.querySelectorAll("button").forEach(b => {
    b.addEventListener("click", () => {
      filters.querySelectorAll("button").forEach(x=>x.classList.remove("active"));
      b.classList.add("active");
      draw(b.dataset.f);
    });
  });

  mount.append(filters, listWrap);
  draw("all");

  // Book chapters
  if (typeof BOOK_CHAPTERS !== "undefined" && BOOK_CHAPTERS.length) {
    const bc = el(`<div style="margin-top:40px">
      <div class="pub-year-head">Book Chapters</div>
      ${BOOK_CHAPTERS.map(c=>`
        <div class="chapter">
          <div class="c-title">${esc(c.title)}</div>
          <div class="c-meta">${esc(c.authors)} — <i>${esc(c.book)}</i>, ${esc(c.publisher)}</div>
        </div>`).join("")}
    </div>`);
    mount.append(bc);
  }
}

/* --------------------------------------------------- render: PI */
function renderPI(mountId) {
  const mount = document.getElementById(mountId);
  if (!mount || !PI) return;

  // "연도 | 내용" 문자열 또는 [연도, 내용] 배열 모두 처리
  const split2 = (x) => Array.isArray(x) ? x : String(x).split("|").map(s => s.trim());
  const rows = (arr) => (arr || []).map(x => {
    const [y, d] = split2(x);
    return `<div class="cv-row"><div class="yr">${esc(y || "")}</div><div class="desc">${esc(d || "")}</div></div>`;
  }).join("");
  const links = PI.links || {};

  mount.innerHTML = `
    <div class="pi-header">
      <div class="pi-photo">${PI.photo?`<img src="${PI.photo}" alt="${esc(PI.name)}">`:"Photo — add image"}</div>
      <div>
        <h1>${esc(PI.name)}</h1>
        <div class="pi-role">${esc(PI.title)}</div>
        <div class="pi-contact">
          <div>${esc(PI.dept)}</div>
          <div>${esc(PI.institute)}, ${esc(PI.university)}</div>
          <div><b>Office</b> ${esc(PI.office)} · <b>Lab</b> ${esc(PI.lab)}</div>
          <div><b>Phone</b> ${esc(PI.phone)}</div>
          <div><b>Email</b> <a href="mailto:${PI.email}">${esc(PI.email)}</a></div>
          <div><b>Expertise</b> ${esc(PI.expertise)}</div>
        </div>
        <div class="pi-social">
          ${links.scholar?`<a href="${links.scholar}" target="_blank" rel="noopener">Google Scholar</a>`:""}
          ${links.linkedin?`<a href="${links.linkedin}" target="_blank" rel="noopener">LinkedIn</a>`:""}
          ${links.orcid?`<a href="${links.orcid}" target="_blank" rel="noopener">ORCID</a>`:""}
        </div>
      </div>
    </div>

    <div class="cv-block"><h2>Professional Appointments</h2>${rows(PI.appointments)}</div>
    <div class="cv-block"><h2>Education</h2>${rows(PI.education)}</div>
    <div class="cv-block"><h2>Honors &amp; Awards</h2>${rows(PI.awards)}</div>
    <div class="cv-block"><h2>Professional Activities</h2>${rows(PI.activities)}</div>
    <div class="cv-block"><h2>Teaching</h2>
      <ul class="cv-list">${(PI.teaching||[]).map(t=>`<li>${esc(t)}</li>`).join("")}</ul>
    </div>
    <div class="cv-block" style="border-bottom:none"><h2>Selected Publications</h2>
      ${(PI.selected||[]).map(x=>{const [t,v]=split2(x);return `<div class="sel-pub"><div class="sp-title">${esc(t||"")}</div><div class="sp-venue">${esc(v||"")}</div></div>`}).join("")}
    </div>`;
}

/* --------------------------------------------------- render: GALLERY */
function renderGallery(mountId) {
  const mount = document.getElementById(mountId);
  if (!mount || typeof GALLERY === "undefined") return;

  if (!GALLERY.length) {
    mount.innerHTML = `
      <div class="gallery-empty">
        <p>사진이 아직 없습니다.</p>
        <p class="hint">사진 파일을 <code>assets/img/gallery/</code> 폴더에 넣고,
        <code>data/gallery.js</code>에 한 줄씩 추가하면 이 자리에 표시됩니다.</p>
      </div>`;
    return;
  }

  mount.innerHTML = `<div class="gallery-grid">${
    GALLERY.map((g, i) => `
      <figure class="gphoto" data-i="${i}" tabindex="0" role="button" aria-label="${esc(g.caption||'photo')} 크게 보기">
        <div class="gphoto-img"><img src="${g.src}" alt="${esc(g.caption||'')}" loading="lazy"
          onerror="this.parentElement.innerHTML='<div class=&quot;gphoto-missing&quot;>이미지 없음<br>'+this.getAttribute('src')+'</div>'"></div>
        ${(g.caption||g.date) ? `<figcaption>${esc(g.caption||'')}${g.date?` <span class="gdate">${esc(g.date)}</span>`:''}</figcaption>` : ''}
      </figure>`).join("")
  }</div>`;

  // Lightbox
  const lb = el(`
    <div class="lightbox" aria-hidden="true">
      <button class="lb-close" aria-label="Close">×</button>
      <button class="lb-prev" aria-label="Previous">‹</button>
      <img class="lb-img" src="" alt="">
      <button class="lb-next" aria-label="Next">›</button>
      <div class="lb-cap"></div>
    </div>`);
  document.body.append(lb);
  const lbImg = lb.querySelector(".lb-img");
  const lbCap = lb.querySelector(".lb-cap");
  let cur = 0;

  function open(i) {
    cur = (i + GALLERY.length) % GALLERY.length;
    const g = GALLERY[cur];
    lbImg.src = g.src; lbImg.alt = g.caption || "";
    lbCap.textContent = [g.caption, g.date].filter(Boolean).join(" · ");
    lb.classList.add("open"); lb.setAttribute("aria-hidden","false");
  }
  function close(){ lb.classList.remove("open"); lb.setAttribute("aria-hidden","true"); lbImg.src=""; }

  mount.querySelectorAll(".gphoto").forEach(fig => {
    const go = () => open(+fig.dataset.i);
    fig.addEventListener("click", go);
    fig.addEventListener("keydown", e => { if (e.key==="Enter"||e.key===" ") { e.preventDefault(); go(); } });
  });
  lb.querySelector(".lb-close").addEventListener("click", close);
  lb.querySelector(".lb-next").addEventListener("click", e => { e.stopPropagation(); open(cur+1); });
  lb.querySelector(".lb-prev").addEventListener("click", e => { e.stopPropagation(); open(cur-1); });
  lb.addEventListener("click", e => { if (e.target === lb) close(); });
  document.addEventListener("keydown", e => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") open(cur+1);
    if (e.key === "ArrowLeft") open(cur-1);
  });
}

/* --------------------------------------------------- data loading */
// 데이터는 data/json/*.json 에서 불러옵니다. (/admin 편집 화면이 이 파일들을 수정)
// 온라인(웹서버/Netlify)에서 동작합니다. 로컬에서 미리보려면 웹서버로 여세요:
//   python3 -m http.server 8000  →  http://localhost:8000
let NEWS = [], TEAM = [], PUBLICATIONS = [], BOOK_CHAPTERS = [],
    RESEARCH_AREAS = [], PI = null, GALLERY = [];

async function loadJSON(path) {
  try {
    // 캐시 방지: 매 배포 후 최신 데이터를 확실히 읽도록 타임스탬프 쿼리 추가
    const r = await fetch(path + "?t=" + Date.now(), { cache: "no-store" });
    if (!r.ok) throw new Error(r.status);
    return await r.json();
  } catch (e) {
    console.warn("데이터 로드 실패:", path, e.message);
    return null;
  }
}

async function loadData() {
  const [news, team, pubs, research, pi, gallery] = await Promise.all([
    loadJSON("data/json/news.json"),
    loadJSON("data/json/team.json"),
    loadJSON("data/json/publications.json"),
    loadJSON("data/json/research.json"),
    loadJSON("data/json/pi.json"),
    loadJSON("data/json/gallery.json"),
  ]);
  // news/team/research/gallery 는 { "items": [...] } 구조. (구버전 배열도 호환)
  const arr = (x) => Array.isArray(x) ? x : (x && Array.isArray(x.items) ? x.items : []);
  NEWS = arr(news);
  TEAM = arr(team);
  if (pubs) { PUBLICATIONS = pubs.publications || []; BOOK_CHAPTERS = pubs.book_chapters || []; }
  RESEARCH_AREAS = arr(research);
  if (pi) PI = pi;
  GALLERY = arr(gallery);
}

/* --------------------------------------------------- boot */
document.addEventListener("DOMContentLoaded", async () => {
  mountChrome();
  await loadData();
  // 각 페이지 스크립트에서 필요한 렌더 함수를 호출합니다.
  if (window.__PAGE_INIT__) window.__PAGE_INIT__();
});
