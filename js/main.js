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

      // Vimeo URL? -> iframe in background mode (silent autoplay loop)
      var vimeoMatch =
        src.match(/vimeo\.com\/(\d+)/) ||
        src.match(/player\.vimeo\.com\/video\/(\d+)/);

      if (vimeoMatch) {
        var id = vimeoMatch[1];
        previewEl = document.createElement("iframe");
        previewEl.src =
          "https://player.vimeo.com/video/" +
          encodeURIComponent(id) +
          "?background=1&autoplay=1&loop=1&muted=1&autopause=0&dnt=1";
        previewEl.setAttribute("frameborder", "0");
        previewEl.setAttribute(
          "allow",
          "autoplay; fullscreen; picture-in-picture"
        );
        previewEl.setAttribute("allowfullscreen", "");
        previewEl.setAttribute("tabindex", "-1");
        previewEl.setAttribute("aria-hidden", "true");
        previewEl.title = "";
        previewEl.className = "work-card__preview work-card__preview--vimeo";
      } else {
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
      }

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

  /* ---- 6. Project hero — fit player to the video's real aspect ratio
     Vimeo videos that aren't 16:9 otherwise pillarbox/letterbox inside
     the fixed 16:9 frame. The Player SDK reports the true dimensions so
     we size the container exactly and the bars disappear. */
  var heroPlayer = document.querySelector(".project-hero__player");
  if (heroPlayer && window.Vimeo) {
    var heroIframe = heroPlayer.querySelector("iframe");
    if (heroIframe) {
      try {
        var vp = new window.Vimeo.Player(heroIframe);
        Promise.all([vp.getVideoWidth(), vp.getVideoHeight()])
          .then(function (dims) {
            var w = dims[0];
            var h = dims[1];
            if (w && h) {
              heroPlayer.style.aspectRatio = w + " / " + h;
            }
          })
          .catch(function () {});
      } catch (e) {
        /* SDK not ready — fall back to the 16:9 CSS default */
      }
    }
  }

  /* ---- 7. Contact form — submit via Formsubmit AJAX, no redirect */
  var contactForm = document.querySelector(".contact__form");
  var contactSuccess = document.querySelector(".contact__success");

  if (contactForm && contactSuccess) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var submitBtn = contactForm.querySelector(".contact__submit");
      var originalLabel = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
      }

      // Build the AJAX endpoint from the form's regular action URL
      var ajaxUrl = contactForm.action.replace(
        "formsubmit.co/",
        "formsubmit.co/ajax/"
      );

      fetch(ajaxUrl, {
        method: "POST",
        body: new FormData(contactForm),
        headers: { Accept: "application/json" },
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          var ok = data && (data.success === true || data.success === "true");
          if (ok) {
            contactForm.hidden = true;
            contactSuccess.hidden = false;
            contactSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });
          } else {
            // Likely first submission — Formsubmit returns a verification
            // message until the target email is confirmed. Either way we
            // give the user a friendly fallback.
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = originalLabel;
            }
            alert(
              "Thanks — your message has been received. If this is the " +
              "first enquiry to land in this inbox, you may need to check " +
              "your email to verify the address before future submissions " +
              "arrive."
            );
            contactForm.hidden = true;
            contactSuccess.hidden = false;
          }
        })
        .catch(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalLabel;
          }
          alert(
            "Something went wrong sending the form. Please email " +
            "joel@lineagefilms.com.au directly."
          );
        });
    });
  }

  /* ---- 8. Auto-update footer year --------------------------- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
