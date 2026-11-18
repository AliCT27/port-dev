import Lenis from 'lenis'

export default defineNuxtPlugin(() => {
  const lenis = new Lenis({
    autoRaf: true,
    anchors: true,
    // sor'at-e scroll ba charkh-e mouse (pish-farz 1). adad-e bishtar = ba har charkhesh, safhe bishtar jabeja mishe
    wheelMultiplier: 1.5
  })

  return {
    provide: { lenis }
  }
})
