import type { SxProps, Theme } from "@mui/material";
import { Box, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import { forwardRef } from "react";
import { inputFieldStyle } from "./style";

interface SelectFieldProps {
  label?: string;
  value?: unknown;
  className?: string;
  sx?: SxProps<Theme>;
  labelStyle?: SxProps<Theme>;
  errorMessage?: string;
  required?: boolean;
  isLabelRequired?: boolean;
  isErrorRequired?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
  widthStyle?: { minWidth: number; height: number };
  options: Array<{ value: string | number; label: string }>;
  name?: string;
  onChange?: (event: SelectChangeEvent<unknown>) => void;
}

export const SelectField = forwardRef<HTMLDivElement, SelectFieldProps>(
  (props, ref) => {
    const {
      className = "",
      sx = {},
      label,
      isLabelRequired = true,
      isErrorRequired = true,
      value,
      widthStyle,
      labelStyle,
      placeholder = "",
      fullWidth = false,
      required,
      error,
      errorMessage,
      options = [],
      onChange,
      ...rest
    } = props;

    const handleChange = (event: SelectChangeEvent<unknown>) => {
      if (onChange) {
        onChange(event); // Call React Hook Form's onChange function
      }
    };

    return (
      <Box
        sx={[
          inputFieldStyle.rootSx,
          {
            "& .MuiSelect-root.Mui-error": {
              border: "1px solid #F44F5A",
            },
            "& .MuiSelect-root": {
              backgroundColor: "#fff !important",
              "&.Mui-disabled": {
                backgroundColor: "#0000001f !important",
              },
            },
            "& .MuiSelect-select": {
              lineHeight: "20px",
            },
            "& .MuiInputLabel-root": {
              fontSize: "14px",
              color: "#3B3B3B",
              fontWeight: 400,
              lineHeight: "20px",
            },
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        className={className}
        ref={ref}
      >
        {isLabelRequired && (
          <InputLabel sx={{ ...inputFieldStyle.labelStyle, ...labelStyle }}>
            {label} {required && <span style={{ color: "#F44F5A" }}>*</span>}
          </InputLabel>
        )}

        <Select
          value={value}
          displayEmpty
          defaultValue=""
          fullWidth={fullWidth}
          error={error}
          onChange={handleChange} // Use the custom handler
          sx={{ ...inputFieldStyle.selectSx, ...widthStyle }}
          {...rest}
        >
          <MenuItem value="" sx={{ display: "none" }}>
            <Typography fontSize="14px" color="gray">
              {placeholder}
            </Typography>
          </MenuItem>
          {options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              sx={{ ...inputFieldStyle.menuItemSx }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>

        {isErrorRequired && error && (
          <Typography sx={{ fontSize: "12px" }} color="error">
            {errorMessage}
          </Typography>
        )}
      </Box>
    );
  }
);

SelectField.displayName = "SelectField";
