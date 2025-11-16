/* partners.js — sticky tabs + smooth scroll + initial active sync */
(() => {
  const tabs = document.querySelectorAll(".partners-minitabs .pill");
  const ids = ["#about", "#cultural", "#stores", "#become-partner"];
  const sections = ids.map((id) => document.querySelector(id)).filter(Boolean);

  // Smooth scroll on click
  tabs.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", href);
    });
  });

  // IntersectionObserver: highlight the most visible section
  const obs = new IntersectionObserver(
    (entries) => {
      const inView = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!inView) return;
      const id = "#" + inView.target.id;
      tabs.forEach((t) =>
        t.classList.toggle("is-active", t.getAttribute("href") === id)
      );
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: [0.2, 0.6, 1] }
  );

  sections.forEach((s) => s && obs.observe(s));

  // Set initial active based on hash or first section
  const initial =
    location.hash && ids.includes(location.hash) ? location.hash : ids[0];
  tabs.forEach((t) =>
    t.classList.toggle("is-active", t.getAttribute("href") === initial)
  );
})();
