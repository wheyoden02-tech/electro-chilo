import { Environment, useGLTF } from "@react-three/drei"
import { useRef, useEffect } from "react"
import { Group, Box3, Vector3, PerspectiveCamera } from "three"
import { useThree } from "@react-three/fiber"

function SwitchModel() {
  const groupRef = useRef<Group>(null)
  const { scene } = useGLTF("/models/switch.glb")
  const { camera } = useThree()

  useEffect(() => {
    if (!groupRef.current) return

    // ✅ Calcular bounding box real
    const box = new Box3().setFromObject(scene)
    const center = new Vector3()
    const size = new Vector3()

    box.getCenter(center)
    box.getSize(size)

    // ✅ Centrar modelo en origen
    scene.position.sub(center)

    // ✅ Calcular distancia ideal de cámara
    const maxDimension = Math.max(size.x, size.y, size.z)
    const fov = (camera as PerspectiveCamera).fov * (Math.PI / 180)
    const cameraDistance = maxDimension / (2 * Math.tan(fov / 2))

    // ✅ Desktop más grande (acercamos cámara)
    const distanceMultiplier =
      typeof window !== "undefined" && window.innerWidth >= 1024
        ? 0.7   // desktop igual
        : 1.4   // ✅ mobile 20% más grande que antes

    camera.position.set(0, 0, cameraDistance * distanceMultiplier)
    camera.lookAt(0, 0, 0)

    // ✅ Rotación con scroll (limitada)
    const handleScroll = () => {
      if (!groupRef.current) return
      const progress = window.scrollY / window.innerHeight
      groupRef.current.rotation.y = progress * Math.PI * 1.6
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scene, camera])

  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={1} />
    </group>
  )
}

export default function Scene() {
  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <directionalLight position={[-5, 3, -5]} intensity={1.5} />

      <SwitchModel />

      <Environment preset="studio" />
    </>
  )
}