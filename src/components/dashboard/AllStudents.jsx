import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Button,
  IconButton,
  Chip,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import logo from "../../assets/logo/royal_logo.png";

export const AllStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const printRef = useRef(null);

  // ✅ Fetch Data from Backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/student-report/getall");
        console.log(res.data);
        
        // Sort students alphabetically by first name, then last name
        const sortedStudents = (res.data.data || []).sort((a, b) => {
          const nameA = `${a.student.firstName} ${a.student.lastName}`.toLowerCase();
          const nameB = `${b.student.firstName} ${b.student.lastName}`.toLowerCase();
          return nameA.localeCompare(nameB);
        });
        
        setStudents(sortedStudents);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Handle search filter
  const filteredStudents = students.filter((s) => {
    const name = `${s.student.firstName} ${s.student.lastName}`.toLowerCase();
    return (
      name.includes(search.toLowerCase()) ||
      s.student.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.student.mobile?.includes(search)
    );
  });

  // ✅ Handle table to PDF download (all students)
  const handleDownloadAllPDF = () => {
    const input = printRef.current;

    const loadImages = Array.from(input.querySelectorAll("img")).map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) resolve();
          else {
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

        pdf.save("All_Students_Report.pdf");
      });
    });
  };
const handleDownloadAll = async () => {
  for (let i = 296; i < filteredStudents.length; i++) {
    const student = filteredStudents[i];
    setDownloadingId(student.student._id);
    await handleDownloadIndividualPDF(student);
    await new Promise(r => setTimeout(r, 500)); // small delay
  }
  setDownloadingId(null);
};


  // ✅ Handle individual student PDF download
  const handleDownloadIndividualPDF = async (studentData) => {
    setDownloadingId(studentData.student._id);

    // Create temporary container for PDF
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "absolute";
    tempContainer.style.left = "-9999px";
    tempContainer.style.width = "297mm";
    tempContainer.style.height = "210mm";
    tempContainer.style.backgroundColor = "white";
    tempContainer.style.padding = "20mm";
    tempContainer.style.boxSizing = "border-box";
    document.body.appendChild(tempContainer);

    // Calculate final score
    const marksData = [
  { subject: "Discipline", marks: Math.round(studentData.avgDiscipline || 0), outOf: 5 },
  { subject: "Regular Sessions", marks: Math.round(studentData.avgRegularity || 0), outOf: 5 },
  { subject: "Communication in Sessions", marks: Math.round(studentData.avgCommunication || 0), outOf: 5 },
  { subject: "Test Performance", marks: Math.round(studentData.avgTestPerformance || 0), outOf: 5 },
];


    const total = marksData.reduce((sum, item) => sum + item.marks, 0);
    const finalScore = (total / 20) * 100;

    const activites = [
  {
    activity: "Test Performance",
    marks: Math.round(studentData.avgTestPerformance || 0),
    grade: studentData.avgTestPerformance > 4 ? "A" : studentData.avgTestPerformance > 3 ? "B" : "C",
  },
  {
    activity: "Discipline",
    marks: Math.round(studentData.avgDiscipline || 0),
    grade: studentData.avgDiscipline > 4 ? "A" : studentData.avgDiscipline > 3 ? "B" : "C",
  },
  {
    activity: "Regular Sessions",
    marks: Math.round(studentData.avgRegularity || 0),
    grade: studentData.avgRegularity > 4 ? "A" : studentData.avgRegularity > 3 ? "B" : "C",
  },
];

    const getStarRating = (marks, outOf) => {
      const rating = Math.round((marks / outOf) * 5);
      return "★".repeat(rating) + "☆".repeat(5 - rating);
    };

    const getGradeColor = (grade) => {
      switch (grade) {
        case "A": return "#10b981";
        case "B": return "#f59e0b";
        case "C": return "#ef4444";
        default: return "#6b7280";
      }
    };

    // Build PDF content
    tempContainer.innerHTML = `
      <div style="width: 100%; height: 100%; position: relative; font-family: 'Roboto', sans-serif;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 3px solid #6366f1;">
          <div style="display: flex; align-items: center; gap: 15px;">
            <img src="${logo}" alt="Logo" style="height: 60px; object-fit: contain;" />
            <div>
              <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #6366f1;">Student Performance Report</h1>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #6b7280;">Academic Progress & Evaluation</p>
            </div>
          </div>
          <div style="background: ${finalScore >= 80 ? "#10b981" : finalScore >= 60 ? "#f59e0b" : "#ef4444"}; color: white; font-weight: 700; font-size: 18px; padding: 8px 20px; border-radius: 8px;">
            Score: ${finalScore.toFixed(1)}%
          </div>
        </div>

        <!-- Student Info -->
        <div style="display: flex; gap: 20px; margin-bottom: 20px;">
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 20px; background: #f8f9ff; padding: 20px; border-radius: 12px; border: 2px solid #e0e7ff;">
              ${studentData.student.studentImage ? `
                <div style="width: 100px; height: 100px; border-radius: 12px; overflow: hidden; border: 3px solid #6366f1; flex-shrink: 0;">
                  <img src="${studentData.student.studentImage}" alt="Student" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
              ` : ''}
              <div style="flex: 1;">
                <h2 style="margin: 0 0 10px 0; font-size: 22px; font-weight: 700; color: #1f2937;">
                  ${studentData.student.firstName} ${studentData.student.lastName}
                </h2>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px; color: #6b7280;">
                  <div><strong>Email:</strong> ${studentData.student.email || "—"}</div>
                  <div><strong>Mobile:</strong> ${studentData.student.mobile || "—"}</div>
                  <div><strong>Batch:</strong> ${studentData.student.batch || "—"}</div>
                
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Performance Metrics -->
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 20px;">
          <!-- Left: Detailed Marks -->
          <div>
            <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 700; color: #1f2937;">Performance Breakdown</h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${marksData.map(item => `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb;">
                  <span style="font-weight: 600; color: #374151; flex: 1;">${item.subject}</span>
                  <div style="display: flex; align-items: center; gap: 15px;">
                    <span style="font-size: 18px; color: #fbbf24;">${getStarRating(item.marks, item.outOf)}</span>
                    <span style="background: #6366f1; color: white; font-weight: 600; padding: 4px 12px; border-radius: 6px; min-width: 60px; text-align: center;">
                      ${item.marks.toFixed(2)}/${item.outOf}
                    </span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Right: Grades Summary -->
          <div>
            <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 700; color: #1f2937;">Grade Summary</h3>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              ${activites.map(activity => `
                <div style="padding: 15px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                  <span style="font-weight: 600; color: #374151; font-size: 14px;">${activity.activity}</span>
                  <div style="width: 40px; height: 40px; border-radius: 8px; background: ${getGradeColor(activity.grade)}; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 20px;">
                    ${activity.grade}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="position: absolute; bottom: 0; left: 20mm; right: 20mm; padding-top: 15px; border-top: 2px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #6b7280;">
          
          <span style="font-weight: 600;">Royal Technosoft p ltd</span>
        </div>
      </div>
    `;

    // Wait for images to load
    const images = Array.from(tempContainer.querySelectorAll("img"));
    await Promise.all(
      images.map(
        (img) =>
          new Promise((resolve) => {
            if (img.complete) resolve();
            else {
              img.onload = resolve;
              img.onerror = resolve;
            }
          })
      )
    );

    // Generate PDF
    try {
      const canvas = await html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

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

      pdf.save(`${studentData.student.firstName}_${studentData.student.lastName}_Report.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      document.body.removeChild(tempContainer);
      setDownloadingId(null);
    }
  };

  // ✅ Batch color styling
  const getBatchColor = (batch) => {
    switch (batch?.toLowerCase()) {
      case "club":
        return "#ffe6e6"; // light red
      case "general":
        return "#e6f0ff"; // light blue
      case "one-to-one":
        return "#fff8e1"; // light yellow
      default:
        return "#f9f9f9"; // neutral
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
      </Box>
    );

  return (
    <Box p={isMobile ? 1 : 4}>
      <Typography variant="h5" mb={2} textAlign="center" fontWeight="bold">
        All Students Report Summary
      </Typography>

<Button
  variant="contained"
  color="primary"
  onClick={handleDownloadAll}
  disabled={downloadingId !== null}
>
  Download All PDFs
</Button>

      <Box
        mb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
      >
        <TextField
          label="Search by name, email, or mobile"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: isMobile ? "1 1 100%" : "0 0 300px" }}
        />
        {/* <Button
          variant="contained"
          color="primary"
          onClick={handleDownloadAllPDF}
        >
          Download All Students PDF
        </Button> */}
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }} ref={printRef}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Sr no</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>Actions</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Mobile</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Batch</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Regularity</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Communication</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Discipline</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold" }}>Test Performance</TableCell>
              
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredStudents.map((s, i) => (
              <TableRow
                key={i}
                hover
                sx={{
                  backgroundColor: getBatchColor(s.student.batch),
                  transition: "0.3s",
                }}
              >
                <TableCell>
                  {i+1}
                </TableCell>
                   <TableCell align="center">
                  <IconButton
                    color="primary"
                    onClick={() => handleDownloadIndividualPDF(s)}
                    disabled={downloadingId === s.student._id}
                    size="small"
                  >
                    {downloadingId === s.student._id ? (
                      <CircularProgress size={20} />
                    ) : (
                      <DownloadIcon />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell>
                  <img
                    src={s.student.studentImage || "/default-profile.png"}
                    alt="student"
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </TableCell>
                <TableCell>
                  {s.student.firstName} {s.student.lastName}
                </TableCell>
                <TableCell>{s.student.email || "—"}</TableCell>
                <TableCell>{s.student.mobile || "—"}</TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {s.student.batch || "—"}
                  </Typography>
                </TableCell>
                <TableCell align="center">{s.avgRegularity?.toFixed(2) || 0}</TableCell>
                <TableCell align="center">{s.avgCommunication?.toFixed(2) || 0}</TableCell>
                <TableCell align="center">{s.avgDiscipline?.toFixed(2) || 0}</TableCell>
                <TableCell align="center">{s.avgTestPerformance?.toFixed(2)}</TableCell>
             
              </TableRow>
            ))}

            {filteredStudents.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  <Typography>No students found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};