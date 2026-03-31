import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ height: "100vh", width: "100vw", position: "relative", overflow: "hidden" }}>
      {/* Background YouTube video iframe */}
      <iframe
        src="https://www.youtube.com/embed/StqLFPvTiHE?autoplay=1&mute=1&controls=0&loop=1&playlist=StqLFPvTiHE&modestbranding=1&showinfo=0&rel=0&enablejsapi=1"
        title="YouTube video background"
        frameBorder="0"
        allow="autoplay; fullscreen"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "177.77vh",  // 100 * (16/9) to keep 16:9 ratio relative to viewport height
          height: "100vh",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none", // so clicks go through to button etc
          zIndex: -1,
          minWidth: "100vw", // ensure minimum full width
          minHeight: "56.25vw", // 100 * (9/16) to keep 16:9 ratio relative to viewport width
        }}
      />

      {/* Content on top */}
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: "0 20px",
          backgroundColor: "rgba(0,0,0,0.3)", // Optional overlay for text visibility
          boxSizing: "border-box",
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "20px" }}>
          Welcome to Organic Tattva
        </h1>

        <button
          onClick={() => navigate("/home")}
          style={{
            padding: "12px 30px",
            fontSize: "18px",
            background: "#16a34a",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}