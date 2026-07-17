import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function Motion3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Fixed virtual size to prevent race conditions during parent resizing
    const width = 300;
    const height = 150;

    // Create scene, camera, renderer
    const scene = new THREE.Scene();
    
    // Transparent WebGL context so it overlays cleanly on section backgrounds
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 100);
    camera.position.set(0, 1.5, 1.2);
    camera.lookAt(0, 0.05, 0);

    // Lights
    const light = new THREE.PointLight(0xffffff, 8, 25);
    light.position.set(0, 1.5, 2);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // Programmatically generate the custom "Disha" text texture
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 512;
    textCanvas.height = 256;
    const textCtx = textCanvas.getContext('2d');
    
    if (textCtx) {
      // Warm gradient mapping orange -> purple -> blue matching the user visual style
      const grad = textCtx.createLinearGradient(0, 0, 512, 0);
      grad.addColorStop(0, '#E35F38');   // Cozy orange
      grad.addColorStop(0.55, '#8A7FE8'); // Lavender purple
      grad.addColorStop(1, '#89CFF0');   // Soft blue
      textCtx.fillStyle = grad;
      textCtx.fillRect(0, 0, 512, 256);

      // Elegant inner border framing the text
      textCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      textCtx.lineWidth = 10;
      textCtx.strokeRect(12, 12, 488, 232);

      // Render bold brand text
      textCtx.font = '900 84px Outfit, sans-serif';
      textCtx.fillStyle = '#FFFFFF';
      textCtx.textAlign = 'center';
      textCtx.textBaseline = 'middle';
      textCtx.fillText('Disha', 256, 128);
    }

    const texture = new THREE.CanvasTexture(textCanvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.repeat.set(2, 1);

    const mat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      side: THREE.DoubleSide
    });
    
    const geo = new THREE.CylinderGeometry(0.75, 0.75, 0.3, 64, 64, false);

    // Mesh 1: Rotates clockwise-ish
    const mesh1 = new THREE.Mesh(geo, mat);
    mesh1.rotation.z = Math.PI * 0.25;
    scene.add(mesh1);

    // Mesh 2: Offset behind and rotates counter-clockwise
    const mesh2 = new THREE.Mesh(geo, mat);
    mesh2.rotation.z = Math.PI * -0.25;
    mesh2.position.z = -0.5;
    scene.add(mesh2);

    let animationFrameId: number;
    let isVisible = true;

    const animate = () => {
      if (!isVisible) return;
      mesh1.rotateOnWorldAxis(new THREE.Vector3(-1, 1, 0), -0.005);
      mesh2.rotateOnWorldAxis(new THREE.Vector3(1, 1, 0), 0.005);
      
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          cancelAnimationFrame(animationFrameId);
          animate();
        } else {
          cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0 }
    );
    observer.observe(container);

    animate();

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geo.dispose();
      mat.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full overflow-hidden select-none pointer-events-none flex items-center justify-center"
      style={{ minWidth: '120px', minHeight: '100%' }}
    />
  );
}
