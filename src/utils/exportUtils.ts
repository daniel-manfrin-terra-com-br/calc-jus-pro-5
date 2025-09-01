import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export const exportToPDF = (data: any, title: string) => {
  const doc = new jsPDF();
  
  // Logo da calculadora
  doc.setFillColor(59, 130, 246); // Cor azul para fundo do logo
  doc.roundedRect(15, 15, 12, 12, 2, 2, 'F');
  
  doc.setTextColor(255, 255, 255); // Texto branco
  doc.setFontSize(14);
  doc.text('C', 19, 23);
  
  // Reset cor do texto
  doc.setTextColor(0, 0, 0);
  
  // Cabeçalho com logo
  doc.setFontSize(18);
  doc.text('CALC JUS PRO', 35, 25);
  
  doc.setFontSize(12);
  doc.text('Calculadora Juridica Profissional', 35, 32);
  
  doc.setFontSize(16);
  doc.text(title, 20, 50);
  
  doc.setFontSize(10);
  doc.text(`Relatorio gerado em: ${new Date().toLocaleDateString('pt-BR')} as ${new Date().toLocaleTimeString('pt-BR')}`, 20, 60);
  
  // Linha separadora
  doc.setLineWidth(0.5);
  doc.line(20, 65, 190, 65);
  
  let yPosition = 80;
  
  if (data) {
    // Escolher o layout baseado no tipo de cálculo
    if (data.calculationType === 'civil') {
      yPosition = addCivilDataToPDF(doc, data, yPosition);
    } else if (data.calculationType === 'labor') {
      yPosition = addLaborDataToPDF(doc, data, yPosition);
    } else if (data.calculationType === 'criminal') {
      yPosition = addCriminalDataToPDF(doc, data, yPosition);
    } else {
      // Fallback para dados genéricos
      yPosition = addGenericDataToPDF(doc, data, yPosition);
    }
  }
  
  // Rodapé profissional
  doc.setFontSize(8);
  doc.text('Este relatorio foi gerado automaticamente pela Calculadora Juridica Profissional', 20, 280);
  doc.text('Sistema baseado em tabelas oficiais e legislacao vigente - www.calcjuspro.com', 20, 287);
  
  const fileName = `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

// Função para adicionar dados de cálculo cível
const addCivilDataToPDF = (doc: any, data: any, yPosition: number) => {
  // Seção: Dados de Entrada
  doc.setFontSize(14);
  doc.text('DADOS DE ENTRADA', 20, yPosition);
  yPosition += 12;
  
  doc.setFontSize(11);
  
  if (data.valorOriginal) {
    doc.text(`* Valor Principal: ${data.valorOriginal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 25, yPosition);
    yPosition += 8;
  }
  
  if (data.dataInicial && data.dataFinal) {
    doc.text(`* Periodo: ${data.dataInicial} a ${data.dataFinal}`, 25, yPosition);
    yPosition += 8;
  }
  
  if (data.diasDecorridos) {
    doc.text(`* Dias decorridos: ${data.diasDecorridos} dias (${data.mesesDecorridos} meses)`, 25, yPosition);
    yPosition += 8;
  }
  
  if (data.taxaCorrecaoUsada) {
    doc.text(`* Taxa de correcao: ${(data.taxaCorrecaoUsada * 100).toFixed(2)}% a.a.`, 25, yPosition);
    yPosition += 8;
  }
  
  if (data.taxaJurosUsada) {
    doc.text(`* Taxa de juros: ${(data.taxaJurosUsada * 100).toFixed(2)}% a.m.`, 25, yPosition);
    yPosition += 8;
  }
  
  yPosition += 10;
  
  // Seção: Cálculos Detalhados
  doc.setFontSize(14);
  doc.text('CALCULOS DETALHADOS', 20, yPosition);
  yPosition += 12;
  
  doc.setFontSize(11);
  
  const civilFields = [
    { key: 'valorOriginal', label: 'Valor Principal' },
    { key: 'correcao', label: 'Correcao Monetaria' },
    { key: 'valorAtualizado', label: 'Valor Corrigido' },
    { key: 'juros', label: 'Juros Moratorios' },
    { key: 'total', label: 'VALOR TOTAL' }
  ];
  
  civilFields.forEach(field => {
    if (data[field.key] !== undefined && typeof data[field.key] === 'number') {
      const formattedValue = data[field.key].toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
      doc.text(`* ${field.label}: ${formattedValue}`, 25, yPosition);
      yPosition += 8;
    }
  });
  
  return yPosition + 10;
};

