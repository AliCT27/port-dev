<script setup lang="ts">
useScrollReveal('.reveal')

// گروه‌بندی امکانات. برای اضافه/حذف کردن فقط همین آرایه را ویرایش کنید.
const groups = [
  {
    title: 'فروش و مالی',
    image: '/images/features/sales.webp',
    icon: 'i-lucide-wallet',
    items: ['محاسبه سود فروش', 'همکاری در فروش و پورسانت', 'کیف پول کاربران', 'مدیریت تراکنش‌ها', 'فاکتور و پیش‌فاکتور'],
  },
  {
    title: 'سفارش و ارسال',
    image: '/images/features/orders.webp',
    icon: 'i-lucide-truck',
    items: ['مدیریت حرفه‌ای سفارشات', 'سیستم حمل‌ونقل و رهگیری', 'اعلان داخلی و پیامکی', 'سبد خرید رهاشده', 'اتصال به ترب'],
  },
  {
    title: 'تجربه‌ی مشتری',
    image: '/images/features/customer.webp',
    icon: 'i-lucide-heart-handshake',
    items: ['باشگاه مشتریان', 'جستجو و فیلتر پیشرفته', 'علاقمندی‌ها و بازدیدهای اخیر', 'نقد و بررسی و امتیازدهی', 'گالری تصاویر خریداران', 'استوری مشابه اینستاگرام', 'حالت شب و روز'],
  },
  {
    title: 'محتوا و مدیریت',
    image: '/images/features/admin.webp',
    icon: 'i-lucide-layout-dashboard',
    items: ['گزارش‌ها و نمودارهای حرفه‌ای', 'مجله و منشن محصولات', 'صفحه‌ساز اختصاصی', 'فرم‌ساز و نظرسنجی', 'مدیریت سطح دسترسی (ACL)'],
  },
]

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

// ویژگی‌های فنی که به‌صورت نشان کوچک نمایش داده می‌شن
const tech = [
  'جابه‌جایی سریع بین صفحات، بدون لود دوباره',
  'بارگذاری سریع صفحات',
  'رابط کاربری مدرن',
  'سازگار با دسکتاپ، موبایل و تبلت',
]
</script>

<template>
  <section id="features" ref="root" class="py-12 sm:py-16">
    <div class="mx-auto max-w-6xl px-6">
      <div class="reveal mx-auto mb-10 max-w-2xl text-center">
        <h2 class="mb-4 text-balance text-2xl font-bold sm:text-3xl">
          به یک سایت فروشگاهی معمولی قانع نباشید!
        </h2>
        <p class="text-sm leading-loose sm:text-base text-white/70">
          سیستم فروشگاهی حرفه‌ای با قابلیت تک‌فروشندگی و چندفروشندگی، با کدنویسی کاملاً اختصاصی از صفر تا ۱۰۰؛
          همه‌ی چیزهایی که یک کسب‌وکار ایرانی برای فروش آنلاین لازم داره.
        </p>

        <!-- ویژگی‌های فنی -->
        <div class="mt-6 flex flex-wrap items-center justify-center gap-2.5">
          <span
            v-for="t in tech"
            :key="t"
            class="rounded-md border px-3.5 py-1.5 text-xs font-bold sm:text-sm border-white/15 bg-white/5"
          >
            {{ t }}
          </span>
        </div>
      </div>

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

      <div class="grid gap-4 sm:grid-cols-2">
        <!-- reveal روی لایه‌ی بیرونی؛ transition هاور روی کارت داخلی (تا با هم تداخل نکنن) -->
        <div v-for="g in groups" :key="g.title" class="reveal">
          <div
            class="h-full rounded-2xl border p-5 transition-colors duration-500 ease-in-out md:hover:border-brand sm:p-6 border-white/10 bg-white/[0.03]"
          >
            <!-- تصویر گروه؛ اگر نبود جای خالی با همان نسبت نمایش داده می‌شود -->
            <div
              class="mb-5 aspect-[16/9] overflow-hidden rounded-xl border"
              :class="failed[g.title]
                ? 'border-dashed border-white/15 bg-white/[0.02] text-white/40'
                : 'border-white/10 bg-neutral-900'"
            >
              <img
                v-if="!failed[g.title]"
                :src="g.image"
                :alt="g.title"
                :data-feature="g.title"
                width="1200"
                height="675"
                loading="lazy"
                decoding="async"
                class="h-full w-full object-cover object-top"
                @error="failed[g.title] = true"
              >
              <div v-else class="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
                <UIcon name="i-lucide-image" class="size-8" />
                <span class="text-xs font-bold leading-6">تصویر این بخش<br>به‌زودی اضافه می‌شه</span>
              </div>
            </div>

            <div class="mb-4 flex items-center gap-3">
              <span class="flex size-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
                <UIcon :name="g.icon" class="size-5" />
              </span>
              <h3 class="text-base font-bold sm:text-lg">{{ g.title }}</h3>
            </div>
            <ul class="grid gap-x-4 gap-y-2.5 text-sm sm:text-[0.95rem] text-white/75">
              <li v-for="it in g.items" :key="it" class="flex items-start gap-2">
                <UIcon name="i-lucide-check" class="mt-1 size-4 shrink-0 text-brand" />
                <span>{{ it }}</span>
              </li>
            </ul>
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
