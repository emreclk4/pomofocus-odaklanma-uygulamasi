// PomoFocus Core Application Logic
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';
import { App } from '@capacitor/app';

// DOM Elemanları
const timerTime = document.getElementById('timer-time');
const timerStatus = document.getElementById('timer-status');
const timerProgress = document.getElementById('timer-progress');
const activeTaskTitle = document.getElementById('active-task-title');

const btnPlayPause = document.getElementById('btn-play-pause');
const btnReset = document.getElementById('btn-reset');
const btnSkip = document.getElementById('btn-skip');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');

const modePomodoro = document.getElementById('mode-pomodoro');
const modeShort = document.getElementById('mode-short');
const modeLong = document.getElementById('mode-long');

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const tasksList = document.getElementById('tasks-list');
const tasksCounter = document.getElementById('tasks-counter');

// Modallar ve Tetikleyiciler
const btnStats = document.getElementById('btn-stats');
const btnSettings = document.getElementById('btn-settings');
const modalStats = document.getElementById('modal-stats');
const modalSettings = document.getElementById('modal-settings');
const closeStats = document.getElementById('close-stats');
const closeSettings = document.getElementById('close-settings');
const btnResetStats = document.getElementById('btn-reset-stats');

// Ayar Girdileri
const inputPomodoro = document.getElementById('input-pomodoro');
const inputShort = document.getElementById('input-short');
const inputLong = document.getElementById('input-long');
const valPomodoro = document.getElementById('val-pomodoro');
const valShort = document.getElementById('val-short');
const valLong = document.getElementById('val-long');

const chkAutoBreak = document.getElementById('chk-auto-break');
const chkAutoFocus = document.getElementById('chk-auto-focus');
const inputAlarmVolume = document.getElementById('input-alarm-volume');
const valAlarmVolume = document.getElementById('val-alarm-volume');
const selectAlarmSound = document.getElementById('select-alarm-sound');

// Gelişmiş Özellik Seçicileri
const btnZen = document.getElementById('btn-zen');
const btnExitZen = document.getElementById('btn-exit-zen');
const taskTargetInput = document.getElementById('task-target-input');
const chkNotifications = document.getElementById('chk-notifications');
const chkVoiceAssistant = document.getElementById('chk-voice-assistant');

// Mobil Görevler Modalı Seçicileri
const btnTasksToggle = document.getElementById('btn-tasks-toggle');
const closeTasksMobile = document.getElementById('close-tasks-mobile');
const tasksSection = document.querySelector('.tasks-section');

// Pomo-Pet ve Öncelik Seçicileri
const pomoPetContainer = document.getElementById('pomo-pet-container');
const pomoPetSpeech = document.getElementById('pomo-pet-speech');
const taskPriorityInput = document.getElementById('task-priority-input');

// Pomo-Pet Evi Modalı Seçicileri
const btnPet = document.getElementById('btn-pet');
const modalPet = document.getElementById('modal-pet');
const closePet = document.getElementById('close-pet');
const petHouseDisplay = document.getElementById('pet-house-display');
const petHouseSpeech = document.getElementById('pet-house-speech');
const petStageName = document.getElementById('pet-stage-name');
const petLevelBadge = document.getElementById('pet-level-badge');
const btnPetLove = document.getElementById('btn-pet-love');
const petEvolutionTree = document.getElementById('pet-evolution-tree');
const petAccessoryGrid = document.getElementById('pet-accessory-grid');

// Pomo-Mağaza ve Mini Oyun Modalı Seçicileri
const btnShop = document.getElementById('btn-shop');
const modalShop = document.getElementById('modal-shop');
const closeShop = document.getElementById('close-shop');
const btnMinigame = document.getElementById('btn-minigame');
const modalMinigame = document.getElementById('modal-minigame');
const closeMinigame = document.getElementById('close-minigame');

// Nihai Özellik Seçicileri
const displayLevel = document.getElementById('display-level');
const displayXpBar = document.getElementById('display-xp-bar');
const displayXpText = document.getElementById('display-xp-text');
const selectTheme = document.getElementById('select-theme');
const taskCategoryInput = document.getElementById('task-category-input');
const donutChart = document.getElementById('donut-chart');
const donutLegend = document.getElementById('donut-legend');
const achievementsContainer = document.getElementById('achievements-container');

// Radyo Seçicileri
const btnRadioPlay = document.getElementById('btn-radio-play');
const btnRadioPrev = document.getElementById('btn-radio-prev');
const btnRadioNext = document.getElementById('btn-radio-next');
const radioVolume = document.getElementById('radio-volume');
const radioStationName = document.getElementById('radio-station-name');
const radioPlayIcon = document.getElementById('radio-play-icon');
const radioPauseIcon = document.getElementById('radio-pause-icon');

// SVG İstatistik Grafiği
const statsChart = document.getElementById('stats-chart');
const statTotalFocus = document.getElementById('stat-total-focus');
const statPomodoros = document.getElementById('stat-pomodoros');
const statStreak = document.getElementById('stat-streak');

// ----------------------------------------------------
// UYGULAMA DURUMU (STATE)
// ----------------------------------------------------
let state = {
  // Sayaç Ayarları
  durations: {
    pomodoro: 25 * 60,
    short: 5 * 60,
    long: 15 * 60
  },
  currentMode: 'pomodoro', // 'pomodoro', 'short', 'long'
  timeLeft: 25 * 60,
  timerRunning: false,
  timerIntervalId: null,
  endTime: null, // Hassas zaman takibi için timestamp
  
  // Otomasyon
  autoBreak: false,
  autoFocus: false,
  
  // Sesler
  alarmVolume: 0.8,
  alarmSound: 'digital',

  
  // Görevler
  tasks: [],
  activeTaskId: null,
  
  // Gelişmiş Özellikler
  zenMode: false,
  enableNotifications: false,
  enableVoiceAssistant: false,
  
  // Nihai Özellikler (Oyunlaştırma & Tema)
  theme: 'pomodoro',
  level: 1,
  xp: 0,
  xpNeeded: 500,
  achievements: [],
  equippedAccessory: null,
  petRoomTheme: 'cosmic',
  dailyQuests: [],
  lastQuestDate: null,
  chestClaimed: false,
  minigameHighScore: 0,
  pomoCoins: 0,
  happiness: 100,
  inventory: { magnet: 0, shield: 0, timewarp: 0, doublexp: 0 },
  activeBuffs: { doublexpUntil: null },
  flappyHighScore: 0,
  activeGameMode: 'catch',
  boss: { hp: 100, maxHp: 100, level: 1, name: 'Erteleme Ejderhası', avatar: '🐉', defeated: false },
  lastWheelSpinDate: null,
  user: { isLoggedIn: false, name: '', email: '', avatar: '👤', bio: '' },
  
  // İstatistikler
  stats: {
    totalFocusMinutes: 0,
    completedPomodoros: 0,
    streak: 0,
    lastCompletedDate: null,
    history: {} // { "YYYY-MM-DD": minutes }
  }
};

// ----------------------------------------------------
// WEB AUDIO API SES SENTEZLEYİCİ
// ----------------------------------------------------
let audioCtx = null;
let wakeLock = null;

async function requestWakeLock() {
  if ('wakeLock' in navigator) {
    try {
      wakeLock = await navigator.wakeLock.request('screen');
      console.log("Wake lock aktif.");
    } catch (err) {
      console.warn("Wake lock hatası:", err);
    }
  }
}

function releaseWakeLock() {
  if (wakeLock) {
    wakeLock.release().then(() => {
      wakeLock = null;
      console.log("Wake lock devredışı.");
    });
  }
}

function setupBackButtonListener() {
  if (Capacitor.isNativePlatform()) {
    App.addListener('backButton', () => {
      // 0. Mobil Görevler modalı açıksa kapat
      if (tasksSection && tasksSection.classList.contains('open')) {
        tasksSection.classList.remove('open');
        document.body.classList.remove('modal-open');
        playClickSound();
        return;
      }
      // Uygulama Menüsü modalı açıksa kapat
      const modalAppMenu = document.getElementById('modal-app-menu');
      if (modalAppMenu && !modalAppMenu.classList.contains('hidden')) {
        modalAppMenu.classList.add('hidden');
        document.body.classList.remove('modal-open');
        playClickSound();
        return;
      }
      // Profil modalı açıksa kapat
      const modalProfile = document.getElementById('modal-profile');
      if (modalProfile && !modalProfile.classList.contains('hidden')) {
        modalProfile.classList.add('hidden');
        document.body.classList.remove('modal-open');
        playClickSound();
        return;
      }
      // 1. Arcade Oyun Modalı açıksa kapat
      if (modalMinigame && !modalMinigame.classList.contains('hidden')) {
        modalMinigame.classList.add('hidden');
        document.body.classList.remove('modal-open');
        miniGameRunning = false;
        flappyGameRunning = false;
        playClickSound();
        return;
      }
      // 2. Pomo-Mağaza modalı açıksa kapat
      if (modalShop && !modalShop.classList.contains('hidden')) {
        modalShop.classList.add('hidden');
        document.body.classList.remove('modal-open');
        playClickSound();
        return;
      }
      // 3. Pet Evi modalı açıksa kapat
      if (modalPet && !modalPet.classList.contains('hidden')) {
        modalPet.classList.add('hidden');
        document.body.classList.remove('modal-open');
        playClickSound();
        return;
      }
      // 4. İstatistik modalı açıksa kapat
      if (modalStats && !modalStats.classList.contains('hidden')) {
        modalStats.classList.add('hidden');
        document.body.classList.remove('modal-open');
        playClickSound();
        return;
      }
      // 5. Ayarlar modalı açıksa kapat
      if (modalSettings && !modalSettings.classList.contains('hidden')) {
        modalSettings.classList.add('hidden');
        document.body.classList.remove('modal-open');
        playClickSound();
        return;
      }
      // 6. Zen modu aktifse çık
      if (state.zenMode) {
        toggleZenMode(false);
        return;
      }
      
      // 7. Aksi takdirde uygulamayı arka plana al/küçült
      App.minimizeApp();
    });
  }
}

let petSpeechTimeout = null;

function showPetSpeech(text) {
  if (!pomoPetSpeech) return;
  pomoPetSpeech.textContent = text;
  pomoPetSpeech.classList.add('show');
  
  if (petSpeechTimeout) clearTimeout(petSpeechTimeout);
  
  petSpeechTimeout = setTimeout(() => {
    pomoPetSpeech.classList.remove('show');
  }, 4000);
}

function updatePomoPet() {
  if (!pomoPetContainer) return;
  pomoPetContainer.innerHTML = generatePetSvg(state.level, state.equippedAccessory);
}

function playSuccessChime() {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  
  const osc1 = audioCtx.createOscillator();
  const osc2 = audioCtx.createOscillator();
  const gain1 = audioCtx.createGain();
  const gain2 = audioCtx.createGain();
  
  osc1.type = 'sine';
  osc1.frequency.setValueAtTime(523.25, now);
  osc1.frequency.setValueAtTime(659.25, now + 0.1);
  osc1.frequency.setValueAtTime(783.99, now + 0.2);
  
  gain1.gain.setValueAtTime(0.04, now);
  gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
  
  osc1.connect(gain1);
  gain1.connect(audioCtx.destination);
  
  osc1.start(now);
  osc1.stop(now + 0.5);
  
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(1046.5, now + 0.2);
  
  gain2.gain.setValueAtTime(0.02, now + 0.2);
  gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
  
  osc2.connect(gain2);
  gain2.connect(audioCtx.destination);
  
  osc2.start(now + 0.2);
  osc2.stop(now + 0.6);
}

function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// ----------------------------------------------------
// KOZMİK KANVAS PARÇACIK MOTORU (PARTICLES)
// ----------------------------------------------------
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let confettis = [];
let particleAnimationId = null;

class Particle {
  constructor() {
    this.reset();
    this.y = Math.random() * canvas.height;
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + 10;
    this.size = 1 + Math.random() * 2.5;
    this.speedY = 0.25 + Math.random() * 0.55;
    this.speedX = -0.2 + Math.random() * 0.4;
    this.alpha = 0.12 + Math.random() * 0.38;
    this.color = getParticleColor();
  }

  update() {
    const speedMultiplier = state.timerRunning ? 2.5 : 0.8;
    this.y -= this.speedY * speedMultiplier;
    this.x += this.speedX * (state.timerRunning ? 1.5 : 1);
    
    if (this.y < 0) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.shadowBlur = 5;
    ctx.shadowColor = this.color;
    ctx.fill();
    ctx.restore();
  }
}

function getParticleColor() {
  if (state.theme !== 'pomodoro') {
    if (state.theme === 'cyberpunk') return '#f107a3';
    if (state.theme === 'sakura') return '#ff79c6';
    if (state.theme === 'nordic') return '#2ecc71';
    return '#ffffff'; // oled
  }
  if (state.currentMode === 'pomodoro') {
    return '#ff7675';
  } else if (state.currentMode === 'short') {
    return '#2ecc71';
  } else {
    return '#3498db';
  }
}

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
}

class Confetti {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 3;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed - Math.random() * 3;
    this.size = Math.random() * 6 + 5;
    this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
    this.alpha = 1;
    this.decay = Math.random() * 0.015 + 0.012;
    this.rotation = Math.random() * 360;
    this.vRotation = (Math.random() - 0.5) * 12;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.15;
    this.alpha -= this.decay;
    this.rotation += this.vRotation;
  }
  
  draw() {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}

