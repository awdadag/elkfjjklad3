$projectPath = "C:\Users\User\.claude\projects\C--WINDOWS-system32\iphone-3d-site"

$js = @"
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const container = document.getElementById('scene-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 1)); 
const light1 = new THREE.DirectionalLight(0xffffff, 2);
light1.position.set(5, 10, 7);
scene.add(light1);

const flashLight = new THREE.PointLight(0xffffff, 0, 20); 

const loader = new GLTFLoader();
let phone;

// ПУТЬ БЕЗ ПАПКИ models (файл лежит в корне)
loader.load('iphone_16_pro_max.glb', (gltf) => {
  phone = gltf.scene;
  phone.scale.set(1.5, 1.5, 1.5); 
  phone.position.set(2, 0, 0); 
  phone.rotation.y = -Math.PI / 2; 
  
  phone.add(flashLight);
  flashLight.position.set(0.5, 0.6, 0.9); 

  scene.add(phone);

  // Вызываем анимацию для первого слайда
  updateSlide(0);
});

camera.position.set(0, 0, 6); 

const slides = document.querySelectorAll('.slide');
const glowBg = document.getElementById('glow-bg');

function updateSlide(index) {
    if (phone) {
        let targetX = 2, targetY = 0, targetZ = 0, targetAngle = -Math.PI / 2, targetScale = 1.5;
        let glowColor = 'rgba(255,255,255,0.1)'; 
        let flashIntensity = 0;
        
        if (index === 0) { 
            targetX = 2; targetAngle = -Math.PI / 2;
            glowColor = 'rgba(245, 230, 211, 0.4)'; 
        } 
        else if (index === 1) { 
            targetX = 0; targetY = -0.5; targetZ = 2.5; targetAngle = -Math.PI / 2;
            glowColor = 'rgba(255, 255, 255, 0.4)'; 
            flashIntensity = 50; 
        } 
        else if (index === 2) { 
            targetX = 0; targetAngle = Math.PI / 2; 
            glowColor = 'rgba(212, 138, 90, 0.3)'; 
        } 
        else if (index === 3) { 
            targetX = 1; targetAngle = -Math.PI / 2; targetZ = 1;
            glowColor = 'rgba(0, 255, 204, 0.3)'; 
        }
        else { 
            targetX = 3; targetAngle = Math.PI / 2;
            glowColor = 'rgba(255,255,255,0.1)'; 
        }
        
        gsap.to(phone.position, { x: targetX, y: targetY, z: targetZ, duration: 0.9, ease: "power2.out" });
        gsap.to(phone.rotation, { y: targetAngle, duration: 0.9, ease: "power2.out" });
        gsap.to(phone.scale, { x: targetScale, y: targetScale, z: targetScale, duration: 0.9, ease: "power2.out" });
        
        gsap.to(flashLight, { intensity: flashIntensity, duration: 0.6 });
        
        if (glowBg) {
            gsap.to(glowBg, {
                background: 'radial-gradient(circle at 30% 50%, ' + glowColor + ', transparent 60%)',
                opacity: 1,
                duration: 1
            });
        }
    }
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const index = Array.from(slides).indexOf(entry.target);
            updateSlide(index);
        }
    });
}, { threshold: 0.5 }); 

slides.forEach(slide => observer.observe(slide));

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
"@
Set-Content -Path "$projectPath\script.js" -Value $js -Encoding UTF8
Write-Host "Путь к модели исправлен! Ctrl+F5." -ForegroundColor Green
