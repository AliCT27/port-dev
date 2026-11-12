<script setup lang="ts">
useScrollReveal('.reveal')

const aboutHeading = ref<HTMLElement | null>(null)
onMounted(() => {
  // این تیتر پایین‌تر از دیدِ اولیه‌ست، ولی می‌خوایم هم‌زمان با Hero (نه با اسکرولِ بعدی) انیمیشن بگیره
  requestAnimationFrame(() => {
    aboutHeading.value?.classList.add('revealed')
  })
})

const milestones = [
  {
    label: 'خیلی خوش اومدید',
    title: 'اول بذارید خودم رو معرفی کنم…',
    description: 'من علی محمدنژاد هستم. با همکارم، مهندس زمانی، به‌صورت فول‌تایم روی سایت‌های کدنویسی‌شده با لاراول کار می‌کنیم. افتخار این رو هم داشتیم که یکی از بهترین سیستم‌های فروشگاهی ایرانی رو از صفر توسعه بدیم.'
  },
  {
    label: 'سرعت و امکانات، مهم‌ترین مزیت ما',
    title: 'سایتی که مشتری‌هاتون حس اپلیکیشن بهش دارن',
    description: 'سایت‌های ما با Laravel و Vue.js ساخته می‌شن و اون‌قدر سریع باز می‌شن که مشتری شما حس می‌کنه داره از یک اپلیکیشن استفاده می‌کنه، نه یک سایت. وقتی سایت سریع باشه، کاربر منتظر نمی‌مونه و خریدش رو تکمیل می‌کنه و نتیجه‌ش فروش بیشتره. ما از اولین تیم‌های ایرانی بودیم که ثابت کردیم سایت‌های کدنویسی‌شده توی سرعت و عملکرد حرف برای گفتن دارن.'
  },
  {
    label: 'چرا باید طراحی سایتتون رو به ما بسپرید؟',
    title: 'چون سایتتون رو دست یک تیم برنامه‌نویس می‌سپرید',
    description: 'ما فقط طراح سایت نیستیم؛ یک تیم برنامه‌نویسیم و پروژه‌ها رو روی محصول فروشگاهی امتحان‌شده و مقیاس‌پذیر خودمون پیاده‌سازی می‌کنیم. برای همین همه‌چیزِ سایت شما یکپارچه و هماهنگ کار می‌کنه، نه مجموعه‌ای از ابزارها و افزونه‌های جدا از هم که باعث کندی و تداخل می‌شن. توی جلسه‌ی مشاوره، همه‌ی امکانات موردنیازتون رو شفاف توضیح می‌دیم تا مسیر روشن باشه و سایتی حرفه‌ای و متمایز تحویل بگیرید.'
  }
]

// اندیس آخرین کارتی که از همون اول (بدون انیمیشنِ ورود) نمایش داده میشه؛ کارت‌های بعد از اون موقع اسکرول ظاهر میشن
const preActiveUpTo = 2

const trackEl = ref<HTMLElement | null>(null)
const nuxtApp = useNuxtApp()
const toFa = (n: number) => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[+d]!)

// خط مرجع: کارتی که به این ارتفاعِ صفحه (کسری از ارتفاع صفحه‌نمایش) نزدیک‌تره «فعال» حساب میشه
const REFERENCE_LINE = 0.5

// شدتِ فعال‌بودنِ هر کارت (۰ تا ۱)؛ شماره‌ی کارت فعال سبز و پررنگ میشه و بقیه کم‌رنگ
const levels = ref<number[]>([])

function updateFill() {
  if (!trackEl.value) return
  const line = window.innerHeight * REFERENCE_LINE
  const items = trackEl.value.querySelectorAll<HTMLElement>('[data-node]')
  levels.value = Array.from(items).map((el) => {
    const r = el.getBoundingClientRect()
    const center = r.top + r.height / 2
    // فاصله‌ی مرکز کارت از خط مرجع؛ هرچه نزدیک‌تر، فعال‌تر
    const d = Math.abs(center - line) / (window.innerHeight * 0.45)
    const t = Math.min(1, Math.max(0, 1 - d))
    return t * t * (3 - 2 * t)
  })
}

function onUserScroll() {
  updateFill()
}

onMounted(() => {
  updateFill()
  const lenis = (nuxtApp as any).$lenis
  if (lenis) {
    lenis.on('scroll', onUserScroll)
  } else {
    window.addEventListener('scroll', onUserScroll, { passive: true })
  }
  window.addEventListener('resize', updateFill)
})
onBeforeUnmount(() => {
  const lenis = (nuxtApp as any).$lenis
  if (lenis) {
    lenis.off('scroll', onUserScroll)
  } else {
    window.removeEventListener('scroll', onUserScroll)
  }
  window.removeEventListener('resize', updateFill)
})
</script>

<template>
  <section id="about" class="border-y pb-16 pt-10 sm:py-16 border-white/10 bg-white/[0.03]">
    <div class="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-[1fr_1.7fr] md:gap-14">
      <div ref="aboutHeading" class="reveal reveal-delay-4 md:sticky md:top-28 md:self-start">
        <h2 class="text-2xl font-bold sm:text-3xl">چرا مهندسین سایت؟</h2>
      </div>

      <div ref="trackEl">
        <div
          v-for="(item, i) in milestones"
          :key="item.title"
          data-node
          class="flex items-stretch gap-2 pb-4 last:pb-0 sm:gap-3"
          :class="i > preActiveUpTo ? ['reveal', `reveal-delay-${(i % 5) + 1}`] : ''"
        >
          <!-- ستون شماره -->
          <div class="flex w-9 shrink-0 flex-col items-center sm:w-12">
            <span
              class="mt-4 select-none text-3xl font-bold leading-none text-brand sm:text-4xl"
            dir="rtl"
            >{{ toFa(i + 1) }}<span class="ms-[0.15em]">.</span></span>
          </div>

          <div
            class="min-w-0 flex-1 rounded-2xl border p-5 transition-colors duration-500 ease-in-out md:hover:border-brand border-white/10 bg-dark"
          >
            <span class="mb-1.5 inline-block text-sm font-bold text-brand">{{ item.label }}</span>
            <h3 class="mb-2 text-base font-bold sm:text-lg">{{ item.title }}</h3>
            <p
              class="text-sm leading-loose text-white sm:text-base"
              :style="{ opacity: 0.68 + 0.27 * (levels[i] ?? 0) }"
            >{{ item.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
