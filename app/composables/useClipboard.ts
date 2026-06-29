export function useClipboard() {
  const copied = ref(false)
  let timer: ReturnType<typeof setTimeout> | null = null

  onUnmounted(() => {
    if (timer) clearTimeout(timer)
  })

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    copied.value = true
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => (copied.value = false), 2000)
  }

  return { copied, copy }
}
