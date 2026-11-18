<script setup lang="ts">
interface Project {
  title: string
  url?: string
  images: string[]
}

const props = defineProps<{ project: Project | null }>()
const emit = defineEmits<{ close: [] }>()

const nuxtApp = useNuxtApp()

// akharin proje ro negah midarim ta moqe-e animation-e baste-shodan, mohtava napare
const current = ref<Project | null>(props.project)
const index = ref(0)
const bodyEl = ref<HTMLElement | null>(null)
const closeBtn = ref<HTMLButtonElement | null>(null)
let lastFocused: HTMLElement | null = null

const total = computed(() => current.value?.images.length ?? 0)
const src = computed(() => current.value?.images[index.value] ?? '')

const fa = (n: number) => n.toLocaleString('fa-IR')

function go(step: number) {
  if (total.value < 2) return
  index.value = (index.value + step + total.value) % total.value
}

// ---- swipe-e lamsi (mobile): keshidan-e angosht be chap/rast = tasvir-e ba'di/qabli; keshidan-e amudi hamun scroll-e dakheli-ye tasvir mimune ----
// hadaqal-e jabejayi-ye ofoqi (pixel) baraye inke ba keshidan-e aroom ham swipe hesab beshe
const SWIPE_THRESHOLD = 70
// ya age tond va kutah keshide shod (flick): hadaqal-e sor'at (pixel bar milisaniye) va hadaqal-e jabejayi
const FLICK_SPEED = 0.45
const FLICK_MIN_DISTANCE = 25
// moddat va shetab-e harekat-e slide bein-e tasavir (harchi bishtar, aroom-tar)
const SLIDE_MS = 450
const SLIDE_EASING = 'cubic-bezier(0.25, 0.8, 0.25, 1)'

const dragX = ref(0)
const dragging = ref(false)
let startX = 0
let startY = 0
let startTime = 0
let activePointer: number | null = null
let axis: '' | 'x' | 'y' = ''

// keshidan ba angosht (mobile) ya mouse (desktop) — har do ba pointer events
function onPointerDown(e: PointerEvent) {
  if (e.pointerType === 'mouse' && e.button !== 0) return
  activePointer = e.pointerId
  startX = e.clientX
  startY = e.clientY
  startTime = performance.now()
  axis = ''
}

function onPointerMove(e: PointerEvent) {
  if (e.pointerId !== activePointer || axis === 'y') return
  const dx = e.clientX - startX
  const dy = e.clientY - startY
  // jahat-e harekat ro yek-bar tashkhis midim ta scroll-e amudi va swipe-e ofoqi ba ham qati nashan
  if (!axis && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
    axis = Math.abs(dx) > Math.abs(dy) * 1.2 ? 'x' : 'y'
    // ta angosht/mouse az kadr biroon ham raft, keshidan edame peyda kone
    if (axis === 'x') bodyEl.value?.setPointerCapture(e.pointerId)
  }
  if (axis !== 'x') return
  dragging.value = true
  // avval va akhar-e gallery (ya faqat ye tasvir): keshidan moqavemat dare va jayi nemire
  const atEdge = total.value < 2 || (index.value === 0 && dx > 0) || (index.value === total.value - 1 && dx < 0)
  dragX.value = atEdge ? dx * 0.25 : dx
}

function onPointerEnd(e: PointerEvent) {
  if (e.pointerId !== activePointer) return
  if (axis === 'x' && total.value > 1) {
    const dx = dragX.value
    const speed = Math.abs(dx) / Math.max(1, performance.now() - startTime)
    const passed = Math.abs(dx) > SWIPE_THRESHOLD || (speed > FLICK_SPEED && Math.abs(dx) > FLICK_MIN_DISTANCE)
    // keshidan be chap = tasvir-e ba'di, be rast = tasvir-e qabli (rooye avval/akhar rad nemishe)
    if (passed && dx < 0 && index.value < total.value - 1) index.value++
    else if (passed && dx > 0 && index.value > 0) index.value--
  }
  if (bodyEl.value?.hasPointerCapture(e.pointerId)) bodyEl.value.releasePointerCapture(e.pointerId)
  dragX.value = 0
  dragging.value = false
  axis = ''
  activePointer = null
}

// scroll-e ofoqi-ye touchpad (do angosht chap/rast) ya mouse-e ofoqi: yek slide be azaye har harekat
const WHEEL_THRESHOLD = 40
const WHEEL_COOLDOWN_MS = 500
let wheelLockedUntil = 0

function onWheel(e: WheelEvent) {
  // faqat vaqti harekat-e ofoqi qalebe; scroll-e amudi-ye tasvir dast-nakhorde mimune
  if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || total.value < 2) return
  e.preventDefault()
  const now = performance.now()
  if (now < wheelLockedUntil || Math.abs(e.deltaX) < WHEEL_THRESHOLD) return
  wheelLockedUntil = now + WHEEL_COOLDOWN_MS
  if (e.deltaX > 0 && index.value < total.value - 1) index.value++
  else if (e.deltaX < 0 && index.value > 0) index.value--
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
  // gallery chap-be-rast-e (dir="ltr"), pas feshe-ye rast = ba'di
  else if (e.key === 'ArrowRight') go(1)
  else if (e.key === 'ArrowLeft') go(-1)
}

