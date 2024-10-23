import React, { useState } from "react";
import {
  Box,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  Avatar,
} from "@mui/material";
import { Link, Outlet, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
//import Footer from "../footer/Footer";
import logo from "../../assets/logo/logo.png";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Cookies from "js-cookie";
//import useToast from "../../hooks/useToast";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElInternship, setAnchorElInternship] = useState(null);
  const [anchorElJobs, setAnchorElJobs] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("faculty_id"));
  //const { showToast, ToastComponent } = useToast();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const handleProfileClick = () => {
    navigate("/studentprofile"); // Update this route as per your application
  };

  const logoutHandler = async () => {
    Cookies.remove("token");
    Cookies.remove("faculty_id");
    setToken(null);
    navigate("/login");
  };

  const handleInternshipClick = (event) => {
    setAnchorElInternship(event.currentTarget);
  };

  const handleJobsClick = (event) => {
    setAnchorElJobs(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElInternship(null);
    setAnchorElJobs(null);
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Link to="/">
        <img
          src={logo}
          alt="Logo"
          style={{ width: "150px", height: "50px", margin: "16px auto" }}
        />
      </Link>
    </Box>
  );

  return (
    <Box>
      {/* Sticky Header */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          backgroundColor: "#ffff",
          zIndex: 1100,
          padding: "16px",
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          boxSizing: "border-box",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Optional for added effect
        }}
      >
        {/* Left side: Logo and Internship, Jobs */}
        <Box sx={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              style={{ width: "150px", height: "50px" }}
            />
          </Link>

          {/* Internship and Jobs dropdowns */}
          {!isMobile && (
            <>
              <IconButton
                onClick={handleInternshipClick}
                sx={{ color: "#1A5774" }}
              >
                <Typography>Home</Typography>
              </IconButton>
            </>
          )}
        </Box>

        {isMobile ? (
          // Hamburger menu for mobile
          <>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
              sx={{ color: "black" }}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              sx={{
                "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
              }}
            >
              {drawer}
            </Drawer>
          </>
        ) : (
          // Right side: Login, Signup, and Profile icon for desktop/tablet
          <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {!token ? (
              <>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  sx={{ color: "black", borderColor: "black" }}
                >
                  Login
                </Button>
                {/* <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  color="primary"
                >
                  Candidate Signup
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  color="secondary"
                >
                  Employer Signup
                </Button> */}
              </>
            ) : (
              <>
                <Button
                  onClick={() => logoutHandler()}
                  variant="outlined"
                  color="primary"
                  sx={{ color: "#1A5774", borderColor: "black" }}
                >
                  Logout
                </Button>
                {/* <IconButton onClick={handleProfileClick} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: "#1A5774" }} alt="Profile">
                    <AccountCircleIcon />
                  </Avatar>
                </IconButton> */}
              </>
            )}
          </Box>
        )}
      </Box>

      {/* Outlet for nested routing */}
      <Box component="main">
        <Outlet />
      </Box>

      {/* Footer */}
      {/* <Footer />
      <ToastComponent /> */}
    </Box>
  );
};

export default Header;
