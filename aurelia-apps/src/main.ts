import { Aurelia, StyleConfiguration } from "aurelia";
import { appMap } from "./app-map";

import sharedStyles from "./shared.css?inline";

// Convert the CSS string to CSSStyleSheet
const sheet = new CSSStyleSheet();
sheet.replaceSync(sharedStyles);

document
  .querySelectorAll<HTMLElement>("[data-aurelia-app]")
  .forEach(async host => {
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
