<script setup lang="ts">
useScrollReveal('.reveal')

// گروه‌بندی امکانات. برای اضافه/حذف کردن فقط همین آرایه را ویرایش کنید.
const groups = [
  {
    title: 'فروش و مالی',
    image: '/images/features/sales.webp',
    icon: 'i-lucide-wallet',
    items: ['محاسبه سود فروش', 'سیستم POS فروش حضوری', 'همکاری در فروش و پورسانت', 'کیف پول کاربران', 'مدیریت تراکنش‌ها', 'فاکتور و پیش‌فاکتور'],
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
const gallery = ref<HTMLElement | null>(null)

onMounted(() => {
  // اگر عکس قبل از hydration خطا داده بود، دوباره بررسی می‌کنیم
  gallery.value?.querySelectorAll<HTMLImageElement>('img[data-feature]').forEach((img) => {
    if (img.complete && img.naturalWidth === 0) failed.value[img.dataset.feature!] = true
  })
})

// مواردی که از ووکامرس منتقل می‌شن
const migrate = ['دسته‌بندی‌ها', 'محصولات', 'تصاویر محصولات', 'مقالات سایت']

// ویژگی‌های فنی که به‌صورت نشان کوچک نمایش داده می‌شن
const tech = [
  'جابه‌جایی سریع بین صفحات، بدون لود دوباره',
  'بارگذاری فوق‌سریع صفحات',
  'رابط کاربری مدرن',
  'سازگار با موبایل و تبلت',
]
</script>

<template>
  <section id="features" class="py-12 sm:py-16">
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

      <div ref="gallery" class="grid gap-4 sm:grid-cols-2">
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

      <!-- قابلیت‌های دیگه که در جلسه‌ی مشاوره بررسی می‌شن -->
      <div class="reveal mt-4">
        <div
          class="flex flex-col items-center gap-2 rounded-2xl border border-dashed px-5 py-6 text-center sm:px-8 border-white/15 bg-white/[0.02]"
        >
          <span class="flex size-10 items-center justify-center rounded-xl bg-brand/15 text-brand">
            <UIcon name="i-lucide-sparkles" class="size-5" />
          </span>
          <h3 class="text-base font-bold sm:text-lg">این فقط بخشی از ماجراست</h3>
          <p class="max-w-2xl text-sm leading-loose sm:text-base text-white/70">
            صدها قابلیت دیگه داریم که فقط پیش ما پیدا می‌شه و جا نیست همه‌شون رو اینجا با عکس و ویدیو نشون بدیم.
            توی جلسه‌ی مشاوره همه‌ی امکانات رو با هم بررسی می‌کنیم.
          </p>
        </div>
      </div>

      <!-- مهاجرت از ووکامرس -->
      <div class="reveal mt-4">
        <div
          class="flex flex-col items-start gap-3 rounded-2xl border border-brand/40 bg-brand/10 p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6"
        >
          <span class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand text-black">
            <UIcon name="i-lucide-refresh-cw" class="size-6" />
          </span>
          <div>
            <h3 class="mb-1 text-base font-bold sm:text-lg">سایت ووکامرسی دارید؟ راحت به سایت جدید منتقل می‌شید</h3>
            <p class="mb-3 text-sm leading-loose text-white/70">
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
  </section>
</template>
