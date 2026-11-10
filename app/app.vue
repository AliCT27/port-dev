<script setup lang="ts">
// فونت‌های بالای صفحه از همون اول لود می‌شن تا بعد از لود، متن جابه‌جا نشه (CLS) و فونت پیش‌فرض چشمک نزنه.
// اگه --font-sans توی main.css رو به YekanBakh عوض کردی، آدرس‌ها رو هم همین‌جا عوض کن.
useHead({
  link: [
    { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/arad/AradFD-Regular.woff2', crossorigin: 'anonymous' },
    { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/arad/AradFD-Bold.woff2', crossorigin: 'anonymous' }
  ]
})
</script>

<template>
  <UApp>
    <div class="min-h-screen transition-colors duration-500 bg-dark text-white">
      <AppHeader />
      <main>
        <NuxtPage />
      </main>
      <AppFooter />
    </div>
  </UApp>
</template>
