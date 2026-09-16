import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/** Add meshes to `scene`; the render loop is already running. */
export interface ThreeScene {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  controls: OrbitControls
  /** Moves the camera so `object` is nicely centred and fully in view. */
  frameObject: (object: THREE.Object3D) => void
}

/**
 * Sets up a Three.js scene inside a container div and keeps it alive for the
 * lifetime of the component.
 *
 * Attach the returned `containerRef` to a div. `threeScene` is null until the
 * scene has been created.
 */
export function useThreeScene(): {
  containerRef: RefObject<HTMLDivElement | null>
  threeScene: ThreeScene | null
} {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [threeScene, setThreeScene] = useState<ThreeScene | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#12151c')

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 500)
    camera.position.set(5, 4, 7)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)
    renderer.domElement.style.display = 'block'

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08

    const hemisphere = new THREE.HemisphereLight('#ffffff', '#30364a', 2.2)
    const keyLight = new THREE.DirectionalLight('#ffffff', 2.2)
    keyLight.position.set(6, 10, 8)
    const fillLight = new THREE.DirectionalLight('#8fb6ff', 0.7)
    fillLight.position.set(-8, 3, -6)
    scene.add(hemisphere, keyLight, fillLight)

    const grid = new THREE.GridHelper(20, 20, '#39405a', '#232838')
    scene.add(grid)

    const frameObject = (object: THREE.Object3D) => {
      const box = new THREE.Box3().setFromObject(object)
      if (box.isEmpty()) return

      const sphere = box.getBoundingSphere(new THREE.Sphere())
      const fov = THREE.MathUtils.degToRad(camera.fov)
      // Pad the fitted distance a little so the object never touches the edges.
      const distance = (sphere.radius / Math.sin(fov / 2)) * 1.6

      const direction = new THREE.Vector3(1, 0.8, 1.2).normalize()
      camera.position.copy(sphere.center).addScaledVector(direction, distance)
      camera.near = Math.max(distance / 100, 0.01)
      camera.far = distance * 100
      camera.updateProjectionMatrix()

      controls.target.copy(sphere.center)
      controls.update()
    }

    // Keep the drawing buffer in sync with the container's real size.
    const resizeObserver = new ResizeObserver(() => {
      const { clientWidth, clientHeight } = container
      if (clientWidth === 0 || clientHeight === 0) return
      // updateStyle must stay on: it keeps the canvas CSS size equal to the
      // container while the drawing buffer is scaled by the pixel ratio.
      renderer.setSize(clientWidth, clientHeight)
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
    })
    resizeObserver.observe(container)

    let frameId = 0
    const renderLoop = () => {
      frameId = requestAnimationFrame(renderLoop)
      controls.update()
      renderer.render(scene, camera)
    }
    renderLoop()

    setThreeScene({ scene, camera, renderer, controls, frameObject })

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      controls.dispose()
      grid.geometry.dispose()
      ;(grid.material as THREE.Material).dispose()
      renderer.dispose()
      renderer.domElement.remove()
      setThreeScene(null)
    }
  }, [])

  return { containerRef, threeScene }
}
