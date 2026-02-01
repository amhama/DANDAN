function createHearts() {
    const container = document.getElementById('heartsContainer');
    const hearts = ['❤️', '💖', '💕', '💗', '💓', '💞', '💝', '💘'];
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDelay = Math.random() * 15 + 's';
        heart.style.fontSize = (Math.random() * 30 + 15) + 'px';
        container.appendChild(heart);
    }
}

function initBook() {
    const flipbook = $('#flipbook');
    const pageSound = document.getElementById('pageTurnSound');
    const bgMusic = document.getElementById('backgroundMusic'); // Make sure this ID exists in HTML!
    const musicToggle = document.getElementById('musicToggle');
    const pageCounter = document.getElementById('pageCounter');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const totalPages = $('#flipbook .page').length;
    const clickSound = document.getElementById('musicClickSound'); // Added here

    let isMusicPlaying = false;

    flipbook.turn({
        width: flipbook.width(),
        height: flipbook.height(),
        autoCenter: true,
        display: 'double',
        acceleration: true,
        gradients: true,
        duration: 800,
        pages: totalPages,
        when: {
            turning: function (e, page, view) {
                playPageSound(); 
            },
            turned: function (e, page) {
                pageCounter.textContent = `Page ${page} of ${totalPages}`;
            }
        }
    });
    
    prevBtn.addEventListener('click', () => flipbook.turn('previous'));
    nextBtn.addEventListener('click', () => flipbook.turn('next'));

    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') flipbook.turn('previous');
        if (e.key === 'ArrowRight') flipbook.turn('next');
        if (e.key === 'Home') flipbook.turn('page', 1);
        if (e.key === 'End') flipbook.turn('page', totalPages);
    });

    $('#flipbook .page').on('click', function (e) {
        const w = $(this).width();
        const x = e.offsetX;
        if (x > w * 0.66) flipbook.turn('next');
        else if (x < w * 0.33) flipbook.turn('previous');
    });

    let startX = 0, startY = 0;
    flipbook.on('touchstart', e => {
        const t = e.originalEvent.touches[0];
        startX = t.clientX;
        startY = t.clientY;
    });
    flipbook.on('touchend', e => {
        const t = e.originalEvent.changedTouches[0];
        const dx = startX - t.clientX;
        const dy = startY - t.clientY;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
            if (dx > 0) flipbook.turn('next');
            else flipbook.turn('previous');
        }
    });

    // COMBINED MUSIC TOGGLE EVENT LISTENER
    musicToggle.addEventListener('click', () => {
        // Play click sound
        if (clickSound) {
            clickSound.currentTime = 0; // Changed from 1.5 to start from beginning
            clickSound.volume = 0.5;
            clickSound.play().catch(() => { });
        }

        // Toggle background music
        if (isMusicPlaying) {
            bgMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            bgMusic.volume = 0.3;
            bgMusic.play().then(() => {
                musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
            }).catch(e => {
                console.log('Music play failed:', e);
                // If auto-play fails, change icon back
                musicToggle.innerHTML = '<i class="fas fa-play"></i>';
                isMusicPlaying = false;
            });
        }
        isMusicPlaying = !isMusicPlaying;
    });

    document.addEventListener('click', function initMusic() {
        if (!isMusicPlaying) {
            bgMusic.volume = 0.2;
            bgMusic.play().then(() => {
                isMusicPlaying = true;
                musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
            }).catch(() => { });
        }
        document.removeEventListener('click', initMusic);
    }, { once: true });

    pageCounter.textContent = `Page 1 of ${totalPages}`;

    function playPageSound() {
        if (pageSound) {
            pageSound.currentTime = 1.5; 
            pageSound.play().catch(() => { }); 
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    createHearts();
    initBook();
    console.log('❤️ Book ready! ❤️');
});