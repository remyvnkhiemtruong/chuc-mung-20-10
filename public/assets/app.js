const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const openButton = document.querySelector('#open-letter');
const letter = document.querySelector('#letter');
let toastTimer;
let petalTimer;

function toast(message) {
  const el = document.querySelector('.toast');
  el.textContent = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.textContent = ''; }, 4500);
}

function celebrate(count = 30) {
  const rain = document.querySelector('.petal-rain');
  if (!rain || reducedMotion.matches) return;
  clearTimeout(petalTimer);
  rain.replaceChildren();
  const petals = document.createDocumentFragment();
  for (let i = 0; i < count; i++) {
    const petal = document.createElement('i');
    petal.className = 'falling-petal';
    petal.style.setProperty('--left', `${Math.random() * 100}%`);
    petal.style.setProperty('--delay', `${Math.random() * .7}s`);
    petal.style.setProperty('--duration', `${3 + Math.random() * 1.5}s`);
    petal.style.setProperty('--size', `${7 + Math.random() * 8}px`);
    petal.style.setProperty('--drift', `${Math.random() * 160 - 80}px`);
    petal.style.setProperty('--spin', `${Math.random() * 500 - 250}deg`);
    petals.append(petal);
  }
  rain.append(petals);
  petalTimer = setTimeout(() => rain.replaceChildren(), 5500);
}

openButton?.addEventListener('click', event => {
  event.preventDefault();
  letter.open = true;
  letter.closest('.reveal')?.classList.add('is-visible');
  const article = letter.querySelector('.letter-content');
  article.focus({ preventScroll: true });
  letter.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start' });
});

letter?.addEventListener('toggle', () => {
  openButton.setAttribute('aria-expanded', String(letter.open));
  openButton.querySelector('span').textContent = letter.open ? 'Đọc lại lá thư' : `Mở thư của ${document.body.classList.contains('apricot') || document.body.classList.contains('sage') ? 'em' : 'Khiêm'}`;
  if (letter.open) celebrate();
});

if (location.hash === '#letter' && letter) letter.open = true;

document.querySelector('#keep-wish')?.addEventListener('click', () => {
  const title = document.querySelector('h1').innerText;
  const greeting = document.querySelector('#letter-title').innerText;
  const body = document.querySelector('.letter-body').innerText;
  const signature = document.querySelector('.signature').innerText;
  const blob = new Blob([`${title}\n\nNgày Phụ nữ Việt Nam 20/10\n\n${greeting}\n\n${body}\n\n${signature}\n`], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Loi-chuc-20-10-${location.pathname.split('/').filter(Boolean).at(-1)}.txt`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast('Lời chúc đã sẵn sàng để lưu.');
});

const wishButton = document.querySelector('#another-wish');
if (wishButton) {
  const wishes = JSON.parse(wishButton.dataset.wishes);
  const wish = document.querySelector('#extra-wish');
  let wishIndex = 0;
  wishButton.addEventListener('click', () => {
    wish.textContent = wishes[wishIndex++ % wishes.length];
    wish.classList.remove('wish-changing');
    requestAnimationFrame(() => requestAnimationFrame(() => wish.classList.add('wish-changing')));
    celebrate(12);
  });
}

const photoDialog = document.querySelector('.photo-dialog');
document.querySelector('.portrait-button')?.addEventListener('click', () => {
  photoDialog.showModal();
  document.body.classList.add('modal-open');
});
document.querySelector('.close-photo')?.addEventListener('click', () => photoDialog.close());
photoDialog?.addEventListener('click', event => {
  if (event.target === photoDialog) {
    const box = photoDialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) photoDialog.close();
  }
});
photoDialog?.addEventListener('close', () => document.body.classList.remove('modal-open'));

const portrait = document.querySelector('.portrait-composition');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
if (portrait) {
  let frame;
  portrait.addEventListener('pointermove', event => {
    if (reducedMotion.matches || !finePointer.matches) return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const rect = portrait.getBoundingClientRect();
      portrait.style.setProperty('--tilt-x', `${-(event.clientY - rect.top - rect.height / 2) / rect.height * 5}deg`);
      portrait.style.setProperty('--tilt-y', `${(event.clientX - rect.left - rect.width / 2) / rect.width * 7}deg`);
    });
  }, { passive: true });
  portrait.addEventListener('pointerleave', () => {
    cancelAnimationFrame(frame);
    portrait.style.setProperty('--tilt-x', '0deg');
    portrait.style.setProperty('--tilt-y', '0deg');
  });
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  document.documentElement.classList.add('js');
}

reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) {
    document.querySelector('.petal-rain')?.replaceChildren();
    portrait?.style.setProperty('--tilt-x', '0deg');
    portrait?.style.setProperty('--tilt-y', '0deg');
  }
});

document.querySelectorAll('.copy-link').forEach(button => {
  button.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(button.dataset.url); toast('Đã sao chép đường dẫn tấm thiệp.'); }
    catch { toast('Bạn có thể mở thiệp rồi sao chép địa chỉ trên trình duyệt.'); }
  });
});
