'use client';

import React from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { IconButton } from "@mui/material";
import { useRouter } from "next/navigation";

type PageTitleProps = {
  title: string;
  backButton: boolean;
};
export default function PageTitle({ title, backButton }: PageTitleProps) {
  const router = useRouter();

  return (
    <div className="flex flex-row items-center self-start gap-2">
      {backButton && (
        <IconButton
          aria-label="delete"
          size="small"
          onClick={() => router.push("/")}
        >
          <ArrowBackRoundedIcon className="text-[#303f9f]" />
        </IconButton>
      )}
      <h1 className="text-xl font-semibold">{title}</h1>
    </div>
  );
}
