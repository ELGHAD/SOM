/* SOUNDS OF MOROCCO — main.js */
(function () {
  // Mobile menu
  const burger = document.querySelector(".burger");
  const menu = document.querySelector(".menu");
  if (burger && menu) {
    burger.addEventListener("click", () => menu.classList.toggle("open"));
  }

  // Set current menu item
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".menu a").forEach((a) => {
    const href = a.getAttribute("href");
    if ((current === "" && href === "index.html") || href === current) {
      a.setAttribute("aria-current", "page");
    }
  });

  // Reveal on scroll
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) =>
        e.target.classList.toggle("visible", e.isIntersecting)
      );
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // RELEASES: simple client-side filters (genre / year / artist)
  const chips = document.querySelectorAll(".chip[data-filter]");
  if (chips.length) {
    chips.forEach((chip) =>
      chip.addEventListener("click", () => {
        const key = chip.dataset.key; // genre | year | artist
        const value = chip.dataset.filter;
        const active = chip.classList.toggle("active");

        // only one chip per key active at a time
        document.querySelectorAll(`.chip[data-key="${key}"]`).forEach((c) => {
          if (c !== chip) c.classList.remove("active");
        });

        document.querySelectorAll(".release").forEach((card) => {
          card.style.display = ""; // reset
          const matches = [...document.querySelectorAll(`.chip.active`)].every(
            (c) => {
              const k = c.dataset.key;
              const v = c.dataset.filter;
              return (card.dataset[k] || "")
                .toLowerCase()
                .includes(v.toLowerCase());
            }
          );
          if (!matches) card.style.display = "none";
        });
      })
    );
  }

  // SUBMIT forms: client-side demo + EmailJS hook (optional)
  const forms = document.querySelectorAll("form[data-email]");
  forms.forEach((f) => {
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(f).entries());
      // Demo: open mailto as fallback
      const to = f.dataset.email;
      const subject = encodeURIComponent(
        `[Sounds of Morocco] ${f.dataset.subject || "New submission"}`
      );
      const body = encodeURIComponent(
        Object.entries(data)
          .map(([k, v]) => `${k}: ${v}`)
          .join("\n")
      );
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;

      // If you prefer EmailJS (replace with your service/template IDs)
      // emailjs.send("service_xxx","template_xxx",data).then(()=>alert('Merci!'));
    });
  });

  // Analytics placeholder (replace with GA/Matomo script)
  // console.info('Analytics ready — replace with GA/Matomo code.');
})();

  /* ===== ABOUT PAGE ONLY ===== */
  if (document.body.classList.contains('about')) {

    // Smooth scroll for local subnav anchors
    document.querySelectorAll('.subnav a[href^="#"], a[href^="#"]').forEach(a=>{
      a.addEventListener('click', e=>{
        const id = a.getAttribute('href');
        if(id && id.length > 1 && document.querySelector(id)){
          e.preventDefault();
          document.querySelector(id).scrollIntoView({behavior:'smooth', block:'start'});
          history.replaceState(null, "", id);
        }
      });
    });

    // Sticky subnav active state
    const sections = document.querySelectorAll('.section[id]');
    const subLinks = document.querySelectorAll('.subnav a');
    const setActive = id=>{
      subLinks.forEach(l=>l.classList.toggle('is-active', l.getAttribute('href')==='#'+id));
    };
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{ if(en.isIntersecting){ setActive(en.target.id); } });
    }, { rootMargin:'-45% 0px -50% 0px', threshold:0 });
    sections.forEach(s=>obs.observe(s));

    // Click-to-expand for "Values" list
    document.querySelectorAll('#values .values-list li').forEach(li=>{
      li.addEventListener('click', ()=>{
        li.classList.toggle('open');
        if(!li.dataset.expanded){
          li.dataset.expanded = "1";
          li.innerHTML = `<strong>${li.textContent}</strong>
            <p class="muted" style="margin:.35rem 0 0; color:rgba(255,255,255,.82)">
              We live this value through fair deals, mentorship, and community programs.
            </p>`;
        }else{
          li.removeAttribute('data-expanded');
          li.textContent = li.querySelector('strong').textContent;
        }
      });
    });

    // Lightbox for any .media img or image inside .card-label/.card-cultural
    const lb = document.createElement('div');
    lb.className = 'lb';
    lb.innerHTML = '<img alt=""><button aria-label="Close" style="position:absolute;top:22px;right:22px;background:transparent;border:none;color:#fff;font-size:28px;cursor:pointer">&times;</button>';
    document.body.appendChild(lb);
    lb.addEventListener('click', ()=>lb.classList.remove('active'));
    const lbImg = lb.querySelector('img');
    document.querySelectorAll('.media img, .card-label img, .card-cultural img').forEach(img=>{
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', ()=>{
        lbImg.src = img.src;
        lb.classList.add('active');
      });
    });

    // Team card quick modal (simple dialog)
    const dlg = document.createElement('dialog');
    dlg.style.padding = '0'; dlg.style.border = 'none'; dlg.style.borderRadius = '16px';
    dlg.style.width = 'min(640px, 92vw)';
    dlg.innerHTML = `
      <div style="background:#0b0b12;border:1px solid rgba(255,255,255,.12);border-radius:16px;overflow:hidden">
        <div style="display:flex;align-items:center;gap:14px;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.08)">
          <strong>Team</strong>
          <span class="muted" style="font-size:.9rem; color:rgba(255,255,255,.7)">— Bio</span>
          <button id="xTeam" style="margin-left:auto;background:transparent;border:none;color:#fff;font-size:24px;cursor:pointer">&times;</button>
        </div>
        <div id="teamBody" style="padding:18px;color:#fff"></div>
      </div>`;
    document.body.appendChild(dlg);
    dlg.querySelector('#xTeam').addEventListener('click', ()=>dlg.close());

    document.querySelectorAll('.team').forEach(card=>{
      card.style.cursor = 'pointer';
      card.addEventListener('click', ()=>{
        const name = card.querySelector('h3')?.textContent || 'Team';
        const role = card.querySelector('.muted, .sub')?.textContent || '';
        const img  = card.querySelector('img')?.src || '';
        dlg.querySelector('#teamBody').innerHTML = `
          <div style="display:grid;grid-template-columns:120px 1fr;gap:16px;align-items:start">
            <img src="${img}" alt="${name}" style="width:120px;height:120px;border-radius:12px;object-fit:cover;border:4px solid var(--blue-royal)">
            <div>
              <h3 style="margin:0 0 6px">${name}</h3>
              <p class="muted" style="margin:0 0 12px;color:rgba(255,255,255,.75)">${role}</p>
              <p style="color:rgba(255,255,255,.85)">Short bio goes here. Add achievements, responsibilities, and influences.</p>
              <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">
                <a class="btn btn-primary" href="mailto:contact@soundsofmorocco.com"><i class="fa-regular fa-envelope"></i> Contact</a>
                <a class="btn btn-outline" href="#" onclick="event.preventDefault()"><i class="fa-brands fa-instagram"></i> Follow</a>
              </div>
            </div>
          </div>`;
        dlg.showModal();
      });
    });

    // Back-to-top FAB
    const fab = document.createElement('div');
    fab.className = 'fab';
    fab.innerHTML = `<a class="btn" href="#top" aria-label="Back to top"><i class="fa-solid fa-arrow-up"></i></a>`;
    document.body.appendChild(fab);
    const showFab = ()=> (window.scrollY>600) ? fab.classList.add('show') : fab.classList.remove('show');
    showFab(); window.addEventListener('scroll', showFab);
  }

  // About: tap/hover to expand value (adds a small caption once)
