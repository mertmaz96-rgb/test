# Sünnet Düğünü Davetiyesi

Statik HTML/CSS/JS, mobil uyumlu tek sayfalık davetiye. Build adımı yok.

## Yapı

```
index.html     Tüm metinler (isim, adres, aile, program)
css/style.css  Stiller
js/main.js     Geri sayım, perde efekti, müzik, hava durumu, formlar, IBAN kopyalama
assets/images/ story1-3.jpg, gallery1-3.jpg, hero-poster.jpg (isteğe bağlı)
assets/video/  anasayfa.mp4 (isteğe bağlı, açılış arka planı)
assets/audio/  muzik.mp3 (isteğe bağlı; varsa müzik butonu görünür)
```

## Yapılacaklar

1. `js/main.js` başındaki `CONFIG`: çocuğun adı, tarih/saat, şehir, WhatsApp numarası.
2. `index.html`: isim, aile, program saatleri, mekanlar, harita adresleri (Google Haritalar bağlantılarındaki `q=` / `query=`), IBAN.
3. Galeri: düğünden sonra `index.html` içindeki `gallery-empty` bloğunu silip yorumdaki galeri kodunu ekleyin; fotoğrafları `assets/images/gallery1-3.jpg` olarak koyun.
4. Şarkı isteği: formspree.io'da form açıp `YOUR_FORM_ID` değerini değiştirin.

## Yayınlama

Klasörün içeriğini herhangi bir statik hosting'e (Netlify, Vercel, GitHub Pages, cPanel) yükleyin.

## Notlar

- Masaüstünde sayfa telefon genişliğinde, ortada gösterilir.
- Hava durumu Open-Meteo'dan düğün günü tahminini çeker. Tahmin ancak düğüne ~15 gün kala alınabildiği için o zamana kadar "mevsim normalleri" (8–14°) yazar.
