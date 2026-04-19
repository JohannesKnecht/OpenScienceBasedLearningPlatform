<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

interface NodePoint {
  x: number
  y: number
  vx: number
  vy: number
  pulse: number
  radius: number
}

const canvasRef = ref<HTMLCanvasElement | null>(null)

let animationFrameId = 0
let nodes: NodePoint[] = []
let pointerX = 0
let pointerY = 0

function createNodes(width: number, height: number): NodePoint[] {
  const count = Math.max(28, Math.floor((width * height) / 42000))

  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.24,
    vy: (Math.random() - 0.5) * 0.24,
    pulse: Math.random() * Math.PI * 2,
    radius: 1.6 + Math.random() * 2.8,
  }))
}

function resizeCanvas(): void {
  const canvas = canvasRef.value
  if (!canvas) {
    return
  }

  const dpr = window.devicePixelRatio || 1
  const width = window.innerWidth
  const height = window.innerHeight

  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  const context = canvas.getContext('2d')
  if (!context) {
    return
  }

  context.setTransform(dpr, 0, 0, dpr, 0, 0)
  nodes = createNodes(width, height)
  pointerX = width * 0.72
  pointerY = height * 0.28
}

function drawFrame(time: number): void {
  const canvas = canvasRef.value
  const context = canvas?.getContext('2d')
  if (!canvas || !context) {
    return
  }

  const width = window.innerWidth
  const height = window.innerHeight
  context.clearRect(0, 0, width, height)

  const grid = context.createLinearGradient(0, 0, width, height)
  grid.addColorStop(0, 'rgba(95, 127, 255, 0.08)')
  grid.addColorStop(1, 'rgba(123, 236, 255, 0.03)')
  context.fillStyle = grid
  context.fillRect(0, 0, width, height)

  context.strokeStyle = 'rgba(90, 112, 180, 0.08)'
  context.lineWidth = 1
  for (let x = 0; x < width; x += 56) {
    context.beginPath()
    context.moveTo(x, 0)
    context.lineTo(x, height)
    context.stroke()
  }
  for (let y = 0; y < height; y += 56) {
    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(width, y)
    context.stroke()
  }

  const glowA = context.createRadialGradient(pointerX, pointerY, 0, pointerX, pointerY, 260)
  glowA.addColorStop(0, 'rgba(77, 115, 255, 0.18)')
  glowA.addColorStop(1, 'rgba(77, 115, 255, 0)')
  context.fillStyle = glowA
  context.fillRect(pointerX - 260, pointerY - 260, 520, 520)

  const secondaryX = width * 0.2 + Math.sin(time * 0.00016) * 90
  const secondaryY = height * 0.78 + Math.cos(time * 0.00013) * 60
  const glowB = context.createRadialGradient(secondaryX, secondaryY, 0, secondaryX, secondaryY, 220)
  glowB.addColorStop(0, 'rgba(91, 235, 255, 0.13)')
  glowB.addColorStop(1, 'rgba(91, 235, 255, 0)')
  context.fillStyle = glowB
  context.fillRect(secondaryX - 220, secondaryY - 220, 440, 440)

  nodes.forEach((node) => {
    node.x += node.vx
    node.y += node.vy
    node.pulse += 0.015

    if (node.x < -40) node.x = width + 40
    if (node.x > width + 40) node.x = -40
    if (node.y < -40) node.y = height + 40
    if (node.y > height + 40) node.y = -40
  })

  for (let index = 0; index < nodes.length; index += 1) {
    const source = nodes[index]

    for (let nextIndex = index + 1; nextIndex < nodes.length; nextIndex += 1) {
      const target = nodes[nextIndex]
      const dx = source.x - target.x
      const dy = source.y - target.y
      const distance = Math.hypot(dx, dy)

      if (distance > 170) {
        continue
      }

      const alpha = 0.18 - distance / 1050
      context.beginPath()
      context.moveTo(source.x, source.y)
      context.lineTo(target.x, target.y)
      context.strokeStyle = `rgba(72, 94, 158, ${Math.max(alpha, 0.02)})`
      context.lineWidth = 1
      context.stroke()
    }
  }

  nodes.forEach((node, index) => {
    const pulseRadius = node.radius + Math.sin(node.pulse) * 0.8
    const distToPointer = Math.hypot(node.x - pointerX, node.y - pointerY)
    const highlight = Math.max(0, 1 - distToPointer / 220)

    context.beginPath()
    context.arc(node.x, node.y, pulseRadius + highlight * 1.7, 0, Math.PI * 2)
    context.fillStyle = `rgba(75, 116, 255, ${0.26 + highlight * 0.22})`
    context.fill()

    if (index % 7 === 0) {
      context.beginPath()
      context.arc(node.x, node.y, pulseRadius * 3.8, 0, Math.PI * 2)
      context.strokeStyle = `rgba(91, 235, 255, ${0.08 + highlight * 0.1})`
      context.lineWidth = 1
      context.stroke()
    }
  })

  animationFrameId = window.requestAnimationFrame(drawFrame)
}

function handlePointerMove(event: PointerEvent): void {
  pointerX = event.clientX
  pointerY = event.clientY
}

onMounted(() => {
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  animationFrameId = window.requestAnimationFrame(drawFrame)
})

onBeforeUnmount(() => {
  window.cancelAnimationFrame(animationFrameId)
  window.removeEventListener('resize', resizeCanvas)
  window.removeEventListener('pointermove', handlePointerMove)
})
</script>

<template>
  <div class="neural-background" aria-hidden="true">
    <canvas ref="canvasRef" class="neural-background__canvas" />
    <div class="neural-background__veil" />
  </div>
</template>

<style scoped>
.neural-background {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.neural-background__canvas,
.neural-background__veil {
  position: absolute;
  inset: 0;
}

.neural-background__canvas {
  opacity: 0.95;
}

.neural-background__veil {
  background:
    radial-gradient(circle at top right, rgba(255, 255, 255, 0.48), transparent 26%),
    radial-gradient(circle at left 80%, rgba(255, 255, 255, 0.35), transparent 24%),
    linear-gradient(180deg, rgba(245, 247, 251, 0.2), rgba(245, 247, 251, 0.72));
  backdrop-filter: blur(1px);
}
</style>
