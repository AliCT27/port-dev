<script setup lang="ts">
const links = [
  { label: 'اینستاگرام', icon: 'i-simple-icons-instagram', href: 'https://www.instagram.com/mohandesin.site' },
  { label: 'تماس تلفنی', icon: 'i-lucide-phone-call', href: 'tel:+989019837586' }
]

useScrollReveal('.reveal')
</script>

<template>
  <section id="contact" class="relative overflow-hidden py-12">
    <div class="grid-bg absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

    <div class="relative mx-auto max-w-3xl px-6 text-center">
      <div class="reveal">
        <h2 class="mb-4 text-2xl font-bold sm:text-3xl">
          آماده‌اید <span class="text-brand">فروشگاه آنلاین‌تون</span> رو راه بندازیم؟
        </h2>
        <p class="mb-6 text-sm leading-loose sm:text-base text-white/65">
          ایده‌تون هرچقدر هم کلی باشه، توی جلسه‌ی مشاوره کاملاً شفاف بررسیش می‌کنیم و مسیر تبدیلش به یک سایت
          فروشگاهی ایده‌آل و پرسرعت رو روشن می‌کنیم. فقط کافیه شروع کنید؛ از هر کدوم از راه‌های زیر که براتون
          راحت‌تره، همین الان باهامون در ارتباط باشید.
        </p>
      </div>

      <div class="reveal reveal-delay-1 mb-4">
        <div class="group relative mx-auto inline-block overflow-hidden rounded-xl p-[2px] transition-transform duration-1000 ease-in-out will-change-transform hover:-translate-y-1">
          <div
            class="animate-spin-glow absolute left-1/2 top-1/2 aspect-square w-[260%] -translate-x-1/2 -translate-y-1/2 bg-[conic-gradient(from_0deg,transparent_0%,transparent_55%,#FF2D95_75%,transparent_95%)]"
          />
          <a
            href="https://t.me/msite_support"
            target="_blank"
            rel="noopener"
            class="relative z-10 inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-black shadow-2xl transition-shadow duration-1000 ease-in-out group-hover:shadow-brand/30"
          >
            شروع مشاوره در تلگرام
            <UIcon name="i-lucide-arrow-left" class="size-4 transition-transform duration-700 ease-in-out group-hover:-translate-x-1" />
          </a>
        </div>
      </div>

      <div class="reveal reveal-delay-2 flex flex-wrap items-center justify-center gap-3">
        <a
          v-for="link in links"
          :key="link.label"
          :href="link.href"
          :target="link.href.startsWith('tel:') ? undefined : '_blank'"
          :rel="link.href.startsWith('tel:') ? undefined : 'noopener'"
          class="group inline-flex items-center gap-2 rounded-xl border bg-transparent px-5 py-2.5 text-sm font-bold transition-all duration-500 ease-in-out hover:-translate-y-0.5 border-white/15 text-white hover:border-brand hover:text-brand"
        >
          {{ link.label }}
          <UIcon :name="link.icon" class="size-4" />
        </a>
      </div>
    </div>
  </section>
</template>
