'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Plus, 
  Edit, 
  Trash2, 
  Calendar,
  DollarSign,
  TrendingUp
} from 'lucide-react';
import { mockGoals as initialGoals } from '@/data/mockData';
import { toast } from 'sonner';

export default function GoalsPage() {
  const [goals, setGoals] = useState(initialGoals);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    deadline: '',
    category: ''
  });

  const handleAddGoal = () => {
    if (!formData.title || !formData.targetAmount || !formData.deadline || !formData.category) {
      toast.error('Please fill in all fields');
      return;
    }

    const newGoal = {
      id: Date.now().toString(),
      title: formData.title,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      deadline: formData.deadline,
      category: formData.category
    };

    setGoals([...goals, newGoal]);
    setFormData({
      title: '',
      targetAmount: '',
      currentAmount: '',
      deadline: '',
      category: ''
    });
    setIsAddModalOpen(false);
    toast.success('Goal added successfully');
  };

  const handleEditGoal = () => {
    if (!formData.title || !formData.targetAmount || !formData.deadline || !formData.category) {
      toast.error('Please fill in all fields');
      return;
    }

    const updatedGoal = {
      ...editingGoal,
      title: formData.title,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      deadline: formData.deadline,
      category: formData.category
    };

    setGoals(goals.map(g => g.id === editingGoal.id ? updatedGoal : g));
    setIsEditModalOpen(false);
    setEditingGoal(null);
    toast.success('Goal updated successfully');
  };

  const handleDeleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
    toast.success('Goal deleted successfully');
  };

  const openEditModal = (goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      deadline: goal.deadline,
      category: goal.category
    });
    setIsEditModalOpen(true);
  };

  const getProgressPercentage = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysRemaining = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Financial Goals</h1>
            <p className="text-gray-400">Set and track your financial objectives</p>
          </div>
          
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 glow-effect">
                <Plus className="w-4 h-4 mr-2" />
                Add Goal
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-morphism border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Add New Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-gray-300">Goal Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Emergency Fund"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category" className="text-gray-300">Category</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Savings, Travel, Technology"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="targetAmount" className="text-gray-300">Target Amount</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.targetAmount}
                    onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="currentAmount" className="text-gray-300">Current Amount</Label>
                  <Input
                    id="currentAmount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.currentAmount}
                    onChange={(e) => setFormData({...formData, currentAmount: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="deadline" className="text-gray-300">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                
                <Button onClick={handleAddGoal} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                  Add Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progressPercentage = getProgressPercentage(goal.currentAmount, goal.targetAmount);
            const daysRemaining = getDaysRemaining(goal.deadline);
            const isOverdue = daysRemaining < 0;
            
            return (
              <Card key={goal.id} className="glass-morphism border-gray-700 hover:glow-effect transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-lg mb-2">{goal.title}</CardTitle>
                      <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                        {goal.category}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditModal(goal)}
                        className="text-gray-400 hover:text-white hover:bg-gray-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-gray-400 hover:text-red-400 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Progress */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 text-sm">Progress</span>
                      <span className="text-green-400 font-semibold">
                        {progressPercentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress 
                      value={progressPercentage} 
                      className="h-2 bg-gray-700"
                    />
                  </div>
                  
                  {/* Amount */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-400 text-sm">Current</p>
                      <p className="text-white font-semibold">${goal.currentAmount.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">Target</p>
                      <p className="text-white font-semibold">${goal.targetAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  {/* Deadline */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm">
                        {new Date(goal.deadline).toLocaleDateString()}
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${
                      isOverdue ? 'text-red-400' : daysRemaining <= 30 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {isOverdue ? 'Overdue' : `${daysRemaining} days left`}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {goals.length === 0 && (
          <Card className="glass-morphism border-gray-700">
            <CardContent className="text-center py-16">
              <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Goals Yet</h3>
              <p className="text-gray-400 mb-6">Set your first financial goal to start tracking your progress</p>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Goal
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>
        )}

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="glass-morphism border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Edit Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-title" className="text-gray-300">Goal Title</Label>
                <Input
                  id="edit-title"
                  placeholder="e.g., Emergency Fund"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-category" className="text-gray-300">Category</Label>
                <Input
                  id="edit-category"
                  placeholder="e.g., Savings, Travel, Technology"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-targetAmount" className="text-gray-300">Target Amount</Label>
                <Input
                  id="edit-targetAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({...formData, targetAmount: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-currentAmount" className="text-gray-300">Current Amount</Label>
                <Input
                  id="edit-currentAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.currentAmount}
                  onChange={(e) => setFormData({...formData, currentAmount: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-deadline" className="text-gray-300">Deadline</Label>
                <Input
                  id="edit-deadline"
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              
              <Button onClick={handleEditGoal} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                Update Goal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}