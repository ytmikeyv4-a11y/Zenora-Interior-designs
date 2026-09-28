/**
 * ZENORA DESIGNS - Ultra-Luxury Scroll Animation Marketing Engine
 * Dual-Mode:
 * 1. 60fps Video Frame Scrubbing (when frames are generated from video clips)
 * 2. Cinematic Multi-Scene 4K Architectural Depth Panning (built-in fallback using client renders)
 * + Synchronized Apple-style typography fade in/out on scroll
 */

class ZenoraWalkthrough {
  constructor(canvasId, containerId) {
    this.canvas = document.getElementById(canvasId);
    this.container = document.getElementById(containerId);
    if (!this.canvas || !this.container) return;

    this.ctx = this.canvas.getContext('2d');
    this.currentProgress = 0;
    this.targetProgress = 0;

    // Configuration for video frames
    this.frameCount = 0;
    this.frameImages = [];
    this.hasVideoFrames = false;

    // High-res scene stills for built-in marketing tour
    this.scenes = [
      {
        src: 'assets/images/hero-lounge-4k.jpeg',
        img: null,
        zoomStart: 1.0,
        zoomEnd: 1.14,
        panXStart: 0.0,
        panXEnd: -0.04
      },
      {
        src: 'assets/images/seating-lounge-fluted.jpeg',
        img: null,
        zoomStart: 1.10,
        zoomEnd: 1.0,
        panXStart: -0.03,
        panXEnd: 0.03
      },
      {
        src: 'assets/images/feature-wall-luxury.jpeg',
        img: null,
        zoomStart: 1.02,
        zoomEnd: 1.15,
        panXStart: 0.02,
        panXEnd: -0.02
      },
      {
        src: 'assets/images/panoramic-workspace.jpeg',
        img: null,
        zoomStart: 1.04,
        zoomEnd: 1.12,
        panXStart: -0.04,
        panXEnd: 0.04
      }
    ];

    this.captions = document.querySelectorAll('.scroll-caption');
    this.init();
  }

  init() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Preload still images
    let loadedCount = 0;
    this.scenes.forEach(scene => {
      const img = new Image();
      img.src = scene.src;
      img.onload = () => {
        scene.img = img;
        loadedCount++;
        if (loadedCount === 1) this.draw();
      };
    });

    // Check if video frames exist
    this.checkVideoFrames();

    // Scroll listener
    window.addEventListener('scroll', () => this.onScroll(), { passive: true });

