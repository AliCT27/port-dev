<script setup lang="ts">
useScrollReveal(".reveal");
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
  <section id="hero" class="relative overflow-hidden pt-10 sm:pt-14">
    <div
      class="grid-bg absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]"
    />

    <div
      class="relative mx-auto grid max-w-6xl items-center gap-8 px-6 pb-12 pt-6 sm:gap-6 sm:pb-16 sm:pt-10 md:grid-cols-[1fr_auto] md:gap-6 md:pb-20 md:pt-10"
    >
      <div class="text-center md:text-start">
        <p
          class="reveal mb-5 inline-flex items-center gap-2.5 rounded-lg border border-brand/40 bg-brand/10 px-4 py-2 text-sm font-bold sm:mb-6 text-white/90"
        >
          <span class="relative flex size-2.5">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-70" />
            <span class="relative inline-flex size-2.5 rounded-full bg-brand" />
          </span>
          آماده‌ی همکاری روی پروژه‌های جدید
        </p>
        <h1
          class="reveal reveal-delay-1 mb-5 text-balance text-3xl font-bold leading-snug tracking-tight sm:mb-6 sm:text-4xl"
        >
          <span class="text-gradient-mono"
            >سلام، ما توسعه‌دهنده سایت‌های فروشگاهی با لاراول هستیم</span
          >
        </h1>
        <div
          dir="ltr"
          class="reveal reveal-delay-2 mb-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-semibold sm:mb-8 sm:gap-x-5 sm:text-base md:justify-end text-white/70"
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
          class="reveal reveal-delay-3 flex flex-wrap items-center justify-center gap-4 md:justify-start"
        >
          <a
            href="#testimonials"
            @click.prevent.stop="goToSection('testimonials')"
            class="group inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-bold text-black transition-all duration-500 ease-in-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand/30 active:translate-y-0"
          >
            نمونه‌کار و نظرات
            <UIcon
              name="i-lucide-arrow-left"
              class="size-4 transition-transform duration-500 ease-in-out group-hover:-translate-x-1"
            />
          </a>
          <a
            href="#contact"
            @click.prevent.stop="goToSection('contact')"
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
          class="reveal reveal-delay-4 mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center md:justify-start"
        >
          <div>
            <p class="text-xl font-bold sm:text-2xl">+۴</p>
            <p class="text-sm text-white/60">سال تجربه</p>
          </div>
          <div>
            <p class="text-xl font-bold sm:text-2xl">+۶۵۰</p>
            <p class="text-sm text-white/60">
              کسب‌وکار همکار
            </p>
          </div>
          <div>
            <p class="text-xl font-bold sm:text-2xl">۲۴/۷</p>
            <p class="text-sm text-white/60">
              پشتیبانی و پاسخگویی
            </p>
          </div>
        </div>
      </div>

      <div class="reveal reveal-delay-1 mx-auto md:mx-0">
        <div class="group relative">
          <div
            class="profile-glow-breathe absolute -inset-1 rounded-full bg-brand blur-xl"
          />
          <div
            class="profile-glow-spin absolute -inset-2 rounded-full opacity-70 blur-lg"
          />
          <div
            class="relative h-44 w-44 overflow-hidden rounded-full border-4 shadow-2xl ring-1 transition-transform duration-700 ease-in-out group-hover:scale-105 sm:h-56 sm:w-56 md:h-64 md:w-64 border-white bg-dark ring-white/10"
          >
            <img
              v-if="!profileFailed"
              ref="profileImg"
              src="/images/profile.webp"
              alt="Profile"
              class="h-full w-full object-cover"
              @error="profileFailed = true"
            />
            <div
              v-else
              class="flex h-full w-full flex-col items-center justify-center gap-2 text-center bg-neutral-900 text-white/45"
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
