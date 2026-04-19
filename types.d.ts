import type { RGBA } from "@opencode-ai/plugin/tui"

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      text: {
        fg?: RGBA | string
        children?: unknown
        [k: string]: unknown
      }
    }
  }
}
