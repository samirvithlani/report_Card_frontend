import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Avatar,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  TextField,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";

// Helper function to convert Google Drive URL to direct image URL
const getDriveImageUrl = (googleDriveUrl) => {
  if (!googleDriveUrl) return null;
  try {
    const regex = /(?:\/d\/|id=)([a-zA-Z0-9_-]+)/;
    const match = googleDriveUrl.match(regex);
    if (!match || !match[1]) return googleDriveUrl; // fallback: use original URL
    const fileId = match[1];
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  } catch (err) {
    console.error("Invalid Google Drive URL:", googleDriveUrl);
    return null;
  }
};

export const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [batchFilter, setBatchFilter] = useState("All");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Fetch Students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get(
          "/student/studentsbyfaculty/" + localStorage.getItem("faculty_id")
        );
        const studentsData = res?.data?.data || [];

        // Convert Google Drive URLs to direct URLs
        const studentsWithDirectImages = studentsData.map((s) => ({
          ...s,
          studentImage: getDriveImageUrl(s?.studentImage),
        }));

        setStudents(studentsWithDirectImages);
        setFilteredStudents(studentsWithDirectImages);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Handle search & filter
  useEffect(() => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (batchFilter !== "All") {
      filtered = filtered.filter(
        (s) => s?.batch?.toLowerCase() === batchFilter.toLowerCase()
      );
    }

    setFilteredStudents(filtered);
  }, [searchTerm, batchFilter, students]);

  // Background color logic
  const getRowColor = (batch) => {
    if (!batch) return "white";
    switch (batch.toLowerCase()) {
      case "club":
        return "#d5f5e3"; // light green
      case "general":
        return "#fcf3cf"; // light yellow
      case "one to one":
      case "one-to-one":
        return "#d6eaf8"; // light blue
      default:
        return "white";
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom textAlign="center">
        Student List
      </Typography>

      {/* Search and Filter Controls */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mb: 2,
        }}
      >
        <TextField
          label="Search by Name"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth={isMobile}
          sx={{ flex: 1 }}
        />

        <TextField
          select
          label="Filter by Batch"
          value={batchFilter}
          onChange={(e) => setBatchFilter(e.target.value)}
          fullWidth={isMobile}
          sx={{ flex: 1 }}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Club">Club</MenuItem>
          <MenuItem value="General">General</MenuItem>
          <MenuItem value="One to One">One to One</MenuItem>
        </TextField>
      </Box>

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          width: "100%",
          overflowX: "auto",
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="student table">
          <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
            <TableRow>
              <TableCell>Sr no</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Batch</TableCell>
              <TableCell>College</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student,i) => (
                <TableRow
                  key={student?._id}
                  sx={{
                    backgroundColor: getRowColor(student?.batch),
                    "&:hover": { backgroundColor: "#f2f2f2" },
                  }}
                >
                  <TableCell>{i+1}</TableCell>
                  <TableCell>
                    {student?.studentImage ? (
                      <img
                        src={student?.studentImage}
                        alt={student?.firstName}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          cursor: "pointer",
                          objectFit: "cover",
                        }}
                        onClick={() => setPreviewImage(student?.studentImage)}
                        onError={(e) => {
                          e.target.onerror = null; // prevent infinite loop
                          e.target.src = ""; // fallback to avatar
                          setPreviewImage(null);
                        }}
                      />
                    ) : (
                      <Avatar
                        sx={{ bgcolor: "primary.main", cursor: "pointer" }}
                        onClick={() => setPreviewImage(null)}
                      >
                        {student?.firstName?.[0] || "S"}
                      </Avatar>
                    )}
                  </TableCell>
                  <TableCell>{student?.firstName || "-"}</TableCell>
                  <TableCell>{student?.lastName || "-"}</TableCell>
                  <TableCell>{student?.email || "-"}</TableCell>
                  <TableCell>{student?.mobile || "-"}</TableCell>
                  <TableCell>{student?.batch || "-"}</TableCell>
                  <TableCell>{student?.collageName || "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No students found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Image Preview Dialog */}
      <Dialog
        open={!!previewImage}
        onClose={() => setPreviewImage(null)}
        maxWidth="md"
      >
        <IconButton
          onClick={() => setPreviewImage(null)}
          sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ p: 0, background: "black" }}>
          {previewImage && (
            <img
              src={previewImage}
              alt="preview"
              style={{ width: "100%", height: "auto" }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};
