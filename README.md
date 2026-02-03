# Browser Agent

An intelligent web automation agent powered by Google's Agent Development Kit (ADK) and Playwright. Built to perform autonomous browser tasks using natural language instructions.

---

## Overview

Browser Agent leverages the Gemini 2.5 Flash model to understand and execute web automation tasks. It can search the web, interact with page elements, fill forms, navigate between pages, and capture screenshots—all through a conversational interface.

---

## Features

- **Autonomous Web Navigation** — Navigate to any URL with automatic page load handling
- **Google Search Integration** — Search Google and extract top results programmatically
- **Element Interaction** — Click elements using CSS selectors with built-in wait mechanisms
- **Form Automation** — Fill input fields with specified values
- **Screenshot Capture** — Take full-page screenshots encoded in base64
- **Session Management** — Properly manage browser lifecycle with graceful cleanup

---

## Technology Stack

| Category | Technology |
|----------|------------|
| AI Framework | Google ADK (Agent Development Kit) |
| LLM Model | Gemini 2.5 Flash |
| Browser Automation | Playwright |
| Language | TypeScript |
| Runtime | Node.js |

---

## Prerequisites

- Node.js v18.0.0 or higher
- npm or yarn package manager
- Google API key with ADK access

---

## Installation

**1. Clone the repository**

```bash
git clone <repository-url>
cd BrowserAgent
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

Create a `.env` file in the project root:

```env
GOOGLE_API_KEY=your_google_api_key
```

**4. Install Playwright browsers**

```bash
npx playwright install chromium
```

**5. Build the project**

```bash
npx tsc
```

---

## Available Tools

The agent exposes the following tools for web automation:

### `search_google`
Searches Google for a specified query and returns the top 5 result titles.

**Parameters:**
- `query` (string, required) — The search query

---

### `navigate`
Navigates the browser to a specified URL.

**Parameters:**
- `url` (string, required) — The target URL

---

### `click_element`
Clicks an element on the page using a CSS selector.

**Parameters:**
- `selector` (string, required) — CSS selector for the target element

---

### `fill_input`
Fills an input field with the specified value.

**Parameters:**
- `selector` (string, required) — CSS selector for the input field
- `value` (string, required) — Value to enter

---

### `take_screenshot`
Captures a full-page screenshot of the current browser state.

**Returns:** Base64-encoded PNG image

---

### `close_browser`
Closes the browser session and cleans up resources.

---

## Project Structure

```
BrowserAgent/
├── src/
│   └── agents.ts          # Agent definition and tool implementations
├── dist/                   # Compiled JavaScript output
├── node_modules/
├── .env                    # Environment variables (not tracked)
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

---

## Configuration

The agent runs in non-headless mode by default for visual debugging. To run headless, modify the `ensureBrowser` function in `src/agents.ts`:

```typescript
browser = await chromium.launch({
  headless: true  // Change to true for headless execution
});
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

---

## Acknowledgments

- [Google ADK](https://github.com/google/adk) — Agent Development Kit
- [Playwright](https://playwright.dev/) — Browser automation framework

