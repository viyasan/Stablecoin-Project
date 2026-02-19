import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Environment } from '@react-three/drei';
import { Suspense, useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';

// ─── Path definition ──────────────────────────────────────────────────────────
// Oval XZ plane with one sinusoidal hill per loop — peak at front centre
const RX = 2.4;       // oval X radius
const RZ = 1.6;       // oval Z radius
const HILL_H = 1.3;   // hill amplitude (one big mountain)

function trackPoint(t: number): THREE.Vector3 {
  return new THREE.Vector3(
    RX * Math.cos(t),
    HILL_H * Math.sin(t),   // one hill per loop (was sin(2t))
    RZ * Math.sin(t),
  );
}

// ─── Per-coin speeds (racing feel, ±8% spread) ────────────────────────────────
const COIN_SPEEDS = [0.52, 0.57, 0.50, 0.59, 0.54]; // rad/s

// ─── Coin data ────────────────────────────────────────────────────────────────
const COINS = [
  { symbol: 'USDT', color: '#26A17B' },
  { symbol: 'USDC', color: '#3B82F6' },
  { symbol: 'USDe', color: '#8B5CF6' },
  { symbol: 'USDS', color: '#F59E0B' },
  { symbol: 'DAI',  color: '#F97316' },
] as const;

// ─── Track ribbon (flat road — no TubeGeometry pipe) ─────────────────────────
function TrackRibbon() {
  const geometry = useMemo(() => {
    const N = 200;
    const pts = Array.from({ length: N + 1 }, (_, i) =>
      trackPoint((i / N) * Math.PI * 2)
    );
    const curve = new THREE.CatmullRomCurve3(pts, true);
    const frames = curve.computeFrenetFrames(N, true);
    const halfW = 0.55;

    const positions: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i <= N; i++) {
      const idx = i % N;
      const pt = curve.getPoint(i / N);
      const bn = frames.binormals[idx]; // perpendicular to tangent
      const nm = frames.normals[idx];   // surface normal

      positions.push(
        pt.x - bn.x * halfW, pt.y - bn.y * halfW, pt.z - bn.z * halfW,
        pt.x + bn.x * halfW, pt.y + bn.y * halfW, pt.z + bn.z * halfW,
      );
      normals.push(nm.x, nm.y, nm.z, nm.x, nm.y, nm.z);
    }

    for (let i = 0; i < N; i++) {
      const a = i * 2, b = i * 2 + 1, c = i * 2 + 2, d = i * 2 + 3;
      indices.push(a, c, b,  b, c, d);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geo.setIndex(indices);
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial color="#D6D9DE" metalness={0.15} roughness={0.65} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ─── Floor disc ───────────────────────────────────────────────────────────────
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.4, 0]} receiveShadow>
      <circleGeometry args={[5, 72]} />
      <meshStandardMaterial color="#EBEBED" roughness={1} metalness={0} />
    </mesh>
  );
}

// ─── Single coin ─────────────────────────────────────────────────────────────
function Coin({
  symbol,
  color,
  startAngle,
  speed,
}: {
  symbol: string;
  color: string;
  startAngle: number;
  speed: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const tRef = useRef(startAngle);

  // Set YXZ order once on mount so Euler decomposition is yaw → pitch
  useEffect(() => {
    if (groupRef.current) groupRef.current.rotation.order = 'YXZ';
  }, []);

  useFrame((_, delta) => {
    tRef.current += delta * speed;
    const t = tRef.current;
    const pos = trackPoint(t);
    const ahead = trackPoint(t + 0.04);

    const g = groupRef.current;
    if (!g) return;

    g.position.copy(pos);

    // Tangent = direction of travel
    const tx = ahead.x - pos.x;
    const ty = ahead.y - pos.y;
    const tz = ahead.z - pos.z;
    const len = Math.sqrt(tx * tx + ty * ty + tz * tz) || 1;

    // Yaw: face the horizontal travel direction
    g.rotation.y = Math.atan2(tx / len, tz / len);
    // Pitch: tilt coin body with slope
    const hLen = Math.sqrt((tx / len) ** 2 + (tz / len) ** 2);
    g.rotation.x = -Math.atan2(ty / len, hLen);
    g.rotation.z = 0;
  });

  const fontSize = symbol.length > 4 ? 0.12 : 0.15;
  const halfThick = 0.055; // half of 0.11 thickness

  return (
    <group ref={groupRef}>
      {/*
        Cylinder axis is Y by default.
        Rotating 90° around X makes it point along local +Z,
        so the flat faces face the direction of travel (upright rolling coin).
      */}
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.42, 0.11, 48]} />
        <meshStandardMaterial
          color={color}
          metalness={0.75}
          roughness={0.16}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Embossed inner ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.33, 0.018, 12, 48]} />
        <meshStandardMaterial
          color="white"
          metalness={0.3}
          roughness={0.5}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Front face text */}
      <Text
        position={[0, 0, halfThick]}
        fontSize={fontSize}
        color="white"
        fontWeight={700}
        anchorX="center"
        anchorY="middle"
      >
        {symbol}
      </Text>

      {/* Back face text */}
      <Text
        position={[0, 0, -halfThick]}
        rotation={[0, Math.PI, 0]}
        fontSize={fontSize}
        color="white"
        fontWeight={700}
        anchorX="center"
        anchorY="middle"
      >
        {symbol}
      </Text>
    </group>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────
export function CoinCarousel() {
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div
      style={{ width: 380, height: 300, borderRadius: 16, overflow: 'hidden' }}
      aria-label="Animated stablecoin carousel"
      role="img"
    >
      <Canvas
        camera={{ position: [0, 2.2, 7.5], fov: 42 }}
        shadows
        dpr={[1, 2]}
        frameloop={prefersReducedMotion ? 'demand' : 'always'}
        gl={{ antialias: true, alpha: false }}
      >
        {/* Background matches site chrome */}
        <color attach="background" args={['#F5F6F8']} />

        {/* Lighting */}
        <ambientLight intensity={0.55} />
        <directionalLight
          position={[3, 9, 5]}
          intensity={1.7}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-near={0.1}
          shadow-camera-far={25}
          shadow-camera-left={-6}
          shadow-camera-right={6}
          shadow-camera-top={6}
          shadow-camera-bottom={-6}
        />
        {/* Cool fill from opposite side */}
        <directionalLight position={[-4, 3, -3]} intensity={0.4} color="#E8EEFF" />
        {/* Soft top fill */}
        <pointLight position={[0, 5, 0]} intensity={0.25} />

        <Suspense fallback={null}>
          {/* HDR env map for metallic reflections */}
          <Environment preset="city" />

          <Floor />
          <TrackRibbon />

          {COINS.map((coin, i) => (
            <Coin
              key={coin.symbol}
              symbol={coin.symbol}
              color={coin.color}
              startAngle={(i / COINS.length) * Math.PI * 2}
              speed={COIN_SPEEDS[i]}
            />
          ))}
        </Suspense>
      </Canvas>
    </div>
  );
}
