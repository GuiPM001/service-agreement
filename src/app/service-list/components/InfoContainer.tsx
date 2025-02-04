import React from "react";

type InfoContainerProps = {
  label: string;
  info: string | number;
};

export default function InfoContainer({ label, info }: InfoContainerProps) {
  return (
    <div className="flex flex-col w-1/2">
      <span>{label}</span>
      <span className="font-semibold text-gray-700">{info}</span>
    </div>
  );
}
