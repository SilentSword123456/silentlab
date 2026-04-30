import {useEffect, useRef} from "react";
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass'

function Tesseract() {
    const points: number[][] = [];
    const edges: number[][] = [];
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
            75,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            1000
        )
        camera.position.z = 5

        const renderer = new THREE.WebGLRenderer({ canvas })
        const composer = new EffectComposer(renderer)
        composer.addPass(new RenderPass(scene, camera))
        composer.addPass(new UnrealBloomPass(
            new THREE.Vector2(canvas.clientWidth, canvas.clientHeight),
            0.3,
            0.1,
            0.0
        ))
        composer.addPass(new OutputPass())

        const lines: THREE.Line[] = []

        for(let i=0; i<edges.length; i++) {
            let pointA = points[edges[i][0]]
            let pointB = points[edges[i][1]]

            pointA = projectTo3D(pointA[0],pointA[1],pointA[2],pointA[3])
            pointB = projectTo3D(pointB[0],pointB[1],pointB[2],pointB[3])


            const geometry = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(pointA[0], pointA[1], pointA[2]),
                new THREE.Vector3(pointB[0], pointB[1], pointB[2]),
            ])
            const material = new THREE.LineBasicMaterial({color: 0x00ffff})
            if(i==0)
                material.color.set(0xff0000)
            const line = new THREE.Line(geometry, material)
            scene.add(line)
            lines.push(line)
        }

        let angle = 0

        function animate() {
            requestAnimationFrame(animate)
            angle += 0.02

            if(angle>=360) {
                angle = 0
                console.log("Reset angle to 0")
            }

            for (let i = 0; i < edges.length; i++) {
                const origA = points[edges[i][0]]
                const origB = points[edges[i][1]]

                const rotA = rotateXW(origA, angle)
                const rotB = rotateXW(origB, angle)


                const projA = projectTo3D(rotA[0], rotA[1], rotA[2], rotA[3])
                const projB = projectTo3D(rotB[0], rotB[1], rotB[2], rotB[3])

                lines[i].geometry.setFromPoints([
                    new THREE.Vector3(projA[0], projA[1], projA[2]),
                    new THREE.Vector3(projB[0], projB[1], projB[2]),
                ])
            }

            scene.rotateY(scene.rotation.y+0.1)

            composer.render()

        }
        animate()

        composer.render()

        return () => {
            renderer.dispose()
        }
    }, [])

    function projectTo3D(x: number, y: number, z: number,w: number) {
        const d = 2
        const wOffset = w + 3
        return [x * d / wOffset, y * d / wOffset, z * d / wOffset]
    }

    function rotateXW(p: number[], angle: number) {
        const [x, y, z, w] = p
        return [
            x * Math.cos(angle) - w * Math.sin(angle),
            y, z,
            x * Math.sin(angle) + w * Math.cos(angle),
        ]
    }

    function rotateZW(p: number[], angle: number) {
        const [x, y, z, w] = p
        return [
            x,
            y,
            z * Math.cos(angle) - w * Math.sin(angle),
            z * Math.sin(angle) + w * Math.cos(angle),
        ]
    }

    function rotateYW(p: number[], angle: number) {
        const [x, y, z, w] = p
        return [
            x,
            y * Math.cos(angle) - w * Math.sin(angle),
            z,
            y * Math.sin(angle) + w * Math.cos(angle),
        ]
    }

    function generatePoints() {
        for (const x of [-1, 1])
            for (const y of [-1, 1])
                for (const z of [-1, 1])
                    for (const w of [-1, 1])
                        points.push([x, y, z, w]);
    }
    function generateEdges() {
        for (let i = 0; i < points.length; i++) {
            for (let j = i+1; j < points.length; j++) {
                let diff = 0;
                for (let k = 0; k < 4; k++) {
                    if (points[i][k] !== points[j][k]) diff++;
                }
                if (diff === 1) edges.push([i, j]);
            }
        }
    }


    generatePoints()
    generateEdges()
    console.log(edges.length)

    return <canvas ref={canvasRef} style={{width: '1000px', height: '1000px'}} />
}

export default Tesseract