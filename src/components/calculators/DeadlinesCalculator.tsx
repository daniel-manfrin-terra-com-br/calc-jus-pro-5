import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Calculator, Calendar, AlertCircle, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
export function DeadlinesCalculator() {
  const [formData, setFormData] = useState({
    dataInicial: "",
    prazo: "",
    tipoPrazo: "dias",
    tipoProcesso: "civel",
    incluirFeriados: "nao"
  });
  const [resultado, setResultado] = useState<{
    dataFinal: string;
    diasUteis: number;
    diasCorridos: number;
    feriados: number;
    observacoes: string[];
  } | null>(null);
  const calcular = () => {
    const dataInicio = new Date(formData.dataInicial);
    const prazoNum = parseInt(formData.prazo);
    if (!formData.dataInicial || !formData.prazo) return;

    // Feriados nacionais dinâmicos por ano
    const ano = dataInicio.getFullYear();
    const feriadosNacionais = [new Date(ano, 0, 1),
    // Ano Novo
    new Date(ano, 3, 21),
    // Tiradentes
    new Date(ano, 4, 1),
    // Dia do Trabalhador
    new Date(ano, 8, 7),
    // Independência
    new Date(ano, 9, 12),
    // Nossa Senhora Aparecida
    new Date(ano, 10, 2),
    // Finados
    new Date(ano, 10, 15),
    // Proclamação da República
    new Date(ano, 11, 25) // Natal
    // Adicionar feriados móveis se necessário (Carnaval, Sexta-feira Santa, etc.)
    ];
    let dataAtual = new Date(dataInicio);
    let diasUteis = 0;
    let diasCorridos = 0;
    let feriadosEncontrados = 0;
    let dataFinal = new Date(dataInicio);
    if (formData.incluirFeriados === "sim") {
      // Dias corridos - apenas adiciona o prazo
      if (formData.tipoPrazo === "dias") {
        dataFinal.setDate(dataFinal.getDate() + prazoNum);
      } else if (formData.tipoPrazo === "meses") {
        dataFinal.setMonth(dataFinal.getMonth() + prazoNum);
      }
      diasCorridos = prazoNum;
    } else {
      // Dias úteis - conta apenas dias úteis (segunda a sexta, excluindo feriados)
      let prazoRestante = prazoNum;
      while (prazoRestante > 0) {
        dataAtual.setDate(dataAtual.getDate() + 1);
        diasCorridos++;
        const diaSemana = dataAtual.getDay(); // 0 = domingo, 6 = sábado
        const ehFeriado = feriadosNacionais.some(feriado => feriado.getDate() === dataAtual.getDate() && feriado.getMonth() === dataAtual.getMonth());

        // Verifica se é dia útil (segunda a sexta) e não é feriado
        if (diaSemana >= 1 && diaSemana <= 5 && !ehFeriado) {
          diasUteis++;
          prazoRestante--;
        } else if (ehFeriado) {
          feriadosEncontrados++;
        }
      }
      dataFinal = new Date(dataAtual);
    }

    // Ajustes específicos por tipo de processo
    const observacoes = [];
    if (formData.tipoProcesso === "trabalhista") {
      observacoes.push("Não há suspensão de prazos na Justiça do Trabalho");
      observacoes.push("CLT e Instrução Normativa nº 39 do TST");
    } else if (formData.tipoProcesso === "civel") {
      observacoes.push("Suspensão durante recesso forense (20/dez a 06/jan)");
      observacoes.push("CPC/2015 - Arts. 212 a 222");
    } else if (formData.tipoProcesso === "penal") {
      observacoes.push("Suspensão durante recesso forense");
      observacoes.push("CPP - Arts. 798 a 803");
    }
    if (formData.incluirFeriados === "nao") {
      observacoes.push("Cálculo em dias úteis (seg-sex, exceto feriados)");
    } else {
      observacoes.push("Cálculo em dias corridos (inclui feriados e fins de semana)");
    }
    setResultado({
      dataFinal: dataFinal.toLocaleDateString("pt-BR"),
      diasUteis: formData.incluirFeriados === "sim" ? diasCorridos : diasUteis,
      diasCorridos,
      feriados: feriadosEncontrados,
      observacoes
    });
  };
  return <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-primary rounded-xl">
            <Clock className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Prazos Processuais</h1>
            <p className="text-muted-foreground">Contagem de prazos úteis e feriados oficiais</p>
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
              <Calendar className="h-5 w-5 text-primary" />
              Dados do Prazo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="dataInicial" className="text-sm font-medium">
                Data Inicial (intimação/citação)
              </Label>
              <Input id="dataInicial" type="date" value={formData.dataInicial} onChange={e => setFormData({
              ...formData,
              dataInicial: e.target.value
            })} className="mt-1" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prazo" className="text-sm font-medium">
                  Prazo
                </Label>
                <Input id="prazo" type="number" placeholder="15" value={formData.prazo} onChange={e => setFormData({
                ...formData,
                prazo: e.target.value
              })} className="mt-1" />
              </div>
              <div>
                <Label className="text-sm font-medium">Tipo</Label>
                <Select value={formData.tipoPrazo} onValueChange={value => setFormData({
                ...formData,
                tipoPrazo: value
              })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dias">Dias</SelectItem>
                    <SelectItem value="meses">Meses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Tipo de Processo</Label>
              <Select value={formData.tipoProcesso} onValueChange={value => setFormData({
              ...formData,
              tipoProcesso: value
            })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="civel">Cível</SelectItem>
                  <SelectItem value="trabalhista">Trabalhista</SelectItem>
                  <SelectItem value="penal">Penal</SelectItem>
                  <SelectItem value="tributario">Tributário</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Incluir Feriados</Label>
              <Select value={formData.incluirFeriados} onValueChange={value => setFormData({
              ...formData,
              incluirFeriados: value
            })}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nao">Não (apenas dias úteis)</SelectItem>
                  <SelectItem value="sim">Sim (dias corridos)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={calcular} className="w-full" variant="default">
              <Calculator className="mr-2 h-4 w-4" />
              Calcular Prazo Final
            </Button>
          </CardContent>
        </Card>

        {/* Resultado */}
        <Card className="bg-background shadow-medium border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5 text-primary" />
              Resultado do Cálculo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {resultado ? <div className="space-y-4">
                <div className="p-6 bg-gradient-primary rounded-xl text-center">
                  <p className="text-sm text-primary-foreground/80 mb-2">Data Final do Prazo</p>
                  <p className="text-3xl font-bold text-primary-foreground">
                    {resultado.dataFinal}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-primary-light rounded-lg">
                    <p className="text-sm text-slate-950">Dias Úteis</p>
                    <p className="text-xl font-bold text-green-500">
                      {resultado.diasUteis} dias
                    </p>
                  </div>
                  <div className="p-4 bg-primary-light rounded-lg">
                    <p className="text-sm text-slate-950">Dias Corridos</p>
                    <p className="text-xl font-bold text-green-500">
                      {resultado.diasCorridos} dias
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-accent/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Feriados no Período</p>
                  <p className="text-xl font-bold text-accent-foreground">
                    {resultado.feriados} dias
                  </p>
                </div>

                <div className="p-4 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-secondary-foreground" />
                    <p className="text-sm font-medium text-secondary-foreground">Observações Importantes:</p>
                  </div>
                  <div className="space-y-1">
                    {resultado.observacoes.map((obs, index) => <p key={index} className="text-xs text-muted-foreground">• {obs}</p>)}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">CPC/2015</Badge>
                  <Badge variant="secondary">Calendário Oficial</Badge>
                  <Badge variant="secondary">Recesso Forense</Badge>
                </div>
              </div> : <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Preencha os dados ao lado para calcular o prazo</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Cálculo baseado no CPC/2015 e calendário oficial do Poder Judiciário
                </p>
              </div>}
          </CardContent>
        </Card>
      </div>
    </div>;
}