function spawnConfetti(x, y) {
  const count = 35;
  for (let i = 0; i < count; i++) {
    confettis.push(new Confetti(x, y));
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(Math.floor(canvas.width / 18), 75);
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

let galaxyAngle = 0;

function drawCosmicGalaxy() {
  if (!state.timerRunning || !canvas || !ctx) return;
  galaxyAngle += 0.005;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  const planetsCount = Math.min(6, Math.floor((state.stats ? state.stats.completedPomodoros : 0) / 2) + 2);
  const colors = ['#38bdf8', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#f43f5e'];

  for (let i = 0; i < planetsCount; i++) {
    const orbitRadius = 110 + i * 42;
    const angle = galaxyAngle * (1 + i * 0.15) + (i * Math.PI / 3);
    const px = cx + Math.cos(angle) * orbitRadius;
    const py = cy + Math.sin(angle) * orbitRadius * 0.45;

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(cx, cy, orbitRadius, orbitRadius * 0.45, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(px, py, 6 + (i % 3) * 2, 0, Math.PI * 2);
    ctx.fillStyle = colors[i % colors.length];
    ctx.shadowBlur = 12;
    ctx.shadowColor = colors[i % colors.length];
    ctx.fill();
    ctx.restore();
  }
}

function animateParticles() {
  if (!canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawCosmicGalaxy();

  particles.forEach(p => {
    p.update();
    p.draw();
  });
  
  for (let i = confettis.length - 1; i >= 0; i--) {
    const c = confettis[i];
    c.update();
    c.draw();
    if (c.alpha <= 0) {
      confettis.splice(i, 1);
    }
  }
  
  particleAnimationId = requestAnimationFrame(animateParticles);
}

// ----------------------------------------------------
// BİLDİRİM VE SESLİ ASİSTAN SİSTEMİ
// ----------------------------------------------------
function sendNotification(title, message) {
  // Her zaman in-app toast gösterimi yap (WebView uyumluluğu ve estetik için)
  showInAppToast(title, message);

  if (state.enableNotifications) {
    if (Capacitor.isNativePlatform()) {
      scheduleNativeNotification(title, message);
    } else if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body: message,
          icon: './favicon.ico'
        });
      } catch (e) {
        console.warn("Masaüstü bildirimi gönderilemedi:", e);
      }
    }
  }
}

async function scheduleNativeNotification(title, message) {
  try {
    const perm = await LocalNotifications.checkPermissions();
    if (perm.display !== 'granted') {
      await LocalNotifications.requestPermissions();
    }
    
    await LocalNotifications.schedule({
      notifications: [
        {
          title: title,
          body: message,
          id: 1,
          schedule: { at: new Date(Date.now() + 100) },
          sound: null,
          attachments: null,
          actionTypeId: "",
          extra: null
        }
      ]
    });
  } catch (err) {
    console.warn("Native bildirim gönderilemedi:", err);
  }
}

function showInAppToast(title, message) {
  const existingToasts = document.querySelectorAll('.app-toast');
  existingToasts.forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = 'app-toast glass pulse-glow';
  toast.innerHTML = `
    <div class="toast-content">
      <i data-lucide="bell" class="toast-icon"></i>
      <div class="toast-text">
        <span class="toast-title">${title}</span>
        <span class="toast-msg">${message}</span>
      </div>
    </div>
  `;
  document.body.appendChild(toast);
  
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  setTimeout(() => toast.classList.add('show'), 50);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

function speakMessage(message) {
  if (state.enableVoiceAssistant && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'tr-TR';
    const voices = window.speechSynthesis.getVoices();
    const trVoice = voices.find(v => v.lang.includes('tr') || v.lang.includes('TR'));
    if (trVoice) {
      utterance.voice = trVoice;
    }
    window.speechSynthesis.speak(utterance);
  }
}

function toggleZenMode(active) {
  state.zenMode = active;
  if (active) {
    document.body.classList.add('zen-mode');
    btnExitZen.classList.remove('hidden');
  } else {
    document.body.classList.remove('zen-mode');
    btnExitZen.classList.add('hidden');
  }
  saveData();
  playClickSound();
}

// ----------------------------------------------------
// NİHAİ GÜNCELLEME: OYUNLAŞTIRMA VE RADYO SİSTEMLERİ
// ----------------------------------------------------

const ACHIEVEMENT_DEFS = [
  { id: 'first_pomo', title: 'İlk Adım 🍅', desc: 'İlk Pomodoro seansını başarıyla tamamla.' },
  { id: 'focus_marathon', title: 'Zaman Bükücü ⏳', desc: 'Toplam 100 dakika odaklanma süresine ulaş.' },
  { id: 'streak_champ', title: 'Yıkılmaz Seri 🔥', desc: '3 günlük odaklanma serisine (streak) ulaş.' },
  { id: 'polymath', title: 'Çok Yönlü 🎨', desc: '4 farklı kategoriden de en az birer görev ekle.' }
];

const PLAYER_TITLES = [
  { level: 1, title: '🌱 Odaklanma Çaylağı' },
  { level: 2, title: '🌿 Zaman Avcısı' },
  { level: 3, title: '🌸 Pomo Şövalyesi' },
  { level: 4, title: '🍏 Zihin Bükücü' },
  { level: 5, title: '🧑‍🚀 Galaksi Başmimarı' }
];

function getPlayerTitle(level) {
  let titleObj = PLAYER_TITLES[0];
  for (let t of PLAYER_TITLES) {
    if (level >= t.level) titleObj = t;
  }
  return titleObj.title;
}

function updatePlayerTitleDisplay() {
  const titleTextEl = document.getElementById('player-title-text');
  if (titleTextEl) {
    titleTextEl.textContent = getPlayerTitle(state.level);
  }
}

function awardCoins(amount) {
  state.pomoCoins = (state.pomoCoins || 0) + amount;
  updateCoinDisplay();
  saveData();
}

function updateCoinDisplay() {
  const displayCoins = document.getElementById('display-coins');
  const shopBalance = document.getElementById('shop-coin-balance');
  if (displayCoins) displayCoins.textContent = state.pomoCoins || 0;
  if (shopBalance) shopBalance.textContent = state.pomoCoins || 0;
}

function awardXp(amount) {
  let finalAmount = amount;
  if (state.activeBuffs && state.activeBuffs.doublexpUntil && Date.now() < state.activeBuffs.doublexpUntil) {
    finalAmount *= 2;
  }
  state.xp += finalAmount;
  let leveledUp = false;
  while (state.xp >= state.xpNeeded) {
    state.xp -= state.xpNeeded;
    state.level += 1;
    state.xpNeeded = state.level * 500;
    leveledUp = true;
    
    setTimeout(() => {
      speakMessage(`Tebrikler! Seviye atladınız. Artık seviye ${state.level} oldunuz.`);
      sendNotification("Seviye Atladınız! 🎉", `Yeni seviyeniz: ${state.level}`);
      showPetSpeech(`Harika! Seviye ${state.level} olduk! 🌱`);
    }, 500);
  }
  if (leveledUp) {
    updatePomoPet();
    updatePlayerTitleDisplay();
  }
  updateXpDisplay();
  saveData();
}

function updateXpDisplay() {
  if (displayLevel) displayLevel.textContent = `Lvl ${state.level}`;
  const progressRatio = (state.xp / state.xpNeeded) * 100;
  if (displayXpBar) displayXpBar.style.width = `${progressRatio}%`;
  if (displayXpText) displayXpText.textContent = `${state.xp} / ${state.xpNeeded} XP`;
  updatePomoPet();
}

function checkAchievements() {
  if (state.stats.completedPomodoros >= 1 && !state.achievements.includes('first_pomo')) {
    unlockAchievement('first_pomo');
  }
  if (state.stats.totalFocusMinutes >= 100 && !state.achievements.includes('focus_marathon')) {
    unlockAchievement('focus_marathon');
  }
  if (state.stats.streak >= 3 && !state.achievements.includes('streak_champ')) {
    unlockAchievement('streak_champ');
  }
  
  const categories = new Set(state.tasks.map(t => t.category));
  if (categories.has('work') && categories.has('code') && categories.has('reading') && categories.has('personal') && !state.achievements.includes('polymath')) {
    unlockAchievement('polymath');
  }
}

function unlockAchievement(id) {
  if (state.achievements.includes(id)) return;
  state.achievements.push(id);
  const ach = ACHIEVEMENT_DEFS.find(a => a.id === id);
  if (ach) {
    setTimeout(() => {
      sendNotification(`Yeni Başarım Açıldı! 🏆`, `${ach.title}: ${ach.desc}`);
      speakMessage(`Yeni başarım açıldı: ${ach.title}`);
    }, 1500);
  }
  saveData();
}

function renderAchievements() {
  if (!achievementsContainer) return;
  achievementsContainer.innerHTML = '';
  ACHIEVEMENT_DEFS.forEach(ach => {
    const isUnlocked = state.achievements.includes(ach.id);
    const card = document.createElement('div');
    card.className = `achievement-card ${isUnlocked ? 'unlocked' : ''}`;
    
    let emoji = '🔒';
    if (isUnlocked) {
      if (ach.id === 'first_pomo') emoji = '🍅';
      else if (ach.id === 'focus_marathon') emoji = '⏳';
      else if (ach.id === 'streak_champ') emoji = '🔥';
      else emoji = '🎨';
    }
    
    card.innerHTML = `
      <div class="achievement-icon">${emoji}</div>
      <div class="achievement-info">
        <span class="achievement-title">${ach.title}</span>
        <span class="achievement-desc">${ach.desc}</span>
      </div>
    `;
    achievementsContainer.appendChild(card);
  });
}

// Radyo İstasyonları Listesi
const RADIO_STATIONS = [
  { name: 'Lo-Fi Chill Hop Beats 🎧', url: 'https://stream.zeno.fm/05d04w3bef8uv' },
  { name: 'Lofi Coffee Shop ☕', url: 'https://stream.zeno.fm/f3wvbbqbef8uv' },
  { name: 'Lo-Fi Study Beats 📚', url: 'https://stream.zeno.fm/cfzszq2bef8uv' }
];
let currentStationIdx = 0;
let radioAudio = new Audio();
radioAudio.preload = "none";
let radioPlaying = false;

function setupRadio() {
  if (radioVolume) radioAudio.volume = parseFloat(radioVolume.value);
  
  if (btnRadioPlay) {
    btnRadioPlay.addEventListener('click', () => {
      playClickSound();
      if (radioPlaying) {
        pauseRadio();
      } else {
        playRadio();
      }
    });
  }

  if (btnRadioPrev) {
    btnRadioPrev.addEventListener('click', () => {
      playClickSound();
      currentStationIdx = (currentStationIdx - 1 + RADIO_STATIONS.length) % RADIO_STATIONS.length;
      if (radioPlaying) {
        playRadio();
      } else {
        updateRadioUI();
      }
    });
  }

  if (btnRadioNext) {
    btnRadioNext.addEventListener('click', () => {
      playClickSound();
      currentStationIdx = (currentStationIdx + 1) % RADIO_STATIONS.length;
      if (radioPlaying) {
        playRadio();
      } else {
        updateRadioUI();
      }
    });
  }

  if (radioVolume) {
    radioVolume.addEventListener('input', (e) => {
      radioAudio.volume = parseFloat(e.target.value);
    });
  }
  
  updateRadioUI();
}

function updateRadioUI() {
  if (!radioStationName) return;
  if (radioPlaying) {
    radioStationName.textContent = RADIO_STATIONS[currentStationIdx].name;
    radioStationName.style.color = 'var(--primary-color)';
  } else {
    radioStationName.textContent = 'Kapalı';
    radioStationName.style.color = 'var(--text-muted)';
  }
}

function playRadio() {
  radioAudio.src = RADIO_STATIONS[currentStationIdx].url;
  radioAudio.load();
  radioAudio.play().then(() => {
    radioPlaying = true;
    if (radioPlayIcon) radioPlayIcon.classList.add('hidden');
    if (radioPauseIcon) radioPauseIcon.classList.remove('hidden');
    updateRadioUI();
  }).catch(err => {
    console.error("Radyo çalma hatası:", err);
    radioPlaying = false;
    updateRadioUI();
  });
}

function pauseRadio() {
  radioAudio.pause();
  radioPlaying = false;
  if (radioPlayIcon) radioPlayIcon.classList.remove('hidden');
  if (radioPauseIcon) radioPauseIcon.classList.add('hidden');
  updateRadioUI();
}

function applyTheme(themeName) {
  state.theme = themeName;
  document.body.classList.remove('theme-pomodoro', 'theme-short', 'theme-long', 'theme-cyberpunk', 'theme-sakura', 'theme-nordic', 'theme-oled');
  
  if (themeName === 'pomodoro') {
    document.body.classList.add(`theme-${state.currentMode}`);
  } else {
    document.body.classList.add(`theme-${themeName}`);
  }
  
  particles.forEach(p => p.color = getParticleColor());
  saveData();
}

function drawDonutChart() {
  if (!donutChart || !donutLegend) return;
  donutChart.innerHTML = '';
  donutLegend.innerHTML = '';
  
  const totals = { work: 0, code: 0, reading: 0, personal: 0 };
  state.tasks.forEach(task => {
    const cat = task.category || 'work';
    const pomos = task.pomodoros || 0;
    totals[cat] = (totals[cat] || 0) + (pomos * 25);
  });
  
  const totalMinutes = Object.values(totals).reduce((a, b) => a + b, 0);
  
  const catColors = {
    work: '#54a0ff',
    code: '#a55eea',
    reading: '#ff9f43',
    personal: '#1dd1a1'
  };
  const catNames = {
    work: 'Çalışma 💼',
    code: 'Kodlama 💻',
    reading: 'Okuma 📚',
    personal: 'Kişisel 🏠'
  };
  
  Object.keys(catNames).forEach(cat => {
    const min = totals[cat] || 0;
    const legendItem = document.createElement('div');
    legendItem.className = 'legend-item';
    legendItem.innerHTML = `
      <div class="legend-color" style="background: ${catColors[cat]};"></div>
      <span>${catNames[cat]}</span>
      <span class="legend-val">${min} dk</span>
    `;
    donutLegend.appendChild(legendItem);
  });
  
  if (totalMinutes === 0) {
    const ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    ring.setAttribute("cx", "100");
    ring.setAttribute("cy", "100");
    ring.setAttribute("r", "60");
    ring.setAttribute("class", "donut-ring");
    donutChart.appendChild(ring);
    
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", "100");
    text.setAttribute("y", "105");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("fill", "#64748b");
    text.setAttribute("font-family", "Outfit");
    text.setAttribute("font-size", "12");
    text.setAttribute("font-weight", "600");
    text.textContent = "Veri Yok";
    donutChart.appendChild(text);
    return;
  }
  
  let accumulatedPercent = 0;
  const r = 60;
  const circumference = 2 * Math.PI * r;
  
  Object.keys(totals).forEach(cat => {
    const min = totals[cat];
    if (min === 0) return;
    
    const percent = min / totalMinutes;
    const strokeLength = percent * circumference;
    const strokeOffset = circumference - (accumulatedPercent * circumference);
    
    const segment = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    segment.setAttribute("cx", "100");
    segment.setAttribute("cy", "100");
    segment.setAttribute("r", r.toString());
    segment.setAttribute("class", "donut-segment");
    segment.setAttribute("stroke", catColors[cat]);
    segment.setAttribute("stroke-dasharray", `${strokeLength} ${circumference - strokeLength}`);
    segment.setAttribute("stroke-dashoffset", strokeOffset.toString());
    segment.setAttribute("transform", "rotate(-90 100 100)");
    donutChart.appendChild(segment);
    
    accumulatedPercent += percent;
  });
  
  const textVal = document.createElementNS("http://www.w3.org/2000/svg", "text");
  textVal.setAttribute("x", "100");
  textVal.setAttribute("y", "98");
  textVal.setAttribute("text-anchor", "middle");
  textVal.setAttribute("fill", "#ffffff");
  textVal.setAttribute("font-family", "Outfit");
  textVal.setAttribute("font-size", "18");
  textVal.setAttribute("font-weight", "700");
  textVal.textContent = `${totalMinutes}`;
  donutChart.appendChild(textVal);

  const textLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  textLabel.setAttribute("x", "100");
  textLabel.setAttribute("y", "116");
  textLabel.setAttribute("text-anchor", "middle");
  textLabel.setAttribute("fill", "#64748b");
  textLabel.setAttribute("font-family", "Inter");
  textLabel.setAttribute("font-size", "9");
  textLabel.setAttribute("font-weight", "500");
  textLabel.textContent = "TOPLAM DK";
  donutChart.appendChild(textLabel);
}



// Bitiş Alarmını Sentezle
function playAlarmSound() {
  initAudio();
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  gainNode.gain.linearRampToValueAtTime(state.alarmVolume, audioCtx.currentTime + 0.05);
  
  if (state.alarmSound === 'digital') {
    // Klasik dijital ikili bip
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    
    // Bip aralığı oluşturma
    gainNode.gain.setValueAtTime(state.alarmVolume, audioCtx.currentTime + 0.05);
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime + 0.15);
    gainNode.gain.setValueAtTime(state.alarmVolume, audioCtx.currentTime + 0.25);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.55);
  } 
  else if (state.alarmSound === 'bell') {
    // Tibet Çanı - Zengin armonik ve uzun sönümlü sine dalgaları
    const freqs = [180, 360, 540, 720];
    const gains = [0.6, 0.3, 0.15, 0.07];
    
    freqs.forEach((freq, idx) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      
      o.type = 'sine';
      o.frequency.setValueAtTime(freq, audioCtx.currentTime);
      
      g.gain.setValueAtTime(0, audioCtx.currentTime);
      g.gain.linearRampToValueAtTime(gains[idx] * state.alarmVolume, audioCtx.currentTime + 0.08);
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 4.0); // 4 saniye sönümlenme
      
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start();
      o.stop(audioCtx.currentTime + 4.1);
    });
  } 
  else if (state.alarmSound === 'melodic') {
    // Melodik Geçiş (C5 -> E5 -> G5 -> C6)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      const startTime = audioCtx.currentTime + idx * 0.15;
      
      o.type = 'sine';
      o.frequency.setValueAtTime(freq, startTime);
      
      g.gain.setValueAtTime(0, startTime);
      g.gain.linearRampToValueAtTime(0.3 * state.alarmVolume, startTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.6);
      
      o.connect(g);
      g.connect(audioCtx.destination);
      o.start(startTime);
      o.stop(startTime + 0.7);
    });
  } 
  else if (state.alarmSound === 'pulse') {
    // Yumuşak Darbeli Dalga
    osc.type = 'sine';
    osc.frequency.setValueAtTime(330, audioCtx.currentTime);
    
    // Yavaş dalgalanan 3 vuruş
    let t = audioCtx.currentTime;
    for (let i = 0; i < 3; i++) {
      gainNode.gain.setValueAtTime(0, t);
      gainNode.gain.linearRampToValueAtTime(state.alarmVolume, t + 0.15);
      gainNode.gain.linearRampToValueAtTime(0, t + 0.4);
      t += 0.45;
    }
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    osc.start();
    osc.stop(t + 0.1);
  }
}

// Ufak tıklama sesi (Arayüz geri bildirimi)
function playClickSound() {
  if (!audioCtx) return;
  if (audioCtx.state === 'suspended') return;
  
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.05);
  
  gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);
  
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.06);
}

