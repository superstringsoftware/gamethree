import React from 'react';
import * as THREE from 'three'
import { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'

function Box(props: JSX.IntrinsicElements['mesh']) {
  // This reference will give us direct access to the THREE.Mesh object
  const ref = useRef<THREE.Mesh>(null!)
  
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Rotate mesh every frame, this is outside of React without overhead
  useFrame((state, delta) => (ref.current.rotation.x += 0.01))

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

function Sphere(props: JSX.IntrinsicElements['mesh']) {
  const normalMap = useLoader(TextureLoader, 'Textures/Earth_NormalMap.png')
  const colorMap = useLoader(TextureLoader, "Textures/earthday.jpg")
  const emissive = useLoader(TextureLoader, 'Textures/Earth_Nightlights.png')
  const clouds = useLoader(TextureLoader, 'Textures/Earth_Clouds.png')
  const specular = useLoader(TextureLoader, "Textures/2k_earth_specular_map.png")
  //const sun = useLoader(TextureLoader, 'Textures/2k_sun.jpg')
  
  // This reference will give us direct access to the THREE.Mesh object
  const ref = useRef<THREE.Mesh>(null!)
  const ref1 = useRef<THREE.Mesh>(null!)
  const ref2 = useRef<THREE.Mesh>(null!)
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  // Rotate mesh every frame, this is outside of React without overhead
  useFrame((state, delta) => {
    //ref.current.rotation.y += 0.001
    ref.current.rotation.y += 0.0005
    ref1.current.rotation.y +=0.0006
    ref1.current.rotation.z +=0.0001
  })

  return (
    <>
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={(event) => click(!clicked)}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}>
      <sphereGeometry args={[1.5, 512, 256]} />
      <meshPhongMaterial map={colorMap} normalMap={normalMap} emissiveMap={emissive} emissiveIntensity={10} emissive={"#555544"} 
        specularMap={specular} 
        specular={"#333333"}  />
    </mesh>
    <mesh 
      {...props}
      ref={ref1}
      scale={1}>
      <sphereGeometry args={[1.51, 512, 256]} />
      <meshPhongMaterial alphaMap={clouds} transparent={true} opacity={0.9}/>
      
    </mesh>
    
    </>
  )
}

function Sun(props: JSX.IntrinsicElements['mesh']) {
  const sun = useLoader(TextureLoader, 'Textures/2k_sun.jpg')
  
  // This reference will give us direct access to the THREE.Mesh object
  const ref = useRef<THREE.Mesh>(null!)
  
  
  // Rotate mesh every frame, this is outside of React without overhead
  useFrame((state, delta) => {
    ref.current.rotation.y += 0.001
    
  })

  return (
    
    
    <mesh
      {...props}
      ref={ref}
      scale={1}>
      <sphereGeometry args={[0.3, 512, 256]}  />
      <meshPhongMaterial emissiveMap={sun} emissiveIntensity={50} emissive={"#555544"} />
      
    </mesh>
    
  )
}

export const App = () => (
  <Canvas >
      <ambientLight intensity={0.1} />
      <pointLight position={[-20, 0, 0]} intensity={1500} />
      
      <Sphere position={[0, 0, 0]} />
      
      <Sun position={[-4, 0, 0]} />
    </Canvas>
);
