<script setup lang="ts">
useScrollReveal('.reveal')

// pelan-ha: har chizi ke hanuz az taraf-e saheb-e site nayomade (esm/qeymat/emkanat) ba null ya araye-ye khali moshakhas shode
// va jaye khali-ye «be-zudi» neshun dade mishe; baraye virayesh faqat hamin araye ra avaz konid
interface Plan {
  id: string
  name: string
  label: string
  highlight?: boolean
  // pelan-e almas ham ghab-e sabz migire vali bedun-e glow va dokme-ye por
  green?: boolean
  // jomle-ye tamayoz-e pelan (bala-ye dokme)
  note?: string
  price: null | { prefix?: string, amount: string, unit: string }
  features: { text: string, included: boolean, strong?: boolean }[]
  cta: string
}

const TELEGRAM_URL = 'https://t.me/msite_support'

const plans: Plan[] = [
  {
    id: 'recommended',
    name: 'پلن استاندارد',
    label: 'پیشنهادی شروع کسب‌وکارها',
    highlight: true,
    price: { amount: '۴۲', unit: 'میلیون تومان' },
    features: [
      { text: 'تمام امکانات فروشگاهی ما', included: true, strong: true },
      { text: 'تک‌فروشی و چندفروشندگی', included: true },
      { text: 'درگاه‌های پرداخت و پنل‌های پیامکی ایرانی', included: true },
      { text: 'انبارداری، باشگاه مشتریان و کیف پول', included: true },
      { text: 'تخفیف‌های متنوع و همکاری در فروش', included: true },
      { text: 'صفحه‌ساز اختصاصی و سئوی حرفه‌ای', included: true },
      { text: 'دریافت همه‌ی آپدیت‌ها', included: true },
      { text: 'ارتباط مداوم با تیم توسعه', included: true },
      { text: 'اولویت در قابلیت‌ها و پروژه‌های موردنیاز شما', included: true }
    ],
    note: 'اکثر کسب‌وکارها به این پلن نیاز دارن',
    cta: 'شروع مشاوره‌ی رایگان'
  },
  {
    id: 'custom',
    name: 'پلن الماس',
    label: 'مناسب کسب‌وکارهای بزرگ',
    price: { prefix: 'از', amount: '۱۲۰', unit: 'میلیون تومان' },
    green: true,
    features: [
      { text: 'تمام امکانات پایه‌ی سیستم فروشگاهی ما', included: true, strong: true },
      { text: 'قابلیت‌های خاص، دقیقاً مطابق کسب‌وکار شما', included: true },
      { text: 'طراحی UI/UX اختصاصی؛ ظاهری که مورد پسند خودتان باشد', included: true },
      { text: 'سایتی متفاوت که شبیه هیچ فروشگاه دیگه‌ای نیست', included: true },
      { text: 'هماهنگی کامل ظاهر سایت با برند و هویت بصری شما', included: true },
      { text: 'پیاده‌سازی نیازهای خاص و پیچیده‌ی کسب‌وکارهای بزرگ', included: true },
      { text: 'دریافت همه‌ی آپدیت‌ها', included: true },
      { text: 'ارتباط مداوم با تیم توسعه', included: true },
      { text: 'اولویت در قابلیت‌ها و پروژه‌های موردنیاز شما', included: true }
    ],
    cta: 'شروع مشاوره‌ی رایگان'
  }
]
</script>

