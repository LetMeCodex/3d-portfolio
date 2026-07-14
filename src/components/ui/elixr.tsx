'use client'
import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

class Vector2D {
  constructor(public x: number, public y: number) {}
  static random(min: number, max: number) {
    return min + Math.random() * (max - min)
  }
}
class Vector3D {
  constructor(public x: number, public y: number, public z: number) {}
  static random(min: number, max: number) {
    return min + Math.random() * (max - min)
  }
}

class AnimationController {
  private timeline: gsap.core.Timeline
  private time = 0
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private dpr: number
  private size: number
  private stars: Star[] = []

  private readonly changeEventTime = 0.32
  private readonly cameraZ = -400
  private readonly cameraTravelDistance = 3400
  private readonly startDotYOffset = 28
  private readonly viewZoom = 100
  private numberOfStars = 2500
  private trailLength = 40

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dpr: number, size: number) {
    this.canvas = canvas
    this.ctx = ctx
    this.dpr = dpr
    this.size = size
    this.timeline = gsap.timeline({ repeat: -1 })

    // Optimize star count for mobile
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      this.numberOfStars = 1000
      this.trailLength = 25
    }

    this.setupRandomGenerator()
    this.createStars()
    this.render()
    this.setupTimeline()
  }

  private setupRandomGenerator() {
    const originalRandom = Math.random
    const customRandom = () => {
      let seed = 1234
      return () => {
        seed = (seed * 9301 + 49297) % 233280
        return seed / 233280
      }
    }
    Math.random = customRandom()
    this.createStars()
    Math.random = originalRandom
  }

  private createStars() {
    for (let i = 0; i < this.numberOfStars; i++) {
      this.stars.push(new Star(this.cameraZ, this.cameraTravelDistance))
    }
  }

  private setupTimeline() {
    this.timeline.to(this, {
      time: 1,
      duration: 15,
      repeat: -1,
      ease: 'none',
      onUpdate: () => this.render(),
    })
  }

  public ease(p: number, g: number) {
    if (p < 0.5) return 0.5 * Math.pow(2 * p, g)
    return 1 - 0.5 * Math.pow(2 * (1 - p), g)
  }
  public easeOutElastic(x: number) {
    const c4 = (2 * Math.PI) / 4.5
    if (x <= 0) return 0
    if (x >= 1) return 1
    return Math.pow(2, -8 * x) * Math.sin((x * 8 - 0.75) * c4) + 1
  }
  public map(v: number, a1: number, b1: number, a2: number, b2: number) {
    return a2 + (b2 - a2) * ((v - a1) / (b1 - a1))
  }
  public constrain(v: number, min: number, max: number) {
    return Math.min(Math.max(v, min), max)
  }
  public lerp(a: number, b: number, t: number) {
    return a * (1 - t) + b * t
  }

  public spiralPath(p: number): Vector2D {
    p = this.constrain(1.2 * p, 0, 1)
    p = this.ease(p, 1.8)
    const turns = 6
    const theta = 2 * Math.PI * turns * Math.sqrt(p)
    const r = 170 * Math.sqrt(p)
    return new Vector2D(r * Math.cos(theta), r * Math.sin(theta) + this.startDotYOffset)
  }

  public rotate(v1: Vector2D, v2: Vector2D, p: number, orientation: boolean): Vector2D {
    const middle = new Vector2D((v1.x + v2.x) / 2, (v1.y + v2.y) / 2)
    const dx = v1.x - middle.x
    const dy = v1.y - middle.y
    const angle = Math.atan2(dy, dx)
    const o = orientation ? -1 : 1
    const r = Math.sqrt(dx * dx + dy * dy)
    const bounce = Math.sin(p * Math.PI) * 0.05 * (1 - p)
    return new Vector2D(
      middle.x + r * (1 + bounce) * Math.cos(angle + o * Math.PI * this.easeOutElastic(p)),
      middle.y + r * (1 + bounce) * Math.sin(angle + o * Math.PI * this.easeOutElastic(p))
    )
  }

  public showProjectedDot(position: Vector3D, sizeFactor: number, color?: string) {
    const t2 = this.constrain(this.map(this.time, this.changeEventTime, 1, 0, 1), 0, 1)
    const newCameraZ = this.cameraZ + this.ease(Math.pow(t2, 1.2), 1.8) * this.cameraTravelDistance
    if (position.z > newCameraZ) {
      const d = position.z - newCameraZ
      const x = (this.viewZoom * position.x) / d
      const y = (this.viewZoom * position.y) / d
      const sw = (400 * sizeFactor) / d
      if (color) this.ctx.fillStyle = color
      
      // OPTIMIZATION: Use fillRect instead of arc for massive performance gains on small dots
      const r = sw / 2
      this.ctx.fillRect(x - r, y - r, sw, sw)
    }
  }

  private drawStartDot() {
    if (this.time > this.changeEventTime) {
      const dy = (this.cameraZ * this.startDotYOffset) / this.viewZoom
      const pos = new Vector3D(0, dy, this.cameraTravelDistance)
      this.showProjectedDot(pos, 2.5, '#E58B88')
    }
  }

  public render() {
    const ctx = this.ctx
    if (!ctx) return

    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, this.size, this.size)

    ctx.save()
    ctx.translate(this.size / 2, this.size / 2)

    const t1 = this.constrain(this.map(this.time, 0, this.changeEventTime + 0.25, 0, 1), 0, 1)
    const t2 = this.constrain(this.map(this.time, this.changeEventTime, 1, 0, 1), 0, 1)

    ctx.rotate(-Math.PI * this.ease(t2, 2.7))

    this.drawTrail(t1)

    for (const star of this.stars) {
      star.render(t1, this)
    }

    this.drawStartDot()
    ctx.restore()
  }

  private drawTrail(t1: number) {
    for (let i = 0; i < this.trailLength; i++) {
      const f = this.map(i, 0, this.trailLength, 1.1, 0.1)
      const sw = (1.3 * (1 - t1) + 3.0 * Math.sin(Math.PI * t1)) * f

      this.ctx.fillStyle = '#E58B88' // Pinkish trail to match aesthetics
      this.ctx.lineWidth = sw

      const pathTime = t1 - 0.00015 * i
      const position = this.spiralPath(pathTime)

      const basePos = position
      const offset = new Vector2D(position.x + 5, position.y + 5)
      const rotated = this.rotate(
        basePos,
        offset,
        Math.sin(this.time * Math.PI * 2) * 0.5 + 0.5,
        i % 2 === 0
      )

      // OPTIMIZATION: fillRect instead of arc
      const r = sw / 2
      this.ctx.fillRect(rotated.x - r, rotated.y - r, sw, sw)
    }
  }

  public pause() { this.timeline.pause() }
  public resume() { this.timeline.play() }
  public destroy() { this.timeline.kill() }
}

