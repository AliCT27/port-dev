<script setup lang="ts">
// font-haye bala-ye safhe az hamun aval load mishan ta ba'd az load, matn jabeja nashe (CLS) va font pish-farz cheshmak nazane.
// age --font-sans too main.css ro be YekanBakh avaz kardi, address-ha ro ham hamin ja avaz kon.
useHead({
  link: [
    { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/arad/AradFD-Regular.woff2', crossorigin: 'anonymous' },
    { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/arad/AradFD-Bold.woff2', crossorigin: 'anonymous' }
  ]
})
</script>

<template>
  <UApp>
    <div class="min-h-screen transition-colors duration-500 bg-page text-fg">
      <AppHeader />
      <main>
        <NuxtPage />
      </main>
      <AppFooter />
    </div>
  </UApp>
</template>
