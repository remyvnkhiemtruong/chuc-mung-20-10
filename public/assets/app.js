const openButton = document.querySelector('#open-letter');
const letter = document.querySelector('#letter');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let toastTimer;
function toast(message) {
  const el = document.querySelector('.toast');
  el.textContent = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.textContent = ''; }, 4500);
}
openButton?.addEventListener('click', () => {
  letter.hidden = false;
  letter.classList.add('is-open');
  openButton.setAttribute('aria-expanded', 'true');
  openButton.firstChild.textContent = 'Đọc lại lời chúc ';
  letter.focus({preventScroll:true});
  letter.scrollIntoView({behavior: reducedMotion.matches ? 'instant' : 'smooth',block:'start'});
  if (!reducedMotion.matches) {
    const rain = document.querySelector('.petal-rain');
    rain.replaceChildren();
    for(let i = 0; i < 18; i++) {
      const petal = document.createElement('i');
      petal.className = 'falling-petal';
      petal.style.setProperty('--left',`${Math.random()*100}%`);
      petal.style.setProperty('--delay',`${Math.random()*.7}s`);
      rain.append(petal);
    }
    setTimeout(() => rain.replaceChildren(), 4000);
  }
});
document.querySelector('#keep-wish')?.addEventListener('click', () => {
  const title = document.querySelector('h1').textContent;
  const body = document.querySelector('.letter-body').innerText;
  const signature = document.querySelector('.signature').innerText;
  const blob = new Blob([`${title}\n\nChúc mừng ngày Phụ nữ Việt Nam 20/10\n\n${body}\n\n${signature}\n`], {type:'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Loi-chuc-20-10-${location.pathname.split('/').filter(Boolean).at(-1)}.txt`;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast('Đã chuẩn bị lời chúc để bạn lưu lại.');
});
document.querySelectorAll('.copy-link').forEach(button => {
  button.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(button.dataset.url); toast('Đã sao chép đường dẫn tấm thiệp.'); }
    catch { toast('Chưa sao chép được. Bạn có thể mở thiệp và sao chép địa chỉ trên trình duyệt.'); }
  });
});
