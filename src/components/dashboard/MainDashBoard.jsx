import React, { useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import myimg from "../../assets/images/samir.jpeg";
import axios from "axios";

export const MainDashBoard = () => {
  // Sample marks data
  const marksData = [
    {
      subject: "Punctuality",
      marks: Math.floor(Math.random() * 10),
      outOf: 10,
    },
    {
      subject: "Regular Sessions",
      marks: Math.floor(Math.random() * 10),
      outOf: 10,
    },
    {
      subject: "Communication in Sessions",
      marks: Math.floor(Math.random() * 10),
      outOf: 10,
    },
    {
      subject: "Test Marks Average",
      marks: Math.floor(Math.random() * 100),
      outOf: 100,
    },
  ];

  // Sample extra-curricular data
  const extraCurricularData = [
    {
      subject: "Punctuality",
      marks: Math.floor(Math.random() * 10),
      outOf: 10,
    },
    {
      subject: "Regular Sessions",
      marks: Math.floor(Math.random() * 10),
      outOf: 10,
    },
    {
      subject: "Communication in Sessions",
      marks: Math.floor(Math.random() * 10),
      outOf: 10,
    },
    {
      subject: "Test Marks Average",
      marks: Math.floor(Math.random() * 10),
      outOf: 10,
    },
  ];

  const [searchData, setsearchData] = useState()
  const searchHandler = async() => {
    console.log(name)
    const res = await axios.post("http://localhost:3000/student-report/search",{
      firstName: name,
      facultyId: "6716575ecbf3d072d9b087d5"
    })
    //console.log(res.data)
    setsearchData(res.data)

  }
  const [name, setName] = useState("")
  // Function to generate star rating
  const getStarRating = (marks, outOf) => {
    const rating = Math.round((marks / outOf) * 5); // Convert to a scale of 5
    return "★".repeat(rating) + "☆".repeat(5 - rating); // Return stars based on rating
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: "20px",
          position: "sticky",
          top: 0,
          backgroundColor: "#fff",
          zIndex: 1,
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search..."
          onChange={(e)=>{setName(e.target.value)}}
          sx={{
            width: { xs: "80%", sm: "50%", md: "30%" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
              "& fieldset": {
                borderColor: "#1A5774", // Default border color
              },
              "&:hover fieldset": {
                borderColor: "#1A5774", // Border color on hover
              },
              "&.Mui-focused fieldset": {
                borderColor: "#1A5774", // Border color when focused
              },
            },
            "& .MuiInputBase-input": {
              color: "#1A5774", // Input text color
            },
            "& .MuiOutlinedInput-root .MuiInputBase-input::placeholder": {
              color: "#1A5774", // Placeholder color
              opacity: 1, // Ensures the placeholder color applies correctly
            },
          }}
        />
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1A5774",
            color: "#fff",
            borderRadius: "20px",
            padding: "10px 20px",
            marginLeft: "10px",
          }}
          onClick={()=>{searchHandler()}}
        >
          Search
        </Button>
      </Box>

      <Box
        sx={{
          backgroundColor: "#1A5774",
          borderRadius: 2,
          margin: { xs: "10px", md: "20px", lg: "40px" },
          height: "100vh",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <Grid
          container
          spacing={2}
          sx={{
            flex: 1,
            overflowY: "auto",
            height: "100%",
            maxWidth: { xs: "100%", md: "1200px", lg: "1400px" },
          }}
        >
          {/* First Grid Column (8 width) */}
          <Grid item xs={12} sm={8}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                padding: "10px",
                boxSizing: "border-box",
              }}
            >
              <Paper
                elevation={3}
                sx={{ padding: "16px", marginBottom: "10px", flexGrow: 1 }}
              >
                {/* Student Details Section */}
                <Grid container spacing={2}>
                  <Grid
                    item
                    xs={12}
                    sx={{ textAlign: "center", marginBottom: "16px" }}
                  >
                    <Typography
                      variant="h5"
                      sx={{ color: "#1A5774", fontWeight: "bold" }}
                    >
                      Student Details
                    </Typography>
                    <Box
                      component="img"
                      src={myimg}
                      alt="Student"
                      sx={{
                        borderRadius: "50%",
                        width: { xs: "120px", md: "140px" },
                        height: { xs: "120px", md: "140px" },
                        objectFit: "cover",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      {/* Adjusting details to show 3x3 layout */}
                      <Grid item xs={6} sm={4}>
                        <Typography sx={{ fontWeight: "bold" }}>
                          Name:
                        </Typography>
                        <Typography variant="body1">Neha Verma</Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography sx={{ fontWeight: "bold" }}>
                          Class:
                        </Typography>
                        <Typography variant="body1">191</Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography sx={{ fontWeight: "bold" }}>
                          Batch:
                        </Typography>
                        <Typography variant="body1">2020-2023</Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography sx={{ fontWeight: "bold" }}>
                          Gender:
                        </Typography>
                        <Typography variant="body1">Female</Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography sx={{ fontWeight: "bold" }}>
                          Date of Birth:
                        </Typography>
                        <Typography variant="body1">01/01/2000</Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography sx={{ fontWeight: "bold" }}>
                          Email:
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ wordBreak: "break-word" }}
                        >
                          neha@example.com
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Paper>

              <Paper
                elevation={3}
                sx={{ padding: "16px", marginBottom: "10px", flexGrow: 1 }}
              >
                {/* Subjects Marks Section */}
                <Typography
                  sx={{
                    textAlign: "center",
                    color: "#1A5774",
                    fontWeight: "bold",
                  }}
                  variant="h6"
                >
                  Marks
                </Typography>
                <TableContainer
                  component={Paper}
                  sx={{ marginTop: 2, maxHeight: "300px", overflowY: "auto" }}
                >
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>
                          Subject
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }} align="right">
                          Marks
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }} align="right">
                          Out of
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }} align="right">
                          Rating
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {marksData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.subject}</TableCell>
                          <TableCell align="right">{item.marks}</TableCell>
                          <TableCell align="right">{item.outOf}</TableCell>
                          <TableCell align="right">
                            {getStarRating(item.marks, item.outOf)}
                          </TableCell>
                        </TableRow>
                      ))}
                      {/* Calculate Total and Out Of */}
                      <TableRow>
                        <TableCell>
                          <strong>Total</strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>
                            {marksData.reduce(
                              (total, item) => total + item.marks,
                              0
                            )}
                          </strong>
                        </TableCell>
                        <TableCell align="right">
                          <strong>
                            {marksData.reduce(
                              (total, item) => total + item.outOf,
                              0
                            )}
                          </strong>
                        </TableCell>
                        <TableCell align="right"></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Box>
          </Grid>

          {/* Second Grid Column (4 width) */}
          <Grid item xs={12} sm={4}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                padding: "10px",
                boxSizing: "border-box",
              }}
            >
              <Paper
                elevation={3}
                sx={{ padding: "16px", marginBottom: "10px" }}
              >
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
                    value={82}
                    sx={{ color: "#1A5774" }}
                  />
                  <Typography variant="h5">82%</Typography>
                </Box>
              </Paper>

              <Paper
                elevation={3}
                sx={{ padding: "16px", marginBottom: "10px" }}
              >
                {/* Activities & Conduct Section */}
                <Typography variant="h6">Activities & Conduct</Typography>

                <Typography>Attendance: A</Typography>
                <LinearProgress
                  variant="determinate"
                  value={91}
                  sx={{
                    marginBottom: "10px",
                    "& .MuiLinearProgress-bar": { backgroundColor: "#1A5774" },
                  }}
                />

                <Typography>Punctuality: B</Typography>
                <LinearProgress
                  variant="determinate"
                  value={85}
                  sx={{
                    marginBottom: "10px",
                    "& .MuiLinearProgress-bar": { backgroundColor: "#1A5774" },
                  }}
                />

                <Typography>Neat & Orderly: A+</Typography>
                <LinearProgress
                  variant="determinate"
                  value={97}
                  sx={{
                    marginBottom: "10px",
                    "& .MuiLinearProgress-bar": { backgroundColor: "#1A5774" },
                  }}
                />
              </Paper>

              <Paper
                elevation={3}
                sx={{ padding: "16px", flexGrow: 1, marginBottom: "10px" }}
              >
                {/* Extra-Curricular Activities Section */}
                {/* <Typography variant="h6">
                  Extra-Curricular Activities
                </Typography>
                <TableContainer
                  component={Paper}
                  sx={{
                    maxHeight: "200px",
                    overflowY: "auto",
                    marginBottom: 2,
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Activity</TableCell>
                        <TableCell align="right">Marks</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {extraCurricularData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.subject}</TableCell>
                          <TableCell align="right">{item.marks}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer> */}
                {/* Extra-Curricular Activities Chart */}
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  Marks Distribution:
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={extraCurricularData}>
                    <XAxis dataKey="activity" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="marks" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
