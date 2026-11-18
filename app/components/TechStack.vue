<script setup lang="ts">
const technologies = useTechStack()
useScrollReveal('.reveal')

// har goroh-e navar, fehrest-e technology-ha ro chand bar posht-e sar-e ham dare ta hamishe pahn-tar az qab-e namayesh bashe va hichvaqt jaye khali tah-e navar dide nashe
const REPEATS = 2
const items = Array.from({ length: REPEATS }, () => technologies).flat()

// sor'at-e harekat: zaman-e obur-e har kart (saniye); adad-e bishtar = kond-tar
const SECONDS_PER_ITEM = 4
const duration = `${items.length * SECONDS_PER_ITEM}s`
</script>

<template>
  <section id="stacks" class="border-y py-10 border-fg/10 bg-card">
    <div class="mx-auto max-w-6xl px-6">
      <div class="reveal mb-8 text-center">
        <h2 class="text-2xl font-bold sm:text-3xl">تکنولوژی‌هایی که سایت شما ازشون قدرت می‌گیرن</h2>
      </div>
    </div>

    <!-- navar-e bi-payan: yek khat, do tarafesh mahv, hamishe dar hal-e harekat (ba hover ham nemiyaste) -->
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
            class="group relative flex aspect-square w-24 shrink-0 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-xl border p-1.5 shadow-none transition-[transform,border-color,box-shadow] duration-700 ease-in-out hover:-translate-y-1 hover:border-brand hover:shadow-md sm:w-28 sm:p-3 border-fg/10 bg-page"
          >
            <UIcon
              :name="tech.icon"
              class="relative z-10 shrink-0 transition-transform duration-1000 ease-in-out group-hover:scale-110"
              :class="['MySQL', 'Tailwind CSS'].includes(tech.name) ? 'size-12' : 'size-10'"
              :style="{ color: tech.color }"
            />
            <span
              class="relative z-10 whitespace-nowrap text-center font-semibold text-fg/85"
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
  /* mahv shodan-e do taraf-e qab (qab ham-arz-e baqiye-ye bakhsh-hast, na kol-e safhe) */
  -webkit-mask-image: linear-gradient(to right, transparent 0, #000 18%, #000 82%, transparent 100%);
  mask-image: linear-gradient(to right, transparent 0, #000 18%, #000 82%, transparent 100%);
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee-scroll var(--marquee-duration, 40s) linear infinite;
  will-change: transform;
}

/* fasele-ye entehaye har goroh ham-andaze-ye fasele-ye bein-e kart-hast, ta halqe bedun-e parash baste beshe */
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

/* kahesh-e harekat: navar sabet mimune va ba scroll-e ofoqi qabel-e didan-e */
@media (prefers-reduced-motion: reduce) {
  .marquee { overflow-x: auto; }
  .marquee-track { animation: none; }
  .marquee-dup { display: none; }
}
</style>
