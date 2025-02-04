export type Service = {
  numeroProtocolo: number | string;
  tipoAcionamento: TipoAcionamento | null;
  responsavel?: string;
  data: string | Date | null;
  origem: string;
  destino: string;
  modeloVeiculo: string;
  placaVeiculo: string;
  kmTotal: number | null;
  kmAdicional: number | null;
  valorNormal: number;
  valorTotal: number | null;
};

export enum TipoAcionamento {
  grupoWhatsapp = 1,
  contatoDireto = 2,
}