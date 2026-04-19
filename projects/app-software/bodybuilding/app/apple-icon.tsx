import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at top, rgba(212,175,55,0.28), transparent 36%), linear-gradient(180deg, #111111 0%, #050505 100%)",
          color: "white",
          fontSize: 64,
          fontWeight: 700,
          letterSpacing: 8,
        }}
      >
        PC
      </div>
    ),
    size,
  );
}
