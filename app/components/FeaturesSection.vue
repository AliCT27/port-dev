<script setup lang="ts">
useScrollReveal('.reveal')

// عکسی که پیدا نشود (یا هنوز نگذاشته باشید) → جای خالی «به‌زودی» نمایش داده می‌شود
const failed = ref<Record<string, boolean>>({})
const root = ref<HTMLElement | null>(null)

onMounted(() => {
  // اگر عکس قبل از hydration خطا داده بود، دوباره بررسی می‌کنیم
  root.value?.querySelectorAll<HTMLImageElement>('img[data-feature]').forEach((img) => {
    if (img.complete && img.naturalWidth === 0) failed.value[img.dataset.feature!] = true
  })
})

// درگاه‌های پرداخت و پنل‌های پیامکی پشتیبانی‌شده. برای اضافه کردن، یک مورد به آرایه بدید:
//   { name: 'زرین‌پال', logo: '/images/gateways/zarinpal.webp' }
// لوگو مربع (ترجیحاً ۲۵۶×۲۵۶ با زمینه‌ی شفاف، WebP/PNG/SVG) توی public/images/gateways/
// تا وقتی آرایه خالیه، جای‌نگهدار «به‌زودی» نمایش داده میشه.
interface Gateway { name: string, logo?: string }

const gatewayGroups: { title: string, items: Gateway[] }[] = [
  {
    title: 'درگاه‌های پرداخت',
    items: [
      { name: 'زرین‌پال', logo: '/images/gateways/zarinpal.webp' },
      { name: 'ترب‌پی', logo: '/images/gateways/torobpay.webp' },
      { name: 'دیجی‌پی', logo: '/images/gateways/digipay.webp' },
      { name: 'اسنپ‌پی', logo: '/images/gateways/snapppay.webp' },
      { name: 'به‌پرداخت', logo: '/images/gateways/behpardakht.webp' },
      { name: 'نکست‌پی', logo: '/images/gateways/nextpay.webp' },
      { name: 'آسان‌پرداخت', logo: '/images/gateways/asanpardakht.webp' },
      { name: 'پارسیان', logo: '/images/gateways/parsian.webp' },
      { name: 'سداد - ملی', logo: '/images/gateways/sadad.webp' },
      { name: 'سامان', logo: '/images/gateways/saman.webp' },
      { name: 'پاسارگاد', logo: '/images/gateways/pasargad.webp' },
      { name: 'سپهر - صادرات', logo: '/images/gateways/sepehr.webp' },
      { name: 'پارس‌پال', logo: '/images/gateways/parspal.webp' },
      { name: 'زیبال', logo: '/images/gateways/zibal.webp' },
      { name: 'آقای پرداخت', logo: '/images/gateways/aghayepardakht.webp' },
      { name: 'تومن', logo: '/images/gateways/toman.webp' },
      { name: 'ازکی‌وام', logo: '/images/gateways/azkivam.webp' },
      { name: 'شپا', logo: '/images/gateways/shepa.webp' },
      { name: 'وندار', logo: '/images/gateways/vandar.webp' },
      { name: 'پی‌پینگ (نقدی)', logo: '/images/gateways/payping.webp' },
      { name: 'کارت به کارت', logo: '/images/gateways/card-to-card.webp' },
    ],
  },
  {
    title: 'پنل‌های پیامکی',
    items: [
      { name: 'کاوه‌نگار', logo: '/images/gateways/kavenegar.webp' },
      { name: 'قاصدک', logo: '/images/gateways/ghasedak.webp' },
      { name: 'ملی پیامک', logo: '/images/gateways/melipayamak.webp' },
      { name: 'مدیانا', logo: '/images/gateways/mediana.webp' },
      { name: 'ippanel', logo: '/images/gateways/ippanel.webp' },
      { name: 'ایده‌پردازان (sms.ir)', logo: '/images/gateways/sms-ir.webp' },
    ],
  },
]

// مواردی که از ووکامرس منتقل می‌شن
const migrate = ['دسته‌بندی‌ها', 'محصولات', 'تصاویر محصولات', 'مقالات سایت']

</script>

