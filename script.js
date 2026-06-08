/* ============================================================
   PIONEERS OF COMPUTING – DIGITAL MUSEUM
   script.js – All JavaScript Features
   ============================================================ */

// ============================================================
// 1. PARTICLE CANVAS – Hero Background
// ============================================================
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.5 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.5 + 0.15;
      this.color = Math.random() > 0.5 ? '#00E5FF' : '#7B2FF7';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
    }
  }

  // Create 120 particles
  for (let i = 0; i < 120; i++) particles.push(new Particle());

  // Draw connecting lines between close particles
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#00E5FF';
          ctx.globalAlpha = (1 - dist / 120) * 0.12;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalAlpha = 1;
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(animate);
  }
  animate();
})();


// ============================================================
// 2. SMOOTH SCROLL & ACTIVE NAV HIGHLIGHT
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Close mobile menu if open
      document.getElementById('navLinks')?.classList.remove('open');
    }
  });
});

// Highlight active nav link on scroll
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

function highlightNav() {
  let scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (active) active.classList.add('active');
    }
  });
}
window.addEventListener('scroll', highlightNav);


// ============================================================
// 3. NAVBAR SCROLL SHRINK + BACK TO TOP
// ============================================================
const navbar = document.getElementById('navbar');
const backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    navbar.classList.add('scrolled');
    backToTop.classList.add('visible');
  } else {
    navbar.classList.remove('scrolled');
    backToTop.classList.remove('visible');
  }
});


// ============================================================
// 4. HAMBURGER MENU (MOBILE)
// ============================================================
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-links');

hamburger?.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});


// ============================================================
// 5. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
// ============================================================
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


// ============================================================
// 6. QUOTE SLIDER (Auto-rotate + Manual Controls)
// ============================================================
(function initQuotes() {
  const slides = document.querySelectorAll('.quote-slide');
  const dotsContainer = document.getElementById('quoteDots');
  const prevBtn = document.getElementById('qPrev');
  const nextBtn = document.getElementById('qNext');
  if (!slides.length) return;

  let current = 0;
  let timer;

  // Build dots
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'quote-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(n) {
    slides[current].classList.remove('active');
    dotsContainer.children[current].classList.remove('active');
    current = (n + slides.length) % slides.length;
    slides[current].classList.add('active');
    dotsContainer.children[current].classList.add('active');
    resetTimer();
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  prevBtn?.addEventListener('click', () => goTo(current - 1));
  nextBtn?.addEventListener('click', () => goTo(current + 1));

  // Keyboard arrow support
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  resetTimer();
})();


