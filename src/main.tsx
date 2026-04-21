import { render } from 'preact';
import { App } from './app.tsx';
import type { WidgetConfig } from './types.tsx';

const scriptTag = document.currentScript as HTMLScriptElement;

// 1. Updated Config to point to your Hetzner Middleware
const config: WidgetConfig = {
  botId: scriptTag?.dataset.botId || 'default-bot',
  projectName: scriptTag?.dataset.projectName || 'Support Chat',
  primaryColor: scriptTag?.dataset.primaryColor || '#007bff',
  greeting: scriptTag?.dataset.greeting || 'Hello!',
  // When deploying, this will be your Hetzner Server URL
  apiHost: import.meta.env.VITE_API_URL || 'http://localhost:3000' 
};

// 2. Create the Host Element
const host = document.createElement('div');
host.id = 'chameleon-widget-root';
document.body.appendChild(host);

// 3. Attach the Shadow Root
const shadowRoot = host.attachShadow({ mode: 'open' });

// 4. Handle CSS Injection for Shadow DOM
// The plugin injects CSS into a <style> tag. We move it inside the shadow.
const observer = new MutationObserver(() => {
  const styleTags = document.head.querySelectorAll('style');
  styleTags.forEach((style) => {
    // Only move styles that belong to our widget
    if (style.textContent?.includes('.widget-scope')) {
      shadowRoot.appendChild(style.cloneNode(true));
      style.remove(); // Clean up the head to prevent global leaks
    }
  });
});

observer.observe(document.head, { childList: true });

// 5. Create a container inside the shadow
const container = document.createElement('div');
shadowRoot.appendChild(container);

// 6. Render into the shadow container
render(<App config={config} />, container);