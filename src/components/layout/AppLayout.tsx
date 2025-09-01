import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { exportToPDF, exportToExcel } from "@/utils/exportUtils";
import { useToast } from "@/hooks/use-toast";
import { useCalculation } from "@/contexts/CalculationContext";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { toast } = useToast();
  const { calculationData } = useCalculation();

  const handlePDFExport = () => {
    if (!calculationData) {
      toast({
        title: "Nenhum Cálculo Disponível",
        description: "Realize um cálculo primeiro para gerar o relatório.",
        variant: "destructive"
      });
      return;
    }
    
    let title = "Relatório Detalhado de Cálculo Jurídico";
    if (calculationData.calculationType === 'civil') {
      title = "Relatório Cálculo Cível - Atualização Monetária";
    } else if (calculationData.calculationType === 'labor') {
      title = "Relatório Cálculo Trabalhista - Verbas Rescisórias";
    } else if (calculationData.calculationType === 'criminal') {
      title = "Relatório Cálculo Penal - Multas e Reparações";
    }
    
    exportToPDF(calculationData, title);
    toast({
      title: "PDF Gerado",
      description: "O relatório detalhado em PDF foi baixado com sucesso.",
    });
  };

  const handleExcelExport = () => {
    if (!calculationData) {
      toast({
        title: "Nenhum Cálculo Disponível",
        description: "Realize um cálculo primeiro para gerar a planilha.",
        variant: "destructive"
      });
      return;
    }
    
    let title = "Planilha Detalhada de Cálculo Jurídico";
    if (calculationData.calculationType === 'civil') {
      title = "Planilha Cálculo Cível - Atualização Monetária";
    } else if (calculationData.calculationType === 'labor') {
      title = "Planilha Cálculo Trabalhista - Verbas Rescisórias";
    } else if (calculationData.calculationType === 'criminal') {
      title = "Planilha Cálculo Penal - Multas e Reparações";
    }
    
    exportToExcel(calculationData, title);
    toast({
      title: "Excel Exportado",
      description: "A planilha detalhada foi baixada com sucesso.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col w-full bg-gradient-subtle">
      {/* Header */}
      <header className="h-16 bg-background border-b shadow-soft flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Calculadora Jurídica Profissional</h2>
            <p className="text-sm text-muted-foreground">Sistema especializado em cálculos jurídicos</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="default" 
            size="sm" 
            className="gap-2" 
            onClick={handlePDFExport}
            disabled={!calculationData}
          >
            <FileText className="h-4 w-4" />
            Relatório PDF
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2" 
            onClick={handleExcelExport}
            disabled={!calculationData}
          >
            <Download className="h-4 w-4" />
            Exportar Excel
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}