// إعداد مشهد Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// صنع مجرة حلزونية مبسطة
const particleCount = 6000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    // توزيع حلزوني
    const angle = i * 0.1;
    const radius = i * 0.005;
    const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 2;
    const y = (Math.random() - 0.5) * 2;
    const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 2;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // ألوان تتدرج بين الأزرق والبنفسجي
    colors[i * 3] = Math.random() * 0.5 + 0.5; // Red
    colors[i * 3 + 1] = Math.random() * 0.2;       // Green
    colors[i * 3 + 2] = Math.random() * 0.5 + 0.5; // Blue
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// مادة الجزيئات مع توهج
const material = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending // يعطي تأثير التوهج عند تداخل النجوم
});

const galaxy = new THREE.Points(geometry, material);
scene.add(galaxy);

// إعداد الكاميرا
let cameraZ = 30;
camera.position.set(0, 10, cameraZ);
camera.lookAt(0, 0, 0);

// متغيرات الحركة
let isZoomingIn = false;
let isZoomingOut = false;

// حلقة الرسوم المتحركة
function animate() {
    requestAnimationFrame(animate);
    galaxy.rotation.y -= 0.002; // دوران المجرة المستمر

    // أنيميشن الدخول (عند البحث)
    if (isZoomingIn && camera.position.y > 1) {
        camera.position.y -= 0.2;
        camera.position.z -= 0.6;
        camera.lookAt(0, 0, 0);
    } else if (isZoomingIn) {
        isZoomingIn = false;
    }

    // أنيميشن الخروج (عند العودة)
    if (isZoomingOut && camera.position.y < 10) {
        camera.position.y += 0.2;
        camera.position.z += 0.6;
        camera.lookAt(0, 0, 0);
    } else if (isZoomingOut) {
        isZoomingOut = false;
    }

    renderer.render(scene, camera);
}
animate();

// دالة البحث (الربط مع Node.js API)
async function explore() {
    const query = document.getElementById('searchInput').value;
    if (!query) return;

    // 1. بدء الأنيميشن
    document.getElementById('search-overlay').style.opacity = '0';
    document.getElementById('search-overlay').style.pointerEvents = 'none';
    isZoomingIn = true;
    isZoomingOut = false;

    try {
        // 2. طلب البيانات من Node.js AI Service
        const response = await fetch(`http://localhost:3000/api/explore/${encodeURIComponent(query)}`);
        const data = await response.json();

        // 3. عرض البيانات بعد انتهاء حركة الكاميرا (تقريباً بعد 1.5 ثانية)
        setTimeout(() => {
            document.getElementById('ui-title').innerText = data.name;
            document.getElementById('ui-manga').innerText = data.manga;
            document.getElementById('ui-story').innerText = data.story;
            
            const tagsHtml = data.tags.map(tag => `<span>${tag}</span>`).join('');
            document.getElementById('ui-tags').innerHTML = tagsHtml;

            document.getElementById('planet-info').classList.add('show');
        }, 1500);

    } catch (error) {
        console.error("Error fetching data:", error);
        alert("حدث خطأ في الاتصال بالخوادم. تأكد من تشغيل خوادم Go و Node.js");
        goBack();
    }
}

// دالة العودة
function goBack() {
    document.getElementById('planet-info').classList.remove('show');
    isZoomingOut = true;
    isZoomingIn = false;
    
    setTimeout(() => {
        document.getElementById('search-overlay').style.opacity = '1';
        document.getElementById('search-overlay').style.pointerEvents = 'all';
    }, 1000);
}

// تعديل حجم الشاشة
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
