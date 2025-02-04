import { Service, TipoAcionamento } from "../types/Service";
import * as XLSX from "xlsx";
import { getDayMonth } from "./dateUtils";
// import ExcelJS from 'exceljs';
import fs from 'fs';

import * as ExcelJS from 'exceljs';

interface ExcelCell {
  value: string | number;
  type: "s" | "n";
  style?: any;
}

export async function generateServicesSheet() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Página1');

  worksheet.mergeCells('B1:M1');
  worksheet.mergeCells('D2:E2');
  worksheet.mergeCells('F2:H2');
  worksheet.mergeCells('I2:M2');
  worksheet.mergeCells('A2:C2');

  worksheet.getCell('A1').value = 'Prestador: Reboque Prime';
  worksheet.getCell('B1').value = 'PLANILHA DE FATURAMENTO - ASSISTÊNCIA / SERVIÇOS';
  worksheet.getCell('D2').value = 'CNPJ: 56.987.636/0001-32';
  worksheet.getCell('F2').value = 'Mês/ano de referência: 01/2025';

  const headers = [
      'Sequencial do \natendimento', 'Data da \nsolicitação', 'Resp. SICAR pela \nsolicitação/aprovação',
      'Meio/forma de \nsolicitação', 'Protocolo', 'Placa', 'Veículo',
      'Origem', 'Destino', 'KM (real)', 'Saída Normal \n(valor da saída)',
      'Adicional KM \n(valor do KM)', 'Valor Total'
  ];
  worksheet.addRow(headers);

  // Aplicar estilos aos cabeçalhos
  const headerRow = worksheet.getRow(3);
  headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.fill = {bgColor: { argb: 'FFFF00'}, type: 'pattern', pattern: 'solid'}
  });

  // Exemplo de inserção de dados
  const data = [
      [1, '2025-01-01', '', 'Grupo whatsapp', 250101074133, 'FNL3A14', 'Freemont',
       'Cristiano Machado, 1017', 'Barreiro', 54, 210, 50, 260],
      [2, '2025-01-02', '', 'Grupo whatsapp', 250102081334, 'HIC3F45', 'Honda Fit',
       'Tropical', 'Tropical', 36, 165, null, 165]
  ];
  data.forEach(row => worksheet.addRow(row));

  // Ajustar largura das colunas automaticamente
  worksheet.columns.forEach(column => {
      column.width = 20;
  });

  // Salvar o arquivo
  await workbook.xlsx.writeFile('planilha_faturamento.xlsx');
  console.log('Planilha criada com sucesso!');
}

const generateServicesSheet2 = (services: Service[]) => {
  const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);

  ws["A1"] = { value: "SICAR", type: "s" };

  ws["A2"] = { value: "Prestador: Reboque Prime", type: "s" };
  ws["D2"] = { value: "CNPJ: 56.987.636/0001-32", type: "s" };
  ws["F2"] = { value: "Mês/ano de referência: 01/2025", type: "s" };
  ws["I2"] = { value: "Data envio SICAR: ", type: "s" };

  sheetHeader(ws);
  populateSheet(ws, services);

  const totalAmount = services.reduce((acc, s) => s.valorTotal! + acc, 0);
  ws[`A${services.length + 1}`] = { value: totalAmount, type: "n" };

  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Dados");
  XLSX.writeFile(wb, "planilha_manual.xlsx");
};

const sheetHeader = (ws: XLSX.WorkSheet) => {
  const headers = [
    [
      "Sequencial do atendimento",
      "Data da solicitação",
      "Resp. SICAR",
      "Meio/forma",
      "Protocolo",
      "Placa",
      "Veículo",
      "Origem",
      "Destino",
      "KM (real)",
      "Saída normal",
      "Adicional KM",
      "Valor Total",
    ],
  ];

  XLSX.utils.sheet_add_aoa(ws, headers, { origin: 'A3' });

  const headerCells = ['A3', 'B3', 'C3', 'D3', 'E3', 'F3', 'G3', 'H3', 'I3', 'J3', 'K3', 'L3', 'M3'];

  headerCells.forEach((cell) => {
    if (ws[cell]) {
      ws[cell].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: 'FFFF00' } },
      };
    }
  });
};

const populateSheet = (ws: XLSX.WorkSheet, services: Service[]) => {
  const data = services.map((service) => [
    "",
    getDayMonth(service.data!.toString()),
    service.responsavel,
    service.tipoAcionamento === 1 ? "Grupo whatsapp" : "Contato direto",
    service.numeroProtocolo,
    service.placaVeiculo,
    service.modeloVeiculo,
    service.origem,
    service.destino,
    service.kmTotal,
    { v: service.valorNormal, t: 'n' },
    { v: (service.kmAdicional ?? 0) * 30, t: 'n' },
    { v: service.valorTotal, t: 'n', z: '"R$ "#,##0.00' },
  ]);

  XLSX.utils.sheet_add_aoa(ws, data, { origin: "A4" });
};
