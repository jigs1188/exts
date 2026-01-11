# Changelog

All notable changes to MetaPrompt will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-11

### Added
- Initial release of MetaPrompt browser extension
- Support for ChatGPT (chat.openai.com)
- Support for Gemini (gemini.google.com)
- Support for Claude (claude.ai)
- Rule-based prompt optimization engine
- 6 intent detection types:
  - Coding optimizer with language detection
  - Debugging helper with systematic approach
  - Explanation mode for learning
  - Writing assistant for content creation
  - Analysis mode for comparisons
  - General optimizer as fallback
- Floating button UI with Shadow DOM isolation
- Keyboard shortcut support (Ctrl+Shift+E)
- Visual notifications for user feedback
- Cross-browser compatibility (Chrome, Edge, Firefox)
- MutationObserver for dynamic content handling
- Platform detection abstraction layer
- Test page for local optimizer testing
- Icon generator utility
- Comprehensive documentation:
  - README.md - Overview and features
  - SETUP.md - Installation instructions
  - ARCHITECTURE.md - Technical documentation
  - QUICKSTART.md - 5-minute setup guide
  - CHANGELOG.md - Version history

### Features
- Zero external API dependencies
- 100% client-side processing
- No data collection or tracking
- Privacy-first architecture
- Real-time prompt enhancement
- Smart intent detection
- Professional prompt engineering templates
- Responsive floating button
- Gradient theme design
- Comprehensive error handling
- Automatic platform adaptation

### Technical
- Manifest V3 compliance
- Content script architecture
- Shadow DOM for CSS isolation
- Event-driven architecture
- Efficient DOM manipulation
- Memory-optimized observers
- Cross-platform selector fallbacks
- Proper event dispatching for React/Vue compatibility

### Documentation
- Full technical architecture documentation
- Setup and installation guides
- Troubleshooting section
- Contributing guidelines
- License information

## [Unreleased]

### Planned Features
- Custom template creation
- Settings panel for preferences
- Template history
- Prompt library
- Export functionality
- Undo/redo support
- Multi-language support
- Statistics dashboard
- Template sharing (optional)

### Under Consideration
- Auto-enhancement toggle
- Platform-specific templates
- Prompt suggestions
- Context preservation
- Dark mode support

---

## Release Notes

### Version 1.0.0 Notes

This is the initial stable release of MetaPrompt. The extension is fully functional and production-ready for Chrome, Edge, and Firefox browsers.

**Key Highlights**:
- Works completely offline
- No API keys required
- Free forever
- Privacy-focused
- Cross-platform support

**Known Limitations**:
- Templates are pre-defined (customization coming in future versions)
- Only supports English prompts (multi-language support planned)
- Firefox requires temporary add-on reload on browser restart

**Browser Compatibility**:
- Chrome 88+
- Edge 88+
- Firefox 78+

**Tested Platforms**:
- ChatGPT (Tested on GPT-3.5 and GPT-4 interfaces)
- Gemini (Tested on standard and advanced modes)
- Claude (Tested on Claude 2 and Claude 3 interfaces)

---

For detailed upgrade instructions and migration guides, see [SETUP.md](SETUP.md).
