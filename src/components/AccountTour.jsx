// AccountTour.jsx
import React, { useEffect, useState } from "react";
import Joyride, { STATUS } from "react-joyride";

const AccountTour = () => {
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const continueTour = localStorage.getItem("continueTour");

    if (continueTour === "account") {
      document.body.style.overflow = "auto";
      document.documentElement.style.overflow = "auto";

      const timer = setTimeout(() => {
        window.dispatchEvent(new Event("open-company-details-tab"));

        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });

          setSteps([
            {
              target: ".tour-edit-company",
              content: (
                <div>
                  <h3>Edit Company Details</h3>
                  <p>Personalize your brand identity — update your company name, logo, and color palette to match your style.</p>
                </div>
              ),
              placement: "bottom",
              disableBeacon: true,
            },
            {
              target: ".tour-upgrade-diamond",
              content: (
                <div>
                  <h3>Upgrade to Diamond Plan</h3>
                  <p>Access exclusive templates, remove limits on downloads, and collaborate seamlessly with your team in one powerful plan.</p>
                </div>
              ),
              placement: "top",
              disableBeacon: true,
            },
          ]);

          setRun(true);
          setStepIndex(0);
        }, 800);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleCallback = (data) => {
    const { status, type, index, action } = data;

    // STEP 1 → STEP 2: Switch tab when user clicks "Next"
    if (type === "step:after" && index === 0 && action === "next") {
      setRun(false);
      setStepIndex(1);

      window.dispatchEvent(new Event("open-subscription-tab"));

      setTimeout(() => {
        const el = document.querySelector(".tour-upgrade-diamond");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          setTimeout(() => setRun(true), 700);
        } else {
          // Fallback if element not found
          setTimeout(() => setRun(true), 1200);
        }
      }, 600);

      return; // Prevent further execution
    }

    // THIS IS THE FIX: Detect when user clicks "Last" on final step
    if (type === "step:after" && index === 1 && (action === "next" || action === "close")) {
      // User clicked "Last" or closed
      finishTour();
      return;
    }

    // Also catch skip/finish
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      finishTour();
    }
  };

  const finishTour = () => {
    setRun(false);
    localStorage.removeItem("continueTour");
    // Mark the entire onboarding flow as completed
    localStorage.setItem("onboardingTourCompleted", "true");

    document.body.style.overflow = "auto";
    document.documentElement.style.overflow = "auto";

    setTimeout(() => {
      window.location.href = "/";
    }, 1000);
  };

  if (!run) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      continuous
      showProgress
      showSkipButton
      scrollToFirstStep
      scrollOffset={120}
      spotlightClicks={false}
      callback={handleCallback}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: "#9793e9ff",
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
          backgroundColor: "rgba(143, 138, 235, 0.3)",
          boxShadow: "0 0 0 9999px rgba(0,0,0,0.5)",
        },
        buttonNext: {
          backgroundColor: "#9793f1ff",
          borderRadius: "8px",
          padding: "10px 24px",
          fontWeight: "600",
        },
        buttonClose: {
          color: "#9894f5ff",
        },
      }}
    />
  );
};

export default AccountTour;