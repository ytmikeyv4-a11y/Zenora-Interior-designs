/* ==========================================================================
   ZENORA DESIGNS // LUXURY ARCHITECTURAL 3D WALKTHROUGH ENGINE (1,738 FRAMES)
   Dual-Tier Continuous Hybrid Engine:
   - Tier 1: 240 Preloaded Foundation Frames (Zero-Gap 100% Instant 1st-Scroll)
   - Tier 2: 1,738 Ultra-HD 60FPS Continuous Frame Streamer
   - Pacing Deceleration for Chapter 9 (Majestic Vanity & Study Nook Glide)
   - Chapter 4 Instant Sharpness & Zero Motion-Blur
   - Lenis Smooth Scroll & GSAP ScrollTrigger Integration
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
     1. ASSET CONFIGURATION & DUAL-TIER ENGINE
     -------------------------------------------------------------------------- */
  const BASE_FRAMES_COUNT = 240;
  const TOTAL_HD_FRAMES = 1738;
  const INITIAL_BASE_THRESHOLD = 75; // Fast launch: wait for ~2MB of foundation frames

  const baseFrames = new Array(BASE_FRAMES_COUNT);
  const hdFrames = new Array(TOTAL_HD_FRAMES);

  let baseLoadedCount = 0;
  let experienceStarted = false;
  let lastValidImg = null;

  const preloader = document.getElementById("preloader");
  const preloaderBar = document.getElementById("preloaderBar");
  const preloaderSubText = document.getElementById("preloaderSubText");
  const canvas = document.getElementById("home-canvas");
  const ctx = canvas.getContext("2d");

  const getBaseFramePath = (i) => `assets/tour_frames/frame_${String(i).padStart(4, '0')}.webp`;
  const getHdFramePath = (i) => `assets/frames/frame_${String(i).padStart(4, '0')}.webp`;

  // Preload base tour frames for instant 1st-scroll availability across the whole tour
  function onBaseFrameLoaded(idx, img) {
    baseFrames[idx] = img;
    if (img && img.naturalWidth > 0 && !lastValidImg) {
      lastValidImg = img;
    }
    baseLoadedCount++;

    const pct = Math.min(100, Math.round((baseLoadedCount / INITIAL_BASE_THRESHOLD) * 100));
    if (preloaderBar) preloaderBar.style.width = `${pct}%`;
    if (preloaderSubText) {
      preloaderSubText.textContent = `INITIALIZING 3D VILLA SANCTUARY... ${pct}%`;
    }

    // Render frame 0 immediately once first 5 foundation frames arrive
    if (baseLoadedCount >= 5 && !window.initialDrawn) {
      window.initialDrawn = true;
      drawCanvasFrame(0);
    }

    if (baseLoadedCount >= INITIAL_BASE_THRESHOLD && !experienceStarted) {
      launchExperience();
    }
  }

  // Initiate all 240 base foundation frames (~6.88 MB total)
  for (let i = 0; i < BASE_FRAMES_COUNT; i++) {
    const img = new Image();
    img.onload = () => onBaseFrameLoaded(i, img);
    img.onerror = () => onBaseFrameLoaded(i, null);
    img.src = getBaseFramePath(i + 1);
  }

  // Safety fallback: launch experience after 2.8s maximum so user never waits
  setTimeout(() => {
    if (!experienceStarted) {
      launchExperience();
    }
  }, 2800);

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

    // Initialize smooth scroll & HD background streamer
    setTimeout(() => {
      initScrollExperience();
      startBackgroundHdStreaming();
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
    if (index < 0 || index >= TOTAL_HD_FRAMES) return;

    // Tier 1: Exact HD frame
    let img = hdFrames[index];

    // Tier 2: Nearest adjacent HD frame within ±5 frames
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let d = 1; d <= 5; d++) {
        const p = hdFrames[index - d];
        if (p && p.complete && p.naturalWidth > 0) {
          img = p;
          break;
        }
        const n = hdFrames[index + d];
        if (n && n.complete && n.naturalWidth > 0) {
          img = n;
          break;
        }
      }
    }

    // Tier 3: Preloaded Base Tour Frame (guarantees zero gaps on 1st scroll!)
    if (!img || !img.complete || img.naturalWidth === 0) {
      const baseIdx = Math.min(BASE_FRAMES_COUNT - 1, Math.round((index / (TOTAL_HD_FRAMES - 1)) * (BASE_FRAMES_COUNT - 1)));
      let baseImg = baseFrames[baseIdx];

      if (!baseImg || !baseImg.complete || baseImg.naturalWidth === 0) {
        for (let bd = 1; bd <= 12; bd++) {
          const bp = baseFrames[baseIdx - bd];
          if (bp && bp.complete && bp.naturalWidth > 0) {
            baseImg = bp;
            break;
          }
          const bn = baseFrames[baseIdx + bd];
          if (bn && bn.complete && bn.naturalWidth > 0) {
            baseImg = bn;
            break;
          }
        }
      }

      if (baseImg && baseImg.complete && baseImg.naturalWidth > 0) {
        img = baseImg;
      }
    }

    // Tier 4: Fallback to last valid image
    if (!img || !img.complete || img.naturalWidth === 0) {
      img = lastValidImg;
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
      // Continuous liquid lerp (0.30 = velvety steadycam response without stepping)
      const diff = targetFrameIdx - smoothRenderedFrame;
      if (Math.abs(diff) > 0.04) {
        smoothRenderedFrame += diff * 0.30;
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
     4. SMART DIRECTIONAL HD BACKGROUND STREAMER (PRIORITY QUEUE)
     -------------------------------------------------------------------------- */
  function startBackgroundHdStreaming() {
    const CONCURRENCY_LIMIT = 24; // High parallel HTTP/2 multiplexed streams
    let activeDownloads = 0;
    let sequentialPointer = 0;

    function fetchNext() {
      if (activeDownloads >= CONCURRENCY_LIMIT) return;

      let nextIndex = -1;
      const currentPos = Math.round(smoothRenderedFrame);

      // Priority 1: Check 70 frames ahead of the user's current scroll direction
      for (let offset = 0; offset <= 70; offset++) {
        const candidate = currentPos + offset;
        if (candidate < TOTAL_HD_FRAMES && !hdFrames[candidate]) {
          nextIndex = candidate;
          break;
        }
      }

      // Priority 2: Check 30 frames behind
      if (nextIndex === -1) {
        for (let offset = 1; offset <= 30; offset++) {
          const candidate = currentPos - offset;
          if (candidate >= 0 && !hdFrames[candidate]) {
            nextIndex = candidate;
            break;
          }
        }
      }

      // Priority 3: Sequential load the rest of the tour
      if (nextIndex === -1) {
        while (sequentialPointer < TOTAL_HD_FRAMES && hdFrames[sequentialPointer]) {
          sequentialPointer++;
        }
        if (sequentialPointer < TOTAL_HD_FRAMES) {
          nextIndex = sequentialPointer;
          sequentialPointer++;
        }
      }

      if (nextIndex === -1) return; // All 1,738 HD frames loaded!

      activeDownloads++;
      const img = new Image();
      hdFrames[nextIndex] = img; // Mark as requested to prevent duplicate requests

      const onComplete = () => {
        activeDownloads--;
        fetchNext();
      };

      img.onload = onComplete;
      img.onerror = onComplete;
      img.src = getHdFramePath(nextIndex + 1);

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
     5. PROGRESS CURVE MAPPING (CHAPTER 9 PACING & CHAPTER 4 CLARITY)
     -------------------------------------------------------------------------- */
  function getFrameIndexFromProgress(p) {
    const clampedP = Math.min(1, Math.max(0, p));

    // Cinematic curve:
    // - 0.00 to 0.82: linear mapping to frames 0..1420 (Exterior to Executive Master Suite)
    // - 0.82 to 0.96: slow, luxurious pan for Chapter 9 (Vanity & Study Nook: frames 1420..1660)
    // - 0.96 to 1.00: final glide to CTA card (frames 1660..1737)
    let frameIdx;
    if (clampedP < 0.82) {
      frameIdx = (clampedP / 0.82) * 1420;
    } else if (clampedP < 0.96) {
      const subP = (clampedP - 0.82) / (0.96 - 0.82);
      frameIdx = 1420 + subP * 240;
    } else {
      const subP = (clampedP - 0.96) / (1.00 - 0.96);
      frameIdx = 1660 + subP * 77;
    }
    return Math.min(TOTAL_HD_FRAMES - 1, Math.max(0, Math.round(frameIdx)));
  }

  /* --------------------------------------------------------------------------
     6. LENIS SMOOTH SCROLL & GSAP SCROLLTRIGGER (MAKHAN SMOOTH TUNING)
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
      if (p >= 0.000 && p < 0.075) {
        targetSec = secCh1; // Terrace Sanctuary Opening Hero
      } else if (p >= 0.135 && p < 0.185) {
        targetSec = secCh2; // Grand Foyer
      } else if (p >= 0.230 && p < 0.275) {
        targetSec = secCh3; // Living Pavilion
      } else if (p >= 0.320 && p < 0.385) {
        targetSec = secCh4; // Bouclé Lounge (Crystal-clear window)
      } else if (p >= 0.450 && p < 0.510) {
        targetSec = secCh5; // Classical Salon
      } else if (p >= 0.575 && p < 0.630) {
        targetSec = secCh6; // Dining & Library
      } else if (p >= 0.670 && p < 0.735) {
        targetSec = secCh7; // Floating Staircase
      } else if (p >= 0.795 && p < 0.845) {
        targetSec = secCh8; // Executive Suite
      } else if (p >= 0.865 && p < 0.945) {
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
        scrub: 0.25,
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
