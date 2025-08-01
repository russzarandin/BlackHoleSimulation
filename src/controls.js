import * as THREE from 'three';
import { blackHoleHalo, lensingRing } from './sceneSetup.js';

export let rayLength = 20;
export let pullStrength = 1.0;
export let currentHeadColor = new THREE.Color(0xffffff); // Initial color
export let currentTailColor = new THREE.Color(0xffffff); // Initial color

// Accepts scene, lightRays, and maxRays as arguments
export function setupControls(scene, lightRays, maxRays) {
    console.log("controls.js: setupControls called.");
    const rayLengthInput = document.getElementById('rayLength');
    const rayLengthValueSpan = document.getElementById('rayLengthValue');
    rayLengthInput.addEventListener('input', (event) => {
        rayLength = parseInt(event.target.value);
        rayLengthValueSpan.textContent = rayLength;
        // Remove existing rays from the scene and dispose of their geometries/materials
        while (lightRays.length > 0) {
            const ray = lightRays.shift();
            scene.remove(ray.points);
            ray.points.geometry.dispose();
            ray.points.material.dispose();
        }
    });

    const pullStrengthInput = document.getElementById('pullStrength');
    const pullStrengthValueSpan = document.getElementById('pullStrengthValue');
    pullStrengthInput.addEventListener('input', (event) => {
        pullStrength = parseInt(event.target.value) / 10;
        pullStrengthValueSpan.textContent = pullStrength.toFixed(1);
    });
    pullStrengthValueSpan.textContent = pullStrength.toFixed(1);

    document.getElementById('headColor').addEventListener('input', (event) => {
        currentHeadColor.set(event.target.value);
        blackHoleHalo.material.color.set(currentHeadColor);
    });

    //     document.getElementById('headColor').addEventListener('input', (event) => {
    //     currentHeadColor.set(event.target.value);
    //     lensingRing.material.color.set(currentHeadColor); // Update halo color
    // });

    document.getElementById('tailColor').addEventListener('input', (event) => {
        currentTailColor.set(event.target.value);
    });
};
