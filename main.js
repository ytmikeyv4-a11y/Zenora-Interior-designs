/* ==========================================================================
   ZENORA DESIGNS // LUXURY ARCHITECTURAL 3D WALKTHROUGH ENGINE (1,738 FRAMES)
   3 Architectural Living Rooms + 7 Grand Suites & Atriums
   Decoupled 60/120FPS RAF Engine with Steadycam Frame Glide (Lerp)
   Smart Directional Background Streamer & Neighbor-Search Fallback
   BMW M4 Floating Minimalist Luxury DNA · Pure Cinematic Walkthrough
   Powered by GSAP ScrollTrigger & Lenis Smooth Scroll
   ========================================================================== */

// 1. Prevent browser restoring previous scroll position upon refresh
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// 2. Global hard scroll blocker during initial preload phase
function preventScroll(e) {
  e.preventDefault();
}
window.addEventListener('wheel', preventScroll, { passive: false });
window.addEventListener('touchmove', preventScroll, { passive: false, capture: true });
if (document.documentElement) document.documentElement.classList.add("scroll-locked");
if (document.body) document.body.classList.add("scroll-locked");

document.addEventListener("DOMContentLoaded", () => {
  /* --------------------------------------------------------------------------
     1. ASSET CONFIGURATION & PRELOADER
     -------------------------------------------------------------------------- */
  const TOTAL_FRAMES = 1738;
  const INITIAL_THRESHOLD = 25; // Superfast launch: only wait for first 25 frames (~2.5MB)
  const frames = new Array(TOTAL_FRAMES);
  let loadedCount = 0;
  let experienceStarted = false;
  let lastValidImg = null;

  const preloader = document.getElementById("preloader");
  const preloaderBar = document.getElementById("preloaderBar");
  const preloaderSubText = document.getElementById("preloaderSubText");
  const canvas = document.getElementById("home-canvas");
  const ctx = canvas.getContext("2d");

  const getFramePath = (i) => `assets/frames/frame_${String(i).padStart(4, '0')}.webp`;

  // Preload initial batch (1 to 25)
  function onInitialAssetLoaded(idx, img) {
    frames[idx] = img;
    if (img && img.naturalWidth > 0 && !lastValidImg) {
      lastValidImg = img;
    }
    loadedCount++;

    const pct = Math.min(100, Math.round((loadedCount / INITIAL_THRESHOLD) * 100));
    if (preloaderBar) preloaderBar.style.width = `${pct}%`;
    if (preloaderSubText) {
      preloaderSubText.textContent = `INITIALIZING 3D VILLA SANCTUARY... ${pct}%`;
    }

    // Render initial frame as soon as first 5 frames arrive
    if (loadedCount >= 5 && !window.initialDrawn) {
      window.initialDrawn = true;
      drawCanvasFrame(0);
    }

    if (loadedCount >= INITIAL_THRESHOLD && !experienceStarted) {
      launchExperience();
    }
  }

  for (let i = 0; i < INITIAL_THRESHOLD; i++) {
    const img = new Image();
    img.onload = () => onInitialAssetLoaded(i, img);
    img.onerror = () => onInitialAssetLoaded(i, null);
    img.src = getFramePath(i + 1);
  }

  // Safety fallback: launch experience after 2.5s maximum so user is NEVER stuck
  setTimeout(() => {
    if (!experienceStarted) {
      launchExperience();
    }
  }, 2500);

  /* --------------------------------------------------------------------------
     2. LAUNCH EXPERIENCE & DISMISS PRELOADER
     -------------------------------------------------------------------------- */
  function launchExperience() {
    if (experienceStarted) return;
    experienceStarted = true;

    // Release all scroll blockers
    window.removeEventListener('wheel', preventScroll);
    window.removeEventListener('touchmove', preventScroll, { capture: true });
    document.documentElement.classList.remove("scroll-locked");
    document.body.classList.remove("scroll-locked");
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    window.scrollTo(0, 0);

    // Forceful, guaranteed preloader dismissal
    if (preloader) {
      preloader.classList.add("loaded");
      preloader.style.opacity = "0";
      preloader.style.pointerEvents = "none";
      setTimeout(() => {
        preloader.style.display = "none";
      }, 650);
    }

    // Initialize smooth scroll & background streamer
    setTimeout(() => {
      initScrollExperience();
      startBackgroundFrameStreaming();
    }, 100);
  }

  /* --------------------------------------------------------------------------
     3. HIGH-PERFORMANCE DIRECT GPU CANVAS ENGINE & STEADYCAM GLIDE
     -------------------------------------------------------------------------- */
  let currentRenderedIdx = -1;
  let targetFrameIdx = 0;
  let smoothRenderedFrame = 0;

  const resizeCanvas = () => {
    const isMobile = window.innerWidth <= 768;
    const maxDpr = isMobile ? 1.5 : 2;
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const w = window.innerWidth;
    const h = window.innerHeight;

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    currentRenderedIdx = -1; // Force repaint
    drawCanvasFrame(targetFrameIdx);
  };

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function drawCanvasFrame(index) {
    if (index < 0 || index >= TOTAL_FRAMES) return;

    let img = frames[index];
    if (!img || !img.complete || img.naturalWidth === 0) {
      // Outward neighbor search up to ±35 frames for instant fallback
      for (let d = 1; d <= 35; d++) {
        const prev = frames[index - d];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = frames[index + d];
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
      if (!img || !img.complete || img.naturalWidth === 0) {
        img = lastValidImg;
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;
    lastValidImg = img;

    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    const screenAspect = w / h;
    const imgAspect = 1920 / 1080;

    let drawW, drawH, drawX, drawY;

    if (screenAspect > imgAspect) {
      drawW = w;
      drawH = w / imgAspect;
      drawX = 0;
      drawY = (h - drawH) / 2;
    } else {
      drawH = h;
      drawW = h * imgAspect;
      drawX = (w - drawW) / 2;
      drawY = 0;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }

  // Dedicated RAF animation loop (Steadycam continuous 60/120fps hardware sync)
  function rafRenderLoop() {
    if (experienceStarted) {
      // Continuous liquid lerp (0.28 = velvety steadycam response without stepping)
      const diff = targetFrameIdx - smoothRenderedFrame;
      if (Math.abs(diff) > 0.05) {
        smoothRenderedFrame += diff * 0.28;
      } else {
        smoothRenderedFrame = targetFrameIdx;
      }

      const frameToDraw = Math.round(smoothRenderedFrame);
      if (frameToDraw !== currentRenderedIdx) {
        currentRenderedIdx = frameToDraw;
        drawCanvasFrame(currentRenderedIdx);
      }
    }
    requestAnimationFrame(rafRenderLoop);
  }
  requestAnimationFrame(rafRenderLoop);

  /* --------------------------------------------------------------------------
     4. SMART DIRECTIONAL BACKGROUND STREAMER (PRIORITY QUEUE)
     -------------------------------------------------------------------------- */
  function startBackgroundFrameStreaming() {
    const CONCURRENCY_LIMIT = 8;
    let activeDownloads = 0;
    let sequentialPointer = INITIAL_THRESHOLD;

    function fetchNext() {
      if (activeDownloads >= CONCURRENCY_LIMIT) return;

      let nextIndex = -1;
      const currentPos = Math.round(smoothRenderedFrame);

      // Priority 1: Check 50 frames ahead of the user's current scroll direction
      for (let offset = 0; offset <= 50; offset++) {
        const candidate = currentPos + offset;
        if (candidate < TOTAL_FRAMES && !frames[candidate]) {
          nextIndex = candidate;
          break;
        }
      }

      // Priority 2: Check 25 frames behind
      if (nextIndex === -1) {
        for (let offset = 1; offset <= 25; offset++) {
          const candidate = currentPos - offset;
          if (candidate >= 0 && !frames[candidate]) {
            nextIndex = candidate;
            break;
          }
        }
      }

      // Priority 3: Sequential load the rest of the tour
      if (nextIndex === -1) {
        while (sequentialPointer < TOTAL_FRAMES && frames[sequentialPointer]) {
          sequentialPointer++;
        }
        if (sequentialPointer < TOTAL_FRAMES) {
          nextIndex = sequentialPointer;
          sequentialPointer++;
        }
      }

      if (nextIndex === -1) return; // All 1,738 frames loaded!

      activeDownloads++;
      const img = new Image();
      frames[nextIndex] = img; // Mark as requested to prevent duplicate requests

      img.onload = () => {
        activeDownloads--;
        fetchNext();
      };
      img.onerror = () => {
        activeDownloads--;
        fetchNext();
      };
      img.src = getFramePath(nextIndex + 1);

      // Keep pipeline full
      if (activeDownloads < CONCURRENCY_LIMIT) {
        fetchNext();
      }
    }

    for (let c = 0; c < CONCURRENCY_LIMIT; c++) {
      fetchNext();
    }
  }

  /* --------------------------------------------------------------------------
     5. LENIS SMOOTH SCROLL & GSAP SCROLLTRIGGER (MAKHAN SMOOTH TUNING)
     -------------------------------------------------------------------------- */
  let lenisInstance = null;

  window.scrollToContact = () => {
    const maxScroll = document.body.scrollHeight;
    if (lenisInstance) {
      lenisInstance.scrollTo(maxScroll, { duration: 2.2 });
    } else {
      window.scrollTo({ top: maxScroll, behavior: "smooth" });
    }
  };

  function initScrollExperience() {
    const isMobile = window.innerWidth <= 768;

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    if (typeof Lenis !== 'undefined') {
      try {
        lenisInstance = new Lenis({
          duration: isMobile ? 1.2 : 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          wheelMultiplier: 0.85,
          touchMultiplier: isMobile ? 1.4 : 1.2
        });

        lenisInstance.on('scroll', () => {
          if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.update();
        });

        gsap.ticker.add((time) => {
          lenisInstance.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
      } catch (err) {
        console.warn("Lenis init fallback:", err);
      }
    }

    // Ensure we start precisely at top
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { immediate: true });
    }
    window.scrollTo(0, 0);

    // DOM Elements for Storylines
    const secCh1 = document.getElementById("sec-ch1");
    const secCh2 = document.getElementById("sec-ch2");
    const secCh3 = document.getElementById("sec-ch3");
    const secCh4 = document.getElementById("sec-ch4");
    const secCh5 = document.getElementById("sec-ch5");
    const secCh6 = document.getElementById("sec-ch6");
    const secCh7 = document.getElementById("sec-ch7");
    const secCh8 = document.getElementById("sec-ch8");
    const secCh9 = document.getElementById("sec-ch9");
    const secCta = document.getElementById("sec-cta");

    let currentActiveSec = secCh1;

    function updateActiveSection(p) {
      let targetSec = null;
      if (p >= 0.000 && p < 0.070) {
        targetSec = secCh1; // Terrace Sanctuary Opening Hero
      } else if (p >= 0.145 && p < 0.190) {
        targetSec = secCh2; // Grand Foyer
      } else if (p >= 0.238 && p < 0.280) {
        targetSec = secCh3; // Living Pavilion
      } else if (p >= 0.314 && p < 0.380) {
        targetSec = secCh4; // Bouclé Lounge
      } else if (p >= 0.465 && p < 0.525) {
        targetSec = secCh5; // Classical Salon
      } else if (p >= 0.581 && p < 0.635) {
        targetSec = secCh6; // Dining & Library
      } else if (p >= 0.674 && p < 0.740) {
        targetSec = secCh7; // Floating Staircase
      } else if (p >= 0.808 && p < 0.850) {
        targetSec = secCh8; // Executive Suite
      } else if (p >= 0.884 && p < 0.940) {
        targetSec = secCh9; // Vanity & Study Nook
      } else if (p >= 0.965) {
        targetSec = secCta; // Zenora Concierge & Digital Card
      }

      if (targetSec !== currentActiveSec) {
        if (currentActiveSec) currentActiveSec.classList.remove("active");
        if (targetSec) targetSec.classList.add("active");
        currentActiveSec = targetSec;
      }
    }

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: "#scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.25,
        onUpdate: (self) => {
          const p = self.progress;
          targetFrameIdx = Math.min(Math.floor(p * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1);
          updateActiveSection(p);
        }
      });
      ScrollTrigger.refresh();
    } else {
      window.addEventListener('scroll', () => {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const p = Math.min(1, Math.max(0, window.scrollY / maxScroll));
        targetFrameIdx = Math.min(Math.floor(p * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1);
        updateActiveSection(p);
      }, { passive: true });
    }

    // Initial draw
    drawCanvasFrame(0);
  }
});