class Star {
  private dx: number
  private dy: number
  private spiralLocation: number
  private strokeWeightFactor: number
  private z: number
  private angle: number
  private distance: number
  private rotationDirection: number
  private expansionRate: number
  private finalScale: number
  private color: string

  constructor(cameraZ: number, cameraTravelDistance: number) {
    this.angle = Math.random() * Math.PI * 2
    this.distance = 30 * Math.random() + 15
    this.rotationDirection = Math.random() > 0.5 ? 1 : -1
    this.expansionRate = 1.2 + Math.random() * 0.8
    this.finalScale = 0.7 + Math.random() * 0.6

    this.dx = this.distance * Math.cos(this.angle)
    this.dy = this.distance * Math.sin(this.angle)

    this.spiralLocation = (1 - Math.pow(1 - Math.random(), 3.0)) / 1.3
    this.z = Vector2D.random(0.5 * cameraZ, cameraTravelDistance + cameraZ)

    const lerp = (a: number, b: number, t: number) => a * (1 - t) + b * t
    this.z = lerp(this.z, cameraTravelDistance / 2, 0.3 * this.spiralLocation)
    this.strokeWeightFactor = Math.pow(Math.random(), 2.0)
    
    // Assigning colors based on her aesthetics: pink, blue, white
    const rand = Math.random();
    if (rand < 0.33) this.color = '#E58B88'; // Pink
    else if (rand < 0.66) this.color = '#B2BEE2'; // Blue
    else this.color = '#FCFBFF'; // White/Cream
  }