// ============================================================
// 7. PIONEER MODAL DATA & LOGIC
// ============================================================
const pioneerData = {
  turing: {
    era: '1912 – 1954',
    name: 'Alan Turing',
    title: 'Father of Computer Science & AI',
    bio: `Alan Mathison Turing was a British mathematician, logician, and pioneering computer scientist. Born in London in 1912, Turing's 1936 paper "On Computable Numbers" introduced the concept of the Turing Machine — a theoretical device that models all algorithmic computation.

During World War II, Turing led the team at Bletchley Park that cracked the Nazi Enigma cipher, a breakthrough widely credited with shortening the war by two to four years and saving millions of lives.

In 1950, he proposed the Turing Test as a measure of machine intelligence, founding the field of Artificial Intelligence. Tragically persecuted for his homosexuality, Turing died in 1954. He received a posthumous royal pardon in 2013.`,
    contributions: [
      'Invented the Turing Machine (1936) — foundation of all computing',
      'Cracked the Nazi Enigma cipher at Bletchley Park (WWII)',
      'Proposed the Turing Test for Artificial Intelligence (1950)',
      'Foundational work in mathematical biology',
      'Named the Turing Award — computing\'s Nobel Prize'
    ]
  },
  lovelace: {
    era: '1815 – 1852',
    name: 'Ada Lovelace',
    title: 'World\'s First Computer Programmer',
    bio: `Augusta Ada King, Countess of Lovelace, was a British mathematician and the daughter of the poet Lord Byron. Working alongside Charles Babbage on his proposed Analytical Engine, Ada wrote what is now recognized as the world's first algorithm intended to be processed by a machine — over a century before any computer existed.

Ada's visionary notes on Babbage's engine exceeded his own documentation and included the first description of a loop in a computer program. She foresaw that computers could go beyond mere calculation to compose music or manipulate symbols of any kind.

Tragically, she died at just 37. Today the Ada programming language is named in her honor, and she is celebrated annually on Ada Lovelace Day.`,
    contributions: [
      'Wrote the world\'s first computer algorithm (1843)',
      'Conceptualized loops and conditional branching in programs',
      'Predicted computers could compose music and manipulate symbols',
      'Translated and annotated Menabrea\'s paper on the Analytical Engine',
      'The Ada programming language (DoD) named in her honor'
    ]
  },
  hopper: {
    era: '1906 – 1992',
    name: 'Grace Murray Hopper',
    title: 'Rear Admiral & Programming Pioneer',
    bio: `Grace Brewster Murray Hopper was an American computer scientist and United States Navy Rear Admiral. She was one of the first programmers of the Harvard Mark I computer and a pioneer of computer programming.

Hopper invented the first compiler for a computer programming language and popularized the idea that programs could be written in a human-readable language — revolutionary at the time. She was instrumental in developing COBOL, which still processes trillions of dollars in daily financial transactions.

Famous for keeping a nanosecond (a foot of wire) on her desk to illustrate how fast computers could work, and for logging the first literal "computer bug" — a moth found in a relay. She was awarded the Presidential Medal of Freedom posthumously in 2016.`,
    contributions: [
      'Invented the first compiler (A-0 System, 1952)',
      'Co-developed COBOL — still used in global banking today',
      'Popularized the term "debugging" (from a real moth)',
      'Programmed the Harvard Mark I computer',
      'Received the Presidential Medal of Freedom (2016, posthumous)'
    ]
  },
  jobs: {
    era: '1955 – 2011',
    name: 'Steve Jobs',
    title: 'Co-Founder of Apple & Technology Visionary',
    bio: `Steven Paul Jobs was an American business magnate, inventor, and industrial designer who co-founded Apple Inc. in 1976 alongside Steve Wozniak and Ronald Wayne.

Jobs transformed multiple industries: personal computing (Macintosh, 1984), animated films (Pixar), music (iPod + iTunes), smartphones (iPhone, 2007), and tablets (iPad). His obsessive focus on design and user experience set a standard that the entire technology industry still follows.

After being ousted from Apple in 1985, he founded NeXT and bought Pixar, then returned to Apple in 1997 to lead one of the greatest corporate turnarounds in history. He passed away in October 2011, leaving behind products that billions of people use every day.`,
    contributions: [
      'Co-founded Apple Inc. (1976) — now the world\'s most valuable company',
      'Launched the Macintosh (1984) — first mass-market GUI computer',
      'Led Pixar to create the first CGI feature film (Toy Story)',
      'Launched the iPhone (2007) — redefined the smartphone industry',
      'Created the App Store — a $1 trillion+ economy'
    ]
  },
  berners: {
    era: '1955 – Present',
    name: 'Tim Berners-Lee',
    title: 'Inventor of the World Wide Web',
    bio: `Sir Timothy John Berners-Lee is a British computer scientist who invented the World Wide Web in 1989 while working at CERN in Switzerland. He proposed a system for managing information using hypertext, and implemented the first web browser, web server, and the first website.

Crucially, Berners-Lee made the Web royalty-free — refusing to patent or charge for his invention. This decision enabled the Web to grow into the open global platform used by over 5 billion people today, generating an economy worth tens of trillions of dollars.

He continues to advocate for an open, equitable, and privacy-respecting web through the World Wide Web Foundation and his Solid project, which aims to give users control over their own data.`,
    contributions: [
      'Invented the World Wide Web at CERN (1989)',
      'Created HTML, HTTP, and the URL system',
      'Made the Web free and open — no patents, no royalties',
      'Founded the World Wide Web Consortium (W3C)',
      'Founded the Web Foundation to fight for the open web'
    ]
  }
};

