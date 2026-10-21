const flowerPalette = ['#ef79ad', '#f4c045', '#af84db', '#70bca4', '#79a9e2', '#f4956b'];
const flowerStage = document.querySelector('.garden-stage');
const flowerBed = document.querySelector('.planted-flowers');
const flowerMessage = document.querySelector('#garden-message');
const effectsButton = document.querySelector('#effects-toggle');
const bloomLayer = document.querySelector('.flower-burst-layer');
let selectedFlowerColor = 'mix';
let effectPreference = true;
try { effectPreference = localStorage.getItem('greeting-effects') !== 'off'; } catch { /* Browser storage is optional. */ }

function createBloom(color, size = 55) {
  const flower = document.createElement('span');
  flower.className = 'bloom';
  flower.style.setProperty('--flower-color', color);
  flower.style.setProperty('--flower-size', `${size}px`);
  const petals = document.createElement('span');
  petals.className = 'flower-petals';
  for (let i = 0; i < 8; i++) {
    const petal = document.createElement('i');
    petal.className = 'flower-petal';
    petal.style.setProperty('--i', i);
    petals.append(petal);
  }
  const heart = document.createElement('i');
  heart.className = 'flower-heart';
  flower.append(petals, heart);
  return flower;
}

function currentFlowerColor() {
  return selectedFlowerColor === 'mix' ? flowerPalette[Math.floor(Math.random() * flowerPalette.length)] : selectedFlowerColor;
}

function syncEffects() {
  const enabled = effectPreference && !reducedMotion.matches;
  document.documentElement.dataset.effects = enabled ? 'on' : 'off';
  if (effectsButton) {
    effectsButton.disabled = reducedMotion.matches;
    effectsButton.setAttribute('aria-pressed', String(enabled));
    effectsButton.setAttribute('aria-label', reducedMotion.matches ? 'Hiệu ứng nhẹ' : enabled ? 'Hiệu ứng bật, nhấn để tắt chuyển động' : 'Hiệu ứng tắt, nhấn để bật chuyển động');
    effectsButton.textContent = reducedMotion.matches ? 'Hiệu ứng nhẹ' : enabled ? 'Hiệu ứng bật' : 'Hiệu ứng tắt';
  }
  if (!enabled) {
    bloomLayer?.replaceChildren();
    document.querySelector('.petal-rain')?.replaceChildren();
    portrait?.style.setProperty('--tilt-x', '0deg');
    portrait?.style.setProperty('--tilt-y', '0deg');
  }
}
syncEffects();
effectsButton?.addEventListener('click', () => {
  effectPreference = !effectPreference;
  try { localStorage.setItem('greeting-effects', effectPreference ? 'on' : 'off'); } catch { /* No storage is required. */ }
  syncEffects();
});
reducedMotion.addEventListener('change', syncEffects);

function burstAt(x, y, count = 1) {
  if (motionOff() || !bloomLayer) return;
  // Bound simultaneous decoration even when someone taps rapidly.
  while (bloomLayer.childElementCount > 14) bloomLayer.firstElementChild.remove();
  for (let i = 0; i < count; i++) {
    const color = currentFlowerColor();
    const bloom = document.createElement('span');
    bloom.className = 'tap-bloom';
    bloom.style.setProperty('--tap-x', `${Math.max(20, Math.min(innerWidth - 20, x + (i ? Math.random() * 90 - 45 : 0)))}px`);
    bloom.style.setProperty('--tap-y', `${y + (i ? Math.random() * 70 - 35 : 0)}px`);
    bloom.append(createBloom(color, 29 + Math.random() * 22));
    for (let j = 0; j < 6; j++) {
      const spark = document.createElement('i');
      spark.className = 'burst-spark';
      spark.style.setProperty('--flower-color', flowerPalette[j]);
      spark.style.setProperty('--dx', `${Math.cos(j * Math.PI / 3) * 58}px`);
      spark.style.setProperty('--dy', `${Math.sin(j * Math.PI / 3) * 58}px`);
      bloom.append(spark);
    }
    bloomLayer.append(bloom);
    setTimeout(() => bloom.remove(), 1600);
  }
}

