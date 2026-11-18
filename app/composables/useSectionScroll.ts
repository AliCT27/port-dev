// scroll-e narm be yek bakhsh ba maks-e kutah ba'd az click.
// maks-e click (ham dokme-haye header, ham dokme-haye baqiye-ye bakhsh-ha) faqat az hamin ja tanzim mishe:
//   CLICK_PAUSE_ENABLED = true  → ba maks | false → scroll belafasele ba'd az click
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
    // age click-ha posht-e sar-e ham bud, faqat akharin click e'tebar dare
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
