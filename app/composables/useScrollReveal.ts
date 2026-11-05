export function useScrollReveal(selector = '.reveal') {
  if (import.meta.client) {
    onMounted(() => {
      const els = document.querySelectorAll(selector)
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed')
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.05, rootMargin: '0px 0px -10% 0px' }
      )

      els.forEach((el) => observer.observe(el))

      onBeforeUnmount(() => observer.disconnect())
    })
  }
}
