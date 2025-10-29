import { Box, LinearProgress, Paper, Typography } from "@mui/material";
import React from "react";

export const ActivitesAndConduct = ({activites}) => {
  return (
    <Paper elevation={3} sx={{ padding: "16px", marginBottom: "10px" }}>
      {/* Activities & Conduct Section */}
      <Typography variant="h6">Activities & Conduct</Typography>
      {activites.map((item) => {
        const progressValue = (item.marks / 5) * 100; // Assuming marks are out of 5

        return (
          <div key={item.activity}>
            <Box
              sx={{
                backgroundColor: "#f0f4f8", // Background color for each activity box
                padding: "16px", // Padding inside each box
                borderRadius: "8px", // Rounded corners for the box
                marginBottom: "12px", // Space between each box
              }}
            >
              <Typography>
                {item.activity}: {item.marks}/5 ({item.grade})
              </Typography>
              <LinearProgress
                variant="determinate"
                value={(item.marks / 5) * 100} // Calculate progress as a percentage
                sx={{
                  marginTop: "8px",
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "#1A5774",
                  },
                }}
              />
            </Box>
          </div>
        );
      })}
    </Paper>
  );
};
