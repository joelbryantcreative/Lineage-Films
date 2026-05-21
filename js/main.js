/* =============================================================
   Lineage Films — main.js
   Vanilla JS only. Defer-loaded.
   ============================================================= */

(function () {
  "use strict";

  /* ---- 1. Scrolled header state ------------------------------ */
  var header = document.querySelector("[data-header]");
  if (header) {
    var onScroll = function () {
      if (window.scrollY > 24) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- 2. Mobile nav toggle --------------------------------- */
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    // Close after a link tap on mobile
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---- 3. Pillar accordion with smooth height animation ------ */
  /* Native <details>/<summary> handle a11y; we just animate height
     and enforce single-open behaviour. */
  var pillars = document.querySelectorAll("[data-pillar]");

  pillars.forEach(function (pillar) {
    var summary = pillar.querySelector("summary");
    var body = pillar.querySelector(".pillar__body");
    if (!summary || !body) return;

    summary.addEventListener("click", function (e) {
      e.preventDefault();

      var isOpen = pillar.hasAttribute("open");

      // Close siblings (accordion behaviour)
      if (!isOpen) {
        pillars.forEach(function (other) {
          if (other !== pillar && other.hasAttribute("open")) {
            closePillar(other);
          }
        });
      }

      if (isOpen) closePillar(pillar);
      else openPillar(pillar);
    });
  });

  function openPillar(pillar) {
    var body = pillar.querySelector(".pillar__body");
    pillar.setAttribute("open", "");
    pillar.setAttribute("data-animating", "");
    body.style.height = "0px";
    // Force layout, then animate to natural height
    requestAnimationFrame(function () {
      var target = body.scrollHeight;
      body.style.height = target + "px";
    });

    body.addEventListener("transitionend", function onEnd(ev) {
      if (ev.propertyName !== "height") return;
      body.style.height = "";
      pillar.removeAttribute("data-animating");
      body.removeEventListener("transitionend", onEnd);
    });
  }

  function closePillar(pillar) {
    var body = pillar.querySelector(".pillar__body");
    pillar.setAttribute("data-animating", "");
    body.style.height = body.scrollHeight + "px";
    requestAnimationFrame(function () {
      body.style.height = "0px";
    });

    body.addEventListener("transitionend", function onEnd(ev) {
      if (ev.propertyName !== "height") return;
      pillar.removeAttribute("open");
      body.style.height = "";
      pillar.removeAttribute("data-animating");
      body.removeEventListener("transitionend", onEnd);
    });
  }

  /* ---- 4. Hover preview — swap still for GIF / MP4 on first hover */
  /* Preview asset is loaded only on first hover to keep heavy GIFs off
     the initial page weight. After insertion it stays in the DOM so
     subsequent hovers are instant. */
  var previewTiles = document.querySelectorAll("[data-preview]");

  previewTiles.forEach(function (tile) {
    var inserted = false;
    var previewEl = null;

    function ensurePreview() {
      if (inserted) return;
      inserted = true;
      var src = tile.getAttribute("data-preview");
      if (!src) return;
      var ext = src.split(".").pop().toLowerCase().split("?")[0];

      if (ext === "mp4" || ext === "webm" || ext === "mov") {
        previewEl = document.createElement("video");
        previewEl.muted = true;
        previewEl.loop = true;
        previewEl.playsInline = true;
        previewEl.preload = "auto";
        previewEl.src = src;
      } else {
        previewEl = document.createElement("img");
        previewEl.src = src;
        previewEl.alt = "";
        previewEl.decoding = "async";
      }
      previewEl.className = "work-card__preview";

      // Insert before the brand layer so the logo stays on top
      var brand = tile.querySelector(".work-card__brand");
      if (brand) tile.insertBefore(previewEl, brand);
      else tile.appendChild(previewEl);
    }

    tile.addEventListener("mouseenter", function () {
      ensurePreview();
      if (previewEl && previewEl.tagName === "VIDEO") {
        previewEl.currentTime = 0;
        previewEl.play().catch(function () {});
      }
    });

    tile.addEventListener("mouseleave", function () {
      if (previewEl && previewEl.tagName === "VIDEO") {
        previewEl.pause();
      }
    });

    // Touch / focus: also ensure preview for keyboard users
    tile.addEventListener("focus", ensurePreview);
  });

  /* ---- 5. Tile click → swap in autoplaying Vimeo iframe ----- */
  var posters = document.querySelectorAll("[data-vimeo]");

  posters.forEach(function (poster) {
    poster.addEventListener("click", function () {
      var id = poster.getAttribute("data-vimeo");
      if (!id) return;

      var iframe = document.createElement("iframe");
      iframe.setAttribute(
        "src",
        "https://player.vimeo.com/video/" +
          encodeURIComponent(id) +
          "?autoplay=1&dnt=1&title=0&byline=0&portrait=0"
      );
      iframe.setAttribute("title", poster.getAttribute("aria-label") || "Vimeo player");
      iframe.setAttribute("frameborder", "0");
      iframe.setAttribute(
        "allow",
        "autoplay; fullscreen; picture-in-picture"
      );
      iframe.setAttribute("allowfullscreen", "");

      // Replace the poster button with a tile div containing the iframe
      // so the layout doesn't jump.
      var wrap = document.createElement("div");
      wrap.className = "work-card__tile work-card__tile--playing";
      wrap.appendChild(iframe);
      poster.replaceWith(wrap);
    });
  });

  /* ---- 6. Auto-update footer year --------------------------- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
