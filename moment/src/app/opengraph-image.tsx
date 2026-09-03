import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MOMENT — Leave something behind. Unlock it when you return.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #050608, #101218, #0a0b10)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            border: "3px solid #FF8A2A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: "#FF8A2A",
            }}
          />
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 72,
            letterSpacing: "0.15em",
            color: "#f4f1ea",
          }}
        >
          MOMENT
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 28,
            color: "#ff8a2a",
            fontStyle: "italic",
          }}
        >
          Leave something behind. Unlock it when you return.
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 18,
            color: "#8b8790",
            letterSpacing: "0.2em",
          }}
        >
          MAKE THE MOMENT LAST FOREVER
        </div>
      </div>
    ),
    { ...size },
  );
}
