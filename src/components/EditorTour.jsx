// EditorTour.jsx
import React, { useEffect, useState } from "react";
import Joyride, { STATUS } from "react-joyride";
import { useNavigate } from "react-router-dom";

export default function EditorTour() {
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const continueTour = localStorage.getItem("continueTour");

    if (continueTour === "editor") {
      document.body.style.overflow = "auto";

      const timer = setTimeout(() => {
        setSteps([
          {
            target: ".frames-section",
            content: (
              <div>
                <h3>Frames Library</h3>
                <p>Explore a wide variety of animated and static frames to enhance your designs and make them stand out.</p>
              </div>
            ),
            placement: "right",
            disableBeacon: true,
            // THIS IS THE MAGIC LINE
            spotlightClicks: true, // Allow clicks to pass through to the element
          },
          {
            target: ".download-button",
            content: (
              <div>
                <h3>Download Your Design</h3>
                <p>Export your finished creation instantly — download as an image, video, or GIF with just one click.</p>
              </div>
            ),
            placement: "left",
            disableBeacon: true,
            spotlightClicks: true,
          },
        ]);
        setRun(true);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleCallback = (data) => {
    const { status } = data;

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
      localStorage.removeItem("continueTour");
      localStorage.setItem("continueTour", "account");

      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";

      setTimeout(() => navigate("/account"), 800);
    }
  };

  if (!run) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      scrollToFirstStep
      scrollOffset={100}
      // Keep this FALSE globally — we control per-step
      spotlightClicks={false}
      disableCloseOnEsc={false}
      callback={handleCallback}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: "#9894f5ff",
          backgroundColor: "#ffffff",
          arrowColor: "#ffffff",
          textColor: "#1f1f1f",
        },
        tooltip: {
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
        },
        spotlight: {
          borderRadius: "16px",
          backgroundColor: "rgba(130, 124, 240, 0.35)",
          boxShadow: "0 0 0 9999px rgba(0,0,0,0.6)",
          transition: "all 0.4s ease",
        },
        buttonNext: {
          backgroundColor: "#9994eeff",
          borderRadius: "8px",
          padding: "10px 24px",
          fontWeight: "600",
          fontSize: "15px",
        },
      }}
    />
  );
}