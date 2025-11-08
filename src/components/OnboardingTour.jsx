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
        setTimeout(() => setRun(true), 600); // slight delay to avoid flicker
        localStorage.setItem("hasSeenDashboardTour", "true");
      }
    }
  }, [isLoading, profile]);

  const steps = [
    {
      target: ".tour-start-designing",
      content: (
        <div>
          <h3>Start Designing</h3>
          <p>Open the editor and start bringing your ideas to life instantly.</p>
        </div>
      ),
      disableBeacon: true,
      placement: "bottom",
    },
    {
      target: ".tour-create-new",
      content: (
        <div>
          <h3>Create New Project</h3>
          <p>Click here to begin a fresh design project from scratch.</p>
        </div>
      ),
      placement: "bottom",
    },
    {
      target: ".tour-template-card",
      content: (
        <div>
          <h3>Template Categories</h3>
          <p>Explore templates by category and start customizing instantly.</p>
        </div>
      ),
      placement: "top",
    },
    {
      target: ".day-container",
      content: (
        <div>
          <h3>Festival Calendar</h3>
          <p>Check upcoming festivals and prepare creatives in advance.</p>
        </div>
      ),
      placement: "auto",
    },
    {
      target: ".events",
      content: (
        <div>
          <h3>Events</h3>
          <p>Click any event to see details or start designing related posts.</p>
        </div>
      ),
      placement: "auto",
    },
    {
      target: ".media-container",
      content: (
        <div>
          <h3>Trending Templates</h3>
          <p>Discover the most popular templates and explore subcategories here.</p>
        </div>
      ),
      placement: "auto",
    },
    {
      target: ".navbar-avatar",
      content: (
        <div>
          <h3>Your Profile</h3>
          <p>Access your account settings and personal details here.</p>
        </div>
      ),
      placement: "left",
    },
  ];

  const handleCallback = (data) => {
    const { status, index, type } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    // Navigate after profile step
    if (type === "step:after" && index === 6) {
      localStorage.setItem("continueTour", "account");
      setTimeout(() => navigate("/account"), 600);
    }

    if (finishedStatuses.includes(status)) {
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      disableOverlayClose
      scrollToFirstStep={false}
      scrollOffset={80}
      spotlightPadding={8}
      callback={handleCallback}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: "#6C63FF",
          textColor: "#1f1f1f",
          backgroundColor: "#fff",
          arrowColor: "#fff",
        },
        tooltip: {
          borderRadius: "14px",
          padding: "18px 20px",
          boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
          transition: "all 0.3s ease-in-out",
          animation: "fadeInScale 0.3s ease",
        },
        tooltipContainer: {
          textAlign: "left",
        },
        tooltipContent: {
          lineHeight: 1.5,
        },
        spotlight: {
          borderRadius: "10px",
          transition: "all 0.3s ease-in-out",
        },
      }}
    />
  );
};

export default OnboardingTour;
