const elem = document.querySelector('.hover-text');
const originalText = elem.textContent;
const hoverText = 'Back to Main Page';

elem.style.transition = 'opacity 0.2s';
elem.style.opacity = 1;

function showHoverText() {
    elem.style.opacity = 0;
    setTimeout(() => {
        elem.textContent = hoverText;
        elem.style.opacity = 1;
    }, 200);
}

function showOriginalText() {
    elem.style.opacity = 0;
    setTimeout(() => {
        elem.textContent = originalText;
        elem.style.opacity = 1;
    }, 200);
}

elem.addEventListener('mouseenter', showHoverText);
elem.addEventListener('mouseleave', showOriginalText);
elem.addEventListener('touchstart', showHoverText, { passive: true });
elem.addEventListener('touchend', () => {
    setTimeout(showOriginalText, 600);
}, { passive: true });


if (!localStorage.getItem("besucht")) {
    if (localStorage.getItem('cookiesAccepted') === 'true') {
    localStorage.setItem("besucht", "true");
    }

    const subtext = document.createElement('span');
    subtext.className = 'subtext';
    const isTouchDevice = navigator.maxTouchPoints > 0;
    subtext.textContent = isTouchDevice
        ? 'Tap me (Villager Name) to go to Main Page'
        : 'Hover or click me (Villager Name) to go to Main Page';
    const container = document.querySelector('.hover-container');
    container.appendChild(subtext);

    setTimeout(() => {
        subtext.classList.add('fade');
    }, 10000);
}
