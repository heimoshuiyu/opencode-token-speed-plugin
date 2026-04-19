# OpenCode Token Speed Plugin

A [OpenCode](https://opencode.ai) TUI plugin that displays real-time LLM output token speed (tok/s) in the session prompt area.

## Features

- **Real-time speed display** — Shows output token speed during streaming using a 2-second sliding window.
- **Persistent display** — When streaming ends, the last measured speed is kept visible.
- **Non-intrusive** — Uses the `session_prompt_right` slot (append mode), so it doesn't replace any built-in UI.

## Setup

Add the plugin to your **`tui.json`** (not `opencode.json`):

```json
{
  "plugin": ["opencode-token-speed-plugin"]
}
```

That's it. OpenCode will automatically install the plugin on next run.

> **Note:** This is a TUI plugin, so it must be configured in `~/.config/opencode/tui.json`, not `opencode.json`.

## How it works

- Listens to `message.part.delta` events to count characters as they stream in.
- Estimates tokens using the `chars / 4` heuristic within a 2-second sliding window.
- Displays `▲ XX.X tok/s` to the right of the session prompt.

## License

MIT