  render(p: number, controller: AnimationController) {
    const spiralPos = controller.spiralPath(this.spiralLocation)
    const q = p - this.spiralLocation
    if (q <= 0) return

    const disp = controller.constrain(4 * q, 0, 1)
    const lin = disp
    const elas = controller.easeOutElastic(disp)
    const pow2 = Math.pow(disp, 2)

    let easing: number
    if (disp < 0.3) easing = controller.lerp(lin, pow2, disp / 0.3)
    else if (disp < 0.7) {
      const t = (disp - 0.3) / 0.4
      easing = controller.lerp(pow2, elas, t)
    } else easing = elas

    let x: number, y: number
    if (disp < 0.3) {
      x = controller.lerp(spiralPos.x, spiralPos.x + this.dx * 0.3, easing / 0.3)
      y = controller.lerp(spiralPos.y, spiralPos.y + this.dy * 0.3, easing / 0.3)
    } else if (disp < 0.7) {
      const m = (disp - 0.3) / 0.4
      const curve = Math.sin(m * Math.PI) * this.rotationDirection * 1.5
      const baseX = spiralPos.x + this.dx * 0.3
      const baseY = spiralPos.y + this.dy * 0.3
      const targetX = spiralPos.x + this.dx * 0.7
      const targetY = spiralPos.y + this.dy * 0.7
      const perpX = -this.dy * 0.4 * curve
      const perpY = this.dx * 0.4 * curve
      x = controller.lerp(baseX, targetX, m) + perpX * m
      y = controller.lerp(baseY, targetY, m) + perpY * m
    } else {
      const f = (disp - 0.7) / 0.3
      const baseX = spiralPos.x + this.dx * 0.7
      const baseY = spiralPos.y + this.dy * 0.7
      const targetD = this.distance * this.expansionRate * 1.5
      const turns = 1.2 * this.rotationDirection
      const a = this.angle + turns * f * Math.PI
      const tx = spiralPos.x + targetD * Math.cos(a)
      const ty = spiralPos.y + targetD * Math.sin(a)
      x = controller.lerp(baseX, tx, f)
      y = controller.lerp(baseY, ty, f)
    }

    const vx = (this.z - (controller as any)['cameraZ']) * x / (controller as any)['viewZoom']
    const vy = (this.z - (controller as any)['cameraZ']) * y / (controller as any)['viewZoom']
    const pos = new Vector3D(vx, vy, this.z)

    let size = 1.0
    if (disp < 0.6) size = 1.0 + disp * 0.2
    else {
      const t = (disp - 0.6) / 0.4
      size = 1.2 * (1.0 - t) + this.finalScale * t
    }
    const dot = 8.5 * this.strokeWeightFactor * size
    controller.showProjectedDot(pos, dot, this.color)
  }
}

export function SpiralAnimation({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<AnimationController | null>(null)
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  })

  useEffect(() => {
    const onResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight })
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // OPTIMIZATION: Clamp DPR to 2 maximum. 3x on modern mobile devices crushes the GPU for canvas animations.
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const size = Math.max(dimensions.width, dimensions.height)

    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${dimensions.width}px`
    canvas.style.height = `${dimensions.height}px`
    ctx.scale(dpr, dpr)

    animationRef.current = new AnimationController(canvas, ctx, dpr, size)
    return () => {
      animationRef.current?.destroy()
      animationRef.current = null
    }
  }, [dimensions])

  return (
    <div className={`relative w-full h-full ${className || ''}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  )
}
