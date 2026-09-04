import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MOMENT",
    short_name: "MOMENT",
    description: "Leave something behind. Unlock it when you return.",
    start_url: "/",
    display: "standalone",
    background_color: "#050608",
    theme_color: "#050608",
    icons: [
      {
        src: "/branding/logo-pin.jpg",
        sizes: "1254x1254",
        type: "image/jpeg",
        purpose: "any",
      },
    ],
  };
}
