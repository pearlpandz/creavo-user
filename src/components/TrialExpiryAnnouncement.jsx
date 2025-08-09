import React from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useProfile } from "../hook/usePageData";
import { ConstructionOutlined } from "@mui/icons-material";
import { useExpire } from "../hook/useExpire";

const TrialExpiryAnnouncement = () => {
  const { data: profile } = useProfile();

  const { expireIn, expireMsg } = useExpire(profile)

  if (profile?.is_verified && expireIn > 7) {
    return <></>;
  }

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
            {expireMsg}
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "#8a6d7b", fontSize: "16px" }}
          >
            Upgrade now to keep your work and continue collaborating with your
            team.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="error"
          sx={{
            borderRadius: "8px",
            padding: "10px 20px",
            fontWeight: "bold",
            boxShadow: "none",
            textTransform: "none",
          }}
        >
          Upgrade now
        </Button>
      </Paper>
    </Box>
  );
};

export default TrialExpiryAnnouncement;
