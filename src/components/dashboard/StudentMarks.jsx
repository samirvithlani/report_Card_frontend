import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";
export const StudentMarks = ({updateModel,setupdateModel,updateButton,marksData,getStarRating}) => {
  return (
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
        {updateButton && (
          <IconButton sx={{ alignItems: "center" }}>
            <EditIcon onClick={() => setupdateModel(true)} />
          </IconButton>
        )}
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ marginTop: 2, maxHeight: "300px", overflowY: "auto" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Subject</TableCell>
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
            {marksData?.map((item, index) => (
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
                  {marksData?.reduce((total, item) => total + item.marks, 0)}
                </strong>
              </TableCell>
              <TableCell align="right">
                <strong>
                  {marksData?.reduce((total, item) => total + item.outOf, 0)}
                </strong>
              </TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
