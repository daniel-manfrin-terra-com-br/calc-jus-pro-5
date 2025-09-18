import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Scale, Users, Clock, FileText, TrendingUp, BookOpen, Gavel } from "lucide-react";
import { Link } from "react-router-dom";
export default function Dashboard() {
  const modules = [{
    title: "Cálculos Cíveis",
    description: "Atualizações monetárias, juros e correções conforme CPC/2015",
    icon: Scale,
    href: "/civel",
    color: "bg-primary",
    features: ["Tabela TJSP", "Lei 14.905/24", "Cálculo extenso"]
  }, {
    title: "Cálculos Trabalhistas",
    description: "FGTS, férias, 13º salário, horas extras e rescisão",
    icon: Users,
    href: "/trabalhista",
    color: "bg-primary",
    features: ["PJeCalc", "TRT5", "Liquidação"]
  }, {
    title: "Cálculos Penais",
    description: "Multas, penas e correções no âmbito penal",
    icon: FileText,
    href: "/penal",
    color: "bg-primary",
    features: ["Em desenvolvimento", "Breve", ""]
  }, {
    title: "Prazos Processuais",
    description: "Contagem de prazos úteis e feriados oficiais",
    icon: Clock,
    href: "/prazos",
    color: "bg-primary",
    features: ["CPC automático", "Feriados", "Intervalos"]
  }];
  const stats = [{
    title: "Cálculos realizados",
    value: "1.247",
    change: "+12%",
    icon: Calculator
  }, {
    title: "Relatórios gerados",
    value: "834",
    change: "+8%",
    icon: FileText
  }, {
    title: "Precisão dos cálculos",
    value: "99.9%",
    change: "0%",
    icon: TrendingUp
  }, {
    title: "Base legal atualizada",
    value: "2024",
    change: "Atual",
    icon: BookOpen
  }];
  return <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-card rounded-2xl shadow-soft">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-primary rounded-2xl">
            <Gavel className="h-12 w-12 text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Calculadora Jurídica Profissional
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Sistema especializado em cálculos jurídicos com base em tabelas oficiais 
          e parâmetros legais atualizados
        </p>
        <div className="flex justify-center gap-4 mt-8">
          <Button asChild variant="default" size="lg">
            <Link to="/civel">Cálculo Cível</Link>
          </Button>
          <Button variant="default" asChild size="lg">
            <Link to="/trabalhista">Cálculo Trabalhista</Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => <Card key={index} className="bg-background shadow-soft border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-primary font-medium">{stat.change}</p>
                </div>
                <div className="p-3 bg-primary-light rounded-lg">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>)}
      </div>

      {/* Modules Grid */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Módulos Disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module, index) => <Card key={index} className="bg-gradient-card shadow-medium border-0 hover:shadow-strong transition-all duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 ${module.color} rounded-xl`}>
                      <module.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {module.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2 mb-4">
                  {module.features.filter(f => f).map((feature, idx) => <span key={idx} className="px-2 py-1 bg-primary-light text-xs rounded-full text-slate-950">
                      {feature}
                    </span>)}
                </div>
                <Button asChild className="w-full" variant="default">
                  <Link to={module.href}>Acessar Módulo</Link>
                </Button>
              </CardContent>
            </Card>)}
        </div>
      </div>

      {/* Quick Access */}
      <Card className="bg-background shadow-medium border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Base Legal e Referências
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-primary-light rounded-lg">
              <h4 className="font-semibold mb-2 text-green-500">Tabelas TJSP</h4>
              <p className="text-sm text-slate-950">
                Tabelas Práticas de Atualização Monetária do Tribunal de Justiça de São Paulo
              </p>
            </div>
            <div className="p-4 bg-primary-light rounded-lg">
              <h4 className="font-semibold mb-2 text-green-500">Lei 14.905/24</h4>
              <p className="text-sm text-slate-950">
                Nova legislação sobre juros moratórios em débitos judiciais
              </p>
            </div>
            <div className="p-4 bg-primary-light rounded-lg">
              <h4 className="font-semibold mb-2 text-green-500">CPC/2015</h4>
              <p className="text-sm text-slate-950">
                Código de Processo Civil - atualizações monetárias e prazos processuais
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
}