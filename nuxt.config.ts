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
    description: 'پورتفولیو یک توسعه‌دهنده فول‌استک — تخصص در لاراول، ووجی‌اس، اینرشیا و ناکست.',
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

  icon: {
    mode: 'svg'
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
      titleTemplate: '%s · مهندسین سایت | طراحی سایت فروشگاهی با لاراول',
      link: [
        { rel: 'icon', type: 'image/webp', href: '/favicon.webp' }
      ]
    }
  },

  ogImage: {
    enabled: false
  }
})
