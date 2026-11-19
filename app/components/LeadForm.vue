<script setup lang="ts">
// form-e «darkhast-e tamas»: etelaat be /api/lead.php miravad va un be bot-e Bale ferestade mishe
const form = reactive({ name: '', phone: '', business: '', website: '' })
const status = ref<'idle' | 'sending' | 'done' | 'error'>('idle')
const fieldError = ref('')

// adad-haye farsi be englisi, ta ham farsi ham englisi-nevisi ghabul beshe
function toEn(s: string) {
  return s.replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
}

async function submit() {
  if (status.value === 'sending') return
  fieldError.value = ''

  const phone = toEn(form.phone).replace(/[\s-]+/g, '')
  if (form.name.trim().length < 3) {
    fieldError.value = 'نام و نام خانوادگی رو کامل وارد کنید.'
    return
  }
  if (!/^(\+98|0098|98|0)?9\d{9}$/.test(phone)) {
    fieldError.value = 'شماره تماس رو درست وارد کنید، مثل ۰۹۱۲۳۴۵۶۷۸۹.'
    return
  }
  if (!form.business.trim()) {
    fieldError.value = 'نوع کسب‌وکارتون رو بنویسید.'
    return
  }

  status.value = 'sending'
  try {
    await $fetch('/api/lead.php', {
      method: 'POST',
      body: { name: form.name, phone, business: form.business, website: form.website }
    })
    status.value = 'done'
  } catch {
    status.value = 'error'
  }
}

const inputClass = 'w-full rounded-xl border border-fg/20 bg-card px-4 py-2.5 text-sm outline-none transition-colors duration-300 placeholder:text-fg/40 focus:border-brand'
</script>

<template>
  <div class="mx-auto w-full max-w-md rounded-2xl border border-fg/15 bg-card p-5 text-start sm:p-6">
    <div v-if="status === 'done'" class="flex flex-col items-center gap-2 py-4 text-center">
      <UIcon name="i-lucide-circle-check" class="size-9 text-brand-ink" />
      <p class="font-bold">اطلاعاتتون ثبت شد</p>
      <p class="text-sm leading-7 text-fg/70">به‌زودی تیم ما باهاتون تماس می‌گیره.</p>
      <p class="text-sm leading-7 text-fg/70">ممنونیم که به ما اطمینان کردید و برای رشد کسب‌وکارتون اقدام کردید.</p>
    </div>

    <form v-else novalidate class="flex flex-col gap-3" @submit.prevent="submit">
      <div class="mb-1 text-center">
        <p class="font-bold">ترجیح می‌دید ما باهاتون تماس بگیریم؟</p>
        <p class="mt-1 text-xs leading-6 text-fg/60 sm:text-sm">اطلاعاتتون رو بذارید تا مشاور ما باهاتون تماس بگیره.</p>
      </div>

      <input v-model="form.name" type="text" name="name" autocomplete="name" maxlength="80" placeholder="نام و نام خانوادگی" :class="inputClass">
      <!-- shomare: dir="ltr" ta alamat-e + va tartib-e adad-ha dorost bemune (dir="rtl" «+98» ra be «98+» tabdil mikard), text-right ta placeholder va adad samt-e rast bashan -->
      <input v-model="form.phone" type="tel" dir="ltr" name="phone" autocomplete="tel" inputmode="tel" maxlength="20" placeholder="شماره تماس" :class="[inputClass, 'text-right']">
      <input v-model="form.business" type="text" name="business" maxlength="120" placeholder="نوع کسب‌وکار (مثلاً لوازم یدکی، پوشاک...)" :class="inputClass">

      <!-- honeypot: fild-e makhfi baraye ta'min-e robot-ha; kasi ke adam-e por nemikone -->
      <input v-model="form.website" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="absolute -left-[9999px] h-0 w-0 opacity-0">

      <p v-if="fieldError" class="flex items-start gap-1.5 text-xs leading-6 text-red-500">
        <UIcon name="i-lucide-circle-alert" class="mt-1 size-4 shrink-0" />
        {{ fieldError }}
      </p>
      <p v-if="status === 'error'" class="flex items-start gap-1.5 text-xs leading-6 text-red-500">
        <UIcon name="i-lucide-circle-alert" class="mt-1 size-4 shrink-0" />
        ارسال نشد؛ لطفاً از تلگرام یا تماس تلفنی باهامون در ارتباط باشید.
      </p>

      <button
        type="submit"
        :disabled="status === 'sending'"
        class="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-black transition-opacity duration-300 hover:opacity-90 disabled:opacity-60"
      >
        <UIcon v-if="status === 'sending'" name="i-lucide-loader-circle" class="size-4 animate-spin" />
        <UIcon v-else name="i-lucide-send" class="size-4" />
        {{ status === 'sending' ? 'در حال ارسال...' : 'درخواست بررسی پروژه' }}
      </button>
    </form>
  </div>
</template>
