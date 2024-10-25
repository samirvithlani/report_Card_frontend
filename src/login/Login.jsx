import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  Link,
} from "@mui/material";
import { styled } from "@mui/system";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GoogleIcon from "@mui/icons-material/Google";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";




const LoginWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  minHeight: "100vh",
  position: "relative", // Needed for loader overlay
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

const LeftPanel = styled(Box)(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flex: 1,
  padding: "2rem",
  [theme.breakpoints.down("md")]: {
    padding: "1rem",
  },
}));

const RightPanel = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  padding: "2rem",
  flex: 1,
  textAlign: "center",
  [theme.breakpoints.down("md")]: {
    padding: "1rem",
    height: "auto",
  },
}));

const SocialLoginWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const LoginForm = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: "400px",
  width: "100%",
  boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
  borderRadius: "10px",
}));

const SignUpButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#ffffff",
  color: "#00c6ff",
  fontWeight: "bold",
  padding: theme.spacing(1.5, 5),
  borderRadius: "25px",
  "&:hover": {
    backgroundColor: "#ffffff",
  },
  onclick: () => {
    navigate("/signup");
  },
}));

// Overlay for loader fade effect
const Overlay = styled(Box)({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999, // On top of the page content
});

export const Login = () => {
  const [loading, setLoading] = useState(false); // State to handle loading

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({mode:"onBlur"});

  //const { showToast, ToastComponent } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setLoading(true); // Show loader
      //await showToast("Processing", "info");
      const res = await axios.post("/faculty/login", data);
      console.log("faculty....",res.data.data);
      localStorage.setItem("faculty_id", res.data.data._id);
      localStorage.setItem("facultyData", JSON.stringify(res.data.data));
      
      
        navigate("/");
      
    } catch (err) {
      console.log(err);
      alert("Invalid credentials");
      //setLoading(false); // Hide loader on error
      //await showToast("Login Failed", "error");
    }
  };

  return (
    <LoginWrapper>
      {/* <ToastComponent /> */}

      {/* Display overlay and loader if loading */}
      {loading && (
        <Overlay>
          {/* <Loader /> Use your custom Loader component here */}
        </Overlay>
      )}

      {/* Left Panel for Login */}
      <LeftPanel>
        <LoginForm>
          <Typography variant="h4" fontWeight="bold">
            Login to Your Account
          </Typography>
          {/* <Typography variant="subtitle1" sx={{ mt: 1, mb: 2 }}>
            Login using social networks
          </Typography> */}
          {/* <SocialLoginWrapper>
            <IconButton
              color="primary"
              sx={{ backgroundColor: "#3b5998", color: "white" }}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              color="primary"
              sx={{ backgroundColor: "#db4437", color: "white" }}
            >
              <GoogleIcon />
            </IconButton>
            <IconButton
              color="primary"
              sx={{ backgroundColor: "#0077b5", color: "white" }}
            >
              <LinkedInIcon />
            </IconButton>
          </SocialLoginWrapper>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            OR
          </Typography> */}

          {/* React Hook Form Starts */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              sx={{ mt: 2 }}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                  message: "Invalid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              sx={{ mb: 2 }}
              {...register("password", {
                required: "Password is required",
                
              })}
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ""}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{
                mt: 2,
                backgroundColor: "#00c6ff",
                color: "white",
                "&:hover": { backgroundColor: "#0072ff" },
              }}
            >
              Sign In
            </Button>
          </form>
          {/* React Hook Form Ends */}

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Link href="#" underline="none">
              Forgot Password?
            </Link>
          </Box>
        </LoginForm>
      </LeftPanel>

      {/* Right Panel for Sign Up */}
      <RightPanel>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
          New Here?
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4 }}>
          Sign up and discover a great amount of new opportunities!
        </Typography>
        <SignUpButton
          onClick={() => {
            navigate("/register");
          }}
        >
          Sign Up
        </SignUpButton>
      </RightPanel>
    </LoginWrapper>
  );
};
