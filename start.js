
document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');

    // Prüfen, ob Cookies schon akzeptiert wurden
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
});