<template>
  <section id="pricing" class="py-12 sm:py-16">
    <div class="mx-auto max-w-3xl px-6">
      <div class="reveal mx-auto mb-12 max-w-2xl text-center sm:mb-14">
        <h2 class="mb-3 text-2xl font-bold sm:text-3xl">هزینه‌ی سایت فروشگاهی‌تون چقدره؟</h2>
        <p class="text-balance text-sm leading-loose text-fg/70 sm:text-base">
          همه‌ی پلن‌ها روی همان سیستم فروشگاهی ما ساخته می‌شن؛ تفاوت در همراهی ما بعد از تحویله.
        </p>
      </div>

      <div class="grid gap-4 md:grid-cols-2 md:items-stretch md:gap-5">
        <div
          v-for="(plan, i) in plans"
          :key="plan.id"
          class="reveal h-full"
          :class="[
            i === 0 ? 'order-first md:order-none' : '',
            i === 0 ? 'reveal-delay-1' : 'reveal-delay-2',
          ]"
        >
          <div
            class="relative flex h-full flex-col rounded-2xl p-5 text-start sm:p-6"
            :class="plan.highlight
              ? 'border-2 border-brand bg-card shadow-[0_8px_30px_rgb(0_220_130/0.18)] dark:shadow-[0_0_40px_rgb(0_220_130/0.14)]'
              : plan.green ? 'border-2 border-brand bg-card' : 'border border-fg/15 bg-card'"
          >
            <span
              class="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-brand px-3 py-0.5 text-xs font-bold text-black"
            >
              <UIcon name="i-lucide-star" class="size-3.5" />
              {{ plan.label }}
            </span>

            <h3 class="mb-4 text-lg font-bold">{{ plan.name }}</h3>

            <div v-if="plan.price" class="mb-5 flex flex-wrap items-baseline gap-x-1.5">
              <span v-if="plan.price.prefix" class="text-sm text-fg/60">{{ plan.price.prefix }}</span>
              <span class="text-3xl font-bold" :class="plan.highlight || plan.green ? 'text-brand-ink' : ''">{{ plan.price.amount }}</span>
              <span class="text-sm text-fg/60">{{ plan.price.unit }}</span>
            </div>
            <div
              v-else
              class="mb-5 flex h-[2.625rem] items-center justify-center rounded-lg border border-dashed border-fg/20 bg-panel text-xs font-bold text-fg/45"
            >
              قیمت به‌زودی
            </div>

            <ul v-if="plan.features.length" class="mb-6 min-h-36 flex-1 space-y-3 text-sm leading-6">
              <li v-for="f in plan.features" :key="f.text" class="flex items-start gap-2" :class="f.included ? '' : 'text-fg/45'">
                <UIcon
                  :name="f.included ? 'i-lucide-check' : 'i-lucide-x'"
                  class="mt-1 size-4 shrink-0"
                  :class="f.included ? 'text-brand-ink' : 'text-fg/40'"
                />
                <span :class="f.strong ? 'font-bold' : ''">{{ f.text }}</span>
              </li>
            </ul>
            <div
              v-else
              class="mb-6 flex min-h-36 items-center justify-center rounded-lg border border-dashed border-fg/20 bg-panel px-3 text-center text-xs font-bold leading-6 text-fg/45"
            >
              امکانات این پلن<br>به‌زودی اضافه می‌شه
            </div>

            <p
              v-if="plan.note"
              class="mb-3 flex items-center justify-center gap-1.5 rounded-lg bg-brand/10 px-3 py-2 text-center text-xs font-bold text-brand-ink"
            >
              <UIcon name="i-lucide-users" class="size-4 shrink-0" />
              {{ plan.note }}
            </p>

            <a
              :href="TELEGRAM_URL"
              target="_blank"
              rel="noopener"
              class="mt-auto inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold bg-brand text-black shadow-[0_4px_14px_rgb(0_220_130/0.40)] transition-opacity duration-300 hover:opacity-90 dark:shadow-[0_0_12px_rgb(0_220_130/0.35)]"
            >
              {{ plan.cta }}
              <UIcon name="i-lucide-arrow-left" class="size-4" />
            </a>
          </div>
        </div>
      </div>

      <p class="reveal mt-8 flex items-start justify-center gap-2 text-xs leading-6 text-fg/60 sm:text-sm md:items-center md:whitespace-nowrap">
        <UIcon name="i-lucide-info" class="mt-1 size-4 shrink-0 md:mt-0" />
        <span>قیمت نهایی بعد از بررسی نیازها شفاف اعلام می‌شه؛ نصف مبلغ موقع قرارداد و نصف دیگه موقع تحویل سایت.</span>
      </p>
    </div>
  </section>
</template>