if (document.body.classList.contains('about')) {
  document.querySelectorAll('#values .fancy-values li').forEach(li=>{
    li.addEventListener('click', ()=>{
      li.classList.toggle('open');
      if(!li.dataset.expanded){
        li.dataset.expanded = "1";
        li.innerHTML = `<strong>${li.textContent}</strong>
          <p class="muted" style="margin:.35rem 0 0; color:rgba(255,255,255,.82)">
            We live this through fair deals, mentorship, and community programs.
          </p>`;
      } else {
        li.removeAttribute('data-expanded');
        li.textContent = li.querySelector('strong').textContent;
      }
    });
  });
}
// ------------------------------------
// Submit form UX (scoped & non-intrusive)
// ------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".submit-form");
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const terms = form.querySelector('input[name="Terms"]');
  const message = form.querySelector("#message");

  // Disable submit until Terms is checked
  if (submitBtn && terms) {
    const sync = () => (submitBtn.disabled = !terms.checked);
    sync();
    terms.addEventListener("change", sync);
  }

  // Optional: live character counter
  if (message) {
    const counter = document.createElement("div");
    counter.style.fontSize = "0.85rem";
    counter.style.color = "rgba(255,255,255,.68)";
    counter.style.marginTop = "4px";
    message.insertAdjacentElement("afterend", counter);
    const update = () => (counter.textContent = `${message.value.length} characters`);
    update();
    message.addEventListener("input", update);
  }

  // Mailto fallback composer
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const to = form.dataset.email || "demos@soundsofmorocco.com";
    const subject = form.dataset.subject || "Music Submission";

    const data = new FormData(form);
    const lines = [];
    for (const [k, v] of data.entries()) {
      if (k.toLowerCase() === "terms") continue;
      lines.push(`${k}: ${v}`);
    }

    const body = encodeURIComponent(lines.join("\n"));
    const mailto = `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${body}`;
    window.location.href = mailto;
  });
});

// MUSIC PAGE: gently animate cards on scroll (reuses your .reveal/.visible)
(() => {
  if (!document.body.classList.contains('page-music')) return;
  const obs = new IntersectionObserver((ents)=>ents.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); }
  }), {threshold: .14});
  document.querySelectorAll('.page-music .reveal').forEach(el=>obs.observe(el));
})();


