# Sünnet Düğünü Davetiyesi

Statik HTML/CSS/JS, mobil uyumlu tek sayfalık davetiye. Build adımı yok.

## Yapı

```
index.html       Tüm metinler (isim, adres, aile)
css/style.css    Stiller
js/main.js       Kapı açılışı, geri sayım, hava durumu, alarm (.ics), WhatsApp formu, IBAN kopyalama
assets/images/   rope-boy, boys-cloud, bekliyoruz (.webp); story1-2, intro-poster (.jpg)
davetiye.html    Hepsi içine gömülü, küçültülmüş tek dosya sürüm (index.html'den üretilir)
_headers         Netlify/Cloudflare Pages için önbellek ayarları
```

## Yapılacaklar

1. `js/main.js` başındaki `CONFIG`: çocuğun adı, tarih/saat, şehir, WhatsApp numarası.
2. `index.html`: isim, aile, program saatleri, mekanlar, harita adresleri (Google Haritalar bağlantılarındaki `q=` / `query=`), IBAN.
3. Galeri: düğünden sonra `index.html` içindeki `gallery-empty` bloğunu silip yorumdaki galeri kodunu ekleyin; fotoğrafları `assets/images/gallery1-3.jpg` olarak koyun.

## Yayınlama

Klasörün içeriğini herhangi bir statik hosting'e (Netlify, Vercel, GitHub Pages, cPanel) yükleyin.

## Notlar

- Masaüstünde sayfa telefon genişliğinde, ortada gösterilir.
- Hava durumu Open-Meteo'dan düğün günü tahminini çeker. Tahmin ancak düğüne ~15 gün kala alınabildiği için o zamana kadar "mevsim normalleri" (8–14°) yazar.
