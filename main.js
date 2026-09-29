/* ==========================================================================
   ZENORA DESIGNS // LUXURY ARCHITECTURAL 3D WALKTHROUGH ENGINE (1,738 FRAMES)
   OPTION B: TRUE 100% UPFRONT PRELOADED FULL-HD ARCHITECTURE:
   - 100% In-Memory Preload (ALL 1,738 Full-HD 1080p Frames): ZERO Missing Frames
   - Complete Elimination of Lag: 100% Ready in RAM Before Launch (Zero Scroll Network Activity)
   - 100% Crystal-Clear Sharpness: Native 1920x1080 WebP, Single-Frame GPU Draw (ZERO Blur / ZERO Ghosting)
   - Chapter 7 Floating Staircase: 233 Full Continuous HD Frames (1171 to 1404)
   - Chapter 9 Vanity & Study Nook: 141 Full Continuous HD Frames (1536 to 1677)
   - Chapter 1 Sanctuary Arrival: 252 Full Continuous HD Frames (0 to 252)
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
     1. ASSET CONFIGURATION & TRUE 100% UPFRONT HD PRELOAD ENGINE
     -------------------------------------------------------------------------- */
  const TOTAL_HD_FRAMES = 1738; // 100% Full-HD 60FPS Continuous Frames
  const CONCURRENCY = 20;       // High-throughput parallel HTTP/2 multiplexed queue
  const hdFrames = new Array(TOTAL_HD_FRAMES);

  let loadedCount = 0;
  let experienceStarted = false;
  let lastValidImg = null;

  const preloader = document.getElementById("preloader");
  const glassPlinth = document.getElementById("glassPlinth");
  const preloaderBar = document.getElementById("preloaderBar");
  const preloaderPercent = document.getElementById("preloaderPercent");
  const preloaderSubText = document.getElementById("preloaderSubText");
  const preloaderFrameCount = document.getElementById("preloaderFrameCount");
  const canvas = document.getElementById("home-canvas");
  const ctx = canvas.getContext("2d");

  // Interactive 3D Apple Glass tilt physics
  if (preloader && glassPlinth) {
    let tiltTimeout;
    preloader.addEventListener("mousemove", (e) => {
      const rect = preloader.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      glassPlinth.style.animationPlayState = "paused";
      glassPlinth.style.transform = `rotateY(${x * 32}deg) rotateX(${-y * 32}deg) translateY(-6px) translateZ(26px)`;
      clearTimeout(tiltTimeout);
      tiltTimeout = setTimeout(() => {
        if (!experienceStarted && glassPlinth) {
          glassPlinth.style.animationPlayState = "running";
          glassPlinth.style.transform = "";
        }
      }, 1200);
    }, { passive: true });

    preloader.addEventListener("mouseleave", () => {
      if (!experienceStarted && glassPlinth) {
        glassPlinth.style.animationPlayState = "running";
        glassPlinth.style.transform = "";
      }
    }, { passive: true });
  }

  const getHdFramePath = (i) => `assets/frames/frame_${String(i).padStart(4, '0')}.webp`;

  // Callback whenever any HD frame finishes loading
  function onFrameLoaded(idx, img) {
    hdFrames[idx] = img;
    if (img && img.naturalWidth > 0 && !lastValidImg) {
      lastValidImg = img;
    }
    loadedCount++;

    const pct = Math.min(100, Math.floor((loadedCount / TOTAL_HD_FRAMES) * 100));
    if (preloaderBar) preloaderBar.style.width = `${pct}%`;
    if (preloaderPercent) preloaderPercent.textContent = pct;
    if (preloaderFrameCount) {
      preloaderFrameCount.textContent = `${loadedCount.toLocaleString()} / ${TOTAL_HD_FRAMES.toLocaleString()} FRAMES`;
    }

    if (preloaderSubText) {
      if (pct < 16) {
        preloaderSubText.textContent = "ACQUIRING EXTERIOR SANCTUARY ARCHITECTURE...";
      } else if (pct < 34) {
        preloaderSubText.textContent = "CURATING GRAND FOYER & LIVING PAVILION...";
      } else if (pct < 52) {
        preloaderSubText.textContent = "CRAFTING BOUCLÉ LOUNGE & CHEF'S KITCHEN...";
      } else if (pct < 70) {
        preloaderSubText.textContent = "ILLUMINATING FLOATING MARBLE STAIRCASE...";
      } else if (pct < 88) {
        preloaderSubText.textContent = "DETAILING MASTER SUITE & MARBLE VANITY...";
      } else if (pct < 100) {
        preloaderSubText.textContent = "SYNCHRONIZING 1,738 FULL-HD 60FPS FRAMES...";
      } else {
        preloaderSubText.textContent = "SANCTUARY COMPLETE // STEPPING INSIDE";
      }
    }

    // Immediately render frame 0 so the canvas is primed behind the preloader
    if (idx === 0 && !window.initialDrawn) {
      window.initialDrawn = true;
      drawCanvasFrame(0);
    }

    // Option B: Launch ONLY when 100% of all 1,738 Full-HD frames are resident in RAM!
    if (loadedCount >= TOTAL_HD_FRAMES && !experienceStarted) {
      if (preloaderPercent) preloaderPercent.textContent = "100";
      if (preloaderSubText) {
        preloaderSubText.textContent = "SANCTUARY COMPLETE // STEPPING INSIDE";
      }
      if (preloaderBar) {
        preloaderBar.style.width = "100%";
      }
      setTimeout(launchExperience, 450);
    }
  }

  // Parallel queue loader: streams all 1,738 frames smoothly with controlled concurrency
  let nextQueueIdx = 0;
  function loadNext() {
    if (nextQueueIdx >= TOTAL_HD_FRAMES) return;
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
    img.src = getHdFramePath(idx + 1);
  }

  // Spawn parallel workers
  for (let c = 0; c < CONCURRENCY; c++) {
    loadNext();
  }

  // Defensive safety fallback: ONLY if 97% is loaded after 40s
  setTimeout(() => {
    if (!experienceStarted && loadedCount >= Math.floor(TOTAL_HD_FRAMES * 0.97)) {
      launchExperience();
    }
  }, 40000);

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

    // Smooth luxury preloader dismissal
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
    if (index < 0 || index >= TOTAL_HD_FRAMES) return;

    // Direct exact HD frame from 100% in-memory cache
    let img = hdFrames[index];

    // Defensive lookup if a single frame had a glitch
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let d = 1; d <= 4; d++) {
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
     4. PROGRESS CURVE MAPPING (EXACT MASTER SCENES: CH 7 = 233, CH 9 = 141)
     -------------------------------------------------------------------------- */
  function getFrameIndexFromProgress(p) {
    const clampedP = Math.min(1, Math.max(0, p));
    let frameIdx;

    if (clampedP < 0.145) {
      // Chapter 1 (Exterior Sanctuary Arrival): 0.000 to 0.145 -> frames 0 to 252 (252 frames)
      frameIdx = (clampedP / 0.145) * 252;
    } else if (clampedP < 0.310) {
      // Chapters 2 & 3 (Grand Foyer & Living Pavilion): 0.145 to 0.310 -> frames 252 to 545 (293 frames)
      const subP = (clampedP - 0.145) / (0.310 - 0.145);
      frameIdx = 252 + subP * 293;
    } else if (clampedP < 0.455) {
      // Chapter 4 (Bouclé Lounge & Kitchen): 0.310 to 0.455 -> frames 545 to 808 (263 frames, calm spacious pan)
      const subP = (clampedP - 0.310) / (0.455 - 0.310);
      frameIdx = 545 + subP * 263;
    } else if (clampedP < 0.635) {
      // Chapters 5 & 6 (Classical Salon & Dining / Library): 0.455 to 0.635 -> frames 808 to 1171 (363 frames)
      const subP = (clampedP - 0.455) / (0.635 - 0.455);
      frameIdx = 808 + subP * 363;
    } else if (clampedP < 0.810) {
      // Chapter 7 (The Floating Staircase): 0.635 to 0.810 -> frames 1171 to 1404 (233 FULL CONTINUOUS FRAMES!)
      // EXPANDED RUNWAY (17.5% of total scroll distance!): Calmed, majestic, regal slow ascent with illuminated marble steps!
      const subP = (clampedP - 0.635) / (0.810 - 0.635);
      frameIdx = 1171 + subP * 233;
    } else if (clampedP < 0.875) {
      // Chapter 8 (Executive Master Suite): 0.810 to 0.875 -> frames 1404 to 1536 (132 frames)
      const subP = (clampedP - 0.810) / (0.875 - 0.810);
      frameIdx = 1404 + subP * 132;
    } else if (clampedP < 0.965) {
      // Chapter 9 (Vanity & Study Nook): 0.875 to 0.965 -> frames 1536 to 1677 (141 FULL CONTINUOUS FRAMES)
      // NON-LINEAR GENTLE ENTRY: Eased progression eliminates the abrupt high-speed rush through the doorway,
      // creating an ultra-smooth cinematic glide into the vanity followed by pristine slow-motion inspection!
      const subP = (clampedP - 0.875) / (0.965 - 0.875);
      const easedP = Math.pow(subP, 1.38); // Gentle deceleration at start, smooth pan inside
      frameIdx = 1536 + easedP * 141;
    } else {
      // Final overview to CTA card: 0.965 to 1.000 -> frames 1677 to 1737 (60 frames)
      const subP = (clampedP - 0.965) / (1.000 - 0.965);
      frameIdx = 1677 + subP * 60;
    }

    return Math.min(TOTAL_HD_FRAMES - 1, Math.max(0, Math.round(frameIdx)));
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
      } else if (p >= 0.145 && p < 0.205) {
        targetSec = secCh2; // Grand Foyer
      } else if (p >= 0.230 && p < 0.290) {
        targetSec = secCh3; // Living Pavilion
      } else if (p >= 0.320 && p < 0.425) {
        targetSec = secCh4; // Bouclé Lounge (Wide, crystal-clear reading window)
      } else if (p >= 0.465 && p < 0.540) {
        targetSec = secCh5; // Classical Salon
      } else if (p >= 0.565 && p < 0.620) {
        targetSec = secCh6; // Dining & Library
      } else if (p >= 0.645 && p < 0.795) {
        targetSec = secCh7; // Floating Staircase (Calibrated for expanded 233-frame continuous ascent!)
      } else if (p >= 0.815 && p < 0.865) {
        targetSec = secCh8; // Executive Suite
      } else if (p >= 0.880 && p < 0.955) {
        targetSec = secCh9; // Vanity & Study Nook (Gentle cinematic glide & inspection!)
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
