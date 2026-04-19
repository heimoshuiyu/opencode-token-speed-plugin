type WindowEntry = { time: number; chars: number }

const WINDOW_MS = 2000
const CHARS_PER_TOKEN = 4

export function createSpeedTracker() {
  let window: WindowEntry[] = []

  function push(chars: number) {
    const now = Date.now()
    window.push({ time: now, chars })
    trim(now)
  }

  function trim(now: number) {
    const cutoff = now - WINDOW_MS
    while (window.length > 0 && window[0].time < cutoff) {
      window.shift()
    }
  }

  function speed(): number {
    const now = Date.now()
    trim(now)
    if (window.length < 2) return 0
    const span = (now - window[0].time) / 1000
    if (span <= 0) return 0
    const totalChars = window.reduce((sum, e) => sum + e.chars, 0)
    return totalChars / CHARS_PER_TOKEN / span
  }

  function reset() {
    window = []
  }

  return { push, speed, reset }
}
