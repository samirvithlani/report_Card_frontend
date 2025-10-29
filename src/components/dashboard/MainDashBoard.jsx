import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Modal,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
  Fade,
  Backdrop,
  InputAdornment,
  Typography,
  Divider,
  Chip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import DownloadIcon from "@mui/icons-material/Download";
import { useForm } from "react-hook-form";
import { Loader } from "../common/loader/Loader";
import { StudentDetail } from "./StudentDetail";
import { StudentMarks } from "./StudentMarks";
import { FinalScore } from "./FinalScore";
import { ActivitesAndConduct } from "./ActivitesAndConduct";
import { MarksDistrubution } from "./MarksDistrubution";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../assets/logo/royal_logo.png";
import { useNavigate } from "react-router-dom";

export const MainDashBoard = () => {
  const navigate = useNavigate()
  const pageRef = useRef();
  const printRef = useRef();
  const [marksData, setmarksData] = useState([]);
  const [searchData, setsearchData] = useState();
  const [suggestions, setSuggestions] = useState([]);
  const [studentData, setstudentData] = useState({});
  const [finalScore, setfinalScore] = useState(0);
  const [activites, setactivites] = useState([]);
  const [facultyId, setfacultyId] = useState();
  const [studentImage, setstudentImage] = useState();
  const [isLoading, setisLoading] = useState(false);
  const [updateModel, setupdateModel] = useState(false);
  const [updateButton, setupdateButton] = useState(false);
  const [name, setName] = useState("");
  const { register, handleSubmit, reset } = useForm();

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "90%", sm: 450 },
    bgcolor: "background.paper",
    borderRadius: "16px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    p: 4,
  };

  const handleClose = () => {
    setupdateModel(false);
  };

  const submitHandler = async (data) => {
    setupdateModel(false);
    data.facultyId = localStorage.getItem("faculty_id");
    data.studentId = studentData?.studentDetails?._id;
    console.log("data...", data);
    const res = await axios.post("/student-report/update", data);
    console.log("update response...", res);
    alert("Data updated successfully");
    setupdateButton(false);
  };

  const handleDownloadPDF = () => {
    const input = printRef.current;

    const loadImages = Array.from(input.querySelectorAll("img")).map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = resolve;
            img.onerror = resolve;
          }
        })
    );

    Promise.all(loadImages).then(() => {
      html2canvas(input, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 0;

        pdf.addImage(
          imgData,
          "PNG",
          imgX,
          imgY,
          imgWidth * ratio,
          imgHeight * ratio
        );

        const pdfName = `${studentData?.studentDetails?.firstName}_Report.pdf`;
        pdf.save(pdfName);
      });
    });
  };

  const handleSuggestionClick = async (suggestion) => {
    console.log("Selected suggestion:", suggestion);
    console.log("Student ID:", suggestion.id);

    setName(suggestion.name);
    setSuggestions([]);
    setisLoading(true);

    const res = await axios.post(`/student-report/search-by-id`, {
      studentId: suggestion.id,
      facultyId: localStorage.getItem("faculty_id"),
    });

    console.log("student data response...", res.data);

    if (res.data?.length > 0) {
      setstudentData(res?.data[0]);
      reset(res?.data[0]);
      setstudentImage(res?.data[0]?.studentDetails?.studentImage);
      setisLoading(false);

      let marks = [
        {
          subject: "Discipline",
          marks: res?.data[0]?.discipline,
          outOf: 5,
        },
        {
          subject: "Regular Sessions",
          marks: res?.data[0]?.regularity,
          outOf: 5,
        },
        {
          subject: "Communication in Sessions",
          marks: res?.data[0]?.communication,
          outOf: 5,
        },
        {
          subject: "Test Performance",
          marks: res?.data[0]?.testPerformance,
          outOf: 5,
        },
      ];

      var total = marks.reduce((total, item) => total + item.marks, 0);
      var finalPercentage = (total / 20) * 100;
      setfinalScore(finalPercentage);
      setmarksData(marks);
      setupdateButton(true);

      setactivites([
        {
          activity: "Test Perfomance",
          marks: res?.data[0]?.testPerformance,
          outOf: 5,
          grade:
            res?.data[0]?.avgTestPerformance > 4
              ? "A"
              : res?.data[0]?.avgTestPerformance > 3
              ? "B"
              : "C",
        },
        {
          activity: "Discipline",
          marks: res?.data[0]?.discipline,
          outOf: 5,
          grade:
            res?.data[0]?.discipline > 4
              ? "A"
              : res?.data[0]?.discipline > 3
              ? "B"
              : "C",
        },
        {
          activity: "Regular Sessions",
          marks: res?.data[0]?.regularity,
          outOf: 5,
          grade:
            res?.data[0]?.regularity > 4
              ? "A"
              : res?.data[0]?.regularity > 3
              ? "B"
              : "C",
        },
      ]);
    }
  };

  const handleInputChange = async (e) => {
    const searchText = e.target.value;
    setName(searchText);

    try {
      const res = await axios.post("/student-report/search", {
        firstName: searchText,
        facultyId: localStorage.getItem("faculty_id"),
      });

      setsearchData(res.data);

      if (searchText) {
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
            id: suggestion.studentDetails._id,
          }));

        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleUploadImage = async (e) => {
    console.log("here... ")
    const studentId = studentData?.studentDetails?._id;
    const facultyId = localStorage.getItem("faculty_id");

    const formData = new FormData();
    formData.append("studentId", studentId);
    formData.append("facultyId", facultyId);
    formData.append("file", e.target.files[0]);

    const res = await axios.post("/student/upload-image", formData);
    console.log(res)
    setstudentImage(res.data.studentImage);
  };

  const getStarRating = (marks, outOf) => {
    const rating = Math.round((marks / outOf) * 5);
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case "A":
        return "#10b981";
      case "B":
        return "#f59e0b";
      case "C":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

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
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f7fa" }}>
      {/* Enhanced Search Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          padding: { xs: "24px 16px", md: "32px 24px" },
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 4px 20px rgba(99, 102, 241, 0.15)",
        }}
      >
        <Box sx={{ maxWidth: "1400px", margin: "0 auto" }}>
          <TextField
            value={name}
            variant="outlined"
            placeholder="Search student by name..."
            onChange={handleInputChange}
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#6366f1" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              maxWidth: "600px",
              margin: "0 auto",
              display: "block",
              bgcolor: "white",
              borderRadius: "12px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                "& fieldset": {
                  borderColor: "transparent",
                },
                "&:hover fieldset": {
                  borderColor: "#6366f1",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#6366f1",
                  borderWidth: "2px",
                },
              },
            }}
          />

          {isLoading && <Loader />}

          {suggestions.length > 0 && (
            <Paper
              elevation={8}
              sx={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                width: { xs: "90%", md: "600px" },
                maxWidth: "600px",
                mt: 1,
                maxHeight: "300px",
                overflowY: "auto",
                borderRadius: "12px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              }}
            >
              <List sx={{ p: 0 }}>
                {suggestions.map((suggestion, index) => (
                  <ListItem
                    button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    sx={{
                      transition: "all 0.2s",
                      "&:hover": {
                        bgcolor: "#f5f3ff",
                        borderLeft: "4px solid #6366f1",
                      },
                      borderBottom: "1px solid #f0f0f0",
                    }}
                  >
                    <ListItemText
                      primary={suggestion.name}
                      primaryTypographyProps={{
                        fontSize: "0.95rem",
                        color: "#333",
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>
      </Box>

      {/* Download Button */}
      {updateButton && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadPDF}
            sx={{
              bgcolor: "#6366f1",
              borderRadius: "12px",
              textTransform: "none",
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 500,
              "&:hover": {
                bgcolor: "#4f46e5",
              },
            }}
          >
            Download Report
          </Button>
        </Box>
      )}

      {/* Main Content */}
      <Box
        ref={pageRef}
        sx={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: { xs: "16px", md: "32px" },
        }}
      >
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} lg={8}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Paper
                elevation={0}
                sx={{
                  padding: { xs: "20px", md: "28px" },
                  borderRadius: "16px",
                  border: "1px solid #e8eef2",
                  transition: "all 0.3s",
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                  },
                }}
              >
                <StudentDetail
                  studentImage={studentImage}
                  studentData={studentData}
                  updateButton={updateButton}
                  handleUploadImage={handleUploadImage}
                />
              </Paper>

              <StudentMarks
                updateModel={updateModel}
                setupdateModel={setupdateModel}
                marksData={marksData}
                updateButton={updateButton}
                getStarRating={getStarRating}
              />
            </Box>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <FinalScore finalScore={finalScore} />
              <ActivitesAndConduct activites={activites} />
              <MarksDistrubution marksData={marksData} />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Hidden PDF Template - A4 Landscape */}
      <Box
        ref={printRef}
        sx={{
          position: "absolute",
          left: "-9999px",
          width: "297mm",
          height: "210mm",
          bgcolor: "white",
          padding: "20mm",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            pb: 2,
            borderBottom: "3px solid #6366f1",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <img
              src={logo}
              alt="Logo"
              style={{ height: "60px", objectFit: "contain" }}
            />
            <Box>
              <Typography
                variant="h4"
                sx={{ fontWeight: 700, color: "#6366f1", mb: 0.5 }}
              >
                Student Performance Report
              </Typography>
              <Typography variant="body2" sx={{ color: "#6b7280" }}>
                Academic Progress & Evaluation
              </Typography>
            </Box>
          </Box>
          <Chip
            label={`Score: ${finalScore.toFixed(1)}%`}
            sx={{
              bgcolor: finalScore >= 80 ? "#10b981" : finalScore >= 60 ? "#f59e0b" : "#ef4444",
              color: "white",
              fontWeight: 700,
              fontSize: "1.1rem",
              height: "40px",
              px: 2,
            }}
          />
        </Box>

        {/* Student Info Section */}
        <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                bgcolor: "#f8f9ff",
                p: 2.5,
                borderRadius: "12px",
                border: "2px solid #e0e7ff",
              }}
            >
              {studentImage && (
                <Box
                  sx={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "12px",
                    overflow: "hidden",
                    border: "3px solid #6366f1",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={studentImage}
                    alt="Student"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              )}
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, color: "#1f2937", mb: 1 }}
                >
                  {studentData?.studentDetails?.firstName}{" "}
                  {studentData?.studentDetails?.lastName}
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1 }}>
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>
                    <strong>Email:</strong> {studentData?.studentDetails?.email}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>
                    <strong>Mobile:</strong> {studentData?.studentDetails?.mobile}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>
                    <strong>Grade:</strong> {studentData?.studentDetails?.grade}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#6b7280" }}>
                    <strong>Subject:</strong> {studentData?.studentDetails?.subject}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Performance Metrics */}
        <Box sx={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 3 }}>
          {/* Left: Detailed Marks */}
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#1f2937", mb: 2 }}
            >
              Performance Breakdown
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {marksData.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    bgcolor: "#f9fafb",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <Typography
                    sx={{ fontWeight: 600, color: "#374151", flex: 1 }}
                  >
                    {item.subject}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography
                      sx={{
                        fontSize: "1.2rem",
                        color: "#fbbf24",
                      }}
                    >
                      {getStarRating(item.marks, item.outOf)}
                    </Typography>
                    <Chip
                      label={`${item.marks}/${item.outOf}`}
                      size="small"
                      sx={{
                        bgcolor: "#6366f1",
                        color: "white",
                        fontWeight: 600,
                        minWidth: "60px",
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Right: Grades Summary */}
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "#1f2937", mb: 2 }}
            >
              Grade Summary
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {activites.map((activity, index) => (
                <Box
                  key={index}
                  sx={{
                    p: 2,
                    bgcolor: "#f9fafb",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{ fontWeight: 600, color: "#374151", fontSize: "0.9rem" }}
                  >
                    {activity.activity}
                  </Typography>
                  <Box
                    sx={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "8px",
                      bgcolor: getGradeColor(activity.grade),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 700,
                      fontSize: "1.2rem",
                    }}
                  >
                    {activity.grade}
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            position: "absolute",
            bottom: "15mm",
            left: "20mm",
            right: "20mm",
            pt: 2,
            borderTop: "2px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" sx={{ color: "#6b7280" }}>
            Generated on: {new Date().toLocaleDateString()}
          </Typography>
          <Typography variant="body2" sx={{ color: "#6b7280", fontWeight: 600 }}>
            Silver OAK
          </Typography>
        </Box>
      </Box>

      {/* Enhanced Modal */}
      <Modal
        open={updateModel}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: { bgcolor: "rgba(0, 0, 0, 0.5)" },
        }}
      >
        <Fade in={updateModel}>
          <Box sx={modalStyle}>
            <h2
              style={{
                margin: "0 0 24px 0",
                color: "#6366f1",
                fontSize: "1.5rem",
                fontWeight: 600,
              }}
            >
              Update Marks
            </h2>
            <form onSubmit={handleSubmit(submitHandler)}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Discipline</InputLabel>
                  <Select
                    label="Discipline"
                    {...register("discipline")}
                    sx={{ borderRadius: "8px" }}
                  >
                    {[1, 2, 3, 4, 5].map((val) => (
                      <MenuItem key={val} value={val}>
                        {val}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Regularity</InputLabel>
                  <Select
                    label="Regularity"
                    {...register("regularity")}
                    sx={{ borderRadius: "8px" }}
                  >
                    {[1, 2, 3, 4, 5].map((val) => (
                      <MenuItem key={val} value={val}>
                        {val}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Test Performance</InputLabel>
                  <Select
                    label="Test Performance"
                    {...register("testPerformance")}
                    sx={{ borderRadius: "8px" }}
                  >
                    {[1, 2, 3, 4, 5].map((val) => (
                      <MenuItem key={val} value={val}>
                        {val}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl variant="outlined" fullWidth>
                  <InputLabel>Communication</InputLabel>
                  <Select
                    label="Communication"
                    {...register("communication")}
                    sx={{ borderRadius: "8px" }}
                  >
                    {[1, 2, 3, 4, 5].map((val) => (
                      <MenuItem key={val} value={val}>
                        {val}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    type="submit"
                    fullWidth
                    sx={{
                      bgcolor: "#6366f1",
                      borderRadius: "8px",
                      textTransform: "none",
                      py: 1.2,
                      "&:hover": {
                        bgcolor: "#4f46e5",
                      },
                    }}
                  >
                    Submit
                  </Button>
                  <Button
                    onClick={handleClose}
                    variant="outlined"
                    fullWidth
                    sx={{
                      borderColor: "#6366f1",
                      color: "#6366f1",
                      borderRadius: "8px",
                      textTransform: "none",
                      py: 1.2,
                      "&:hover": {
                        borderColor: "#4f46e5",
                        bgcolor: "#f5f3ff",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            </form>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};