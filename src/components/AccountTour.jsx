import React, { useEffect, useState } from "react";
import Joyride, { STATUS } from "react-joyride";

const AccountTour = () => {
  const [run, setRun] = useState(false);
  const [steps, setSteps] = useState([]);

  useEffect(() => {
    const continueTour = localStorage.getItem("continueTour");

    if (continueTour === "account") {
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
                  <p>Enable editing mode to update your company information.</p>
                </div>
              ),
              placement: "bottom",
              disableBeacon: true,
            },
            {
              target: ".tour-save-company",
              content: (
                <div>
                  <h3> Save Your Changes</h3>
                  <p>Once done, save your updates to keep them stored safely.</p>
                </div>
              ),
              placement: "bottom",
            },
          ]);
          setRun(true);
        }, 600);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleCallback = (data) => {
    const { status, index, type } = data;

    if (type === "step:after" && index === 1) {
      setTimeout(() => {
        window.dispatchEvent(new Event("open-subscription-tab"));
        document
          .querySelector(".tour-upgrade-diamond")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });

        setSteps([
          {
            target: ".tour-upgrade-diamond",
            content: (
              <div>
                <h3>Upgrade to Diamond</h3>
                <p>Unlock premium tools and creative power by upgrading.</p>
              </div>
            ),
            placement: "top",
            disableBeacon: true,
          },
        ]);
        setRun(true);
      }, 800);
    }

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
      localStorage.removeItem("continueTour");
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
        spotlight: {
          borderRadius: "10px",
          transition: "all 0.3s ease-in-out",
        },
      }}
    />
  );
};

export default AccountTour;
