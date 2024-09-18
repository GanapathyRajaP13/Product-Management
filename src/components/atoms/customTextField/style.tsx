export const inputFieldStyle = {
  rootSx: { mb: 2 },
  textFieldSx: {
    "& .MuiOutlinedInput-input": {
      width: "100%",
      fontWeight: "normal",
    },
    "& .Mui-focused.MuiOutlinedInput-notchedOutline": {
      borderColor: "#E9E9E9 !important",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderRadius: "4px",
        borderColor: "#808080",
      },
      "&:hover fieldset": {
        borderColor: "primary.main",
      },
      "& .Mui-focused fieldset": {
        borderColor: "primary.main",
      },
    },

    "& .MuiFilledInput-root": {
      "&:before": {
        borderBottom: "none",
      },
      "&:after": {
        borderBottom: "none",
      },
      "&:hover": {
        "&.MuiFilledInput-root:before": {
          borderBottom: "#fff !important",
        },
      },
      background: "none",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#4E585E",
      fontWeight: 400,
      fontSize: "14px",
    },
  },
  filledRequiredStyle: {
    color: "#F44F5A",
  },
  labelStyle: {
    fontSize: "12px",
    color: "#3B3B3B",
    "& span": {
      color: "#F44F5A",
    },
  },
  errorSx: {
    mt: 0.5,
    mb: 0,
    "caret-color": "transparent",
  },
};
