/**
 * Smart Mirror Assistant - Step 2 Application Orchestrator
 * Integrates Weather Service, Gemini API Vision Analysis (gemini-flash-latest),
 * Webcam Viewfinder, Virtual Neopixel LED Sync, and Outfit Gallery.
 */

import { fetchCurrentWeather, getUserCoordinates } from './services/weatherService.js';
import { analyzeOutfitWithGemini } from './services/geminiService.js';
import { fetchRecommendedOutfits } from './services/imageService.js';

import { HeaderComponent } from './components/Header.js';
import { VirtualIndicatorsComponent } from './components/VirtualIndicators.js';
import { WebcamViewfinderComponent } from './components/WebcamViewfinder.js';
import { DiagnosisPanelComponent } from './components/DiagnosisPanel.js';
import { OutfitGalleryComponent } from './components/OutfitGallery.js';

class SmartMirrorApp {
  constructor() {
    this.weatherData = null;
    this.coords = null;
    this.diagnosisData = null;
    this.recommendedOutfits = [];

    // Instantiate Step 2 UI Components
    this.header = new HeaderComponent('headerSlot');
    this.indicators = new VirtualIndicatorsComponent('virtualIndicatorsSlot');
    this.viewfinder = new WebcamViewfinderComponent('viewfinderSlot', (base64Image) => this.handleScan(base64Image));
    this.diagnosisPanel = new DiagnosisPanelComponent('diagnosisSlot');
    this.gallery = new OutfitGalleryComponent('gallerySlot');
  }

  async init() {
    console.log('[SmartMirrorApp] Initializing Step 2: Webcam & Gemini AI Vision Analysis...');

    // 1. Initial Render with Placeholders
    this.header.render(null);
    this.indicators.render('Clear');
    this.viewfinder.render();
    this.diagnosisPanel.render(null);
    this.gallery.render([]);

    // 2. Resolve Geolocation & Fetch Live Weather
    this.coords = await getUserCoordinates();
    this.weatherData = await fetchCurrentWeather(this.coords);

    // 3. Update Header & Dot Matrix Indicator
    this.header.updateWeather(this.weatherData);
    this.indicators.updateDotMatrix(this.weatherData.condition);

    // 4. Fetch Recommended Outfits for current weather
    this.recommendedOutfits = await fetchRecommendedOutfits(this.weatherData.condition, this.weatherData.temp);
    this.gallery.update(this.recommendedOutfits);
  }

  async handleScan(base64Image) {
    console.log('[SmartMirrorApp] Outfit Scan Triggered. Analyzing with Google Gemini API...');

    // 1. Send Base64 image & Weather to Gemini API Vision Model
    this.diagnosisData = await analyzeOutfitWithGemini(base64Image, this.weatherData);

    // 2. Update AI Diagnosis Panel & Sync 4-Segment Neopixel LED Bar
    this.diagnosisPanel.update(this.diagnosisData);
    this.indicators.updateNeopixel(this.diagnosisData.colors);

    // 3. Play Warning Beep Audio if Warning Status
    if (this.diagnosisData.status === 'warning') {
      this.playWarningBeep();
    }
  }

  playWarningBeep() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 tone
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      console.warn('[SmartMirrorApp] Web Audio warning beep error:', e);
    }
  }
}

// Initialize Application on DOM Content Loaded
document.addEventListener('DOMContentLoaded', () => {
  const app = new SmartMirrorApp();
  app.init();
});
