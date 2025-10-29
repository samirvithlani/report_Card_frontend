import { Box, Paper,  Typography } from "@mui/material";
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import dp from "../../assets/images/dp.png";
import logo from "../../assets/logo/royal_logo.png";

export const MarksDistrubution = ({marksData}) => {
  return (
    <Paper
      elevation={3}
      sx={{ padding: "16px", flexGrow: 1, marginBottom: "10px" }}
    >
      <Typography variant="body1" sx={{ marginBottom: 1 }}>
        Marks Distribution:
      </Typography>
      <ResponsiveContainer
        width="100%"
        height={200}
        style={{ marginTop: "100px" }}
      >
        <BarChart data={marksData}>
          <XAxis dataKey="activity" />
          <YAxis domain={[0, 5]} />
          <Tooltip />
          <Bar dataKey="marks" fill="#1A5774" />
        </BarChart>
      </ResponsiveContainer>

      <ResponsiveContainer
        width="100%"
        height="auto"
        minHeight={200} // Adjusted for two images
        maxHeight={300}
        style={{ marginTop: "60px" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column", // Stacks images vertically
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            minHeight: "200px", // Increased minimum height for two images
          }}
        >
          {/* Top Image */}
          {/* <Box
            component="img"
            //src={dp} // Top image source
            //alt="Top Logo"
            sx={{
              width: "80%", // Responsive width (80% of container)
              maxWidth: "150px", // Limit max width
              height: "auto", // Maintain aspect ratio
              marginBottom: "20px", // Space between images
            }}
          /> */}

          {/* Bottom Image */}
          <Box
            component="img"
            src={logo} // Bottom image source
            alt="Bottom Logo"
            sx={{
              width: "80%", // Responsive width (80% of container)
              maxWidth: "150px", // Limit max width
              height: "auto", // Maintain aspect ratio
            }}
          />
        </Box>
      </ResponsiveContainer>
    </Paper>
  );
};
