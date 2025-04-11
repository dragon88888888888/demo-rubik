// Importar GSAP desde CDN
// Este script debe incluirse después de cargar GSAP en el HTML

// Variables globales
let currentSection = 'home';
let isAnimating = false;
let timeline;

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar animaciones
    initAnimations();

    // Configurar ScrollTrigger para animaciones al hacer scroll
    initScrollAnimations();

    // Inicializar animación del título con efecto de "typing"
    animateTitle();

    // Configurar el manejador de clics para el cubo de Rubik
    setupCubeNavigation();

    // Configurar el botón de volver al inicio
    setupBackToTopButton();
});

// Animaciones iniciales
function initAnimations() {
    // Animación de entrada para el título
    gsap.from('h1', {
        duration: 1.5,
        opacity: 0,
        y: -50,
        ease: 'elastic.out(1, 0.5)',
        delay: 0.5
    });

    // Animación para el contenedor del cubo
    // Aseguramos que el contenedor sea visible al final de la animación
    gsap.fromTo('#canvas-container',
        {
            opacity: 0,
            scale: 0.8,
            rotationY: 180
        },
        {
            opacity: 1,
            scale: 1,
            rotationY: 0,
            duration: 1.2,
            ease: 'back.out(1.7)',
            delay: 0.8
        }
    );

    // Hacer aparecer gradualmente la guía de navegación
    gsap.from('.nav-help', {
        duration: 1,
        opacity: 0,
        y: 30,
        ease: 'power3.out',
        delay: 2
    });

    // Animación para cada item del color-guide
    gsap.from('.color-item', {
        duration: 0.8,
        opacity: 0,
        x: -20,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 2.2
    });

    // Animación para el botón de volver arriba
    gsap.set('.back-to-top', {
        opacity: 0,
        scale: 0.5,
        rotation: -180
    });

    // Decoración flotante para la página de inicio
    animateDecorations();
}

// Animar las decoraciones flotantes
function animateDecorations() {
    // Seleccionar todas las decoraciones
    const decorations = document.querySelectorAll('.section-decoration');

    // Animar cada decoración con movimientos orgánicos
    decorations.forEach((decoration, index) => {
        // Posiciones aleatorias diferentes para cada decoración
        const randomX = (Math.random() - 0.5) * 40;
        const randomY = (Math.random() - 0.5) * 40;
        const duration = 10 + Math.random() * 10;
        const delay = index * 0.4;

        gsap.to(decoration, {
            x: randomX,
            y: randomY,
            duration: duration,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: delay
        });

        // Pulso sutil para un efecto orgánico
        gsap.to(decoration, {
            scale: 1.2,
            opacity: 0.4,
            duration: duration * 0.7,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: delay * 1.2
        });
    });
}

