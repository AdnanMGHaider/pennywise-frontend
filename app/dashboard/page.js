'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { mockTransactions, mockMonthlyData, aiAdviceTemplates } from '@/data/mockData';
import { Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

export default function DashboardPage() {
  const [aiAdvice, setAiAdvice] = useState('');
  const [isGeneratingAdvice, setIsGeneratingAdvice] = useState(false);

  // Calculate metrics from mock data
  const totalIncome = mockTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = Math.abs(mockTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0));
  
  const netWorth = totalIncome - totalExpenses;
  const savingsRate = ((totalIncome - totalExpenses) / totalIncome * 100);

  // Expense breakdown data
  const expenseCategories = {};
  mockTransactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      expenseCategories[t.category] = (expenseCategories[t.category] || 0) + Math.abs(t.amount);
    });

  const doughnutData = {
    labels: Object.keys(expenseCategories),
    datasets: [
      {
        data: Object.values(expenseCategories),
        backgroundColor: [
          '#00ff88',
          '#8b5cf6',
          '#3b82f6',
          '#f59e0b',
          '#ef4444',
          '#10b981',
          '#f97316',
          '#8b5cf6',
        ],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#ffffff',
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: '#1f1f1f',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#00ff88',
        borderWidth: 1,
      },
    },
    maintainAspectRatio: false,
  };

  const lineData = {
    labels: mockMonthlyData.map(d => d.month),
    datasets: [
      {
        label: 'Income',
        data: mockMonthlyData.map(d => d.income),
        borderColor: '#00ff88',
        backgroundColor: 'rgba(0, 255, 136, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: mockMonthlyData.map(d => d.expenses),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const lineOptions = {
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
        },
      },
      tooltip: {
        backgroundColor: '#1f1f1f',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#00ff88',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#ffffff',
        },
        grid: {
          color: '#374151',
        },
      },
      y: {
        ticks: {
          color: '#ffffff',
        },
        grid: {
          color: '#374151',
        },
      },
    },
    maintainAspectRatio: false,
  };

  const generateAIAdvice = () => {
    setIsGeneratingAdvice(true);
    setTimeout(() => {
      const randomAdvice = aiAdviceTemplates[Math.floor(Math.random() * aiAdviceTemplates.length)];
      setAiAdvice(randomAdvice);
      setIsGeneratingAdvice(false);
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Welcome back! Here's your financial overview.</p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-morphism border-gray-700 hover:glow-effect transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Net Worth</p>
                  <p className="text-2xl font-bold text-white">${netWorth.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-sm text-green-400">+12.5%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-gray-700 hover:glow-effect transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Monthly Income</p>
                  <p className="text-2xl font-bold text-white">${totalIncome.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-sm text-green-400">+8.2%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-gray-700 hover:glow-effect transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Monthly Expenses</p>
                  <p className="text-2xl font-bold text-white">${totalExpenses.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <ArrowDownRight className="w-4 h-4 text-red-400 mr-1" />
                    <span className="text-sm text-red-400">-3.1%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-morphism border-gray-700 hover:glow-effect transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Savings Rate</p>
                  <p className="text-2xl font-bold text-white">{savingsRate.toFixed(1)}%</p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-sm text-green-400">+2.3%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                  <PiggyBank className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expense Breakdown */}
          <Card className="glass-morphism border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Expense Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="chart-container">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </CardContent>
          </Card>

          {/* Spending Trends */}
          <Card className="glass-morphism border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Spending Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="chart-container">
                <Line data={lineData} options={lineOptions} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Advice Panel */}
        <Card className="glass-morphism border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <CardTitle className="text-white">AI Financial Advice</CardTitle>
              </div>
              <Button
                onClick={generateAIAdvice}
                disabled={isGeneratingAdvice}
                className="bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700"
              >
                {isGeneratingAdvice ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  'Generate Advice'
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {aiAdvice ? (
              <div className="p-4 bg-gradient-to-r from-purple-500/10 to-violet-600/10 rounded-lg border border-purple-500/20">
                <p className="text-gray-200">{aiAdvice}</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <Zap className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-4">Click "Generate Advice" to get personalized financial recommendations using AI.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}