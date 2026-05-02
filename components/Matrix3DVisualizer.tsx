import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Text, Center } from '@react-three/drei';
import * as THREE from 'three';

interface Matrix3DVisualizerProps {
  matrix: number[][]; // Expected 3x3
}

const TransformingCube = ({ matrix }: { matrix: number[][] }) => {
  // Convert 3x3 matrix to Three.js Matrix4
  const transformMatrix = useMemo(() => {
    const mat4 = new THREE.Matrix4();
    if (matrix.length === 3 && matrix[0].length === 3) {
      mat4.set(
        matrix[0][0], matrix[0][1], matrix[0][2], 0,
        matrix[1][0], matrix[1][1], matrix[1][2], 0,
        matrix[2][0], matrix[2][1], matrix[2][2], 0,
        0, 0, 0, 1
      );
    }
    return mat4;
  }, [matrix]);

  return (
    <group>
      {/* Target Cube (Transformed) */}
      <mesh matrix={transformMatrix} matrixAutoUpdate={false}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color="#6366f1" 
          transparent 
          opacity={0.6} 
          wireframe={false}
          emissive="#4338ca"
          emissiveIntensity={0.2}
        />
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#ffffff" wireframe />
        </mesh>
      </mesh>

      {/* Basis Vectors */}
      {/* X Axis */}
      <Arrow vector={new THREE.Vector3(matrix[0][0], matrix[1][0], matrix[2][0])} color="#ef4444" label="i'" />
      {/* Y Axis */}
      <Arrow vector={new THREE.Vector3(matrix[0][1], matrix[1][1], matrix[2][1])} color="#22c55e" label="j'" />
      {/* Z Axis */}
      <Arrow vector={new THREE.Vector3(matrix[0][2], matrix[1][2], matrix[2][2])} color="#3b82f6" label="k'" />
    </group>
  );
};

const Arrow = ({ vector, color, label }: { vector: THREE.Vector3, color: string, label: string }) => {
  const length = vector.length();
  const dir = vector.clone().normalize();
  
  if (length < 0.001) return null;

  return (
    <group>
      <primitive 
        object={new THREE.ArrowHelper(dir, new THREE.Vector3(0, 0, 0), length, color, 0.2, 0.1)} 
      />
      <Center position={vector.clone().multiplyScalar(1.1)}>
        <Text fontSize={0.2} color={color} font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf">
          {label}
        </Text>
      </Center>
    </group>
  );
};

const Matrix3DVisualizer: React.FC<Matrix3DVisualizerProps> = ({ matrix }) => {
  return (
    <div className="w-full h-[400px] bg-slate-950 rounded-3xl overflow-hidden border border-white/10 relative group">
      <div className="absolute top-4 left-4 z-10 space-y-1">
        <h5 className="text-white font-black text-[10px] uppercase tracking-widest opacity-50">Visualisasi Ruang 3D</h5>
        <p className="text-white/30 text-[9px] font-medium leading-tight max-w-[200px]">
          Lihat bagaimana matriks Anda mengubah ruang (kubus unit dan vektor basis).
        </p>
      </div>

      <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <TransformingCube matrix={matrix} />
        
        {/* Reference Grid */}
        <Grid 
          infiniteGrid 
          fadeDistance={20} 
          fadeStrength={5} 
          sectionSize={1} 
          sectionColor="#312e81" 
          cellColor="#1e1b4b" 
        />
        
        <OrbitControls makeDefault />
      </Canvas>

      <div className="absolute bottom-4 right-4 flex gap-2">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/20 rounded-md border border-red-500/30">
          <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
          <span className="text-[8px] text-red-200 font-bold uppercase">X</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/20 rounded-md border border-green-500/30">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
          <span className="text-[8px] text-green-200 font-bold uppercase">Y</span>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/20 rounded-md border border-blue-500/30">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
          <span className="text-[8px] text-blue-200 font-bold uppercase">Z</span>
        </div>
      </div>
    </div>
  );
};

export default Matrix3DVisualizer;
