import fs from 'node:fs/promises';
import QRCode from 'qrcode';

const config = JSON.parse(await fs.readFile('recipients.json', 'utf8'));
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const address = r => r.addressName || r.shortName;
const head = (title, description, prefix = './', photo) => `<!doctype html>
<html lang="vi"><head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="theme-color" content="#f5f3ee"><meta name="description" content="${esc(description)}">
  <meta name="robots" content="noindex,nofollow"><meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  ${photo ? `<meta property="og:image" content="${config.baseUrl}assets/photos/${photo}-960.webp">` : ''}
  <title>${esc(title)}</title><link rel="icon" href="${prefix}assets/flower.svg" type="image/svg+xml">
  <link rel="preload" href="${prefix}assets/fonts/be-vietnam-pro-400-normal.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${prefix}assets/fonts.css"><link rel="stylesheet" href="${prefix}assets/style.css?v=6">
  <link rel="stylesheet" href="${prefix}assets/flowers.css?v=6">
</head>`;
const flowerColors = ['#ef79ad', '#f4c045', '#af84db', '#70bca4', '#79a9e2', '#f4956b'];
const bloom = (color, size = 58) => `<span class="bloom" style="--flower-color:${color};--flower-size:${size}px"><span class="flower-petals">${Array.from({length:8}, (_, i) => `<i class="flower-petal" style="--i:${i}"></i>`).join('')}</span><i class="flower-heart"></i></span>`;
const garden = r => `<section class="flower-garden reveal" id="flower-garden" aria-labelledby="garden-title">
  <div class="garden-copy"><p class="eyebrow">Hoa tặng ${esc(address(r))}</p><h2 id="garden-title">Thêm hoa, thêm vui.</h2>
    <p>Chọn một màu, rồi chạm vào vườn để thêm hoa. Hoặc nhận cả một bó nhé.</p>
    <div class="garden-actions"><button class="flower-action" data-flower-action="bouquet"><span aria-hidden="true">✿</span>Nhận bó hoa</button><button class="flower-action" data-flower-action="shower"><span aria-hidden="true">✧</span>Mưa hoa</button></div>
    <fieldset class="flower-colors"><legend>Màu hoa</legend><label><input type="radio" name="flower-color" value="mix" checked aria-label="Nhiều màu"><span class="color-dot rainbow-dot"></span></label>${[['#ef79ad','Hồng'],['#f4c045','Vàng'],['#af84db','Tím'],['#70bca4','Xanh lá'],['#79a9e2','Xanh dương']].map(([color,name])=>`<label><input type="radio" name="flower-color" value="${color}" aria-label="${name}"><span class="color-dot" style="--swatch:${color}"></span></label>`).join('')}</fieldset>
    <p class="garden-message" id="garden-message" role="status">Một vườn hoa nhỏ Khiêm gửi ${esc(address(r))}.</p>
  </div>
  <div class="garden-stage" aria-label="Vườn hoa tương tác"><div class="planted-flowers" aria-hidden="true">${Array.from({length:7},(_,i)=>`<span class="garden-flower" style="--x:${14+i*12}%;--height:${[170,230,195,265,205,240,175][i]}px;--lean:${[-10,-7,-4,0,4,7,10][i]}deg;--bouquet-angle:${(i-3)*12}deg"><i class="garden-stem"></i>${bloom(flowerColors[i%6],[48,61,55,67,56,60,48][i])}</span>`).join('')}</div><span class="garden-ribbon" aria-hidden="true"></span><button id="plant-flower" class="plant-flower">Trồng thêm hoa +</button></div>
  <noscript>Vườn hoa đã ở đây. Bật JavaScript để trồng thêm hoa và mở bó hoa.</noscript>
</section>`;
const masthead = `<header class="masthead"><span class="wordmark">Khiêm gửi<span aria-hidden="true">✳</span></span><span class="occasion">Ngày Phụ nữ Việt Nam</span><div class="header-controls"><button class="effects-toggle" id="effects-toggle" aria-pressed="true" aria-label="Hiệu ứng bật, nhấn để tắt chuyển động">Hiệu ứng bật</button><span class="header-date">20.10</span></div></header>`;
const footer = `<footer><span>Chúc mừng ngày Phụ nữ Việt Nam.</span><span>${esc(config.sender)}</span></footer>`;
const end = prefix => `<p class="toast" role="status" aria-live="polite"></p><script src="${prefix}assets/app.js?v=6" defer></script><script src="${prefix}assets/flowers.js?v=6" defer></script></body></html>`;
const photo = (r, prefix = '../', lazy = false) => `<img
  src="${prefix}assets/photos/${r.slug}-960.webp"
  srcset="${prefix}assets/photos/${r.slug}-480.webp 480w, ${prefix}assets/photos/${r.slug}-960.webp 960w"
  sizes="${lazy ? '(max-width: 640px) 90vw, 42vw' : '(max-width: 760px) 88vw, (max-width: 1200px) 43vw, 480px'}"
  width="${r.slug === 'bao-uyen' ? 1366 : 828}" height="${r.slug === 'bao-uyen' ? 2048 : 828}"
  alt="${esc(r.photoAlt)}" ${lazy ? 'loading="lazy"' : 'fetchpriority="high"'} decoding="async">`;

