import React from "react";

type FormSectionProps = {
  title: string;
  children: React.ReactNode;
}

export default function FormSection({ title, children }: FormSectionProps) {
  return (
    <div className="flex flex-col">
      <h2 className="font-semibold mb-2 text-[#212C6F]">{title}</h2>

      <div className="flex flex-col gap-5">{children}</div>
    </div>
  );
}
