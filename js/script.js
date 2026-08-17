/* ==========================================================================
   LOGICA Y ANIMACIONES - BAJO LA MISMA LUNA
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initSkyCanvas();
    initSecretMessage();
    initAudioSystem();
});

/* 1. Cielo Nocturno (Estrellas, Parpadeo y Estrellas Fugaces) */
function initSkyCanvas() {
    const canvas = document.getElementById('sky-canvas');
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        createStars();
    });

    const stars = [];
    const starCount = Math.floor((width * height) / 3000); // Adaptativo a pantalla

    function createStars() {
        stars.length = 0;
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.4 + 0.3,
                alpha: Math.random(),
                speed: Math.random() * 0.015 + 0.005,
                increasing: Math.random() > 0.5
            });
        }
    }

    createStars();

    // Estrella fugaz
    let shootingStar = null;

    function spawnShootingStar() {
        shootingStar = {
            x: Math.random() * width * 0.8,
            y: Math.random() * height * 0.4,
            length: Math.random() * 80 + 40,
            speed: Math.random() * 10 + 6,
            angle: Math.PI / 4, // 45 grados
            alpha: 1
        };
        // Siguiente estrella fugaz entre 4 y 9 segundos
        setTimeout(spawnShootingStar, Math.random() * 5000 + 4000);
    }

    setTimeout(spawnShootingStar, 2000);

    function animate() {
        // Fondo con gradiente nocturno profundo
        const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
        bgGradient.addColorStop(0, '#050714');
        bgGradient.addColorStop(0.5, '#0a0e27');
        bgGradient.addColorStop(1, '#141028');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);

        // Dibujar estrellas
        ctx.fillStyle = '#ffffff';
        stars.forEach(star => {
            // Animación parpadeo
            if (star.increasing) {
                star.alpha += star.speed;
                if (star.alpha >= 1) star.increasing = false;
            } else {
                star.alpha -= star.speed;
                if (star.alpha <= 0.2) star.increasing = true;
            }

            ctx.globalAlpha = star.alpha;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        // Dibujar estrella fugaz
        if (shootingStar) {
            ctx.globalAlpha = shootingStar.alpha;
            const tailX = shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length;
            const tailY = shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length;

            const grad = ctx.createLinearGradient(shootingStar.x, shootingStar.y, tailX, tailY);
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(shootingStar.x, shootingStar.y);
            ctx.lineTo(tailX, tailY);
            ctx.stroke();

            shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
            shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
            shootingStar.alpha -= 0.015;

            if (shootingStar.alpha <= 0) {
                shootingStar = null;
            }
        }

        ctx.globalAlpha = 1;
        requestAnimationFrame(animate);
    }

    animate();
}

/* 2. Desplegar Mensaje Oculto */
function initSecretMessage() {
    const btn = document.getElementById('toggle-secret-btn');
    const content = document.getElementById('secret-content');

    if (btn && content) {
        btn.addEventListener('click', () => {
            content.classList.toggle('open');
            if (content.classList.contains('open')) {
                btn.innerHTML = '<span class="heart-icon">♡</span> Ocultar mensaje';
            } else {
                btn.innerHTML = '<span class="heart-icon">♡</span> Toca para descubrir algo más';
            }
        });
    }
}

/* 3. Reproductor y Sistema de Audio (YouTube API) */
let ytPlayer = null;
let isPlaying = false;

function onYouTubeIframeAPIReady() {
    ytPlayer = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: '2Vv-BfVoq4g', // All of Me - John Legend Official
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'loop': 1,
            'playlist': '2Vv-BfVoq4g'
        },
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerStateChange(event) {
    const disc = document.getElementById('music-disc');
    const playIcon = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');

    if (event.data === YT.PlayerState.PLAYING) {
        isPlaying = true;
        if (disc) disc.classList.add('playing');
        if (playIcon) playIcon.classList.add('hidden');
        if (pauseIcon) pauseIcon.classList.remove('hidden');
    } else {
        isPlaying = false;
        if (disc) disc.classList.remove('playing');
        if (playIcon) playIcon.classList.remove('hidden');
        if (pauseIcon) pauseIcon.classList.add('hidden');
    }
}

function initAudioSystem() {
    const startBtn = document.getElementById('start-btn');
    const overlay = document.getElementById('audio-overlay');
    const toggleBtn = document.getElementById('audio-toggle-btn');

    if (startBtn && overlay) {
        startBtn.addEventListener('click', () => {
            overlay.classList.add('fade-out');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 800);

            if (ytPlayer && typeof ytPlayer.playVideo === 'function') {
                ytPlayer.playVideo();
            }
        });
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            if (!ytPlayer || typeof ytPlayer.playVideo !== 'function') return;

            if (isPlaying) {
                ytPlayer.pauseVideo();
            } else {
                ytPlayer.playVideo();
            }
        });
    }
}
