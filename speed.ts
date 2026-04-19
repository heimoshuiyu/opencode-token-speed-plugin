type WindowEntry = { time: number; tokens: number }

const WINDOW_MS = 2000

export function createSpeedTracker() {
  let window: WindowEntry[] = []
  let firstDeltaTime: number | null = null
  let lastDeltaTime: number | null = null
  let finishedSpeed: number | null = null

  function push(tokenCount: number = 1) {
    if (window.length === 0) {
      finishedSpeed = null
      firstDeltaTime = null
      lastDeltaTime = null
    }
    const now = Date.now()
    if (firstDeltaTime === null) firstDeltaTime = now
    lastDeltaTime = now
    window.push({ time: now, tokens: tokenCount })
    trim(now)
  }

  function trim(now: number) {
    const cutoff = now - WINDOW_MS
    while (window.length > 0 && window[0].time < cutoff) {
      window.shift()
    }
  }

  function estimatedSpeed(): number {
    const now = Date.now()
    trim(now)
    if (window.length < 2) return 0
    const totalTokens = window.reduce((sum, e) => sum + e.tokens, 0)
    const span = Math.max(
      (window[window.length - 1].time - window[0].time) / 1000,
      0.05,
    )
    return totalTokens / span
  }

  function finishWithRealTokens(outputTokens: number) {
    if (firstDeltaTime !== null && lastDeltaTime !== null && outputTokens > 0) {
      const span = Math.max((lastDeltaTime - firstDeltaTime) / 1000, 0.05)
      finishedSpeed = outputTokens / span
    }
  }

  function speed(): number {
    if (finishedSpeed !== null) return finishedSpeed
    return estimatedSpeed()
  }

  function reset() {
    window = []
    firstDeltaTime = null
    lastDeltaTime = null
    finishedSpeed = null
  }

  return { push, speed, reset, finishWithRealTokens }
}
