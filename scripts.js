// Simple interactive behaviors and animations
(function(){
  // Nav toggle for mobile
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('primary-menu');
  if(toggle && menu){
    toggle.addEventListener('click', ()=>{
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      if(menu.hasAttribute('hidden')) menu.removeAttribute('hidden'); else menu.setAttribute('hidden','');
    });
  }

  // IntersectionObserver for reveal animations
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add('visible');
    });
  },{threshold:0.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  // Animate skill bars
  document.querySelectorAll('.skill').forEach(el=>{
    const val = parseInt(el.getAttribute('data-skill')||'0',10);
    const bar = el.querySelector('.skill-bar span');
    if(bar){
      setTimeout(()=>{bar.style.width = val + '%';},200);
    }
  });

  // Contact form validation - client side only
  const form = document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      const message = form.querySelector('#message');
      if(!name.value.trim() || !email.value.trim() || !message.value.trim()){
        alert('Proszę uzupełnić wszystkie pola.');
        return;
      }
      // Simple mailto fallback
      const subject = encodeURIComponent('Kontakt z portfolio: ' + (name.value||''));
      const body = encodeURIComponent(message.value + '\n\n---\nEmail: ' + email.value);
      window.location.href = 'mailto:hello@example.com?subject='+subject+'&body='+body;
    });
  }

  // Add reveal class to key sections
  ['.hero-inner','.about','.skills','.projects','.contact'].forEach(sel=>{
    document.querySelectorAll(sel).forEach(el=>el.classList.add('reveal'));
  });

})();
