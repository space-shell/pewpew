import { render } from "solid-js/web";
import App from "./App.tsx";

// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered:", registration);
      })
      .catch((error) => {
        console.log("SW registration failed:", error);
      });
  });
}

const root = document.getElementById("root");

if (root) {
  render(() => <App />, root);
} else {
  console.error("Root element not found");
}
