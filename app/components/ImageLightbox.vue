<script setup lang="ts">
// نمایش تمام‌صفحه‌ی یک تصویر با زوم: دو انگشت (pinch)، دابل‌تپ/دابل‌کلیک، و Ctrl+چرخ ماوس
const props = defineProps<{ src: string | null; alt?: string }>()
const emit = defineEmits<{ close: [] }>()

const nuxtApp = useNuxtApp()
const MAX_ZOOM = 4
const DOUBLE_ZOOM = 2.5

// آخرین تصویر رو نگه می‌داریم تا موقع انیمیشن بسته‌شدن، محتوا نپره
const current = ref<string | null>(props.src)
const alt = computed(() => props.alt ?? '')
const box = ref<HTMLElement | null>(null)
const img = ref<HTMLImageElement | null>(null)
const closeBtn = ref<HTMLButtonElement | null>(null)
let lastFocused: HTMLElement | null = null

// عرضِ تصویر در حالت «جا شدن در صفحه» و ضریب زوم فعلی
let fitW = 0
let zoom = 1
const zoomed = ref(false)

function applyWidth() {
  if (img.value) img.value.style.width = `${fitW * zoom}px`
  zoomed.value = zoom > 1.01
}

function computeFit() {
  const el = box.value
  const im = img.value
  if (!el || !im || !im.naturalWidth) return
  const maxW = el.clientWidth - 16
  const maxH = el.clientHeight - 16
  const ratio = im.naturalHeight / im.naturalWidth
  fitW = Math.min(maxW, maxH / ratio, im.naturalWidth)
  zoom = 1
  applyWidth()
}

// زوم دور نقطه‌ی (fx, fy) نسبت به قاب، طوری که همون نقطه زیرِ انگشت بمونه
function setZoom(next: number, fx: number, fy: number) {
  const el = box.value
  if (!el) return
  const z = Math.min(MAX_ZOOM, Math.max(1, next))
  const ratio = z / zoom
  const left = (el.scrollLeft + fx) * ratio - fx
  const top = (el.scrollTop + fy) * ratio - fy
  zoom = z
  applyWidth()
  el.scrollLeft = left
  el.scrollTop = top
}

function localPoint(x: number, y: number) {
  const r = box.value!.getBoundingClientRect()
  return { x: x - r.left, y: y - r.top }
}

// --- pinch و دابل‌تپ با Pointer Events ---
const pointers = new Map<number, { x: number; y: number }>()
let pinchStartDist = 0
let pinchStartZoom = 1
let downAt = 0
let downPos = { x: 0, y: 0 }
let lastTap = 0
let moved = false

function dist() {
  const [a, b] = [...pointers.values()]
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function onDown(e: PointerEvent) {
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
  if (pointers.size === 2) {
    pinchStartDist = dist()
    pinchStartZoom = zoom
  }
  else if (pointers.size === 1) {
    downAt = Date.now()
    downPos = { x: e.clientX, y: e.clientY }
    moved = false
  }
}

function onMove(e: PointerEvent) {
  if (!pointers.has(e.pointerId)) return
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
  if (pointers.size === 2 && pinchStartDist) {
    const [a, b] = [...pointers.values()]
    const c = localPoint((a.x + b.x) / 2, (a.y + b.y) / 2)
    setZoom(pinchStartZoom * (dist() / pinchStartDist), c.x, c.y)
  }
  else if (Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y) > 8) {
    moved = true
  }
}

function onUp(e: PointerEvent) {
  const wasSingle = pointers.size === 1
  pointers.delete(e.pointerId)
  if (pointers.size < 2) pinchStartDist = 0
  // دابل‌تپ روی تصویر: بین «جا شدن» و «بزرگ‌نمایی» جابه‌جا می‌شه
  if (wasSingle && !moved && Date.now() - downAt < 300 && (e.target as HTMLElement) === img.value) {
    const now = Date.now()
    if (now - lastTap < 350) {
      const p = localPoint(e.clientX, e.clientY)
      setZoom(zoom > 1.01 ? 1 : DOUBLE_ZOOM, p.x, p.y)
      lastTap = 0
    }
    else lastTap = now
  }
}

function onWheel(e: WheelEvent) {
  if (!e.ctrlKey) return
  e.preventDefault()
  const p = localPoint(e.clientX, e.clientY)
  setZoom(zoom * (e.deltaY < 0 ? 1.15 : 1 / 1.15), p.x, p.y)
}

// کلیک روی فضای خالی دور تصویر: بستن
function onBoxClick(e: MouseEvent) {
  if (e.target === box.value && !moved) emit('close')
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

function lock() {
  lastFocused = document.activeElement as HTMLElement | null
  ;(nuxtApp as any).$lenis?.stop()
  window.addEventListener('keydown', onKey)
  window.addEventListener('resize', computeFit)
  nextTick(() => closeBtn.value?.focus())
}

function unlock() {
  ;(nuxtApp as any).$lenis?.start()
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('resize', computeFit)
  lastFocused?.focus?.()
  lastFocused = null
}

watch(
  () => props.src,
  (s, old) => {
    if (s) {
      current.value = s
      zoom = 1
      if (!old) lock()
    }
    else if (old) unlock()
  }
)

onBeforeUnmount(() => {
  if (props.src) unlock()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="lightbox">
      <div
        v-if="src && current"
        class="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        :aria-label="alt || 'نمایش تصویر'"
      >
        <!-- قاب اسکرول‌شونده: dir=ltr تا مختصات اسکرول با زوم درست حساب بشه؛ touch-action جلوی زوم خودِ مرورگر رو می‌گیره تا pinch فقط روی تصویر کار کنه -->
        <div
          ref="box"
          dir="ltr"
          data-lenis-prevent
          class="absolute inset-0 touch-pan-x touch-pan-y overflow-auto overscroll-contain p-2"
          style="touch-action: pan-x pan-y"
          @click="onBoxClick"
          @pointerdown="onDown"
          @pointermove="onMove"
          @pointerup="onUp"
          @pointercancel="onUp"
          @wheel="onWheel"
        >
          <div class="flex min-h-full min-w-full">
            <img
              ref="img"
              :src="current"
              :alt="alt"
              draggable="false"
              class="m-auto block max-w-none shrink-0 select-none rounded-lg bg-white shadow-2xl"
              :class="zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'"
              @load="computeFit"
            >
          </div>
        </div>

        <button
          ref="closeBtn"
          type="button"
          aria-label="بستن"
          class="fixed left-3 top-3 z-10 flex size-10 items-center justify-center rounded-full bg-black/60 text-white transition-colors duration-300 hover:bg-black/80 sm:left-5 sm:top-5"
          @click="emit('close')"
        >
          <UIcon name="i-lucide-x" class="size-5" />
        </button>

        <p class="pointer-events-none fixed bottom-4 whitespace-nowrap left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1.5 text-center text-xs text-white/80">
          دو بار بزنید یا با دو انگشت زوم کنید
        </p>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.35s ease-in-out;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
</style>
