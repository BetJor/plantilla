
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, Download, Filter, Calendar } from 'lucide-react';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('last-month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Dades d'exemple per als gràfics
  const barData = [
    { name: 'Gen', value: 65 },
    { name: 'Feb', value: 59 },
    { name: 'Mar', value: 80 },
    { name: 'Abr', value: 81 },
    { name: 'Mai', value: 56 },
    { name: 'Jun', value: 55 },
  ];

  const pieData = [
    { name: 'Categoria A', value: 400, color: '#0088FE' },
    { name: 'Categoria B', value: 300, color: '#00C49F' },
    { name: 'Categoria C', value: 300, color: '#FFBB28' },
    { name: 'Categoria D', value: 200, color: '#FF8042' },
  ];

  const handleExportReport = () => {
    console.log('Exportant informe...');
    // Aquí aniria la lògica d'exportació
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Informes</h1>
          <p className="text-muted-foreground">
            Genera i visualitza informes del sistema
          </p>
        </div>
        <Button onClick={handleExportReport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Exportar Informe
        </Button>
      </div>

      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres
          </CardTitle>
          <CardDescription>
            Personalitza els paràmetres de l'informe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="period">Període</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona període" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-week">Última setmana</SelectItem>
                  <SelectItem value="last-month">Últim mes</SelectItem>
                  <SelectItem value="last-quarter">Últim trimestre</SelectItem>
                  <SelectItem value="last-year">Últim any</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Totes les categories</SelectItem>
                  <SelectItem value="category-a">Categoria A</SelectItem>
                  <SelectItem value="category-b">Categoria B</SelectItem>
                  <SelectItem value="category-c">Categoria C</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-from">Data d'inici</Label>
              <Input type="date" id="date-from" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-to">Data de fi</Label>
              <Input type="date" id="date-to" />
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button variant="default">Aplicar Filtres</Button>
            <Button variant="outline">Netejar</Button>
          </div>
        </CardContent>
      </Card>

      {/* Targetes de resum */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Elements</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="secondary" className="mr-2">+12%</Badge>
              respecte al període anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processats</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">987</div>
            <p className="text-xs text-muted-foreground">
              <Badge variant="secondary" className="mr-2">+8%</Badge>
              respecte al període anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-red-600">
              <Badge variant="destructive" className="mr-2">-3%</Badge>
              respecte al període anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa d'Eficàcia</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">79.9%</div>
            <p className="text-xs text-green-600">
              <Badge variant="secondary" className="mr-2">+2.1%</Badge>
              respecte al període anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gràfics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Evolució Mensual</CardTitle>
            <CardDescription>
              Progressió dels elements al llarg del temps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribució per Categories</CardTitle>
            <CardDescription>
              Percentatge d'elements per categoria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
