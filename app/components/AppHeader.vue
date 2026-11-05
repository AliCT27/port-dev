<script setup lang="ts">
const scrolled = ref(false)

// مکثِ کوتاه بعد از کلیک و قبل از شروعِ اسکرول: تنظیمش (روشن/خاموش و مدت) توی composables/useSectionScroll.ts هست
// و برای هدر و بقیه‌ی دکمه‌های صفحه مشترکه
// مدتِ حرکتِ اسکرول دکمه‌های هدر متناسب با فاصله حساب میشه (با easeInOutCubic):
// مدت = پایه + فاصله ÷ سرعت، و بعد بین کمینه و بیشینه محدود میشه (ثانیه)
const SCROLL_BASE_S = 0.6
const SCROLL_PX_PER_S = 2500
const SCROLL_MIN_S = 0.8
const SCROLL_MAX_S = 2.2

function scrollDurationFor(distancePx: number) {
  const raw = SCROLL_BASE_S + distancePx / SCROLL_PX_PER_S
  return Math.min(SCROLL_MAX_S, Math.max(SCROLL_MIN_S, raw))
}
const nuxtApp = useNuxtApp()
let navTimer: ReturnType<typeof setTimeout> | null = null

const navItems = [
  { href: '/#hero', label: 'خانه' },
  { href: '/#about', label: 'درباره ما' },
  // short: متنِ کوتاه‌تر برای موبایل، تا شش آیتم بدون اسکرول افقی جا بشن
  { href: '/#testimonials', label: 'نمونه‌کار و نظرات', short: 'نظرات' },
  { href: '/#features', label: 'امکانات' },
  { href: '/#faq', label: 'سوالات' },
  { href: '/#contact', label: 'تماس' }
]

const activeId = ref('hero')

const lastSectionId = navItems[navItems.length - 1]!.href.split('#')[1]!

// ته صفحه‌ایم؟ (۴ پیکسل تلورانس برای اعشار و رُند‌شدن مرورگر)
function isAtBottom() {
  return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
}

// بخش فعال = آخرین بخشی که بالاش از «خط مرجع» رد شده. خط مرجع یه جایی بین بالا و وسط صفحه‌ست (کسری از ارتفاع صفحه‌نمایش)؛
// این‌جوری طول بخش‌ها اهمیتی نداره و بخش‌های کوتاه (مثل درباره‌ی ما) هم سر وقت فعال میشن. عدد کمتر = زودتر فعال میشه
const ACTIVE_LINE_RATIO = 0.4
const sectionIds = navItems.map((item) => item.href.split('#')[1]!)

function pickActive() {
  // بخش آخر (تماس) کوتاه‌تر از صفحه‌ست و هیچ‌وقت بالای صفحه نمیاد؛ پس وقتی به ته رسیدیم، اون برنده‌ست
  if (isAtBottom()) {
    activeId.value = lastSectionId
    return
  }

  const line = window.innerHeight * ACTIVE_LINE_RATIO
  let current = sectionIds[0]!
  for (const id of sectionIds) {
    const el = document.getElementById(id)
    if (el && el.getBoundingClientRect().top <= line) current = id
  }
  activeId.value = current
}

function handleScroll() {
  scrolled.value = window.scrollY > 24
  pickActive()
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

function scrollToTop(e: MouseEvent) {
  e.preventDefault()

  setTimeout(() => {
    const startY = window.scrollY
    if (startY === 0) return

    const duration = 1000
    const startTime = performance.now()

    function step(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeInOutCubic(progress)
      window.scrollTo({ top: startY * (1 - eased), behavior: 'auto' })
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, clickPause())
}

function goToSection(href: string) {
  const id = href.split('#')[1]
  if (!id) return

  // اگه کلیک پشت‌سرهم بود، فقط آخرین کلیک اعتبار داره
  if (navTimer) clearTimeout(navTimer)

  navTimer = setTimeout(() => {
    const target = document.getElementById(id)
    if (!target) return

    const lenis = (nuxtApp as any).$lenis
    if (lenis) {
      const distance = Math.abs(target.getBoundingClientRect().top)
      lenis.scrollTo(target, { duration: scrollDurationFor(distance), easing: easeInOutCubic })
    } else {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }, clickPause())
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  handleScroll()

  window.addEventListener('resize', pickActive, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', pickActive)
  if (navTimer) clearTimeout(navTimer)
})
</script>

<template>
  <div class="fixed inset-x-0 top-3 z-50 mx-auto w-fit sm:top-5">
    <nav
      class="flex max-w-[94vw] items-center gap-0 overflow-x-auto rounded-xl border border-black/10 bg-white/80 px-1.5 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shadow-lg shadow-black/5 backdrop-blur-md sm:gap-1 sm:px-3 sm:py-1 dark:border-white/10 dark:bg-dark/80 dark:shadow-black/20"
    >
      <a
        v-for="item in navItems"
        :key="item.href"
        :href="item.href"
        @click.prevent.stop="goToSection(item.href)"
        class="whitespace-nowrap rounded-lg px-2 py-2 text-[11px] font-semibold min-[400px]:px-2.5 min-[400px]:text-xs transition-all duration-500 ease-in-out sm:px-3 sm:py-2 sm:text-sm"
        :class="activeId === item.href.split('#')[1]
          ? 'bg-black/10 text-black shadow-sm dark:bg-white/15 dark:text-white'
          : 'text-black/70 hover:bg-black/10 hover:text-black hover:shadow-sm dark:text-white/70 dark:hover:bg-white/15 dark:hover:text-white'"
      >
        <template v-if="item.short">
          <span class="sm:hidden">{{ item.short }}</span>
          <span class="hidden sm:inline">{{ item.label }}</span>
        </template>
        <template v-else>{{ item.label }}</template>
      </a>

    </nav>
  </div>

  <Transition name="fade-scale">
    <button
      v-if="scrolled"
      type="button"
      class="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-xl border border-black bg-black text-white shadow-2xl transition-all duration-500 ease-in-out hover:-translate-y-1 dark:border-white dark:bg-white dark:text-black"
      aria-label="برو بالا"
      @click="scrollToTop"
    >
      <UIcon name="i-lucide-arrow-up" class="size-5" />
    </button>
  </Transition>
</template>

<style scoped>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.85) translateY(6px);
}
.fade-scale-enter-to,
.fade-scale-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}
</style>
