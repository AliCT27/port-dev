// اسکرولِ نرم به یک بخش با مکثِ کوتاه بعد از کلیک.
// مکثِ کلیک (هم دکمه‌های هدر، هم دکمه‌های بقیه‌ی بخش‌ها) فقط از همین‌جا تنظیم میشه:
//   CLICK_PAUSE_ENABLED = true  → با مکث | false → اسکرول بلافاصله بعد از کلیک
export const CLICK_PAUSE_ENABLED = false
export const CLICK_PAUSE_MS = 400
export const clickPause = () => (CLICK_PAUSE_ENABLED ? CLICK_PAUSE_MS : 0)

const SCROLL_BASE_S = 0.6
const SCROLL_PX_PER_S = 2500
const SCROLL_MIN_S = 0.8
const SCROLL_MAX_S = 2.2

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

export function useSectionScroll() {
  const nuxtApp = useNuxtApp()
  let timer: ReturnType<typeof setTimeout> | null = null

  function goToSection(id: string) {
    // اگه کلیک پشت‌سرهم بود، فقط آخرین کلیک اعتبار داره
    if (timer) clearTimeout(timer)

    timer = setTimeout(() => {
      const target = document.getElementById(id)
      if (!target) return

      const lenis = (nuxtApp as any).$lenis
      if (lenis) {
        const distance = Math.abs(target.getBoundingClientRect().top)
        const duration = Math.min(SCROLL_MAX_S, Math.max(SCROLL_MIN_S, SCROLL_BASE_S + distance / SCROLL_PX_PER_S))
        lenis.scrollTo(target, { duration, easing: easeInOutCubic })
      } else {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }, clickPause())
  }

  return { goToSection }
}
