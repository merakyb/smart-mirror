/**
 * Webcam Viewfinder Component (Step 2)
 * Manages live video stream, target alignment guide, 3s countdown, camera flash effect,
 * and base64 image capture for Gemini API Vision Analysis.
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
      <div class="glass-panel animate-fade-in" style="padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; align-items: center; width: 100%;">
        <div style="width: 100%; display: flex; justify-content: space-between; align-items: center;">
          <h3 style="font-size: 1.1rem; font-weight: 700; color: var(--color-primary); display: flex; align-items: center; gap: 0.5rem;">
            <span>📷</span> 거울 뷰파인더 (실시간 웹캠)
          </h3>
          <span class="pill-badge badge-good" style="font-size: 0.7rem; font-family: var(--font-mono);">
            LIVE WEBCAM STREAM
          </span>
        </div>

        <!-- Viewfinder Box -->
        <div class="viewfinder-box" id="viewfinderBox">
          <video id="mirrorVideo" class="viewfinder-video" autoplay playsinline muted></video>
          <div class="viewfinder-overlay"></div>
          <div class="scanline-effect"></div>
          
          <!-- Countdown Overlay -->
          <div class="countdown-overlay" id="countdownOverlay" style="display: none;">3</div>
          
          <!-- Gemini AI Loading Overlay -->
          <div class="countdown-overlay" id="loadingOverlay" style="display: none; flex-direction: column; gap: 1rem; background: rgba(11, 15, 23, 0.85);">
            <div style="width: 52px; height: 52px; border: 4px solid var(--color-primary); border-top-color: transparent; border-radius: 50%; animation: spin 0.9s linear infinite;"></div>
            <div style="font-size: 1.1rem; font-weight: 700; color: var(--color-text-main);">Gemini AI 옷차림 분석 중...</div>
            <div style="font-size: 0.8rem; color: var(--color-primary); font-family: var(--font-mono);">gemini-flash-latest 모델 작동 중</div>
          </div>
        </div>

        <!-- Main Scan Button -->
        <button class="btn-scan" id="btnScan" style="width: 100%; justify-content: center;">
          📸 옷차림 스캔 / 촬영 시작
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
    // 1. Camera Flash Animation
    const flashEl = document.createElement('div');
    flashEl.className = 'flash-animation';
    document.body.appendChild(flashEl);
    setTimeout(() => flashEl.remove(), 400);

    // 2. Base64 Frame Capture
    const canvas = document.createElement('canvas');
    if (this.videoEl && this.videoEl.style.display !== 'none') {
      canvas.width = this.videoEl.videoWidth || 640;
      canvas.height = this.videoEl.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(this.videoEl, 0, 0, canvas.width, canvas.height);
    } else {
      // Use fallback canvas size
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#1E293B';
      ctx.fillRect(0, 0, 640, 480);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '20px Noto Sans KR';
      ctx.fillText('샘플 옷차림 촬영 캡처', 200, 240);
    }
    const base64Image = canvas.toDataURL('image/jpeg', 0.85);

    // 3. Show Gemini AI Loading Overlay
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) loadingOverlay.style.display = 'flex';

    // 4. Trigger Callback
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
