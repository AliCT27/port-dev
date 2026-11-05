export default defineNuxtConfig({
  compatibilityDate: '2026-01-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxtjs/seo'
  ],

  site: {
    url: 'https://mohandesinsite.ir',
    name: 'مهندسین سایت | طراحی سایت فروشگاهی با لاراول',
    description: 'طراحی سایت فروشگاهی سریع و مدرن با لاراول و ووجی‌اس. تیم مهندسین سایت؛ انتقال از ووکامرس، پنل مدیریت ساده، درگاه پرداخت و پشتیبانی. مشاوره رایگان.',
    defaultLocale: 'fa',

    // برای اجازه‌دادن به گوگل و بقیه‌ی ربات‌ها برای ایندکس‌کردن سایت: true
    // برای مخفی‌کردن کامل سایت از نتایج جستجو (مثلاً تا وقتی هنوز آماده نیست): false
    indexable: false
  },

  ssr: true,
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/']
    }
  },

  content: {
    experimental: {
      sqliteConnector: 'native'
    }
  },

  // آیکن‌ها داخل خودِ سایت بسته‌بندی می‌شن و از سرور iconify.design (خارجی؛ توی ایران ممکنه کند یا فیلتر باشه) گرفته نمی‌شن
  icon: {
    mode: 'svg',
    clientBundle: {
      // composables هم اسکن بشن (آیکن‌های لوگوی تکنولوژی‌ها داخل useTechStack.ts نوشته شدن)
      scan: { globInclude: ['app/**/*.{vue,ts}'] }
    },
    fallbackToApi: false
  },

  // فونت‌های سایت (یکان‌بخ و اراد) لوکال هستن؛ پس فراهم‌کننده‌های آنلاینِ فونت رو خاموش می‌کنیم تا ماژول fonts سراغ اینترنت (که ممکنه بسته یا کند باشه) نره
  fonts: {
    providers: {
      adobe: false,
      bunny: false,
      fontshare: false,
      fontsource: false,
      google: false,
      googleicons: false
    }
  },

  colorMode: {
    preference: 'dark',
    fallback: 'dark'
  },

  css: ['~/assets/css/main.css', 'lenis/dist/lenis.css'],

  // فقط برای حالت dev: lenis از قبل بسته‌بندی میشه تا اولین بارگذاریِ صفحه ری‌لود نشه
  vite: {
    optimizeDeps: {
      include: ['lenis']
    }
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'fa',
        dir: 'rtl'
      },
      titleTemplate: '%s · مهندسین سایت',
      link: [
        { rel: 'icon', type: 'image/webp', href: '/favicon.webp' }
      ]
    }
  },

  ogImage: {
    enabled: false
  }
})
