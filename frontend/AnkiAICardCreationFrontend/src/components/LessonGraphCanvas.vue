<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import type { LessonGraphEdge, LessonGraphNode } from '../content'

type NodeStatus = 'locked' | 'ready' | 'learning' | 'mastered' | 'review' | 'current'

const props = defineProps<{
  nodes: LessonGraphNode[]
  edges: LessonGraphEdge[]
  statuses: Record<string, NodeStatus>
  targetLessonIds?: string[]
}>()

const emit = defineEmits<{
  select: [lessonId: string]
}>()

const viewportRef = ref<HTMLElement | null>(null)
const scale = ref(1)
const offsetX = ref(0)
const offsetY = ref(24)
const isDragging = ref(false)

const nodeWidth = 236
const nodeHeight = 62
const columnGap = 34
const rowGap = 112
const graphPadding = 56
const minScale = 0.45
const maxScale = 2.8
const zoomButtonStep = 0.1
const wheelZoomSensitivity = 0.0008

const laidOutNodes = computed(() => {
  const nodesByLevel = new Map<number, LessonGraphNode[]>()

  props.nodes.forEach((node) => {
    const existing = nodesByLevel.get(node.level) ?? []
    existing.push(node)
    nodesByLevel.set(node.level, existing)
  })

  const sortedLevels = [...nodesByLevel.keys()].sort((left, right) => left - right)
  const maxColumns = Math.max(...sortedLevels.map((level) => nodesByLevel.get(level)?.length ?? 0), 1)

  return props.nodes.map((node) => {
    const levelNodes = [...(nodesByLevel.get(node.level) ?? [])].sort((left, right) => left.order - right.order)
    const columnIndex = levelNodes.findIndex((candidate) => candidate.lessonId === node.lessonId)
    const centeredStartX = graphPadding + ((maxColumns - levelNodes.length) * (nodeWidth + columnGap)) / 2
    const columnX = centeredStartX + columnIndex * (nodeWidth + columnGap)
    const rowY = graphPadding + node.level * (nodeHeight + rowGap)

    return {
      ...node,
      x: columnX,
      y: rowY,
      width: nodeWidth,
      height: nodeHeight,
    }
  })
})

const nodeMap = computed(() => new Map(laidOutNodes.value.map((node) => [node.lessonId, node])))

const graphWidth = computed(() => {
  const maxX = Math.max(...laidOutNodes.value.map((node) => node.x + node.width), 0)
  return maxX + graphPadding
})

const graphHeight = computed(() => {
  const maxY = Math.max(...laidOutNodes.value.map((node) => node.y + node.height), 0)
  return maxY + graphPadding
})

const stageStyle = computed(() => ({
  width: `${graphWidth.value}px`,
  height: `${graphHeight.value}px`,
  transform: `translate(${offsetX.value}px, ${offsetY.value}px) scale(${scale.value})`,
}))

function getEdgePath(edge: LessonGraphEdge): string {
  const fromNode = nodeMap.value.get(edge.fromLessonId)
  const toNode = nodeMap.value.get(edge.toLessonId)

  if (!fromNode || !toNode) {
    return ''
  }

  const startX = fromNode.x + fromNode.width / 2
  const startY = fromNode.y + fromNode.height
  const endX = toNode.x + toNode.width / 2
  const endY = toNode.y
  const controlOffset = Math.max(48, (endY - startY) * 0.45)

  return `M ${startX} ${startY} C ${startX} ${startY + controlOffset}, ${endX} ${endY - controlOffset}, ${endX} ${endY}`
}

function clampScale(value: number): number {
  return Math.min(maxScale, Math.max(minScale, value))
}

function zoomTo(nextScale: number, origin?: { x: number; y: number }): void {
  const currentScale = scale.value
  const clampedScale = clampScale(nextScale)

  if (clampedScale === currentScale) {
    return
  }

  if (origin) {
    const graphX = (origin.x - offsetX.value) / currentScale
    const graphY = (origin.y - offsetY.value) / currentScale
    offsetX.value = origin.x - graphX * clampedScale
    offsetY.value = origin.y - graphY * clampedScale
  }

  scale.value = Number(clampedScale.toFixed(3))
}

function zoomBy(delta: number): void {
  zoomTo(scale.value + delta)
}

function resetView(): void {
  initView()
}

function initView(): void {
  const viewport = viewportRef.value
  if (!viewport || !laidOutNodes.value.length) {
    offsetX.value = 24
    offsetY.value = 24
    scale.value = 1
    return
  }

  const vw = viewport.clientWidth
  const vh = viewport.clientHeight
  const padding = 24

  const scaleToFitW = (vw - padding * 2) / graphWidth.value
  const scaleToFitH = (vh - padding * 2) / graphHeight.value
  const initScale = clampScale(Math.min(1, scaleToFitW, scaleToFitH))

  scale.value = Number(initScale.toFixed(3))
  offsetX.value = Math.round((vw - graphWidth.value * initScale) / 2)
  offsetY.value = padding
}

onMounted(async () => {
  await nextTick()
  initView()
})

