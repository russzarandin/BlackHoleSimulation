import * as THREE from 'three';
import { rayLength, pullStrength, currentHeadColor, currentTailColor } from './controls.js';
import { blackHoleRadius } from './sceneSetup.js';

export function addLightRay(scene, lightRays, maxRays) {
    if (lightRays.length >= maxRays) {
        const oldestRay = lightRays.shift();
        scene.remove(oldestRay.points);
        oldestRay.points.geometry.dispose();
        oldestRay.points.material.dispose();
    };

    // Spawn ring
    const startDistance = 30 + Math.random() * 2;
    const angle = Math.random() * Math.PI * 2;
    const startX = startDistance * Math.cos(angle);
    const startY = startDistance * Math.sin(angle);
    const startZ = (Math.random() - 0.5) * 1.5;

    const startPoint = new THREE.Vector3(startX, startY, startZ);

    // Initial velocity: tangential + inward pull
    const radial = new THREE.Vector3(startX, startY, 0).normalize();
    const tangential = new THREE.Vector3(-radial.y, radial.x, 0).multiplyScalar(0.06); // slower orbit
    const inward = radial.clone().multiplyScalar(-0.01);
    const initialVelocity = tangential.add(inward);

    // Geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(rayLength * 3);
    const colors = new Float32Array(rayLength * 4);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4));

    for (let i = 0; i < rayLength; i++) {
        positions[i * 3] = startPoint.x;
        positions[i * 3 + 1] = startPoint.y;
        positions[i * 3 + 2] = startPoint.z;

        colors[i * 4] = currentHeadColor.r;
        colors[i * 4 + 1] = currentHeadColor.g;
        colors[i * 4 + 2] = currentHeadColor.b;
        colors[i * 4 + 3] = 0.8;
    }

    const material = new THREE.PointsMaterial({
        size: 0.7,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 1.0,
        vertexColors: true
    });

    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    scene.add(points);

    lightRays.push({
        points,
        startPosition: startPoint.clone(),
        currentPosition: startPoint.clone(),
        velocity: initialVelocity
    });
};

export function updateLightRays(scene, lightRays) {
    const blackHoleCenter = new THREE.Vector3(0, 0, 0);
    const raysToRemove = [];
    const maxAllowedDistance = 75;

    lightRays.forEach((ray, index) => {
        const distanceToBH = ray.currentPosition.distanceTo(blackHoleCenter);

        // Gravity pull
        let gravityStrength = (0.35 / (distanceToBH * distanceToBH)) * pullStrength;
        const toBH = blackHoleCenter.clone().sub(ray.currentPosition).normalize();
        ray.velocity.add(toBH.multiplyScalar(gravityStrength));

        // Tangential force
        const radialDir = ray.currentPosition.clone().setZ(0).normalize();
        const tangentialDir = new THREE.Vector3(-radialDir.y, radialDir.x, 0).normalize();
        const tangentialForce = (1 / distanceToBH) * 0.0005 * pullStrength;
        ray.velocity.add(tangentialDir.multiplyScalar(tangentialForce));

        // Speed cap
        const maxSpeed = 0.22;
        if (ray.velocity.length() > maxSpeed) {
            ray.velocity.setLength(maxSpeed);
        }

        // Z axis dampening
        ray.velocity.z *= 0.92;

        ray.currentPosition.add(ray.velocity);

        // Update trail geometry
        const positions = ray.points.geometry.attributes.position.array;
        const colors = ray.points.geometry.attributes.color.array;
        const numVertices = rayLength;

        positions[0] = ray.currentPosition.x;
        positions[1] = ray.currentPosition.y;
        positions[2] = ray.currentPosition.z;

        const spacing = 0.05;

        for (let i = 1; i < numVertices; i++) {
            const i3 = i * 3;
            const behind = ray.currentPosition.clone().sub(ray.velocity.clone().normalize().multiplyScalar(i * spacing));
            const lag = 0.2 + (i * 0.01);
            positions[i3] = THREE.MathUtils.lerp(positions[i3], behind.x, lag);
            positions[i3 + 1] = THREE.MathUtils.lerp(positions[i3 + 1], behind.y, lag);
            positions[i3 + 2] = THREE.MathUtils.lerp(positions[i3 + 2], behind.z, lag);

            const t = i / (numVertices - 1);
            const distanceFade = THREE.MathUtils.clamp(distanceToBH / 30, 0, 1);
            const redshiftFactor = 1 - distanceFade;

            const r = (currentHeadColor.r * (1 - t) + currentTailColor.r * t) * (1 + redshiftFactor * 0.5);
            const g = (currentHeadColor.g * (1 - t) + currentTailColor.g * t) * (1 - redshiftFactor * 0.5);
            const b = (currentHeadColor.b * (1 - t) + currentTailColor.b * t) * (1 - redshiftFactor * 0.5);
            colors[i * 4 + 0] = Math.min(r, 1);
            colors[i * 4 + 1] = Math.max(g, 0);
            colors[i * 4 + 2] = Math.max(b, 0);
        }

        ray.points.geometry.attributes.position.needsUpdate = true;
        ray.points.geometry.attributes.color.needsUpdate = true;

        // Fade-out near core
        const fadeStart = blackHoleRadius * 1.0;
        const fadeEnd = blackHoleRadius * 0.7;
        if (distanceToBH < fadeStart) {
            ray.points.material.opacity = Math.max(0, Math.min(1, (distanceToBH - fadeEnd) / (fadeStart - fadeEnd)));
        } else {
            ray.points.material.opacity = 0.8;
        };

        // Remove when inside black hole
        if (distanceToBH < blackHoleRadius * 0.5) {
            raysToRemove.push(index);
        };

        if (distanceToBH > maxAllowedDistance) {
            raysToRemove.push(index);
        };
    });


    // Cleanup
    for (let i = raysToRemove.length - 1; i >= 0; i--) {
        const ray = lightRays[raysToRemove[i]];
        scene.remove(ray.points);
        ray.points.geometry.dispose();
        ray.points.material.dispose();
        lightRays.splice(raysToRemove[i], 1);
    };
};
