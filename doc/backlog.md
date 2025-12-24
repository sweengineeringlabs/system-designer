# Feature Backlog

**Audience**: Developers, Product Managers

## Overview

This document tracks planned features and improvements for System Designer.

## Planned Features

### Markdown to Speech

**Priority**: Medium
**Status**: Research

#### WHAT

Add ability to read generated design specifications aloud using text-to-speech.

#### WHY

- Accessibility for visually impaired users
- Hands-free review of specifications
- Multi-modal content consumption

#### HOW

Combine Markdown parsing with Text-to-Speech (TTS):

**1. Parse Markdown to plain text**
- `pulldown-cmark` - popular Markdown parser
- `comrak` - GitHub-flavored Markdown parser

**2. Text-to-Speech (TTS)**
- `tts` crate - cross-platform TTS using native APIs
- Cloud APIs - Google Cloud TTS, AWS Polly, Azure Speech
- Local models - for offline neural TTS

**Example Implementation:**

```rust
use pulldown_cmark::{Parser, Event, Tag};
use tts::Tts;

fn markdown_to_text(md: &str) -> String {
    let parser = Parser::new(md);
    let mut text = String::new();

    for event in parser {
        match event {
            Event::Text(t) | Event::Code(t) => text.push_str(&t),
            Event::SoftBreak | Event::HardBreak => text.push(' '),
            Event::End(Tag::Paragraph) => text.push_str(". "),
            _ => {}
        }
    }
    text
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let md = "# Hello\n\nThis is **bold** and *italic* text.";
    let text = markdown_to_text(md);

    let mut tts = Tts::default()?;
    tts.speak(text, false)?;

    Ok(())
}
```

**Dependencies:**

```toml
[dependencies]
pulldown-cmark = "0.10"
tts = "0.26"
```

**Notes:**
- The `tts` crate works out of the box on Windows, macOS, and Linux
- For higher quality voices, use a cloud API or neural TTS library

---

## Future Considerations

| Feature | Priority | Status |
|---------|----------|--------|
| Markdown to Speech | Medium | Research |
| Template Library | Low | Idea |
| Export to PDF | Low | Idea |
| Collaboration | Low | Idea |

## Related Documentation

- [Architecture](3-design/architecture.md) - System design
- [Developer Guide](4-development/developer-guide.md) - Contributing