// Animaciones mejoradas activadas por scroll
function initScrollAnimations() {
    // Registrar los plugins necesarios de GSAP
    gsap.registerPlugin(ScrollTrigger);
    gsap.registerPlugin(ScrollToPlugin);

    // Seleccionar todas las secciones excepto #home
    const sections = document.querySelectorAll('section:not(#home)');

    // Para cada sección, crear animaciones avanzadas al hacer scroll
    sections.forEach((section, index) => {
        // Timeline para coordinar las animaciones de cada sección
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'center center',
                toggleActions: 'play none none reverse',
                // markers: true, // Útil para depuración
            }
        });

        // Obtener color basado en el ID de la sección
        const sectionColor = getComputedStyle(section).backgroundColor;
        const sectionContent = section.querySelector('.section-content');
        const sectionIcon = section.querySelector('h2 i');
        const paragraphs = section.querySelectorAll('p');

        // Brillo inicial que recorre la sección
        tl.fromTo(section, {
            backgroundPosition: '100% 100%'
        }, {
            backgroundPosition: '0% 0%',
            duration: 1,
            ease: 'power2.out'
        }, 0);

        // Animación del contenedor principal
        tl.fromTo(sectionContent, {
            y: 100,
            opacity: 0,
            scale: 0.9,
            boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
            borderRadius: '5px'
        }, {
            y: 0,
            opacity: 1,
            scale: 1,
            boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
            borderRadius: '25px',
            duration: 1.2,
            ease: 'power3.out'
        }, 0.2);

        // Efecto para el ícono (giro y aparición)
        if (sectionIcon) {
            tl.fromTo(sectionIcon, {
                scale: 0,
                opacity: 0,
                rotation: -180
            }, {
                scale: 1,
                opacity: 1,
                rotation: 0,
                duration: 1,
                ease: 'back.out(1.7)'
            }, 0.4);
        }

        // Animación del título con efecto de dibujo de línea
        tl.fromTo(section.querySelector('h2'), {
            opacity: 0,
            y: -50,
            filter: 'blur(10px)'
        }, {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power2.out'
        }, 0.3);

        // Efecto para la línea debajo del título
        tl.fromTo(section.querySelector('h2::after'), {
            width: 0,
            opacity: 0
        }, {
            width: '60px',
            opacity: 0.7,
            duration: 0.8,
            ease: 'power2.inOut'
        }, 0.7);

        // Animación para los párrafos con efecto cascada
        tl.fromTo(paragraphs, {
            y: 50,
            opacity: 0
        }, {
            y: 0,
            opacity: 1,
            stagger: 0.2,
            duration: 0.8,
            ease: 'power2.out'
        }, 0.6);

        // Efecto parallax para elementos decorativos
        const decorations = section.querySelectorAll('.section-decoration');

        decorations.forEach((decoration, i) => {
            gsap.fromTo(decoration,
                {
                    x: i % 2 === 0 ? -100 : 100,
                    y: i % 2 === 0 ? -100 : 100,
                    opacity: 0
                },
                {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 80%',
                        end: 'bottom 20%',
                        scrub: 1
                    },
                    x: 0,
                    y: 0,
                    opacity: 0.7,
                    ease: 'none'
                }
            );
        });

        // Efecto 3D sutil al hacer scroll
        ScrollTrigger.create({
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
            onUpdate: (self) => {
                const progress = self.progress;
                const rotateY = (progress - 0.5) * 10; // -5 a 5 grados
                const rotateX = (progress - 0.5) * 5; // -2.5 a 2.5 grados

                gsap.to(sectionContent, {
                    rotateY: rotateY,
                    rotateX: rotateX,
                    ease: 'none',
                    duration: 0.1
                });
            }
        });
    });

    // Efecto para mostrar/ocultar el botón de volver arriba
    ScrollTrigger.create({
        start: 300,
        onEnter: () => {
            gsap.to('.back-to-top', {
                duration: 0.5,
                opacity: 1,
                scale: 1,
                rotation: 0,
                ease: 'back.out(1.7)'
            });
        },
        onLeaveBack: () => {
            gsap.to('.back-to-top', {
                duration: 0.5,
                opacity: 0,
                scale: 0.5,
                rotation: -180,
                ease: 'power2.in'
            });
        }
    });
}

