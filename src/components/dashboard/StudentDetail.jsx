import { PhotoCamera } from "@mui/icons-material";
import { Avatar, Box, Grid, IconButton, Typography } from "@mui/material";
import React from "react";

export const StudentDetail = ({studentImage,studentData,updateButton,handleUploadImage}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sx={{ textAlign: "center", marginBottom: "16px" }}>
        <Typography
          variant="h4"
          sx={{ color: "#1A5774", fontWeight: "bold", mt: 4 }}
        >
          {/* Progress Report of<br></br> {
                        studentData?.studentDetails?.subject
                       } */}
          Student Detail
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
              style={{ marginTop: "50px" }}
              component="img"
              src={studentImage}
              alt="Student"
              sx={{
                borderRadius: "50%",
                width: { xs: "220px", md: "240px" },
                height: { xs: "220px", md: "240px" },
                objectFit: "cover",
              }}
            />
          ) : (
            <Avatar
              style={{ marginTop: "50px" }}
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
          {updateButton && (
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
          )}
        </Box>
      </Grid>
      <Grid item xs={12}>
        {/* <Typography
                      variant="h5"
                      sx={{ color: "#1A5774", fontWeight: "bold", mt: 1,textAlign:"center" }} 
                    >
                      Student Detail
                    </Typography> */}
      </Grid>
      <Grid
        container
        spacing={2}
        sx={{ marginTop: 3, paddingX: 2 }} // Top margin and horizontal padding
      >
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {/* Individual items with padding and box styling */}
            <Grid item xs={6} sm={4}>
              <Box
                sx={{
                  padding: 2,
                  backgroundColor: "#F0F4F8",
                  borderRadius: 2,
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                <Typography sx={{ fontWeight: "bold" }}>Name:</Typography>
                <Typography variant="body1">
                  {studentData?.studentDetails?.firstName &&
                    studentData?.studentDetails?.firstName +
                      " " +
                      studentData?.studentDetails?.lastName}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Box
                sx={{
                  padding: 2,
                  backgroundColor: "#F0F4F8",
                  borderRadius: 2,
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                <Typography sx={{ fontWeight: "bold" }}>College:</Typography>
                <Typography variant="body1">
                  {studentData?.studentDetails?.collageName}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Box
                sx={{
                  padding: 2,
                  backgroundColor: "#F0F4F8",
                  borderRadius: 2,
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                <Typography sx={{ fontWeight: "bold" }}>Batch:</Typography>
                <Typography variant="body1">
                  {studentData?.studentDetails?.batch}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Box
                sx={{
                  padding: 2,
                  backgroundColor: "#F0F4F8",
                  borderRadius: 2,
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                <Typography sx={{ fontWeight: "bold" }}>Mobile:</Typography>
                <Typography variant="body1">
                  {studentData?.studentDetails?.mobile}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={8} md={8}>
              <Box
                sx={{
                  padding: 2,
                  backgroundColor: "#F0F4F8",
                  borderRadius: 2,
                  boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                <Typography sx={{ fontWeight: "bold" }}>Email:</Typography>
                <Typography variant="body1" sx={{ wordBreak: "break-word" }}>
                  {studentData?.studentDetails?.email}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
