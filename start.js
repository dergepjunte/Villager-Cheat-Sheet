
document.addEventListener('DOMContentLoaded', () => {
    // ── Cookie Banner ──────────────────────────────────────────────
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');

    if (!localStorage.getItem('cookiesAccepted')) {
        banner.classList.remove('hidden');
    }

    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        banner.classList.add('hidden');
    });

    const declineBtn = document.getElementById('decline-cookies');
    declineBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'false');
        banner.classList.add('hidden');
    });

    // ── Card Stack + Sidebar + Search (mobile only) ────────────────
    const content = document.querySelector('.content');
    const sidebar = document.getElementById('mobileSidebar');
    if (!content || !sidebar) return;

    const allCards = Array.from(content.querySelectorAll('a.link'));
    const sidebarItems = Array.from(sidebar.querySelectorAll('.sidebar-item'));
    const searchInput = document.getElementById('villagerSearch');

    let visibleCards = [...allCards];
    let snapObserver = null;

    const isStackMode = () => window.innerWidth <= 768;

    function updateSidebar(activeCard) {
        sidebarItems.forEach(item => {
            const globalIdx = parseInt(item.dataset.target);
            item.classList.toggle('active', allCards[globalIdx] === activeCard);
            item.style.opacity = visibleCards.includes(allCards[globalIdx]) ? '' : '0.2';
        });
    }

    function scrollToCard(card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function initStack() {
        content.classList.add('stack-mode');

        allCards.forEach(card => {
            card.style.display = visibleCards.includes(card) ? '' : 'none';
        });

        if (visibleCards.length === 0) {
            content.setAttribute('data-empty', '');
        } else {
            content.removeAttribute('data-empty');
            content.scrollTop = 0;
        }

        if (snapObserver) snapObserver.disconnect();
        snapObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    updateSidebar(entry.target);
                }
            });
        }, { threshold: 0.5, root: content });

        visibleCards.forEach(card => snapObserver.observe(card));
        if (visibleCards[0]) updateSidebar(visibleCards[0]);
    }

    function destroyStack() {
        content.classList.remove('stack-mode');
        content.removeAttribute('data-empty');
        if (snapObserver) { snapObserver.disconnect(); snapObserver = null; }
        allCards.forEach(card => { card.style.display = ''; });
        sidebarItems.forEach(item => { item.style.opacity = ''; item.classList.remove('active'); });
    }

    // ── Sidebar touch drag ─────────────────────────────────────────
    let lastSidebarTarget = -1;

    function applyTouchTarget(clientY) {
        for (const item of sidebarItems) {
            const rect = item.getBoundingClientRect();
            if (clientY >= rect.top && clientY <= rect.bottom) {
                const globalIdx = parseInt(item.dataset.target);
                if (globalIdx !== lastSidebarTarget) {
                    lastSidebarTarget = globalIdx;
                    const card = allCards[globalIdx];
                    if (visibleCards.includes(card)) {
                        scrollToCard(card);
                        if (navigator.vibrate) navigator.vibrate(8);
                    }
                }
                return;
            }
        }
    }

    sidebar.addEventListener('touchstart', e => {
        lastSidebarTarget = -1;
        applyTouchTarget(e.touches[0].clientY);
        e.preventDefault();
    }, { passive: false });

    sidebar.addEventListener('touchmove', e => {
        applyTouchTarget(e.touches[0].clientY);
        e.preventDefault();
    }, { passive: false });

    sidebar.addEventListener('click', e => {
        const item = e.target.closest('.sidebar-item');
        if (!item) return;
        const card = allCards[parseInt(item.dataset.target)];
        if (visibleCards.includes(card)) scrollToCard(card);
    });

    // ── Search ──────────────────────────────────────────────────────
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const q = searchInput.value.toLowerCase().trim();
            visibleCards = q
                ? allCards.filter(c => {
                    const name = (c.querySelector('span')?.textContent || '').toLowerCase();
                    return name.includes(q);
                })
                : [...allCards];

            if (isStackMode()) {
                initStack();
            } else {
                allCards.forEach(c => {
                    c.style.display = visibleCards.includes(c) ? '' : 'none';
                });
            }
        });
    }

    // ── Init / resize ───────────────────────────────────────────────
    if (isStackMode()) initStack();
    else destroyStack();

    window.addEventListener('resize', () => {
        if (isStackMode()) initStack();
        else destroyStack();
    });
});