// Animación de typing mejorada para el título principal
function animateTitle() {
    const title = document.querySelector('h1');
    const text = title.textContent;

    // Limpiar el contenido original
    title.textContent = '';

    // Crear un wrapper para el efecto de cursor
    const wrapper = document.createElement('span');
    wrapper.className = 'title-wrapper';

    // Crear el elemento para el texto
    const textSpan = document.createElement('span');
    textSpan.className = 'title-text';
    wrapper.appendChild(textSpan);

    // Crear el elemento para el cursor
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.textContent = '|';
    wrapper.appendChild(cursor);

    // Añadir el wrapper al título
    title.appendChild(wrapper);

    // Animación del cursor
    gsap.to(cursor, {
        opacity: 0,
        repeat: -1,
        yoyo: true,
        duration: 0.8
    });

    // Efecto de typing con GSAP
    const tl = gsap.timeline();

    // Pausamos brevemente antes de comenzar
    tl.to({}, { duration: 0.8 });

    // Para cada letra, la añadimos con un retraso
    for (let i = 0; i < text.length; i++) {
        tl.add(() => {
            textSpan.textContent += text.charAt(i);
        }, i * 0.15);
    }

    // Después de escribir, hacer un efecto más elaborado
    tl.to(textSpan, {
        scale: 1.2,
        color: '#e248e7',
        duration: 0.5,
        ease: 'power4.out'
    }).to(textSpan, {
        scale: 1,
        color: '#f268f7',
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)'
    }).to(cursor, {
        opacity: 0,
        duration: 0.3
    }, '-=0.3');

    // Añadir efecto de brillo después de completar el typing
    tl.add(() => {
        const shineEffect = document.createElement('div');
        shineEffect.className = 'shine-effect';
        title.appendChild(shineEffect);

        gsap.to(shineEffect, {
            left: '120%',
            duration: 1.5,
            ease: 'power2.inOut',
            onComplete: () => {
                shineEffect.remove();
            }
        });
    });
}

// Configurar el manejador para la navegación al hacer clic en el cubo
function setupCubeNavigation() {
    // Obtener el renderer del Three.js
    const canvasContainer = document.getElementById('canvas-container');
    const cubeElement = canvasContainer.querySelector('canvas');

    // Sobreescribir la función onCubeClick en script.js
    if (typeof window.onCubeClick === 'function') {
        // Guardar la función original
        const originalOnCubeClick = window.onCubeClick;

        // Sobreescribir con nuestra versión mejorada
        window.onCubeClick = function (event) {
            // Si hay una animación en curso, no hacer nada
            if (isAnimating) return;

            // Capturar el elemento antes de la animación
            const container = document.getElementById('canvas-container');
            const rect = container.getBoundingClientRect();
            const mouseX = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
            const mouseY = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

            // Actualizar el raycaster
            raycaster.setFromCamera({ x: mouseX, y: mouseY }, camera);

            // Encontrar objetos intersectados
            const intersects = raycaster.intersectObjects(scene.children, true);

            if (intersects.length > 0) {
                // Encontrar el primer sticker clickeado
                for (let i = 0; i < intersects.length; i++) {
                    const object = intersects[i].object;

                    // Verificar si es un sticker y no es negro
                    if (object.userData && object.userData.isSticker &&
                        object.userData.colorHex !== '#111111') {

                        // Obtener la sección correspondiente al color
                        const sectionId = COLOR_TO_SECTION[object.userData.colorHex];
                        if (sectionId) {
                            // Marcar que una animación está en curso
                            isAnimating = true;

                            // Obtener el color real del sticker
                            const colorCode = object.userData.colorHex;

                            // Animar el cubo (girar en la dirección del clic)
                            gsap.to(cubeGroup.rotation, {
                                x: '+=' + (Math.random() * 0.5 - 0.25),
                                y: '+=' + (Math.random() * 0.5 - 0.25),
                                z: '+=' + (Math.random() * 0.5 - 0.25),
                                duration: 0.5,
                                ease: 'power2.inOut'
                            });

                            // Crear efecto de destello desde el cubo
                            createRippleEffect(event.clientX, event.clientY, colorCode);

                            // Animar la transición a la nueva sección
                            animatePageTransition(sectionId, colorCode);

                            break;
                        }
                    }
                }
            }
        };
    } else {
        console.warn('La función onCubeClick no se encontró. Las animaciones personalizadas no funcionarán correctamente.');
    }
}

// Crear efecto de onda al hacer clic en el cubo
function createRippleEffect(x, y, color) {
    // Crear elemento para el efecto
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.borderColor = color;
    document.body.appendChild(ripple);

    // Animar el efecto
    gsap.fromTo(ripple,
        {
            width: 0,
            height: 0,
            opacity: 1,
            borderWidth: '10px'
        },
        {
            width: 300,
            height: 300,
            opacity: 0,
            borderWidth: '1px',
            duration: 1.5,
            ease: 'power2.out',
            onComplete: () => {
                ripple.remove();
            }
        }
    );
}

