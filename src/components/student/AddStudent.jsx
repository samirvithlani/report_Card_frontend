import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Grid, Typography, Container, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const AddStudent = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const facultyId = localStorage.getItem('faculty_id');
    if (facultyId === undefined) {
      alert("Please login first");
      navigate('/login');
      return; // Exit if not logged in
    }

    // Post data to add the student
    try {
      data.faculty = facultyId;
      const res = await axios.post('/student/add', data);
      console.log("Response: ", res.data);

      if (res.status === 201) {
        const studentId = res.data._id; // Assuming the response contains the new student ID
        alert("Student added successfully");

        // Now add the student report with the student ID
        const studentReportData = {
          student: studentId,
          faculty: facultyId,
          regularity: data.regularity,
          communication: data.communication,
          discipline: data.discipline,
          testPerformance: data.testPerformance,
        };

        const reportRes = await axios.post('/student-report/add', studentReportData); // Assuming you have a route for this
        if (reportRes.status === 201) {
          alert("Student report added successfully");
        } else {
          alert("Failed to add student report");
        }

        navigate('/'); // Navigate back to the home page
      } else {
        alert("Failed to add student");
      }
    } catch (error) {
      console.error("Error: ", error);
      //alert("An error occurred while adding the student");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom align="center">
        Student Registration
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              fullWidth
              {...register('firstName', { required: 'First name is required' })}
              error={!!errors.firstName}
              helperText={errors.firstName?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              fullWidth
              {...register('lastName', { required: 'Last name is required' })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              fullWidth
              type="email"
              {...register('email', { required: 'Email is required' })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              fullWidth
              type="password"
              {...register('password', { required: 'Password is required' })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Mobile"
              fullWidth
              {...register('mobile', { required: 'Mobile number is required' })}
              error={!!errors.mobile}
              helperText={errors.mobile?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Batch"
              fullWidth
              {...register('batch', { required: 'Batch is required' })}
              error={!!errors.batch}
              helperText={errors.batch?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="College Name"
              fullWidth
              {...register('collegeName', { required: 'College name is required' })}
              error={!!errors.collegeName}
              helperText={errors.collegeName?.message}
            />
          </Grid>

          {/* Marks Section */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="regularity-label">Regularity</InputLabel>
              <Select
                labelId="regularity-label"
                {...register('regularity', { required: 'Regularity is required' })}
                error={!!errors.regularity}
              >
                {[...Array(6).keys()].map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
              {errors.regularity && (
                <Typography color="error">{errors.regularity.message}</Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="communication-label">Communication</InputLabel>
              <Select
                labelId="communication-label"
                {...register('communication', { required: 'Communication is required' })}
                error={!!errors.communication}
              >
                {[...Array(6).keys()].map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
              {errors.communication && (
                <Typography color="error">{errors.communication.message}</Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="discipline-label">Discipline</InputLabel>
              <Select
                labelId="discipline-label"
                {...register('discipline', { required: 'Discipline is required' })}
                error={!!errors.discipline}
              >
                {[...Array(6).keys()].map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
              {errors.discipline && (
                <Typography color="error">{errors.discipline.message}</Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel id="test-performance-label">Test Performance</InputLabel>
              <Select
                labelId="test-performance-label"
                {...register('testPerformance', { required: 'Test performance is required' })}
                error={!!errors.testPerformance}
              >
                {[...Array(6).keys()].map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
              {errors.testPerformance && (
                <Typography color="error">{errors.testPerformance.message}</Typography>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};
