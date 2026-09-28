/* ==========================================================================
   ZENORA DESIGNS // LUXURY HOME TOUR SCROLL ENGINE (1,738 HD FRAMES)
   3 Architectural Living Rooms + 7 Grand Suites & Atriums
   Decoupled 60/120FPS RAF Engine with Ultra-Smooth Weighted Scrub
   BMW M4 Floating Minimalist Luxury DNA · Pure Cinematic Walkthrough
   Powered by GSAP ScrollTrigger & Lenis Smooth Scroll
   ========================================================================== */

// Prevent browser restoring previous scroll position upon refresh
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// Global hard scroll blocker during initial preload phase
function preventScroll(e) {
  e.preventDefault();
}
window.addEventListener('wheel', preventScroll, { passive: false });
window.addEventListener('touchmove', preventScroll, { passive: false, capture: true });

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  /* --------------------------------------------------------------------------
     1. ASSET CONFIGURATION & FAST STAGED PRELOADER
     -------------------------------------------------------------------------- */
  const TOTAL_FRAMES = 1738;
  const INITIAL_THRESHOLD = 40; // Only ~3.5MB needed to unlock immediate experience
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

  // Start experience helper (safely called once threshold reached or timeout fallback)
  function startExperience() {
    if (experienceStarted) return;
    experienceStarted = true;

    // Release scroll blockers
    window.removeEventListener('wheel', preventScroll);
    window.removeEventListener('touchmove', preventScroll, { capture: true });
    document.body.classList.remove("scroll-locked");
    window.scrollTo(0, 0);

    // Fade out preloader
    if (preloader) {
      preloader.classList.add("loaded");
    }

    // Initialize Lenis and ScrollTrigger
    initScrollExperience();

    // Stream remaining frames in the background
    startBackgroundLoader();
  }

  // Handle stage 1 preloading
  function onInitialFrameLoaded(index, img) {
    frames[index] = img;
    loadedCount++;

    const pct = Math.min(100, Math.round((loadedCount / INITIAL_THRESHOLD) * 100));
    if (preloaderBar) preloaderBar.style.width = `${pct}%`;
    if (preloaderSubText) {
      preloaderSubText.textContent = `INITIALIZING 3D VILLA SANCTUARY... ${pct}%`;
    }

    // Render frame 0 immediately onto canvas as soon as first frame arrives
    if (index === 0 || (!lastValidImg && img && img.naturalWidth > 0)) {
      lastValidImg = img;
      targetFrameIdx = 0;
      currentRenderedIdx = -1;
      drawCanvasFrame(0);
    }

    if (loadedCount >= INITIAL_THRESHOLD) {
      setTimeout(startExperience, 250);
    }
  }

  // Preload initial batch (first 40 frames)
  for (let i = 0; i < INITIAL_THRESHOLD; i++) {
    const img = new Image();
    img.onload = () => onInitialFrameLoaded(i, img);
    img.onerror = () => onInitialFrameLoaded(i, null);
    img.src = getFramePath(i + 1);
  }

  // Fallback timer: Never leave user waiting more than 3.5s if network is slow
  setTimeout(() => {
    if (!experienceStarted && loadedCount >= 10) {
      startExperience();
    }
  }, 3500);

  /* --------------------------------------------------------------------------
     BACKGROUND STREAMING FOR REMAINING FRAMES (40 to 1737)
     -------------------------------------------------------------------------- */
  function startBackgroundLoader() {
    let nextIndex = INITIAL_THRESHOLD;
    const CONCURRENCY = 6;
    let activeWorkers = 0;

    function fetchNext() {
      while (activeWorkers < CONCURRENCY && nextIndex < TOTAL_FRAMES) {
        const idx = nextIndex++;
        if (frames[idx]) continue; // already requested by demand scrub

        activeWorkers++;
        const img = new Image();
        img.onload = () => {
          frames[idx] = img;
          activeWorkers--;
          fetchNext();
        };
        img.onerror = () => {
          activeWorkers--;
          fetchNext();
        };
        img.src = getFramePath(idx + 1);
      }
    }

    fetchNext();
  }

  /* --------------------------------------------------------------------------
     2. HIGH-PERFORMANCE DECOUPLED RAF CANVAS ENGINE
     -------------------------------------------------------------------------- */
  let currentRenderedIdx = -1;
  let targetFrameIdx = 0;

  const resizeCanvas = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    currentRenderedIdx = -1; // Force immediate repaint
    if (experienceStarted) {
      drawCanvasFrame(targetFrameIdx);
    }
  };

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // Find closest loaded frame if requested index is still streaming
  function getNearestLoadedFrame(targetIdx) {
    if (frames[targetIdx] && frames[targetIdx].complete && frames[targetIdx].naturalWidth > 0) {
      return frames[targetIdx];
    }
    // Search backward first (most natural for forward scrubbing)
    for (let i = targetIdx - 1; i >= 0; i--) {
      if (frames[i] && frames[i].complete && frames[i].naturalWidth > 0) {
        return frames[i];
      }
    }
    // Search forward
    for (let i = targetIdx + 1; i < TOTAL_FRAMES; i++) {
      if (frames[i] && frames[i].complete && frames[i].naturalWidth > 0) {
        return frames[i];
      }
    }
    return lastValidImg;
  }

  // Request on-demand priority load if user scrubs far ahead
  function requestPriorityFrame(idx) {
    if (idx < 0 || idx >= TOTAL_FRAMES) return;
    if (!frames[idx]) {
      const img = new Image();
      frames[idx] = img;
      img.onload = () => {
        if (targetFrameIdx === idx) {
          drawCanvasFrame(idx);
        }
      };
      img.src = getFramePath(idx + 1);
    }
  }

  function drawCanvasFrame(index) {
    if (index < 0 || index >= TOTAL_FRAMES) return;

    // Prioritize loading current and surrounding frames
    requestPriorityFrame(index);
    requestPriorityFrame(index + 1);
    requestPriorityFrame(index + 2);

    let img = getNearestLoadedFrame(index);
    if (img && img.complete && img.naturalWidth > 0) {
      lastValidImg = img;
    } else if (lastValidImg) {
      img = lastValidImg;
    }

    if (!img) return;

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

  // Dedicated RAF animation loop (Zero stutter, 60/120fps sync)
  function rafRenderLoop() {
    if (currentRenderedIdx !== targetFrameIdx) {
      currentRenderedIdx = targetFrameIdx;
      drawCanvasFrame(currentRenderedIdx);
    }
    requestAnimationFrame(rafRenderLoop);
  }
  requestAnimationFrame(rafRenderLoop);

  /* --------------------------------------------------------------------------
     3. LENIS SMOOTH SCROLL & GSAP SCROLLTRIGGER (DESKTOP & MOBILE TUNING)
     -------------------------------------------------------------------------- */
  let lenisInstance = null;

  window.scrollToContact = () => {
    const maxScroll = document.body.scrollHeight;
    if (lenisInstance) {
      lenisInstance.scrollTo(maxScroll, { duration: 2.0 });
    } else {
      window.scrollTo({ top: maxScroll, behavior: "smooth" });
    }
  };

  function initScrollExperience() {
    const isMobile = window.innerWidth <= 768;

    lenisInstance = new Lenis({
      duration: isMobile ? 1.0 : 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: isMobile ? 1.0 : 0.75,
      touchMultiplier: isMobile ? 1.8 : 1.2,
      syncTouch: true
    });

    lenisInstance.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Ensure we start precisely at top
    lenisInstance.scrollTo(0, { immediate: true });
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

    const allSections = [
      secCh1, secCh2, secCh3, secCh4, secCh5,
      secCh6, secCh7, secCh8, secCh9, secCta
    ];

    function showOnlySection(activeSec) {
      allSections.forEach(sec => {
        if (!sec) return;
        if (sec === activeSec) {
          sec.classList.add("active");
        } else {
          sec.classList.remove("active");
        }
      });
    }

    ScrollTrigger.create({
      trigger: "#scroll-container",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.25, // Buttery momentum scrub
      onUpdate: (self) => {
        const p = self.progress;

        // Update target frame for decoupled RAF loop
        targetFrameIdx = Math.min(Math.floor(p * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1);

        /* --------------------------------------------------------------------
           COMFORTABLE READING WINDOWS + CLEAN UNBLOCKED VIEW:
           Floating typography appears cleanly at the beginning of each scene,
           then fades away so 100% of the screen is pure, cinematic walkthrough!
           -------------------------------------------------------------------- */
        if (p >= 0.000 && p < 0.070) {
          showOnlySection(secCh1); // Terrace Sanctuary Opening Hero
        } else if (p >= 0.145 && p < 0.190) {
          showOnlySection(secCh2); // Grand Foyer
        } else if (p >= 0.238 && p < 0.280) {
          showOnlySection(secCh3); // Living Pavilion
        } else if (p >= 0.314 && p < 0.380) {
          showOnlySection(secCh4); // Bouclé Lounge
        } else if (p >= 0.465 && p < 0.525) {
          showOnlySection(secCh5); // Classical Salon
        } else if (p >= 0.581 && p < 0.635) {
          showOnlySection(secCh6); // Dining & Library
        } else if (p >= 0.674 && p < 0.740) {
          showOnlySection(secCh7); // Floating Staircase
        } else if (p >= 0.808 && p < 0.850) {
          showOnlySection(secCh8); // Executive Suite
        } else if (p >= 0.884 && p < 0.940) {
          showOnlySection(secCh9); // Vanity & Study Nook
        } else if (p >= 0.965) {
          showOnlySection(secCta); // Zenora Concierge & Digital Card
        } else {
          // In between: ALL TEXT FADED OUT! 100% UNBLOCKED CINEMATIC WALKTHROUGH!
          showOnlySection(null);
        }
      }
    });

    // Initial draw
    drawCanvasFrame(0);
  }
});
