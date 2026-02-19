const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const path = require('path');
const fs   = require('fs');

// ── Register font ─────────────────────────────────────────────────────────────
function registerFonts() {
  const candidates = [
    path.join(__dirname, 'Tajawal-Bold.ttf'),
    path.join(__dirname, 'NotoNaskhArabic-Bold.ttf'),
    path.join(__dirname, 'Amiri-Bold.ttf'),
    'C:/Windows/Fonts/arabtype.ttf',
    'C:/Windows/Fonts/tahoma.ttf',
  ];
  for (const f of candidates) {
    if (fs.existsSync(f)) {
      GlobalFonts.registerFromPath(f, 'ArabicFont');
      console.log(`✅ Font: ${path.basename(f)}`);
      return;
    }
  }
  console.warn('⚠️  No Arabic font found — place Tajawal-Bold.ttf next to index.js');
}

// ── Shared draw helper ────────────────────────────────────────────────────────
function drawTime(ctx, time, x, y) {
  ctx.save();
  ctx.font         = 'bold 52px ArabicFont, Arial';
  ctx.fillStyle    = '#ffffff';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(time, x, y);
  ctx.restore();
}

// ── One function per prayer — tweak x, y freely ──────────────────────────────

function drawFajr(ctx, time) {
  const x = 1255;  
  const y = 797;  
  drawTime(ctx, time, x, y);
}

function drawDhuhr(ctx, time) {
  const x = 1010;  
  const y = 797;   
  drawTime(ctx, time, x, y);
}

function drawAsr(ctx, time) {
  const x = 760;  
  const y = 797;  
  drawTime(ctx, time, x, y);
}

function drawMaghrib(ctx, time) {
  const x = 510;  
  const y = 797; 
  drawTime(ctx, time, x, y);
}

function drawIsha(ctx, time) {
  const x = 275; 
  const y = 797;
  drawTime(ctx, time, x, y);
}

function drawHijriDate(ctx, text) {
  const x = 768;   
  const y = 275; 
  ctx.save();
  ctx.font         = 'bold 22px ArabicFont, Arial';
  ctx.fillStyle    = '#ffffff';
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.direction    = 'rtl';
  ctx.fillText(text, x, y);
  ctx.restore();
}

// ── Main generator ────────────────────────────────────────────────────────────
async function generatePrayerImage({ fajr, dhuhr, asr, maghrib, isha, hijriText }) {
  registerFonts();

  const bgImg  = await loadImage(path.join(__dirname, 'bg.png'));
  const canvas = createCanvas(1536, 1024);
  const ctx    = canvas.getContext('2d');

  ctx.drawImage(bgImg, 0, 0, 1536, 1024);

  drawFajr   (ctx, fajr);
  drawDhuhr  (ctx, dhuhr);
  drawAsr    (ctx, asr);
  drawMaghrib(ctx, maghrib);
  drawIsha   (ctx, isha);

  drawHijriDate(ctx, hijriText);

  return canvas.toBuffer('image/png');
}

module.exports = { generatePrayerImage };