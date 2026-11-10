<script setup lang="ts">
useSeoMeta({
  title: 'طراحی سایت فروشگاهی با لاراول',
  description: 'طراحی سایت فروشگاهی سریع و مدرن با لاراول و ووجی‌اس. تیم مهندسین سایت؛ انتقال از ووکامرس، پنل مدیریت ساده، درگاه پرداخت و پشتیبانی. مشاوره رایگان.',
  ogTitle: 'مهندسین سایت | طراحی سایت فروشگاهی با لاراول',
  ogDescription: 'طراحی سایت فروشگاهی سریع و مدرن با لاراول و ووجی‌اس. تیم مهندسین سایت؛ انتقال از ووکامرس، پنل مدیریت ساده، درگاه پرداخت و پشتیبانی. مشاوره رایگان.',
  ogImage: '/images/og-image.webp',
  ogLocale: 'fa_IR'
})

// معرفی تیم به گوگل (Organization) همراه با لوگوی مربعی ۵۱۲×۵۱۲
useSchemaOrg([
  defineOrganization({
    name: 'مهندسین سایت',
    url: 'https://mohandesinsite.ir',
    logo: 'https://mohandesinsite.ir/images/logo.webp',
    description: 'تیم طراحی و توسعه سایت‌های فروشگاهی سریع و مدرن با لاراول و ووجی‌اس',
    sameAs: [
      'https://www.instagram.com/mohandesin.site',
      'https://t.me/msite_support'
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        telephone: '+989019837586',
        availableLanguage: 'fa'
      }
    ]
  })
])
</script>

<template>
  <div>
    <HeroSection />
    <AboutSection />
    <TestimonialsSection />
    <FeaturesSection />
    <TechStack />
    <FaqSection />
    <ContactSection />
  </div>
</template>
