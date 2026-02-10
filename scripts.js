// Enhanced interactive behaviors and accessibility
(function(){
  'use strict';

  // DOM helpers
  const $ = selector => document.querySelector(selector);
  const $$ = selector => Array.from(document.querySelectorAll(selector));

  // Nav toggle for mobile with keyboard support
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('primary-menu');
  if(toggle && menu){
    toggle.addEventListener('click', ()=>{
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      if(menu.hasAttribute('hidden')) menu.removeAttribute('hidden'); else menu.setAttribute('hidden','');
    });

    // Close menu when focus moves away
    document.addEventListener('click', (e)=>{
      if(!menu.contains(e.target) && !toggle.contains(e.target) && window.getComputedStyle(toggle).display !== 'none'){
        toggle.setAttribute('aria-expanded','false');
        menu.setAttribute('hidden','');
      }
    });
  }

  // IntersectionObserver for reveal animations
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!prefersReduced){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach((e)=>{
        if(e.isIntersecting) e.target.classList.add('visible');
      });
    },{threshold:0.12});
    document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
  } else {
    // If reduced motion, make all visible immediately
    document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
  }

  // Animate skill bars when skills section becomes visible
  const skillsSection = document.getElementById('skills');
  if(skillsSection){
    const skillObserver = new IntersectionObserver((entries, obs)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          document.querySelectorAll('.skill').forEach((el, idx)=>{
            const val = parseInt(el.getAttribute('data-skill')||'0',10);
            const bar = el.querySelector('.skill-bar span');
            if(bar){
              const delay = Math.min(600, idx * 120 + 120);
              setTimeout(()=>{ bar.style.width = val + '%'; }, delay);
            }
          });
          obs.disconnect();
        }
      });
    },{threshold:0.2});
    skillObserver.observe(skillsSection);
  }

  // Contact form validation - progressive enhancement
  const form = document.getElementById('contact-form');
  if(form){
    form.addEventListener('submit',function(e){
      e.preventDefault();
      const name = form.querySelector('#name');
      const email = form.querySelector('#email');
      const message = form.querySelector('#message');
      // Basic validation
      const errors = [];
      if(!name.value.trim()) errors.push('imi9');
      if(!email.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value)) errors.push('email');
      if(!message.value.trim()) errors.push('wiadomo');
      if(errors.length){
        // Accessible error summary
        alert('Prosz uzupenij pola: ' + errors.join(', '));
        return;
      }
      // Replace mailto with nicer UX: open mail client but preserve query length safety
      try{
        const subject = encodeURIComponent('Kontakt z portfolio: ' + (name.value||''));
        const body = encodeURIComponent(message.value + '\n\n---\nEmail: ' + email.value);
        const mailto = 'mailto:hello@example.com?subject='+subject+'&body='+body;
        window.location.href = mailto;
      }catch(err){
        console.error('Mailto fallback failed', err);
        alert('Wystpil b podczas wysylania wiadomoci.');
      }
    });
  }

  // Project modal interactions
  const modal = document.getElementById('project-modal');
  const modalPanel = modal && modal.querySelector('.modal-panel');
  const modalTitle = modal && modal.querySelector('#modal-title');
  const modalDesc = modal && modal.querySelector('#modal-desc');
  const modalMedia = modal && modal.querySelector('.modal-media');
  const modalClose = modal && modal.querySelector('.modal-close');

  function openModal(title, desc, color){
    if(!modal) return;
    modalTitle.textContent = title;
    modalDesc.textContent = desc;
    if(modalMedia && color) modalMedia.style.background = color;
    modal.setAttribute('aria-hidden','false');
    // trap focus
    const focusable = modal.querySelectorAll('button, [href], input, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    if(first) first.focus();
    document.body.style.overflow = 'hidden';
  }
  function closeModal(){
    if(!modal) return;
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }

  $$('.project-card').forEach(card=>{
    card.addEventListener('click', ()=>{
      openModal(card.dataset.title||'', card.dataset.desc||'', card.dataset.color||'');
    });
    card.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        openModal(card.dataset.title||'', card.dataset.desc||'', card.dataset.color||'');
      }
    });
  });

  if(modalClose) modalClose.addEventListener('click', closeModal);
  if(modal) modal.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeModal(); });

  // Add reveal class to key elements if not already
  ['.hero-inner','.about','.skills','.projects','.contact'].forEach(sel=>{
    document.querySelectorAll(sel).forEach(el=>{ if(!el.classList.contains('reveal')) el.classList.add('reveal'); });
  });

})();
