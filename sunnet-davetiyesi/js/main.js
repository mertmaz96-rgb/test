(function () {
  'use strict';

  /* ---------- Düzenlenecek bilgiler ---------- */
  var CONFIG = {
    childName: 'Aybek & Alper Özkan',
    eventDate: '2026-11-21T19:00:00+03:00',
    lat: 40.98,   // Avcılar
    lon: 28.72,
    whatsapp: '905551112233' // ülke kodu ile, + olmadan
  };

  var frame = document.getElementById('frame');
  var curtainL = document.getElementById('curtainL');
  var curtainR = document.getElementById('curtainR');
  var bgAudio = document.getElementById('bgAudio');
  var musicBtn = document.getElementById('musicBtn');

  /* ---------- Geri sayım ---------- */
  var cd = {
    d: document.getElementById('cd-d'), h: document.getElementById('cd-h'),
    m: document.getElementById('cd-m'), s: document.getElementById('cd-s')
  };
  var target = new Date(CONFIG.eventDate).getTime();
  function pad(n) { return String(n).padStart(2, '0'); }
  function tickCountdown() {
    var diff = Math.max(0, target - Date.now());
    cd.d.textContent = pad(Math.floor(diff / 86400000));
    cd.h.textContent = pad(Math.floor((diff % 86400000) / 3600000));
    cd.m.textContent = pad(Math.floor((diff % 3600000) / 60000));
    cd.s.textContent = pad(Math.floor((diff % 60000) / 1000));
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);

  /* ---------- Bölüm görünürlük animasyonu ---------- */
  var revealSections = document.querySelectorAll('.reveal-section');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { root: frame, threshold: 0.12 });
    revealSections.forEach(function (el) { io.observe(el); });
  } else {
    revealSections.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Perde efekti (scroll) ---------- */
  function handleFrameScroll() {
    var scrollable = frame.scrollHeight - frame.clientHeight;
    var p = scrollable > 0 ? frame.scrollTop / scrollable : 0;
    var y = p * 10 + Math.sin(p * Math.PI * 2) * 3;
    var r = Math.sin(p * Math.PI) * 1.2;
    [curtainL, curtainR].forEach(function (el) {
      el.style.animation = 'none';
      el.style.transform = 'translateY(' + y + 'px) rotate(' + r + 'deg)';
    });
  }
  frame.addEventListener('scroll', handleFrameScroll, { passive: true });

  /* ---------- Müzik (assets/audio/muzik.mp3 varsa) ---------- */
  var musicPlaying = false;
  function setMusicState(on) {
    musicPlaying = on;
    musicBtn.classList.toggle('is-playing', on);
  }
  bgAudio.addEventListener('loadedmetadata', function () { musicBtn.hidden = false; });
  bgAudio.load();

  function startMusic() {
    var p = bgAudio.play();
    if (p && p.then) {
      p.then(function () { setMusicState(true); }).catch(function () { setMusicState(false); });
    } else {
      setMusicState(true);
    }
  }
  musicBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    if (musicPlaying) { bgAudio.pause(); setMusicState(false); } else { startMusic(); }
  });

  // İlk dokunuşta müziği başlat (tarayıcılar otomatik çalmaya izin vermez)
  var gestureDone = false;
  function firstGesture() {
    if (gestureDone) return;
    gestureDone = true;
    if (!musicBtn.hidden) startMusic();
  }
  window.addEventListener('click', firstGesture, { once: true, passive: true });
  window.addEventListener('touchend', firstGesture, { once: true, passive: true });

  /* ---------- Hava durumu (Open-Meteo, düğün günü tahmini) ---------- */
  var weatherTemp = document.getElementById('weatherTemp');
  var weatherCondition = document.getElementById('weatherCondition');
  var weatherNote = document.getElementById('weatherNote');
  var weatherIcon = document.getElementById('weatherIcon');

  var ICONS = {
    rain: '<svg viewBox="0 0 100 80"><ellipse cx="50" cy="25" rx="22" ry="15" fill="#5a8fb8"/><ellipse cx="30" cy="28" rx="16" ry="12" fill="#5a8fb8" opacity="0.8"/><circle cx="20" cy="50" r="3" fill="#5a8fb8"/><circle cx="35" cy="58" r="3" fill="#5a8fb8"/><circle cx="50" cy="55" r="3" fill="#5a8fb8"/><circle cx="65" cy="60" r="3" fill="#5a8fb8"/><circle cx="80" cy="52" r="3" fill="#5a8fb8"/></svg>',
    cloud: '<svg viewBox="0 0 100 80"><ellipse cx="55" cy="32" rx="28" ry="18" fill="#a8c5e0"/><ellipse cx="28" cy="38" rx="20" ry="14" fill="#7fa8d1" opacity="0.9"/></svg>',
    sun: '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="25" fill="#e0b25a"/><g stroke="#e0b25a" stroke-width="3" stroke-linecap="round"><path d="M50 12V2M50 98V88M88 50h10M12 50H2M75 25l7-7M25 75l-7 7M25 25l-7-7M75 75l7 7"/></g></svg>'
  };
  weatherIcon.innerHTML = ICONS.cloud;

  // WMO hava kodu -> [Türkçe açıklama, ikon]
  function describe(code) {
    if (code === 0) return ['Açık', 'sun'];
    if (code <= 2) return ['Parçalı Bulutlu', 'cloud'];
    if (code === 3) return ['Kapalı', 'cloud'];
    if (code === 45 || code === 48) return ['Sisli', 'cloud'];
    if (code >= 51 && code <= 57) return ['Çiseleyen Yağmur', 'rain'];
    if (code >= 61 && code <= 67) return ['Yağmurlu', 'rain'];
    if (code >= 71 && code <= 77) return ['Karlı', 'rain'];
    if (code >= 80 && code <= 82) return ['Sağanak Yağmur', 'rain'];
    if (code >= 85 && code <= 86) return ['Kar Sağanağı', 'rain'];
    if (code >= 95) return ['Gök Gürültülü Fırtına', 'rain'];
    return ['Bulutlu', 'cloud'];
  }

  // Open-Meteo yalnızca ~16 gün sonrasına kadar tahmin verir; öncesinde mevsim normali gösterilir.
  var eventDay = CONFIG.eventDate.slice(0, 10);
  var daysLeft = (new Date(eventDay + 'T12:00:00+03:00') - Date.now()) / 86400000;
  if (daysLeft <= 15 && daysLeft > -1) {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=' + CONFIG.lat + '&longitude=' + CONFIG.lon +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=Europe%2FIstanbul&start_date=' + eventDay + '&end_date=' + eventDay)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var d = data && data.daily;
        if (!d || !d.time || !d.time.length) return;
        var info = describe(d.weather_code[0]);
        var lo = Math.round(d.temperature_2m_min[0]);
        var hi = Math.round(d.temperature_2m_max[0]);
        var rain = d.precipitation_probability_max && d.precipitation_probability_max[0];
        weatherTemp.textContent = lo + '–' + hi;
        weatherCondition.textContent = info[0];
        weatherNote.textContent = 'Düğün günü tahmini' + (rain != null ? ' · Yağış ihtimali %' + rain : '');
        weatherIcon.innerHTML = ICONS[info[1]];
      })
      .catch(function () { /* mevsim normali kalır */ });
  }

  /* ---------- Katılım formu (WhatsApp) ---------- */
  document.getElementById('rsvpForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var text = CONFIG.childName + ' sünnet düğünü katılım bildirimi:\n' +
      'Ad: ' + document.getElementById('rsvpName').value + '\n' +
      'Kişi sayısı: ' + document.getElementById('rsvpCount').value + '\n' +
      'Durum: ' + document.getElementById('rsvpStatus').value;
    window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
  });

  /* ---------- Şarkı isteği formu (Formspree) ---------- */
  var songForm = document.getElementById('songForm');
  var songThanks = document.getElementById('songThanks');
  songForm.addEventListener('submit', function (e) {
    e.preventDefault();
    fetch(songForm.action, {
      method: 'POST',
      body: new FormData(songForm),
      headers: { Accept: 'application/json' }
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      songForm.reset();
      songForm.hidden = true;
      songThanks.hidden = false;
      setTimeout(function () { songThanks.hidden = true; songForm.hidden = false; }, 3000);
    }).catch(function () {
      alert('İstek gönderilemedi, lütfen tekrar deneyin.');
    });
  });

  /* ---------- IBAN kopyalama ---------- */
  var copyBtn = document.getElementById('copyIbanBtn');
  copyBtn.addEventListener('click', function () {
    var text = document.getElementById('ibanText').textContent.trim();
    var done = function () {
      copyBtn.textContent = 'Kopyalandı';
      copyBtn.classList.add('is-copied');
      setTimeout(function () { copyBtn.textContent = 'Kopyala'; copyBtn.classList.remove('is-copied'); }, 1800);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done);
    } else {
      var ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta); done();
    }
  });
})();
