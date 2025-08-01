import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { currentHeadColor } from './controls.js';

export const blackHoleRadius = 5;
export let blackHoleHalo;
export let lensingRing;

export function initScene() {
    console.log("sceneSetup.js: initScene called.");
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Black background for space

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 5000);
    camera.position.set(-1, 5, 40);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement); // Append canvas to body

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.maxDistance = 150;
    controls.minDistance = 5;

    const blackHole = new THREE.Mesh(
        new THREE.SphereGeometry(blackHoleRadius, 32, 32),
        new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    scene.add(blackHole);

    const haloRadius = blackHoleRadius * 1.1;
    const haloGeometry = new THREE.SphereGeometry(haloRadius, 32, 32);
    const haloMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0xffffff), // Initial color for halo
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide
    });
    blackHoleHalo = new THREE.Mesh(haloGeometry, haloMaterial);
    scene.add(blackHoleHalo);

    // For future possibility addition of better lensing ring
    // const lensingRingGeometry = new THREE.RingGeometry(blackHoleRadius * 1.2, blackHoleRadius * 1.5, 64);
    // const lensingMaterial = new THREE.MeshBasicMaterial({
    //     color: new THREE.Color(currentHeadColor),
    //     side: THREE.DoubleSide,
    //     transparent: true,
    //     opacity: 0.25,
    //     blending: THREE.AdditiveBlending
    // });
    // const lensingRing = new THREE.Mesh(lensingRingGeometry, lensingMaterial);
    // lensingRing.rotation.x = Math.PI / 2;
    // scene.add(lensingRing);

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return { scene, camera, renderer, controls };
};
