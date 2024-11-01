export const manifestForPlugIn = {
  registerType: "autoUpdate",
  includeAssets: ["turing-station/logo.svg", "turing-station/logo-icons/*", "turing-station/screenshots/*"],
  manifest: {
    name: "Turing Station",
    short_name: "Turing Station",
    description: "Simule e aprenda sobre máquinas de Turing de forma simples e intuitiva",
    start_url: "/turing-station/",
    scope: "/turing-station/",
    display: "standalone",
    background_color: "#202528",
    theme_color: "#202528",
    icons: [
      {
        src: "/turing-station/logo-icons/android-chrome-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        src: "/turing-station/logo-icons/android-chrome-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/turing-station/logo-icons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/turing-station/logo-icons/android-chrome-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/turing-station/logo-icons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/turing-station/logo-icons/android-chrome-1024x1024.png",
        sizes: "1024x1024",
        type: "image/png",
      },
      {
        src: "/turing-station/logo-icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/turing-station/logo-icons/maskable_icon_x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/turing-station/screenshots/desktop-screenshot.png",
        sizes: "1919x902",
        type: "image/png",
        form_factor: "wide",
        label: "Wonder Widgets",
      },
      {
        src: "/turing-station/screenshots/mobile-screenshot.png",
        sizes: "750x1333",
        type: "image/png",
        form_factor: "narrow",
        label: "Wonder Widgets",
      },
    ],
  },
};
