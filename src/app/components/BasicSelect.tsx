import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from "@mui/material";
import React from "react";
import { ControllerRenderProps } from "react-hook-form";

type Option = {
  label: string;
  value: any;
};

type BasicSelectProps = ControllerRenderProps & {
  name: string;
  label: string;
  value: any;
  options: Option[];
  error: boolean;
  helperText?: string;
};

export default function BasicSelect(props: BasicSelectProps) {
  const hasValue = props.value !== null;

  return (
    <FormControl fullWidth size="small" error={props.error} >
      <InputLabel id={props.name} shrink={hasValue}>{props.label}</InputLabel>

      <Select id={props.name} {...props} label={hasValue ? props.label : ""} >
        {props.options.map((option: Option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>

      {props.error && props.helperText && (
        <FormHelperText>{props.helperText}</FormHelperText>
      )}
    </FormControl>
  );
}
