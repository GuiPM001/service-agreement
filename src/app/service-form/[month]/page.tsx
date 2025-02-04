"use client";

import React, { useEffect, useState } from "react";
import { Alert, Snackbar } from "@mui/material";
import { useForm, useWatch } from "react-hook-form";
import { Service } from "@/app/types/Service";
import { removeSeparator } from "../utils/removeNumberSeparator";
import { useParams } from "next/navigation";
import PageTitle from "@/app/components/PageTitle";
import ServiceForm from "../components/ServiceForm";
import { NotificationType } from "@/app/types/Notification";

export default function ServiceFormPage() {
  const initialState: Service = {
    numeroProtocolo: '',
    tipoAcionamento: null,
    data: null,
    origem: "",
    destino: "",
    modeloVeiculo: "",
    placaVeiculo: "",
    kmTotal: null,
    kmAdicional: null,
    valorNormal: 165,
    valorTotal: 165,
  };

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Service>({
    defaultValues: initialState,
  });

  const { month } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<NotificationType | null>(null);

  const kmAdicional = useWatch({ control, name: "kmAdicional" });
  const valorNormal = useWatch({ control, name: "valorNormal" });

  useEffect(() => {
    setValue(
      "valorTotal",
      removeSeparator(valorNormal.toString()) + kmAdicional! * 3.3
    );
  }, [kmAdicional, valorNormal]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    const formattedForm: Service = {
      ...data,
      valorNormal: removeSeparator(data.valorNormal),
      valorTotal: removeSeparator(data.valorTotal),
    };

    const response = await fetch("/app/api/save-service", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ month, newService: formattedForm }),
    });

    await addNotification(response);
    setLoading(false);
  };

  const addNotification = async (response: Response) => {
    if (response.ok) {
      reset();
      setApiResponse({
        severity: "success",
        message: "Acionamento salvo com sucesso",
      });

      return;
    }

    const result = await response.json();
    setApiResponse({
      severity: "error",
      message: `Erro ao salvar: ${result.message}`,
    });
  };

  return (
    <div className="flex flex-col gap-10">
      <PageTitle title="Novo acionamento" backButton />

      <ServiceForm
        control={control}
        errors={errors}
        loading={loading}
        resetForm={() => reset()}
        handleSubmit={handleSubmit(onSubmit)}
        month={month as string}
      />

      <Snackbar
        open={apiResponse !== null}
        autoHideDuration={3000}
        onClose={() => setApiResponse(null)}
      >
        <Alert
          onClose={() => setApiResponse(null)}
          severity={apiResponse?.severity}
          variant="filled"
        >
          {apiResponse?.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