// Animar la transición entre páginas
function animatePageTransition(targetSectionId, colorCode) {
    const targetSection = document.getElementById(targetSectionId);
    const currentSectionElement = document.getElementById(currentSection);

    if (!targetSection) return;

    // Timeline para coordinar las animaciones
    const tl = gsap.timeline({
        onComplete: () => {
            // Marcar la animación como finalizada
            isAnimating = false;
            // Actualizar la sección actual
            currentSection = targetSectionId;
        }
    });

    // 1. Crear overlay para la transición
    const overlay = document.createElement('div');
    overlay.className = 'page-transition-overlay';
    overlay.style.backgroundColor = colorCode;
    document.body.appendChild(overlay);

    // 2. Animar el overlay para que cubra la pantalla
    tl.fromTo(overlay,
        {
            clipPath: 'circle(0% at 50% 50%)'
        },
        {
            clipPath: 'circle(100% at 50% 50%)',
            duration: 0.8,
            ease: 'power3.inOut'
        }
    );

    // 3. Desplazarse a la nueva sección
    tl.add(() => {
        // Desplazarse a la sección de destino sin animación visible
        window.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'auto'
        });
    });

    // 4. Animar salida del overlay
    tl.to(overlay, {
        clipPath: 'circle(0% at 50% 50%)',
        duration: 0.8,
        ease: 'power3.inOut',
        onComplete: () => {
            overlay.remove();
        }
    }, '+=0.1');

    // 5. Animar entrada de la nueva sección
    tl.add(() => {
        // Activar una animación especial en la sección de destino
        const sectionContent = targetSection.querySelector('.section-content');
        const title = targetSection.querySelector('h2');
        const paragraphs = targetSection.querySelectorAll('p');

        gsap.fromTo(sectionContent,
            {
                scale: 0.8,
                opacity: 0,
                rotationX: -5
            },
            {
                scale: 1,
                opacity: 1,
                rotationX: 0,
                duration: 0.7,
                ease: 'back.out(1.7)'
            }
        );

        gsap.fromTo(title,
            {
                y: -30,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.5,
                ease: 'power2.out',
                delay: 0.2
            }
        );

        gsap.fromTo(paragraphs,
            {
                y: 30,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                stagger: 0.15,
                duration: 0.6,
                ease: 'power2.out',
                delay: 0.4
            }
        );
    }, '-=0.4');
}

