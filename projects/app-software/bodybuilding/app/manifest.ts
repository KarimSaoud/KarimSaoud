import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Posing Caller",
    short_name: "Posing Caller",
    description: "A premium bodybuilding posing timer and judge-style pose caller.",
    start_url: "/",
    display: "standalone",
    background_color: "#080808",
    theme_color: "#080808",
    orientation: "portrait",
    icons: [
      {
        src: "/KS.png",
        sizes: "any",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  };
}