// ----------------------------------------------------
// SAYAÇ MANTIĞI VE DOKÜMAN BAŞLIĞI GÜNCELLEME
// ----------------------------------------------------
function updateTimerDisplay() {
  const mins = Math.floor(state.timeLeft / 60);
  const secs = state.timeLeft % 60;
  const timeString = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  
  timerTime.textContent = timeString;
  
  // Tarayıcı sekme başlığını güncelle
  const modeLabel = state.currentMode === 'pomodoro' ? 'Odaklan' : 'Mola';
  document.title = `${timeString} - ${modeLabel} | PomoFocus`;
  
  // SVG ilerleme halkasını güncelle
  const total = state.durations[state.currentMode];
  const progressRatio = state.timeLeft / total;
  const strokeDashoffset = 552.92 * (1 - progressRatio); // 2 * PI * r (r=88, 2 * 3.14159 * 88 = 552.92)
  timerProgress.style.strokeDashoffset = strokeDashoffset;
}

function setMode(mode) {
  stopTimer();
  state.currentMode = mode;
  state.timeLeft = state.durations[mode];
  
  // Tema renklerini değiştir
  if (state.theme === 'pomodoro') {
    document.body.className = `theme-${mode}`;
  }
  
  // Mod buton aktifliklerini güncelle
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById(`mode-${mode}`).classList.add('active');
  
  // Durum etiketini güncelle
  if (mode === 'pomodoro') {
    timerStatus.textContent = "Odaklanma Zamanı";
  } else if (mode === 'short') {
    timerStatus.textContent = "Kısa Mola";
  } else {
    timerStatus.textContent = "Uzun Mola";
  }
  
  updateTimerDisplay();
}

function startTimer() {
  if (state.timerRunning) return;
  
  initAudio();
  state.timerRunning = true;
  requestWakeLock();
  showPetSpeech("Hadi odaklanalım! 🍅");
  
  // Buton durumunu değiştir
  playIcon.classList.add('hidden');
  pauseIcon.classList.remove('hidden');
  timerProgress.classList.add('pulse-glow');
  
  // Hassas geri sayım için bitiş zamanını kaydet
  state.endTime = Date.now() + (state.timeLeft * 1000);
  
  state.timerIntervalId = setInterval(() => {
    const secondsLeft = Math.ceil((state.endTime - Date.now()) / 1000);
    
    if (secondsLeft <= 0) {
      state.timeLeft = 0;
      updateTimerDisplay();
      timerFinished();
    } else {
      state.timeLeft = secondsLeft;
      updateTimerDisplay();
    }
  }, 200); // Ekranı sıkça kontrol et ama timestamp farkını kullan (aşırı hassas)
}

function stopTimer() {
  if (!state.timerRunning) return;
  state.timerRunning = false;
  releaseWakeLock();
  
  playIcon.classList.remove('hidden');
  pauseIcon.classList.add('hidden');
  timerProgress.classList.remove('pulse-glow');
  
  if (state.timerIntervalId) {
    clearInterval(state.timerIntervalId);
    state.timerIntervalId = null;
  }
}

function resetTimer() {
  stopTimer();
  state.timeLeft = state.durations[state.currentMode];
  updateTimerDisplay();
  playClickSound();
}

function skipTimer() {
  stopTimer();
  playClickSound();
  
  // Sonraki moda geçiş yap
  if (state.currentMode === 'pomodoro') {
    // 4. pomodorodan sonra uzun mola, aksi halde kısa mola
    const completedCount = state.stats.completedPomodoros;
    if (completedCount > 0 && completedCount % 4 === 0) {
      setMode('long');
    } else {
      setMode('short');
    }
    
    if (state.autoBreak) {
      setTimeout(startTimer, 600);
    }
  } else {
    setMode('pomodoro');
    if (state.autoFocus) {
      setTimeout(startTimer, 600);
    }
  }
}

function timerFinished() {
  stopTimer();
  playAlarmSound();
  
  // Bildirim ve Sesli Rehber tetikleme
  const isPomo = state.currentMode === 'pomodoro';
  const notificationTitle = isPomo ? 'Odaklanma Süresi Bitti!' : 'Mola Süresi Bitti!';
  const notificationBody = isPomo 
    ? 'Harika odaklandın! Şimdi dinlenme zamanı.' 
    : 'Mola bitti! Yeni bir odaklanma seansına hazır mısın?';
  sendNotification(notificationTitle, notificationBody);

  const voiceMsg = isPomo 
    ? 'Odaklanma süreniz tamamlandı. Harika bir iş çıkardınız. Şimdi mola zamanı.' 
    : 'Mola süreniz doldu. Yeni seansla hedeflerimize odaklanmaya devam edelim.';
  speakMessage(voiceMsg);
  
  // İstatistikleri güncelle (Odaklanma bittiyse)
  if (isPomo) {
    const focusMins = Math.round(state.durations.pomodoro / 60);
    state.stats.totalFocusMinutes += focusMins;
    state.stats.completedPomodoros += 1;
    
    // XP, Coins, Seviye & Boss Hasarı Güncelle
    awardXp(focusMins);
    awardCoins(focusMins * 2);
    damageBoss(25);
    updateQuestProgress('focus', 1);
    
    // Aktif görev varsa, onun durumunu güncelle veya bir sayaç ekle
    if (state.activeTaskId) {
      const activeTask = state.tasks.find(t => t.id === state.activeTaskId);
      if (activeTask) {
        activeTask.pomodoros = (activeTask.pomodoros || 0) + 1;
        renderTasks();
      }
    }
    
    // Günlük geçmişe ekle
    const today = getTodayDateString();
    state.stats.history[today] = (state.stats.history[today] || 0) + focusMins;
    
    // Streak (Seri) Hesaplama
    updateStreak();
    
    // Başarımları Kontrol Et
    checkAchievements();
    
    saveData();
    renderStats();
  }
  
  // Mod geçişi
  setTimeout(() => {
    skipTimer();
  }, 1000);
}

// Bugünü YYYY-MM-DD olarak al
function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Streak Güncelle
function updateStreak() {
  const todayStr = getTodayDateString();
  
  if (state.stats.lastCompletedDate === todayStr) {
    return; // Bugün zaten tamamlanmış, seriyi bozma veya artırma
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${(yesterday.getMonth() + 1).toString().padStart(2, '0')}-${yesterday.getDate().toString().padStart(2, '0')}`;
  
  if (state.stats.lastCompletedDate === yesterdayStr) {
    state.stats.streak += 1;
  } else {
    // Dün bitmediyse ve ilk defa yapılıyorsa veya ara verildiyse 1 yap
    state.stats.streak = 1;
  }
  
  state.stats.lastCompletedDate = todayStr;
}

// ----------------------------------------------------
// GÖREV YÖNETİMİ (TASK MANAGER)
// ----------------------------------------------------
function renderTasks() {
  tasksList.innerHTML = '';
  let completedCount = 0;
  
  state.tasks.forEach(task => {
    if (task.completed) completedCount++;
    
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''} ${task.id === state.activeTaskId ? 'active' : ''}`;
    li.setAttribute('data-id', task.id);
    
    // Görsel Domates İlerleme Barı
    let tomatoesHtml = '<div class="task-tomatoes-progress">';
    const completedT = task.pomodoros || 0;
    const targetT = task.targetPomodoros || 1;
    for (let i = 0; i < targetT; i++) {
      if (i < completedT) {
        tomatoesHtml += `
          <span class="mini-tomato-dot completed" title="Odaklanıldı">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="13" r="8" />
              <path d="M12 5 L12 2 M12 5 Q15 2 18 5 M12 5 Q9 2 6 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
            </svg>
          </span>`;
      } else {
        tomatoesHtml += `
          <span class="mini-tomato-dot" title="Kalan Odaklanma">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="13" r="8" />
              <path d="M12 5 L12 2" stroke-linecap="round" />
            </svg>
          </span>`;
      }
    }
    tomatoesHtml += '</div>';

    const catLabels = {
      work: 'Çalışma 💼',
      code: 'Kodlama 💻',
      reading: 'Okuma 📚',
      personal: 'Kişisel 🏠'
    };
    const tagHtml = `<span class="task-tag tag-${task.category || 'work'}">${catLabels[task.category || 'work']}</span>`;

    li.className = `task-item ${task.completed ? 'completed' : ''} ${task.id === state.activeTaskId ? 'active' : ''} priority-${task.priority || 'low'}`;
    li.setAttribute('data-id', task.id);

    li.innerHTML = `
      <div class="task-checkbox-container">
        <div class="task-checkbox">
          <i data-lucide="check"></i>
        </div>
      </div>
      <span class="task-title">${task.title} ${tagHtml} ${tomatoesHtml}</span>
      <div class="task-actions">
        <button class="task-action-btn delete" title="Sil">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    `;
    
    // Tıklayınca aktif görev yap
    li.addEventListener('click', (e) => {
      // Eğer silme veya checkbox alanına tıklanmadıysa
      if (e.target.closest('.delete') || e.target.closest('.task-checkbox-container')) {
        return;
      }
      selectActiveTask(task.id);
    });
    
    // Tamamlama tetikleyicisi
    li.querySelector('.task-checkbox-container').addEventListener('click', (e) => {
      e.stopPropagation();
      toggleTaskCompleted(task.id);
    });
    
    // Silme tetikleyicisi
    li.querySelector('.delete').addEventListener('click', (e) => {
      e.stopPropagation();
      deleteTask(task.id);
    });
    
    tasksList.appendChild(li);
  });
  
  // Sayaçları güncelle
  tasksCounter.textContent = `${completedCount} / ${state.tasks.length}`;
  lucide.createIcons();
}

function selectActiveTask(taskId) {
  playClickSound();
  if (state.activeTaskId === taskId) {
    // Zaten aktifse pasife çek
    state.activeTaskId = null;
    activeTaskTitle.textContent = "Bir görev seçin veya ekleyin";
  } else {
    state.activeTaskId = taskId;
    const task = state.tasks.find(t => t.id === taskId);
    activeTaskTitle.textContent = task ? task.title : "Bir görev seçin veya ekleyin";
  }
  
  saveData();
  renderTasks();
}

function toggleTaskCompleted(taskId) {
  playClickSound();
  state.tasks = state.tasks.map(task => {
    if (task.id === taskId) {
      const nextCompleted = !task.completed;
      
      if (nextCompleted) {
        triggerTaskCompletedEffect(taskId);
        updateQuestProgress('task', 1);
      }
      
      // Aktif görevi tamamlarsak aktifliği kaldır
      if (nextCompleted && state.activeTaskId === taskId) {
        state.activeTaskId = null;
        activeTaskTitle.textContent = "Bir görev seçin veya ekleyin";
      }
      return { ...task, completed: nextCompleted };
    }
    return task;
  });
  
  saveData();
  renderTasks();
}

function triggerTaskCompletedEffect(taskId) {
  playSuccessChime();
  
  const li = document.querySelector(`.task-item[data-id="${taskId}"]`);
  if (li) {
    const checkbox = li.querySelector('.task-checkbox-container');
    if (checkbox) {
      const rect = checkbox.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      spawnConfetti(x, y);
    }
  }
}

function deleteTask(taskId) {
  playClickSound();
  state.tasks = state.tasks.filter(task => task.id !== taskId);
  if (state.activeTaskId === taskId) {
    state.activeTaskId = null;
    activeTaskTitle.textContent = "Bir görev seçin veya ekleyin";
  }
  
  saveData();
  renderTasks();
}

// ----------------------------------------------------
// İSTATİSTİKLER VE GRAFİK ÇİZİMİ (SVG)
// ----------------------------------------------------
function renderStats() {
  statTotalFocus.textContent = `${state.stats.totalFocusMinutes} dk`;
  statPomodoros.textContent = state.stats.completedPomodoros;
  statStreak.textContent = `${state.stats.streak} Gün`;
  
  // Çubuk, Pasta ve 365 Günlük Heatmap Grafiklerini Çiz
  drawStatsChart();
  drawDonutChart();
  renderFocusHeatmap();
  renderAchievements();
}

function drawStatsChart() {
  statsChart.innerHTML = '';
  
  const days = [];
  const dates = [];
  const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  
  // Son 7 günün tarihlerini al
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d);
    
    // YYYY-MM-DD formatında tarihi al
    const dateStr = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
    const minutes = state.stats.history[dateStr] || 0;
    days.push({
      label: dayNames[d.getDay()],
      value: minutes,
      fullDate: dateStr
    });
  }
  
  // En yüksek dakika değerini bul (grafik ölçeklendirme için, en az 60 dk)
  const maxVal = Math.max(...days.map(d => d.value), 60);
  
  const chartWidth = 500;
  const chartHeight = 200;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 30;
  
  const graphWidth = chartWidth - paddingLeft - paddingRight;
  const graphHeight = chartHeight - paddingTop - paddingBottom;
  
  const barWidth = 35;
  const barSpacing = graphWidth / 7;
  
  // Yatay Grid Çizgileri & Y Ekseni Etiketleri
  const gridLinesCount = 3;
  for (let i = 0; i <= gridLinesCount; i++) {
    const yVal = Math.round((maxVal / gridLinesCount) * i);
    const yPos = chartHeight - paddingBottom - (graphHeight / gridLinesCount) * i;
    
    // Çizgi
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", paddingLeft);
    line.setAttribute("y1", yPos);
    line.setAttribute("x2", chartWidth - paddingRight);
    line.setAttribute("y2", yPos);
    line.setAttribute("stroke", "rgba(255, 255, 255, 0.05)");
    line.setAttribute("stroke-width", "1");
    statsChart.appendChild(line);
    
    // Etiket
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", paddingLeft - 10);
    text.setAttribute("y", yPos + 3);
    text.setAttribute("class", "chart-bar-label");
    text.setAttribute("text-anchor", "end");
    text.textContent = `${yVal}d`;
    statsChart.appendChild(text);
  }
  
  // Barları Çiz
  days.forEach((day, index) => {
    const xPos = paddingLeft + index * barSpacing + (barSpacing - barWidth) / 2;
    const barHeight = (day.value / maxVal) * graphHeight;
    const yPos = chartHeight - paddingBottom - barHeight;
    
    // Dikdörtgen Bar
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", xPos);
    rect.setAttribute("y", yPos);
    rect.setAttribute("width", barWidth);
    rect.setAttribute("height", Math.max(barHeight, 4)); // Değer sıfır olsa bile 4px çiz
    rect.setAttribute("class", "chart-bar-rect");
    rect.setAttribute("title", `${day.value} dakika`);
    statsChart.appendChild(rect);
    
    // Bar Değer Metni (Tepede)
    if (day.value > 0) {
      const valText = document.createElementNS("http://www.w3.org/2000/svg", "text");
      valText.setAttribute("x", xPos + barWidth / 2);
      valText.setAttribute("y", yPos - 8);
      valText.setAttribute("class", "chart-bar-val-text");
      valText.textContent = `${day.value}m`;
      statsChart.appendChild(valText);
    }
    
    // Gün Adı Etiketi (Altta)
    const labelText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    labelText.setAttribute("x", xPos + barWidth / 2);
    labelText.setAttribute("y", chartHeight - 10);
    labelText.setAttribute("class", "chart-bar-label");
    labelText.textContent = day.label;
    statsChart.appendChild(labelText);
  });
}

// ----------------------------------------------------
// VERİ KAYDETME VE YÜKLEME (LOCALSTORAGE)
// ----------------------------------------------------
function saveData() {
  localStorage.setItem('pomofocus_state_v3', JSON.stringify({
    durations: state.durations,
    autoBreak: state.autoBreak,
    autoFocus: state.autoFocus,
    alarmVolume: state.alarmVolume,
    alarmSound: state.alarmSound,
    enableNotifications: state.enableNotifications,
    enableVoiceAssistant: state.enableVoiceAssistant,
    theme: state.theme,
    level: state.level,
    xp: state.xp,
    xpNeeded: state.xpNeeded,
    achievements: state.achievements,
    equippedAccessory: state.equippedAccessory,
    petRoomTheme: state.petRoomTheme,
    dailyQuests: state.dailyQuests,
    lastQuestDate: state.lastQuestDate,
    chestClaimed: state.chestClaimed,
    minigameHighScore: state.minigameHighScore,
    pomoCoins: state.pomoCoins,
    happiness: state.happiness,
    inventory: state.inventory,
    activeBuffs: state.activeBuffs,
    flappyHighScore: state.flappyHighScore,
    boss: state.boss,
    lastWheelSpinDate: state.lastWheelSpinDate,
    user: state.user,
    tasks: state.tasks,
    activeTaskId: state.activeTaskId,
    stats: state.stats
  }));
}

