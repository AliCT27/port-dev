<script setup lang="ts">
const props = defineProps<{ item: any }>()
const emit = defineEmits<{ open: [] }>()

const fa = (n: number) => n.toLocaleString('fa-IR')

// ---- بخش‌هایی که هنوز آماده نیستن (ویدیو، متن نظر، تصاویر) به‌جاشون یه کادرِ «به‌زودی» نشون داده میشه ----
// متنِ نظر: بدنه‌ی فایل md خالی باشه یعنی هنوز نوشته نشده
const hasText = computed(() => (props.item.body?.value?.length ?? 0) > 0)
// فایلِ ویدیو یا تصویر تو فرانت‌مَتر نوشته شده ولی هنوز تو پوشه‌ی public گذاشته نشده؛ به‌جای لینکِ شکسته همون کادرِ «به‌زودی» نشون داده میشه
const videoFailed = ref(false)
const shotFailed = ref(false)
const showVideo = computed(() => !!props.item.video && !videoFailed.value)
const showShot = computed(() => !!props.item.images?.length && !shotFailed.value)

// خطِ زیرِ اسم: نقش و شرکت، هرکدوم که بود
const subtitle = computed(() => [props.item.role, props.item.company].filter(Boolean).join(' · '))

// ---- پیمایشِ خودکارِ تصویر سایت موقع هاور (از بالا تا انتهای تصویر) ----
// سرعت حرکت رو به پایین (پیکسل بر ثانیه)؛ کمترش کنی نرم‌تر و کندتر میشه
const PAN_PX_PER_S = 220
const PAN_MIN_S = 1.2
const PAN_MAX_S = 8
// سرعت برگشت به بالا (بعد از برداشتن موس)؛ این هم متناسب با فاصله‌ایه که تا بالا مونده
const RESET_PX_PER_S = 300
const RESET_MIN_S = 0.9
const RESET_MAX_S = 6

const shotBox = ref<HTMLElement | null>(null)
const shotImg = ref<HTMLImageElement | null>(null)

// تصویر همین الان چقدر (به پیکسل) به سمت بالا رفته؛ حتی وسطِ انیمیشن
function currentOffset() {
  const img = shotImg.value
  if (!img) return 0
  const t = getComputedStyle(img).transform
  if (!t || t === 'none') return 0
  return Math.abs(new DOMMatrix(t).m42)
}

// حرکت تصویر به offset دلخواه با مدت و منحنی مشخص.
// اول تصویر رو روی نقطه‌ی فعلی «ثابت» می‌کنیم؛ وگرنه وقتی ترنزیشن نیمه‌کاره برعکس بشه،
// مرورگر مدت رو به اندازه‌ی مسیر طی‌شده کوتاه می‌کنه و برگشتِ جزئی خیلی سریع‌تر از برگشتِ کامل میشه
function panTo(targetPx: number, seconds: number, easing: string) {
  const img = shotImg.value
  if (!img) return
  const now = currentOffset()
  img.style.transitionDuration = '0s'
  img.style.transform = `translateY(-${now}px)`
  void img.offsetHeight // اجبار به اعمال استایل ثابت قبل از شروع حرکت جدید
  img.style.transitionTimingFunction = easing
  img.style.transitionDuration = `${seconds}s`
  img.style.transform = `translateY(-${targetPx}px)`
}

function panStart() {
  const box = shotBox.value
  const img = shotImg.value
  if (!box || !img) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  // چقدر از تصویر بیرون کادر مونده (تصویر بلندتر از کادره)
  const overflow = img.offsetHeight - box.clientHeight
  if (overflow <= 4) return

  // مدت رو از فاصله‌ی باقی‌مونده حساب می‌کنیم (اگه وسط برگشت دوباره موس اومد)
  const remaining = Math.max(0, overflow - currentOffset())
  const seconds = Math.min(PAN_MAX_S, Math.max(PAN_MIN_S, remaining / PAN_PX_PER_S))
  panTo(overflow, seconds, 'ease-in-out')
}