function handleWheel(event: WheelEvent): void {
  event.preventDefault()
  const viewport = viewportRef.value
  const rect = viewport?.getBoundingClientRect()
  const deltaMultiplier =
    event.deltaMode === WheelEvent.DOM_DELTA_LINE
      ? 16
      : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
        ? (viewport?.clientHeight ?? 800)
        : 1
  const normalizedDelta = event.deltaY * deltaMultiplier
  const nextScale = scale.value * Math.exp(-normalizedDelta * wheelZoomSensitivity)

  zoomTo(
    nextScale,
    rect ? { x: event.clientX - rect.left, y: event.clientY - rect.top } : undefined,
  )
}

let startPointerX = 0
let startPointerY = 0
let startOffsetX = 0
let startOffsetY = 0

function handlePointerDown(event: PointerEvent): void {
  isDragging.value = true
  startPointerX = event.clientX
  startPointerY = event.clientY
  startOffsetX = offsetX.value
  startOffsetY = offsetY.value
}

function handlePointerMove(event: PointerEvent): void {
  if (!isDragging.value) {
    return
  }

  offsetX.value = startOffsetX + (event.clientX - startPointerX)
  offsetY.value = startOffsetY + (event.clientY - startPointerY)
}

function handlePointerUp(): void {
  isDragging.value = false
}

function selectLesson(lessonId: string): void {
  emit('select', lessonId)
}
</script>

<template>
  <section class="graph-canvas">
    <div class="graph-canvas__toolbar">
      <button type="button" @click="zoomBy(zoomButtonStep)">+</button>
      <button type="button" @click="zoomBy(-zoomButtonStep)">-</button>
      <button type="button" @click="resetView">Reset</button>
      <p>Scroll to zoom. Drag to pan. Tap a lesson to preview.</p>
    </div>

    <div
      ref="viewportRef"
      class="graph-canvas__viewport"
      @wheel="handleWheel"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
      @pointerleave="handlePointerUp"
    >
      <div class="graph-canvas__stage" :style="stageStyle">
        <svg :width="graphWidth" :height="graphHeight" role="img" aria-label="Lesson graph">
          <path
            v-for="edge in edges"
            :key="edge.id"
            :d="getEdgePath(edge)"
            class="graph-canvas__edge"
          />

          <g
            v-for="node in laidOutNodes"
            :key="node.lessonId"
            class="graph-canvas__node"
            :class="[
              `graph-canvas__node--${statuses[node.lessonId] ?? 'locked'}`,
              { 'graph-canvas__node--target': props.targetLessonIds?.includes(node.lessonId) },
            ]"
            @click.stop="selectLesson(node.lessonId)"
          >
            <rect :x="node.x" :y="node.y" :width="node.width" :height="node.height" rx="7" />
            <text :x="node.x + node.width / 2" :y="node.y + node.height / 2 + 5" text-anchor="middle">
              {{ node.title }}
            </text>
          </g>
        </svg>
      </div>
    </div>
  </section>
</template>

<style scoped>
.graph-canvas {
  position: relative;
  display: block;
  height: 100%;
}

.graph-canvas__toolbar {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 5;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
  max-width: min(32rem, calc(100% - 2rem));
  padding: 0.55rem;
  border: 1px solid var(--color-border);
  border-radius: 0.9rem;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
}

.graph-canvas__toolbar button {
  border: 1px solid var(--color-border);
  background: white;
  color: var(--color-heading);
  border-radius: 0.35rem;
  min-height: 2.6rem;
  padding: 0.5rem 0.85rem;
  cursor: pointer;
  font-weight: 800;
}

.graph-canvas__toolbar p {
  color: var(--color-text-muted);
  font-size: 0.92rem;
}

.graph-canvas__viewport {
  position: relative;
  min-height: 72vh;
  height: 100%;
  overflow: hidden;
  border-radius: 0.45rem;
  border: 1px solid var(--color-border);
  background: white;
  cursor: grab;
  touch-action: none;
}

.graph-canvas__viewport:active {
  cursor: grabbing;
}

.graph-canvas__stage {
  transform-origin: 0 0;
  will-change: transform;
}

.graph-canvas__edge {
  fill: none;
  stroke: rgba(63, 63, 66, 0.24);
  stroke-width: 1.4;
}

.graph-canvas__node {
  cursor: pointer;
}

.graph-canvas__node rect {
  stroke-width: 1.5;
}

.graph-canvas__node text {
  fill: currentColor;
  font-size: 11px;
  font-weight: 800;
  pointer-events: none;
}

.graph-canvas__node--locked {
  color: #9099ac;
}

.graph-canvas__node--locked rect {
  fill: #f2f4f8;
  stroke: #d8dee8;
}

.graph-canvas__node--ready,
.graph-canvas__node--learning {
  color: #1c3f8a;
}

.graph-canvas__node--ready rect,
.graph-canvas__node--learning rect {
  fill: #dfeafc;
  stroke: #8eb2ec;
}

.graph-canvas__node--mastered {
  color: #0b6d3b;
}

.graph-canvas__node--mastered rect {
  fill: #dbf3e7;
  stroke: #8bd0ab;
}

.graph-canvas__node--review {
  color: #8a5b12;
}

.graph-canvas__node--review rect {
  fill: #fff1cf;
  stroke: #f0cf7d;
}

.graph-canvas__node--current {
  color: #0f2c78;
}

.graph-canvas__node--current rect {
  fill: #cadcff;
  stroke: #527fe8;
}

.graph-canvas__node--target rect {
  stroke: var(--color-progress);
  stroke-width: 3;
}
</style>
