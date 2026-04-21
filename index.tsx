import type { TuiPlugin } from "@opencode-ai/plugin/tui"
import { createSignal } from "solid-js"
import { createSpeedTracker } from "./speed.ts"

const id = "token-speed"

function formatSpeed(toks: number): string {
  if (toks <= 0) return "--"
  return toks.toFixed(1) + " tok/s"
}

const tui: TuiPlugin = async (api) => {
  const tracker = createSpeedTracker()
  const [speed, setSpeed] = createSignal(0)
  const [lastSpeed, setLastSpeed] = createSignal(0)

  api.event.on("message.part.delta", (event) => {
    const delta = event.properties.delta
    if (delta && typeof delta === "string" && delta.length > 0) {
      tracker.recordDelta()
    }
  })

  api.event.on("message.part.updated", (event) => {
    const part = event.properties.part
    if (part.type === "step-finish") {
      if (part.tokens) {
        const outputTokens =
          (part.tokens.output ?? 0) + (part.tokens.reasoning ?? 0)
        if (outputTokens > 0) {
          tracker.finishWithRealTokens(outputTokens)
          setSpeed(tracker.speed())
          setLastSpeed(tracker.speed())
        }
      }
    }
  })

  api.event.on("session.status", (event) => {
    if (event.properties.status.type === "idle") {
      tracker.reset()
      setSpeed(0)
    }
  })

  api.slots.register({
    order: 50,
    slots: {
      session_prompt_right(_ctx: Record<string, unknown>, props: Record<string, unknown>) {
        const theme = () => api.theme.current
        const displaySpeed = () => speed() > 0 ? speed() : lastSpeed()
        return (
          <text fg={theme().textMuted}>
            ▲ {formatSpeed(displaySpeed())}
          </text>
        )
      },
    },
  })
}

export default { id, tui } satisfies { id: string; tui: TuiPlugin }
