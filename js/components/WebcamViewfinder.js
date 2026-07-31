/**
 * Webcam Viewfinder Component
 * Handles MediaDevices stream, framing overlay, countdown timer, and flash capture
 */

export class WebcamViewfinderComponent {
  constructor(containerId, onScanTriggered) {
    this.container = document.getElementById(containerId);
    this.onScanTriggered = onScanTriggered;
    this.stream = null;
    this.videoEl = null;
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 1rem; align-items: center; width: 100%;">
        <!-- Viewfinder -->
        <div class="viewfinder-box" id="viewfinderBox">
          <video id="mirrorVideo" class="viewfinder-video" autoplay playsinline muted></video>
          <div class="viewfinder-overlay"></div>
          <div class="scanline-effect"></div>
          
          <!-- Countdown Overlay (Hidden by default) -->
          <div class="countdown-overlay" id="countdownOverlay" style="display: none;">3</div>
          
          <!-- AI Loading Overlay (Hidden by default) -->
          <div class="countdown-overlay" id="loadingOverlay" style="display: none; flex-direction: column; gap: 1rem;">
            <div style="width: 48px; height: 48px; border: 4px solid var(--color-primary); border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <div style="font-size: 1rem; color: var(--color-text-main);">Gemini AI 옷차림 분석 중...</div>
          </div>
        </div>

        <!-- Scan Button -->
        <button class="btn-scan" id="btnScan">
          📸 옷차림 스캔 / 촬영
        </button>
      </div>

      <style>
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;

    this.videoEl = document.getElementById('mirrorVideo');
    this.initWebcam();

    const scanBtn = document.getElementById('btnScan');
    if (scanBtn) {
      scanBtn.addEventListener('click', () => this.startScanSequence());
    }
  }

  async initWebcam() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 960 }, facingMode: 'user' }
      });
      if (this.videoEl) {
        this.videoEl.srcObject = this.stream;
      }
    } catch (err) {
      console.warn('[WebcamViewfinder] Webcam access failed or denied:', err);
      // Fallback placeholder image when camera is unavailable
      if (this.videoEl && this.videoEl.parentElement) {
        this.videoEl.parentElement.style.backgroundImage = "url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80')";
        this.videoEl.parentElement.style.backgroundSize = "cover";
        this.videoEl.style.display = "none";
      }
    }
  }

  startScanSequence() {
    const countdownOverlay = document.getElementById('countdownOverlay');
    const scanBtn = document.getElementById('btnScan');

    if (scanBtn) scanBtn.disabled = true;
    if (!countdownOverlay) return;

    let count = 3;
    countdownOverlay.style.display = 'flex';
    countdownOverlay.textContent = count;

    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        countdownOverlay.textContent = count;
      } else {
        clearInterval(timer);
        countdownOverlay.style.display = 'none';
        this.triggerFlashAndCapture();
      }
    }, 1000);
  }

  triggerFlashAndCapture() {
    // 1. Create camera flash effect
    const flashEl = document.createElement('div');
    flashEl.className = 'flash-animation';
    document.body.appendChild(flashEl);
    setTimeout(() => flashEl.remove(), 400);

    // 2. Capture video frame to Base64
    const canvas = document.createElement('canvas');
    canvas.width = this.videoEl.videoWidth || 640;
    canvas.height = this.videoEl.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(this.videoEl, 0, 0, canvas.width, canvas.height);
    const base64Image = canvas.toDataURL('image/jpeg', 0.85);

    // 3. Show Loading
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) loadingOverlay.style.display = 'flex';

    // 4. Trigger callback to app
    if (this.onScanTriggered) {
      this.onScanTriggered(base64Image).finally(() => {
        if (loadingOverlay) loadingOverlay.style.display = 'none';
        const scanBtn = document.getElementById('btnScan');
        if (scanBtn) scanBtn.disabled = false;
      });
    }
  }

  destroy() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
  }
}
