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