function loadData() {
  const rawData = localStorage.getItem('pomofocus_state_v3') || localStorage.getItem('pomofocus_state_v2') || localStorage.getItem('pomofocus_state_v1');
  if (rawData) {
    try {
      const parsed = JSON.parse(rawData);
      state.durations = parsed.durations || state.durations;
      state.autoBreak = parsed.autoBreak !== undefined ? parsed.autoBreak : state.autoBreak;
      state.autoFocus = parsed.autoFocus !== undefined ? parsed.autoFocus : state.autoFocus;
      state.alarmVolume = parsed.alarmVolume !== undefined ? parsed.alarmVolume : state.alarmVolume;
      state.alarmSound = parsed.alarmSound || state.alarmSound;
      state.enableNotifications = parsed.enableNotifications !== undefined ? parsed.enableNotifications : state.enableNotifications;
      state.enableVoiceAssistant = parsed.enableVoiceAssistant !== undefined ? parsed.enableVoiceAssistant : state.enableVoiceAssistant;
      
      state.theme = parsed.theme || state.theme;
      state.level = parsed.level !== undefined ? parsed.level : state.level;
      state.xp = parsed.xp !== undefined ? parsed.xp : state.xp;
      state.xpNeeded = parsed.xpNeeded !== undefined ? parsed.xpNeeded : state.xpNeeded;
      state.achievements = parsed.achievements || [];
      state.equippedAccessory = parsed.equippedAccessory || null;
      state.petRoomTheme = parsed.petRoomTheme || 'cosmic';
      state.dailyQuests = parsed.dailyQuests || [];
      state.lastQuestDate = parsed.lastQuestDate || null;
      state.chestClaimed = parsed.chestClaimed || false;
      state.minigameHighScore = parsed.minigameHighScore || 0;
      state.pomoCoins = parsed.pomoCoins || 0;
      state.happiness = parsed.happiness !== undefined ? parsed.happiness : 100;
      state.inventory = parsed.inventory || { magnet: 0, shield: 0, timewarp: 0, doublexp: 0 };
      state.activeBuffs = parsed.activeBuffs || { doublexpUntil: null };
      state.flappyHighScore = parsed.flappyHighScore || 0;
      state.boss = parsed.boss || state.boss;
      state.lastWheelSpinDate = parsed.lastWheelSpinDate || null;
      state.user = parsed.user || state.user;
      
      state.tasks = parsed.tasks || [];
      state.activeTaskId = parsed.activeTaskId || null;
      state.stats = parsed.stats || state.stats;
      
      // Süreleri durum ayarlarına yükle
      state.timeLeft = state.durations[state.currentMode];
      
      // Pet durumunu yükle
      updatePomoPet();
    } catch(e) {
      console.error("Kayıtlı veri okuma hatası", e);
    }
  }
}

// Arayüz Ayarlarını Güncelle (Modal Açılınca/Veri Yüklenince)
function syncSettingsInputs() {
  if (inputPomodoro) {
    inputPomodoro.value = state.durations.pomodoro / 60;
    if (valPomodoro) valPomodoro.textContent = `${inputPomodoro.value} dk`;
  }
  if (inputShort) {
    inputShort.value = state.durations.short / 60;
    if (valShort) valShort.textContent = `${inputShort.value} dk`;
  }
  if (inputLong) {
    inputLong.value = state.durations.long / 60;
    if (valLong) valLong.textContent = `${inputLong.value} dk`;
  }
  
  if (chkAutoBreak) chkAutoBreak.checked = state.autoBreak;
  if (chkAutoFocus) chkAutoFocus.checked = state.autoFocus;
  
  if (chkNotifications) chkNotifications.checked = state.enableNotifications;
  if (chkVoiceAssistant) chkVoiceAssistant.checked = state.enableVoiceAssistant;
  if (selectTheme) selectTheme.value = state.theme;
  
  if (inputAlarmVolume) {
    inputAlarmVolume.value = state.alarmVolume;
    if (valAlarmVolume) valAlarmVolume.textContent = `${Math.round(state.alarmVolume * 100)}%`;
  }
  
  if (selectAlarmSound) selectAlarmSound.value = state.alarmSound;
}

// ----------------------------------------------------
// OLAY TETİKLEYİCİLERİ (EVENT LISTENERS)
// ----------------------------------------------------

// Sayaç Mod Değiştiricileri
if (modePomodoro) modePomodoro.addEventListener('click', () => setMode('pomodoro'));
if (modeShort) modeShort.addEventListener('click', () => setMode('short'));
if (modeLong) modeLong.addEventListener('click', () => setMode('long'));

// Sayaç Kontrolleri
if (btnPlayPause) {
  btnPlayPause.addEventListener('click', () => {
    if (state.timerRunning) {
      stopTimer();
      playClickSound();
    } else {
      startTimer();
    }
  });
}
if (btnReset) btnReset.addEventListener('click', resetTimer);
if (btnSkip) btnSkip.addEventListener('click', skipTimer);

// Görev Ekleme Formu
if (taskForm) {
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = taskInput ? taskInput.value.trim() : '';
    const targetVal = taskTargetInput ? (parseInt(taskTargetInput.value) || 1) : 1;
    const catVal = taskCategoryInput ? (taskCategoryInput.value || 'work') : 'work';
    const priorityVal = taskPriorityInput ? (taskPriorityInput.value || 'low') : 'low';
    if (text) {
      const newTask = {
        id: Date.now().toString(),
        title: text,
        completed: false,
        pomodoros: 0,
        targetPomodoros: targetVal,
        category: catVal,
        priority: priorityVal
      };
      state.tasks.push(newTask);
      if (taskInput) taskInput.value = '';
      if (taskTargetInput) taskTargetInput.value = "1";
      if (taskCategoryInput) taskCategoryInput.value = "work";
      if (taskPriorityInput) taskPriorityInput.value = "low";
      
      // Eğer şu an aktif görev yoksa, bunu otomatik olarak aktif yap
      if (!state.activeTaskId) {
        state.activeTaskId = newTask.id;
        if (activeTaskTitle) activeTaskTitle.textContent = newTask.title;
      }
      
      showPetSpeech("Yeni görev eklendi! 👍");
      checkAchievements();
      saveData();
      renderTasks();
    }
  });
}

// Modallar Aç/Kapa
if (btnTasksToggle) {
  btnTasksToggle.addEventListener('click', () => {
    if (tasksSection) tasksSection.classList.add('open');
    document.body.classList.add('modal-open');
    playClickSound();
  });
}
if (closeTasksMobile) {
  closeTasksMobile.addEventListener('click', () => {
    if (tasksSection) tasksSection.classList.remove('open');
    document.body.classList.remove('modal-open');
    playClickSound();
  });
}

if (btnStats) {
  btnStats.addEventListener('click', () => {
    renderStats();
    if (modalStats) modalStats.classList.remove('hidden');
    document.body.classList.add('modal-open');
    playClickSound();
  });
}
if (closeStats) {
  closeStats.addEventListener('click', () => {
    if (modalStats) modalStats.classList.add('hidden');
    document.body.classList.remove('modal-open');
    playClickSound();
  });
}

if (btnSettings) {
  btnSettings.addEventListener('click', () => {
    syncSettingsInputs();
    if (modalSettings) modalSettings.classList.remove('hidden');
    document.body.classList.add('modal-open');
    playClickSound();
  });
}
if (closeSettings) {
  closeSettings.addEventListener('click', () => {
    if (modalSettings) modalSettings.classList.add('hidden');
    document.body.classList.remove('modal-open');
    playClickSound();
  });
}

// Pomo-Pet Evi Modalı Aç/Kapa
if (btnPet) {
  btnPet.addEventListener('click', () => {
    openPetHouse();
    playClickSound();
  });
}
if (closePet) {
  closePet.addEventListener('click', () => {
    if (modalPet) modalPet.classList.add('hidden');
    document.body.classList.remove('modal-open');
    playClickSound();
  });
}

// Sevgi Göster Butonu
if (btnPetLove) {
  btnPetLove.addEventListener('click', () => {
    petLoveInteraction();
  });
}

// Modal dışına tıklayınca kapat
window.addEventListener('click', (e) => {
  if (modalStats && e.target === modalStats) {
    modalStats.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }
  if (modalSettings && e.target === modalSettings) {
    modalSettings.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }
  if (tasksSection && e.target === tasksSection) {
    tasksSection.classList.remove('open');
    document.body.classList.remove('modal-open');
  }
  if (modalPet && e.target === modalPet) {
    modalPet.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }
  if (modalShop && e.target === modalShop) {
    modalShop.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }
  if (modalMinigame && e.target === modalMinigame) {
    modalMinigame.classList.add('hidden');
    document.body.classList.remove('modal-open');
    miniGameRunning = false;
    flappyGameRunning = false;
  }
  const modalWheel = document.getElementById('modal-wheel');
  if (modalWheel && e.target === modalWheel) {
    modalWheel.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }
  const modalWellness = document.getElementById('modal-wellness');
  if (modalWellness && e.target === modalWellness) {
    modalWellness.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }
  const modalAppMenu = document.getElementById('modal-app-menu');
  if (modalAppMenu && e.target === modalAppMenu) {
    modalAppMenu.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }
  const modalProfile = document.getElementById('modal-profile');
  if (modalProfile && e.target === modalProfile) {
    modalProfile.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }
});

// Ayarlar Paneli Değişiklikleri
if (inputPomodoro) {
  inputPomodoro.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    if (valPomodoro) valPomodoro.textContent = `${val} dk`;
    state.durations.pomodoro = val * 60;
    if (state.currentMode === 'pomodoro' && !state.timerRunning) {
      state.timeLeft = state.durations.pomodoro;
      updateTimerDisplay();
    }
    saveData();
  });
}

if (inputShort) {
  inputShort.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    if (valShort) valShort.textContent = `${val} dk`;
    state.durations.short = val * 60;
    if (state.currentMode === 'short' && !state.timerRunning) {
      state.timeLeft = state.durations.short;
      updateTimerDisplay();
    }
    saveData();
  });
}

if (inputLong) {
  inputLong.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    if (valLong) valLong.textContent = `${val} dk`;
    state.durations.long = val * 60;
    if (state.currentMode === 'long' && !state.timerRunning) {
      state.timeLeft = state.durations.long;
      updateTimerDisplay();
    }
    saveData();
  });
}

if (chkAutoBreak) {
  chkAutoBreak.addEventListener('change', (e) => {
    state.autoBreak = e.target.checked;
    saveData();
  });
}

if (chkAutoFocus) {
  chkAutoFocus.addEventListener('change', (e) => {
    state.autoFocus = e.target.checked;
    saveData();
  });
}

if (inputAlarmVolume) {
  inputAlarmVolume.addEventListener('input', (e) => {
    state.alarmVolume = parseFloat(e.target.value);
    if (valAlarmVolume) valAlarmVolume.textContent = `${Math.round(state.alarmVolume * 100)}%`;
    saveData();
  });
}

// Alarm Sesi Seçimi ve Ön Dinleme
if (selectAlarmSound) {
  selectAlarmSound.addEventListener('change', (e) => {
    state.alarmSound = e.target.value;
    saveData();
    // Ön dinleme çal
    setTimeout(playAlarmSound, 200);
  });
}

// Tema Değiştirici Dinleyici
if (selectTheme) {
  selectTheme.addEventListener('change', (e) => {
    applyTheme(e.target.value);
  });
}

// Bildirim ve Sesli Rehber Ayar Tetikleyicileri
if (chkNotifications) {
  chkNotifications.addEventListener('change', (e) => {
    state.enableNotifications = e.target.checked;
    if (state.enableNotifications) {
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          state.enableNotifications = permission === 'granted';
          if (chkNotifications) chkNotifications.checked = state.enableNotifications;
          saveData();
        });
      }
    } else {
      saveData();
    }
  });
}

if (chkVoiceAssistant) {
  chkVoiceAssistant.addEventListener('change', (e) => {
    state.enableVoiceAssistant = e.target.checked;
    saveData();
    if (state.enableVoiceAssistant) {
      speakMessage("Sesli rehber rehberliği aktif edildi.");
    }
  });
}

// Zen Modu Buton Dinleyicileri
if (btnZen) {
  btnZen.addEventListener('click', () => {
    toggleZenMode(true);
  });
}

if (btnExitZen) {
  btnExitZen.addEventListener('click', () => {
    toggleZenMode(false);
  });
}

// ESC Tuşu ile Zen Modundan Çıkış
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && state.zenMode) {
    toggleZenMode(false);
  }
});

// İstatistikleri Sıfırla
if (btnResetStats) {
  btnResetStats.addEventListener('click', () => {
    if (confirm("Tüm odaklanma verilerinizi sıfırlamak istediğinize emin misiniz? Bu işlem geri alınamaz.")) {
      state.stats = {
        totalFocusMinutes: 0,
        completedPomodoros: 0,
        streak: 0,
        lastCompletedDate: null,
        history: {}
      };
      state.level = 1;
      state.xp = 0;
      state.xpNeeded = 500;
      state.achievements = [];
      
      saveData();
      renderStats();
      updateXpDisplay();
      playClickSound();
    }
  });
}

// ----------------------------------------------------
// BAŞLANGIÇ ÇALIŞTIRMASI (BOOTSTRAP)
// ----------------------------------------------------
// ----------------------------------------------------
// POMO-PET EVİ MODALI VERİ VE İŞLEVLERİ
// ----------------------------------------------------

const PET_EVOLUTIONS = [
  { level: 1, name: 'Tohum',     emoji: '🌱', desc: 'Başlangıç' },
  { level: 2, name: 'Filiz',     emoji: '🌿', desc: 'Lvl 2' },
  { level: 3, name: 'Çiçek',     emoji: '🌸', desc: 'Lvl 3' },
  { level: 4, name: 'Domates',   emoji: '🍅', desc: 'Lvl 4' },
  { level: 5, name: 'Astro-Pomo',emoji: '🧑‍🚀', desc: 'Lvl 5+' }
];

const PET_ACCESSORIES = [
  { id: 'sunglasses', name: 'Cool Gözlük',    emoji: '😎', unlockLevel: 2 },
  { id: 'bowtie',     name: 'Kırmızı Papyon', emoji: '🎀', unlockLevel: 3 },
  { id: 'tophat',     name: 'Sihirbaz Şapka', emoji: '🎩', unlockLevel: 4 },
  { id: 'crown',      name: 'Altın Taç',      emoji: '👑', unlockLevel: 5 },
  { id: 'scarf',      name: 'Kışlık Atkı',    emoji: '🧣', unlockLevel: 3 },
  { id: 'cape',       name: 'Süper Pelerin',   emoji: '🦸', unlockLevel: 5 }
];

const PET_LOVE_PHRASES = [
  'Birlikte çalışmak harika! 🥰',
  'Gıdıklandım! 😂',
  'Su içmeyi unutma! 💧',
  'Harikasın, devam et! 🌟',
  'Senin için gurur duyuyorum! 😊',
  'Biraz mola vermeyi düşün! ☕',
  'Beraber büyüyoruz! 🌱',
  'Dünden daha iyisin! 💪',
  'Odaklanma gücün müthiş! 🔥',
  'Teşekkürler, çok mutluyum! 💖'
];

function getAccessorySvgOverlay(accessoryId) {
  switch (accessoryId) {
    case 'sunglasses':
      return `<g class="pet-accessory-overlay">
        <rect x="35" y="46" width="12" height="5" rx="2" fill="#1a1a2e" />
        <rect x="53" y="46" width="12" height="5" rx="2" fill="#1a1a2e" />
        <line x1="47" y1="48" x2="53" y2="48" stroke="#1a1a2e" stroke-width="1.5" />
        <line x1="35" y1="48" x2="31" y2="46" stroke="#1a1a2e" stroke-width="1.5" />
        <line x1="65" y1="48" x2="69" y2="46" stroke="#1a1a2e" stroke-width="1.5" />
      </g>`;
    case 'bowtie':
      return `<g class="pet-accessory-overlay">
        <path d="M42 68 L50 64 L58 68 L50 72 Z" fill="#e74c3c" />
        <circle cx="50" cy="68" r="2" fill="#c0392b" />
      </g>`;
    case 'tophat':
      return `<g class="pet-accessory-overlay">
        <rect x="38" y="28" width="24" height="14" rx="2" fill="#2c3e50" />
        <rect x="34" y="42" width="32" height="3" rx="1.5" fill="#2c3e50" />
        <rect x="40" y="39" width="20" height="4" rx="1" fill="#8e44ad" />
      </g>`;
    case 'crown':
      return `<g class="pet-accessory-overlay">
        <path d="M36 38 L40 28 L44 35 L50 24 L56 35 L60 28 L64 38 Z" fill="#f1c40f" />
        <rect x="36" y="38" width="28" height="4" rx="1" fill="#f39c12" />
        <circle cx="44" cy="33" r="1.5" fill="#e74c3c" />
        <circle cx="50" cy="28" r="1.5" fill="#3498db" />
        <circle cx="56" cy="33" r="1.5" fill="#2ecc71" />
      </g>`;
    case 'scarf':
      return `<g class="pet-accessory-overlay">
        <path d="M38 65 Q50 70 62 65" stroke="#e74c3c" stroke-width="4" fill="none" stroke-linecap="round" />
        <path d="M58 66 Q60 74 56 80" stroke="#e74c3c" stroke-width="3.5" fill="none" stroke-linecap="round" />
      </g>`;
    case 'cape':
      return `<g class="pet-accessory-overlay">
        <path d="M34 55 Q30 75 38 90 L50 85 L62 90 Q70 75 66 55" fill="rgba(231, 76, 60, 0.6)" />
        <path d="M34 55 Q30 75 38 90" stroke="#c0392b" stroke-width="1" fill="none" />
        <path d="M66 55 Q70 75 62 90" stroke="#c0392b" stroke-width="1" fill="none" />
      </g>`;
    default:
      return '';
  }
}

