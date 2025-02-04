import { Service, TipoAcionamento } from "@/app/types/Service";

type ServiceInfoExtracted = Omit<
  Service,
  "responsavel" | "kmTotal" | "kmAdicional" | "valorNormal" | "valorTotal"
>;

export const extractInfo = (text: string): ServiceInfoExtracted => {
  const protocoloMatch = text.match(/Protocolo:\s*(\d+)/);
  const dataMatch = text.match(/Data\/Hora:\s*(\d{2}\/\d{2}\/\d{4})/);
  const placaMatch = text.match(/Veículo:\s*([\w\d]+)-/);
  const modeloMatch = text.match(/Veículo:\s*[\w\d]+-(.+)/);
  const bairroOrigemMatch = text.match(/End Origem:.*Bairro\s*:\s*([^\r\n]+)/);
  const bairroDestinoMatch = text.match(/End Destino:.*Bairro\s*:\s*([^\r\n]+)/);

  return {
    numeroProtocolo: protocoloMatch ? protocoloMatch[1] : '',
    tipoAcionamento: TipoAcionamento.grupoWhatsapp,
    data: dataMatch ? dataMatch[1] : '',
    origem: bairroOrigemMatch ? bairroOrigemMatch[1].trim() : '',
    destino: bairroDestinoMatch ? bairroDestinoMatch[1].trim() : '',
    placaVeiculo: placaMatch ? placaMatch[1] : '',
    modeloVeiculo: modeloMatch ? modeloMatch[1].trim() : '',
  };
}
