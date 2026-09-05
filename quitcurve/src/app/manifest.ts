import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "QuitCurve",
    short_name: "QuitCurve",
    description:
      "Quit vaping. Keep your momentum. A personalized step-down plan that adapts when life happens.",
    start_url: "/",
    display: "standalone",
    background_color: "#070b09",
    theme_color: "#5ee9b5",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