// Configurar el botón de volver al inicio con animaciones personalizadas
function setupBackToTopButton() {
    const backToTopButton = document.getElementById('backToTop');

    if (!backToTopButton) return;

    backToTopButton.addEventListener('click', (e) => {
        e.preventDefault();

        // Si hay una animación en curso, no hacer nada
        if (isAnimating) return;
        isAnimating = true;

        // Crear un efecto de círculo que expande desde el botón
        const rect = backToTopButton.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Crear overlay para la transición
        const overlay = document.createElement('div');
        overlay.className = 'back-to-top-overlay';
        overlay.style.backgroundColor = '#f268f7';
        document.body.appendChild(overlay);

        // Timeline para coordinar las animaciones
        const tl = gsap.timeline({
            onComplete: () => {
                isAnimating = false;
                currentSection = 'home';
            }
        });

        // 1. Animar el botón con un efecto de rebote
        tl.to(backToTopButton, {
            scale: 1.5,
            backgroundColor: '#e248e7',
            boxShadow: '0 0 30px rgba(242, 104, 247, 0.8)',
            duration: 0.4,
            ease: 'power2.out'
        });

        // 2. Animar el overlay desde el botón
        tl.fromTo(overlay,
            {
                position: 'fixed',
                top: centerY,
                left: centerX,
                width: 0,
                height: 0,
                borderRadius: '50%',
                zIndex: 9999
            },
            {
                width: window.innerWidth * 2.5,
                height: window.innerHeight * 2.5,
                top: centerY - window.innerHeight * 1.25,
                left: centerX - window.innerWidth * 1.25,
                duration: 0.8,
                ease: 'power3.inOut'
            }
        );

        // 3. Desplazarse al inicio
        tl.add(() => {
            window.scrollTo({
                top: 0,
                behavior: 'auto'
            });

            // Reiniciar la rotación del cubo
            if (typeof cubeGroup !== 'undefined') {
                gsap.to(cubeGroup.rotation, {
                    x: 0,
                    y: 0,
                    z: 0,
                    duration: 0.5,
                    ease: 'power1.inOut'
                });
            }
        });

        // 4. Animar la desaparición del overlay
        tl.to(overlay, {
            opacity: 0,
            duration: 0.5,
            ease: 'power2.inOut',
            onComplete: () => {
                overlay.remove();
            }
        });

        // 5. Animar la reentrada de los elementos del home
        tl.add(() => {
            const homeTitle = document.querySelector('#home h1');
            const canvasContainer = document.querySelector('#canvas-container');
            const navHelp = document.querySelector('.nav-help');

            // Animar título
            gsap.fromTo(homeTitle,
                {
                    scale: 0.8,
                    opacity: 0,
                    y: -30
                },
                {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.5)'
                }
            );

            // Animar contenedor del cubo con rotación
            gsap.fromTo(canvasContainer,
                {
                    scale: 0.7,
                    opacity: 0,
                    rotationY: 180
                },
                {
                    scale: 1,
                    opacity: 1,
                    rotationY: 0,
                    duration: 1.2,
                    ease: 'back.out(1.7)'
                }
            );

            // Animar guía de navegación
            gsap.fromTo(navHelp,
                {
                    y: 50,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'power2.out',
                    delay: 0.3
                }
            );

            // Animar los elementos de color individual
            gsap.fromTo('.color-item',
                {
                    x: -20,
                    opacity: 0
                },
                {
                    x: 0,
                    opacity: 1,
                    stagger: 0.1,
                    duration: 0.5,
                    ease: 'power1.out',
                    delay: 0.6
                }
            );
        }, '-=0.2');

        // 6. Devolver el botón a su estado normal
        tl.to(backToTopButton, {
            scale: 1,
            backgroundColor: 'var(--main-pink)',
            boxShadow: '0 5px 20px rgba(242, 104, 247, 0.5)',
            duration: 0.3,
            ease: 'power2.out'
        }, '-=0.5');
    });
}

// Iniciar efectos de parallax y otras interacciones después de cargar la página
window.addEventListener('load', () => {
    initParallaxEffect();

    // Agregar los estilos necesarios para las animaciones
    addAnimationStyles();
});

// Función para añadir los estilos necesarios para las animaciones
function addAnimationStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        /* Estilos para efecto ripple */
        .ripple-effect {
            position: fixed;
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            border: 5px solid;
            transform: translate(-50%, -50%);
        }
        
        /* Estilos para overlay de transición de página */
        .page-transition-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9998;
            pointer-events: none;
        }
        
        /* Estilos para overlay de back-to-top */
        .back-to-top-overlay {
            position: fixed;
            z-index: 9998;
            pointer-events: none;
        }
        
        /* Estilo para efecto de brillo en el título */
        .shine-effect {
            position: absolute;
            top: 0;
            left: -100%;
            width: 50%;
            height: 100%;
            background: linear-gradient(
                to right,
                rgba(255, 255, 255, 0) 0%,
                rgba(255, 255, 255, 0.8) 50%,
                rgba(255, 255, 255, 0) 100%
            );
            transform: skewX(-25deg);
            pointer-events: none;
        }
        
        /* Mejora visual para las secciones durante el scroll */
        section {
            transition: background-position 0.5s ease-out;
            background-position: 50% 50%;
            background-size: 120% 120%;
        }
        
        /* Efecto 3D para las secciones de contenido */
        .section-content {
            transform-style: preserve-3d;
            perspective: 1000px;
            transition: transform 0.3s ease-out;
        }
    `;
    document.head.appendChild(styleElement);
}