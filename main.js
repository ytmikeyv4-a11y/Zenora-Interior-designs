/* ==========================================================================
   ZENORA DESIGNS // LUXURY ARCHITECTURAL 3D WALKTHROUGH ENGINE (580 FRAMES)
   High-Performance 100% Preloaded Cinema Architecture:
   - 100% Upfront Preloaded Memory Store: ZERO Missing Frames on 1st Scroll
   - Direct 1:1 Hardware-Synced Lenis Physics Engine (Decisive Zero-Judder Finish)
   - Calibrated Calm Easing Curve for Chapter 4 (Bouclé Lounge & Kitchen: Zero Blur)
   - Expanded Deceleration Curve for Chapter 9 (Majestic Vanity & Study Nook Glide)
   - GPU-Decoded WebP Bitmaps (img.decode()) for Zero-Lag 60FPS Rasterization
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
     1. ASSET CONFIGURATION & FAST 100% PRELOAD ENGINE
     -------------------------------------------------------------------------- */
  const TOTAL_FRAMES = 580;
  const CONCURRENCY = 24; // High-throughput parallel HTTP/2 download pool
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

  // Callback whenever any frame finishes loading & GPU decoding
  function onFrameLoaded(idx, img) {
    frames[idx] = img;
    if (img && img.naturalWidth > 0 && !lastValidImg) {
      lastValidImg = img;
    }
    loadedCount++;

    const pct = Math.min(100, Math.round((loadedCount / TOTAL_FRAMES) * 100));
    if (preloaderBar) preloaderBar.style.width = `${pct}%`;
    if (preloaderSubText) {
      preloaderSubText.textContent = `INITIALIZING 3D VILLA SANCTUARY... ${pct}%`;
    }

    // Immediately render frame 0 so the canvas is primed behind the preloader
    if (idx === 0 && !window.initialDrawn) {
      window.initialDrawn = true;
      drawCanvasFrame(0);
    }

    // When 100% of the frames are loaded into RAM, launch with crisp 250ms completion pause
    if (loadedCount >= TOTAL_FRAMES && !experienceStarted) {
      setTimeout(launchExperience, 250);
    }
  }

  // High-performance parallel queue loader
  let nextQueueIdx = 0;
  function loadNext() {
    if (nextQueueIdx >= TOTAL_FRAMES) return;
    const idx = nextQueueIdx++;

    const img = new Image();
    const handleSuccess = () => {
      if ('decode' in img) {
        img.decode().then(() => onFrameLoaded(idx, img)).catch(() => onFrameLoaded(idx, img));
      } else {
        onFrameLoaded(idx, img);
      }
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

  // Safety fallbacks: Ensure user is never trapped in case of rare network packet loss
  setTimeout(() => {
    if (!experienceStarted && loadedCount >= Math.floor(TOTAL_FRAMES * 0.90)) {
      launchExperience();
    }
  }, 4500);

  setTimeout(() => {
    if (!experienceStarted) {
      launchExperience();
    }
  }, 7500);

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

    // Initialize smooth scroll & story triggers
    setTimeout(() => {
      initScrollExperience();
    }, 80);
  }

  /* --------------------------------------------------------------------------
     3. HIGH-PERFORMANCE DIRECT GPU CANVAS ENGINE (ZERO STUTTER / ZERO LAG)
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

    // 1. Direct exact frame from 100% preloaded memory store
    let img = frames[index];

    // 2. Defensive nearest-neighbor lookup if single frame had network hitch
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let d = 1; d <= 8; d++) {
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

    // 3. Fallback to last valid image
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

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
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
     4. PROGRESS CURVE MAPPING (CHAPTER 4 CALM ENTRY & CHAPTER 9 PACING)
     -------------------------------------------------------------------------- */
  function getFrameIndexFromProgress(p) {
    const clampedP = Math.min(1, Math.max(0, p));
    let frameIdx;

    if (clampedP < 0.30) {
      // Chapters 1 - 3 (Arrival, Grand Foyer, Living Pavilion): 0.00 to 0.30 -> frames 0 to 173
      frameIdx = (clampedP / 0.30) * 173;
    } else if (clampedP < 0.46) {
      // Chapter 4 (Bouclé Lounge & Kitchen): 0.30 to 0.46 (16% scroll track) -> frames 173 to 253
      // Calibrated wide pacing curve: calm, spacious, cinematic glide (ZERO blur, ZERO rushing)
      const subP = (clampedP - 0.30) / (0.46 - 0.30);
      frameIdx = 173 + subP * 80;
    } else if (clampedP < 0.85) {
      // Chapters 5 - 8 (Salon, Dining, Staircase, Suite): 0.46 to 0.85 -> frames 253 to 500
      const subP = (clampedP - 0.46) / (0.85 - 0.46);
      frameIdx = 253 + subP * 247;
    } else if (clampedP < 0.96) {
      // Chapter 9 (Vanity & Study Nook): 0.85 to 0.96 (11% scroll track) -> frames 500 to 553
      // Expanded deceleration window: ultra-luxurious slow motion reading glide
      const subP = (clampedP - 0.85) / (0.96 - 0.85);
      frameIdx = 500 + subP * 53;
    } else {
      // Final overview to CTA card: 0.96 to 1.00 -> frames 553 to 579
      const subP = (clampedP - 0.96) / (1.00 - 0.96);
      frameIdx = 553 + subP * 26;
    }

    return Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(frameIdx)));
  }

  /* --------------------------------------------------------------------------
     5. LENIS SMOOTH SCROLL & GSAP SCROLLTRIGGER (DECISIVE CLEAN FINISHING)
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
          duration: isMobile ? 0.70 : 0.80,
          easing: (t) => 1 - Math.pow(1 - t, 3.5), // Clean Quart-Out (Reaches zero decisively, ZERO dragging lingering crawl!)
          smoothWheel: true,
          wheelMultiplier: 1.15, // Immediate, responsive glide
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
      if (p >= 0.000 && p < 0.065) {
        targetSec = secCh1; // Terrace Sanctuary Opening Hero
      } else if (p >= 0.110 && p < 0.170) {
        targetSec = secCh2; // Grand Foyer
      } else if (p >= 0.220 && p < 0.275) {
        targetSec = secCh3; // Living Pavilion
      } else if (p >= 0.320 && p < 0.420) {
        targetSec = secCh4; // Bouclé Lounge (Wide, crystal-clear reading window)
      } else if (p >= 0.480 && p < 0.540) {
        targetSec = secCh5; // Classical Salon
      } else if (p >= 0.595 && p < 0.650) {
        targetSec = secCh6; // Dining & Library
      } else if (p >= 0.695 && p < 0.750) {
        targetSec = secCh7; // Floating Staircase
      } else if (p >= 0.795 && p < 0.840) {
        targetSec = secCh8; // Executive Suite
      } else if (p >= 0.865 && p < 0.940) {
        targetSec = secCh9; // Vanity & Study Nook (Majestic slow-motion reading window)
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
