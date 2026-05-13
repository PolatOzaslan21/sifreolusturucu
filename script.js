const CHARS = { upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', lower: 'abcdefghijklmnopqrstuvwxyz', numbers: '0123456789', symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?', ambig: /[0OlI1]/g };

function getCharset() {
  const u = document.getElementById('upper').checked;
  const l = document.getElementById('lower').checked;
  const n = document.getElementById('numbers').checked;
  const s = document.getElementById('symbols').checked;
  const noA = document.getElementById('noambig').checked;
  let c = '';
  if (u) c += CHARS.upper;
  if (l) c += CHARS.lower;
  if (n) c += CHARS.numbers;
  if (s) c += CHARS.symbols;
  if (noA) c = c.replace(CHARS.ambig, '');
  return c || CHARS.lower;
}

function generate(len) {
  const c = getCharset();
  let pwd = '';
  const arr = new Uint32Array(len);
  crypto.getRandomValues(arr);
  for (let i = 0; i < len; i++) pwd += c[arr[i] % c.length];
  return pwd;
}

function strengthScore(pwd) {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (pwd.length >= 12) s++;
  if (pwd.length >= 16) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[a-z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
}

function generatePassword() {
  const len = parseInt(document.getElementById('length').value);
  const pwd = generate(len);
  document.getElementById('pwd-output').textContent = pwd;
  const s = strengthScore(pwd);
  const fill = document.getElementById('strength-fill');
  const lbl = document.getElementById('strength-label');
  const pct = Math.round((s / 7) * 100);
  fill.style.width = pct + '%';
  if (s <= 2) { fill.style.background = '#e53935'; lbl.textContent = 'Zayıf'; lbl.style.color = '#e53935'; }
  else if (s <= 4) { fill.style.background = '#fb8c00'; lbl.textContent = 'Orta'; lbl.style.color = '#fb8c00'; }
  else if (s <= 5) { fill.style.background = '#43a047'; lbl.textContent = 'Güçlü'; lbl.style.color = '#43a047'; }
  else { fill.style.background = '#1e88e5'; lbl.textContent = 'Çok Güçlü'; lbl.style.color = '#1e88e5'; }
}

function copyPassword() {
  const pwd = document.getElementById('pwd-output').textContent;
  navigator.clipboard.writeText(pwd).then(() => {
    const m = document.getElementById('copy-msg');
    m.textContent = '✓ Şifre kopyalandı!';
    setTimeout(() => m.textContent = '', 2000);
  });
}

function generateMultiple() {
  const len = parseInt(document.getElementById('length').value);
  const count = parseInt(document.getElementById('count').value);
  const el = document.getElementById('multi-result');
  el.innerHTML = '';
  const ul = document.createElement('ul');
  ul.className = 'multi-list';
  for (let i = 0; i < count; i++) {
    const p = generate(len);
    const li = document.createElement('li');
    li.textContent = p;
    li.addEventListener('click', function () {
      navigator.clipboard.writeText(p).then(() => {
        const orig = this.textContent;
        this.textContent = '✓ Kopyalandı!';
        setTimeout(() => { this.textContent = orig; }, 1500);
      });
    });
    ul.appendChild(li);
  }
  el.appendChild(ul);
  const note = document.createElement('p');
  note.style.cssText = 'font-size:.8rem;color:var(--text-light);margin-top:4px;';
  note.textContent = 'Bir şifreye tıklayarak kopyalayın.';
  el.appendChild(note);
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('length').addEventListener('input', function () {
    document.getElementById('len-display').textContent = this.value;
    generatePassword();
  });
  document.getElementById('btn-refresh').addEventListener('click', generatePassword);
  document.getElementById('btn-copy').addEventListener('click', copyPassword);
  document.getElementById('btn-bulk').addEventListener('click', generateMultiple);
  generatePassword();
});
