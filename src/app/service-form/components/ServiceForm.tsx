"use client";

import React from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { Service, TipoAcionamento } from "@/app/types/Service";
import MoneyInput from "@/app/components/MoneyInput";
import FormSection from "@/app/components/FormSection";
import BasicSelect from "@/app/components/BasicSelect";
import SaveIcon from "@mui/icons-material/Save";
import { ptBR } from "@mui/x-date-pickers/locales";
import dayjs from "dayjs";

type ServiceFormProps = {
  loading: boolean;
  control: Control<Service, any>;
  errors: FieldErrors<Service>;
  resetForm: () => void;
  handleSubmit: () => void;
  month: string;
};

export default function ServiceForm({
  control,
  errors,
  resetForm,
  loading,
  handleSubmit,
  month,
}: ServiceFormProps) {
  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
      <FormSection title="Acionamento">
        <div className="flex flex-row gap-3">
          <Controller
            name="numeroProtocolo"
            control={control}
            render={({ field }) => (
              <TextField
                size="small"
                type="number"
                label="Nº protocolo"
                {...field}
              />
            )}
          />

          <Controller
            name="data"
            control={control}
            rules={{
              required: "Data é obrigatória",
              validate: (value) => {
                const actualMonth = dayjs(month);
                if (dayjs(value).isBefore(actualMonth, "month")) {
                  return "A data não pode ser menor que o mês selecionado";
                }
                if (dayjs(value).isAfter(actualMonth, "month")) {
                  return "A data não pode ser maior que o mês selecionado";
                }
                return true;
              },
            }}
            render={({ field }) => (
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                localeText={
                  ptBR.components.MuiLocalizationProvider.defaultProps
                    .localeText
                }
              >
                <DesktopDatePicker
                  {...field}
                  label="Data"
                  format="DD/MM/YYYY"
                  orientation="landscape"
                  // defaultValue={dayjs(new Date())}
                  slotProps={{
                    textField: {
                      size: "small",
                      error: !!errors.data,
                      helperText: errors.data?.message,
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />
        </div>
        <Controller
          name="tipoAcionamento"
          control={control}
          rules={{ required: "Tipo do acionamento é obrigatório" }}
          render={({ field }) => (
            <BasicSelect
              {...field}
              name="tipoAcionamento"
              label="Tipo de acionamento"
              options={[
                {
                  value: TipoAcionamento.grupoWhatsapp,
                  label: "Grupo do Whatsapp",
                },
                {
                  value: TipoAcionamento.contatoDireto,
                  label: "Contato direto",
                },
              ]}
              error={!!errors.tipoAcionamento}
              helperText={errors.tipoAcionamento?.message}
            />
          )}
        />
        <Controller
          name="responsavel"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Responsável SICAR" size="small" />
          )}
        />
      </FormSection>

      <FormSection title="Dados do veículo">
        <div className="flex flex-row gap-3">
          <Controller
            name="placaVeiculo"
            control={control}
            rules={{ required: "Número da placa é obrigatório" }}
            render={({ field }) => (
              <TextField
                size="small"
                label="Placa do veículo"
                error={!!errors.placaVeiculo}
                helperText={errors.placaVeiculo?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="modeloVeiculo"
            control={control}
            rules={{ required: "Modelo do veículo é obrigatório" }}
            render={({ field }) => (
              <TextField
                size="small"
                label="Modelo do veículo"
                error={!!errors.modeloVeiculo}
                helperText={errors.modeloVeiculo?.message}
                {...field}
              />
            )}
          />
        </div>
      </FormSection>

      <FormSection title="Origem e destino">
        <Controller
          name="origem"
          control={control}
          rules={{ required: "Local de origem é obrigatório" }}
          render={({ field }) => (
            <TextField
              size="small"
              label="Local de origem"
              error={!!errors.origem}
              helperText={errors.origem?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="destino"
          control={control}
          rules={{ required: "Local de destino é obrigatório" }}
          render={({ field }) => (
            <TextField
              size="small"
              label="Local de destino"
              error={!!errors.destino}
              helperText={errors.destino?.message}
              {...field}
            />
          )}
        />

        <div className="flex flex-row gap-3">
          <Controller
            name="kmTotal"
            control={control}
            rules={{ required: "Km total é obrigatório" }}
            render={({ field }) => (
              <TextField
                size="small"
                type="number"
                label="Km Total"
                error={!!errors.kmTotal}
                helperText={errors.kmTotal?.message}
                {...field}
              />
            )}
          />
          <Controller
            name="kmAdicional"
            control={control}
            render={({ field }) => (
              <TextField
                size="small"
                type="number"
                label="Km adicional"
                {...field}
              />
            )}
          />
        </div>
      </FormSection>

      <FormSection title="Valores">
        <div className="flex flex-row gap-3">
          <Controller
            name="valorNormal"
            control={control}
            rules={{ required: "Valor da saída é obrigatória" }}
            render={({ field }) => (
              <MoneyInput
                label="Valor de saída"
                {...field}
                error={!!errors.valorNormal}
                helperText={errors.valorNormal?.message}
              />
            )}
          />

          <Controller
            name="valorTotal"
            control={control}
            rules={{ required: "Valor total é obrigatório" }}
            render={({ field }) => (
              <MoneyInput
                label="Valor total"
                {...field}
                error={!!errors.valorTotal}
                helperText={errors.valorTotal?.message}
              />
            )}
          />
        </div>
      </FormSection>

      <div className="flex flex-row gap-3">
        <Button
          variant="text"
          fullWidth
          onClick={() => resetForm()}
          disabled={loading}
        >
          Limpar
        </Button>
        <Button
          variant="contained"
          fullWidth
          type="submit"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
        >
          Salvar
        </Button>
      </div>
    </form>
  );
}
