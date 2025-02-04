import { InputAdornment, TextField, TextFieldProps } from "@mui/material";
import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import React from "react";
import { NumericFormat } from "react-number-format";

export default function MoneyInput(props: any) {
  return (
    <NumericFormat
      {...props}
      customInput={TextField}
      variant="outlined"
      size="small"
      thousandSeparator="."
      decimalSeparator=","
      allowNegative={false}
      decimalScale={2}
      fixedDecimalScale
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <AttachMoneyRoundedIcon />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