function getCurrentEvolutionStage() {
  const lvl = state.level || 1;
  if (lvl >= 5) return PET_EVOLUTIONS[4];
  return PET_EVOLUTIONS[lvl - 1];
}

function openPetHouse() {
  renderPetHouseDisplay();
  renderEvolutionTree();
  renderAccessoryGrid();
  renderDailyQuests();
  setPetRoomTheme(state.petRoomTheme || 'cosmic');
  updateHappinessDisplay();
  updatePlayerTitleDisplay();
  modalPet.classList.remove('hidden');
  document.body.classList.add('modal-open');
}

function renderPetHouseDisplay() {
  if (!petHouseDisplay) return;
  // Büyük pet SVG'sini oluştur (updatePomoPet ile aynı SVG ama büyük boyut)
  const petSvg = generatePetSvg(state.level, state.equippedAccessory);
  petHouseDisplay.innerHTML = petSvg;
  
  const stage = getCurrentEvolutionStage();
  petStageName.textContent = `${stage.name} ${stage.emoji}`;
  petLevelBadge.textContent = `Lvl ${state.level}`;
}

function generatePetSvg(level, accessory) {
  let lvl = level || 1;
  let baseSvg = '';
  let animClass = 'animate-breath';
  
  if (lvl === 1) {
    baseSvg = `
      <path d="M35 70 L40 90 L60 90 L65 70 Z" fill="#8d6e63" />
      <rect x="32" y="65" width="36" height="6" rx="2" fill="#6d4c41" />
      <ellipse cx="50" cy="67" rx="14" ry="4" fill="#4e342e" />
      <circle cx="50" cy="59" r="4.5" fill="#d4e157" filter="drop-shadow(0 0 4px #d4e157)" />
      <path d="M50 55 Q52 52 50 49" stroke="#9ccc65" stroke-width="1.5" fill="none" />
    `;
  } else if (lvl === 2) {
    baseSvg = `
      <path d="M35 70 L40 90 L60 90 L65 70 Z" fill="#8d6e63" />
      <rect x="32" y="65" width="36" height="6" rx="2" fill="#6d4c41" />
      <ellipse cx="50" cy="67" rx="14" ry="4" fill="#4e342e" />
      <path d="M50 67 Q47 50 51 38" stroke="#9ccc65" stroke-width="3" fill="none" stroke-linecap="round" />
      <path d="M51 38 Q61 34 59 42 Q52 42 51 38" fill="#66bb6a" />
      <path d="M51 38 Q41 36 45 44 Q50 42 51 38" fill="#66bb6a" />
    `;
  } else if (lvl === 3) {
    baseSvg = `
      <path d="M35 70 L40 90 L60 90 L65 70 Z" fill="#8d6e63" />
      <rect x="32" y="65" width="36" height="6" rx="2" fill="#6d4c41" />
      <ellipse cx="50" cy="67" rx="14" ry="4" fill="#4e342e" />
      <path d="M50 67 Q46 45 52 30" stroke="#9ccc65" stroke-width="3.5" fill="none" stroke-linecap="round" />
      <path d="M51 45 Q61 42 57 49 Q51 48 51 45" fill="#66bb6a" />
      <path d="M49 52 Q39 52 43 59 Q49 56 49 52" fill="#66bb6a" />
      <circle cx="52" cy="27" r="4.5" fill="#ffca28" filter="drop-shadow(0 0 3px #ffca28)" />
      <circle cx="52" cy="21" r="3.5" fill="#f48fb1" />
      <circle cx="52" cy="33" r="3.5" fill="#f48fb1" />
      <circle cx="46" cy="27" r="3.5" fill="#f48fb1" />
      <circle cx="58" cy="27" r="3.5" fill="#f48fb1" />
    `;
  } else if (lvl === 4) {
    baseSvg = `
      <circle cx="50" cy="55" r="22" fill="#9ccc65" filter="drop-shadow(0 4px 8px rgba(0,0,0,0.2))" />
      <path d="M50 33 L50 25 M50 33 Q56 28 62 33 M50 33 Q44 28 38 33" stroke="#4caf50" stroke-width="3.5" stroke-linecap="round" fill="none" />
      <g class="pet-blink">
        <circle cx="42" cy="52" r="2.5" fill="#37474f" />
        <circle cx="58" cy="52" r="2.5" fill="#37474f" />
      </g>
      <circle cx="38" cy="57" r="2" fill="#ff8a80" opacity="0.6" />
      <circle cx="62" cy="57" r="2" fill="#ff8a80" opacity="0.6" />
      <path d="M47 59 Q50 62 53 59" stroke="#37474f" stroke-width="2" fill="none" stroke-linecap="round" />
    `;
  } else {
    animClass = 'animate-float-breath';
    baseSvg = `
      <circle cx="50" cy="50" r="27" fill="none" stroke="rgba(0, 198, 255, 0.4)" stroke-width="1.5" filter="drop-shadow(0 0 8px #00c6ff)" />
      <circle cx="50" cy="52" r="20" fill="#ff5e62" filter="drop-shadow(0 4px 8px rgba(255, 94, 98, 0.4))" />
      <path d="M50 32 L50 26 M50 32 Q55 28 60 32 M50 32 Q45 28 40 32" stroke="#4caf50" stroke-width="3" stroke-linecap="round" fill="none" />
      <g class="pet-blink">
        <circle cx="43" cy="50" r="2.5" fill="#fff" />
        <circle cx="44" cy="49" r="1" fill="#000" />
        <circle cx="57" cy="50" r="2.5" fill="#fff" />
        <circle cx="58" cy="49" r="1" fill="#000" />
      </g>
      <circle cx="38" cy="55" r="2" fill="#ff2a6d" opacity="0.6" />
      <circle cx="62" cy="55" r="2" fill="#ff2a6d" opacity="0.6" />
      <path d="M47 57 Q50 61 53 57" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" />
      <circle cx="50" cy="50" r="25" fill="rgba(0, 198, 255, 0.06)" stroke="rgba(255, 255, 255, 0.4)" stroke-width="1.5" />
      <path d="M37 38 Q43 33 50 33" stroke="rgba(255, 255, 255, 0.6)" stroke-width="1.5" fill="none" stroke-linecap="round" />
    `;
  }
  
  const accessoryOverlay = accessory ? getAccessorySvgOverlay(accessory) : '';
  return `<svg viewBox="0 0 100 100" class="${animClass}">${baseSvg}${accessoryOverlay}</svg>`;
}

function renderEvolutionTree() {
  if (!petEvolutionTree) return;
  petEvolutionTree.innerHTML = '';
  
  PET_EVOLUTIONS.forEach((evo, idx) => {
    // Ok işareti (ilk hariç)
    if (idx > 0) {
      const arrow = document.createElement('span');
      arrow.className = 'evo-arrow';
      arrow.textContent = '→';
      petEvolutionTree.appendChild(arrow);
    }
    
    const node = document.createElement('div');
    const isUnlocked = state.level >= evo.level;
    const isCurrent = (state.level >= evo.level && (idx === PET_EVOLUTIONS.length - 1 || state.level < PET_EVOLUTIONS[idx + 1].level));
    
    node.className = `evo-node ${isUnlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'current' : ''}`;
    node.innerHTML = `
      <div class="evo-node-icon">${evo.emoji}</div>
      <span class="evo-node-label">${evo.name}</span>
    `;
    petEvolutionTree.appendChild(node);
  });
}

function renderAccessoryGrid() {
  if (!petAccessoryGrid) return;
  petAccessoryGrid.innerHTML = '';
  
  PET_ACCESSORIES.forEach(acc => {
    const isUnlocked = state.level >= acc.unlockLevel;
    const isEquipped = state.equippedAccessory === acc.id;
    
    const card = document.createElement('div');
    card.className = `accessory-card ${isEquipped ? 'equipped' : ''} ${!isUnlocked ? 'locked' : ''}`;
    
    let badgeHtml = '';
    if (!isUnlocked) {
      badgeHtml = `<span class="accessory-lock-badge">🔒</span>`;
    } else if (isEquipped) {
      badgeHtml = `<div class="accessory-equipped-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg></div>`;
    }
    
    card.innerHTML = `
      ${badgeHtml}
      <span class="accessory-icon">${acc.emoji}</span>
      <span class="accessory-name">${acc.name}</span>
    `;
    
    card.addEventListener('click', () => {
      if (!isUnlocked) {
        showPetHouseSpeech(`Lvl ${acc.unlockLevel} gerekli! 🔒`);
        return;
      }
      playClickSound();
      if (isEquipped) {
        state.equippedAccessory = null;
        showPetHouseSpeech('Aksesuar çıkarıldı!');
      } else {
        state.equippedAccessory = acc.id;
        showPetHouseSpeech(`${acc.name} takıldı! ${acc.emoji}`);
      }
      saveData();
      updatePomoPet();
      renderPetHouseDisplay();
      renderAccessoryGrid();
    });
    
    petAccessoryGrid.appendChild(card);
  });
}

let petHouseSpeechTimeout = null;
function showPetHouseSpeech(text) {
  if (!petHouseSpeech) return;
  petHouseSpeech.textContent = text;
  petHouseSpeech.classList.add('show');
  if (petHouseSpeechTimeout) clearTimeout(petHouseSpeechTimeout);
  petHouseSpeechTimeout = setTimeout(() => {
    petHouseSpeech.classList.remove('show');
  }, 3000);
}

function petLoveInteraction() {
  initAudio();
  playClickSound();
  updateQuestProgress('love', 1);
  
  // Zıplama animasyonu
  if (petHouseDisplay) {
    petHouseDisplay.classList.add('pet-jumping');
    setTimeout(() => petHouseDisplay.classList.remove('pet-jumping'), 650);
  }
  
  // Kalp cıvıldama sesi
  if (audioCtx) {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(1100, now + 0.08);
    osc.frequency.setValueAtTime(1320, now + 0.16);
    g.gain.setValueAtTime(0.03, now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    osc.connect(g); g.connect(audioCtx.destination);
    osc.start(now); osc.stop(now + 0.4);
  }
  
  // Yüzen kalpler
  const stage = document.querySelector('.pet-showcase-stage');
  if (stage) {
    for (let i = 0; i < 6; i++) {
      const heart = document.createElement('span');
      heart.className = 'floating-heart';
      heart.textContent = '❤️';
      heart.style.left = `${30 + Math.random() * 40}%`;
      heart.style.bottom = `${30 + Math.random() * 30}%`;
      heart.style.animationDelay = `${i * 0.15}s`;
      stage.appendChild(heart);
      setTimeout(() => heart.remove(), 1500);
    }
  }
  
  // Rastgele konuşma
  const phrase = PET_LOVE_PHRASES[Math.floor(Math.random() * PET_LOVE_PHRASES.length)];
  showPetHouseSpeech(phrase);
  showPetSpeech(phrase);
}

// ----------------------------------------------------
// POMOFOCUS 2.0: GÜNLÜK GÖREVLER VE HAZİNE SANDIĞI
// ----------------------------------------------------

const DEFAULT_DAILY_QUESTS = [
  { id: 'focus_2', title: '2 Odaklanma Seansı Tamamla', target: 2, icon: '🍅', xpReward: 50 },
  { id: 'task_1', title: '1 Görev Tamamla', target: 1, icon: '📝', xpReward: 40 },
  { id: 'love_3', title: 'Pet\'ine 3 Kez Sevgi Göster', target: 3, icon: '❤️', xpReward: 30 }
];

function checkAndResetDailyQuests() {
  const todayStr = getTodayDateString();
  if (state.lastQuestDate !== todayStr || !state.dailyQuests || state.dailyQuests.length === 0) {
    state.lastQuestDate = todayStr;
    state.chestClaimed = false;
    state.dailyQuests = DEFAULT_DAILY_QUESTS.map(q => ({
      ...q,
      progress: 0,
      completed: false
    }));
    saveData();
  }
}

function updateQuestProgress(type, amount = 1) {
  checkAndResetDailyQuests();
  let updated = false;
  state.dailyQuests.forEach(quest => {
    if (quest.id.includes(type) && !quest.completed) {
      quest.progress = Math.min(quest.target, quest.progress + amount);
      if (quest.progress >= quest.target) {
        quest.completed = true;
        awardXp(quest.xpReward);
        sendNotification('Günlük Görev Tamamlandı! 🎯', `${quest.title} tamamlandı! +${quest.xpReward} XP kazandınız.`);
        showPetHouseSpeech(`Görev bitti! +${quest.xpReward} XP 🎉`);
      }
      updated = true;
    }
  });
  if (updated) {
    saveData();
    renderDailyQuests();
  }
}

function renderDailyQuests() {
  checkAndResetDailyQuests();
  const questsContainer = document.getElementById('daily-quests-list');
  if (!questsContainer) return;
  questsContainer.innerHTML = '';

  let completedCount = 0;
  state.dailyQuests.forEach(quest => {
    if (quest.completed) completedCount++;
    const item = document.createElement('div');
    item.className = `daily-quest-item ${quest.completed ? 'completed' : ''}`;
    item.innerHTML = `
      <div class="quest-item-left">
        <span class="quest-icon">${quest.icon}</span>
        <div class="quest-details">
          <span class="quest-title">${quest.title}</span>
          <span class="quest-progress-text">${quest.progress} / ${quest.target} ${quest.completed ? '✓' : ''}</span>
        </div>
      </div>
      <span class="quest-reward-badge">+${quest.xpReward} XP</span>
    `;
    questsContainer.appendChild(item);
  });

  const mysteryChest = document.getElementById('mystery-chest');
  const chestStatusText = document.getElementById('chest-status-text');
  const chestSubtext = document.getElementById('chest-subtext');
  const claimChestBtn = document.getElementById('btn-claim-chest');

  if (mysteryChest && chestStatusText && chestSubtext && claimChestBtn) {
    chestSubtext.textContent = `${completedCount} / 3 Görev Tamamlandı`;

    if (state.chestClaimed) {
      mysteryChest.className = 'mystery-chest opened';
      chestStatusText.textContent = 'Hazine Sandığı Açıldı ✨';
      claimChestBtn.classList.add('hidden');
    } else if (completedCount >= 3) {
      mysteryChest.className = 'mystery-chest ready';
      chestStatusText.textContent = 'Sandık Açılmaya Hazır! 🎁';
      claimChestBtn.classList.remove('hidden');
    } else {
      mysteryChest.className = 'mystery-chest locked';
      chestStatusText.textContent = 'Hazine Sandığı (Kilitli)';
      claimChestBtn.classList.add('hidden');
    }
  }
}

function claimMysteryChest() {
  if (state.chestClaimed) return;
  const completedCount = state.dailyQuests.filter(q => q.completed).length;
  if (completedCount < 3) return;

  initAudio();
  playSuccessChime();
  state.chestClaimed = true;

  const chestEl = document.getElementById('mystery-chest');
  if (chestEl) {
    const rect = chestEl.getBoundingClientRect();
    spawnConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  awardXp(100);
  speakMessage("Tebrikler! Günlük hazine sandığını açtınız ve 100 XP kazandınız.");
  sendNotification("Sürpriz Sandık Açıldı! 🎁", "Harika! 100 Bonus XP kazandınız!");
  showPetHouseSpeech("Sürpriz Sandık Açıldı! +100 XP 🎁✨");

  saveData();
  renderDailyQuests();
}

// ----------------------------------------------------
// POMOFOCUS 2.0: PET ODASI TEMALARI
// ----------------------------------------------------

function setPetRoomTheme(themeName) {
  state.petRoomTheme = themeName;
  const showcase = document.getElementById('pet-house-showcase');
  if (showcase) {
    showcase.className = `pet-house-showcase room-${themeName}`;
  }
  document.querySelectorAll('.room-theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-theme') === themeName);
  });
  saveData();
}

