<script setup lang="ts">
import { computed, ref } from 'vue'
import type { LessonGraphEdge, LessonGraphNode } from '../content'

type NodeStatus = 'locked' | 'ready' | 'learning' | 'mastered' | 'review' | 'current'

const props = defineProps<{
  nodes: LessonGraphNode[]
  edges: LessonGraphEdge[]
  statuses: Record<string, NodeStatus>
}>()

const emit = defineEmits<{
  select: [lessonId: string]
}>()

const viewportRef = ref<HTMLElement | null>(null)
const scale = ref(1)
const offsetX = ref(40)
const offsetY = ref(40)
const isDragging = ref(false)

const nodeWidth = 196
const nodeHeight = 56
const columnGap = 138
const rowGap = 30
const graphPadding = 80

const laidOutNodes = computed(() => {
  const nodesByLevel = new Map<number, LessonGraphNode[]>()

  props.nodes.forEach((node) => {
    const existing = nodesByLevel.get(node.level) ?? []
    existing.push(node)
    nodesByLevel.set(node.level, existing)
  })

  const sortedLevels = [...nodesByLevel.keys()].sort((left, right) => left - right)
  const maxRows = Math.max(...sortedLevels.map((level) => nodesByLevel.get(level)?.length ?? 0), 1)

  return props.nodes.map((node) => {
    const levelNodes = [...(nodesByLevel.get(node.level) ?? [])].sort((left, right) => left.order - right.order)
    const rowIndex = levelNodes.findIndex((candidate) => candidate.lessonId === node.lessonId)
    const columnX = graphPadding + node.level * (nodeWidth + columnGap)
    const centeredStartY = graphPadding + ((maxRows - levelNodes.length) * (nodeHeight + rowGap)) / 2
    const rowY = centeredStartY + rowIndex * (nodeHeight + rowGap)

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

  const startX = fromNode.x + fromNode.width
  const startY = fromNode.y + fromNode.height / 2
  const endX = toNode.x
  const endY = toNode.y + toNode.height / 2
  const controlOffset = Math.max(56, (endX - startX) * 0.45)

  return `M ${startX} ${startY} C ${startX + controlOffset} ${startY}, ${endX - controlOffset} ${endY}, ${endX} ${endY}`
}

function zoomBy(delta: number): void {
  scale.value = Math.min(2.8, Math.max(0.45, Number((scale.value + delta).toFixed(2))))
}

function resetView(): void {
  scale.value = 1
  offsetX.value = 40
  offsetY.value = 40
}

function handleWheel(event: WheelEvent): void {
  event.preventDefault()
  zoomBy(event.deltaY < 0 ? 0.12 : -0.12)
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
      <button type="button" @click="zoomBy(0.12)">+</button>
      <button type="button" @click="zoomBy(-0.12)">-</button>
      <button type="button" @click="resetView">Reset</button>
      <p>Scroll to zoom. Drag to pan.</p>
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
            :class="`graph-canvas__node--${statuses[node.lessonId] ?? 'locked'}`"
            @click.stop="selectLesson(node.lessonId)"
          >
            <rect :x="node.x" :y="node.y" :width="node.width" :height="node.height" rx="28" />
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
  display: grid;
  gap: 0.75rem;
}

.graph-canvas__toolbar {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.graph-canvas__toolbar button {
  border: 1px solid var(--color-border);
  background: white;
  color: var(--color-heading);
  border-radius: 999px;
  padding: 0.55rem 0.85rem;
  cursor: pointer;
}

.graph-canvas__toolbar p {
  color: var(--color-text-muted);
  font-size: 0.92rem;
}

.graph-canvas__viewport {
  position: relative;
  min-height: 74vh;
  overflow: hidden;
  border-radius: 1.4rem;
  border: 1px solid var(--color-border);
  background:
    radial-gradient(circle at top right, rgba(102, 126, 255, 0.08), transparent 22%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(248, 250, 255, 0.94));
  cursor: grab;
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
  stroke: rgba(92, 105, 142, 0.35);
  stroke-width: 1.4;
}

.graph-canvas__node rect {
  stroke-width: 1.5;
}

.graph-canvas__node text {
  fill: currentColor;
  font-size: 12px;
  font-weight: 700;
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
</style>
