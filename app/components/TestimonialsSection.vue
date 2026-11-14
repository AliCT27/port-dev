<script setup lang="ts">
const { data: allTestimonials } = await useAsyncData('testimonials', () =>
  queryCollection('testimonials').all()
)

const testimonials = computed(() => allTestimonials.value?.filter((item) => item.visible !== false))

// پروژه‌ای که الان تو مودالِ تصاویر بازه (null = بسته)
const active = ref<{ title: string; url?: string; images: string[] } | null>(null)

function openGallery(item: any) {
  if (!item.images?.length) return
  active.value = {
    title: item.company ?? item.name,
    url: item.website,
    images: item.images
  }
}

useScrollReveal('.reveal')
</script>

<template>
  <section id="testimonials" class="py-12">
    <div class="mx-auto max-w-6xl px-6">
      <div class="reveal mb-10 text-center">
        <h2 class="text-2xl font-bold sm:text-3xl">ببینید کارفرماهامون از همکاری با ما چی می‌گن</h2>
      </div>

      <div class="flex flex-wrap justify-center gap-5">
        <div
          v-for="(item, i) in testimonials"
          :key="item.path"
          class="reveal min-w-0 shrink-0 grow-0 basis-full md:basis-[calc((100%-1.25rem)/2)]"
          :class="`reveal-delay-${(i % 5) + 1}`"
        >
          <TestimonialCard :item="item" @open="openGallery(item)" />
        </div>
      </div>
    </div>

    <ClientOnly>
      <ProjectModal :project="active" @close="active = null" />
    </ClientOnly>
  </section>
</template>
