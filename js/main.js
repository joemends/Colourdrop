
const menu = document.querySelector('.menu');
const navLinks = document.querySelector('.nav-links');
if(menu){
  menu.addEventListener('click',()=>navLinks.classList.toggle('open'));
  navLinks?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>navLinks.classList.remove('open')));
}

const observer = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add('visible');
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

document.querySelectorAll('[data-map]').forEach(card=>{
  card.addEventListener('click',()=>{
    document.querySelectorAll('[data-map]').forEach(x=>x.classList.remove('selected'));
    card.classList.add('selected');
    const iframe=document.querySelector('#location-map');
    if(iframe) iframe.src=card.dataset.map;
  });
});

document.querySelectorAll('form[data-demo]').forEach(form=>{
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const btn=form.querySelector('button[type="submit"]');
    const original=btn.textContent;
    btn.textContent='Message prepared ✓';
    setTimeout(()=>btn.textContent=original,2500);
    form.reset();
  });
});

const year=document.querySelector('[data-year]');
if(year) year.textContent=new Date().getFullYear();
