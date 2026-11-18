<script setup lang="ts">
const scrolled = ref(false)

// taghir-e halat-e shab/rooz; entekhab-e karbar too morurgarash zakhire mishe (pish-farz: shab)
const colorMode = useColorMode()
async function toggleColorMode(e: MouseEvent) {
  const next = colorMode.value === 'dark' ? 'light' : 'dark'
  const root = document.documentElement
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // morurgar-e qadimi ya karbari ke animation ro khamush karde: taghir-e sade va fori
  if (!document.startViewTransition || reduce) {
    colorMode.preference = next
    return
  }

  // moj-e dayere-i az jaye dokme ta durtarin gushe-ye safhe
  const x = e.clientX
  const y = e.clientY
  const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

  // transition-haye khod-e safhe moqe-e moj khamush mishan ta rang-ha vasat-e dayere dobare mahv nashan
  root.classList.add('theme-switching')
  const transition = document.startViewTransition(async () => {
    colorMode.preference = next
    await nextTick()
  })
  try {
    await transition.ready
    root.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 650, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' }
    )
    await transition.finished
  }
  finally {
    root.classList.remove('theme-switching')
  }
}

// maks-e kutah ba'd az click va qabl az shoru-e scroll: tanzimesh (roshan/khamush va moddat) too composables/useSectionScroll.ts hast
// va baraye header va baqiye-ye dokme-haye safhe moshtarake
// moddat-e harekat-e scroll-e dokme-haye header motenaseb ba fasele hesab mishe (ba easeInOutCubic):
// moddat = paye + fasele ÷ sor'at, va ba'd bein-e kamine va bishine mahdud mishe (saniye)
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
  // short: matn-e kutah-tar baraye mobile, ta hame-ye item-ha bedun-e scroll-e ofoqi ja beshan
  { href: '/#testimonials', label: 'نمونه‌کار و نظرات', short: 'نظرات' },
  { href: '/#features', label: 'امکانات' },
  { href: '/#faq', label: 'سوالات' },
  { href: '/#contact', label: 'تماس' }
]

const activeId = ref('hero')

const lastSectionId = navItems[navItems.length - 1]!.href.split('#')[1]!

// ta-ye safhe-im? (4 pixel tolerance baraye ashar va round shodan-e morurgar)
function isAtBottom() {
  return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
}

// bakhsh-e fa'al = akharin bakhshi ke balash az «khat-e marja'» rad shode. khat-e marja' ye jayi bein-e bala va vasat-e safhe-st (kasri az ertefa'-e safhe-namayesh);
// injuri tul-e bakhsh-ha ahamiyati nadare va bakhsh-haye kutah (mesle darbare-ye ma) ham sar-e vaqt fa'al mishan. adad-e kamtar = zudtar fa'al mishe
const ACTIVE_LINE_RATIO = 0.4
const sectionIds = navItems.map((item) => item.href.split('#')[1]!)

function pickActive() {
  // bakhsh-e akhar (tamas) kutah-tar az safhe-st va hichvaqt bala-ye safhe nemiad; pas vaqti be ta residim, un barande-st
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

  // age click-ha posht-e sar-e ham bud, faqat akharin click e'tebar dare
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
      class="flex max-w-[94vw] items-center gap-0 overflow-x-auto rounded-xl border px-2 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden shadow-md backdrop-blur-md dark:shadow-lg sm:gap-1 sm:px-3 sm:py-1 border-fg/10 bg-page/80 shadow-black/10 dark:shadow-black/20"
    >
      <a
        v-for="item in navItems"
        :key="item.href"
        :href="item.href"
        @click.prevent.stop="goToSection(item.href)"
        class="whitespace-nowrap rounded-lg px-2.5 py-2.5 text-xs font-semibold min-[400px]:px-3 min-[400px]:text-[13px] transition-all duration-500 ease-in-out sm:px-3 sm:py-2 sm:text-sm"
        :class="activeId === item.href.split('#')[1]
          ? 'shadow-sm bg-fg/15 text-fg'
          : 'hover:shadow-sm text-fg/70 hover:bg-fg/15 hover:text-fg'"
      >
        <template v-if="item.short">
          <span class="sm:hidden">{{ item.short }}</span>
          <span class="hidden sm:inline">{{ item.label }}</span>
        </template>
        <template v-else>{{ item.label }}</template>
      </a>

      <!-- dokme-ye shab/rooz: har do icon too HTML hastan va ba class-e .dark yekishun dide mishe, pas bein-e SSG va client ekhtelafi (hydration) pish nemiad -->
      <button
        type="button"
        class="ms-1 flex size-9 shrink-0 items-center justify-center rounded-lg text-fg/70 transition-all duration-500 ease-in-out hover:bg-fg/15 hover:text-fg"
        aria-label="تغییر حالت شب و روز"
        @click="toggleColorMode"
      >
        <!-- khorshid va mah rooye ham minshinan va moqe-e ta'viz mi-charkhan va mahv mishan -->
        <span class="relative block size-[18px]">
          <UIcon name="i-lucide-sun" class="theme-icon absolute inset-0 size-[18px] rotate-90 scale-0 opacity-0 transition-all duration-500 ease-in-out dark:rotate-0 dark:scale-100 dark:opacity-100" />
          <UIcon name="i-lucide-moon" class="theme-icon absolute inset-0 size-[18px] transition-all duration-500 ease-in-out dark:-rotate-90 dark:scale-0 dark:opacity-0" />
        </span>
      </button>
    </nav>
  </div>

  <Transition name="fade-scale">
    <button
      v-if="scrolled"
      type="button"
      class="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-xl border shadow-2xl transition-all duration-500 ease-in-out hover:-translate-y-1 border-fg bg-fg text-page"
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
