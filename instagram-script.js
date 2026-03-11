/* ═══════════════════════════════════════════════════════════════
   Instagram SAA — Interactive Script
   - Reading progress bar
   - Scroll reveal animations
   - Counter animation for stats
   - Accordion expand/collapse
   - Stepper navigation (prev/next)
   - Tab switching
   - Checklist animation
   - Modal + PDF download
   ═══════════════════════════════════════════════════════════════ */

const PDF_FILE = 'Presentation-Instagram-SAA.pdf';

document.addEventListener('DOMContentLoaded', () => {
    initProgressBar();
    initScrollReveal();
    initWordReveal();
    initAccordions();
    initChecklistReveal();
    initParallaxGlows();
    initSmoothScroll();
    initCounterAnimation();
});

// ─── Reading Progress Bar ───
function initProgressBar() {
    const bar = document.getElementById('progress-bar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        bar.style.width = scrolled + '%';
    }, { passive: true });
}

// ─── Scroll Reveal ───
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.delay || 0;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

// ─── Word-by-Word Reveal ───
function initWordReveal() {
    const headings = document.querySelectorAll('h1, .section-header h2, .cta-content h2');

    headings.forEach(heading => {
        if (heading.dataset.wordsProcessed) return;
        heading.dataset.wordsProcessed = 'true';

        const html = heading.innerHTML;
        // Split on gradient-text spans first (preserve them as single blocks)
        // Then split remaining on HTML tags
        const gradientRegex = /(<span class="gradient-text">.*?<\/span>)/gi;
        const parts = html.split(gradientRegex);
        let wordIndex = 0;
        let newHtml = '';

        parts.forEach(part => {
            if (!part) return;
            // If it's a gradient-text span, wrap the whole thing as one word
            if (part.match(gradientRegex)) {
                newHtml += `<span class="word" style="transition-delay: ${wordIndex * 0.04}s">${part}</span>`;
                wordIndex++;
            } else {
                // Process normal text: split on tags
                const tokens = part.split(/(<[^>]+>)/g);
                tokens.forEach(token => {
                    if (!token) return;
                    if (token.startsWith('<')) {
                        newHtml += token;
                    } else {
                        const words = token.split(/(\s+)/);
                        words.forEach(word => {
                            if (word.trim() === '') {
                                newHtml += word;
                            } else {
                                newHtml += `<span class="word" style="transition-delay: ${wordIndex * 0.04}s">${word}</span>`;
                                wordIndex++;
                            }
                        });
                    }
                });
            }
        });

        heading.innerHTML = newHtml;
        heading.classList.add('reveal-words');
    });

    const wordObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                wordObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -30px 0px'
    });

    document.querySelectorAll('.reveal-words').forEach(el => wordObserver.observe(el));
}

// ─── Counter Animation for Stats ───
function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                const suffix = el.dataset.suffix || '';
                let current = 0;
                const increment = target / 40;
                const duration = 1200;
                const stepTime = duration / 40;

                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = Math.round(current) + suffix;
                }, stepTime);

                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
}

// ─── Accordions ───
function initAccordions() {
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const accordion = trigger.closest('.accordion');
            const wasOpen = accordion.classList.contains('open');

            // Optionally close other accordions in same section
            // const section = accordion.closest('.section');
            // section.querySelectorAll('.accordion.open').forEach(a => a.classList.remove('open'));

            if (wasOpen) {
                accordion.classList.remove('open');
                trigger.setAttribute('aria-expanded', 'false');
            } else {
                accordion.classList.add('open');
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

// ─── Stepper Navigation ───
let currentStep = 0;

function goToStep(stepIndex) {
    const panels = document.querySelectorAll('.stepper-panel');
    const buttons = document.querySelectorAll('.stepper-btn');
    const fill = document.getElementById('stepper-fill');

    if (stepIndex < 0 || stepIndex >= panels.length) return;

    // Hide current
    panels.forEach(p => p.classList.remove('active'));
    buttons.forEach(b => {
        b.classList.remove('active');
    });

    // Mark completed steps
    buttons.forEach((b, i) => {
        if (i < stepIndex) {
            b.classList.add('completed');
        } else {
            b.classList.remove('completed');
        }
    });

    // Show target
    panels[stepIndex].classList.add('active');
    buttons[stepIndex].classList.add('active');

    // Progress fill
    if (fill) {
        const pct = ((stepIndex + 1) / panels.length) * 100;
        fill.style.width = pct + '%';
    }

    currentStep = stepIndex;

    // Scroll the stepper into view smoothly
    const stepper = document.querySelector('.stepper');
    if (stepper) {
        const rect = stepper.getBoundingClientRect();
        if (rect.top < 80 || rect.top > window.innerHeight * 0.5) {
            stepper.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// ─── Tab Switching ───
function switchTab(tabIndex) {
    const panels = document.querySelectorAll('.tab-panel');
    const buttons = document.querySelectorAll('.tab-btn');

    if (tabIndex < 0 || tabIndex >= panels.length) return;

    panels.forEach(p => p.classList.remove('active'));
    buttons.forEach(b => b.classList.remove('active'));

    panels[tabIndex].classList.add('active');
    buttons[tabIndex].classList.add('active');
}

// ─── Checklist Reveal & Auto-check ───
function initChecklistReveal() {
    const items = document.querySelectorAll('.checklist li');

    const checklistObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const idx = Array.from(items).indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    setTimeout(() => {
                        entry.target.classList.add('checked');
                    }, 400);
                }, idx * 200);
                checklistObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -30px 0px'
    });

    items.forEach(item => checklistObserver.observe(item));
}

// ─── Parallax Glow ───
function initParallaxGlows() {
    const glows = document.querySelectorAll('.hero-glow, .conclusion-glow');

    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 20;
        const y = (e.clientY / window.innerHeight - 0.5) * 20;

        glows.forEach(glow => {
            const rect = glow.parentElement.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                glow.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
            }
        });
    });
}

// ─── Smooth Scroll ───
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ─── Modal ───
const overlay = document.getElementById('modal-overlay');

function openModal() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    document.getElementById('download-form').style.display = '';
    document.getElementById('modal-success').style.display = 'none';
    document.getElementById('download-form').reset();
}

function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

function closeModalOutside(e) {
    if (e.target === overlay) {
        closeModal();
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// ─── Form Submit ───
function handleSubmit(e) {
    e.preventDefault();

    const prenom = document.getElementById('prenom').value.trim();
    const nom = document.getElementById('nom').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!prenom || !nom || !email) return;

    const payload = JSON.stringify({ prenom, nom, email });

    // Try Vercel proxy first, fallback to direct webhook
    fetch('/api/leads-instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload
    }).then(res => {
        if (!res.ok) throw new Error('Proxy failed');
    }).catch(() => {
        // Fallback: call webhook directly (local dev)
        fetch('https://n8n.srv862127.hstgr.cloud/webhook/stock_leads_magnet', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'leads.magnet': 'leads.magnet.02'
            },
            body: payload
        }).catch(err => console.warn('Webhook fallback error:', err));
    });

    triggerDownload(PDF_FILE, 'Presentation-Instagram-SAA.pdf');

    document.getElementById('download-form').style.display = 'none';
    document.getElementById('modal-success').style.display = 'block';

    setTimeout(() => { closeModal(); }, 4000);
}

function triggerDownload(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
