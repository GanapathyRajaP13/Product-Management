import React from "react";
import { Box, Typography, Grid, Paper, Avatar } from "@mui/material";

interface UserData {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  gender: string;
  userCode: string;
  isActive: number;
  UserType: number;
}

interface UserProfileProps {
  userData: UserData;
}

const getUserRole = (userType: number): string => {
  switch (userType) {
    case 1:
      return "Admin";
    case 2:
      return "User";
    case 3:
      return "Manager";
    default:
      return "Guest";
  }
};

const UserProfile: React.FC<UserProfileProps> = ({ userData }) => {
  const {
    username,
    email,
    firstname,
    lastname,
    gender,
    userCode,
    isActive,
    UserType,
  } = userData;

  const userRole = getUserRole(UserType);

  return (
    <Paper elevation={3} sx={{ padding: 3, position: "relative" }}>
      <Box sx={{ position: "absolute", top: 16, right: 16 }}>
        <Typography variant="subtitle1" color="textSecondary">
          Role: {userRole}
        </Typography>
      </Box>

      <Box display="flex" alignItems="center" mb={3}>
        <Avatar sx={{ width: 80, height: 80, marginRight: 3 }}>
          {firstname[0]} {lastname[0]}
        </Avatar>
        <Box>
          <Typography variant="h5">{username}</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            User Code: {userCode}
          </Typography>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            color={isActive ? "green" : "red"}
          >
            {isActive ? "Active" : "Inactive"}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>First Name:</strong> {firstname}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>Last Name:</strong> {lastname}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>Email:</strong> {email}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">
            <strong>Gender:</strong> {gender}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default UserProfile;
