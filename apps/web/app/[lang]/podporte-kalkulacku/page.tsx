"use client";

import { useEffect } from "react";

export default function Page(): JSX.Element {
  useEffect(() => {
    eval(`+function(w, d, s, u, a, b) {
      w["DarujmeObject"] = u;
      w[u] = w[u] || function () { (w[u].q = w[u].q || []).push(arguments) };
      a = d.createElement(s); b = d.getElementsByTagName(s)[0];
      a.async = 1; a.src = "https://www.darujme.cz/assets/scripts/widget.js";
      b.parentNode.insertBefore(a, b);
    }(window, document, "script", "Darujme");
    Darujme(1, "w2acrk0w61fgr3so", 'render', "https://www.darujme.cz/widget?token=w2acrk0w61fgr3so", "100%");`);
  }, []);

  return <div data-darujme-widget-token="w2acrk0w61fgr3so">Načítám…</div>;
}
