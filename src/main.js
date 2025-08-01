import { initScene } from './sceneSetup.js';
import { setupControls } from './controls.js';
import { addLightRay, updateLightRays } from './rays.js';
import { showMessage, hideMessage } from './utils.js';
import { animate, setSceneComponents } from './animate.js';

// --- Global Shared States ---
export const lightRays = []; // Array to store all active light rays
export const maxRays = 1000; // Maximum number of light rays, feel free to change if too much for graphics usage

window.hideMessage = hideMessage;

window.onload = function () {
    console.log("main.js loaded: window.onload triggered."); // Confirm script execution

    // Initialize the scene and get its components
    const { scene, camera, renderer, controls } = initScene();
    setSceneComponents(scene, camera, renderer, controls, lightRays);

    // Setup UI controls, passing the scene and lightRays for ray removal logic
    setupControls(scene, lightRays, maxRays);

    // Start generating light rays at a regular interval
    setInterval(() => addLightRay(scene, lightRays, maxRays), 10);

    // Start the animation loop
    // animate() will now use the components passed via setSceneComponents
    animate();
};
