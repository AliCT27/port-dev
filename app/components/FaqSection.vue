<script setup lang="ts">
const { data: faqs } = await useAsyncData('faq', () =>
  queryCollection('faq').order('order', 'ASC').all()
)

const openIndex = ref<number | null>(null)

function toggle(i: number) {
  openIndex.value = openIndex.value === i ? null : i
}

// شماره‌ی سوال با رقم فارسی و دو رقمی (۰۱، ۰۲، ...)
const toFa = (n: number) =>
  String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]!)

useScrollReveal('.reveal')
</script>

<template>
  <section id="faq" class="border-y border-black/10 bg-neutral-50 py-12 dark:border-white/10 dark:bg-dark">
    <div class="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-[1fr_1.7fr] md:gap-14">
      <div class="reveal md:sticky md:top-28 md:self-start">
        <p class="mb-3 text-sm font-bold tracking-wide text-brand">پرتکرارترین سوال‌هایی‌که</p>
        <h2 class="text-2xl font-bold sm:text-3xl">شما عزیزان از ما پرسیدید</h2>
      </div>

      <div class="space-y-3">
        <!-- .reveal فقط opacity را انیمیت می‌کند و transition کارت را بازنویسی می‌کرد؛
             پس جدا شد تا استروک هاور نرم تغییر کند -->
        <div v-for="(item, i) in faqs" :key="item.path" class="reveal">
        <div
          class="rounded-2xl border border-brand md:border-black/10 bg-white transition-colors duration-500 ease-in-out md:hover:border-brand dark:border-brand md:dark:border-white/10 dark:bg-dark"
        >
          <button
            type="button"
            class="flex w-full items-center justify-between gap-3 p-4 text-start text-sm font-bold sm:gap-4 sm:p-5 sm:text-base"
            @click="toggle(i)"
          >
            <span class="flex items-center gap-3">
              <span
                class="shrink-0 text-xs font-bold transition-colors duration-500 sm:text-sm"
                :class="openIndex === i ? 'text-brand' : 'text-black/35 dark:text-white/35'"
                aria-hidden="true"
              dir="rtl"
              >{{ toFa(i + 1) }}<span class="ms-[0.15em]">.</span></span>
              <span>{{ item.question }}</span>
            </span>
            <UIcon
              name="i-lucide-chevron-down"
              class="size-4 shrink-0 transition-transform duration-500 ease-in-out sm:size-5"
              :class="openIndex === i ? 'rotate-180' : ''"
            />
          </button>

          <div
            class="grid transition-[grid-template-rows] duration-500 ease-in-out"
            :class="openIndex === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
          >
            <div class="overflow-hidden">
              <ContentRenderer
                :value="item"
                class="prose max-w-none px-5 pb-5 text-sm text-black/70 sm:text-base dark:prose-invert dark:text-white/70"
              />
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </section>
</template>