function lock() {
  lastFocused = document.activeElement as HTMLElement | null
  // scroll-e safhe-ye posht-e modal motevaqef mishe (Lenis); dakhel-e modal ba data-lenis-prevent scroll azade
  ;(nuxtApp as any).$lenis?.stop()
  window.addEventListener('keydown', onKey)
  nextTick(() => closeBtn.value?.focus())
}

function unlock() {
  ;(nuxtApp as any).$lenis?.start()
  window.removeEventListener('keydown', onKey)
  lastFocused?.focus?.()
  lastFocused = null
}

watch(
  () => props.project,
  (p, old) => {
    if (p) {
      current.value = p
      index.value = 0
      if (!old) lock()
    } else if (old) {
      unlock()
    }
  }
)

// ba avaz-shodan-e tasvir, scroll-e dakheli bargarde bala va tasvir-e ba'di az qabl load beshe
watch(index, () => {
  bodyEl.value?.scrollTo({ top: 0 })
  if (!current.value || total.value < 2) return
  const next = current.value.images[(index.value + 1) % total.value]
  if (next) new Image().src = next
})

onBeforeUnmount(() => {
  if (props.project) unlock()
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="project && current"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6"
        role="dialog"
        aria-modal="true"
        :aria-label="current.title"
        @click.self="emit('close')"
      >
        <div class="modal-panel relative flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-fg/10 bg-page text-fg shadow-2xl">
          <div class="flex shrink-0 items-center justify-between gap-3 border-b border-fg/10 px-4 py-3 sm:px-5">
            <div class="flex min-w-0 items-center gap-3">
              <h3 class="truncate text-sm font-bold sm:text-base">{{ current.title }}</h3>
              <span
                v-if="total > 1"
                dir="ltr"
                class="shrink-0 rounded-md bg-fg/10 px-2.5 py-0.5 text-xs tabular-nums text-fg/70"
              >
                {{ fa(index + 1) }} / {{ fa(total) }}
              </span>
            </div>

            <div class="flex shrink-0 items-center gap-2">
              <a
                v-if="current.url"
                :href="current.url"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3 py-1.5 text-xs font-bold text-black transition-all duration-500 ease-in-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/30"
              >
                مشاهده سایت
                <UIcon name="i-lucide-external-link" class="size-3.5" />
              </a>
              <button
                ref="closeBtn"
                type="button"
                aria-label="بستن"
                class="flex size-8 items-center justify-center rounded-full text-fg/70 transition-colors duration-300 hover:bg-fg/10 hover:text-fg"
                @click="emit('close')"
              >
                <UIcon name="i-lucide-x" class="size-5" />
              </button>
            </div>
          </div>

          <div class="relative flex min-h-0 flex-1 flex-col">
            <div
              ref="bodyEl"
              data-lenis-prevent
              role="region"
              aria-label="تصاویر سایت"
              tabindex="0"
              dir="ltr"
              class="min-h-0 flex-1 touch-pan-y overflow-x-hidden overflow-y-auto overscroll-contain bg-black"
              :class="dragging ? 'cursor-grabbing' : total > 1 ? 'cursor-grab' : ''"
              @pointerdown="onPointerDown"
              @pointermove="onPointerMove"
              @pointerup="onPointerEnd"
              @pointercancel="onPointerEnd"
              @wheel="onWheel"
            >
              <!-- navar-e slide: hame-ye tasavir kenar-e ham, ba jabejayi-ye narm va donbal-kardan-e angosht -->
              <div
                class="flex w-full items-start"
                :style="{
                  transform: `translateX(calc(${-index * 100}% + ${dragX}px))`,
                  transition: dragging ? 'none' : `transform ${SLIDE_MS}ms ${SLIDE_EASING}`
                }"
              >
                <img
                  v-for="(img, i) in current.images"
                  :key="img"
                  :src="img"
                  :alt="`${current.title} — تصویر ${fa(i + 1)}`"
                  class="block w-full shrink-0 select-none"
                  draggable="false"
                  decoding="async"
                  :loading="i === 0 ? 'eager' : 'lazy'"
                >
              </div>
            </div>

            <template v-if="total > 1">
              <button
                type="button"
                aria-label="تصویر قبلی"
                class="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-colors duration-300 hover:bg-brand hover:text-black"
                @click="go(-1)"
              >
                <UIcon name="i-lucide-chevron-left" class="size-5" />
              </button>
              <button
                type="button"
                aria-label="تصویر بعدی"
                class="absolute right-5 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-colors duration-300 hover:bg-brand hover:text-black"
                @click="go(1)"
              >
                <UIcon name="i-lucide-chevron-right" class="size-5" />
              </button>
            </template>
          </div>

          <div
            v-if="total > 1"
            data-lenis-prevent
            dir="ltr"
            class="flex shrink-0 gap-2 overflow-x-auto overflow-y-hidden border-t border-fg/10 p-3"
          >
            <button
              v-for="(img, i) in current.images"
              :key="img"
              type="button"
              :aria-label="`تصویر ${fa(i + 1)}`"
              class="size-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-300"
              :class="i === index ? 'border-brand' : 'border-fg/10 opacity-60 hover:opacity-100'"
              @click="index = i"
            >
              <img :src="img" alt="" class="h-full w-full object-cover object-top" loading="lazy" decoding="async">
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.35s ease-in-out;
}
.modal-enter-active .modal-panel,
.modal-leave-active .modal-panel {
  transition: transform 0.35s ease-in-out;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-panel,
.modal-leave-to .modal-panel {
  transform: scale(0.96) translateY(8px);
}

</style>
