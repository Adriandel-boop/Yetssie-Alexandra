document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // RENDERIZADO DEL FONDO DE ESTRELLAS Y LUNA MEDIANTE CANVAS HTML5
    // -------------------------------------------------------------
    const canvas = document.getElementById('sky-canvas');
    const ctx = canvas.getContext('2d');
    let w, h;

    function resizeCanvas() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Crear Estrellas Parpadeantes
    const starsCount = 180;
    const stars = Array.from({ length: starsCount }, () => ({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 2 + 0.5,
        alpha: Math.random(),
        speed: Math.random() * 0.015 + 0.005
    }));

    let glowTimer = 0;

    function drawNightSky() {
        // Fondo Noche Profunda
        ctx.fillStyle = '#03050d';
        ctx.fillRect(0, 0, w, h);

        // Dibujar Estrellas
        stars.forEach(s => {
            ctx.globalAlpha = s.alpha;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(s.x * w, s.y * h, s.size, 0, Math.PI * 2);
            ctx.fill();

            s.alpha += s.speed;
            if (s.alpha > 0.95 || s.alpha < 0.1) {
                s.speed = -s.speed;
            }
        });

        // DIBUJAR LUNA LLENA
        ctx.globalAlpha = 1.0;
        
        // Posición de la Luna (esquina superior derecha)
        const moonRadius = w < 600 ? 45 : 65;
        const moonX = w - moonRadius - (w < 600 ? 20 : 40);
        const moonY = moonRadius + (w < 600 ? 20 : 35);

        glowTimer += 0.03;
        const pulse = Math.sin(glowTimer) * 8;

        // Halo Exterior Dorado/Rosa
        const outerHalo = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.8, moonX, moonY, moonRadius * 2.5 + pulse);
        outerHalo.addColorStop(0, 'rgba(255, 250, 220, 0.35)');
        outerHalo.addColorStop(0.5, 'rgba(212, 175, 55, 0.15)');
        outerHalo.addColorStop(1, 'rgba(3, 5, 13, 0)');

        ctx.fillStyle = outerHalo;
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonRadius * 2.5 + pulse, 0, Math.PI * 2);
        ctx.fill();

        // Cuerpo de la Luna
        const moonGrad = ctx.createRadialGradient(moonX - moonRadius * 0.3, moonY - moonRadius * 0.3, moonRadius * 0.1, moonX, moonY, moonRadius);
        moonGrad.addColorStop(0, '#ffffff');
        moonGrad.addColorStop(0.7, '#fbf8eb');
        moonGrad.addColorStop(1, '#d8d0b5');

        ctx.fillStyle = moonGrad;
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
        ctx.fill();

        // Cráteres / Textura de la Luna
        ctx.fillStyle = 'rgba(180, 170, 140, 0.25)';
        
        ctx.beginPath();
        ctx.arc(moonX - moonRadius * 0.3, moonY - moonRadius * 0.2, moonRadius * 0.22, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(moonX + moonRadius * 0.25, moonY + moonRadius * 0.3, moonRadius * 0.28, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(moonX - moonRadius * 0.1, moonY + moonRadius * 0.4, moonRadius * 0.18, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(moonX + moonRadius * 0.35, moonY - moonRadius * 0.25, moonRadius * 0.15, 0, Math.PI * 2);
        ctx.fill();

        requestAnimationFrame(drawNightSky);
    }

    drawNightSky();

    // -------------------------------------------------------------
    // AUDIO Y NAVEGACIÓN
    // -------------------------------------------------------------
    const localAudio = document.getElementById('bg-audio');
    const introScreen = document.getElementById('intro-screen');
    const btnEnter = document.getElementById('btn-enter');
    const playBtn = document.getElementById('play-btn');

    function togglePlay() {
        if (localAudio.paused) {
            localAudio.play().then(() => {
                playBtn.innerText = '❚❚';
            }).catch(e => console.log("Audio play error: ", e));
        } else {
            localAudio.pause();
            playBtn.innerText = '▶';
        }
    }

    btnEnter.addEventListener('click', () => {
        introScreen.classList.add('hidden');
        togglePlay();
    });

    playBtn.addEventListener('click', () => {
        togglePlay();
    });

    // Navegación entre páginas
    const nextButtons = document.querySelectorAll('.btn-next');
    const prevButtons = document.querySelectorAll('.btn-prev');

    function switchPage(targetId) {
        const currentActive = document.querySelector('.page-section.active');
        const targetPage = document.getElementById(targetId);

        if (currentActive && targetPage) {
            currentActive.style.opacity = '0';
            currentActive.style.transform = 'translateY(-15px)';

            setTimeout(() => {
                currentActive.classList.remove('active');
                targetPage.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 400);
        }
    }

    nextButtons.forEach(btn => {
        btn.addEventListener('click', () => switchPage(btn.getAttribute('data-next')));
    });

    prevButtons.forEach(btn => {
        btn.addEventListener('click', () => switchPage(btn.getAttribute('data-prev')));
    });
});
