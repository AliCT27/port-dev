<script setup lang="ts">
const year = new Date().getFullYear();
</script>

<template>
  <footer class="border-t py-8 border-fg/10">
    <div
      class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-center text-xs lg:flex-row text-fg/50"
    >
      <p>© {{ year }} — تمامی حقوق محفوظ است.</p>
      <p>مشاورین شما: مهندس محمدنژاد و مهندس زمانی</p>
      <p>توسعه توسط مهندسین سایت</p>
    </div>
  </footer>
</template>
