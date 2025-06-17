export function parseExcelDate(fecha: any): Date {
  if (fecha instanceof Date) return fecha;

  if (typeof fecha === "number") {
    const excelEpoch = new Date(1899, 11, 30);
    const result = new Date(excelEpoch.getTime() + fecha * 86400000);
    return new Date(result.getFullYear(), result.getMonth(), result.getDate());
  }

  if (typeof fecha === "string") {
    const partes = fecha.split("/");
    if (partes.length === 3) {
      const mes = parseInt(partes[0], 10) - 1;
      const dia = parseInt(partes[1], 10);
      const anio = parseInt(partes[2], 10);
      const anioFinal = anio < 100 ? 2000 + anio : anio;
      return new Date(anioFinal, mes, dia);
    }
  }

  return new Date("");
}