// ----------------------------------------------------
// POMOFOCUS 2.0: DOMATES YAKALAMA MOLA MİNİ-OYUNU
// ----------------------------------------------------

let miniGameRunning = false;
let miniGameScore = 0;
let miniGameTimer = 30;
let miniGameInterval = null;
let miniGameAnimationId = null;
let basket = { x: 160, y: 350, width: 80, height: 25 };
let fallingObjects = [];

function initCatchTomatoGame() {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;

  const updateBasketPos = (clientX) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const canvasX = (clientX - rect.left) * scaleX;
    basket.x = Math.max(0, Math.min(canvas.width - basket.width, canvasX - basket.width / 2));
  };

  canvas.onmousemove = (e) => {
    if (miniGameRunning && state.activeGameMode === 'catch') {
      updateBasketPos(e.clientX);
    }
  };

  canvas.ontouchmove = (e) => {
    if (miniGameRunning && state.activeGameMode === 'catch' && e.touches.length > 0) {
      e.preventDefault();
      updateBasketPos(e.touches[0].clientX);
    }
  };
}

function startCatchTomatoGame() {
  const canvas = document.getElementById('game-canvas');
  const overlay = document.getElementById('game-overlay');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  miniGameRunning = true;
  miniGameScore = 0;
  miniGameTimer = (state.inventory && state.inventory.timewarp > 0) ? 40 : 30;
  fallingObjects = [];
  basket.x = canvas.width / 2 - basket.width / 2;

  if (overlay) overlay.classList.add('hidden');
  updateCatchHud();

  if (miniGameInterval) clearInterval(miniGameInterval);
  miniGameInterval = setInterval(() => {
    miniGameTimer--;
    updateCatchHud();
    if (miniGameTimer <= 0) {
      endCatchTomatoGame();
    }
  }, 1000);

  let lastSpawn = Date.now();

  function catchLoop() {
    if (!miniGameRunning) return;

    const spawnRate = 450;
    if (Date.now() - lastSpawn > spawnRate) {
      spawnFallingObject();
      lastSpawn = Date.now();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Arka plan
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Sepet Çizimi
    ctx.fillStyle = '#ff7675';
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
    ctx.fillStyle = '#d63031';
    ctx.fillRect(basket.x + 5, basket.y + 5, basket.width - 10, basket.height - 10);

    // Düşen Nesneler
    for (let i = fallingObjects.length - 1; i >= 0; i--) {
      const obj = fallingObjects[i];
      obj.y += obj.speed;

      // Mıknatıs Etkisi
      if (state.inventory && state.inventory.magnet > 0 && obj.type !== 'bomb') {
        const dx = (basket.x + basket.width / 2) - obj.x;
        obj.x += dx * 0.05;
      }

      ctx.font = '24px serif';
      ctx.textAlign = 'center';
      let emoji = '🍅';
      if (obj.type === 'star') emoji = '⭐';
      if (obj.type === 'bomb') emoji = '💣';
      ctx.fillText(emoji, obj.x, obj.y);

      // Çarpışma Kontrolü
      if (
        obj.y >= basket.y &&
        obj.y <= basket.y + basket.height + 15 &&
        obj.x >= basket.x - 10 &&
        obj.x <= basket.x + basket.width + 10
      ) {
        if (obj.type === 'tomato') {
          miniGameScore += 10;
          playClickSound();
        } else if (obj.type === 'star') {
          miniGameScore += 25;
          playSuccessChime();
        } else if (obj.type === 'bomb') {
          if (state.inventory && state.inventory.shield > 0) {
            state.inventory.shield--;
            sendNotification("Kalkan Koruması! 🛡️", "Bomba kalkanı sizi korudu!");
          } else {
            miniGameScore = Math.max(0, miniGameScore - 30);
            playClickSound();
          }
        }
        updateCatchHud();
        fallingObjects.splice(i, 1);
        continue;
      }

      if (obj.y > canvas.height + 20) {
        fallingObjects.splice(i, 1);
      }
    }

    miniGameAnimationId = requestAnimationFrame(catchLoop);
  }

  catchLoop();
}

function spawnFallingObject() {
  const rand = Math.random();
  let type = 'tomato';
  if (rand > 0.8) type = 'star';
  else if (rand > 0.65) type = 'bomb';

  fallingObjects.push({
    x: 20 + Math.random() * 360,
    y: -20,
    speed: 3 + Math.random() * 3.5,
    type: type
  });
}

function updateCatchHud() {
  const scoreEl = document.getElementById('game-score');
  const timerEl = document.getElementById('game-timer');
  const highscoreEl = document.getElementById('game-highscore');
  if (scoreEl) scoreEl.textContent = miniGameScore;
  if (timerEl) timerEl.textContent = `${miniGameTimer}s`;
  if (highscoreEl) highscoreEl.textContent = state.minigameHighScore || 0;
}

function endCatchTomatoGame() {
  miniGameRunning = false;
  if (miniGameInterval) clearInterval(miniGameInterval);
  if (miniGameAnimationId) cancelAnimationFrame(miniGameAnimationId);

  const overlay = document.getElementById('game-overlay');
  const title = document.getElementById('overlay-title');
  const desc = document.getElementById('overlay-desc');
  const startBtn = document.getElementById('btn-start-game');

  if (miniGameScore > (state.minigameHighScore || 0)) {
    state.minigameHighScore = miniGameScore;
  }

  const earnedCoins = Math.floor(miniGameScore / 2);
  const earnedXp = miniGameScore;
  awardCoins(earnedCoins);
  awardXp(earnedXp);

  if (title) title.textContent = `Oyun Bitti! 🍅 Skor: ${miniGameScore}`;
  if (desc) desc.textContent = `Kazanılan: 🪙 +${earnedCoins} Coin, ⭐ +${earnedXp} XP. Rekor: ${state.minigameHighScore}`;
  if (startBtn) {
    startBtn.innerHTML = '<i data-lucide="rotate-ccw"></i> Yeniden Oyna';
    startBtn.onclick = () => startCatchTomatoGame();
  }

  if (overlay) overlay.classList.remove('hidden');
  saveData();
  lucide.createIcons();
}
// ----------------------------------------------------
// POMOFOCUS 3.0: PET BESLEME & MUTLULUK SİSTEMİ
// ----------------------------------------------------

function feedPet() {
  initAudio();
  playClickSound();
  state.happiness = Math.min(100, (state.happiness || 0) + 25);
  updateHappinessDisplay();
  
  const stage = document.querySelector('.pet-showcase-stage');
  if (stage) {
    for (let i = 0; i < 4; i++) {
      const food = document.createElement('span');
      food.className = 'floating-heart';
      food.textContent = ['🍎', '🍓', '🥗', '🍕'][i % 4];
      food.style.left = `${35 + Math.random() * 30}%`;
      food.style.bottom = `${30 + Math.random() * 30}%`;
      food.style.animationDelay = `${i * 0.15}s`;
      stage.appendChild(food);
      setTimeout(() => food.remove(), 1500);
    }
  }

  showPetHouseSpeech("Nefis! Karnım doydu 😋");
  showPetSpeech("Nefis! 😋");
  saveData();
}

function updateHappinessDisplay() {
  const fill = document.getElementById('happiness-bar-fill');
  const text = document.getElementById('happiness-val-text');
  if (fill) fill.style.width = `${state.happiness || 0}%`;
  if (text) text.textContent = `${state.happiness || 0}%`;
}

// ----------------------------------------------------
// POMOFOCUS 3.0: POMO-MAĞAZA (SHOP) VE GÜÇLENDİRMELER
// ----------------------------------------------------

function buyShopItem(itemType, cost) {
  if ((state.pomoCoins || 0) < cost) {
    sendNotification("Yetersiz Coin! 🪙", "Mağazadan alım yapmak için yeterli Pomo Coin'iniz yok.");
    showPetHouseSpeech("Daha fazla Coin lazım! 🪙");
    return;
  }

  initAudio();
  playSuccessChime();
  state.pomoCoins -= cost;
  updateCoinDisplay();

  if (itemType === 'doublexp') {
    state.activeBuffs.doublexpUntil = Date.now() + (3600 * 1000);
    sendNotification("2x XP İksiri Aktif! ⚡", "1 saat boyunca kazanılan tüm XP ikiye katlanacak!");
    showPetHouseSpeech("2x XP İksiri İçildi! ⚡");
  } else {
    state.inventory[itemType] = (state.inventory[itemType] || 0) + 1;
    sendNotification("Satın Alım Başarılı! 🛍️", `${itemType.toUpperCase()} envanterinize eklendi.`);
    showPetHouseSpeech(`${itemType.toUpperCase()} alındı! ✨`);
  }

  renderShop();
  saveData();
}

function renderShop() {
  updateCoinDisplay();
  document.querySelectorAll('.buy-item-btn').forEach(btn => {
    const item = btn.getAttribute('data-item');
    const cost = parseInt(btn.getAttribute('data-cost'));
    if (item === 'doublexp' && state.activeBuffs && state.activeBuffs.doublexpUntil && Date.now() < state.activeBuffs.doublexpUntil) {
      btn.textContent = 'Aktif (⚡ 2x XP)';
      btn.className = 'buy-item-btn owned';
    } else if (item !== 'doublexp' && state.inventory && state.inventory[item] > 0) {
      btn.textContent = `Sahipsin (${state.inventory[item]}x)`;
      btn.className = 'buy-item-btn owned';
    } else {
      btn.textContent = `🪙 ${cost} Coin`;
      btn.className = 'buy-item-btn';
    }
  });
}

// ----------------------------------------------------
// POMOFOCUS 3.0: 2. MİNİ-OYUN (ASTRO-POMO FLAPPY SPACE)
// ----------------------------------------------------

let flappyGameRunning = false;
let flappyScore = 0;
let flappyAnimationId = null;

let astroPomo = { x: 80, y: 180, vy: 0, gravity: 0.35, jump: -7, radius: 18 };
let spacePipes = [];

function startFlappySpaceGame() {
  const overlay = document.getElementById('game-overlay');
  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  flappyGameRunning = true;
  flappyScore = 0;
  spacePipes = [];
  astroPomo.y = 180;
  astroPomo.vy = 0;

  if (overlay) overlay.classList.add('hidden');
  updateFlappyHud();

  const handleJump = (e) => {
    if (e) e.preventDefault();
    if (flappyGameRunning) {
      astroPomo.vy = astroPomo.jump;
      playClickSound();
    }
  };

  canvas.onclick = handleJump;
  canvas.ontouchstart = handleJump;

  let lastPipeSpawn = Date.now();

  function flappyLoop() {
    if (!flappyGameRunning) return;

    if (Date.now() - lastPipeSpawn > 1600) {
      spawnSpacePipe();
      lastPipeSpawn = Date.now();
    }

    astroPomo.vy += astroPomo.gravity;
    astroPomo.y += astroPomo.vy;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0a0414';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#7b2ff7';
    for (let i = spacePipes.length - 1; i >= 0; i--) {
      const p = spacePipes[i];
      p.x -= p.speed;

      ctx.fillRect(p.x, 0, p.width, p.topHeight);
      ctx.fillRect(p.x, canvas.height - p.bottomHeight, p.width, p.bottomHeight);

      if (!p.passed && p.x + p.width < astroPomo.x) {
        p.passed = true;
        flappyScore += 1;
        updateFlappyHud();
      }

      if (
        astroPomo.x + astroPomo.radius > p.x &&
        astroPomo.x - astroPomo.radius < p.x + p.width &&
        (astroPomo.y - astroPomo.radius < p.topHeight || astroPomo.y + astroPomo.radius > canvas.height - p.bottomHeight)
      ) {
        if (state.inventory && state.inventory.shield > 0) {
          state.inventory.shield--;
          sendNotification("Kalkan Koruması! 🛡️", "Kalkan engelden korudu!");
          spacePipes.splice(i, 1);
          continue;
        } else {
          endFlappySpaceGame();
          return;
        }
      }

      if (p.x < -60) {
        spacePipes.splice(i, 1);
      }
    }

    if (astroPomo.y > canvas.height || astroPomo.y < 0) {
      endFlappySpaceGame();
      return;
    }

    ctx.font = '28px serif';
    ctx.textAlign = 'center';
    ctx.fillText('🧑‍🚀', astroPomo.x, astroPomo.y + 10);

    flappyAnimationId = requestAnimationFrame(flappyLoop);
  }

  flappyLoop();
}

function spawnSpacePipe() {
  const gap = 130;
  const topH = 50 + Math.random() * 170;
  const bottomH = 400 - topH - gap;
  spacePipes.push({
    x: 400,
    width: 45,
    topHeight: topH,
    bottomHeight: bottomH,
    speed: 2.5,
    passed: false
  });
}

function updateFlappyHud() {
  const scoreEl = document.getElementById('game-score');
  const timerEl = document.getElementById('game-timer');
  const highscoreEl = document.getElementById('game-highscore');
  if (scoreEl) scoreEl.textContent = flappyScore;
  if (timerEl) timerEl.textContent = "Sonsuz 🚀";
  if (highscoreEl) highscoreEl.textContent = state.flappyHighScore || 0;
}

function endFlappySpaceGame() {
  flappyGameRunning = false;
  if (flappyAnimationId) cancelAnimationFrame(flappyAnimationId);

  const overlay = document.getElementById('game-overlay');
  const title = document.getElementById('overlay-title');
  const desc = document.getElementById('overlay-desc');
  const startBtn = document.getElementById('btn-start-game');

  if (flappyScore > (state.flappyHighScore || 0)) {
    state.flappyHighScore = flappyScore;
  }

  const earnedCoins = flappyScore * 4;
  const earnedXp = flappyScore * 5;
  awardCoins(earnedCoins);
  awardXp(earnedXp);

  if (title) title.textContent = `Oyun Bitti! 🚀 Puan: ${flappyScore}`;
  if (desc) desc.textContent = `Kazanılan: 🪙 +${earnedCoins} Coin, ⭐ +${earnedXp} XP. Rekor: ${state.flappyHighScore}`;
  if (startBtn) {
    startBtn.innerHTML = '<i data-lucide="rotate-ccw"></i> Yeniden Zıpla';
    startBtn.onclick = () => startFlappySpaceGame();
  }

  if (overlay) overlay.classList.remove('hidden');
  saveData();
  lucide.createIcons();
}

function switchGameMode(mode) {
  state.activeGameMode = mode;
  document.querySelectorAll('.game-tab-btn').forEach(btn => btn.classList.remove('active'));

  const tabBtn = document.getElementById(mode === 'catch' ? 'tab-catch-tomato' : 'tab-flappy-space');
  if (tabBtn) tabBtn.classList.add('active');

  const title = document.getElementById('overlay-title');
  const desc = document.getElementById('overlay-desc');
  const startBtn = document.getElementById('btn-start-game');
  const tip = document.getElementById('game-controls-tip');
  const highscoreEl = document.getElementById('game-highscore');

  if (mode === 'catch') {
    if (title) title.textContent = "🍅 Domatesleri Yakala!";
    if (desc) desc.textContent = "30 saniye içinde düşen domates ve yıldızları topla, bombalara dikkat et!";
    if (tip) tip.textContent = "💡 İpucu: Sepeti hareket ettirmek için parmağınızı/farenizi sağa sola sürükleyin!";
    if (highscoreEl) highscoreEl.textContent = state.minigameHighScore || 0;
    if (startBtn) {
      startBtn.innerHTML = '<i data-lucide="play"></i> Oyunu Başlat';
      startBtn.onclick = () => startCatchTomatoGame();
    }
  } else if (mode === 'flappy') {
    if (title) title.textContent = "🚀 Astro-Pomo Flappy Space";
    if (desc) desc.textContent = "Ekrana dokunarak astronot domatesi engellerin arasından geçirin!";
    if (tip) tip.textContent = "💡 İpucu: Zıplamak için ekrana veya oyun sahasına dokunun!";
    if (highscoreEl) highscoreEl.textContent = state.flappyHighScore || 0;
    if (startBtn) {
      startBtn.innerHTML = '<i data-lucide="rocket"></i> Uzaya Fırla';
      startBtn.onclick = () => startFlappySpaceGame();
    }
  } else if (mode === 'slice') {
    if (title) title.textContent = "⚔️ Pomo-Slice Dilimleme";
    if (desc) desc.textContent = "Ekrandan yukarı fırlayan domatesleri parmağınızla keserek kombolar yapın!";
    if (tip) tip.textContent = "💡 İpucu: Parmağınızı/farenizi domateslerin üstünden hızla geçirin!";
    if (highscoreEl) highscoreEl.textContent = state.sliceHighScore || 0;
    if (startBtn) {
      startBtn.innerHTML = '<i data-lucide="zap"></i> Dilimlemeye Başla';
      startBtn.onclick = () => startPomoSliceGame();
    }
  }
}

// ----------------------------------------------------
// POMOFOCUS 4.0: 365 GÜNLÜK ODAKLANMA ISIT HİRİTASI (FOCUS HEATMAP)
// ----------------------------------------------------

function renderFocusHeatmap() {
  const container = document.getElementById('focus-heatmap-wrapper');
  if (!container) return;
  container.innerHTML = '';

  const heatmapGrid = document.createElement('div');
  heatmapGrid.className = 'heatmap-grid';

  const history = (state.stats && state.stats.history) ? state.stats.history : {};
  const today = new Date();
  
  // 364 gün geriden başla (52 hafta * 7 gün)
  const days = [];
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;
    const minutes = history[dateStr] || 0;
    days.push({ dateStr, minutes });
  }

  days.forEach(day => {
    const cell = document.createElement('div');
    let levelClass = 'level-0';
    if (day.minutes > 0 && day.minutes <= 25) levelClass = 'level-1';
    else if (day.minutes > 25 && day.minutes <= 60) levelClass = 'level-2';
    else if (day.minutes > 60 && day.minutes <= 120) levelClass = 'level-3';
    else if (day.minutes > 120) levelClass = 'level-4';

    cell.className = `heatmap-cell ${levelClass}`;
    cell.title = `${day.dateStr}: ${day.minutes} dk odaklanıldı`;
    heatmapGrid.appendChild(cell);
  });

  container.appendChild(heatmapGrid);
}