    // Start RAF loop
    this.loop();
  }

  resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = Math.floor(this.width * dpr);
    this.canvas.height = Math.floor(this.height * dpr);
    this.ctx.scale(dpr, dpr);
    this.draw();
  }

  async checkVideoFrames() {
    try {
      const resp = await fetch('assets/frames/manifest.json');
      if (resp.ok) {
        const manifest = await resp.json();
        this.frameCount = manifest.frameCount || 0;
        if (this.frameCount > 0) {
          console.log(`Zenora Walkthrough: Video frames detected (${this.frameCount} frames)`);
          this.hasVideoFrames = true;
          this.loadVideoFrames(manifest);
          return;
        }
      }
    } catch (e) {}

    // Fallback probe
    const probe = new Image();
    probe.src = 'assets/frames/frame_0001.webp';
    probe.onload = () => {
      this.hasVideoFrames = true;
      this.frameCount = 300;
      this.loadVideoFrames({ prefix: 'frame_', digits: 4, format: 'webp' });
    };
    probe.onerror = () => {
      this.hasVideoFrames = false;
    };
  }

  loadVideoFrames(manifest) {
    this.frameImages = new Array(this.frameCount);
    let firstLoaded = false;
    for (let i = 1; i <= this.frameCount; i++) {
      const img = new Image();
      const numStr = String(i).padStart(manifest.digits || 4, '0');
      img.src = `assets/frames/${manifest.prefix || 'frame_'}${numStr}.${manifest.format || 'webp'}`;
      img.onload = () => {
        if (!firstLoaded && i === 1) {
          firstLoaded = true;
          this.lastRenderedImg = img;
          this.draw();
        }
      };
      this.frameImages[i - 1] = img;
    }
  }

  onScroll() {
    const rect = this.container.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalDist = rect.height - windowHeight;
    const scrolled = -rect.top;

    let progress = scrolled / totalDist;
    progress = Math.max(0, Math.min(1, progress));
    this.targetProgress = progress;

    this.updateHUD(progress);
    this.updateCaptions(progress);
  }

  updateHUD(progress) {
    const percentEl = document.getElementById('walkthrough-progress-percent');
    const barEl = document.getElementById('walkthrough-progress-bar');
    const titleEl = document.getElementById('walkthrough-scene-title');
    const descEl = document.getElementById('walkthrough-scene-desc');
    const stepEl = document.getElementById('walkthrough-step-indicator');
    const pct = Math.round(progress * 100);

    if (percentEl) percentEl.textContent = `${pct}%`;
    if (barEl) barEl.style.width = `${pct}%`;

    const chapters = [
      { step: 'PHASE 01 / 04', title: '01 / The Exterior Sanctuary', desc: 'Terrace & Courtyard — Modern Pergola & Zen Arrival' },
      { step: 'PHASE 02 / 04', title: '02 / The Foyer Walkthrough', desc: 'Architectural Transition — High Ceilings & Hardwood Gallery' },
      { step: 'PHASE 03 / 04', title: '03 / The Living & Dining Pavilion', desc: 'Sunlit Open Architecture — Glass Dining Table & Barcelona Lounge' },
      { step: 'PHASE 04 / 04', title: '04 / The Executive Suite', desc: 'Rare. Refined. Divine. — Fluted Oak & 3000K Warm Cove Lighting' }
    ];

    let chIdx = 0;
    if (progress >= 0.77) chIdx = 3;
    else if (progress >= 0.52) chIdx = 2;
    else if (progress >= 0.24) chIdx = 1;

    const ch = chapters[chIdx];
    if (stepEl && stepEl.textContent !== ch.step) stepEl.textContent = ch.step;
    if (titleEl && titleEl.textContent !== ch.title) titleEl.textContent = ch.title;
    if (descEl && descEl.textContent !== ch.desc) descEl.textContent = ch.desc;
  }

  updateCaptions(p) {
    if (!this.captions || this.captions.length === 0) return;

    this.captions.forEach(el => {
      const start = parseFloat(el.getAttribute('data-start') || '0');
      const end = parseFloat(el.getAttribute('data-end') || '1');

      if (p >= start && p <= end) {
        // Fade in and out within range
        const mid = (start + end) / 2;
        const halfSpan = (end - start) / 2;
        const distFromMid = Math.abs(p - mid) / halfSpan;
        const opacity = Math.max(0, Math.min(1, 1 - Math.pow(distFromMid, 2.5)));
        const translateY = (distFromMid * 15) * (p < mid ? 1 : -1);

        el.style.opacity = opacity.toFixed(3);
        el.style.transform = `translateY(${translateY.toFixed(1)}px)`;
        el.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
      } else {
        el.style.opacity = '0';
        el.style.pointerEvents = 'none';
      }
    });
  }

  loop() {
    const diff = this.targetProgress - this.currentProgress;
    if (Math.abs(diff) > 0.0002) {
      this.currentProgress += diff * 0.14;
      this.draw();
      this.updateCaptions(this.currentProgress);
    } else if (this.currentProgress !== this.targetProgress) {
      this.currentProgress = this.targetProgress;
      this.draw();
      this.updateCaptions(this.currentProgress);
    }
    requestAnimationFrame(() => this.loop());
  }

  draw() {
    if (!this.ctx || !this.width || !this.height) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.hasVideoFrames && this.frameImages.length > 0) {
      this.drawVideoFrame();
    } else {
      this.drawCinematicScene();
    }

    this.drawLuxuryVignette();
  }

  drawVideoFrame() {
    if (!this.frameImages || this.frameImages.length === 0) return;
    const frameIndex = Math.min(
      Math.floor(this.currentProgress * (this.frameImages.length - 1)),
      this.frameImages.length - 1
    );
    let img = this.frameImages[frameIndex];
    if (img && img.complete && img.naturalWidth > 0) {
      this.lastRenderedImg = img;
    } else if (this.lastRenderedImg) {
      img = this.lastRenderedImg;
    }

    if (img && (img.complete || img.naturalWidth > 0)) {
      const canvasAspect = this.width / this.height;
      const imgAspect = img.width / img.height;

      let drawW, drawH;
      if (canvasAspect > imgAspect) {
        drawW = this.width;
        drawH = this.width / imgAspect;
      } else {
        drawH = this.height;
        drawW = this.height * imgAspect;
      }

      const offsetX = (this.width - drawW) / 2;
      const offsetY = (this.height - drawH) / 2;
      this.ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    }
  }

  drawCinematicScene() {
    const totalScenes = this.scenes.length;
    const globalProgress = this.currentProgress * (totalScenes - 1);
    const sceneIndex = Math.min(Math.floor(globalProgress), totalScenes - 2);
    const sceneProgress = globalProgress - sceneIndex;

    const curr = this.scenes[sceneIndex];
    const next = this.scenes[sceneIndex + 1];

    if (curr && curr.img) {
      this.ctx.save();
      this.ctx.globalAlpha = 1.0;
      this.renderSceneCover(curr, sceneProgress);
      this.ctx.restore();
    }

    if (next && next.img && sceneProgress > 0.35) {
      this.ctx.save();
      const blend = (sceneProgress - 0.35) / 0.65;
      this.ctx.globalAlpha = Math.min(1, Math.max(0, blend));
      this.renderSceneCover(next, sceneProgress);
      this.ctx.restore();
    }
  }

  renderSceneCover(scene, progress) {
    const img = scene.img;
    if (!img) return;

    const zoom = scene.zoomStart + (scene.zoomEnd - scene.zoomStart) * progress;
    const panX = scene.panXStart + (scene.panXEnd - scene.panXStart) * progress;

    const canvasAspect = this.width / this.height;
    const imgAspect = img.width / img.height;

    let drawW, drawH;
    if (canvasAspect > imgAspect) {
      drawW = this.width * zoom;
      drawH = (this.width / imgAspect) * zoom;
    } else {
      drawH = this.height * zoom;
      drawW = (this.height * imgAspect) * zoom;
    }

    const offsetX = (this.width - drawW) / 2 + panX * this.width;
    const offsetY = (this.height - drawH) / 2;

    this.ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  }

  drawLuxuryVignette() {
    // Cinematic luxury darkened gradient so marketing text is 100% crisp & readable
    const gradient = this.ctx.createRadialGradient(
      this.width / 2, this.height / 2, Math.min(this.width, this.height) * 0.25,
      this.width / 2, this.height / 2, Math.max(this.width, this.height) * 0.8
    );
    gradient.addColorStop(0, 'rgba(13, 12, 11, 0.25)');
    gradient.addColorStop(0.65, 'rgba(13, 12, 11, 0.65)');
    gradient.addColorStop(1, 'rgba(13, 12, 11, 0.92)');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }
}

window.ZenoraWalkthrough = ZenoraWalkthrough;
