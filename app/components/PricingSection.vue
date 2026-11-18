<script setup lang="ts">
useScrollReveal('.reveal')

// pelan-ha: har chizi ke hanuz az taraf-e saheb-e site nayomade (esm/qeymat/emkanat) ba null ya araye-ye khali moshakhas shode
// va jaye khali-ye «be-zudi» neshun dade mishe; baraye virayesh faqat hamin araye ra avaz konid
interface Plan {
  id: string
  name: string
  badge?: string
  tagline?: string
  price: null | { prefix?: string, amount: string, unit: string }
  features: { text: string, included: boolean }[]
  cta: string
}

const TELEGRAM_URL = 'https://t.me/msite_support'

const plans: Plan[] = [
  {
    id: 'recommended',
    name: 'پلن استاندارد',
    badge: 'پیشنهاد ما',
    price: { prefix: 'از', amount: '۴۲', unit: 'میلیون تومان' },
    features: [
      { text: 'دریافت همه‌ی آپدیت‌ها', included: true },
      { text: 'ارتباط مداوم با تیم توسعه', included: true },
      { text: 'اولویت در قابلیت‌ها و پروژه‌های موردنیاز شما', included: true }
    ],
    cta: 'شروع مشاوره‌ی رایگان'
  },
  {
    id: 'custom',
    name: 'پلن الماس',
    tagline: 'مخصوص کسب‌وکارهای بزرگ',
    price: { prefix: 'بالای', amount: '۱۰۰', unit: 'میلیون تومان' },
    features: [
      { text: 'قابلیت‌های اختصاصی', included: true },
      { text: 'توسعه‌ی رابط کاربری اختصاصی', included: true }
    ],
    cta: 'مشاوره‌ی رایگان'
  }
]
</script>

<template>
  <section id="pricing" class="py-12 sm:py-16">
    <div class="mx-auto max-w-3xl px-6">
      <div class="reveal mx-auto mb-10 max-w-2xl text-center sm:mb-12">
        <h2 class="mb-3 text-2xl font-bold sm:text-3xl">هزینه‌ها رو از همین الان ببینید</h2>
        <p class="text-balance text-sm leading-loose text-fg/70 sm:text-base">
          قیمت دقیق هر پروژه به امکانات موردنیاز شما بستگی داره؛ این دو پلن، تصویر کلی از هزینه‌ها رو نشون می‌ده.
        </p>
      </div>

      <!-- mavared-e moshtarak-e hame-ye pelan-ha (hanuz az taraf-e saheb-e site nayomade) -->
      <div class="reveal mb-8 flex min-h-16 items-center justify-center rounded-xl border border-dashed border-fg/20 bg-panel px-4 py-3 text-center text-xs font-bold leading-6 text-fg/45 sm:text-sm">
        مواردی که همه‌ی پلن‌ها شامل می‌شن به‌زودی اضافه می‌شه
      </div>

      <div class="grid gap-4 md:grid-cols-2 md:items-stretch md:gap-5">
        <div
          v-for="(plan, i) in plans"
          :key="plan.id"
          class="reveal h-full"
          :class="[
            i === 0 ? 'order-first md:-my-4 md:order-none' : '',
            i === 0 ? 'reveal-delay-1' : 'reveal-delay-2',
          ]"
        >
          <div
            class="relative flex h-full flex-col rounded-2xl p-5 text-start sm:p-6"
            :class="plan.badge
              ? 'border-2 border-brand bg-card shadow-[0_8px_30px_rgb(0_220_130/0.18)] dark:shadow-[0_0_40px_rgb(0_220_130/0.14)] md:py-10'
              : 'border border-fg/15 bg-card'"
          >
            <span
              v-if="plan.badge"
              class="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-brand px-3 py-0.5 text-xs font-bold text-black"
            >
              <UIcon name="i-lucide-star" class="size-3.5" />
              {{ plan.badge }}
            </span>

            <h3 class="text-lg font-bold" :class="plan.tagline ? 'mb-1' : 'mb-4'">{{ plan.name }}</h3>
            <p v-if="plan.tagline" class="mb-3 text-xs text-fg/60">{{ plan.tagline }}</p>

            <div v-if="plan.price" class="mb-5 flex flex-wrap items-baseline gap-x-1.5">
              <span v-if="plan.price.prefix" class="text-sm text-fg/60">{{ plan.price.prefix }}</span>
              <span class="text-3xl font-bold" :class="plan.badge ? 'text-brand-ink' : ''">{{ plan.price.amount }}</span>
              <span class="text-sm text-fg/60">{{ plan.price.unit }}</span>
            </div>
            <div
              v-else
              class="mb-5 flex h-[2.625rem] items-center justify-center rounded-lg border border-dashed border-fg/20 bg-panel text-xs font-bold text-fg/45"
            >
              قیمت به‌زودی
            </div>

            <ul v-if="plan.features.length" class="mb-6 min-h-36 space-y-3 text-sm leading-6">
              <li v-for="f in plan.features" :key="f.text" class="flex items-start gap-2" :class="f.included ? '' : 'text-fg/45'">
                <UIcon
                  :name="f.included ? 'i-lucide-check' : 'i-lucide-x'"
                  class="mt-1 size-4 shrink-0"
                  :class="f.included ? 'text-brand-ink' : 'text-fg/40'"
                />
                <span>{{ f.text }}</span>
              </li>
            </ul>
            <div
              v-else
              class="mb-6 flex min-h-36 items-center justify-center rounded-lg border border-dashed border-fg/20 bg-panel px-3 text-center text-xs font-bold leading-6 text-fg/45"
            >
              امکانات این پلن<br>به‌زودی اضافه می‌شه
            </div>

            <a
              :href="TELEGRAM_URL"
              target="_blank"
              rel="noopener"
              class="mt-auto inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-colors duration-300"
              :class="plan.badge
                ? 'bg-brand text-black shadow-[0_4px_14px_rgb(0_220_130/0.40)] hover:opacity-90 dark:shadow-[0_0_12px_rgb(0_220_130/0.35)]'
                : 'border border-fg/25 hover:border-brand hover:bg-brand/10 hover:text-brand-ink'"
            >
              {{ plan.cta }}
              <UIcon name="i-lucide-arrow-left" class="size-4" />
            </a>
          </div>
        </div>
      </div>

      <p class="reveal mt-8 text-center text-xs leading-6 text-fg/50 sm:text-sm">
        قیمت نهایی بعد از بررسی نیازها به‌صورت شفاف اعلام می‌شه؛ نصف مبلغ موقع بستن قرارداد و نصف دیگه موقع تحویل سایت دریافت می‌شه.
      </p>
    </div>
  </section>
</template>