function panReset() {
  const offset = currentOffset()
  if (offset < 1) {
    panTo(0, 0.3, 'ease-out')
    return
  }

  const seconds = Math.min(RESET_MAX_S, Math.max(RESET_MIN_S, offset / RESET_PX_PER_S))
  panTo(0, seconds, 'ease-in-out')
}

// ---- لمس (موبایل): نگه‌داشتن انگشت روی تصویر = همون پیمایشِ هاور؛ برداشتن انگشت = برگشت به بالا ----
// اگه انگشت قبل از این مدت برداشته بشه، فقط یه "تپ" حساب میشه و گالری باز میشه
const TOUCH_HOLD_MS = 180
// اگه انگشت بیشتر از این (پیکسل) جابه‌جا بشه، یعنی کاربر داره صفحه رو اسکرول می‌کنه نه نگه‌داشتن
const TOUCH_MOVE_TOLERANCE = 10
let touchTimer: ReturnType<typeof setTimeout> | null = null
let touchStartX = 0
let touchStartY = 0
let heldByTouch = false

function clearTouchTimer() {
  if (touchTimer) {
    clearTimeout(touchTimer)
    touchTimer = null
  }
}

function onTouchStart(e: TouchEvent) {
  const t = e.touches[0]
  if (!t) return
  touchStartX = t.clientX
  touchStartY = t.clientY
  heldByTouch = false
  clearTouchTimer()
  touchTimer = setTimeout(() => {
    heldByTouch = true
    panStart()
  }, TOUCH_HOLD_MS)
}

function onTouchMove(e: TouchEvent) {
  const t = e.touches[0]
  if (!t) return
  if (Math.abs(t.clientX - touchStartX) > TOUCH_MOVE_TOLERANCE || Math.abs(t.clientY - touchStartY) > TOUCH_MOVE_TOLERANCE) {
    clearTouchTimer()
    if (heldByTouch) {
      heldByTouch = false
      panReset()
    }
  }
}

function onTouchEnd() {
  clearTouchTimer()
  if (heldByTouch) panReset()
}

// بعد از نگه‌داشتن (برای دیدن تصویر)، برداشتن انگشت نباید گالری رو باز کنه؛ فقط تپِ کوتاه باز می‌کنه
function onShotClick() {
  if (heldByTouch) {
    heldByTouch = false
    return
  }
  emit('open')
}

onBeforeUnmount(clearTouchTimer)

const videoEl = ref<HTMLVideoElement | null>(null)
// ویدیوهای عمودی (استوری) تو کادر ۱۶:۹ نوار سیاه دارن؛ پس برای عمودی‌ها کادر و چیدمان جدا داریم (پیش‌فرض عمودی)
const portrait = ref(true)
const playing = ref(false)
const muted = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const progress = computed(() => (duration.value ? (currentTime.value / duration.value) * 100 : 0))

function togglePlay() {
  if (!videoEl.value) return
  videoEl.value.paused ? videoEl.value.play() : videoEl.value.pause()
}
function onTimeUpdate() {
  if (!videoEl.value) return
  const { videoWidth: w, videoHeight: h } = videoEl.value
  if (w && h) portrait.value = h > w
  currentTime.value = videoEl.value.currentTime
  duration.value = videoEl.value.duration || 0
}
function toggleMute() {
  if (!videoEl.value) return
  videoEl.value.muted = !videoEl.value.muted
  muted.value = videoEl.value.muted
}
function seek(e: MouseEvent) {
  if (!videoEl.value || !duration.value) return
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  videoEl.value.currentTime = ((e.clientX - rect.left) / rect.width) * duration.value
}
function toggleFullscreen() {
  videoEl.value?.requestFullscreen?.()
}
onMounted(() => {
  // اگه خطا قبل از آماده‌شدنِ صفحه (hydration) اتفاق افتاده باشه رویدادش از دست رفته؛ اینجا دوباره چک میشه
  const img = shotImg.value
  if (img && img.complete && img.naturalWidth === 0) shotFailed.value = true
  const v = videoEl.value
  if (v && (v.error || v.networkState === 3)) videoFailed.value = true
})

