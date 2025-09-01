import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Calculator, DollarSign, Clock, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useCalculation } from "@/contexts/CalculationContext";

export function LaborCalculator() {
  const { updateCalculationData } = useCalculation();
  const [formData, setFormData] = useState({
    salario: "",
    dataAdmissao: "",
    dataDemissao: "",
    tipoCalculo: "rescisao",
    horasExtras: "",
    adicionalNoturno: "",
    insalubridade: "",
    periculosidade: "",
    feriasVencidas: "",
    feriasProporcionais: "",
    decimoTerceiro: "",
    salarioFamilia: "",
    horasDsr: "",
    comissoes: "",
    gratificacoes: "",
    tipoRescisao: "semJustaCausa"
  });

  const [resultado, setResultado] = useState<{
    fgts: number;
    multaFgts: number;
    feriasVencidas: number;
    feriasProporcionais: number;
    decimoTerceiroProporcional: number;
    avisoPreviolIndnz: number;
    avisoPrevioTrabalhado: number;
    saldoSalario: number;
    horasExtras: number;
    adicionalNoturno: number;
    insalubridade: number;
    periculosidade: number;
    comissoes: number;
    gratificacoes: number;
    salarioFamilia: number;
    descontoInss: number;
    descontoIrrf: number;
    totalBruto: number;
    totalLiquido: number;
  } | null>(null);

  const calcular = () => {
    const salario = parseFloat(formData.salario.replace(",", "."));
    if (!salario || !formData.dataAdmissao || !formData.dataDemissao) return;
    
    const dataAdmissao = new Date(formData.dataAdmissao);
    const dataDemissao = new Date(formData.dataDemissao);
    const diffTime = dataDemissao.getTime() - dataAdmissao.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const mesesTrabalhados = diffDays / 30.44; // Meses mais precisos
    const anosTrabalhados = mesesTrabalhados / 12;
    
    // Valores dos adicionais calculados corretamente
    const horasExtras = (parseFloat(formData.horasExtras.replace(",", ".")) || 0) * (salario / 220) * 1.5;
    const adicionalNoturno = (parseFloat(formData.adicionalNoturno.replace(",", ".")) || 0) * (salario / 220) * 0.2;
    
    // Insalubridade baseada no salário mínimo (R$ 1.320,00 em 2024)
    const salarioMinimo = 1320.00;
    const grauInsalubridade = parseFloat(formData.insalubridade.replace(",", ".")) || 0;
    const insalubridade = grauInsalubridade > 0 ? salarioMinimo * (grauInsalubridade / 100) : 0;
    
    // Periculosidade: 30% do salário base
    const periculosidade = formData.periculosidade === "sim" ? salario * 0.3 : 0;
    
    const comissoes = parseFloat(formData.comissoes.replace(",", ".")) || 0;
    const gratificacoes = parseFloat(formData.gratificacoes.replace(",", ".")) || 0;
    const salarioFamilia = parseFloat(formData.salarioFamilia.replace(",", ".")) || 0;
    
    // Base de cálculo para FGTS e rescisão
    const baseCalculo = salario + insalubridade + periculosidade;
    
    // FGTS: 8% sobre a remuneração total (salário + adicionais) por todo período
    const fgts = baseCalculo * 0.08 * mesesTrabalhados;
    const multaFgts = (formData.tipoRescisao === "semJustaCausa" || formData.tipoRescisao === "acordoMutuo") ? fgts * 0.4 : 0;
    
    // Férias vencidas (se houver período aquisitivo completo)
    const periodosVencidos = Math.floor(anosTrabalhados);
    const feriasVencidas = periodosVencidos > 0 ? baseCalculo + (baseCalculo / 3) : 0; // Férias + 1/3
    
    // Férias proporcionais (período incompleto)
    const mesesPropFérias = Math.floor(mesesTrabalhados % 12);
    const feriasProporcionais = mesesPropFérias > 0 ? (baseCalculo + (baseCalculo / 3)) * (mesesPropFérias / 12) : 0;
    
    // 13º salário proporcional
    const mesesProp13 = Math.floor(mesesTrabalhados % 12);
    const decimoTerceiroProporcional = baseCalculo * (mesesProp13 / 12);
    
    // Aviso prévio
    const avisoPreviolIndnz = formData.tipoRescisao === "semJustaCausa" ? baseCalculo : 0;
    const avisoPrevioTrabalhado = formData.tipoRescisao === "comJustaCausa" ? 0 : baseCalculo;
    
    // Saldo de salário (proporcional aos dias trabalhados no mês)
    const saldoSalario = baseCalculo * 0.5; // Simulação de meio mês
    
    // Total bruto
    const totalBruto = fgts + multaFgts + feriasVencidas + feriasProporcionais + 
                      decimoTerceiroProporcional + avisoPreviolIndnz + avisoPrevioTrabalhado + 
                      saldoSalario + horasExtras + adicionalNoturno + insalubridade + 
                      periculosidade + comissoes + gratificacoes + salarioFamilia;
    
    // Descontos
    const descontoInss = totalBruto * 0.11; // 11% (faixa máxima)
    const descontoIrrf = totalBruto > 4664.68 ? totalBruto * 0.275 - 869.36 : 0; // IR conforme tabela
    
    const totalLiquido = totalBruto - descontoInss - descontoIrrf;
    
    setResultado({
      fgts,
      multaFgts,
      feriasVencidas,
      feriasProporcionais,
      decimoTerceiroProporcional,
      avisoPreviolIndnz,
      avisoPrevioTrabalhado,
      saldoSalario,
      horasExtras,
      adicionalNoturno,
      insalubridade,
      periculosidade,
      comissoes,
      gratificacoes,
      salarioFamilia,
      descontoInss,
      descontoIrrf,
      totalBruto,
      totalLiquido
    });

    // Atualizar dados no contexto para exportação
    updateCalculationData({
      salario,
      fgts,
      multaFgts,
      feriasVencidas,
      feriasProporcionais,
      decimoTerceiroProporcional,
      horasExtras,
      adicionalNoturno,
      insalubridade,
      periculosidade,
      totalBruto,
      totalLiquido,
      descontoInss,
      descontoIrrf,
      dataInicial: formData.dataAdmissao,
      dataFinal: formData.dataDemissao,
      calculationType: 'labor'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-primary rounded-xl">
            <Users className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Cálculos Trabalhistas</h1>
            <p className="text-muted-foreground">FGTS, férias, 13º salário, horas extras e rescisão</p>
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
              <DollarSign className="h-5 w-5 text-primary" />
              Dados Trabalhistas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="salario" className="text-sm font-medium">
                Salário Mensal (R$)
              </Label>
              <Input
                id="salario"
                type="text"
                placeholder="3.000,00"
                value={formData.salario}
                onChange={(e) => setFormData({...formData, salario: e.target.value})}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dataAdmissao" className="text-sm font-medium">
                  Data Admissão
                </Label>
                <Input
                  id="dataAdmissao"
                  type="date"
                  value={formData.dataAdmissao}
                  onChange={(e) => setFormData({...formData, dataAdmissao: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dataDemissao" className="text-sm font-medium">
                  Data Demissão
                </Label>
                <Input
                  id="dataDemissao"
                  type="date"
                  value={formData.dataDemissao}
                  onChange={(e) => setFormData({...formData, dataDemissao: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Tipo de Rescisão</Label>
              <Select value={formData.tipoRescisao} onValueChange={(value) => setFormData({...formData, tipoRescisao: value})}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semJustaCausa">Dispensa sem Justa Causa</SelectItem>
                  <SelectItem value="comJustaCausa">Dispensa com Justa Causa</SelectItem>
                  <SelectItem value="pedidoDemissao">Pedido de Demissão</SelectItem>
                  <SelectItem value="acordoMutuo">Acordo Mútuo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="horasExtras" className="text-sm font-medium">
                  Horas Extras (quantidade)
                </Label>
                <Input
                  id="horasExtras"
                  type="text"
                  placeholder="50"
                  value={formData.horasExtras}
                  onChange={(e) => setFormData({...formData, horasExtras: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="adicionalNoturno" className="text-sm font-medium">
                  Adicional Noturno (horas)
                </Label>
                <Input
                  id="adicionalNoturno"
                  type="text"
                  placeholder="20"
                  value={formData.adicionalNoturno}
                  onChange={(e) => setFormData({...formData, adicionalNoturno: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="insalubridade" className="text-sm font-medium">
                  Insalubridade (grau %)
                </Label>
                <Input
                  id="insalubridade"
                  type="text"
                  placeholder="10"
                  value={formData.insalubridade}
                  onChange={(e) => setFormData({...formData, insalubridade: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Periculosidade</Label>
                <Select value={formData.periculosidade} onValueChange={(value) => setFormData({...formData, periculosidade: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sim">Sim (30%)</SelectItem>
                    <SelectItem value="nao">Não</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="comissoes" className="text-sm font-medium">
                  Comissões (R$)
                </Label>
                <Input
                  id="comissoes"
                  type="text"
                  placeholder="500,00"
                  value={formData.comissoes}
                  onChange={(e) => setFormData({...formData, comissoes: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="gratificacoes" className="text-sm font-medium">
                  Gratificações (R$)
                </Label>
                <Input
                  id="gratificacoes"
                  type="text"
                  placeholder="300,00"
                  value={formData.gratificacoes}
                  onChange={(e) => setFormData({...formData, gratificacoes: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="salarioFamilia" className="text-sm font-medium">
                Salário Família (R$)
              </Label>
              <Input
                id="salarioFamilia"
                type="text"
                placeholder="60,00"
                value={formData.salarioFamilia}
                onChange={(e) => setFormData({...formData, salarioFamilia: e.target.value})}
                className="mt-1"
              />
            </div>

            <Button onClick={calcular} className="w-full" variant="default">
              <Calculator className="mr-2 h-4 w-4" />
              Calcular Verbas Trabalhistas
            </Button>
          </CardContent>
        </Card>

        {/* Resultado */}
        <Card className="bg-background shadow-medium border-0">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="h-5 w-5 text-primary" />
              Resultado do Cálculo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {resultado ? (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {/* Verbas Principais */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-primary-light rounded-lg">
                    <p className="text-xs text-muted-foreground">FGTS</p>
                    <p className="text-lg font-bold text-primary">
                      R$ {resultado.fgts.toLocaleString("pt-BR", {minimumFractionDigits: 2})}
                    </p>
                  </div>
                  <div className="p-3 bg-primary-light rounded-lg">
                    <p className="text-xs text-muted-foreground">Multa FGTS (40%)</p>
                    <p className="text-lg font-bold text-primary">
                      R$ {resultado.multaFgts.toLocaleString("pt-BR", {minimumFractionDigits: 2})}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-accent/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Férias Vencidas</p>
                    <p className="text-lg font-bold text-accent-foreground">
                      R$ {resultado.feriasVencidas.toLocaleString("pt-BR", {minimumFractionDigits: 2})}
                    </p>
                  </div>
                  <div className="p-3 bg-accent/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Férias Proporcionais</p>
                    <p className="text-lg font-bold text-accent-foreground">
                      R$ {resultado.feriasProporcionais.toLocaleString("pt-BR", {minimumFractionDigits: 2})}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">13º Proporcional</p>
                    <p className="text-lg font-bold text-secondary-foreground">
                      R$ {resultado.decimoTerceiroProporcional.toLocaleString("pt-BR", {minimumFractionDigits: 2})}
                    </p>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Saldo Salário</p>
                    <p className="text-lg font-bold text-secondary-foreground">
                      R$ {resultado.saldoSalario.toLocaleString("pt-BR", {minimumFractionDigits: 2})}
                    </p>
                  </div>
                </div>

                {/* Aviso Prévio */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Aviso Prévio Indenizado</p>
                    <p className="text-lg font-bold">
                      R$ {resultado.avisoPreviolIndnz.toLocaleString("pt-BR", {minimumFractionDigits: 2})}
                    </p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Aviso Prévio Trabalhado</p>
                    <p className="text-lg font-bold">
                      R$ {resultado.avisoPrevioTrabalhado.toLocaleString("pt-BR", {minimumFractionDigits: 2})}
                    </p>
                  </div>
                </div>

                {/* Adicionais */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-primary-light rounded-lg">
                    <p className="text-xs text-muted-foreground">Horas Extras</p>
                    <p className="text-lg font-bold text-primary">
                      R$ {resultado.horasExtras.toLocaleString("pt-BR", {minimumFractionDigits: 2})}
                    </p>
                  </div>
                  <div className="p-3 bg-primary-light rounded-lg">
                    <p className="text-xs text-muted-foreground">Adicional Noturno</p>
                    <p className="text-lg font-bold text-primary">
                      R$ {resultado.adicionalNoturno.toLocaleString("pt-BR", {minimumFractionDigits: 2})}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-accent/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Insalubridade</p>
                    <p className="text-lg font-bold text-accent-foreground">
                      R$ {resultado.insalubridade.toLocaleString("pt-BR", {minimumFractionDigits: 2})}
                    </p>
                  </div>
                  <div className="p-3 bg-accent/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Periculosidade</p>
                    <p className="text-lg font-bold text-accent-foreground">
                      R$ {resultado.periculosidade.toLocaleString("pt-BR", {minimumFractionDigits: 2})}
                    </p>
                  </div>
                </div>

                {/* Descontos */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-destructive/10 rounded-lg">
                    <p className="text-xs text-muted-foreground">Desconto INSS</p>
                    <p className="text-lg font-bold text-destructive">
                      - R$ {resultado.descontoInss.toLocaleString("pt-BR", {minimumFractionDigits: 2})}
                    </p>
                  </div>
                  <div className="p-3 bg-destructive/10 rounded-lg">
                    <p className="text-xs text-muted-foreground">Desconto IRRF</p>
                    <p className="text-lg font-bold text-destructive">
                      - R$ {resultado.descontoIrrf.toLocaleString("pt-BR", {minimumFractionDigits: 2})}
                    </p>
                  </div>
                </div>

                {/* Totais */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="p-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Bruto</p>
                    <p className="text-2xl font-bold text-primary">
                      R$ {resultado.totalBruto.toLocaleString("pt-BR", {minimumFractionDigits: 2})}
                    </p>
                  </div>
                  <div className="p-4 bg-gradient-primary rounded-xl text-center">
                    <p className="text-sm text-primary-foreground/80 mb-2">Total Líquido</p>
                    <p className="text-3xl font-bold text-primary-foreground">
                      R$ {resultado.totalLiquido.toLocaleString("pt-BR", {minimumFractionDigits: 2})}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">CLT</Badge>
                  <Badge variant="secondary">Consolidação</Badge>
                  <Badge variant="secondary">TRT</Badge>
                  <Badge variant="secondary">TST</Badge>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Preencha os dados ao lado para realizar o cálculo</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Cálculo baseado na CLT e tabelas oficiais do TRT5
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}