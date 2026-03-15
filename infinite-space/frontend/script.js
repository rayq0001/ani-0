// ==========================================
// 1. إعداد مشهد Three.js الأساسي
// ==========================================
const canvasContainer = document.getElementById('canvas-container');
const scene = new THREE.Scene();

// ضباب للمشهد ليعطي عمقاً للمجرة
scene.fog = new THREE.FogExp2(0x030308, 0.015);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
// وضع الكاميرا بعيداً قليلاً لنرى المجرة
camera.position.set(0, 20, 45); 
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
canvasContainer.appendChild(renderer.domElement);

// ==========================================
// 2. إنشاء مادة النجوم (توهج ناعم بدون صور خارجية)
// ==========================================
function createStarTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 32; canvas.height = 32;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(0.5, 'rgba(162, 85, 255, 0.2)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 32, 32);
    return new THREE.CanvasTexture(canvas);
}

// ==========================================
// 3. بناء المجرة الحلزونية الاحترافية
// ==========================================
const parameters = {
    count: 60000, // عدد النجوم
    size: 0.3,    // حجم النجم
    radius: 40,   // قطر المجرة
    branches: 4,  // أذرع المجرة
    spin: 1.5,    // مدى انحناء الأذرع
    randomness: 2.0, // العشوائية
    randomnessPower: 3,
    insideColor: '#ff6030', // لون المركز
    outsideColor: '#2030ff' // لون الأطراف
};

let geometry = null;
let material = null;
let points = null;

function generateGalaxy() {
    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);

    const colorInside = new THREE.Color(parameters.insideColor);
    const colorOutside = new THREE.Color(parameters.outsideColor);

    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;

        // المواقع (الرياضيات لبناء شكل حلزوني)
        const radius = Math.random() * parameters.radius;
        const spinAngle = radius * parameters.spin;
        const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

        const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
        const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius * 0.3; // تسطيح المجرة
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        // الألوان (دمج اللون الداخلي مع الخارجي بناءً على المسافة)
        const mixedColor = colorInside.clone();
        mixedColor.lerp(colorOutside, radius / parameters.radius);

        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending, // التوهج
        vertexColors: true,
        map: createStarTexture(),
        transparent: true
    });

    points = new THREE.Points(geometry, material);
    scene.add(points);
}

generateGalaxy();

// ==========================================
// 4. حلقة الحركة (الأنيميشن)
// ==========================================
const clock = new THREE.Clock();
let isTraveling = false; // حالة السفر للداخل

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // دوران المجرة ببطء
    if (points) {
        points.rotation.y = elapsedTime * 0.05;
    }

    // حركة الكاميرا عند النقر على "استكشف"
    if (isTraveling) {
        // اختراق المجرة
        camera.position.z -= 0.5;
        camera.position.y -= 0.1;
        
        // زيادة سرعة دوران المجرة لتبدو كقفزة زمنية (Warp)
        points.rotation.y += 0.02;

        // إذا وصلت الكاميرا للداخل، أوقف الأنيميشن (هنا يمكن نقل المستخدم للصفحة التالية)
        if(camera.position.z < -20) {
            isTraveling = false;
            // يمكنك توجيهه لصفحة أخرى هنا مثلاً: 
            // window.location.href = "planet-details.html";
        }
    }

    renderer.render(scene, camera);
}
animate();

// ==========================================
// 5. التفاعل مع المستخدم (UI Logic)
// ==========================================
function startExplore() {
    const input = document.getElementById('searchInput').value;
    if(input.trim() === '') {
        alert("الرجاء إدخال اسم الكوكب أولاً!");
        return;
    }

    // 1. إخفاء الواجهة
    const uiContainer = document.getElementById('ui-container');
    uiContainer.style.opacity = '0';
    uiContainer.style.transform = 'translate(-50%, -60%) scale(0.9)'; // تأثير الارتفاع للأعلى والاختفاء
    uiContainer.style.pointerEvents = 'none';

    // 2. إظهار نص "جاري السفر"
    setTimeout(() => {
        document.getElementById('travel-message').classList.add('show');
    }, 500);

    // 3. بدء حركة الكاميرا داخل المجرة
    isTraveling = true;
}

// تعديل حجم الشاشة ليتوافق مع جميع الأجهزة
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// تفعيل الأزرار السفلية بمجرد النقر
document.querySelectorAll('.tag-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.tag-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        document.getElementById('searchInput').value = this.innerText;
    });
});