function plantFlower(position) {
  if (!flowerBed) return;
  flowerStage.classList.remove('bouquet-mode');
  if (flowerBed.childElementCount >= 16) flowerBed.firstElementChild.remove();
  const color = currentFlowerColor();
  const flower = document.createElement('span');
  flower.className = 'garden-flower new-flower';
  flower.style.setProperty('--x', `${position ?? 14 + Math.random() * 72}%`);
  flower.style.setProperty('--height', `${165 + Math.random() * 105}px`);
  flower.style.setProperty('--lean', `${Math.random() * 18 - 9}deg`);
  const stem = document.createElement('i');
  stem.className = 'garden-stem';
  flower.append(stem, createBloom(color, 46 + Math.random() * 20));
  flowerBed.append(flower);
  updateBouquetAngles();
  flowerMessage.textContent = 'Thêm một bông hoa. Chọn màu khác để vườn rực rỡ hơn nhé.';
}

function updateBouquetAngles() {
  const flowers = [...flowerBed.children];
  const spread = matchMedia('(max-width: 760px)').matches ? 52 : 95;
  flowers.forEach((flower, i) => {
    flower.style.setProperty('--bouquet-angle', `${(i / Math.max(1, flowers.length - 1) - .5) * spread}deg`);
  });
}

document.querySelectorAll('input[name="flower-color"]').forEach(input => {
  input.addEventListener('change', () => {
    selectedFlowerColor = input.value;
    flowerMessage.textContent = `Đã chọn ${input.getAttribute('aria-label').toLowerCase()}. Chạm vào vườn để trồng hoa.`;
    // Recolor the existing flowers, so selecting a palette has an immediate visible result.
    flowerBed.querySelectorAll('.bloom').forEach(flower => flower.style.setProperty('--flower-color', currentFlowerColor()));
  });
});

flowerStage?.addEventListener('click', event => {
  if (event.target.closest('button')) return;
  const rect = flowerStage.getBoundingClientRect();
  plantFlower(Math.max(12, Math.min(88, (event.clientX - rect.left) / rect.width * 100)));
  burstAt(event.clientX, event.clientY);
});
document.querySelector('#plant-flower')?.addEventListener('click', event => {
  plantFlower();
  const rect = event.currentTarget.getBoundingClientRect();
  burstAt(rect.left + rect.width / 2, rect.top - 60, 2);
});

document.querySelectorAll('[data-flower-action]').forEach(button => {
  button.addEventListener('click', () => {
    if (button.dataset.flowerAction === 'shower') {
      celebrate(58);
      if (motionOff()) toast('Bật hiệu ứng để xem mưa hoa.');
      return;
    }
    if (!flowerBed) return;
    if (flowerStage.classList.contains('bouquet-mode')) {
      flowerStage.classList.remove('bouquet-mode');
      flowerMessage.textContent = 'Hoa lại về vườn rồi. Chạm vào vườn để trồng thêm nhé.';
    } else {
      while (flowerBed.childElementCount < 11) plantFlower();
      updateBouquetAngles();
      flowerStage.classList.add('bouquet-mode');
      flowerMessage.textContent = 'Bó hoa của bạn đây. Chúc một ngày 20/10 thật vui!';
      celebrate(35);
    }
    flowerStage.closest('.reveal').classList.add('is-visible');
    document.querySelector('#flower-garden').scrollIntoView({ behavior: motionOff() ? 'instant' : 'smooth', block: 'center' });
  });
});

document.addEventListener('click', event => {
  if (!event.isTrusted || !event.detail || event.target.closest('button,a,input,label,summary,dialog,.letter-body,.signature,.flower-garden')) return;
  if (window.getSelection()?.toString()) return;
  burstAt(event.clientX, event.clientY);
});