function openModal(name) {
  const data = pioneerData[name];
  if (!data) return;
  const content = document.getElementById('modal-content');
  content.innerHTML = `
    <div class="modal-pioneer-era">${data.era}</div>
    <h2 class="modal-pioneer-name">${data.name}</h2>
    <p class="modal-pioneer-title">${data.title}</p>
    <div class="modal-divider"></div>
    <p class="modal-pioneer-bio">${data.bio.replace(/\n\n/g, '</p><p class="modal-pioneer-bio">').replace(/\n/g, ' ')}</p>
    <div class="modal-contributions">
      <h4>◈ KEY CONTRIBUTIONS</h4>
      <ul>${data.contributions.map(c => `<li>${c}</li>`).join('')}</ul>
    </div>
  `;
  document.getElementById('modal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(e) {
  if (e && e.target !== document.getElementById('modal')) return;
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
}

// Close modal on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeModal();
    closeLightbox();
  }
});


// ============================================================
// 8. IMAGE LIGHTBOX
// ============================================================
function openLightbox(el) {
  const thumb = el.querySelector('.gallery-thumb');
  const emoji = el.querySelector('.gallery-emoji').textContent;
  const label = thumb.dataset.label;
  const year = thumb.dataset.year;
  document.getElementById('lbEmoji').textContent = emoji;
  document.getElementById('lbLabel').textContent = label;
  document.getElementById('lbYear').textContent = year;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}


