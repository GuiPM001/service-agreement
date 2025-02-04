"use client";

import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { Service } from "../../types/Service";
import { dateToIsoString, getMonthYear } from "../../utils/dateUtils";
import FileDownloadRoundedIcon from "@mui/icons-material/FileDownloadRounded";

type MonthyCardProps = {
  date: Date;
  loading: boolean;
  services: Service[];
};

export default function MonthyCard({
  date,
  loading,
  services,
}: MonthyCardProps) {
  const router = useRouter();

  const [sheetLoading, setSheetLoading] = useState<boolean>(false);

  const shortDate = dateToIsoString(date);

  const totalAmount = services.reduce((acc, s) => s.valorTotal! + acc, 0);

  const getSheet = async () => {
    setSheetLoading(true);

    const response = await fetch("/api/generate-sheet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ services }),
    });

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sicar_${shortDate}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);

    setSheetLoading(false);
  };

  return (
    <div
      id={`card-${shortDate}`}
      className="mt-4 flex flex-col justify-center gap-4 border border-indigo-200 rounded-xl pt-4 px-6 pb-6"
    >
      <button
        className="text-start font-semibold text-xl capitalize text-indigo-800"
        onClick={() => router.push(`/service-list/${shortDate}`)}
      >
        {getMonthYear(date)}
      </button>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <span>
            Total de viagens:{" "}
            <span className="font-semibold">{services.length}</span>
          </span>

          <div className="flex flex-col">
            <span>Valor total</span>
            <span className="font-semibold text-lg">
              R$ {totalAmount.toLocaleString("pt-BR")}
            </span>
          </div>
        </>
      )}

      <div className="flex flex-row gap-4 mt-4">
        <Button
          variant="outlined"
          fullWidth
          disabled={loading || sheetLoading}
          startIcon={
            sheetLoading ? (
              <CircularProgress size={20} />
            ) : (
              <FileDownloadRoundedIcon />
            )
          }
          onClick={() => getSheet()}
        >
          Planilha
        </Button>
        <Button
          variant="contained"
          fullWidth
          onClick={() => router.push(`/service-form/${shortDate}`)}
        >
          Adicionar
        </Button>
      </div>
    </div>
  );
}
