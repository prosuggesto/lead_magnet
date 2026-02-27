/* ═══════════════════════════════════════════════════════════════
   Guide Agentique — Script
   - Enhanced scroll reveal animations
   - Word-by-word text reveal
   - Modal open/close
   - PDF download on form submit
   ═══════════════════════════════════════════════════════════════ */

// ─── Config ───
const PDF_FILE = 'Formation-Complete.pdf';

// ─── Scroll Reveal (IntersectionObserver) ───
document.addEventListener('DOMContentLoaded', () => {

    // 1. Standard fade-in reveals
    const revealElements = document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right');

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

    // 2. Word-by-word reveal for headings
    initWordReveal();

    // 3. Stagger animation for phase topics
    initStaggerReveal();

    // 4. Parallax glows on mouse move
    initParallaxGlows();
});

// ─── Word-by-Word Reveal ───
function initWordReveal() {
    const headings = document.querySelectorAll('h1, .section-header h2, .cta-content h2');

    headings.forEach(heading => {
        if (heading.dataset.wordsProcessed) return;
        heading.dataset.wordsProcessed = 'true';

        const html = heading.innerHTML;
        // Split into HTML tags and text segments using regex
        // This keeps tags intact and only wraps text words
        const tokens = html.split(/(<[^>]+>)/g);
        let wordIndex = 0;
        let newHtml = '';

        tokens.forEach(token => {
            if (!token) return;

            // If it's an HTML tag, pass through unchanged
            if (token.startsWith('<')) {
                newHtml += token;
            } else {
                // It's text - split by whitespace and wrap each word
                const words = token.split(/(\s+)/);
                words.forEach(word => {
                    if (word.trim() === '') {
                        newHtml += word; // Preserve whitespace
                    } else {
                        newHtml += `<span class="word" style="transition-delay: ${wordIndex * 0.04}s">${word}</span>`;
                        wordIndex++;
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

// ─── Stagger Reveal for Lists ───
function initStaggerReveal() {
    const lists = document.querySelectorAll('.phase-topics, .themes-grid');

    lists.forEach(list => {
        const items = list.children;
        Array.from(items).forEach((item, i) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`;
        });
    });

    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.children;
                Array.from(items).forEach(item => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                });
                staggerObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    });

    lists.forEach(list => staggerObserver.observe(list));
}

// ─── Parallax Glow on Mouse Move ───
function initParallaxGlows() {
    const glows = document.querySelectorAll('.hero-glow, .coaching-glow, .cta-glow');

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

// ─── Modal ───
const overlay = document.getElementById('modal-overlay');

function openModal() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Reset to form view
    document.getElementById('download-form').style.display = '';
    document.getElementById('modal-success').style.display = 'none';
    // Reset form
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

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});

// ─── Form Submit → Webhook + Download PDF ───
function handleSubmit(e) {
    e.preventDefault();

    const prenom = document.getElementById('prenom').value.trim();
    const nom = document.getElementById('nom').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!prenom || !nom || !email) return;

    // Send data to webhook
    fetch('https://n8n.srv862127.hstgr.cloud/webhook/stock_leads_magnet', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'leads.magnet': 'leads.magnet.01'
        },
        body: JSON.stringify({ prenom, nom, email })
    }).catch(err => console.warn('Webhook error:', err));

    // Trigger the actual PDF download
    triggerDownload(PDF_FILE, 'Formation-Complete.pdf');

    // Show success state
    document.getElementById('download-form').style.display = 'none';
    document.getElementById('modal-success').style.display = 'block';

    // Auto close after 4s
    setTimeout(() => {
        closeModal();
    }, 4000);
}

// ─── Download Helper ───
function triggerDownload(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