// ----------------------------------------------------
// POMOFOCUS 4.0: 3. MİNİ OYUN (POMO-SLICE DİLİMLEME)
// ----------------------------------------------------

let sliceGameRunning = false;
let sliceScore = 0;
let sliceAnimationId = null;
let sliceObjects = [];
let bladeTrail = [];

function startPomoSliceGame() {
  const overlay = document.getElementById('game-overlay');
  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  sliceGameRunning = true;
  sliceScore = 0;
  sliceObjects = [];
  bladeTrail = [];

  if (overlay) overlay.classList.add('hidden');
  updateSliceHud();

  const handlePointerMove = (x, y) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const px = (x - rect.left) * scaleX;
    const py = (y - rect.top) * scaleY;

    bladeTrail.push({ x: px, y: py, time: Date.now() });
    if (bladeTrail.length > 12) bladeTrail.shift();

    // Bıçak kesişim kontrolü
    for (let i = sliceObjects.length - 1; i >= 0; i--) {
      const obj = sliceObjects[i];
      if (!obj.sliced) {
        const dist = Math.hypot(obj.x - px, obj.y - py);
        if (dist < obj.radius + 15) {
          obj.sliced = true;
          if (obj.type === 'bomb') {
            if (state.inventory && state.inventory.shield > 0) {
              state.inventory.shield--;
              sendNotification("Kalkan Koruması! 🛡️", "Kalkan bombadan korudu!");
            } else {
              endPomoSliceGame();
              return;
            }
          } else {
            sliceScore += obj.type === 'star' ? 30 : 15;
            playClickSound();
            updateSliceHud();
          }
        }
      }
    }
  };

  canvas.onmousemove = (e) => { if (sliceGameRunning && state.activeGameMode === 'slice') handlePointerMove(e.clientX, e.clientY); };
  canvas.ontouchmove = (e) => { if (sliceGameRunning && state.activeGameMode === 'slice' && e.touches.length > 0) { handlePointerMove(e.touches[0].clientX, e.touches[0].clientY); } };

  let lastSpawn = Date.now();

  function sliceLoop() {
    if (!sliceGameRunning) return;

    if (Date.now() - lastSpawn > 900) {
      spawnSliceObject();
      lastSpawn = Date.now();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Nesneleri Çiz & Güncelle
    for (let i = sliceObjects.length - 1; i >= 0; i--) {
      const obj = sliceObjects[i];
      obj.vy += obj.gravity;
      obj.x += obj.vx;
      obj.y += obj.vy;

      ctx.font = `${obj.radius * 1.8}px serif`;
      ctx.textAlign = 'center';
      let emoji = '🍅';
      if (obj.type === 'star') emoji = '⭐';
      if (obj.type === 'bomb') emoji = '💣';

      if (obj.sliced) {
        ctx.fillText('💥', obj.x, obj.y);
      } else {
        ctx.fillText(emoji, obj.x, obj.y);
      }

      if (obj.y > canvas.height + 40) {
        sliceObjects.splice(i, 1);
      }
    }

    // Bıçak İzini Çiz
    if (bladeTrail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(bladeTrail[0].x, bladeTrail[0].y);
      for (let i = 1; i < bladeTrail.length; i++) {
        ctx.lineTo(bladeTrail[i].x, bladeTrail[i].y);
      }
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    sliceAnimationId = requestAnimationFrame(sliceLoop);
  }

  sliceLoop();
}

function spawnSliceObject() {
  const rand = Math.random();
  let type = 'tomato';
  if (rand > 0.8) type = 'star';
  else if (rand > 0.65) type = 'bomb';

  sliceObjects.push({
    x: 60 + Math.random() * 280,
    y: 420,
    vx: (Math.random() - 0.5) * 3,
    vy: -(10 + Math.random() * 4),
    gravity: 0.22,
    radius: 20,
    sliced: false,
    type: type
  });
}

function updateSliceHud() {
  const scoreEl = document.getElementById('game-score');
  const timerEl = document.getElementById('game-timer');
  const highscoreEl = document.getElementById('game-highscore');
  if (scoreEl) scoreEl.textContent = sliceScore;
  if (timerEl) timerEl.textContent = "⚔️ Kes!";
  if (highscoreEl) highscoreEl.textContent = state.sliceHighScore || 0;
}

function endPomoSliceGame() {
  sliceGameRunning = false;
  if (sliceAnimationId) cancelAnimationFrame(sliceAnimationId);

  const overlay = document.getElementById('game-overlay');
  const title = document.getElementById('overlay-title');
  const desc = document.getElementById('overlay-desc');
  const startBtn = document.getElementById('btn-start-game');

  if (sliceScore > (state.sliceHighScore || 0)) {
    state.sliceHighScore = sliceScore;
  }

  const earnedCoins = Math.floor(sliceScore / 2);
  const earnedXp = sliceScore;
  awardCoins(earnedCoins);
  awardXp(earnedXp);

  if (title) title.textContent = `Dilimleme Bitti! ⚔️ Skor: ${sliceScore}`;
  if (desc) desc.textContent = `Kazanılan: 🪙 +${earnedCoins} Coin, ⭐ +${earnedXp} XP. Rekor: ${state.sliceHighScore}`;
  if (startBtn) {
    startBtn.innerHTML = '<i data-lucide="rotate-ccw"></i> Yeniden Kes';
    startBtn.onclick = () => startPomoSliceGame();
  }

  if (overlay) overlay.classList.remove('hidden');
  saveData();
  lucide.createIcons();
}

// ----------------------------------------------------
// POMOFOCUS 5.0: ODAK BOSS SAVAŞI (BOSS BATTLES)
// ----------------------------------------------------

function damageBoss(amount) {
  if (!state.boss || state.boss.defeated) return;
  state.boss.hp = Math.max(0, state.boss.hp - amount);
  updateBossDisplay();

  if (state.boss.hp <= 0) {
    state.boss.defeated = true;
    const bossCard = document.getElementById('boss-battle-card');
    if (bossCard) bossCard.classList.add('defeated');
    awardXp(200);
    awardCoins(50);
    sendNotification('Boss Zaferi! ⚔️🎉', `${state.boss.name} yerle bir edildi! +200 XP, +50 Coins kazandınız!`);
    showPetSpeech(`Zafer! ${state.boss.name} yenildi! 🏆`);
    
    setTimeout(() => {
      const nextBosses = [
        { name: 'Tembellik İblisi', avatar: '👹' },
        { name: 'Sosyal Medya Ahtapotu', avatar: '🐙' },
        { name: 'Erteleme Canavarı', avatar: '👾' },
        { name: 'Kaos Ejderhası', avatar: '🐉' }
      ];
      const b = nextBosses[Math.floor(Math.random() * nextBosses.length)];
      state.boss = {
        hp: 100 + (state.boss.level || 1) * 20,
        maxHp: 100 + (state.boss.level || 1) * 20,
        level: (state.boss.level || 1) + 1,
        name: `${b.name} (Lvl ${(state.boss.level || 1) + 1} Boss)`,
        avatar: b.avatar,
        defeated: false
      };
      if (bossCard) bossCard.classList.remove('defeated');
      updateBossDisplay();
      saveData();
    }, 4000);
  }
}

function updateBossDisplay() {
  const avatar = document.getElementById('boss-avatar');
  const name = document.getElementById('boss-name');
  const hpText = document.getElementById('boss-hp-text');
  const hpFill = document.getElementById('boss-hp-fill');

  if (state.boss) {
    if (avatar) avatar.textContent = state.boss.avatar || '🐉';
    if (name) name.textContent = state.boss.name || 'Erteleme Ejderhası';
    if (hpText) hpText.textContent = `${state.boss.hp} / ${state.boss.maxHp} HP`;
    if (hpFill) hpFill.style.width = `${(state.boss.hp / state.boss.maxHp) * 100}%`;
  }
}

// ----------------------------------------------------
// POMOFOCUS 5.0: GÜNLÜK ŞANS ÇARKI (WHEEL OF FORTUNE)
// ----------------------------------------------------

const WHEEL_REWARDS = [
  { label: '🪙 +50 Coins', type: 'coins', val: 50, color: '#f39c12' },
  { label: '⭐ +100 XP', type: 'xp', val: 100, color: '#8e44ad' },
  { label: '🍎 Pet Yemi', type: 'feed', val: 1, color: '#e74c3c' },
  { label: '⚡ 2x XP', type: 'doublexp', val: 1, color: '#3498db' },
  { label: '🪙 +100 Coins', type: 'coins', val: 100, color: '#f1c40f' },
  { label: '🎁 Sürpriz', type: 'xp', val: 150, color: '#1abc9c' },
  { label: '⭐ +50 XP', type: 'xp', val: 50, color: '#9b59b6' },
  { label: '🪙 +25 Coins', type: 'coins', val: 25, color: '#e67e22' }
];

let wheelAngle = 0;
let isSpinningWheel = false;

function drawWheelCanvas() {
  const canvas = document.getElementById('wheel-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = canvas.width / 2 - 10;
  const numSlices = WHEEL_REWARDS.length;
  const sliceAngle = (Math.PI * 2) / numSlices;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < numSlices; i++) {
    const startA = wheelAngle + i * sliceAngle;
    const endA = startA + sliceAngle;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, startA, endA);
    ctx.fillStyle = WHEEL_REWARDS[i].color;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(startA + sliceAngle / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Outfit, sans-serif';
    ctx.fillText(WHEEL_REWARDS[i].label, radius - 15, 4);
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(cx, cy, 22, 0, Math.PI * 2);
  ctx.fillStyle = '#1e1b4b';
  ctx.fill();
  ctx.strokeStyle = '#f1c40f';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.font = 'bold 16px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('🎰', cx, cy + 5);
}

function spinWheel() {
  if (isSpinningWheel) return;
  const todayStr = getTodayDateString();
  if (state.lastWheelSpinDate === todayStr) {
    sendNotification('Bugün Hakkınız Doldu! 🎰', 'Şans çarkını yarın tekrar çevirebilirsiniz!');
    showPetSpeech('Yarın tekrar çevirelim! 🎲');
    return;
  }

  initAudio();
  isSpinningWheel = true;
  state.lastWheelSpinDate = todayStr;

  const targetSlice = Math.floor(Math.random() * WHEEL_REWARDS.length);
  const sliceAngle = (Math.PI * 2) / WHEEL_REWARDS.length;
  const targetAngle = (3 * Math.PI / 2) - (targetSlice * sliceAngle) - (sliceAngle / 2) + (Math.PI * 12);

  const startA = wheelAngle;
  const totalChange = targetAngle - startA;
  const duration = 3800;
  const startTime = Date.now();

  const spinAnimation = () => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(1, elapsed / duration);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    wheelAngle = startA + totalChange * easeProgress;
    drawWheelCanvas();

    if (progress < 1) {
      requestAnimationFrame(spinAnimation);
    } else {
      isSpinningWheel = false;
      const win = WHEEL_REWARDS[targetSlice];
      playSuccessChime();

      if (win.type === 'coins') awardCoins(win.val);
      else if (win.type === 'xp') awardXp(win.val);
      else if (win.type === 'feed') feedPet();
      else if (win.type === 'doublexp') buyShopItem('doublexp', 0);

      sendNotification('Tebrikler! Ödül Kazandınız 🎰', `${win.label} kazandınız!`);
      showPetSpeech(`Harika! ${win.label} kazandık! 🎉`);
      
      updateWheelStatusText();
      saveData();
    }
  };

  spinAnimation();
}

function updateWheelStatusText() {
  const statusEl = document.getElementById('wheel-status-text');
  const spinBtn = document.getElementById('btn-spin-wheel');
  const todayStr = getTodayDateString();

  if (state.lastWheelSpinDate === todayStr) {
    if (statusEl) statusEl.textContent = 'Bugünkü çevirme hakkınız kullanıldı! Yarın tekrar bekleriz 🎁';
    if (spinBtn) {
      spinBtn.classList.add('disabled');
      spinBtn.textContent = '🔒 Yarın Tekrar Gelin';
    }
  } else {
    if (statusEl) statusEl.textContent = 'Her gün 1 ücretsiz çevirme hakkı! 🎁';
    if (spinBtn) {
      spinBtn.classList.remove('disabled');
      spinBtn.textContent = '🎲 Çarkı Çevir!';
    }
  }
}

// ----------------------------------------------------
// POMOFOCUS 5.0: AKILLI GÖREV AYRIŞTIRICI (AUTO-SPLITTER)
// ----------------------------------------------------

function splitTaskIntelligently() {
  const inputEl = document.getElementById('task-input');
  if (!inputEl) return;
  const rawText = inputEl.value.trim();
  if (!rawText) {
    showPetSpeech("Ayrıştırmak için bir görev yazın! 📝");
    return;
  }

  initAudio();
  playClickSound();

  const catVal = (taskCategoryInput && taskCategoryInput.value) ? taskCategoryInput.value : 'work';

  const task1 = {
    id: Date.now().toString(),
    title: `[1/3] ${rawText} - Hazırlık & Konsept`,
    completed: false,
    pomodoros: 0,
    targetPomodoros: 1,
    category: catVal,
    priority: 'medium'
  };

  const task2 = {
    id: (Date.now() + 1).toString(),
    title: `[2/3] ${rawText} - Ana Odak & Uygulama`,
    completed: false,
    pomodoros: 0,
    targetPomodoros: 2,
    category: catVal,
    priority: 'high'
  };

  const task3 = {
    id: (Date.now() + 2).toString(),
    title: `[3/3] ${rawText} - Kontrol & Tamamlama`,
    completed: false,
    pomodoros: 0,
    targetPomodoros: 1,
    category: catVal,
    priority: 'low'
  };

  state.tasks.push(task1, task2, task3);
  inputEl.value = '';

  if (!state.activeTaskId) {
    state.activeTaskId = task1.id;
    activeTaskTitle.textContent = task1.title;
  }

  showPetSpeech("Görevi 3 seansa ayrıştırdım! 🪄");
  sendNotification("Görev Ayrıştırıldı 🪄", `"${rawText}" görevi 3 alt Pomodoro seansına bölündü.`);
  saveData();
  renderTasks();
}

// ----------------------------------------------------
// POMOFOCUS 6.0: AUTHENTICATION & USER PROFILE MODULE
// ----------------------------------------------------

function checkAuthSession() {
  const authScreen = document.getElementById('auth-screen');
  if (authScreen) {
    authScreen.classList.add('hidden');
  }
}

function handleLogout() {
  initAudio();
  playClickSound();
  
  const modalProfile = document.getElementById('modal-profile');
  if (modalProfile) modalProfile.classList.add('hidden');
  document.body.classList.remove('modal-open');
  
  sendNotification("Profil Kapatıldı 🚪", "Profil ekranı kapatıldı.");
}

function renderProfileModal() {
  const avatarEl = document.getElementById('profile-avatar-display');
  const nameEl = document.getElementById('profile-display-name');
  const emailEl = document.getElementById('profile-display-email');
  const levelEl = document.getElementById('profile-display-level');
  const titleEl = document.getElementById('profile-display-title');
  const nameInput = document.getElementById('edit-profile-name');
  const bioInput = document.getElementById('edit-profile-bio');

  const focusVal = document.getElementById('pstat-total-focus');
  const pomosVal = document.getElementById('pstat-pomos');
  const coinsVal = document.getElementById('pstat-coins');

  if (avatarEl) {
    if (state.user.avatar && (state.user.avatar.startsWith('http') || state.user.avatar.startsWith('data:'))) {
      avatarEl.innerHTML = `<img src="${state.user.avatar}" class="profile-avatar-img" alt="Google Profile" />`;
    } else {
      avatarEl.textContent = state.user.avatar || '👤';
    }
  }
  if (nameEl) nameEl.textContent = state.user.name || 'Kullanıcı';
  if (emailEl) emailEl.textContent = state.user.email || 'email@example.com';
  if (levelEl) levelEl.textContent = `Lvl ${state.level || 1}`;
  if (titleEl) titleEl.textContent = getPlayerTitle(state.level || 1);

  if (nameInput) nameInput.value = state.user.name || '';
  if (bioInput) bioInput.value = state.user.bio || '';

  if (focusVal) focusVal.textContent = `${state.stats ? state.stats.totalFocusMinutes : 0} dk`;
  if (pomosVal) pomosVal.textContent = `${state.stats ? state.stats.completedPomodoros : 0}`;
  if (coinsVal) coinsVal.textContent = `${state.pomoCoins || 0}`;
}

function saveProfileChanges(name, bio) {
  initAudio();
  playClickSound();
  
  state.user.name = name;
  state.user.bio = bio;
  saveData();
  renderProfileModal();
  sendNotification("Profil Güncellendi ✨", "Değişiklikler başarıyla kaydedildi.");
}

// ----------------------------------------------------
// POMOFOCUS: TÜM MENÜ & ÖZELLİKLER HUB'I VE ALT NAVİGASYON
// ----------------------------------------------------

function renderMenuHub() {
  const nameEl = document.getElementById('menu-user-name');
  const levelEl = document.getElementById('menu-user-level');
  const titleEl = document.getElementById('menu-user-title');
  const avatarEl = document.getElementById('menu-avatar-display');

  if (nameEl) nameEl.textContent = (state.user && state.user.name) ? state.user.name : 'Odaklanma Avcısı';
  if (levelEl) levelEl.textContent = `Lvl ${state.level || 1}`;
  if (titleEl) titleEl.textContent = getPlayerTitle(state.level || 1);
  if (avatarEl) {
    if (state.user && state.user.avatar && (state.user.avatar.startsWith('http') || state.user.avatar.startsWith('data:'))) {
      avatarEl.innerHTML = `<img src="${state.user.avatar}" class="profile-avatar-img" alt="Avatar" />`;
    } else {
      avatarEl.textContent = (state.user && state.user.avatar) ? state.user.avatar : '👤';
    }
  }
}

function openAppMenuHub() {
  renderMenuHub();
  const modalAppMenu = document.getElementById('modal-app-menu');
  if (modalAppMenu) {
    modalAppMenu.classList.remove('hidden');
    document.body.classList.add('modal-open');
    setActiveBottomNav('menu');
    playClickSound();
  }
}

function closeAppMenuHub() {
  const modalAppMenu = document.getElementById('modal-app-menu');
  if (modalAppMenu) {
    modalAppMenu.classList.add('hidden');
    document.body.classList.remove('modal-open');
    playClickSound();
  }
  const currentActive = document.querySelector('.bottom-nav-bar .nav-item.active');
  if (!currentActive || currentActive.getAttribute('data-nav') === 'menu') {
    setActiveBottomNav('timer');
  }
}

function setActiveBottomNav(navName) {
  document.querySelectorAll('.bottom-nav-bar .nav-item').forEach(btn => {
    if (btn.getAttribute('data-nav') === navName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function init() {
  loadData();
  updateTimerDisplay();
  renderTasks();
  syncSettingsInputs();
  
  // Geri Tuşu Dinleyicisini Kur
  setupBackButtonListener();
  
  // Canvas Parçacıklarını Başlat
  resizeCanvas();
  animateParticles();
  
  // Radyo Kurulumu yap
  setupRadio();
  
  // Temayı yükle
  applyTheme(state.theme);
  
  // XP ve Coin Gösterimini başlat
  updateXpDisplay();
  updateCoinDisplay();
  updatePlayerTitleDisplay();
  updateHappinessDisplay();

  // PomoFocus Kurulumları
  renderDailyQuests();
  setPetRoomTheme(state.petRoomTheme || 'cosmic');
  initCatchTomatoGame();

  // Mini Oyun Modalı & Sekmeler
  const btnMinigame = document.getElementById('btn-minigame');
  const modalMinigame = document.getElementById('modal-minigame');
  const closeMinigame = document.getElementById('close-minigame');

  if (btnMinigame && modalMinigame) {
    btnMinigame.addEventListener('click', () => {
      modalMinigame.classList.remove('hidden');
      document.body.classList.add('modal-open');
      switchGameMode(state.activeGameMode || 'catch');
      playClickSound();
    });
  }
  if (closeMinigame && modalMinigame) {
    closeMinigame.addEventListener('click', () => {
      modalMinigame.classList.add('hidden');
      document.body.classList.remove('modal-open');
      miniGameRunning = false;
      flappyGameRunning = false;
      sliceGameRunning = false;
      if (miniGameInterval) clearInterval(miniGameInterval);
      if (flappyAnimationId) cancelAnimationFrame(flappyAnimationId);
      if (sliceAnimationId) cancelAnimationFrame(sliceAnimationId);
      playClickSound();
    });
  }

  // PomoFocus 5.0 İlk Yükleme
  updateBossDisplay();
  
  // Şans Çarkı Modalı
  const btnWheel = document.getElementById('btn-wheel');
  const modalWheel = document.getElementById('modal-wheel');
  const closeWheel = document.getElementById('close-wheel');
  const btnSpinWheel = document.getElementById('btn-spin-wheel');

  if (btnWheel && modalWheel) {
    btnWheel.onclick = () => {
      drawWheelCanvas();
      updateWheelStatusText();
      modalWheel.classList.remove('hidden');
      document.body.classList.add('modal-open');
      playClickSound();
    };
  }
  if (closeWheel && modalWheel) {
    closeWheel.onclick = () => {
      modalWheel.classList.add('hidden');
      document.body.classList.remove('modal-open');
      playClickSound();
    };
  }
  if (btnSpinWheel) {
    btnSpinWheel.onclick = spinWheel;
  }

  // Akıllı Görev Ayrıştırıcı Butonu
  const btnAiSplit = document.getElementById('btn-ai-split');
  if (btnAiSplit) {
    btnAiSplit.onclick = splitTaskIntelligently;
  }

  // Wellness Modalı
  const btnWellness = document.getElementById('btn-wellness');
  const modalWellness = document.getElementById('modal-wellness');
  const closeWellness = document.getElementById('close-wellness');
  if (btnWellness && modalWellness) {
    btnWellness.onclick = () => {
      modalWellness.classList.remove('hidden');
      document.body.classList.add('modal-open');
      playClickSound();
    };
  }
  if (closeWellness && modalWellness) {
    closeWellness.onclick = () => {
      modalWellness.classList.add('hidden');
      document.body.classList.remove('modal-open');
      playClickSound();
    };
  }

  // 20 Saniyelik Göz Dinlendirme Butonu
  const btnStartEyeRest = document.getElementById('btn-start-eye-rest');
  const eyeCircle = document.getElementById('eye-timer-circle');
  if (btnStartEyeRest && eyeCircle) {
    btnStartEyeRest.onclick = () => {
      let count = 20;
      eyeCircle.textContent = count;
      playClickSound();
      const eyeInterval = setInterval(() => {
        count--;
        eyeCircle.textContent = count;
        if (count <= 0) {
          clearInterval(eyeInterval);
          eyeCircle.textContent = "✓";
          playSuccessChime();
          sendNotification("Gözleriniz Dinlendi! 👁️", "20 saniyelik odak dinlenmesi tamamlandı.");
        }
      }, 1000);
    };
  }

  // Oyun Sekmeleri
  const tabCatch = document.getElementById('tab-catch-tomato');
  const tabFlappy = document.getElementById('tab-flappy-space');
  const tabSlice = document.getElementById('tab-pomo-slice');
  if (tabCatch) tabCatch.onclick = () => switchGameMode('catch');
  if (tabFlappy) tabFlappy.onclick = () => switchGameMode('flappy');
  if (tabSlice) tabSlice.onclick = () => switchGameMode('slice');

  // Mağaza Modalı
  const btnShop = document.getElementById('btn-shop');
  const modalShop = document.getElementById('modal-shop');
  const closeShop = document.getElementById('close-shop');
  if (btnShop && modalShop) {
    btnShop.onclick = () => {
      renderShop();
      modalShop.classList.remove('hidden');
      document.body.classList.add('modal-open');
      playClickSound();
    };
  }
  if (closeShop && modalShop) {
    closeShop.onclick = () => {
      modalShop.classList.add('hidden');
      document.body.classList.remove('modal-open');
      playClickSound();
    };
  }

  // Mağaza Satın Alma Butonları
  document.querySelectorAll('.buy-item-btn').forEach(btn => {
    btn.onclick = () => {
      const item = btn.getAttribute('data-item');
      const cost = parseInt(btn.getAttribute('data-cost'));
      buyShopItem(item, cost);
    };
  });

  // Pet Besleme Butonu
  const btnFeedPet = document.getElementById('btn-feed-pet');
  if (btnFeedPet) {
    btnFeedPet.onclick = feedPet;
  }

  // Sandık Alma Butonu
  const claimChestBtn = document.getElementById('btn-claim-chest');
  if (claimChestBtn) {
    claimChestBtn.addEventListener('click', claimMysteryChest);
  }

  // Oda Tema Butonları
  document.querySelectorAll('.room-theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      setPetRoomTheme(theme);
      playClickSound();
    });
  });
  
  // window resize olayını bağla
  window.addEventListener('resize', resizeCanvas);
  
  // Header Tüm Menü Butonu & Modal Kapatma
  const btnAppMenu = document.getElementById('btn-app-menu');
  const closeAppMenu = document.getElementById('close-app-menu');
  if (btnAppMenu) btnAppMenu.addEventListener('click', openAppMenuHub);
  if (closeAppMenu) closeAppMenu.addEventListener('click', closeAppMenuHub);

  // Profile Modal Kurulumu
  const btnProfile = document.getElementById('btn-profile');
  const modalProfile = document.getElementById('modal-profile');
  const closeProfile = document.getElementById('close-profile');

  if (btnProfile && modalProfile) {
    btnProfile.addEventListener('click', () => {
      renderProfileModal();
      modalProfile.classList.remove('hidden');
      document.body.classList.add('modal-open');
      playClickSound();
    });
  }

  if (closeProfile && modalProfile) {
    closeProfile.addEventListener('click', () => {
      modalProfile.classList.add('hidden');
      document.body.classList.remove('modal-open');
      playClickSound();
    });
  }

  const formEditProfile = document.getElementById('form-edit-profile');
  if (formEditProfile) {
    formEditProfile.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('edit-profile-name').value;
      const bio = document.getElementById('edit-profile-bio').value;
      saveProfileChanges(name, bio);
    });
  }

  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', handleLogout);
  }

  // Alt Navigasyon Çubuğu (Bottom Navigation Bar) Tetikleyicileri
  const navBtnTimer = document.getElementById('nav-btn-timer');
  const navBtnTasks = document.getElementById('nav-btn-tasks');
  const navBtnPet = document.getElementById('nav-btn-pet');
  const navBtnStats = document.getElementById('nav-btn-stats');
  const navBtnMenu = document.getElementById('nav-btn-menu');

  if (navBtnTimer) {
    navBtnTimer.addEventListener('click', () => {
      setActiveBottomNav('timer');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      playClickSound();
    });
  }

  if (navBtnTasks) {
    navBtnTasks.addEventListener('click', () => {
      setActiveBottomNav('tasks');
      if (tasksSection) {
        tasksSection.classList.toggle('open');
        document.body.classList.toggle('modal-open', tasksSection.classList.contains('open'));
      }
      playClickSound();
    });
  }

  if (navBtnPet) {
    navBtnPet.addEventListener('click', () => {
      setActiveBottomNav('pet');
      if (modalPet) {
        modalPet.classList.remove('hidden');
        document.body.classList.add('modal-open');
      }
      playClickSound();
    });
  }

  if (navBtnStats) {
    navBtnStats.addEventListener('click', () => {
      setActiveBottomNav('stats');
      if (modalStats) {
        renderStats();
        modalStats.classList.remove('hidden');
        document.body.classList.add('modal-open');
      }
      playClickSound();
    });
  }

  if (navBtnMenu) {
    navBtnMenu.addEventListener('click', () => {
      setActiveBottomNav('menu');
      openAppMenuHub();
    });
  }

  // Menü Hub Özellik Kartları Bağlantıları
  const mitemPet = document.getElementById('mitem-pet');
  const mitemShop = document.getElementById('mitem-shop');
  const mitemMinigame = document.getElementById('mitem-minigame');
  const mitemWheel = document.getElementById('mitem-wheel');
  const mitemWellness = document.getElementById('mitem-wellness');
  const mitemStats = document.getElementById('mitem-stats');
  const mitemProfile = document.getElementById('mitem-profile');
  const mitemZen = document.getElementById('mitem-zen');
  const mitemSettings = document.getElementById('mitem-settings');

  if (mitemPet) {
    mitemPet.addEventListener('click', () => {
      setActiveBottomNav('pet');
      closeAppMenuHub();
      if (modalPet) {
        modalPet.classList.remove('hidden');
        document.body.classList.add('modal-open');
      }
    });
  }

  if (mitemShop) {
    mitemShop.addEventListener('click', () => {
      closeAppMenuHub();
      if (modalShop) {
        renderShop();
        modalShop.classList.remove('hidden');
        document.body.classList.add('modal-open');
      }
    });
  }

  if (mitemMinigame) {
    mitemMinigame.addEventListener('click', () => {
      closeAppMenuHub();
      if (modalMinigame) {
        modalMinigame.classList.remove('hidden');
        document.body.classList.add('modal-open');
        switchGameMode(state.activeGameMode || 'catch');
      }
    });
  }

  if (mitemWheel) {
    mitemWheel.addEventListener('click', () => {
      closeAppMenuHub();
      if (modalWheel) {
        drawWheelCanvas();
        updateWheelStatusText();
        modalWheel.classList.remove('hidden');
        document.body.classList.add('modal-open');
      }
    });
  }

  if (mitemWellness) {
    mitemWellness.addEventListener('click', () => {
      closeAppMenuHub();
      if (modalWellness) {
        modalWellness.classList.remove('hidden');
        document.body.classList.add('modal-open');
      }
    });
  }

  if (mitemStats) {
    mitemStats.addEventListener('click', () => {
      setActiveBottomNav('stats');
      closeAppMenuHub();
      if (modalStats) {
        renderStats();
        modalStats.classList.remove('hidden');
        document.body.classList.add('modal-open');
      }
    });
  }

  if (mitemProfile) {
    mitemProfile.addEventListener('click', () => {
      closeAppMenuHub();
      if (modalProfile) {
        renderProfileModal();
        modalProfile.classList.remove('hidden');
        document.body.classList.add('modal-open');
      }
    });
  }

  if (mitemZen) {
    mitemZen.addEventListener('click', () => {
      closeAppMenuHub();
      toggleZenMode(true);
    });
  }

  if (mitemSettings) {
    mitemSettings.addEventListener('click', () => {
      closeAppMenuHub();
      if (modalSettings) {
        modalSettings.classList.remove('hidden');
        document.body.classList.add('modal-open');
      }
    });
  }

  // Aktif görev başlığını yerleştir
  if (state.activeTaskId) {
    const task = state.tasks.find(t => t.id === state.activeTaskId);
    activeTaskTitle.textContent = task ? task.title : "Bir görev seçin veya ekleyin";
  } else {
    activeTaskTitle.textContent = "Bir görev seçin veya ekleyin";
  }
  
  // Lucide ikonlarını oluştur
  lucide.createIcons();
}

// Sayfa yüklendiğinde başlat
init();
