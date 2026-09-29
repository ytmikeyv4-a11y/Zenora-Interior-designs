/* ==========================================================================
   ZENORA DESIGNS // LUXURY ARCHITECTURAL 3D WALKTHROUGH ENGINE (1,738 FRAMES)
   Direct 1:1 Hardware-Synced Lenis Physics Engine:
   - 100% Crystal-Clear Sharpness: ZERO Alpha Blur / ZERO Double Ghosting
   - Tier 1: 580 Preloaded Foundation Frames (Zero-Gap Instant 1st-Scroll)
   - Tier 2: 1,738 Ultra-HD 60FPS Continuous Frame Streamer (120-frame lookahead)
   - Wide Pacing Curve for Chapter 4 (Bouclé Lounge & Kitchen: Calm Spacious Pan)
   - Expanded Deceleration Curve for Chapter 9 (Majestic Vanity & Study Nook Glide)
   - Lenis Smooth Scroll & GSAP ScrollTrigger Direct 1:1 Sync
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
  const BASE_FRAMES_COUNT = 580;
  const TOTAL_HD_FRAMES = 1738;
  const INITIAL_BASE_THRESHOLD = 180; // Fast launch: wait for first 4.5MB of foundation frames

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

  const getBaseFramePath = (i) => `assets/walkthrough_frames/frame_${String(i).padStart(4, '0')}.webp`;
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

  // Initiate base foundation frames in parallel
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
    if (index < 0 || index >= TOTAL_HD_FRAMES) return;

    // Tier 1: Exact HD frame
    let img = hdFrames[index];

    // Tier 2: Nearest adjacent HD frame within ±6 frames
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let d = 1; d <= 6; d++) {
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

    // Tier 3: Preloaded Base Foundation Frame (580 frames)
    if (!img || !img.complete || img.naturalWidth === 0) {
      const baseIdx = Math.min(BASE_FRAMES_COUNT - 1, Math.round((index / (TOTAL_HD_FRAMES - 1)) * (BASE_FRAMES_COUNT - 1)));
      let baseImg = baseFrames[baseIdx];

      if (!baseImg || !baseImg.complete || baseImg.naturalWidth === 0) {
        for (let bd = 1; bd <= 8; bd++) {
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

    // 100% Crisp single-frame drawing: ZERO blur, ZERO ghosting, pristine architectural sharpness!
    ctx.globalAlpha = 1.0;
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
     4. SMART DIRECTIONAL HD BACKGROUND STREAMER (PRIORITY QUEUE)
     -------------------------------------------------------------------------- */
  function startBackgroundHdStreaming() {
    const CONCURRENCY_LIMIT = 24; // High parallel HTTP/2 multiplexed streams
    let activeDownloads = 0;
    let sequentialPointer = 0;

    function fetchNext() {
      if (activeDownloads >= CONCURRENCY_LIMIT) return;

      let nextIndex = -1;
      const currentPos = targetFrameIdx;

      // Priority 1: Check 120 frames ahead of the user's current scroll direction
      for (let offset = 0; offset <= 120; offset++) {
        const candidate = currentPos + offset;
        if (candidate < TOTAL_HD_FRAMES && !hdFrames[candidate]) {
          nextIndex = candidate;
          break;
        }
      }

      // Priority 2: Check 40 frames behind
      if (nextIndex === -1) {
        for (let offset = 1; offset <= 40; offset++) {
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
     5. PROGRESS CURVE MAPPING (CHAPTER 4 CALM ENTRY & CHAPTER 9 PACING)
     -------------------------------------------------------------------------- */
  function getFrameIndexFromProgress(p) {
    const clampedP = Math.min(1, Math.max(0, p));
    let frameIdx;

    if (clampedP < 0.30) {
      // Chapters 1 - 3: 0.00 to 0.30 maps to frames 0 to 520
      frameIdx = (clampedP / 0.30) * 520;
    } else if (clampedP < 0.46) {
      // Chapter 4 (Bouclé Lounge & Kitchen): 0.30 to 0.46 (16% scroll track) maps to 520..760 (calm, spacious pan)
      const subP = (clampedP - 0.30) / (0.46 - 0.30);
      frameIdx = 520 + subP * 240;
    } else if (clampedP < 0.85) {
      // Chapters 5 - 8: 0.46 to 0.85 maps to frames 760 to 1500
      const subP = (clampedP - 0.46) / (0.85 - 0.46);
      frameIdx = 760 + subP * 740;
    } else if (clampedP < 0.96) {
      // Chapter 9 (Vanity & Study Nook): 0.85 to 0.96 (11% scroll track) maps to 1500..1660 (luxurious slow glide!)
      const subP = (clampedP - 0.85) / (0.96 - 0.85);
      frameIdx = 1500 + subP * 160;
    } else {
      // Final overview to CTA card: 0.96 to 1.00 maps to 1660..1737
      const subP = (clampedP - 0.96) / (1.00 - 0.96);
      frameIdx = 1660 + subP * 77;
    }

    return Math.min(TOTAL_HD_FRAMES - 1, Math.max(0, Math.round(frameIdx)));
  }

  /* --------------------------------------------------------------------------
     6. LENIS SMOOTH SCROLL & GSAP SCROLLTRIGGER (DIRECT 1:1 HARDWARE SYNC)
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

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    if (typeof Lenis !== 'undefined') {
      try {
        lenisInstance = new Lenis({
          duration: isMobile ? 0.75 : 0.85,
          easing: (t) => 1 - Math.pow(1 - t, 3.5), // Clean Quart-Out (Reaches zero cleanly, ZERO dragging asymptotic tail!)
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