function formatTime(t: number) {
  if (!isFinite(t)) return '0:00'
  return `${Math.floor(t / 60)}:${Math.floor(t % 60).toString().padStart(2, '0')}`
}
</script>

<template>
  <article class="group flex h-full flex-col rounded-2xl border p-5 transition-colors duration-500 ease-in-out md:hover:border-brand border-white/10 bg-white/[0.03]">
    <div
      class="flex flex-1 flex-col gap-4"
      :class="portrait ? 'md:flex-row md:items-start' : ''"
    >
      <div v-if="showVideo" dir="ltr" :class="portrait ? 'aspect-[9/16] w-full max-w-[10rem] self-center md:self-start' : 'aspect-video w-full'" class="group/player relative shrink-0 overflow-hidden rounded-xl bg-black">
        <video
          ref="videoEl"
          :src="item.video"
          preload="metadata"
          playsinline
          class="h-full w-full cursor-pointer object-cover [&:fullscreen]:bg-black [&:fullscreen]:object-contain"
          @click="togglePlay"
          @play="playing = true"
          @pause="playing = false"
          @ended="playing = false"
          @timeupdate="onTimeUpdate"
          @loadedmetadata="onTimeUpdate"
          @error="videoFailed = true"
        />

        <button
          v-if="!playing"
          type="button"
          aria-label="پخش ویدیو"
          class="absolute inset-0 flex items-center justify-center bg-black/45 transition-colors duration-300 hover:bg-black/55"
          @click="togglePlay"
        >
          <span class="relative flex items-center justify-center">
            <span class="absolute size-14 animate-ping rounded-full bg-brand/50" />
            <span class="relative flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-brand to-emerald-600 text-black shadow-2xl shadow-brand/40 ring-4 ring-brand/20 transition-transform duration-300 hover:scale-110">
              <UIcon name="i-lucide-play" class="size-6 translate-x-0.5" />
            </span>
          </span>
        </button>

        <div class="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-3 pb-2 pt-6">
          <button type="button" :aria-label="playing ? 'توقف ویدیو' : 'پخش ویدیو'" class="text-white/90 transition-colors hover:text-brand" @click.stop="togglePlay">
            <UIcon :name="playing ? 'i-lucide-pause' : 'i-lucide-play'" class="size-4" />
          </button>

          <div class="relative h-1 flex-1 cursor-pointer rounded-full bg-white/25" @click.stop="seek">
            <div class="absolute inset-y-0 left-0 rounded-full bg-brand" :style="{ width: progress + '%' }" />
          </div>

          <span class="w-9 shrink-0 text-[10px] tabular-nums text-white/80">{{ formatTime(currentTime) }}</span>

          <button type="button" :aria-label="muted ? 'پخش صدا' : 'بی‌صدا کردن'" class="text-white/90 transition-colors hover:text-brand" @click.stop="toggleMute">
            <UIcon :name="muted ? 'i-lucide-volume-x' : 'i-lucide-volume-2'" class="size-4" />
          </button>

          <button type="button" aria-label="تمام‌صفحه" class="text-white/90 transition-colors hover:text-brand" @click.stop="toggleFullscreen">
            <UIcon name="i-lucide-maximize" class="size-4" />
          </button>
        </div>
      </div>
      <div
        v-else
        class="flex aspect-[9/16] w-full max-w-[10rem] shrink-0 flex-col items-center justify-center gap-2 self-center rounded-xl p-4 text-center md:self-start border border-dashed border-white/15 bg-white/[0.02] text-white/40"
      >
        <UIcon name="i-lucide-video" class="size-6" />
        <span class="text-xs font-bold leading-6">ویدیوی رضایت کارفرما<br>به‌زودی اضافه می‌شه</span>
      </div>
      <div class="flex min-w-0 flex-1 flex-col">
        <div class="mb-2.5 flex items-center gap-3">
          <div class="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 text-sm font-bold border-white bg-neutral-900">
            <img v-if="item.avatar" :src="item.avatar" :alt="item.name" width="400" height="400" class="h-full w-full object-cover">
            <span v-else>{{ item.name.charAt(0) }}</span>
          </div>
          <div>
            <p class="font-bold">{{ item.name }}</p>
            <p v-if="subtitle" class="text-sm text-white/65">{{ subtitle }}</p>
          </div>
        </div>
        <ContentRenderer v-if="hasText" :value="item" class="prose prose-sm prose-invert max-w-none flex-1 leading-7 text-white/80" />
        <p v-else class="rounded-xl p-4 text-sm leading-7 border border-dashed border-white/15 bg-white/[0.02] text-white/40">نظر کارفرما به‌زودی اضافه می‌شه.</p>

      </div>
    </div>

    <button
      v-if="showShot"
      type="button"
      class="group/shot mt-4 block w-full overflow-hidden rounded-xl border text-start transition-colors duration-500 ease-in-out hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand border-white/10 bg-neutral-900"
      :aria-label="`مشاهده تصاویر سایت ${item.company ?? item.name}`"
      @click="onShotClick"
      @contextmenu.prevent
    >
      <span
        ref="shotBox"
        class="relative block aspect-[16/9] overflow-hidden"
        @mouseenter="panStart"
        @mouseleave="panReset"
        @touchstart.passive="onTouchStart"
        @touchmove.passive="onTouchMove"
        @touchend="onTouchEnd"
        @touchcancel="onTouchEnd"
      >
        <img
          ref="shotImg"
          :src="item.images[0]"
          :alt="`تصویر سایت ${item.company ?? item.name}`"
          class="pointer-events-none block min-h-full w-full select-none object-cover object-top transition-transform will-change-transform [-webkit-touch-callout:none]"
          draggable="false"
          loading="lazy"
          decoding="async"
          @error="shotFailed = true"
        >
        <span
          v-if="item.images.length > 1"
          class="absolute start-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur"
        >
          <UIcon name="i-lucide-images" class="size-3.5" />
          {{ fa(item.images.length) }} تصویر
        </span>
      </span>
      <span class="flex items-center justify-between gap-2 border-t px-3 py-2 text-sm font-bold border-white/10 bg-dark">
        مشاهده تصاویر سایت
        <UIcon name="i-lucide-zoom-in" class="size-4 text-brand" />
      </span>
    </button>
    <!-- کادرِ «به‌زودی»: نه نوارِ پایین داره نه ذره‌بین؛ ولی ارتفاعش دقیقاً هم‌اندازه‌ی کارتِ تصویره (نوارِ نامرئی فقط ارتفاع رو نگه می‌داره) تا کارت‌ها یکدست بمونن -->
    <div
      v-else
      class="relative mt-4 block w-full select-none overflow-hidden rounded-xl border border-dashed border-white/15 bg-white/[0.02] text-white/40"
    >
      <span class="block aspect-[16/9]" aria-hidden="true" />
      <span class="invisible flex items-center border-t px-3 py-2 text-sm font-bold" aria-hidden="true">&nbsp;<UIcon name="i-lucide-zoom-in" class="size-4" /></span>
      <span class="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
        <UIcon name="i-lucide-image" class="size-8" />
        <span class="text-sm font-bold">تصاویر سایت به‌زودی اضافه می‌شه</span>
      </span>
    </div>

    <a
      v-if="item.website"
      :href="item.website"
      target="_blank"
      rel="noopener"
      class="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-brand"
    >
      <UIcon name="i-lucide-external-link" class="size-3.5" />
      مشاهده سایت کارفرمای عزیز
    </a>
  </article>
</template>