await fs.mkdir('public/qr', { recursive: true });
for (const r of config.recipients) {
  await fs.mkdir(`public/${r.slug}`, { recursive: true });
  const html = `${head(`Gửi ${address(r)} | 20/10`, r.intro, '../', r.slug)}
<body class="${r.theme}">
<a class="skip-link" href="#main">Đến nội dung thiệp</a>
<div class="page-wrap">
${masthead}
<main id="main">
  <section class="hero" aria-labelledby="greeting-title">
    <div class="hero-copy">
      <p class="eyebrow enter">Một tấm thiệp dành riêng cho</p>
      <h1 id="greeting-title" class="enter"><span class="display-name">${esc(r.displayName)}</span><span class="greeting-line">${esc(r.headline)}</span></h1>
      <p class="intro enter">${esc(r.intro)}</p>
      <a class="primary enter" id="open-letter" href="#letter" aria-controls="letter" aria-expanded="false"><span>Mở thư của ${r.addressName ? 'em' : 'Khiêm'}</span><span class="button-arrow" aria-hidden="true">↗</span></a>
      <div class="hero-signoff enter"><span class="signature-small">Minh Khiêm</span><span>gửi ${esc(address(r))}</span></div>
      <div class="hero-actions enter"><button class="flower-action" data-flower-action="bouquet"><span aria-hidden="true">✿</span>Nhận bó hoa</button><button class="flower-action" data-flower-action="shower"><span aria-hidden="true">✧</span>Mưa hoa</button></div>
    </div>
    <figure class="portrait-composition enter" style="--photo-ratio:${r.photoRatio};--photo-position:${r.photoPosition}">
      
      <div class="portrait-mat">
        <span class="photo-tape" aria-hidden="true"></span>
        <button class="portrait-button" aria-label="Xem toàn bộ ảnh của ${esc(address(r))}" aria-haspopup="dialog">
          ${photo(r)}<span class="photo-sheen" aria-hidden="true"></span>
        </button>
        <figcaption><span>${esc(r.name)}</span><span class="photo-caption-hint" aria-hidden="true">Xem ảnh ↗</span></figcaption>
      </div>
      <div class="photo-garland" aria-hidden="true">${bloom("#ef79ad",70)}${bloom("#f4c045",62)}${bloom("#af84db",44)}</div>
    </figure>
  </section>

  <section class="letter-area reveal" aria-label="Lá thư của Khiêm">
    <details id="letter" class="letter-envelope">
      <summary><span class="envelope-icon" aria-hidden="true"><i></i></span><span class="envelope-label"><span>Gửi ${esc(address(r))}</span><small>Có vài điều Khiêm muốn chúc ${r.addressName ? 'chị' : r.shortName.split(' ').at(-1)}.</small></span><span class="letter-toggle" aria-hidden="true">+</span></summary>
      <article class="letter-content" tabindex="-1" aria-labelledby="letter-title">
        <div class="letter-margin"><span class="eyebrow">20 tháng 10</span><h2 id="letter-title">${esc(r.letterTitle)}</h2><span class="letter-flower" aria-hidden="true">✳</span></div>
        <div class="letter-writing"><div class="letter-body">${r.paragraphs.map((p, i) => `<p style="--order:${i}">${esc(p)}</p>`).join('')}</div>
          <div class="signature"><span>${r.addressName ? 'Em Khiêm,' : 'Khiêm gửi,'}</span><strong>${esc(config.sender)}</strong></div>
          <button class="text-button" id="keep-wish">Lưu lời chúc <span aria-hidden="true">↓</span></button>
        </div>
      </article>
    </details>
  </section>

  <section class="little-wish reveal" aria-labelledby="wish-title">
    <div class="wish-heading"><span aria-hidden="true">✳</span><h2 id="wish-title">Còn một lời chúc nữa.</h2></div>
    <div class="wish-body"><p id="extra-wish" aria-live="polite">${esc(r.wish)}</p><button id="another-wish" class="text-button" data-wishes="${esc(JSON.stringify(r.extraWishes))}">Thêm một lời chúc <span aria-hidden="true">↻</span></button></div>
  </section>
${garden(r)}
</main>
${footer}
</div>
<dialog class="photo-dialog" aria-label="Ảnh của ${esc(address(r))}"><div class="photo-dialog-bar"><span>${esc(r.name)}</span><button class="close-photo" autofocus>Đóng <span aria-hidden="true">×</span></button></div><img src="../assets/photos/${r.slug}-1440.webp" alt="${esc(r.photoAlt)}" width="${r.slug === 'bao-uyen' ? 1366 : 828}" height="${r.slug === 'bao-uyen' ? 2048 : 828}" loading="lazy"></dialog>
<div class="petal-rain" aria-hidden="true"></div><div class="flower-burst-layer" aria-hidden="true"></div>
${end('../')}`;
  await fs.writeFile(`public/${r.slug}/index.html`, html);
  const url = new URL(`${r.slug}/`, config.baseUrl).href;
  const options = { margin: 4, errorCorrectionLevel: 'M', color: { dark: '#25342c', light: '#ffffff' } };
  await QRCode.toFile(`public/qr/${r.slug}.png`, url, { ...options, width: 1000 });
  await QRCode.toFile(`public/qr/${r.slug}.svg`, url, { ...options, type: 'svg' });
}

