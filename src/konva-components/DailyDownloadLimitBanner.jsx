// src/components/DailyDownloadLimitBanner.jsx
import React from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useProfile } from "../hook/usePageData";

const DailyDownloadLimitBanner = () => {
  const { data: profile, isLoading } = useProfile();

  if (isLoading || !profile) return null;

  const dailyLimitStr = profile?.license_details?.subscription?.daily_download_limit;
  const dailyLimit = dailyLimitStr ? parseInt(dailyLimitStr, 10) : null;
  const currentDownloads = profile?.day_downloads || 0;

  const isLimitReached = dailyLimit !== null && currentDownloads >= dailyLimit;
  const isAlmostReached = dailyLimit !== null && currentDownloads === dailyLimit - 1;

  if (!isLimitReached && !isAlmostReached) return null;

  const message = isLimitReached
    ? `You've reached your daily download limit of ${dailyLimit} designs.`
    : `You have 1 download left today out of ${dailyLimit}.`;

  const subMessage = isLimitReached
    ? "Downloads will reset tomorrow. Upgrade your plan for more daily downloads."
    : "Use it wisely! Downloads reset daily at midnight.";

  return (
    <Box sx={{ px: 2, width: "100%" }}>
      <Paper
        elevation={1}
        sx={{
          background: "#fff",
          borderRadius: "12px",
          margin: "16px auto",
          width: "100%",
          padding: "20px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid #eee",
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {message}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#8a6d7b", fontSize: "16px" }}
          >
            {subMessage}
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="error"   // same red button as trial expiry
          sx={{
            borderRadius: "8px",
            padding: "10px 20px",
            fontWeight: "bold",
            boxShadow: "none",
            textTransform: "none",
          }}
          onClick={() => {
            window.location.href = "#/subscription"; // or your subscription route
          }}
        >
          Upgrade now
        </Button>
      </Paper>
    </Box>
  );
};

export default DailyDownloadLimitBanner;