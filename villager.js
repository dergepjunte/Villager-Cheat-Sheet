const elem = document.querySelector('.hover-text');
const originalText = elem.textContent;
const hoverText = 'Back to Main Page';

elem.style.transition = 'opacity 0.2s';
elem.style.opacity = 1;

elem.addEventListener('mouseenter', () => {
    elem.style.opacity = 0;
    setTimeout(() => {
    elem.textContent = hoverText;
    elem.style.opacity = 1;
    }, 200);
});

elem.addEventListener('mouseleave', () => {
    elem.style.opacity = 0;
    setTimeout(() => {
    elem.textContent = originalText;
    elem.style.opacity = 1;
    }, 200);
});


if (!localStorage.getItem("besucht")) {
    if (localStorage.getItem('cookiesAccepted') === 'true') {
    localStorage.setItem("besucht", "true");
    }

    const subtext = document.createElement('span');
    subtext.className = 'subtext';
    subtext.textContent = 'Hover or click me (Villager Name) to go to Main Page';
    const container = document.querySelector('.hover-container');
    container.appendChild(subtext);

    setTimeout(() => {
        subtext.classList.add('fade');
    }, 10000);
}
