/* ==========================================================================
   ZENORA DESIGNS // LUXURY HOME TOUR SCROLL ENGINE (1,738 HD FRAMES)
   3 Architectural Living Rooms + 7 Grand Suites & Atriums
   Decoupled 60/120FPS RAF Engine with Ultra-Smooth Weighted Scrub
   BMW M4 Floating Minimalist Luxury DNA · Pure Cinematic Walkthrough
   Powered by GSAP ScrollTrigger & Lenis Smooth Scroll
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  /* --------------------------------------------------------------------------
     1. ASSET CONFIGURATION & PRELOADER
     -------------------------------------------------------------------------- */
  const TOTAL_FRAMES = 1738;
  const frames = [];
  let loadedCount = 0;
  let lastValidImg = null;

  const preloader = document.getElementById("preloader");
  const preloaderBar = document.getElementById("preloaderBar");
  const preloaderSubText = document.getElementById("preloaderSubText");
  const canvas = document.getElementById("home-canvas");
  const ctx = canvas.getContext("2d");

  const getFramePath = (i) => `assets/frames/frame_${String(i).padStart(4, '0')}.webp`;

  const onAssetLoaded = () => {
    loadedCount++;
    const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
    if (preloaderBar) preloaderBar.style.width = `${pct}%`;
    if (preloaderSubText && loadedCount % 80 === 0) {
      preloaderSubText.textContent = `LOADING VILLA ARCHITECTURE // ${loadedCount}/${TOTAL_FRAMES} FRAMES (${pct}%)`;
    }

    // Render initial frame once first 10 frames arrive for instant visual response
    if (loadedCount === 10 && !window.initialDrawn) {
      window.initialDrawn = true;
      targetFrameIdx = 0;
      currentRenderedIdx = -1;
    }

    if (loadedCount === TOTAL_FRAMES) {
      setTimeout(() => {
        if (preloader) preloader.classList.add("loaded");
        initScrollExperience();
      }, 300);
    }
  };

  // Preload all 1,738 frames
  for (let i = 1; i <= TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = getFramePath(i);
    img.onload = onAssetLoaded;
    img.onerror = onAssetLoaded;
    frames.push(img);
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
  };

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  function drawCanvasFrame(index) {
    if (index < 0 || index >= TOTAL_FRAMES) return;
    let img = frames[index];
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
     3. LENIS SMOOTH SCROLL & GSAP SCROLLTRIGGER (MAKHAN SMOOTH TUNING)
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
    lenisInstance = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.75, // Weighted, dignified, liquid scroll feel
      touchMultiplier: 1.2
    });

    lenisInstance.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

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
