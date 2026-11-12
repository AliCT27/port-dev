<script setup lang="ts">
useScrollReveal('.reveal')

// گروه‌بندی امکانات. برای اضافه/حذف کردن فقط همین آرایه را ویرایش کنید.
// هر امکان یک ردیف زیگزاگی می‌سازه. description و image اختیاری‌اند؛ تا وقتی ننوشته باشید
// جای‌نگهدار «به‌زودی» نمایش داده میشه. مثال:
//   { title: 'کیف پول کاربران', description: 'توضیح کوتاه...', image: '/images/features/wallet.webp' }
// (عکس‌ها ۱۶:۹ و ترجیحاً ۱۲۰۰×۶۷۵ با فرمت WebP)
interface Feature { title: string, description?: string, image?: string }

const groups: { title: string, image: string, icon: string, items: Feature[] }[] = [
  {
    title: 'فروش و مالی',
    image: '/images/features/sales.webp',
    icon: 'i-lucide-wallet',
    items: [
      { title: 'محاسبه سود فروش' },
      { title: 'همکاری در فروش و پورسانت' },
      { title: 'کیف پول کاربران' },
      { title: 'مدیریت تراکنش‌ها' },
      { title: 'فاکتور و پیش‌فاکتور' },
    ],
  },
  {
    title: 'سفارش و ارسال',
    image: '/images/features/orders.webp',
    icon: 'i-lucide-truck',
    items: [
      { title: 'مدیریت حرفه‌ای سفارشات' },
      { title: 'سیستم حمل‌ونقل و رهگیری' },
      { title: 'اعلان داخلی و پیامکی' },
      { title: 'سبد خرید رهاشده' },
      { title: 'اتصال به ترب' },
    ],
  },
  {
    title: 'تجربه‌ی مشتری',
    image: '/images/features/customer.webp',
    icon: 'i-lucide-heart-handshake',
    items: [
      { title: 'باشگاه مشتریان' },
      { title: 'جستجو و فیلتر پیشرفته' },
      { title: 'علاقمندی‌ها و بازدیدهای اخیر' },
      { title: 'نقد و بررسی و امتیازدهی' },
      { title: 'گالری تصاویر خریداران' },
      { title: 'استوری مشابه اینستاگرام' },
      { title: 'حالت شب و روز' },
    ],
  },
  {
    title: 'محتوا و مدیریت',
    image: '/images/features/admin.webp',
    icon: 'i-lucide-layout-dashboard',
    items: [
      { title: 'گزارش‌ها و نمودارهای حرفه‌ای' },
      { title: 'مجله و منشن محصولات' },
      { title: 'صفحه‌ساز اختصاصی' },
      { title: 'فرم‌ساز و نظرسنجی' },
      { title: 'مدیریت سطح دسترسی (ACL)' },
    ],
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
  'بارگذاری سریع صفحات',
  'رابط کاربری مدرن',
  'سازگار با دسکتاپ، موبایل و تبلت',
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

      <!-- هر گروه: عنوان + عکس گروه + ردیف‌های زیگزاگی امکانات -->
      <div ref="gallery" class="space-y-16 sm:space-y-20">
        <div v-for="g in groups" :key="g.title">
          <div class="reveal mb-8 flex items-center gap-3">
            <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand">
              <UIcon :name="g.icon" class="size-5" />
            </span>
            <h3 class="text-xl font-bold sm:text-2xl">{{ g.title }}</h3>
            <span class="h-px flex-1 bg-white/10" />
          </div>

          <!-- تصویر گروه؛ اگر نبود جای خالی با همان نسبت نمایش داده می‌شود -->
          <div class="reveal mx-auto mb-8 max-w-2xl">
            <div
              class="aspect-[16/9] overflow-hidden rounded-xl border"
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
          </div>

          <div class="space-y-8 sm:space-y-10">
            <!-- reveal روی لایه‌ی بیرونی؛ چیدمان و استایل روی لایه‌ی داخلی (تا با هم تداخل نکنن) -->
            <div v-for="(f, i) in g.items" :key="f.title" class="reveal">
              <div
                class="flex flex-col gap-5 md:items-center md:gap-12"
                :class="i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'"
              >
                <div class="md:w-5/12">
                  <div
                    class="aspect-[16/9] overflow-hidden rounded-xl border"
                    :class="f.image && !failed[f.title]
                      ? 'border-white/10 bg-neutral-900'
                      : 'border-dashed border-white/15 bg-white/[0.02] text-white/40'"
                  >
                    <img
                      v-if="f.image && !failed[f.title]"
                      :src="f.image"
                      :alt="f.title"
                      :data-feature="f.title"
                      width="1200"
                      height="675"
                      loading="lazy"
                      decoding="async"
                      class="h-full w-full object-cover object-top"
                      @error="failed[f.title] = true"
                    >
                    <div v-else class="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
                      <UIcon name="i-lucide-image" class="size-8" />
                      <span class="text-xs font-bold leading-6">تصویر این امکان<br>به‌زودی اضافه می‌شه</span>
                    </div>
                  </div>
                </div>

                <div class="md:w-7/12">
                  <h4 class="mb-2 flex items-center gap-2 text-base font-bold sm:text-lg">
                    <span class="flex size-6 shrink-0 items-center justify-center rounded-md bg-brand/15 text-brand">
                      <UIcon name="i-lucide-check" class="size-4" />
                    </span>
                    {{ f.title }}
                  </h4>
                  <p v-if="f.description" class="text-sm leading-loose sm:text-base text-white/70">
                    {{ f.description }}
                  </p>
                  <p v-else class="text-sm leading-loose text-white/40">
                    توضیح این امکان به‌زودی اضافه می‌شه.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- دو کارت پایین بخش امکانات؛ توی دسکتاپ کنار هم، توی موبایل زیر هم -->
      <div class="mt-16 grid gap-4 sm:mt-20 md:grid-cols-2">
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
