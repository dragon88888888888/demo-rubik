// Código para crear partículas flotantes en las secciones
document.addEventListener('DOMContentLoaded', () => {
    // Crear partículas para cada sección
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        createParticles(section);
    });
});

// Función para crear partículas flotantes
function createParticles(container) {
    // Número de partículas basado en el tamaño del contenedor
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    const particleCount = Math.min(Math.floor((width * height) / 20000), 30);

    // Color base para las partículas basado en el fondo de la sección
    const sectionColor = getComputedStyle(container).backgroundColor;
    const isLight = isLightColor(sectionColor);

    // Crear partículas
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Propiedades aleatorias para cada partícula
        const size = 5 + Math.random() * 10;
        const posX = Math.random() * width;
        const posY = Math.random() * height;
        const opacity = 0.1 + Math.random() * 0.3;

        // Establecer el color basado en si el fondo es claro u oscuro
        const particleColor = isLight ? 'rgba(0, 0, 0, ' + opacity + ')' : 'rgba(255, 255, 255, ' + opacity + ')';

        // Aplicar estilos
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = posX + 'px';
        particle.style.top = posY + 'px';
        particle.style.backgroundColor = particleColor;
        particle.style.opacity = opacity;

        // Añadir partícula al contenedor
        container.appendChild(particle);

        // Animación de movimiento flotante con GSAP
        animateParticle(particle, container);
    }
}

// Función para determinar si un color es claro u oscuro
function isLightColor(color) {
    // Extraer los valores RGB
    let rgb = color.match(/\d+/g);
    if (!rgb || rgb.length < 3) return true;

    // Calcular el brillo usando la fórmula YIQ
    const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;

    return brightness > 128;
}

// Función para animar una partícula
function animateParticle(particle, container) {
    // Duración aleatoria
    const duration = 10 + Math.random() * 20;

    // Límites del contenedor
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    // Crear animación GSAP
    gsap.to(particle, {
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100,
        rotation: Math.random() * 360,
        opacity: 0.1 + Math.random() * 0.2,
        duration: duration,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        onComplete: () => {
            // Asegurarse de que las partículas permanezcan dentro del contenedor
            const newX = Math.min(Math.max(0, parseFloat(particle.style.left) + parseFloat(particle.style.x || 0)), containerWidth);
            const newY = Math.min(Math.max(0, parseFloat(particle.style.top) + parseFloat(particle.style.y || 0)), containerHeight);

            particle.style.left = newX + 'px';
            particle.style.top = newY + 'px';
        }
    });
}

// Función para añadir efecto de brillo (sparkle) cuando se hace clic en las secciones
function addSparkleEffect() {
    document.querySelectorAll('section').forEach(section => {
        section.addEventListener('click', (e) => {
            // No crear el efecto si se hizo clic en un enlace o botón
            if (e.target.tagName.toLowerCase() === 'a' || e.target.tagName.toLowerCase() === 'button') {
                return;
            }

            createSparkle(e.clientX, e.clientY);
        });
    });
}

// Crear efecto de brillo en una posición específica
function createSparkle(x, y) {
    const sparkleCount = 5 + Math.floor(Math.random() * 5);

    for (let i = 0; i < sparkleCount; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        document.body.appendChild(sparkle);

        // Tamaño aleatorio
        const size = 5 + Math.random() * 15;

        // Aplicar estilos iniciales
        Object.assign(sparkle.style, {
            width: size + 'px',
            height: size + 'px',
            backgroundColor: '#f268f7',
            position: 'fixed',
            borderRadius: '50%',
            pointerEvents: 'none',
            boxShadow: '0 0 10px 2px rgba(242, 104, 247, 0.8)',
            zIndex: '9999',
            top: y + 'px',
            left: x + 'px',
            transform: 'translate(-50%, -50%)'
        });

        // Animar la partícula de brillo
        const angle = Math.random() * Math.PI * 2;
        const distance = 30 + Math.random() * 70;
        const duration = 0.6 + Math.random() * 0.8;

        gsap.to(sparkle, {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            opacity: 0,
            scale: 0,
            duration: duration,
            ease: 'power2.out',
            onComplete: () => {
                // Eliminar el elemento después de la animación
                sparkle.remove();
            }
        });
    }
}

// Inicializar el efecto de brillo
window.addEventListener('load', () => {
    addSparkleEffect();
});