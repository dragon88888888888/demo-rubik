// Constantes
const CUBELET_SIZE = 1;
const CUBE_SIZE = 3;
const GAP = 0; // Espacio entre cubelets para efecto de bordes
const ROTATION_SPEED = 0.002; // Velocidad de rotación reducida

// Colores estándar del cubo de Rubik y su mapeo a secciones
const COLORS = {
    RIGHT: 0x7720e9,  // Azul
    LEFT: 0xf85b75,   // Naranja
    UP: 0xFFFFFF,     // Blanco
    DOWN: 0xeef85b,   // Amarillo
    FRONT: 0xe62c92,  // Rojo
    BACK: 0x3ef88c,   // Verde
    PLASTIC: 0x111111 // Negro (para bordes)
};

// Mapeo de colores a secciones
const COLOR_TO_SECTION = {
    '#e62c92': 'red-section',    // Rojo
    '#7720e9': 'blue-section',   // Azul
    '#f85b75': 'orange-section', // Naranja
    '#ffffff': 'white-section',  // Blanco
    '#eef85b': 'yellow-section', // Amarillo
    '#3ef88c': 'green-section'   // Verde
};

// Variables globales
let scene, camera, renderer, raycaster, mouse;
let cubeGroup, cubelets = [];
let isRotating = true;
let rotationAngle = 0;

// Inicializar la escena
function init() {
    // Obtener el contenedor
    const container = document.getElementById('canvas-container');

    // Crear escena
    scene = new THREE.Scene();

    // Crear cámara
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const aspectRatio = containerWidth / containerHeight;

    camera = new THREE.PerspectiveCamera(
        45, // Campo de visión
        aspectRatio, // Relación de aspecto
        0.1, // Plano cercano
        1000 // Plano lejano
    );
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 2, 0);

    // Crear renderizador con alfa habilitado
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerWidth, containerHeight);

    // Establecer color transparente (clearColor con alpha 0)
    renderer.setClearColor(0x000000, 0); // Color negro, pero con alfa 0 (completamente transparente)

    container.appendChild(renderer.domElement);


    // Configurar raycaster para detectar clics
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Agregar luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Crear el cubo
    createCube();

    // Configurar el punto de rotación (la esquina donde se unen Rojo, Azul y Blanco)
    // Este punto es la esquina en la posición (2,0,2) en nuestra grilla
    const cornerX = (2 - 1) * (CUBELET_SIZE + GAP);
    const cornerY = (0 - 1) * (CUBELET_SIZE + GAP);
    const cornerZ = (2 - 1) * (CUBELET_SIZE + GAP);

    // Trasladar el grupo para que el vértice de rotación esté en el origen
    cubeGroup.position.set(-cornerX, -cornerY, -cornerZ);

    // Desplazar el grupo para centrarlo mejor en el viewport
    cubeGroup.position.y += 0.5;

    // Agregar eventos
    window.addEventListener('resize', onWindowResize);
    renderer.domElement.addEventListener('click', onCubeClick);
    window.addEventListener('scroll', toggleBackToTopButton);

    // Iniciar animación
    animate();
}

// Crear el cubo completo
function createCube() {
    cubeGroup = new THREE.Group();
    scene.add(cubeGroup);

    // Para cada posición X, Y, Z en el cubo
    for (let x = 0; x < CUBE_SIZE; x++) {
        for (let y = 0; y < CUBE_SIZE; y++) {
            for (let z = 0; z < CUBE_SIZE; z++) {
                // No crear el cubelet central (completamente interior)
                if (x === 1 && y === 1 && z === 1) continue;

                const cubelet = createCubelet(x, y, z);
                cubelets.push(cubelet);
                cubeGroup.add(cubelet);
            }
        }
    }
}

