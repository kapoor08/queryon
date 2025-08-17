/* eslint-disable no-console */
// src/index.ts
import ChatWidgetWebComponent from "./web-component";

// Extend the Window interface to include ChatWidgetWebComponent
declare global {
  interface Window {
    ChatWidgetWebComponent: typeof ChatWidgetWebComponent;
  }
}

// Register the web component
customElements.define("chat-widget", ChatWidgetWebComponent);

// Export for debugging
export { ChatWidgetWebComponent };

// Make it available globally for debugging
window.ChatWidgetWebComponent = ChatWidgetWebComponent;

// Log that the widget is loaded
console.log("✅ Queryon Chat Widget loaded successfully");
