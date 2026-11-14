<script setup lang="ts">
const { goToSection } = useSectionScroll();

// اگه عکس پروفایل پیدا نشد (یا هنوز نگذاشتید)، به‌جاش جای خالی «به‌زودی» نمایش داده میشه
const profileFailed = ref(false);
const profileImg = ref<HTMLImageElement | null>(null);
onMounted(() => {
  // اگه خطا قبل از hydration اتفاق افتاده باشه، @error دیگه صدا زده نمیشه؛ پس دوباره چک می‌کنیم
  const img = profileImg.value;
  if (img && img.complete && img.naturalWidth === 0) profileFailed.value = true;
});
</script>

<template>
  <section id="hero" class="relative overflow-hidden pt-14 sm:pt-14">
    <div
      class="grid-bg absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
    />

    <div
      class="relative mx-auto grid max-w-6xl items-center gap-8 px-6 pb-12 pt-6 sm:gap-6 sm:pb-16 sm:pt-10 md:grid-cols-[1fr_auto] md:gap-6 md:pb-20 md:pt-10"
    >
      <div class="text-center md:text-start">
        <p
          class="hero-in mb-5 inline-flex items-center gap-2.5 rounded-lg border border-brand/40 bg-brand/10 px-4 py-2 text-sm font-bold sm:mb-6 text-fg/90"
        >
          <span class="relative flex size-2.5">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-70" />
            <span class="relative inline-flex size-2.5 rounded-full bg-brand" />
          </span>
          آماده‌ی همکاری روی پروژه‌های جدید
        </p>
        <h1
          class="hero-in reveal-delay-1 mb-3 text-balance text-3xl font-bold leading-snug tracking-tight sm:mb-4 sm:text-4xl"
        >
          <span class="text-gradient-mono"
            >سلام، ما توسعه‌دهنده سایت‌های فروشگاهی با لاراول هستیم</span
          >
        </h1>
        <p class="hero-in reveal-delay-1 mb-5 text-balance text-sm leading-loose sm:mb-6 sm:text-base text-fg/70">
          سایتی برای <span class="font-bold text-brand-ink">فروش بهتر</span> شما و <span class="font-bold text-brand-ink">راحتی بیشتر</span> مشتری‌هاتون
        </p>
        <div
          dir="ltr"
          class="hero-in reveal-delay-2 mb-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-semibold sm:mb-8 sm:gap-x-5 sm:text-base md:justify-end text-fg/70"
        >
          <span class="inline-flex items-center gap-1.5">
            Laravel
            <UIcon
              name="i-simple-icons-laravel"
              class="size-4 sm:size-5"
              style="color: #ff2d20"
            />
          </span>
          <span class="inline-flex items-center gap-1.5">
            Inertia.js
            <UIcon
              name="i-simple-icons-inertia"
              class="size-4 sm:size-5"
              style="color: #9553e9"
            />
          </span>
          <span class="inline-flex items-center gap-1.5">
            Vue.js
            <UIcon
              name="i-simple-icons-vuedotjs"
              class="size-4 sm:size-5"
              style="color: #4fc08d"
            />
          </span>
          <!-- زیر ۸۶۰ پیکسل ردیف به شکل ۳ + ۲ بشکنه تا یک آیتم تنها نیفته -->
          <span aria-hidden="true" class="h-0 basis-full min-[860px]:hidden" />
          <span class="inline-flex items-center gap-1.5">
            Nuxt
            <UIcon
              name="i-simple-icons-nuxtdotjs"
              class="size-4 sm:size-5"
              style="color: #00dc82"
            />
          </span>
          <span class="inline-flex items-center gap-1.5">
            TailwindCSS
            <UIcon
              name="i-simple-icons-tailwindcss"
              class="size-4 sm:size-5"
              style="color: #06b6d4"
            />
          </span>
        </div>

        <div
          class="hero-in reveal-delay-3 flex flex-wrap items-center justify-center gap-4 md:justify-start"
        >
          <a
            href="#features"
            @click.prevent.stop="goToSection('features')"
            class="group inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-black transition-all duration-500 ease-in-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand/30 active:translate-y-0"
          >
            امکانات سایت
            <UIcon
              name="i-lucide-arrow-left"
              class="size-4 transition-transform duration-500 ease-in-out group-hover:-translate-x-1"
            />
          </a>
          <a
            href="tel:+989019837586"
            class="inline-flex items-center gap-2 rounded-xl bg-[#2F7DFF] px-6 py-3 text-sm font-bold text-white transition-all duration-500 ease-in-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#2F7DFF]/30"
          >
            تماس با ما
            <UIcon
              name="i-lucide-phone-call"
              class="size-4 animate-phone-ring"
            />
          </a>
        </div>

        <div
          class="hero-in reveal-delay-4 mt-8 grid grid-cols-2 gap-x-2 text-center sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-8 sm:gap-y-3 md:justify-start"
        >
          <div>
            <p class="text-xl font-bold sm:text-2xl">+۶۵۰</p>
            <p class="text-xs text-fg/60 sm:text-sm">
              فروشگاه فعال
            </p>
          </div>
          <div>
            <p class="text-xl font-bold sm:text-2xl">۲۴/۷</p>
            <p class="text-xs text-fg/60 sm:text-sm">
              پشتیبانی و پاسخگویی
            </p>
          </div>
        </div>
      </div>

      <div class="hero-in reveal-delay-1 mx-auto md:mx-0">
        <div class="group relative">
          <div
            class="profile-glow-breathe absolute -inset-1 rounded-full bg-brand blur-xl"
          />
          <div
            class="profile-glow-spin absolute -inset-2 rounded-full opacity-70 blur-lg"
          />
          <div
            class="relative h-44 w-44 overflow-hidden rounded-full border-4 shadow-2xl transition-transform duration-700 ease-in-out group-hover:scale-105 sm:h-56 sm:w-56 md:h-64 md:w-64 border-fg bg-dark"
          >
            <img
              v-if="!profileFailed"
              ref="profileImg"
              src="/images/profile.webp"
              alt="Profile"
              width="600"
              height="600"
              class="h-full w-full object-cover"
              @error="profileFailed = true"
            />
            <div
              v-else
              class="flex h-full w-full flex-col items-center justify-center gap-2 text-center bg-panel text-fg/45"
            >
              <UIcon name="i-lucide-user-round" class="size-14" />
              <span class="text-xs font-bold leading-6">تصویر<br />به‌زودی اضافه می‌شه</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
