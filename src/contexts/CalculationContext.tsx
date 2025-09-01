import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CalculationData {
  valorOriginal?: number;
  correcao?: number;
  juros?: number;
  total?: number;
  valorAtualizado?: number;
  dataInicial?: string;
  dataFinal?: string;
  diasDecorridos?: number;
  mesesDecorridos?: number;
  taxaCorrecaoUsada?: number;
  taxaJurosUsada?: number;
  tipoCalculo?: string;
  indice?: string;
  // Dados trabalhistas específicos
  fgts?: number;
  multaFgts?: number;
  feriasVencidas?: number;
  feriasProporcionais?: number;
  decimoTerceiroProporcional?: number;
  salario?: number;
  horasExtras?: number;
  adicionalNoturno?: number;
  insalubridade?: number;
  periculosidade?: number;
  totalBruto?: number;
  totalLiquido?: number;
  descontoInss?: number;
  descontoIrrf?: number;
  calculationType?: 'civil' | 'labor' | 'criminal';
}

interface CalculationContextType {
  calculationData: CalculationData | null;
  setCalculationData: (data: CalculationData | null) => void;
  updateCalculationData: (data: Partial<CalculationData>) => void;
}

const CalculationContext = createContext<CalculationContextType | undefined>(undefined);

export function CalculationProvider({ children }: { children: ReactNode }) {
  const [calculationData, setCalculationData] = useState<CalculationData | null>(null);

  const updateCalculationData = (data: Partial<CalculationData>) => {
    setCalculationData(prev => prev ? { ...prev, ...data } : { ...data });
  };

  return (
    <CalculationContext.Provider value={{
      calculationData,
      setCalculationData,
      updateCalculationData
    }}>
      {children}
    </CalculationContext.Provider>
  );
}

export function useCalculation() {
  const context = useContext(CalculationContext);
  if (context === undefined) {
    throw new Error('useCalculation must be used within a CalculationProvider');
  }
  return context;
}