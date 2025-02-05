import * as ExcelJS from "exceljs";
import { NextRequest, NextResponse } from "next/server";
import { getDayMonth, getMonthYear } from "@/app/utils/dateUtils";
import { Service, TipoAcionamento } from "@/app/types/Service";
import { base64Image } from "./base64Image";

export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();
    const services = requestBody.services || [];
    const date = requestBody.date;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Página1");

    addImage(workbook, worksheet);

    createHeader(worksheet, date);
    populateSheet(services, worksheet);
    addTotalRow(services, worksheet);
    setColumnWidth(worksheet);

    const buffer = await workbook.xlsx.writeBuffer();
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="planilha.xlsx"',
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { message: "Erro ao gerar planilha.", error: e.message },
      { status: 500 }
    );
  }
}

const createHeader = (worksheet: ExcelJS.Worksheet, date: Date) => {
  worksheet.mergeCells("A1:B1");
  worksheet.mergeCells("C1:M1");
  worksheet.mergeCells("D2:E2");
  worksheet.mergeCells("F2:H2");
  worksheet.mergeCells("I2:M2");
  worksheet.mergeCells("A2:C2");

  worksheet.getCell("C1").value =
    "PLANILHA DE FATURAMENTO - ASSISTÊNCIA / SERVIÇOS";

  const firstRow = worksheet.getRow(1);
  firstRow.height = 78;
  firstRow.eachCell((cell) => {
    cell.alignment = {
      vertical: "middle",
    };
    cell.font = { bold: true, color: { argb: "FFFFFF" }, size: 12 };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "002060" },
    };
  });

  worksheet.getCell("A1").fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "002060" },
  };

  worksheet.getCell("A2").value = "Prestador: Reboque Prime";
  worksheet.getCell("D2").value = "CNPJ: 56.987.636/0001-32";
  worksheet.getCell("F2").value = `Mês/ano de referência: ${getMonthYear(
    new Date(date),
    true
  )}`;
  worksheet.getCell("I2").value = "Data de envio SICAR: ";
  const row = worksheet.getRow(2);
  row.height = 21;
  row.eachCell((cell) => addBorder(cell));

  const headers = [
    "Sequencial do \natendimento",
    "Data da \nsolicitação",
    "Resp. SICAR pela \nsolicitação/aprovação",
    "Meio/forma de \nsolicitação",
    "Protocolo",
    "Placa",
    "Veículo",
    "Origem",
    "Destino",
    "KM (real)",
    "Saída Normal \n(valor da saída)",
    "Adicional KM \n(valor do KM)",
    "Valor Total",
  ];

  worksheet.addRow(headers);
  const headerRow = worksheet.getRow(3);
  headerRow.height = 40;
  headerRow.eachCell((cell) => {
    addBorder(cell);
    centerText(cell);
    cell.font = { bold: true };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFF00" },
    };
  });
};

const populateSheet = (services: Service[], worksheet: ExcelJS.Worksheet) => {
  services.forEach((service: Service) => {
    const row = worksheet.addRow([
      "",
      getDayMonth(service.data as string),
      service.responsavel || "",
      service.tipoAcionamento === TipoAcionamento.grupoWhatsapp
        ? "Grupo whatsapp"
        : "Contato direto",
      service.numeroProtocolo,
      service.placaVeiculo,
      service.modeloVeiculo,
      service.origem,
      service.destino,
      service.kmTotal,
      service.valorNormal,
      (service.kmAdicional || 0) * 3.3,
      service.valorTotal,
    ]);

    row.height = 21;
    row.eachCell((cell, colNumber) => {
      if (![7, 8, 9].includes(colNumber)) {
        cell.alignment = { wrapText: true, horizontal: "center" };
      }

      addBorder(cell);

      if (colNumber === 5) cell.numFmt = "0";

      if ([11, 12].includes(colNumber)) cell.numFmt = "#,##0.00";

      if (colNumber === 13) cell.numFmt = '"R$ "#,##0.00';
    });
  });
};

const addTotalRow = (services: Service[], worksheet: ExcelJS.Worksheet) => {
  const totalKm = services.reduce((acc, s) => s.valorNormal + acc, 0);
  const totalAditional = services.reduce(
    (acc, s) => s.valorTotal! - s.valorNormal + acc,
    0
  );
  const totalAmount = services.reduce((acc, s) => s.valorTotal! + acc, 0);

  const row = worksheet.addRow([
    "Total",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    totalKm,
    totalAditional,
    totalAmount,
  ]);

  row.height = 21;
  row.eachCell((cell, colNumber) => {
    addBorder(cell);
    centerText(cell);
    cell.font = { bold: true };

    if ([11, 12].includes(colNumber)) cell.numFmt = "#,##0.00";

    if (colNumber === 13) cell.numFmt = '"R$ "#,##0.00';
  });
};

const addBorder = (cell: ExcelJS.Cell) => {
  cell.border = {
    top: { style: "thin" },
    left: { style: "thin" },
    bottom: { style: "thin" },
    right: { style: "thin" },
  };
};

const centerText = (cell: ExcelJS.Cell) => {
  cell.alignment = {
    wrapText: true,
    horizontal: "center",
    vertical: "middle",
  };
};

const setColumnWidth = (worksheet: ExcelJS.Worksheet) => {
  worksheet.getColumn("A").width = 14;
  worksheet.getColumn("B").width = 13;
  worksheet.getColumn("C").width = 20;
  worksheet.getColumn("D").width = 18;
  worksheet.getColumn("E").width = 16;
  worksheet.getColumn("F").width = 12;
  worksheet.getColumn("G").width = 16;
  worksheet.getColumn("H").width = 24;
  worksheet.getColumn("I").width = 21;
  worksheet.getColumn("J").width = 10;
  worksheet.getColumn("K").width = 16;
  worksheet.getColumn("L").width = 15;
  worksheet.getColumn("M").width = 13;
};

const addImage = (workbook: ExcelJS.Workbook, worksheet: ExcelJS.Worksheet) => {
  const imageId = workbook.addImage({
    base64: base64Image,
    extension: "png",
  });

  worksheet.addImage(imageId, {
    tl: { col: 0.25, row: 0.35 },
    ext: { width: 111, height: 70 },
  });
};
