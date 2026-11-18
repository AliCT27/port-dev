<script setup lang="ts">
const props = defineProps<{ item: any }>()
const emit = defineEmits<{ open: [] }>()

const fa = (n: number) => n.toLocaleString('fa-IR')

// ---- bakhsh-hayi ke hanuz amade nistan (video, matn-e nazar, tasavir) be-jashun ye kadr-e «be-zudi» neshun dade mishe ----
// matn-e nazar: bedane-ye file-e md khali bashe yani hanuz neveshte nashode
const hasText = computed(() => (props.item.body?.value?.length ?? 0) > 0)
// file-e video ya tasvir too frontmatter neveshte shode vali hanuz too pooshe-ye public gozashte nashode; be-jaye link-e shekaste hamun kadr-e «be-zudi» neshun dade mishe
const videoFailed = ref(false)
const shotFailed = ref(false)
const showVideo = computed(() => !!props.item.video && !videoFailed.value)
const showShot = computed(() => !!props.item.images?.length && !shotFailed.value)

// khat-e zir-e esm: naqsh va sherkat, harkodum ke bud
const subtitle = computed(() => [props.item.role, props.item.company].filter(Boolean).join(' · '))

// ---- peymayesh-e khodkar-e tasvir-e site moqe-e hover (az bala ta entehaye tasvir) ----
// sor'at-e harekat be paein (pixel bar saniye); kamtaresh koni narm-tar va kond-tar mishe
const PAN_PX_PER_S = 220
const PAN_MIN_S = 1.2
const PAN_MAX_S = 8
// sor'at-e bargasht be bala (ba'd az bardashtan-e mouse); in ham motenaseb ba fasele-i-e ke ta bala munde
const RESET_PX_PER_S = 300
const RESET_MIN_S = 0.9
const RESET_MAX_S = 6

const shotBox = ref<HTMLElement | null>(null)
const shotImg = ref<HTMLImageElement | null>(null)

// tasvir hamin alan chand (be pixel) be samt-e bala rafte; hata vasat-e animation
function currentOffset() {
  const img = shotImg.value
  if (!img) return 0
  const t = getComputedStyle(img).transform
  if (!t || t === 'none') return 0
  return Math.abs(new DOMMatrix(t).m42)
}

// harekat-e tasvir be offset-e delkhah ba moddat va monhani-ye moshakhas.
// aval tasvir ro rooye noqte-ye fe'li «sabet» mikonim; vagarna vaqti transition nime-kare barakhs beshe,
// morurgar moddat ro be andaze-ye masir-e tey-shode kutah mikone va bargasht-e joz'i kheili sari'-tar az bargasht-e kamel mishe
function panTo(targetPx: number, seconds: number, easing: string) {
  const img = shotImg.value
  if (!img) return
  const now = currentOffset()
  img.style.transitionDuration = '0s'
  img.style.transform = `translateY(-${now}px)`
  void img.offsetHeight // ejbar be e'mal-e style-e sabet qabl az shoru-e harekat-e jadid
  img.style.transitionTimingFunction = easing
  img.style.transitionDuration = `${seconds}s`
  img.style.transform = `translateY(-${targetPx}px)`
}

function panStart() {
  const box = shotBox.value
  const img = shotImg.value
  if (!box || !img) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  // chaqadar az tasvir biroon-e kadr munde (tasvir boland-tar az kadr-e)
  const overflow = img.offsetHeight - box.clientHeight
  if (overflow <= 4) return

  // moddat ro az fasele-ye baqi-munde hesab mikonim (age vasat-e bargasht dobare mouse omad)
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

// ---- lams (mobile): negah-dashtan-e angosht rooye tasvir = hamun peymayesh-e hover; bardashtan-e angosht = bargasht be bala ----
// age angosht qabl az in moddat bardashte beshe, faqat ye "tap" hesab mishe va gallery baz mishe
const TOUCH_HOLD_MS = 180
// age angosht bishtar az in (pixel) jabeja beshe, yani karbar dare safhe ro scroll mikone na negah-dashtan
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

// ba'd az negah-dashtan (baraye didan-e tasvir), bardashtan-e angosht nabayad gallery ro baz kone; faqat tap-e kutah baz mikone
function onShotClick() {
  if (heldByTouch) {
    heldByTouch = false
    return
  }
  emit('open')
}

onBeforeUnmount(clearTouchTimer)

const videoEl = ref<HTMLVideoElement | null>(null)
// video-haye amudi (story) too kadr-e 16:9 navar-e siyah daran; pas baraye amudi-ha kadr va chideman-e joda darim (pish-farz amudi)
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
  // age khata qabl az amade-shodan-e safhe (hydration) ettefaq oftade bashe ruydadash az dast rafte; inja dobare check mishe
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
  <article class="group flex h-full flex-col rounded-2xl border p-5 transition-colors duration-500 ease-in-out md:hover:border-brand border-fg/10 bg-card">
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
        class="flex aspect-[9/16] w-full max-w-[10rem] shrink-0 flex-col items-center justify-center gap-2 self-center rounded-xl p-4 text-center md:self-start border border-dashed border-fg/15 bg-card text-fg/40"
      >
        <UIcon name="i-lucide-video" class="size-6" />
        <span class="text-xs font-bold leading-6">ویدیوی رضایت کارفرما<br>به‌زودی اضافه می‌شه</span>
      </div>
      <div class="flex min-w-0 flex-1 flex-col">
        <div class="mb-2.5 flex items-center gap-3">
          <!-- border ba ::after rooye aks keshide mishe ta bein-e qab va aks dorz-e roshan nayofte -->
          <div class="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-dark text-sm font-bold after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:border-2 after:border-fg">
            <img v-if="item.avatar" :src="item.avatar" :alt="item.name" width="400" height="400" class="h-full w-full object-cover">
            <span v-else>{{ item.name.charAt(0) }}</span>
          </div>
          <div>
            <p class="font-bold">{{ item.name }}</p>
            <p v-if="subtitle" class="text-sm text-fg/65">{{ subtitle }}</p>
          </div>
        </div>
        <ContentRenderer v-if="hasText" :value="item" class="prose prose-sm dark:prose-invert max-w-none flex-1 leading-7 text-fg/80" />
        <p v-else class="rounded-xl p-4 text-sm leading-7 border border-dashed border-fg/15 bg-card text-fg/40">نظر کارفرما به‌زودی اضافه می‌شه.</p>

      </div>
    </div>

    <button
      v-if="showShot"
      type="button"
      class="group/shot mt-4 block w-full overflow-hidden rounded-xl border text-start transition-colors duration-500 ease-in-out hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand border-fg/10 bg-panel"
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
      <span class="flex items-center justify-between gap-2 border-t px-3 py-2 text-sm font-bold border-fg/10 bg-page">
        مشاهده تصاویر سایت
        <UIcon name="i-lucide-zoom-in" class="size-4 text-brand-ink" />
      </span>
    </button>
    <!-- kadr-e «be-zudi»: na navar-e paein dare na zarrebin; vali ertefa'esh daqiqan ham-andaze-ye kart-e tasvir-e (navar-e namarei faqat ertefa' ro negah midare) ta kart-ha yekdast bemunan -->
    <div
      v-else
      class="relative mt-4 block w-full select-none overflow-hidden rounded-xl border border-dashed border-fg/15 bg-card text-fg/40"
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
      class="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-brand-ink"
    >
      <UIcon name="i-lucide-external-link" class="size-3.5" />
      مشاهده سایت کارفرمای عزیز
    </a>
  </article>
</template>