// Função para adicionar dados de cálculo trabalhista
const addLaborDataToPDF = (doc: any, data: any, yPosition: number) => {
  // Seção: Dados de Entrada
  doc.setFontSize(14);
  doc.text('DADOS DE ENTRADA', 20, yPosition);
  yPosition += 12;
  
  doc.setFontSize(11);
  
  if (data.salario) {
    doc.text(`* Salario base: ${data.salario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 25, yPosition);
    yPosition += 8;
  }
  
  if (data.dataInicial && data.dataFinal) {
    doc.text(`* Periodo trabalhado: ${data.dataInicial} a ${data.dataFinal}`, 25, yPosition);
    yPosition += 8;
  }
  
  yPosition += 10;
  
  // Seção: Verbas Calculadas
  doc.setFontSize(14);
  doc.text('VERBAS TRABALHISTAS CALCULADAS', 20, yPosition);
  yPosition += 12;
  
  doc.setFontSize(11);
  
  const laborFields = [
    { key: 'fgts', label: 'FGTS (8%)' },
    { key: 'multaFgts', label: 'Multa FGTS (40%)' },
    { key: 'feriasVencidas', label: 'Ferias Vencidas' },
    { key: 'feriasProporcionais', label: 'Ferias Proporcionais' },
    { key: 'decimoTerceiroProporcional', label: '13° Salario Proporcional' },
    { key: 'horasExtras', label: 'Horas Extras' },
    { key: 'adicionalNoturno', label: 'Adicional Noturno' },
    { key: 'insalubridade', label: 'Insalubridade' },
    { key: 'periculosidade', label: 'Periculosidade' },
    { key: 'totalBruto', label: 'TOTAL BRUTO' },
    { key: 'descontoInss', label: 'Desconto INSS (-)' },
    { key: 'descontoIrrf', label: 'Desconto IRRF (-)' },
    { key: 'totalLiquido', label: 'TOTAL LIQUIDO' }
  ];
  
  laborFields.forEach(field => {
    if (data[field.key] !== undefined && typeof data[field.key] === 'number') {
      const formattedValue = data[field.key].toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
      doc.text(`* ${field.label}: ${formattedValue}`, 25, yPosition);
      yPosition += 8;
    }
  });
  
  return yPosition + 10;
};

// Função para adicionar dados de cálculo penal
const addCriminalDataToPDF = (doc: any, data: any, yPosition: number) => {
  // Seção: Dados de Entrada
  doc.setFontSize(14);
  doc.text('DADOS DE ENTRADA', 20, yPosition);
  yPosition += 12;
  
  doc.setFontSize(11);
  
  if (data.valorOriginal) {
    doc.text(`* Valor da multa/reparacao: ${data.valorOriginal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 25, yPosition);
    yPosition += 8;
  }
  
  if (data.dataInicial && data.dataFinal) {
    doc.text(`* Periodo: ${data.dataInicial} a ${data.dataFinal}`, 25, yPosition);
    yPosition += 8;
  }
  
  yPosition += 10;
  
  // Seção: Cálculos Detalhados
  doc.setFontSize(14);
  doc.text('CALCULOS DETALHADOS', 20, yPosition);
  yPosition += 12;
  
  doc.setFontSize(11);
  
  const criminalFields = [
    { key: 'valorOriginal', label: 'Valor Original' },
    { key: 'correcao', label: 'Correcao Monetaria' },
    { key: 'juros', label: 'Juros Moratorios' },
    { key: 'total', label: 'VALOR TOTAL ATUALIZADO' }
  ];
  
  criminalFields.forEach(field => {
    if (data[field.key] !== undefined && typeof data[field.key] === 'number') {
      const formattedValue = data[field.key].toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
      doc.text(`* ${field.label}: ${formattedValue}`, 25, yPosition);
      yPosition += 8;
    }
  });
  
  return yPosition + 10;
};

// Função fallback para dados genéricos (manter compatibilidade)
const addGenericDataToPDF = (doc: any, data: any, yPosition: number) => {
  // Seção: Dados de Entrada
  doc.setFontSize(14);
  doc.text('DADOS DE ENTRADA', 20, yPosition);
  yPosition += 12;
  
  doc.setFontSize(11);
  
  if (data.valorOriginal) {
    doc.text(`* Valor Principal: ${data.valorOriginal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`, 25, yPosition);
    yPosition += 8;
  }
  
  if (data.dataInicial && data.dataFinal) {
    doc.text(`* Periodo: ${data.dataInicial} a ${data.dataFinal}`, 25, yPosition);
    yPosition += 8;
  }
  
  yPosition += 10;
  
  // Seção: Cálculos Detalhados
  doc.setFontSize(14);
  doc.text('CALCULOS DETALHADOS', 20, yPosition);
  yPosition += 12;
  
  doc.setFontSize(11);
  
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'number' && !['diasDecorridos', 'mesesDecorridos', 'taxaCorrecaoUsada', 'taxaJurosUsada'].includes(key)) {
      const formattedValue = (value as number).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
      
      let displayKey = key;
      switch(key) {
        case 'valorAtualizado': displayKey = 'Valor Corrigido'; break;
        case 'juros': displayKey = 'Juros Moratorios'; break;
        case 'correcao': displayKey = 'Correcao Monetaria'; break;
        case 'total': displayKey = 'VALOR TOTAL'; break;
        case 'valorOriginal': displayKey = 'Valor Principal'; break;
      }
      
      doc.text(`* ${displayKey}: ${formattedValue}`, 25, yPosition);
      yPosition += 8;
    }
  });
  
  yPosition += 10;
  
  // Seção: Fundamentação Legal
  doc.setFontSize(14);
  doc.text('FUNDAMENTACAO LEGAL', 20, yPosition);
  yPosition += 12;
  
  doc.setFontSize(10);
  doc.text('* Lei 14.905/2024 - Estabelece nova sistematica de juros moratorios', 25, yPosition);
  yPosition += 7;
  doc.text('* CPC/2015, Art. 524 - Atualizacao monetaria', 25, yPosition);
  yPosition += 7;
  doc.text('* Tabela TJSP - Indices oficiais de correcao monetaria', 25, yPosition);
  yPosition += 7;
  doc.text('* STJ - Sumulas consolidadas sobre correcao monetaria e juros', 25, yPosition);
  yPosition += 15;
  
  // Observações técnicas
  doc.setFontSize(14);
  doc.text('OBSERVACOES TECNICAS', 20, yPosition);
  yPosition += 12;
  
  doc.setFontSize(10);
  doc.text('* Calculo realizado com base na legislacao vigente', 25, yPosition);
  yPosition += 7;
  doc.text('* Valores sujeitos a verificacao judicial', 25, yPosition);
  yPosition += 7;
  doc.text('* Consulte sempre a legislacao mais recente', 25, yPosition);
  
  return yPosition + 10;
};

