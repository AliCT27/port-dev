<script setup lang="ts">
const props = defineProps<{
  error: { statusCode: number; statusMessage?: string; message?: string }
}>()

const isNotFound = computed(() => props.error?.statusCode === 404)

const title = computed(() =>
  isNotFound.value ? 'صفحه یافت نشد' : 'یه مشکلی پیش اومد'
)

const description = computed(() =>
  isNotFound.value
    ? 'با عرض پوزش از شما، چنین صفحه‌ای در سایت وجود ندارد'
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
  <div class="flex min-h-screen items-center justify-center px-6 bg-dark text-white">
    <div class="relative w-full max-w-lg text-center">
      <div class="grid-bg absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />

      <div class="relative">
        <!-- ۴۰۴: صفرِ وسط یه باکسه که بالا و پایین میره -->
        <p
          v-if="isNotFound"
          class="mb-6 flex items-center justify-center gap-3 text-8xl font-bold leading-none text-white sm:gap-4 sm:text-9xl"
          dir="ltr"
          aria-label="خطای ۴۰۴"
        >
          <span aria-hidden="true">۴</span>
          <span
            aria-hidden="true"
            class="not-found-bob flex size-[0.66em] items-center justify-center rounded-2xl bg-brand shadow-xl shadow-brand/20 sm:rounded-3xl"
          >
            <span class="size-[0.32em] rounded-full border-[0.08em] border-dark" />
          </span>
          <span aria-hidden="true">۴</span>
        </p>
        <p v-else class="mb-4 text-7xl font-bold tracking-tight text-brand sm:text-8xl">
          {{ error?.statusCode ?? 500 }}
        </p>
        <h1 class="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">
          {{ title }}
        </h1>
        <p class="mb-8 text-white/65">
          {{ description }}
        </p>

        <button
          type="button"
          class="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-black transition-all duration-500 ease-in-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand/30 active:translate-y-0"
          @click="handleError"
        >
          بازگشت به خانه
          <UIcon name="i-lucide-arrow-left" class="size-4" />
        </button>
      </div>
    </div>
  </div>
</template>
