import { Box, CircularProgress, Paper, Typography } from "@mui/material";
import React from "react";

export const FinalScore = ({finalScore}) => {
  return (
    <Paper elevation={3} sx={{ padding: "16px", marginBottom: "10px" }}>
      {/* Final Score Section */}
      <Typography variant="h6">Final Score</Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CircularProgress
          variant="determinate"
          value={finalScore}
          sx={{ color: "#1A5774" }}
        />
        <Typography variant="h5">{finalScore} %</Typography>
      </Box>
    </Paper>
  );
};
