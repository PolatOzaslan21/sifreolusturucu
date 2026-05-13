const CHARS={upper:'ABCDEFGHIJKLMNOPQRSTUVWXYZ',lower:'abcdefghijklmnopqrstuvwxyz',numbers:'0123456789',symbols:'!@#$%^&*()_+-=[]{}|;:,.<>?',ambig:/[0OlI1]/g};
function getCharset(){
  const u=document.getElementById('upper').checked;
  const l=document.getElementById('lower').checked;
  const n=document.getElementById('numbers').checked;
  const s=document.getElementById('symbols').checked;
  const noA=document.getElementById('noambig').checked;
  let c='';
  if(u)c+=CHARS.upper;
  if(l)c+=CHARS.lower;
  if(n)c+=CHARS.numbers;
  if(s)c+=CHARS.symbols;
  if(noA)c=c.replace(CHARS.ambig,'');
  return c||CHARS.lower;
}
function generate(len){
  const c=getCharset();
  let pwd='';
  const arr=new Uint32Array(len);
  crypto.getRandomValues(arr);
  for(let i=0;i<len;i++)pwd+=c[arr[i]%c.length];
  return pwd;
}
function strengthScore(pwd){
  let s=0;
  if(pwd.length>=8)s++;
  if(pwd.length>=12)s++;
  if(pwd.length>=16)s++;
  if(/[A-Z]/.test(pwd))s++;
  if(/[a-z]/.test(pwd))s++;
  if(/[0-9]/.test(pwd))s++;
  if(/[^A-Za-z0-9]/.test(pwd))s++;
  return s;
}
function generatePassword(){
  const len=parseInt(document.getElementById('length').value);
  const pwd=generate(len);
  document.getElementById('pwd-output').textContent=pwd;
  const s=strengthScore(pwd);
  const fill=document.getElementById('strength-fill');
  const lbl=document.getElementById('strength-label');
  const pct=Math.round((s/7)*100);
  fill.style.width=pct+'%';
  if(s<=2){fill.style.background='#e53935';lbl.textContent='Zayıf';lbl.style.color='#e53935';}
  else if(s<=4){fill.style.background='#fb8c00';lbl.textContent='Orta';lbl.style.color='#fb8c00';}
  else if(s<=5){fill.style.background='#43a047';lbl.textContent='Güçlü';lbl.style.color='#43a047';}
  else{fill.style.background='#1e88e5';lbl.textContent='Çok Güçlü';lbl.style.color='#1e88e5';}
}
function copyPassword(){
  const pwd=document.getElementById('pwd-output').textContent;
  navigator.clipboard.writeText(pwd).then(()=>{
    const m=document.getElementById('copy-msg');
    m.textContent='✓ Şifre kopyalandı!';
    setTimeout(()=>m.textContent='',2000);
  });
}
function generateMultiple(){
  const len=parseInt(document.getElementById('length').value);
  const count=parseInt(document.getElementById('count').value);
  const el=document.getElementById('multi-result');
  let html='<ul class="multi-list">';
  for(let i=0;i<count;i++){const p=generate(len);html+=`<li title="Kopyalamak için tıkla" onclick="navigator.clipboard.writeText('${p}')">${p}</li>`;}
  html+='</ul><p style="font-size:.8rem;color:var(--text-light);margin-top:4px;">Bir şifreye tıklayarak kopyalayın.</p>';
  el.innerHTML=html;
}
document.addEventListener('DOMContentLoaded',generatePassword);