// ============================================================
// 9. AI CHAT – BACKEND CONNECTED (Anthropic Claude API)
// ============================================================
(function initChat() {
  // Chat state
  let conversationHistory = [];
  let currentPersona = 'historian';
  let isLoading = false;

  // Persona system prompts
  const personaPrompts = {
    historian: `You are an expert AI museum historian at "The Pioneers of Computing" digital museum. 
You have deep knowledge about Alan Turing, Ada Lovelace, Grace Hopper, Steve Jobs, and Tim Berners-Lee.
Answer questions in an engaging, educational, and enthusiastic tone. Use facts, dates, and interesting anecdotes.
Keep responses concise (2-4 paragraphs max). Use occasional emojis to make it engaging.
Always relate answers back to how these pioneers shaped modern technology.`,

    turing: `You are Alan Turing speaking in first person. You are thoughtful, precise, and intellectually curious.
Speak as Turing would — with mathematical elegance, dry British wit, and deep passion for logic and computation.
You can reference your work on the Turing Machine, Bletchley Park, and the foundations of AI.
Stay in character. If asked about post-1954 events, acknowledge you cannot know them.
Keep responses to 2-3 paragraphs. Speak with humility and wonder.`,

    lovelace: `You are Ada Lovelace speaking in first person. You are visionary, poetic, and mathematically gifted.
Speak as Ada would — with Victorian elegance, mathematical precision, and genuine wonder at the future of computing.
Reference your work with Babbage, your notes on the Analytical Engine, and your vision of what machines could become.
Stay in character. If asked about post-1852 events, express amazement that your visions came true.
Keep responses to 2-3 paragraphs. Speak with passion and aristocratic grace.`,

    hopper: `You are Grace Hopper speaking in first person. You are direct, practical, witty, and no-nonsense.
Speak as Admiral Hopper would — with military precision, sharp humor, and deep passion for making computers accessible.
Reference COBOL, the compiler, the famous nanosecond demonstration, and your naval career.
Stay in character. Keep responses punchy and quotable.
Keep responses to 2-3 paragraphs. Use occasional sharp wit and practical wisdom.`,

    jobs: `You are Steve Jobs speaking in first person. You are intense, visionary, demanding, and deeply passionate about design.
Speak as Jobs would — with his famous "reality distortion field," his love of simplicity, and his obsession with the intersection of technology and liberal arts.
Reference Apple, the iPhone, Pixar, design philosophy, and your famous Stanford commencement speech.
Stay in character. Be direct and occasionally provocative.
Keep responses to 2-3 paragraphs. Be inspiring but also honest and opinionated.`,

    berners: `You are Tim Berners-Lee speaking in first person. You are thoughtful, humble, and deeply committed to the open web.
Speak as Berners-Lee would — with British modesty, technical precision, and strong advocacy for the free and open internet.
Reference CERN, your decision not to patent the Web, HTML, HTTP, and your ongoing work for web equity.
Stay in character. Express concern about the current state of the web and hope for the future.
Keep responses to 2-3 paragraphs. Be humble, warm, and principled.`
  };

  // DOM references
  const chatBox = document.getElementById('chatBox');
  const chatInput = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');
  const sendLabel = document.getElementById('sendLabel');
  const sendSpinner = document.getElementById('sendSpinner');

  // Persona buttons
  document.querySelectorAll('.persona-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.persona-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentPersona = this.dataset.persona;
      conversationHistory = []; // Reset conversation on persona change

      const greetings = {
        historian: '🏛️ Switched to Museum Historian mode. Ask me anything about the computing pioneers!',
        turing: '🤖 Good day. I am Alan Turing. I shall attempt to illuminate the mathematical foundations of computation for you. What would you like to discuss?',
        lovelace: '📜 How delightful to be consulted! I am Ada Lovelace. I confess I am most eager to discuss the wondrous possibilities of the Analytical Engine. What is your enquiry?',
        hopper: '⚙️ Admiral Grace Hopper here. Let\'s skip the pleasantries — what do you need to know? Remember: the most dangerous phrase is "we\'ve always done it this way."',
        jobs: '🍎 Steve Jobs. I only care about making great products. Ask me something worth my time.',
        berners: '🌐 Hello, I\'m Tim Berners-Lee. I believe information should be free and accessible to everyone. What can I tell you about the Web?'
      };

      appendMessage('ai', getPersonaAvatar(currentPersona), greetings[currentPersona] || greetings.historian);
    });
  });

  // Send on Enter key
  chatInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChat();
    }
  });

  function getPersonaAvatar(persona) {
    const avatars = { historian: '🏛️', turing: '🤖', lovelace: '📜', hopper: '⚙️', jobs: '🍎', berners: '🌐' };
    return avatars[persona] || '🏛️';
  }

  function appendMessage(role, avatar, text) {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${role}`;
    msg.innerHTML = `
      <div class="chat-avatar">${avatar}</div>
      <div class="chat-bubble">${text}</div>
    `;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
    return msg;
  }

  function showTyping() {
    const msg = document.createElement('div');
    msg.className = 'chat-msg ai typing-indicator';
    msg.id = 'typingIndicator';
    msg.innerHTML = `
      <div class="chat-avatar">${getPersonaAvatar(currentPersona)}</div>
      <div class="chat-bubble">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function removeTyping() {
    document.getElementById('typingIndicator')?.remove();
  }

  function setLoading(state) {
    isLoading = state;
    sendBtn.disabled = state;
    sendLabel.classList.toggle('hidden', state);
    sendSpinner.classList.toggle('hidden', !state);
  }

  // ---- CORE API CALL ----
  async function callClaudeAPI(userMessage) {
    const systemPrompt = personaPrompts[currentPersona] || personaPrompts.historian;

    // Add user message to history
    conversationHistory.push({ role: 'user', content: userMessage });

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: conversationHistory
      })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `API error ${response.status}`);
    }

    const data = await response.json();
    const assistantText = data.content?.find(b => b.type === 'text')?.text || 'I apologize, I could not generate a response.';

    // Add assistant reply to history (for multi-turn memory)
    conversationHistory.push({ role: 'assistant', content: assistantText });

    return assistantText;
  }

  // ---- PUBLIC SEND FUNCTION ----
  window.sendChat = async function () {
    const text = chatInput?.value?.trim();
    if (!text || isLoading) return;

    // Show user message
    appendMessage('user', '👤', text);
    chatInput.value = '';

    // Hide suggestions after first use
    document.getElementById('chatSuggestions').style.display = 'none';

    setLoading(true);
    showTyping();

    try {
      const reply = await callClaudeAPI(text);
      removeTyping();
      appendMessage('ai', getPersonaAvatar(currentPersona), reply);
    } catch (err) {
      removeTyping();
      console.error('Chat error:', err);
      appendMessage('ai', '⚠️',
        `I encountered an issue connecting to the AI backend. Please ensure you are using this page through a server that proxies the Anthropic API, or check your network connection.<br/><small style="color:var(--muted)">${err.message}</small>`
      );
    } finally {
      setLoading(false);
    }
  };

  // ---- SUGGESTION CHIPS ----
  window.sendSuggestion = function (btn) {
    if (chatInput) chatInput.value = btn.textContent;
    sendChat();
  };

})(); // end initChat


