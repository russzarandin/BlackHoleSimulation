import { updateLightRays } from './rays.js';

let _scene, _camera, _renderer, _controls, _lightRays;

export function setSceneComponents(scene, camera, renderer, controls, lightRays) {
    _scene = scene;
    _camera = camera;
    _renderer = renderer;
    _controls = controls;
    _lightRays = lightRays;
    console.log("animate.js: Scene components set.");
};

export function animate() {
    requestAnimationFrame(animate);
    if (_controls) _controls.update();

    // Pass _scene and _lightRays to updateLightRays
    if (_scene && _lightRays) {
        updateLightRays(_scene, _lightRays);
    }
    if (_renderer && _scene && _camera) {
        _renderer.render(_scene, _camera);
    } else {
        console.warn("animate.js: Renderer, scene, or camera not fully initialized for rendering.");
    }
};