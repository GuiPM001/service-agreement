"use client";

import "swiper/css";
import "swiper/css/navigation";
import React, { useState } from "react";
import PageTitle from "../components/PageTitle";
import MonthyCard from "./components/MonthyCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Service } from "../types/Service";
import { dateToIsoString } from "../utils/dateUtils";

export default function Home() {
  const dates: Date[] = [];
  const today = new Date();

  for (let i = -4; i <= 1; i++) {
    const date = new Date(today);
    date.setDate(1);
    date.setMonth(today.getMonth() + i);
    dates.push(date);
  }

  const [loading, setLoading] = useState<boolean>(false);
  const [services, setServices] = useState<Service[]>([]);

  const getData = async (activeIndex: number) => {
    setServices([]);
    const date = dates[activeIndex];
    await fetchMonthlyData(dateToIsoString(date));
  };

  const fetchMonthlyData = async (date: string) => {
    setLoading(true);

    const response = await fetch(`/api/get-services?month=${date}`);
    const data = await response.json();
    setServices(data.services);

    setLoading(false);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="w-full text-center p-2 -mt-4 mb-12 font-bold text-2xl border-b border-slate-200">
        REBOQUE PRIME
      </h1>

      <div className="w-full">
        <PageTitle title="Resumo do mês" backButton={false} />
        <Swiper
          initialSlide={4}
          spaceBetween={10}
          onActiveIndexChange={(e) => getData(e.activeIndex)}
        >
          {dates.map((date) => (
            <SwiperSlide key={date.toISOString()}>
              <MonthyCard date={date} loading={loading} services={services} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
