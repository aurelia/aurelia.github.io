import { Aurelia, StyleConfiguration } from "aurelia";
import { appMap } from "./app-map";

// @ts-expect-error - This is a CSS file
import sharedStyles from "./shared.css?inline";

// Convert the CSS string to CSSStyleSheet
const sheet = new CSSStyleSheet();
sheet.replaceSync(sharedStyles);

document
  .querySelectorAll("[data-aurelia-app]")
  .forEach(async (host: HTMLElement) => {
    const appName = host.getAttribute("data-aurelia-app");
    if (appName && appMap[appName]) {
      const ComponentClass = await appMap[appName]();
      Aurelia.register(
        StyleConfiguration.shadowDOM({
          sharedStyles: [sheet],
        })
      )
        .app({ host, component: ComponentClass })
        .start();
    }
  });
