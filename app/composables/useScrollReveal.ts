// یک observer مشترک برای کل صفحه؛ هر کامپوننت فقط المان‌های .reveal خودش رو بهش می‌ده
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
