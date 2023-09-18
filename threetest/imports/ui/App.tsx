import React from 'react';
import * as THREE from 'three'
import { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

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
    ref.current.rotation.y += 0.0002
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
      <meshPhongMaterial emissiveMap={sun} emissiveIntensity={30} emissive={"#555544"} />
      
    </mesh>
    
  )
}


function Ship(props) {
  const gltf = useLoader(GLTFLoader, 'Models/ship1/scene.gltf')
  const ref = useRef<THREE.Mesh>(null!)
  
  
  // Rotate mesh every frame, this is outside of React without overhead
  useFrame((state, delta) => {
    ref.current.rotation.x += 0.01
    
  })
  
  return <>
  <primitive ref={ref} {...props} object={gltf.scene} />
  <directionalLight position={[-4,-2,0]} target-position={[-2,0,0]} />
  </>
}

export const App = () => (
  <>


<nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
  <div className="container-fluid">
    <a className="navbar-brand" href="#">Navbar</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarColor01">
      <ul className="navbar-nav me-auto">
        <li className="nav-item">
          <a className="nav-link active" href="#">Home
            <span className="visually-hidden">(current)</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Features</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">Pricing</a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="#">About</a>
        </li>
        <li className="nav-item dropdown">
          <a className="nav-link dropdown-toggle" data-bs-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">Dropdown</a>
          <div className="dropdown-menu">
            <a className="dropdown-item" href="#">Action</a>
            <a className="dropdown-item" href="#">Another action</a>
            <a className="dropdown-item" href="#">Something else here</a>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item" href="#">Separated link</a>
          </div>
        </li>
      </ul>
      <form className="d-flex">
        <input className="form-control me-sm-2" type="search" placeholder="Search" />
        <button className="btn btn-secondary my-2 my-sm-0" type="submit" >Search</button>
      </form>
    </div>
  </div>
</nav>


  <Canvas style={{
      position: "fixed",
      left: 0,
      top: 0,
      borderColor: "#ffffff",
      borderWidth: 3,
      zIndex: -1
  }} color='#ffffff'>
      <ambientLight intensity={0.1} />
      <pointLight position={[-20, 0, 0]} intensity={1500} />
      
      <Sphere position={[0, 0, 0]} />
      
      <Sun position={[-4, 0, 0]} />
      <Ship position={[-2,0,0]} scale={0.5} />
    </Canvas>
  </>
);
