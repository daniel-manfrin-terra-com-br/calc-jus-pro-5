import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Calculator, DollarSign, Scale, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useCalculation } from "@/contexts/CalculationContext";
export function CriminalCalculator() {
  const {
    updateCalculationData
  } = useCalculation();
  const [formData, setFormData] = useState({
    valor: "",
    dataInicial: "",
    dataFinal: "",
    tipoCalculo: "multa",
    tipoIndice: "selic"
  });
  const [resultado, setResultado] = useState<{
    valorOriginal: number;
    correcao: number;
    juros: number;
    total: number;
  } | null>(null);
  const calcular = () => {
    const valor = parseFloat(formData.valor.replace(",", "."));
    if (!valor || !formData.dataInicial || !formData.dataFinal) return;

    // Cálculo baseado nas datas informadas
    const dataIni = new Date(formData.dataInicial);
    const dataFim = new Date(formData.dataFinal);
    const diasDecorridos = Math.ceil((dataFim.getTime() - dataIni.getTime()) / (1000 * 3600 * 24));
    const mesesDecorridos = Math.ceil(diasDecorridos / 30.44);

    // Taxas baseadas no tipo de índice selecionado
    let taxaCorrecaoAnual = 0.055; // SELIC média
    let taxaJurosMensal = 0.01; // 1% a.m.

    if (formData.tipoIndice === "ipca") {
      taxaCorrecaoAnual = 0.045; // IPCA médio
    } else if (formData.tipoIndice === "tjsp") {
      taxaCorrecaoAnual = 0.048; // Tabela TJSP média
    }

    // Correção monetária composta
    const correcao = valor * (Math.pow(1 + taxaCorrecaoAnual, diasDecorridos / 365) - 1);
    const valorCorrigido = valor + correcao;

    // Juros moratórios sobre valor corrigido
    const juros = valorCorrigido * (taxaJurosMensal * mesesDecorridos);
    const total = valorCorrigido + juros;
    setResultado({
      valorOriginal: valor,
      correcao,
      juros,
      total
    });

    // Atualizar dados no contexto para exportação
    updateCalculationData({
      valorOriginal: valor,
      correcao,
      juros,
      total,
      dataInicial: formData.dataInicial,
      dataFinal: formData.dataFinal,
      tipoCalculo: formData.tipoCalculo,
      indice: formData.tipoIndice,
      calculationType: 'criminal'
    });
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-primary rounded-xl">
            <FileText className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Cálculos Penais</h1>
            <p className="text-muted-foreground">Multas, penas e correções no âmbito penal</p>
          </div>
        </div>
        <Link to="/">
          <Button variant="default" size="sm" className="gap-2">
            <Home className="h-4 w-4" />
            Voltar ao Início
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulário de Entrada */}
        <Card className="bg-gradient-card shadow-medium border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Scale className="h-5 w-5 text-primary" />
              Dados do Cálculo Penal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="valor" className="text-sm font-medium">
                Valor da Multa/Reparação (R$)
              </Label>
              <Input id="valor" type="text" placeholder="5.000,00" value={formData.valor} onChange={e => setFormData({
              ...formData,
              valor: e.target.value
            })} className="mt-1" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dataInicial" className="text-sm font-medium">
                  Data do Fato
                </Label>
                <Input id="dataInicial" type="date" value={formData.dataInicial} onChange={e => setFormData({
                ...formData,
                dataInicial: e.target.value
              })} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="dataFinal" className="text-sm font-medium">
                  Data de Referência
                </Label>
                <Input id="dataFinal" type="date" value={formData.dataFinal} onChange={e => setFormData({
                ...formData,
                dataFinal: e.target.value
              })} className="mt-1" />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Tipo de Cálculo</Label>
              <Select value={formData.tipoCalculo} onValueChange={value => setFormData({
              ...formData,
              tipoCalculo: value
            })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="multa">Multa Penal</SelectItem>
                  <SelectItem value="reparacao">Reparação de Danos</SelectItem>
                  <SelectItem value="pecuniaria">Pena Pecuniária</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Índice de Correção</Label>
              <Select value={formData.tipoIndice} onValueChange={value => setFormData({
              ...formData,
              tipoIndice: value
            })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="selic">Taxa SELIC</SelectItem>
                  <SelectItem value="ipca">IPCA-E</SelectItem>
                  <SelectItem value="tjsp">Tabela TJSP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={calcular} className="w-full" variant="default">
              <Calculator className="mr-2 h-4 w-4" />
              Calcular Atualização Penal
            </Button>
          </CardContent>
        </Card>

        {/* Resultado */}
        <Card className="bg-background shadow-medium border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-primary" />
              Resultado do Cálculo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {resultado ? <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-primary-light rounded-lg">
                    <p className="text-sm text-slate-950">Valor Original</p>
                    <p className="text-xl font-bold text-green-500">
                      R$ {resultado.valorOriginal.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2
                  })}
                    </p>
                  </div>
                  <div className="p-4 bg-primary-light rounded-lg">
                    <p className="text-sm text-slate-950">Correção Monetária</p>
                    <p className="text-xl font-bold text-green-500">
                      R$ {resultado.correcao.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2
                  })}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-accent/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Juros</p>
                  <p className="text-xl font-bold text-accent-foreground">
                    R$ {resultado.juros.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2
                })}
                  </p>
                </div>

                <div className="p-6 bg-gradient-primary rounded-xl text-center">
                  <p className="text-sm text-primary-foreground/80 mb-2">Valor Total Atualizado</p>
                  <p className="text-3xl font-bold text-primary-foreground">
                    R$ {resultado.total.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2
                })}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Código Penal</Badge>
                  <Badge variant="secondary">Lei 9.099/95</Badge>
                  <Badge variant="secondary">Jurisprudência</Badge>
                </div>
              </div> : <div className="text-center py-12">
                <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Preencha os dados ao lado para realizar o cálculo</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Cálculo baseado no Código Penal e legislação vigente
                </p>
              </div>}
          </CardContent>
        </Card>
      </div>
    </div>;
}