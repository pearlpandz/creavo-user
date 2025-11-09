// OnboardingTour.jsx
import React, { useEffect, useState } from "react";
import Joyride, { STATUS } from "react-joyride";
import { useProfile } from "../hook/usePageData";
import { useNavigate } from "react-router-dom";

const OnboardingTour = () => {
  const { data: profile, isLoading } = useProfile();
  const [run, setRun] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && profile) {
      const isFirstLogin = profile.last_login === null;
      const hasSeenTour = localStorage.getItem("hasSeenDashboardTour");

      if (isFirstLogin && !hasSeenTour) {
        setTimeout(() => {
          setRun(true);
          localStorage.setItem("hasSeenDashboardTour", "true");
        }, 800);
      }
    }
  }, [isLoading, profile]);

const steps = [
  {
    target: ".tour-start-designing",
    content: (
      <div>
        <h3>Welcome! Let’s Get Started</h3>
        <p>
          Begin your creative journey with our easy-to-use editor — design stunning visuals in just a few clicks.
        </p>
      </div>
    ),
    disableBeacon: true,
    placement: "bottom",
  },
  {
    target: ".tour-create-new",
    content: (
      <div>
        <h3>Create a New Project</h3>
        <p>
          Start from a blank canvas and craft your own unique design, perfectly suited to your vision.
        </p>
      </div>
    ),
    placement: "bottom",
  },
  {
    target: ".tour-template-card",
    content: (
      <div>
        <h3>Explore Ready-Made Templates</h3>
        <p>
          Browse a wide range of templates by category — customize them instantly to match your brand and style.
        </p>
      </div>
    ),
    placement: "top",
  },
  {
    target: ".day-container",
    content: (
      <div>
        <h3>Festival Calendar</h3>
        <p>
          Stay ahead of the curve with upcoming festivals and events — plan your creative posts in advance.
        </p>
      </div>
    ),
    placement: "auto",
  },
  {
    target: ".events",
    content: (
      <div>
        <h3>Discover Events</h3>
        <p>
          Tap on any event to instantly open design ideas and templates tailored for that occasion.
        </p>
      </div>
    ),
    placement: "auto",
  },
  {
    target: ".media-container",
    content: (
      <div>
        <h3>Trending Templates</h3>
        <p>
          See what’s popular right now — explore trending templates and get inspired by the latest design ideas.
        </p>
      </div>
    ),
    placement: "auto",
  }
];


  const handleCallback = (data) => {
    const { status, index, type } = data;

    if (type === "step:after" && index === 5) { // After "Trending Templates"
      localStorage.setItem("continueTour", "editor");
      setTimeout(() => {
        document.body.style.overflow = "auto";
        navigate("/editor");
      }, 600);
    }

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
      document.body.style.overflow = "auto";
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
      scrollOffset={90}
      spotlightClicks
      callback={handleCallback}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: "#6C63FF",
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
          borderRadius: "12px",
          backgroundColor: "rgba(108, 99, 255, 0.25)",
        },
      }}
    />
  );
};

export default OnboardingTour;