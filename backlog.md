# Backlog

## Markdown to Speech in Rust

### Approach
Combine Markdown parsing with Text-to-Speech (TTS):

**1. Parse Markdown to plain text**
- `pulldown-cmark` - popular Markdown parser
- `comrak` - GitHub-flavored Markdown parser

**2. Text-to-Speech (TTS)**
- `tts` crate - cross-platform TTS using native APIs (Windows SAPI, macOS AVSpeechSynthesizer, Linux speech-dispatcher)
- Cloud APIs - Google Cloud TTS, AWS Polly, or Azure Speech via HTTP (using `reqwest`)
- `coqui-stt` / local models - for offline neural TTS

### Example Implementation

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

### Dependencies

```toml
[dependencies]
pulldown-cmark = "0.10"
tts = "0.26"
```

### Notes
- The `tts` crate works out of the box on Windows, macOS, and Linux
- For higher quality voices, use a cloud API or neural TTS library
