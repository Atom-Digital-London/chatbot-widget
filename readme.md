🤖 Chameleon Chatbot Widget
A lightweight, white-labelable AI chat widget built with Preact and Vite. This project is designed to be hosted as a standalone script that any website can embed with a single <script> tag.

🚀 Quick Start (Local Development)
Because this is a cross-repo project, you need to run two servers to simulate a real-world environment.

1. The Widget "Provider"
This repo acts as the CDN hosting the logic.

Bash
# Build the production bundle
npm run build

# Serve the 'dist' folder on a fixed port
# macOS note: Port 5000 is often taken by AirPlay, using 63731
cd dist
npx serve . -l 63731 --cors
2. The "Consumer" Site
Open your plain HTML project and add the following to your index.html:

HTML
<script 
  src="http://localhost:63731/widget.iife.js" 
  data-bot-id="unique-client-id"
  data-project-name="AI Assistant"
  data-primary-color="#7c3aed"
  async>
</script>
🛠 Architecture
Shadow DOM: The widget uses a Shadow Root to prevent the host website's CSS from leaking into the chat UI (and vice versa).

IIFE Bundle: Vite is configured to output an Immediately Invoked Function Expression, allowing the script to run as soon as it's loaded without requiring a module bundler on the client side.

Data Attributes: Configuration (ID, Colors, Names) is passed via dataset attributes on the script tag itself.

🎨 Design & Themeing Notes
[!IMPORTANT]
The current color and themeing implementation needs significant thought.

While the widget currently accepts a data-primary-color, the internal UI components (buttons, borders, scrollbars, and contrast ratios) are not yet fully reactive to these changes.

Areas for improvement:

Contrast Logic: We need a utility to determine if text should be white or black based on the brightness of the user-provided primary color.

CSS Variables: Transitioning all hard-coded hex codes to CSS variables (--primary, --secondary) scoped within the Shadow DOM.

Dark Mode: The widget currently lacks a strategy for respecting the host site's prefers-color-scheme.

Component Consistency: Ensure the "Launcher" button and the internal "Send" buttons share the same theme logic.

📦 Deployment
To move to production:

Push this repo to Vercel or Cloudflare Pages.

Add a vercel.json or _headers file to allow CORS.

Update your client script src to the live URL.