<template>
  <section id="features" ref="root" class="py-12 sm:py-16">
    <div class="mx-auto max-w-6xl px-6">
      <!-- درگاه‌های پرداخت و پنل‌های پیامکی پشتیبانی‌شده -->
      <div class="mx-auto mb-12 max-w-4xl sm:mb-14">
        <div class="reveal mb-6 text-center">
          <h3 class="mb-2 text-xl font-bold sm:text-2xl">درگاه‌ها و پنل‌های پشتیبانی‌شده</h3>
          <p class="text-sm leading-loose sm:text-base text-white/70">
            درگاه‌های پرداخت و پنل‌های پیامکی که سایت شما بهشون وصل می‌شه
          </p>
        </div>

        <div class="space-y-4">
          <div v-for="gg in gatewayGroups" :key="gg.title" class="reveal">
            <div class="rounded-2xl border border-dashed p-5 sm:p-8 border-white/15 bg-white/[0.02]">
              <h4 class="mb-6 text-center text-sm font-bold sm:text-base">{{ gg.title }}</h4>

              <ul v-if="gg.items.length" class="flex flex-wrap justify-center gap-x-3 gap-y-5 sm:gap-x-5">
                <li v-for="g in gg.items" :key="g.name" class="flex w-20 flex-col items-center gap-2 text-center sm:w-24">
                  <span class="flex size-16 items-center justify-center rounded-xl bg-white p-2.5 sm:size-[4.5rem]">
                    <img
                      v-if="g.logo && !failed['gw:' + g.name]"
                      :src="g.logo"
                      :alt="g.name"
                      :data-feature="'gw:' + g.name"
                      width="72"
                      height="72"
                      loading="lazy"
                      decoding="async"
                      class="size-full object-contain"
                      @error="failed['gw:' + g.name] = true"
                    >
                    <UIcon v-else name="i-lucide-image" class="size-6 text-black/30" />
                  </span>
                  <span class="text-xs leading-5 text-white/70">{{ g.name }}</span>
                </li>
              </ul>
              <p v-else class="text-center text-sm leading-loose text-white/40">
                لیست این بخش به‌زودی اضافه می‌شه.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- دو کارت پایین بخش امکانات؛ توی دسکتاپ کنار هم، توی موبایل زیر هم -->
      <div class="mt-4 grid gap-4 md:grid-cols-2">
      <!-- قابلیت‌های دیگه که در جلسه‌ی مشاوره بررسی می‌شن -->
      <div class="reveal">
        <div
          class="flex h-full flex-col items-start justify-start gap-2 rounded-2xl border border-dashed px-5 py-6 text-start sm:px-8 border-white/15 bg-white/[0.02]"
        >
          <span class="flex size-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
            <UIcon name="i-lucide-sparkles" class="size-5" />
          </span>
          <h3 class="text-base font-bold sm:text-lg">این فقط بخشی از ماجراست</h3>
          <p class="max-w-2xl text-sm leading-loose sm:text-base text-white/70">
            صدها قابلیت دیگه داریم که به‌صورت اختصاصی و با توجه به نیاز آنلاین شاپ‌های ایرانی کدنویسی شده و جا نیست همه‌شون رو اینجا با عکس و ویدیو نشون بدیم.
            توی جلسه‌ی مشاوره همه‌ی امکانات موردنیاز شما رو با هم بررسی می‌کنیم.
          </p>
        </div>
      </div>

      <!-- مهاجرت از ووکامرس -->
      <div class="reveal">
        <div
          class="flex h-full flex-col items-start justify-start gap-2 rounded-2xl border border-brand/40 bg-brand/10 px-5 py-6 sm:px-8"
        >
          <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand text-black">
            <UIcon name="i-lucide-refresh-cw" class="size-5" />
          </span>
          <div class="flex flex-col items-start gap-2">
            <h3 class="text-base font-bold sm:text-lg">سایت ووکامرسی دارید؟ راحت به سایت جدید منتقل می‌شید</h3>
            <p class="text-sm leading-loose text-white/70 sm:text-base">
              اطلاعات فروشگاه فعلی‌تون از بین نمی‌ره. ما این موارد رو برای شما منتقل می‌کنیم و لازم نیست چیزی رو دوباره وارد کنید:
            </p>
            <ul class="flex flex-wrap gap-x-5 gap-y-2 text-sm font-bold">
              <li v-for="m in migrate" :key="m" class="flex items-center gap-1.5">
                <UIcon name="i-lucide-check" class="size-4 shrink-0 text-brand" />
                {{ m }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      </div>
    </div>
  </section>
</template>
