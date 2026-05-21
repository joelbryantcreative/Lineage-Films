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

  /* ---- 4. Auto-update footer year --------------------------- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
