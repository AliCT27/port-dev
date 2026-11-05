<script setup lang="ts">
const technologies = useTechStack()
useScrollReveal('.reveal')

// هر گروهِ نوار، فهرستِ تکنولوژی‌ها رو چند بار پشت‌سرهم داره تا همیشه پهن‌تر از قابِ نمایش باشه و هیچ‌وقت جای خالی ته نوار دیده نشه
const REPEATS = 2
const items = Array.from({ length: REPEATS }, () => technologies).flat()

// سرعت حرکت: زمانِ عبورِ هر کارت (ثانیه)؛ عدد بیشتر = کندتر
const SECONDS_PER_ITEM = 4
const duration = `${items.length * SECONDS_PER_ITEM}s`
</script>

<template>
  <section id="stacks" class="border-y border-black/10 bg-neutral-50 py-10 dark:border-white/10 dark:bg-white/[0.03]">
    <div class="mx-auto max-w-6xl px-6">
      <div class="reveal mb-8 text-center">
        <h2 class="text-2xl font-bold sm:text-3xl">تکنولوژی‌هایی که سایت شما ازشون قدرت می‌گیرن</h2>
      </div>
    </div>

    <!-- نوار بی‌پایان: یک خط، دو طرفش محو، همیشه در حال حرکت (با هاور هم نمی‌ایسته) -->
    <div dir="ltr" class="reveal reveal-delay-1 marquee mx-auto max-w-6xl py-3" :style="{ '--marquee-duration': duration }">
      <div class="marquee-track">
        <div
          v-for="copy in 2"
          :key="copy"
          class="marquee-group"
          :class="copy === 2 ? 'marquee-dup' : ''"
          :aria-hidden="copy === 2 ? 'true' : undefined"
        >
          <div
            v-for="(tech, n) in items"
            :key="`${copy}-${n}`"
            class="group relative flex aspect-square w-24 shrink-0 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-xl border border-black/10 bg-white p-1.5 shadow-none transition-[transform,border-color,box-shadow] duration-700 ease-in-out hover:-translate-y-1 hover:border-brand hover:shadow-md sm:w-28 sm:p-3 dark:border-white/10 dark:bg-dark"
          >
            <UIcon
              :name="tech.icon"
              class="relative z-10 shrink-0 transition-transform duration-1000 ease-in-out group-hover:scale-110"
              :class="['MySQL', 'Tailwind CSS'].includes(tech.name) ? 'size-12' : 'size-10'"
              :style="{ color: tech.color }"
            />
            <span
              class="relative z-10 whitespace-nowrap text-center font-semibold text-black/85 dark:text-white/85"
              :class="tech.name.length > 10 ? 'text-[11px] sm:text-sm' : 'text-sm'"
            >{{ tech.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.marquee {
  overflow: hidden;
  /* محو شدن دو طرفِ قاب (قاب هم‌عرضِ بقیه‌ی بخش‌هاست، نه کل صفحه) */
  -webkit-mask-image: linear-gradient(to right, transparent 0, #000 18%, #000 82%, transparent 100%);
  mask-image: linear-gradient(to right, transparent 0, #000 18%, #000 82%, transparent 100%);
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee-scroll var(--marquee-duration, 40s) linear infinite;
  will-change: transform;
}

/* فاصله‌ی انتهایِ هر گروه هم‌اندازه‌ی فاصله‌ی بین کارت‌هاست، تا حلقه بدون پرش بسته بشه */
.marquee-group {
  display: flex;
  flex-shrink: 0;
  gap: 0.75rem;
  padding-right: 0.75rem;
}

@keyframes marquee-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

/* کاهش حرکت: نوار ثابت می‌مونه و با اسکرول افقی قابل دیدنه */
@media (prefers-reduced-motion: reduce) {
  .marquee { overflow-x: auto; }
  .marquee-track { animation: none; }
  .marquee-dup { display: none; }
}
</style>
