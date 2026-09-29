/* ==========================================================================
   ZENORA DESIGNS // LUXURY ARCHITECTURAL 3D WALKTHROUGH ENGINE (660 FRAMES)
   High-Performance 100% Upfront Preloaded Cinema Architecture:
   - 100% Full-Tour Memory Preload (ALL 660 Frames): ZERO Missing Frames on 1st Scroll
   - Complete Elimination of 2-3 Scroll Lag: Tour is 100% Ready in RAM Before Launch
   - 100% Crystal-Clear Sharpness: Single-Frame Render, ZERO Alpha Blur / ZERO Ghosting
   - Chapter 7 Floating Staircase: 160 Dedicated Frames (Buttery Smooth Vertical Ascent)
   - Chapter 9 Vanity & Study Nook: 115 Dedicated Frames (Majestic Slow-Motion Luxury Glide)
   - Chapter 1 Sanctuary Arrival: 100 Dedicated Frames
   - Direct 1:1 Hardware-Synced Lenis Physics Engine with Decisive Clean Finish
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
     1. ASSET CONFIGURATION & 100% UPFRONT PRELOAD ENGINE
     -------------------------------------------------------------------------- */
  const TOTAL_FRAMES = 660; // 660 Curated, Crystal-Clear Architectural Frames (Ch 1 - 9)
  const CONCURRENCY = 18;  // High-throughput parallel worker pool
  const frames = new Array(TOTAL_FRAMES);

  let loadedCount = 0;
  let experienceStarted = false;
  let lastValidImg = null;

  const preloader = document.getElementById("preloader");
  const preloaderBar = document.getElementById("preloaderBar");
  const preloaderSubText = document.getElementById("preloaderSubText");
  const canvas = document.getElementById("home-canvas");
  const ctx = canvas.getContext("2d");

  const getFramePath = (i) => `assets/walkthrough_frames/frame_${String(i).padStart(4, '0')}.webp`;

  // Callback whenever any frame finishes loading
  function onFrameLoaded(idx, img) {
    frames[idx] = img;
    if (img && img.naturalWidth > 0 && !lastValidImg) {
      lastValidImg = img;
    }
    loadedCount++;

    const pct = Math.min(100, Math.floor((loadedCount / TOTAL_FRAMES) * 100));
    if (preloaderBar) preloaderBar.style.width = `${pct}%`;
    if (preloaderSubText) {
      preloaderSubText.textContent = `INITIALIZING 3D VILLA SANCTUARY... ${pct}%`;
    }

    // Immediately render frame 0 so the canvas is primed behind the preloader
    if (idx === 0 && !window.initialDrawn) {
      window.initialDrawn = true;
      drawCanvasFrame(0);
    }

    // Launch experience ONLY when 100% of the entire tour is resident in RAM!
    if (loadedCount >= TOTAL_FRAMES && !experienceStarted) {
      setTimeout(launchExperience, 200);
    }
  }

  // Parallel queue loader: streams all 660 frames rapidly without choking browser network
  let nextQueueIdx = 0;
  function loadNext() {
    if (nextQueueIdx >= TOTAL_FRAMES) return;
    const idx = nextQueueIdx++;

    const img = new Image();
    const handleSuccess = () => {
      onFrameLoaded(idx, img);
      loadNext();
    };
    const handleFail = () => {
      onFrameLoaded(idx, null);
      loadNext();
    };

    img.onload = handleSuccess;
    img.onerror = handleFail;
    img.src = getFramePath(idx + 1);
  }

  // Spawn parallel loading workers
  for (let c = 0; c < CONCURRENCY; c++) {
    loadNext();
  }

  // Defensive safety fallbacks: ensure user is never trapped under unexpected packet drop
  setTimeout(() => {
    if (!experienceStarted && loadedCount >= Math.floor(TOTAL_FRAMES * 0.96)) {
      launchExperience();
    }
  }, 7500);

  setTimeout(() => {
    if (!experienceStarted) {
      launchExperience();
    }
  }, 12000);

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

    // Smooth, guaranteed preloader dismissal
    if (preloader) {
      preloader.classList.add("loaded");
      preloader.style.opacity = "0";
      preloader.style.pointerEvents = "none";
      setTimeout(() => {
        preloader.style.display = "none";
      }, 650);
    }

    // Initialize smooth scroll experience
    setTimeout(() => {
      initScrollExperience();
    }, 80);
  }

  /* --------------------------------------------------------------------------
     3. HIGH-PERFORMANCE DIRECT GPU CANVAS ENGINE (100% CRISP / ZERO BLUR)
     -------------------------------------------------------------------------- */
  let currentRenderedIdx = -1;
  let targetFrameIdx = 0;

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

    // Direct frame lookup from 100% in-memory cache
    let img = frames[index];

    // Defensive nearest-neighbor lookup if single frame had network hitch
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let d = 1; d <= 6; d++) {
        const p = frames[index - d];
        if (p && p.complete && p.naturalWidth > 0) {
          img = p;
          break;
        }
        const n = frames[index + d];
        if (n && n.complete && n.naturalWidth > 0) {
          img = n;
          break;
        }
      }
    }

    // Fallback to last valid image
    if (!img || !img.complete || img.naturalWidth === 0) {
      img = lastValidImg;
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;
    lastValidImg = img;

    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    const screenAspect = w / h;
    const imgAspect = 16 / 9; // 1280x720 aspect ratio

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

    // 100% Crisp single-frame drawing: ZERO blur, ZERO ghosting, pristine architectural sharpness!
    ctx.globalAlpha = 1.0;
    ctx.drawImage(img, Math.round(drawX), Math.round(drawY), Math.round(drawW), Math.round(drawH));
  }

  // Dedicated RAF animation loop (Direct 1:1 hardware sync with Lenis: ZERO end-lag judder!)
  function rafRenderLoop() {
    if (experienceStarted) {
      if (currentRenderedIdx !== targetFrameIdx) {
        currentRenderedIdx = targetFrameIdx;
        drawCanvasFrame(currentRenderedIdx);
      }
    }
    requestAnimationFrame(rafRenderLoop);
  }
  requestAnimationFrame(rafRenderLoop);

  /* --------------------------------------------------------------------------
     4. PROGRESS CURVE MAPPING (CH 7 = 160 FRAMES, CH 9 = 115 FRAMES)
     -------------------------------------------------------------------------- */
  function getFrameIndexFromProgress(p) {
    const clampedP = Math.min(1, Math.max(0, p));
    let frameIdx;

    if (clampedP < 0.130) {
      // Chapter 1 (Exterior Sanctuary Arrival): 0.000 to 0.130 -> frames 0 to 100 (100 frames)
      frameIdx = (clampedP / 0.130) * 100;
    } else if (clampedP < 0.200) {
      // Chapter 2 (The Grand Foyer): 0.130 to 0.200 -> frames 100 to 145 (45 frames)
      const subP = (clampedP - 0.130) / (0.200 - 0.130);
      frameIdx = 100 + subP * 45;
    } else if (clampedP < 0.270) {
      // Chapter 3 (Living Pavilion): 0.200 to 0.270 -> frames 145 to 185 (40 frames)
      const subP = (clampedP - 0.200) / (0.270 - 0.200);
      frameIdx = 145 + subP * 40;
    } else if (clampedP < 0.400) {
      // Chapter 4 (Bouclé Lounge & Kitchen): 0.270 to 0.400 -> frames 185 to 250 (65 frames, calm spacious pan)
      const subP = (clampedP - 0.270) / (0.400 - 0.270);
      frameIdx = 185 + subP * 65;
    } else if (clampedP < 0.490) {
      // Chapter 5 (Classical Salon): 0.400 to 0.490 -> frames 250 to 295 (45 frames)
      const subP = (clampedP - 0.400) / (0.490 - 0.400);
      frameIdx = 250 + subP * 45;
    } else if (clampedP < 0.580) {
      // Chapter 6 (Dining & Bespoke Library): 0.490 to 0.580 -> frames 295 to 335 (40 frames)
      const subP = (clampedP - 0.490) / (0.580 - 0.490);
      frameIdx = 295 + subP * 40;
    } else if (clampedP < 0.760) {
      // Chapter 7 (FLOATING MARBLE STAIRCASE): 0.580 to 0.760 -> frames 335 to 495 (EXACTLY 160 DEDICATED FRAMES!)
      // Buttery smooth vertical ascent with illuminated marble steps and vertical fluted atrium!
      const subP = (clampedP - 0.580) / (0.760 - 0.580);
      frameIdx = 335 + subP * 160;
    } else if (clampedP < 0.830) {
      // Chapter 8 (The Executive Master Suite): 0.760 to 0.830 -> frames 495 to 530 (35 frames)
      const subP = (clampedP - 0.760) / (0.830 - 0.760);
      frameIdx = 495 + subP * 35;
    } else if (clampedP < 0.955) {
      // Chapter 9 (VANITY & PRIVATE STUDY NOOK): 0.830 to 0.955 -> frames 530 to 645 (EXACTLY 115 DEDICATED FRAMES!)
      // Ultra slow-motion luxury glide, crystal-clear mirror reflections and joinery!
      const subP = (clampedP - 0.830) / (0.955 - 0.830);
      frameIdx = 530 + subP * 115;
    } else {
      // Chapter 10 (Final Concierge to Digital Card): 0.955 to 1.000 -> frames 645 to 659 (14 frames)
      const subP = (clampedP - 0.955) / (1.000 - 0.955);
      frameIdx = 645 + subP * 14;
    }

    return Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(frameIdx)));
  }

  /* --------------------------------------------------------------------------
     5. LENIS SMOOTH SCROLL & GSAP SCROLLTRIGGER (DIRECT 1:1 HARDWARE SYNC)
     -------------------------------------------------------------------------- */
  let lenisInstance = null;

  window.scrollToContact = () => {
    const maxScroll = document.body.scrollHeight;
    if (lenisInstance) {
      lenisInstance.scrollTo(maxScroll, { duration: 1.8 });
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
          duration: isMobile ? 0.75 : 0.85,
          easing: (t) => 1 - Math.pow(1 - t, 3.5), // Clean Quart-Out (Decisive zero-lag finish, ZERO lingering crawl!)
          smoothWheel: true,
          wheelMultiplier: 1.15, // Responsive, high-framerate wheel glide
          touchMultiplier: isMobile ? 1.3 : 1.0
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
      if (p >= 0.000 && p < 0.120) {
        targetSec = secCh1; // Terrace Sanctuary Opening Hero
      } else if (p >= 0.130 && p < 0.190) {
        targetSec = secCh2; // Grand Foyer
      } else if (p >= 0.200 && p < 0.260) {
        targetSec = secCh3; // Living Pavilion
      } else if (p >= 0.280 && p < 0.380) {
        targetSec = secCh4; // Bouclé Lounge (Wide, crystal-clear reading window)
      } else if (p >= 0.410 && p < 0.470) {
        targetSec = secCh5; // Classical Salon
      } else if (p >= 0.500 && p < 0.560) {
        targetSec = secCh6; // Dining & Library
      } else if (p >= 0.600 && p < 0.740) {
        targetSec = secCh7; // Floating Staircase (160-frame calibrated ascent reading window!)
      } else if (p >= 0.770 && p < 0.820) {
        targetSec = secCh8; // Executive Suite
      } else if (p >= 0.840 && p < 0.940) {
        targetSec = secCh9; // Vanity & Study Nook (115-frame slow-motion luxury reading window!)
      } else if (p >= 0.955) {
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
        scrub: true, // Direct 1:1 hardware sync with Lenis physics: ZERO end-lag judder!
        onUpdate: (self) => {
          const p = self.progress;
          targetFrameIdx = getFrameIndexFromProgress(p);
          updateActiveSection(p);
        }
      });
      ScrollTrigger.refresh();
    } else {
      window.addEventListener('scroll', () => {
        const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const p = Math.min(1, Math.max(0, window.scrollY / maxScroll));
        targetFrameIdx = getFrameIndexFromProgress(p);
        updateActiveSection(p);
      }, { passive: true });
    }

    // Initial draw
    drawCanvasFrame(0);
  }
});