// Crear un cubelet individual
function createCubelet(x, y, z) {
    const cubelet = new THREE.Group();

    // Posición relativa del cubelet en el cubo
    cubelet.position.set(
        (x - 1) * (CUBELET_SIZE + GAP),
        (y - 1) * (CUBELET_SIZE + GAP),
        (z - 1) * (CUBELET_SIZE + GAP)
    );

    // Determinar qué caras son visibles (externas)
    const isRightFace = x === 2;
    const isLeftFace = x === 0;
    const isUpFace = y === 2;
    const isDownFace = y === 0;
    const isFrontFace = z === 2;
    const isBackFace = z === 0;

    // Crear el cuerpo del cubelet (negro)
    const boxGeometry = new THREE.BoxGeometry(CUBELET_SIZE, CUBELET_SIZE, CUBELET_SIZE);
    const boxMaterial = new THREE.MeshPhongMaterial({
        color: COLORS.PLASTIC,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1
    });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    cubelet.add(box);

    // Agregar stickers a todas las caras visibles
    const stickerSize = CUBELET_SIZE * 0.85; // Sticker ligeramente más pequeño que la cara
    const stickerGeometry = new THREE.PlaneGeometry(stickerSize, stickerSize);

    // Función para crear y añadir un sticker
    function addSticker(color, direction) {
        const stickerMaterial = new THREE.MeshPhongMaterial({
            color: color,
            shininess: 50
        });
        const sticker = new THREE.Mesh(stickerGeometry, stickerMaterial);
        sticker.userData = { isSticker: true, colorHex: '#' + color.toString(16).padStart(6, '0') };

        // Posicionar y orientar el sticker según la dirección
        const offset = CUBELET_SIZE / 2 + 0.001; // Offset para evitar z-fighting

        switch (direction) {
            case 'right':
                sticker.position.set(offset, 0, 0);
                sticker.rotation.y = Math.PI / 2;
                break;
            case 'left':
                sticker.position.set(-offset, 0, 0);
                sticker.rotation.y = -Math.PI / 2;
                break;
            case 'up':
                sticker.position.set(0, offset, 0);
                sticker.rotation.x = -Math.PI / 2;
                break;
            case 'down':
                sticker.position.set(0, -offset, 0);
                sticker.rotation.x = Math.PI / 2;
                break;
            case 'front':
                sticker.position.set(0, 0, offset);
                break;
            case 'back':
                sticker.position.set(0, 0, -offset);
                sticker.rotation.y = Math.PI;
                break;
        }

        cubelet.add(sticker);
    }

    // Añadir los stickers según qué caras son visibles
    if (isRightFace) {
        addSticker(COLORS.RIGHT, 'right');
    }
    if (isLeftFace) {
        addSticker(COLORS.LEFT, 'left');
    }
    if (isUpFace) {
        addSticker(COLORS.UP, 'up');
    }
    if (isDownFace) {
        addSticker(COLORS.DOWN, 'down');
    }
    if (isFrontFace) {
        addSticker(COLORS.FRONT, 'front');
    }
    if (isBackFace) {
        addSticker(COLORS.BACK, 'back');
    }

    // Para cubelets en el interior que tienen al menos una cara visible,
    // asignar colores negros a las caras no visibles (para evitar huecos)
    if (!isRightFace && (isUpFace || isDownFace || isFrontFace || isBackFace)) {
        addSticker(COLORS.PLASTIC, 'right');
    }
    if (!isLeftFace && (isUpFace || isDownFace || isFrontFace || isBackFace)) {
        addSticker(COLORS.PLASTIC, 'left');
    }
    if (!isUpFace && (isRightFace || isLeftFace || isFrontFace || isBackFace)) {
        addSticker(COLORS.PLASTIC, 'up');
    }
    if (!isDownFace && (isRightFace || isLeftFace || isFrontFace || isBackFace)) {
        addSticker(COLORS.PLASTIC, 'down');
    }
    if (!isFrontFace && (isRightFace || isLeftFace || isUpFace || isDownFace)) {
        addSticker(COLORS.PLASTIC, 'front');
    }
    if (!isBackFace && (isRightFace || isLeftFace || isUpFace || isDownFace)) {
        addSticker(COLORS.PLASTIC, 'back');
    }

    return cubelet;
}

// Manejar redimensionamiento de ventana
function onWindowResize() {
    const container = document.getElementById('canvas-container');
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    camera.aspect = containerWidth / containerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(containerWidth, containerHeight);
}

// Manejar clic en el cubo
function onCubeClick(event) {
    // Calcular posición del mouse normalizada
    const container = document.getElementById('canvas-container');
    const rect = container.getBoundingClientRect();

    mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

    // Actualizar el raycaster
    raycaster.setFromCamera(mouse, camera);

    // Encontrar objetos intersectados
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        // Encontrar el primer sticker o cubelet clickeado
        for (let i = 0; i < intersects.length; i++) {
            const object = intersects[i].object;

            // Verificar si es un sticker y no es negro
            if (object.userData && object.userData.isSticker &&
                object.userData.colorHex !== '#111111') {

                // Navegar a la sección correspondiente al color
                const sectionId = COLOR_TO_SECTION[object.userData.colorHex];
                if (sectionId) {
                    document.getElementById(sectionId).scrollIntoView();
                }
                break;
            }
        }
    }
}

// Mostrar/ocultar botón "Volver arriba"
function toggleBackToTopButton() {
    const backToTopButton = document.getElementById('backToTop');
    if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
}

// Bucle de animación
function animate() {
    requestAnimationFrame(animate);

    // Rotar el cubo alrededor del punto fijo (el vértice)
    if (isRotating) {
        // Incrementar el ángulo de rotación con la velocidad reducida
        rotationAngle += ROTATION_SPEED;

        // Calcular los ejes de rotación (alternamos entre dos ejes para lograr
        // una rotación similar a la mostrada en las imágenes)
        const axis1 = new THREE.Vector3(0, 1, 0); // Eje vertical
        const axis2 = new THREE.Vector3(1, 0, 1).normalize(); // Eje diagonal en plano horizontal

        // Limpiar rotación previa
        cubeGroup.rotation.set(0, 0, 0);

        // Aplicar nuevas rotaciones
        const oscillation = Math.sin(rotationAngle * 0.5) * 0.5 + 0.5; // Oscila entre 0 y 1
        cubeGroup.rotateOnAxis(axis1, rotationAngle * (1 - oscillation));
        cubeGroup.rotateOnAxis(axis2, rotationAngle * oscillation);
    }

    renderer.render(scene, camera);
}

// Iniciar todo cuando el DOM esté listo
window.addEventListener('DOMContentLoaded', init);