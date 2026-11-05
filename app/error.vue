<script setup lang="ts">
const props = defineProps<{
  error: { statusCode: number; statusMessage?: string; message?: string }
}>()

const isNotFound = computed(() => props.error?.statusCode === 404)

const title = computed(() =>
  isNotFound.value ? 'صفحه پیدا نشد' : 'یه مشکلی پیش اومد'
)

const description = computed(() =>
  isNotFound.value
    ? 'صفحه‌ای که دنبالش می‌گردید وجود نداره یا جابه‌جا شده.'
    : 'در بارگذاری این صفحه خطایی رخ داد. لطفاً دوباره تلاش کنید.'
)

useSeoMeta({
  title,
  description
})

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-white px-6 text-black dark:bg-dark dark:text-white">
    <div class="relative w-full max-w-lg overflow-hidden text-center">
      <div class="grid-bg absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

      <div class="relative">
        <p class="mb-4 text-7xl font-bold tracking-tight text-brand sm:text-8xl">
          {{ error?.statusCode ?? 404 }}
        </p>
        <h1 class="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
          {{ title }}
        </h1>
        <p class="mb-8 text-black/65 dark:text-white/65">
          {{ description }}
        </p>

        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-black transition-all duration-500 ease-in-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand/30"
          @click="handleError"
        >
          بازگشت به خانه
          <UIcon name="i-lucide-arrow-left" class="size-4" />
        </button>
      </div>
    </div>
  </div>
</template>
