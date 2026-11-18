// dokme-ye shab/rooz too header: true = site pish-farz shab hast va karbar mitune ba dokme be rooz bere (halat-e alan)
// false = dokme bardashte mishe va site hamishe shab hast (entekhab-e qabli-ye karbar ham nadide gerefte mishe)
const THEME_TOGGLE = true

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

    // baraye ejaze-dadan be Google va baqiye-ye robot-ha baraye index-kardan-e site: true
    // baraye makhfi-kardan-e kamel-e site az natayej-e jostejoo (masalan ta vaqti hanuz amade nist): false
    indexable: false
  },

  // Service Worker va polling-e version baraye site-e static lazem nist (rooye host-e ma'muli faqat 404 migereft)
  skewProtection: false,

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

  // icon-ha dakhel-e khod-e site baste-bandi mishan va az server-e iconify.design (khareji; too Iran momkene kond ya filter bashe) gerefte nemishan
  icon: {
    mode: 'svg',
    clientBundle: {
      // composables ham scan beshan (icon-haye logo-ye technology-ha dakhel-e useTechStack.ts neveshte shodan)
      scan: { globInclude: ['app/**/*.{vue,ts}'] }
    },
    fallbackToApi: false
  },

  // font-haye site (YekanBakh va Arad) local hastan; pas faraham-konande-haye online-e font ro khamush mikonim ta module-e fonts soraghe internet (ke momkene baste ya kond bashe) nare
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

  // vaqti dokme nist, key-e zakhire avaz mishe ta entekhab-e qadimi-ye karbar (rooz) estefade nashe
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    storageKey: THEME_TOGGLE ? 'nuxt-color-mode' : 'nuxt-color-mode-locked'
  },

  runtimeConfig: {
    public: { themeToggle: THEME_TOGGLE }
  },

  css: ['~/assets/css/main.css', 'lenis/dist/lenis.css'],

  // faqat baraye halat-e dev: lenis az qabl baste-bandi mishe ta avvalin bargozari-ye safhe reload nashe
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
