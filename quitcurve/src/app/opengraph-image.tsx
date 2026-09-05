import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "QuitCurve — Quit vaping. Keep your momentum.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#070b09",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "#5ee9b5",
            marginBottom: "40px",
          }}
        >
          QuitCurve
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#f0f4f2",
            lineHeight: 1.15,
            maxWidth: "900px",
          }}
        >
          Quit vaping. Keep your momentum.
        </div>
        <p
          style={{
            fontSize: 28,
            color: "#8b9a94",
            marginTop: "24px",
            maxWidth: "800px",
            lineHeight: 1.4,
          }}
        >
          A personalized step-down plan that adapts when life happens.
        </p>
      </div>
    ),
    { ...size },
  );
}
