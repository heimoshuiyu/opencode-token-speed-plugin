export function createSpeedTracker() {
  let firstDeltaTime: number | null = null
  let lastDeltaTime: number | null = null
  let finishedSpeed: number | null = null

  function recordDelta() {
    const now = Date.now()
    if (firstDeltaTime === null) firstDeltaTime = now
    lastDeltaTime = now
  }

  function finishWithRealTokens(outputTokens: number) {
    if (firstDeltaTime !== null && lastDeltaTime !== null && outputTokens > 0) {
      const span = Math.max((lastDeltaTime - firstDeltaTime) / 1000, 0.05)
      finishedSpeed = outputTokens / span
    }
  }

  function resetStep() {
    firstDeltaTime = null
    lastDeltaTime = null
  }

  function speed(): number {
    return finishedSpeed ?? 0
  }

  function reset() {
    firstDeltaTime = null
    lastDeltaTime = null
    finishedSpeed = null
  }

  return { recordDelta, speed, reset, resetStep, finishWithRealTokens }
}
