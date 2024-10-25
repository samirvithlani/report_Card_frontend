import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Avatar,
} from "@mui/material";
import { Link, Outlet, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import logo from "../../assets/logo/royal_logo.png";
import Cookies from "js-cookie";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("faculty_id"));
  const [facultyData, setFacultyData] = useState(() => {
    const data = localStorage.getItem("facultyData");
    return data ? JSON.parse(data) : null;
  });
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileClick = () => {
    navigate("/studentprofile");
  };

  const logoutHandler = async () => {
    Cookies.remove("token");
    Cookies.remove("faculty_id");
    setToken(null);
    navigate("/login");
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
      {facultyData && (
        <Typography variant="h6" sx={{ marginTop: "16px" }}>
          {facultyData?.firstName && facultyData?.lastName
            ? `${facultyData.firstName} ${facultyData.lastName}`
            : "Faculty"}
        </Typography>
      )}
      <List>
        <ListItem button component={Link} to="/">
          <ListItemText primary="Home" />
        </ListItem>
        {!token ? (
          <ListItem button component={Link} to="/login">
            <ListItemText primary="Login" />
          </ListItem>
        ) : (
          <ListItem button onClick={logoutHandler}>
            <ListItemText primary="Logout" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
    <Box>
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
        <Box sx={{ display: "flex", alignItems: "center", gap: "32px" }}>
          <Link to="/">
            <img
              src={logo}
              alt="Logo"
              style={{ width: "150px", height: "50px" }}
            />
          </Link>

          {isMobile && facultyData && (
            <Typography variant="h6">
              {facultyData?.firstName && facultyData?.lastName
                ? `${facultyData.firstName} ${facultyData.lastName}`
                : "Faculty"}
            </Typography>
          )}
        </Box>

        {isMobile ? (
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
          <Box sx={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* {facultyData && (
              <Typography>
                {facultyData?.firstName && facultyData?.lastName
                  ? `${facultyData.firstName} ${facultyData.lastName}`
                  : "Faculty"}
              </Typography>
            )} */}
            {!token ? (
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                sx={{ color: "black", borderColor: "black" }}
              >
                Login
              </Button>
            ) : (
              <Button
                onClick={logoutHandler}
                variant="outlined"
                color="primary"
                sx={{ color: "#1A5774", borderColor: "black" }}
              >
                Logout
              </Button>
            )}
          </Box>
        )}
      </Box>

      <Box component="main">
        <Outlet />
      </Box>
    </Box>
  );
};

export default Header;
