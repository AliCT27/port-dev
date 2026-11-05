import Lenis from 'lenis'

export default defineNuxtPlugin(() => {
  const lenis = new Lenis({
    autoRaf: true,
    anchors: true,
    // سرعت اسکرول با چرخ موس (پیش‌فرض ۱). عدد بیشتر = با هر چرخش، صفحه بیشتر جابه‌جا میشه
    wheelMultiplier: 1.5
  })

  return {
    provide: { lenis }
  }
})
