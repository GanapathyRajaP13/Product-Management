export const inputFieldStyle = {
  rootSx: { mb: 2 },
  selectSx: {
    "& .MuiSelect-select": {
      padding: "8px 12px",
      fontSize: "14px",
      color: "#3B3B3B",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#808080",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "primary.main",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "primary.main",
    },
    "& .MuiSelect-icon": {
      color: "#4E585E",
    },
    "&.Mui-error .MuiOutlinedInput-notchedOutline": {
      borderColor: "#F44F5A",
    },
  },
  menuItemSx: {
    "&.MuiMenuItem-root": {
      fontSize: "14px",
      color: "#3B3B3B",
      padding: "10px 16px",
    },
    "&.Mui-selected": {
      backgroundColor: "#E9F0FF",
      "&:hover": {
        backgroundColor: "#DDEAFE",
      },
    },
    "&.MuiMenuItem-root.Mui-disabled": {
      color: "#9E9E9E",
    },
  },
  labelStyle: {
    fontSize: "14px",
    color: "#3B3B3B",
    fontWeight: 400,
    lineHeight: "20px",
  },
};
