<script setup lang="ts">
useScrollReveal('.reveal')
</script>

<template>
  <section id="team" class="py-12">
    <div class="mx-auto max-w-3xl px-6">
      <!-- reveal روی لایه‌ی بیرونی؛ استایل کارت روی لایه‌ی داخلی -->
      <div class="reveal">
        <div
          class="flex flex-col items-center gap-3 rounded-2xl border border-brand/40 bg-brand/10 px-5 py-8 text-center sm:px-8"
        >
          <span class="flex size-10 items-center justify-center rounded-xl bg-brand text-black">
            <UIcon name="i-lucide-users" class="size-5" />
          </span>
          <h2 class="text-xl font-bold sm:text-2xl">یک تیم ۶ نفره، کنار شما</h2>
          <p class="text-balance text-sm leading-loose sm:text-base text-white/70">
            ما یک تیم ۶ نفره‌ایم و آماده‌ایم شما رو از صفر تا رسیدن به درآمد ایده‌آل همراهی و پشتیبانی کنیم.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