export const exportToExcel = (data: any, title: string) => {
  const workbook = XLSX.utils.book_new();
  
  // Preparar dados detalhados para planilha
  const worksheetData = [];
  
  // Cabeçalho com logo
  worksheetData.push(['[C] CALC JUS PRO - Calculadora Juridica Profissional']);
  worksheetData.push([title]);
  worksheetData.push([`Relatorio gerado em: ${new Date().toLocaleDateString('pt-BR')} as ${new Date().toLocaleTimeString('pt-BR')}`]);
  worksheetData.push(['']);
  
  // Seção: Dados de Entrada
  worksheetData.push(['DADOS DE ENTRADA']);
  if (data.valorOriginal) {
    worksheetData.push(['Valor Principal (R$)', data.valorOriginal]);
  }
  if (data.dataInicial && data.dataFinal) {
    worksheetData.push(['Data Inicial', data.dataInicial]);
    worksheetData.push(['Data Final', data.dataFinal]);
  }
  if (data.diasDecorridos) {
    worksheetData.push(['Dias Decorridos', data.diasDecorridos]);
    worksheetData.push(['Meses Decorridos', data.mesesDecorridos]);
  }
  if (data.taxaCorrecaoUsada) {
    worksheetData.push(['Taxa de Correcao (%a.a.)', (data.taxaCorrecaoUsada * 100).toFixed(2)]);
  }
  if (data.taxaJurosUsada) {
    worksheetData.push(['Taxa de Juros (%a.m.)', (data.taxaJurosUsada * 100).toFixed(2)]);
  }
  worksheetData.push(['']);
  
  // Seção: Resultados Detalhados
  worksheetData.push(['CALCULOS DETALHADOS']);
  worksheetData.push(['Item', 'Valor (R$)']);
  
  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === 'number' && !['diasDecorridos', 'mesesDecorridos', 'taxaCorrecaoUsada', 'taxaJurosUsada'].includes(key)) {
        let displayKey = key;
        switch(key) {
          case 'valorAtualizado': displayKey = 'Valor Corrigido'; break;
          case 'juros': displayKey = 'Juros Moratórios'; break;
          case 'correcao': displayKey = 'Correção Monetária'; break;
          case 'total': displayKey = 'VALOR TOTAL'; break;
          case 'valorOriginal': displayKey = 'Valor Principal'; break;
        }
        worksheetData.push([displayKey, value]);
      }
    });
  }
  
  worksheetData.push(['']);
  
  // Seção: Fundamentação Legal
  worksheetData.push(['FUNDAMENTACAO LEGAL']);
  worksheetData.push(['Lei 14.905/2024', 'Estabelece nova sistematica de juros moratorios']);
  worksheetData.push(['CPC/2015, Art. 524', 'Atualizacao monetaria']);
  worksheetData.push(['Tabela TJSP', 'Indices oficiais de correcao monetaria']);
  worksheetData.push(['STJ', 'Sumulas consolidadas sobre correcao monetaria']);
  worksheetData.push(['']);
  
  // Observações
  worksheetData.push(['OBSERVACOES TECNICAS']);
  worksheetData.push(['Nota 1', 'Calculo realizado com base na legislacao vigente']);
  worksheetData.push(['Nota 2', 'Valores sujeitos a verificacao judicial']);
  worksheetData.push(['Nota 3', 'Consulte sempre a legislacao mais recente']);
  
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
  // Configurar largura das colunas
  worksheet['!cols'] = [
    { width: 35 },
    { width: 25 }
  ];
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Relatório Detalhado');
  
  const fileName = `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};