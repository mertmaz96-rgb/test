#!/usr/bin/env python3
"""UserPromptSubmit hook: ask Claude to use Perplexity only when it is worth the tokens."""
import json, re, sys

try:
    prompt = json.load(sys.stdin).get("prompt", "").strip()
except Exception:
    sys.exit(0)

# Skip slash commands, very short messages and pure code/file chores.
if prompt.startswith("/") or len(prompt) < 25:
    sys.exit(0)
if re.search(r"(?i)\b(fix|refactor|rename|commit|push|test|build|lint|format)\b", prompt) and not re.search(
    r"(?i)\b(latest|news|current|today|202\d|güncel|son dakika|haber|nedir|kimdir|araştır)\b", prompt
):
    sys.exit(0)

print("Call mcp__perplexity__perplexity_ask once (one-line query, search_context_size: low). Use its answer; do not repeat raw results.")
