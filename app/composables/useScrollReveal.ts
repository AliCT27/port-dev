// yek observer-e moshtarak baraye kol-e safhe; har component faqat element-haye .reveal-e khodesh ro behesh mide
let observer: IntersectionObserver | null = null

export function useScrollReveal(selector = '.reveal') {
  if (!import.meta.client) return

  onMounted(() => {
    observer ??= new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px -10% 0px' }
    )

    document.querySelectorAll(selector).forEach((el) => {
      if (!el.classList.contains('revealed')) observer!.observe(el)
    })
  })
}
