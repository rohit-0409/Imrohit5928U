(function () {
  "use strict";

  const data = window.PORTFOLIO;
  if (!data) return;

  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);

  function renderGame(game) {
    const image = game.image
      ? `<img src="${escapeHTML(game.image)}" alt="${escapeHTML(game.imageAlt || game.title || "Game image")}" loading="lazy" />`
      : `<span class="game-image-placeholder" aria-hidden="true"></span>`;
    const visits = game.visits === "" || game.visits == null ? "—" : game.visits;
    return `<article class="game-card"><div class="game-card-image">${image}<span class="game-image-star" aria-hidden="true">✳</span></div><div class="game-card-caption"><h3>${escapeHTML(game.title || "[Add game title]")}</h3><span class="game-visits"><b>${escapeHTML(visits)}</b><i>visits</i></span></div></article>`;
  }

  function youtubeId(value) {
    if (!value) return "";
    const raw = String(value).trim();
    if (/^[A-Za-z0-9_-]{11}$/.test(raw)) return raw;
    try {
      const url = new URL(raw);
      const host = url.hostname.replace(/^www\./, "").toLowerCase();
      if (host === "youtu.be") {
        return (url.pathname.split("/").filter(Boolean)[0] || "").match(/^[A-Za-z0-9_-]{11}$/)?.[0] || "";
      }
      if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)) {
        const fromQuery = url.searchParams.get("v");
        const fromPath = url.pathname.match(/^\/(?:embed|shorts|live)\/([A-Za-z0-9_-]{11})/)?.[1];
        return [fromQuery, fromPath].find((id) => id && /^[A-Za-z0-9_-]{11}$/.test(id)) || "";
      }
    } catch (_) { return ""; }
    return "";
  }

  function renderVideo(video) {
    const id = youtubeId(video.youtubeUrl || video.youtubeId);
    const player = id
      ? `<iframe src="https://www.youtube-nocookie.com/embed/${id}?rel=0" title="YouTube video: ${escapeHTML(video.title || "Video")}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
      : `<div class="video-player-placeholder" aria-hidden="true"></div>`;
    return `<article class="video-card" data-reveal><div class="video-player">${player}</div><h3>${escapeHTML(video.title || "[Add video title]")}</h3></article>`;
  }

  const gamesTrack = document.querySelector("#games-track");
  if (gamesTrack) {
    const cards = (Array.isArray(data.games) ? data.games : []).map(renderGame).join("");
    gamesTrack.innerHTML = `<div class="games-track-group">${cards}</div><div class="games-track-group" aria-hidden="true">${cards}</div>`;
  }

  const videosGrid = document.querySelector("#videos-grid");
  if (videosGrid) videosGrid.innerHTML = (Array.isArray(data.videos) ? data.videos : []).map(renderVideo).join("");

  const heroButton = document.querySelector("#hero-image-button");
  const heroImage = document.querySelector("#hero-image");
  const heroInput = document.querySelector("#hero-image-input");
  function showHeroImage(source) {
    if (!source || !heroButton || !heroImage) return;
    heroImage.src = source;
    heroImage.hidden = false;
    heroButton.classList.add("has-image");
  }
  let savedHeroImage = "";
  try { savedHeroImage = localStorage.getItem("ruffic-hero-image") || ""; } catch (_) { /* storage may be unavailable for local files */ }
  if (data.profile?.heroImage) showHeroImage(data.profile.heroImage);
  else if (savedHeroImage) showHeroImage(savedHeroImage);
  if (heroButton && heroInput) {
    heroButton.addEventListener("click", () => heroInput.click());
    heroInput.addEventListener("change", () => {
      const file = heroInput.files?.[0];
      if (!file || !file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const source = String(reader.result || "");
        showHeroImage(source);
        try { localStorage.setItem("ruffic-hero-image", source); } catch (_) { /* keep the preview for this visit */ }
      });
      reader.readAsDataURL(file);
    });
  }

  const experienceYears = document.querySelector("#experience-years");
  if (experienceYears && data.profile?.experienceYears) experienceYears.textContent = data.profile.experienceYears;
  const emailLink = document.querySelector("#contact-email");
  if (emailLink && data.profile?.email) emailLink.href = `mailto:${encodeURIComponent(data.profile.email)}`;
  const footerYear = document.querySelector("#footer-year");
  if (footerYear) footerYear.textContent = String(new Date().getFullYear());

  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const expanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open", !expanded);
      document.body.classList.toggle("menu-open", !expanded);
    });
    nav.addEventListener("click", (event) => {
      if (!event.target.closest("a")) return;
      menuToggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    });
  }

  if (heroButton && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    heroButton.addEventListener("pointermove", (event) => {
      const bounds = heroButton.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      heroButton.style.setProperty("--rotate-x", `${y * -10}deg`);
      heroButton.style.setProperty("--rotate-y", `${x * 12}deg`);
    });
    heroButton.addEventListener("pointerleave", () => {
      heroButton.style.setProperty("--rotate-x", "0deg");
      heroButton.style.setProperty("--rotate-y", "0deg");
    });
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: "0px 0px -35px 0px" });
    document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
  } else {
    document.querySelectorAll("[data-reveal]").forEach((element) => element.classList.add("is-visible"));
  }
})();

