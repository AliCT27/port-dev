<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<template>
  <footer class="border-t border-black/10 py-8 dark:border-white/10">
    <div
      class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-xs text-black/50 sm:flex-row dark:text-white/50"
    >
      <p>© {{ year }} — تمامی حقوق محفوظ است.</p>
      <p>توسعه توسط مهندسین سایت</p>
    </div>
  </footer>
</template>
