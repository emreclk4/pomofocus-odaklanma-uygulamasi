# 🍅 PomoFocus - Akıllı Pomodoro & Odaklanma Uygulaması (Web & Android APK)

**PomoFocus**, üretkenliği artırmak, zamanı verimli yönetmek ve odaklanma alışkanlığı kazanmak için tasarlanmış modern, hızlı ve zengin özellikli bir **Pomodoro & Görev Yönetimi** uygulamasıdır. Hem **Web (Vite)** hem de **Android (Capacitor APK)** platformlarında çalışır.

## ✨ Öne Çıkan Özellikler

- ⏱️ **Gelişmiş Pomodoro Sayacı:** Özelleştirilebilir Pomodoro, Kısa Mola ve Uzun Mola süreleri, dairesel ilerleme halkası ve otomatik geçiş desteği.
- 📋 **Görev & Proje Yönetimi:** Görev ekleme, öncelik/kategori belirleme, hedef pomodoro sayısı atama ve tamamlanan görevleri takip etme.
- 🎧 **Odak Sesleri (Ambient Sounds):** Yağmur, Orman, Kafe, Şömine, Gece ve Beyaz Gürültü gibi arka plan odaklanma sesleri.
- 🧘 **Zen Modu & Nefes Egzersizi:** Dikkat dağıtıcı unsurları gizleyen tam ekran odak modu ve rehberli nefes egzersizleri.
- 📊 **Detaylı İstatistikler & Analiz:** Günlük, haftalık odaklanma süreleri, ısı haritası (heatmap) ve verimlilik grafikleri.
- 🏆 **Oyunlaştırma (Gamification):** XP kazanımı, seviye sistemi, günlük seri (streak) takibi ve başarım rozetleri.
- 🎨 **Modern & Akıcı Arayüz:** GPU hızlandırmalı kart animasyonları, karanlık/aydınlık tema seçenekleri ve mobil uyumlu alt navigasyon menüsü.
- 📱 **Android APK Desteği:** Capacitor ile derlenmiş yerel bildirim destekli Android uygulaması (`PomoFocus.apk`).

## 🚀 Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için:

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirici sunucusunu başlatın (http://localhost:3000)
npm run dev

# Üretim (Production) derlemesi alın
npm run build
```

## 🛠️ Kullanılan Teknolojiler

- **Frontend:** HTML5, Modern CSS3 (Custom Properties, Glassmorphism, GPU Animations), Vanilla JavaScript (ES6+)
- **Build Aracı:** Vite
- **Mobil Platform:** Capacitor (`@capacitor/core`, `@capacitor/app`, `@capacitor/local-notifications`)
