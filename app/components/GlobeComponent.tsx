'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Globe to avoid SSR issues with canvas
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

import { useMonitorStore } from '../lib/store';

export default function GlobeComponent() {
    const { nodes, edges } = useMonitorStore();
    const startSimulation = useMonitorStore(state => state.startSimulation);
    const stopSimulation = useMonitorStore(state => state.stopSimulation);
    const [windowDimensions, setWindowDimensions] = useState({ width: 800, height: 600 });
    const [mounted, setMounted] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const globeRef = useRef<any>(null);

    useEffect(() => {
        setMounted(true);
        startSimulation(); // Start the live data ticks

        // Auto-rotate setup via the built-in control after globe mounts
        if (globeRef.current) {
            globeRef.current.controls().autoRotate = true;
            globeRef.current.controls().autoRotateSpeed = 0.5;
        }

        function handleResize() {
            setWindowDimensions({
                width: window.innerWidth - 256, // Subtract sidebar width
                height: window.innerHeight,
            });
        }

        // Initial size
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            stopSimulation();
        }
    }, [startSimulation, stopSimulation]);

    if (!mounted) return null;

    // We have to build connection objects that react-globe.gl expects
    const arcsData = edges.map(edge => {
        const startNode = nodes.find(n => n.id === edge.source);
        const endNode = nodes.find(n => n.id === edge.target);
        if (!startNode || !endNode) return null;
        return {
            startLat: startNode.lat,
            startLng: startNode.lng,
            endLat: endNode.lat,
            endLng: endNode.lng,
            type: edge.type,
            value: edge.value
        };
    }).filter((arc): arc is NonNullable<typeof arc> => arc !== null);

    return (
        <div className="w-full h-full cursor-grab active:cursor-grabbing pb-10">
            <Globe
                ref={globeRef}
                width={windowDimensions.width}
                height={windowDimensions.height}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-water.png"
                backgroundColor="rgba(248, 250, 252, 1)" // matches --background (slate-50)

                // Node config
                pointsData={nodes}
                pointLat="lat"
                pointLng="lng"
                pointColor={(d: any) => d.status === 'active' ? '#10b981' : '#f59e0b'} // emerald vs amber
                pointAltitude={0.05}
                pointRadius={0.5}
                pointsMerge={false}

                // Custom HTML tooltip styling using tailwind classes rendered as a string
                pointLabel={(d: any) => `
          <div style="background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; min-width: 220px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); color: #0f172a; font-family: ui-sans-serif, system-ui, sans-serif;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">
              <div style="width: 8px; height: 8px; border-radius: 50%; background: ${d.status === 'active' ? '#10b981' : '#f59e0b'};"></div>
              <strong style="font-size: 14px;">${d.name}</strong>
              <span style="margin-left: auto; font-size: 11px; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; border: 1px solid #e2e8f0; font-weight: bold;">${d.storage}</span>
            </div>
            <div style="display: flex; flex-direction: column; gap: 4px; font-size: 12px;">
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748b; font-weight: 500;">Role:</span>
                <span style="font-weight: 600; text-transform: capitalize;">${d.status} Node</span>
              </div>
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #64748b; font-weight: 500;">Type:</span>
                <span style="font-weight: 600; color: #3b82f6;">${d.dataType}</span>
              </div>
              <div style="display: flex; flex-direction: column; margin-top: 4px;">
                <span style="color: #64748b; font-weight: 500; margin-bottom: 2px;">Data Profile:</span>
                <span style="font-style: italic; color: #475569;">"${d.dataInfo}"</span>
              </div>
            </div>
          </div>
        `}

                // Arc (Connection) config
                arcsData={arcsData}
                arcColor={(d: any) => d.type === 'sync' ? '#f59e0b' : '#3b82f6'} // amber vs blue
                arcDashLength={0.5}
                arcDashGap={1}
                arcDashInitialGap={() => Math.random()}
                arcDashAnimateTime={2000}
                arcStroke={(d: any) => d.value * 0.5}
            />
        </div>
    );
}
