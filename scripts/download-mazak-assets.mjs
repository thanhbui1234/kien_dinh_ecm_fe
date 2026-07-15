import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../apps/user-next-app/public');

const assets = [
  // Hero carousel
  { url: 'https://www.mazak.com/adobe/dynamicmedia/deliver/dm-aid--3a9f29bc-36e0-4e51-ad28-8b2a832c41ff/2510-inte-i-neo.jpg?width=1920&preferwebp=true&quality=100', dest: 'images/hero/integrex-i-neo.jpg' },
  { url: 'https://www.mazak.com/adobe/dynamicmedia/deliver/dm-aid--48bafdf7-f5b8-4494-91b3-ddaafa247be0/01-gogreen-top.jpg?width=1920&preferwebp=true&quality=100', dest: 'images/hero/go-green.jpg' },
  { url: 'https://www.mazak.com/adobe/dynamicmedia/deliver/dm-aid--9ae138d1-a86e-47cd-88f4-84f0cb229fe0/02-automation-top.jpg?width=1920&preferwebp=true&quality=100', dest: 'images/hero/automation.jpg' },
  { url: 'https://www.mazak.com/adobe/dynamicmedia/deliver/dm-aid--ff5997b4-a57e-443c-b6cc-87d07fdc786a/04-gw-top-qte.jpg?width=1920&preferwebp=true&quality=100', dest: 'images/hero/qte-series.jpg' },
  { url: 'https://www.mazak.com/adobe/dynamicmedia/deliver/dm-aid--0d23ee6b-a46c-4f5a-bedc-a3c836d70869/05-gw-top-qt-primos.jpg?width=1920&preferwebp=true&quality=100', dest: 'images/hero/qt-primos.jpg' },
  // Products section background
  { url: 'https://www.mazak.com/content/dam/mazak/exported_files/global_web/jp/ja/home/bg_products_4000%C3%97970.jpg', dest: 'images/products/bg-products.jpg' },
  // Production facilities
  { url: 'https://www.mazak.com/adobe/dynamicmedia/deliver/dm-aid--624f60da-21ac-4ecc-9879-a2d8edfbd45b/oguchi2015-1.jpg?width=1920&preferwebp=true&quality=100', dest: 'images/facilities/oguchi.jpg' },
  { url: 'https://www.mazak.com/adobe/dynamicmedia/deliver/dm-aid--0b6b136f-1e72-4f5e-bdd5-87c43b922b02/02-wtg-1.jpg?width=1920&preferwebp=true&quality=100', dest: 'images/facilities/wtg.jpg' },
  { url: 'https://www.mazak.com/adobe/dynamicmedia/deliver/dm-aid--ce4e68ff-03ef-4b00-9bdd-1810e064692e/img-minokamo-2-640-396.jpg?width=1920&preferwebp=true&quality=100', dest: 'images/facilities/minokamo.jpg' },
  { url: 'https://www.mazak.com/adobe/dynamicmedia/deliver/dm-aid--5c554255-a758-4b9d-87f1-1de22cbaf83e/inabe-photo-1-3-1.jpg?width=1920&preferwebp=true&quality=100', dest: 'images/facilities/inabe.jpg' },
  { url: 'https://www.mazak.com/adobe/dynamicmedia/deliver/dm-aid--aa0de140-b21b-45db-8ee8-33e3ff7d4423/img-seiko-640-396.jpg?width=1920&preferwebp=true&quality=100', dest: 'images/facilities/seiko.jpg' },
  { url: 'https://www.mazak.com/adobe/dynamicmedia/deliver/dm-aid--dd7cf012-86de-492d-a5f2-5f9472ffdfb0/little-giant-factory235-160px-1.jpg?width=1920&preferwebp=true&quality=100', dest: 'images/facilities/little-giant.jpg' },
  { url: 'https://www.mazak.com/adobe/dynamicmedia/deliver/dm-aid--a4a4ef9c-4484-452c-a0fa-0d3b5e6b4bdc/liaoning-factory235-160px-1.jpg?width=1920&preferwebp=true&quality=100', dest: 'images/facilities/liaoning.jpg' },
  // Company history thumbnails
  { url: 'https://www.mazak.com/content/dam/mazak/exported_files/global_web/jp/ja/about-mazak/company-history/chairman_assembly_thumb_1.png', dest: 'images/history/chairman-assembly.png' },
  { url: 'https://www.mazak.com/content/dam/mazak/exported_files/global_web/jp/ja/about-mazak/company-history/FirstLathe_thumb_1.png', dest: 'images/history/first-lathe.png' },
  { url: 'https://www.mazak.com/content/dam/mazak/exported_files/global_web/jp/ja/about-mazak/company-history/Mazak_thumb_1.png', dest: 'images/history/mazak-early.png' },
  { url: 'https://www.mazak.com/content/dam/mazak/exported_files/global_web/jp/ja/about-mazak/company-history/MT1000_thumb_1.png', dest: 'images/history/mt1000.png' },
  { url: 'https://www.mazak.com/content/dam/mazak/exported_files/global_web/jp/ja/about-mazak/company-history/BTCno5_thumb_1.png', dest: 'images/history/btc5.png' },
  { url: 'https://www.mazak.com/content/dam/mazak/exported_files/global_web/jp/ja/about-mazak/company-history/P58_1MC_thumb_1.png', dest: 'images/history/p58-mc.png' },
  { url: 'https://www.mazak.com/content/dam/mazak/exported_files/global_web/jp/ja/about-mazak/company-history/YMS30_thumb_1.png', dest: 'images/history/yms30.png' },
  { url: 'https://www.mazak.com/content/dam/mazak/exported_files/global_web/jp/ja/about-mazak/company-history/MAZATROL_T-1.jpg', dest: 'images/history/mazatrol-t1.jpg' },
  { url: 'https://www.mazak.com/content/dam/mazak/exported_files/global_web/jp/ja/about-mazak/company-history/QUICKTURN10.jpg', dest: 'images/history/quickturn10.jpg' },
];

function download(url, destRel) {
  const dest = path.join(publicDir, destRel);
  fs.mkdirSync(path.dirname(dest), { recursive: true });

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const protocol = url.startsWith('https') ? https : http;
    const req = protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        download(res.headers.location, destRel).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(dest); });
    });
    req.on('error', (err) => { fs.unlinkSync(dest); reject(err); });
  });
}

async function downloadAll() {
  const batchSize = 4;
  for (let i = 0; i < assets.length; i += batchSize) {
    const batch = assets.slice(i, i + batchSize);
    const results = await Promise.allSettled(batch.map(a => download(a.url, a.dest)));
    results.forEach((r, j) => {
      if (r.status === 'fulfilled') console.log(`✓ ${batch[j].dest}`);
      else console.error(`✗ ${batch[j].dest}: ${r.reason.message}`);
    });
  }
  console.log('\nDone!');
}

downloadAll();