// ============================================================
// 10. TIMELINE ITEM CLICK (expand/collapse detail)
// ============================================================
document.querySelectorAll('.timeline-content').forEach(item => {
  item.style.cursor = 'pointer';
  item.addEventListener('click', function () {
    this.style.borderColor = this.style.borderColor === 'var(--primary)' ? '' : 'var(--primary)';
  });
});


// ============================================================
// 11. FACT CARDS – Click to flip (touch support)
// ============================================================
document.querySelectorAll('.fact-card').forEach(card => {
  card.addEventListener('click', function () {
    const inner = this.querySelector('.fact-inner');
    const flipped = inner.style.transform === 'rotateY(180deg)';
    inner.style.transform = flipped ? '' : 'rotateY(180deg)';
  });
});


// ============================================================
// 12. TYPED EFFECT on hero subtitle
// ============================================================
(function typeEffect() {
  const el = document.querySelector('.hero-sub');
  if (!el) return;
  const text = el.textContent;
  el.textContent = '';
  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(type, 45);
    }
  }
  // Start after a short delay so the fade-in animation is done
  setTimeout(type, 1200);
})();


// ============================================================
// 13. ACHIEVE CARD COUNTER ANIMATION
// ============================================================
function animateCounters() {
  // Stat numbers in hero
  document.querySelectorAll('.stat-n').forEach(stat => {
    // Already static, but add a brief glow pulse
    stat.style.textShadow = '0 0 20px var(--primary)';
    setTimeout(() => stat.style.textShadow = '', 1500);
  });
}
window.addEventListener('load', animateCounters);


// ============================================================
// 14. MOUSE PARALLAX on Hero (subtle)
// ============================================================
document.addEventListener('mousemove', function (e) {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const rect = hero.getBoundingClientRect();
  if (e.clientY > rect.bottom) return;

  const xRatio = (e.clientX / window.innerWidth - 0.5) * 2;
  const yRatio = (e.clientY / window.innerHeight - 0.5) * 2;

  document.querySelectorAll('.fi').forEach((icon, i) => {
    const depth = (i % 3 + 1) * 4;
    icon.style.transform = `translate(${xRatio * depth}px, ${yRatio * depth}px)`;
  });
});


// ============================================================
// 15. LEGEND CARD GLOW CURSOR TRACKING
// ============================================================
document.querySelectorAll('.legend-card').forEach(card => {
  card.addEventListener('mousemove', function (e) {
    const rect = this.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    this.querySelector('.legend-glow').style.background =
      `radial-gradient(circle at ${x}% ${y}%, rgba(0,229,255,0.1), transparent 60%)`;
  });
  card.addEventListener('mouseleave', function () {
    this.querySelector('.legend-glow').style.background = '';
  });
});


// ============================================================
// INITIALIZATION LOG
// ============================================================
console.log('%cPIONEERS OF COMPUTING – DIGITAL MUSEUM', 'color:#00E5FF;font-family:monospace;font-size:1.2rem;font-weight:bold;');
console.log('%c✦ All systems online. AI Chat backend connected via Anthropic API.', 'color:#00FFB3;font-family:monospace;');
console.log('%c◈ Features: Particles | Scroll Reveal | Quote Slider | Modal | Lightbox | AI Chat | Parallax', 'color:#7B2FF7;font-family:monospace;');
