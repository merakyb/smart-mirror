/**
 * Smart Mirror Assistant - Main Application Entry Point
 * Orchestrates Header, Virtual Indicators, Webcam Viewfinder, Diagnosis Panel, and Outfit Gallery
 */

import { fetchCurrentWeather } from './services/weatherService.js';
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
    this.diagnosisData = null;
    this.recommendedOutfits = [];

    // Instantiate UI Components
    this.header = new HeaderComponent('headerSlot');
    this.indicators = new VirtualIndicatorsComponent('virtualIndicatorsSlot');
    this.viewfinder = new WebcamViewfinderComponent('viewfinderSlot', (base64Image) => this.handleScan(base64Image));
    this.diagnosisPanel = new DiagnosisPanelComponent('diagnosisSlot');
    this.gallery = new OutfitGalleryComponent('gallerySlot');
  }

  async init() {
    console.log('[SmartMirrorApp] Initializing Smart Mirror Assistant Components...');

    // 1. Initial Render with Placeholders
    this.indicators.render();
    this.viewfinder.render();
    this.diagnosisPanel.render();
    this.gallery.render([]);

    // 2. Fetch Weather Data
    this.weatherData = await fetchCurrentWeather();
    this.header.render(this.weatherData);
    this.indicators.updateDotMatrix(this.weatherData.condition);

    // 3. Fetch Initial Outfit Recommendations
    this.recommendedOutfits = await fetchRecommendedOutfits(this.weatherData.condition, this.weatherData.temp);
    this.gallery.update(this.recommendedOutfits);
  }

  async handleScan(base64Image) {
    console.log('[SmartMirrorApp] Outfit Scan Triggered. Analyzing with Gemini API...');

    // 1. Analyze Outfit Image with Gemini Vision
    this.diagnosisData = await analyzeOutfitWithGemini(base64Image, this.weatherData);

    // 2. Update Diagnosis Panel & Virtual Neopixel LED Indicators
    this.diagnosisPanel.update(this.diagnosisData);
    this.indicators.updateNeopixel(this.diagnosisData.colors);

    // 3. Play sound warning if Warning status
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
      osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      console.warn('[SmartMirrorApp] Web Audio Beep fallback:', e);
    }
  }
}

// Start application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new SmartMirrorApp();
  app.init();
});
