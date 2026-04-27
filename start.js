
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

    let activeIdx = 0;
    let visibleCards = [...allCards];

    const isStackMode = () => window.innerWidth <= 768;

    function applyStack() {
        allCards.forEach(card => {
            const vi = visibleCards.indexOf(card);
            if (vi === -1) {
                card.style.display = 'none';
                card.removeAttribute('data-stack');
                return;
            }
            card.style.display = '';
            const diff = vi - activeIdx;
            if (diff < 0) {
                card.setAttribute('data-stack', 'prev');
            } else if (diff <= 3) {
                card.setAttribute('data-stack', String(diff));
            } else {
                card.setAttribute('data-stack', 'hidden');
            }
        });

        const activeCard = visibleCards[activeIdx];
        sidebarItems.forEach(item => {
            const globalIdx = parseInt(item.dataset.target);
            item.classList.toggle('active', allCards[globalIdx] === activeCard);
            item.style.opacity = visibleCards.includes(allCards[globalIdx]) ? '' : '0.2';
        });

        if (visibleCards.length === 0) {
            content.setAttribute('data-empty', '');
        } else {
            content.removeAttribute('data-empty');
        }
    }

    function setActive(newIdx) {
        activeIdx = Math.max(0, Math.min(newIdx, visibleCards.length - 1));
        applyStack();
    }

    function initStack() {
        content.classList.add('stack-mode');
        setActive(activeIdx);
    }

    function destroyStack() {
        content.classList.remove('stack-mode');
        content.removeAttribute('data-empty');
        allCards.forEach(card => {
            card.removeAttribute('data-stack');
            card.style.display = '';
        });
        sidebarItems.forEach(item => { item.style.opacity = ''; });
    }

    // Tap on non-active card → bring to front, don't navigate
    allCards.forEach(card => {
        card.addEventListener('click', e => {
            if (!isStackMode()) return;
            if (card.getAttribute('data-stack') !== '0') {
                e.preventDefault();
                const vi = visibleCards.indexOf(card);
                if (vi >= 0) setActive(vi);
            }
        });
    });

    // ── Sidebar touch drag ─────────────────────────────────────────
    let lastSidebarTarget = -1;

    function applyTouchTarget(clientY) {
        for (const item of sidebarItems) {
            const rect = item.getBoundingClientRect();
            if (clientY >= rect.top && clientY <= rect.bottom) {
                const globalIdx = parseInt(item.dataset.target);
                if (globalIdx !== lastSidebarTarget) {
                    lastSidebarTarget = globalIdx;
                    const vi = visibleCards.indexOf(allCards[globalIdx]);
                    if (vi >= 0) {
                        setActive(vi);
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
        const globalIdx = parseInt(item.dataset.target);
        const vi = visibleCards.indexOf(allCards[globalIdx]);
        if (vi >= 0) setActive(vi);
    });

    // ── Swipe on card stack ─────────────────────────────────────────
    let swipeStartY = 0;
    let swipeStartX = 0;

    content.addEventListener('touchstart', e => {
        swipeStartY = e.touches[0].clientY;
        swipeStartX = e.touches[0].clientX;
    }, { passive: true });

    content.addEventListener('touchend', e => {
        if (!isStackMode()) return;
        const dy = swipeStartY - e.changedTouches[0].clientY;
        const dx = Math.abs(swipeStartX - e.changedTouches[0].clientX);
        if (Math.abs(dy) > 45 && dx < 80) {
            setActive(activeIdx + (dy > 0 ? 1 : -1));
        }
    }, { passive: true });

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
                setActive(0);
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
