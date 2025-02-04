"use client";

import { Service } from "@/app/types/Service";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
} from "@mui/material";
import { useParams } from "next/navigation";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import React, { useEffect, useState } from "react";
import { getDayMontyhYear, getMonthYearForString } from "@/app/utils/dateUtils";
import InfoContainer from "../components/InfoContainer";
import PageTitle from "@/app/components/PageTitle";

export default function ServiceListPage() {
  const { month } = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [services, setServices] = useState<Service[]>([]);
  
  useEffect(() => {
    const getData = async () => {
      setServices([]);
      setLoading(true);
  
      const response = await fetch(`/api/get-services?month=${month}`);
      const data = await response.json();
  
      const sortedServices = data.services.sort((a: Service, b: Service) =>
        a.data! > b.data! ? -1 : 1
      );
  
      setServices(sortedServices);
      setLoading(false);
    };

    getData();
  }, [month]);

  return (
    <div>
      <PageTitle
        title={`Acionamentos - ${getMonthYearForString(month as string)}`}
        backButton
      />

      {loading && (
        <div className="w-full h-full mt-10 flex justify-center items-center">
          <CircularProgress />
        </div>
      )}

      <div className="mt-6">
        {services.map((service, index) => (
          <Accordion
            key={service.numeroProtocolo}
            className="mt-2 border border-indigo-200"
            elevation={0}
            defaultExpanded={index === 0}
          >
            <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>
              <div className="flex flex-col gap-3">
                <span>
                  <span className="font-semibold text-gray-700">
                    Protocolo:{" "}
                  </span>
                  {service.numeroProtocolo || "Sem protocolo"} |{" "}
                  {getDayMontyhYear(service.data!)}
                </span>
                <div className="flex flex-row">
                  <InfoContainer label="Veículo" info={service.modeloVeiculo} />
                  <InfoContainer label="Placa" info={service.placaVeiculo} />
                </div>
              </div>
            </AccordionSummary>
            <AccordionDetails className="flex flex-col gap-6 bg-gray-100">
              <div className="flex flex-row">
                <InfoContainer label="Origem" info={service.origem} />
                <InfoContainer label="Destino" info={service.destino} />
              </div>

              <div className="flex flex-row">
                <InfoContainer label="Km Total" info={service.kmTotal || 0} />
                <InfoContainer
                  label="Km Adicional"
                  info={service.kmAdicional || 0}
                />
              </div>

              <div className="flex flex-row">
                <InfoContainer
                  label="Saída"
                  info={`${service.valorNormal.toFixed(2)}`}
                />
                <InfoContainer
                  label="Adicional"
                  info={`${(service.valorTotal! - service.valorNormal).toFixed(
                    2
                  )}`}
                />
                <InfoContainer
                  label="Valor total"
                  info={`R$ ${service.valorTotal!.toFixed(2)}`}
                />
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
}