await fs.writeFile('public/index.html', `${head('Bốn tấm thiệp 20/10 | Khiêm gửi', 'Thiệp và lời chúc riêng cho Bảo Uyên, chị Kim Phượng, Huyền Dịu và chị Nguyệt Ánh.')}
<body><a class="skip-link" href="#main">Đến các tấm thiệp</a><div class="page-wrap">${masthead}
<main class="directory" id="main"><div class="directory-heading enter"><p class="eyebrow">Chúc mừng 20/10</p><h1>Bốn tấm thiệp,<br>gửi bốn người.</h1><p>Mỗi người một lời chúc riêng. Khiêm gửi.</p></div>
<div class="recipient-grid">${config.recipients.map(r => `<article class="recipient-card ${r.theme} reveal"><a class="directory-photo" href="./${r.slug}/" aria-label="Mở thiệp của ${esc(address(r))}">${photo(r, './', true)}<span class="directory-photo-arrow" aria-hidden="true">↗</span></a><div class="recipient-card-copy"><p class="eyebrow">Gửi ${esc(address(r))}</p><h2><a href="./${r.slug}/">${esc(r.name)}</a></h2><p>${esc(r.intro)}</p><details class="qr-details"><summary>Mã QR & đường dẫn <span aria-hidden="true">+</span></summary><div class="qr-content"><img src="./qr/${r.slug}.png" width="180" height="180" alt="Mã QR mở thiệp của ${esc(address(r))}" loading="lazy"><div class="qr-actions"><a href="./qr/${r.slug}.png" download="QR-${r.slug}.png">Tải QR PNG ↓</a><a href="./qr/${r.slug}.svg" download="QR-${r.slug}.svg">Tải SVG để in ↓</a><button class="copy-link text-button" data-url="${esc(new URL(`${r.slug}/`, config.baseUrl).href)}">Sao chép đường dẫn</button></div></div></details></div></article>`).join('')}</div>
</main>${footer}</div>${end('./')}`);
await fs.writeFile('public/.nojekyll', '');
await fs.writeFile('public/404.html', `${head('Không tìm thấy tấm thiệp', 'Kiểm tra lại đường dẫn tấm thiệp.')}<body><main class="not-found"><p class="eyebrow">Khiêm gửi</p><h1>Tấm thiệp này chưa có ở đây.</h1><p>Bạn kiểm tra lại đường dẫn nhé.</p><a class="primary" href="${esc(config.baseUrl)}">Về các tấm thiệp <span aria-hidden="true">↗</span></a></main>${end('./')}`);
console.log('Built four photo greeting pages, directory, and QR codes.');
