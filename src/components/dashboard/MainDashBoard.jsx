import React, { act, useEffect, useState } from "react";
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
  List,
  ListItem,
  ListItemText,
  Avatar,
  IconButton,
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
import { useNavigate } from "react-router-dom";
import { PhotoCamera } from "@mui/icons-material";
import { set } from "react-hook-form";

export const MainDashBoard = () => {
  //Sample marks data
  // const marksData = [
  //   {
  //     subject: "Punctuality",
  //     marks: Math.floor(Math.random() * 10),
  //     outOf: 10,
  //   },
  //   {
  //     subject: "Regular Sessions",
  //     marks: Math.floor(Math.random() * 10),
  //     outOf: 10,
  //   },
  //   {
  //     subject: "Communication in Sessions",
  //     marks: Math.floor(Math.random() * 10),
  //     outOf: 10,
  //   },
  //   {
  //     subject: "Test Marks Average",
  //     marks: Math.floor(Math.random() * 100),
  //     outOf: 100,
  //   },
  // ];

  const [marksData, setmarksData] = useState([]);

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

  const [searchData, setsearchData] = useState();
  const [searchPresses, setsearchPresses] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [studentData, setstudentData] = useState({});
  const [finalScore, setfinalScore] = useState(0);
  const [activites, setactivites] = useState([]);
  const [facultyId, setfacultyId] = useState();
  const [studentImage, setstudentImage] = useState();

  const handleSuggestionClick = async (suggestion) => {
    // Print the student ID on the console
    console.log("Selected suggestion:", suggestion);
    console.log("Student ID:", suggestion.id); // Log the ID
    console.log(suggestion.name.split("  ")); // If you want to split the name as well

    // Set the name as the selected suggestion and clear suggestions
    setName(suggestion.name);
    setSuggestions([]);

    const res = await axios.post(`/student-report/search-by-id`, {
      studentId: suggestion.id,
      facultyId: localStorage.getItem("faculty_id"),
    });
    console.log("student data response...", res.data);
    if (res.data?.length > 0) {
      //alert("No data found");
      setstudentData(res?.data[0]);
      console.log("student data...", studentData);
      setstudentImage(res?.data[0]?.studentDetails?.studentImage);
      let marks = [
        {
          subject: "Discipline",
          marks: res?.data[0]?.discipline, // Replace with actual field from the response
          outOf: 5,
        },
        {
          subject: "Regular Sessions",
          marks: res?.data[0]?.regularity, // Replace with actual field from the response
          outOf: 5,
        },
        {
          subject: "Communication in Sessions",
          marks: res?.data[0]?.communication, // Replace with actual field from the response
          outOf: 5,
        },
        {
          subject: "Test Performance",
          marks: res?.data[0]?.testPerformance, // Replace with actual field from the response
          outOf: 5,
        },
      ];
      var total = marks.reduce((total, item) => total + item.marks, 0);
      var finalPercentage = (total / 20) * 100;
      setfinalScore(finalPercentage);
      //console.log("final percentage...",finalPercentage);
      //alert("Total Marks: "+total+"  Final Percentage: "+finalPercentage);
      console.log("marks data...", marks);
      setmarksData(marks);

      //activities

      setactivites([
        {
          activity: "Test Perfomance",
          marks: res?.data[0]?.testPerformance,
          outOf: 5,
          grade: res?.data[0]?.testPerformance > 4 ? "A" : res?.data[0]?.testPerformance > 3 ? "B" : "C",
        },
        {
          activity: "Discipline",
          marks: res?.data[0]?.discipline,
          outOf: 5,
          grade: res?.data[0]?.discipline > 4 ? "A" : res?.data[0]?.discipline > 3 ? "B" : "C",
        },
        {
          activity: "Regular Sessions",
          marks: res?.data[0]?.regularity,
          outOf: 5,
          grade: res?.data[0]?.regularity > 4 ? "A" : res?.data[0]?.regularity > 3 ? "B" : "C",
        },
      ]);
    }
  };

  const handleInputChange = async (e) => {
    const searchText = e.target.value;
    setName(searchText);

    console.log(name);

    try {
      const res = await axios.post("/student-report/search", {
        firstName: searchText,
        facultyId: localStorage.getItem("faculty_id"),
      });

      console.log(res.data);
      setsearchData(res.data);

      if (searchText) {
        // Filter by first name and create an object with name and id
        const filteredSuggestions = res.data
          .filter((suggestion) =>
            suggestion.studentDetails.firstName
              .toLowerCase()
              .startsWith(searchText.toLowerCase())
          )
          .map((suggestion) => ({
            name:
              suggestion.studentDetails.firstName +
              "  " +
              suggestion.studentDetails.lastName +
              "  Mobile  " +
              suggestion.studentDetails.mobile,
            id: suggestion.studentDetails._id, // Include the ID here
          }));

        setSuggestions(filteredSuggestions); // Store suggestions with names and IDs
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleUploadImage = async (e) => {
    const studentId = studentData?.studentDetails?._id;
    console.log("student id...", studentId);
    const facultyId = localStorage.getItem("faculty_id");
    console.log("faculty id...", facultyId);

    const formData = new FormData();
    formData.append("studentId", studentId);
    formData.append("facultyId", facultyId);
    //formData.append("file", e.target.files[0]);
    formData.append("file",e.target.files[0]);
    console.log("file",e.target.files[0]);

    const res = await axios.post("/student/upload-image", formData);
    console.log("image upload response...", res);
    setstudentImage(res.data.studentImage);
  };

  // const searchHandler = async () => {
  //   console.log(name);
  //   const res = await axios.post(
  //     "/student-report/search",
  //     {
  //       firstName: name,
  //       facultyId: "6718af3ab9e64e772962dc62",
  //     }
  //   );
  //   console.log(res.data);

  //   setsearchData(res.data);
  // };
  const [name, setName] = useState("");
  // Function to generate star rating
  const getStarRating = (marks, outOf) => {
    const rating = Math.round((marks / outOf) * 5); // Convert to a scale of 5
    return "★".repeat(rating) + "☆".repeat(5 - rating); // Return stars based on rating
  };
  const navigate = useNavigate();

  useEffect(() => {
    const facultyId = localStorage.getItem("faculty_id");
    if (facultyId) {
      setfacultyId(facultyId);
    } else {
      alert("Please login first");
      navigate("/login");
    }
  }, []);

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
          onChange={handleInputChange}
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
        {/* <Button
          variant="contained"
          sx={{
            backgroundColor: "#1A5774",
            color: "#fff",
            borderRadius: "20px",
            padding: "10px 20px",
            marginLeft: "10px",
          }}
          onClick={() => {
            searchHandler();
          }}
        >
          Search
        </Button> */}
        <Paper
          sx={{
            position: "absolute",
            top: "80px",
            width: "80%",
            zIndex: 10,
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          <List>
            {suggestions.map((suggestion, index) => (
              <ListItem
                button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <ListItemText primary={suggestion.name} />
              </ListItem>
            ))}
          </List>
        </Paper>
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

                    {/* Centering image or avatar */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      {/* Conditional rendering for student image */}
                      {studentImage ? (
                        <Box
                          component="img"
                          src={studentImage}
                          alt="Student"
                          sx={{
                            borderRadius: "50%",
                            width: { xs: "120px", md: "140px" },
                            height: { xs: "120px", md: "140px" },
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <Avatar
                          sx={{
                            width: { xs: "120px", md: "140px" },
                            height: { xs: "120px", md: "140px" },
                            fontSize: "50px",
                            backgroundColor: "#1A5774",
                          }}
                        >
                          {studentData?.studentDetails?.firstName?.charAt(0)}
                        </Avatar>
                      )}

                      {/* Upload icon for image */}
                      <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="label"
                        sx={{ mt: 2 }}
                      >
                        <input
                          hidden
                          accept="image/*"
                          type="file"
                          onChange={handleUploadImage}
                        />
                        <PhotoCamera />
                      </IconButton>
                    </Box>
                  </Grid>

                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      {/* Adjusting details to show 3x3 layout */}
                      <Grid item xs={6} sm={4}>
                        <Typography sx={{ fontWeight: "bold" }}>
                          Name:
                        </Typography>
                        <Typography variant="body1">
                          {studentData?.studentDetails?.firstName}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography sx={{ fontWeight: "bold" }}>
                          College:
                        </Typography>
                        <Typography variant="body1">
                          {studentData?.studentDetails?.collageName}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography sx={{ fontWeight: "bold" }}>
                          Batch:
                        </Typography>
                        <Typography variant="body1">
                          {studentData?.studentDetails?.batch}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography sx={{ fontWeight: "bold" }}>
                          Mobile:
                        </Typography>
                        <Typography variant="body1">
                          {studentData?.studentDetails?.mobile}
                        </Typography>
                      </Grid>
                      <Grid item xs={6} sm={4}>
                        <Typography sx={{ fontWeight: "bold" }}>
                          Email:
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{ wordBreak: "break-word" }}
                        >
                          {studentData?.studentDetails?.email}
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
                    value={finalScore}
                    sx={{ color: "#1A5774" }}
                  />
                  <Typography variant="h5">{finalScore} %</Typography>
                </Box>
              </Paper>
              <Paper elevation={3} sx={{ padding: "16px", marginBottom: "10px" }}>
  {/* Activities & Conduct Section */}
  <Typography variant="h6">Activities & Conduct</Typography>
  {activites.map((item) => {
    const progressValue = (item.marks / 5) * 100; // Assuming marks are out of 5

    return (
      <div key={item.activity}>
        <Typography>
          {item.activity}: {item.marks}/5 ({item.grade})
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progressValue} // Calculate progress out of 5
          sx={{
            marginBottom: "10px",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#1A5774",
            },
          }}
        />
      </div>
    );
  })}
</Paper>


              <Paper
                elevation={3}
                sx={{ padding: "16px", flexGrow: 1, marginBottom: "10px" }}
              >
             
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                  Marks Distribution:
                </Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={marksData}>
                    <XAxis dataKey="activity" />
                    <YAxis domain={[0,5]} />
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
