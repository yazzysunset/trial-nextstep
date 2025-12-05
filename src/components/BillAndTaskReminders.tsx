import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select";
import {
  Plus,
  Bell,
  Clock,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Edit2
} from "./icons";

interface Reminder {
  id: string;
  type: 'bill' | 'task';
  title: string;
  description: string;
  dueDate: string;
  dueTime?: string;
  amount?: number;
  category?: string;
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  notificationSent: boolean;
  createdAt: string;
  recurrence?: 'none' | 'daily' | 'weekly' | 'monthly';
}

interface BillAndTaskRemindersProps {
  reminders: Reminder[];
  setReminders: React.Dispatch<React.SetStateAction<Reminder[]>>;
}

export function BillAndTaskReminders({ reminders, setReminders }: BillAndTaskRemindersProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'bills' | 'tasks'>('all');
  const [showNotifications, setShowNotifications] = useState(true);
  const [formData, setFormData] = useState({
    type: 'task' as 'bill' | 'task',
    title: '',
    description: '',
    dueDate: '',
    dueTime: '09:00',
    amount: '',
    category: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    recurrence: 'none' as 'none' | 'daily' | 'weekly' | 'monthly'
  });

  // Check and send notifications for overdue/upcoming reminders
  useEffect(() => {
    const checkAndNotify = () => {
      const now = new Date();
      
      reminders.forEach(reminder => {
        if (reminder.isCompleted || reminder.notificationSent) return;

        const dueDateTime = new Date(reminder.dueDate);
        if (reminder.dueTime) {
          const [hours, minutes] = reminder.dueTime.split(':');
          dueDateTime.setHours(parseInt(hours), parseInt(minutes));
        }

        const hoursUntilDue = (dueDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

        // Send notification if due within 24 hours
        if (hoursUntilDue <= 24 && hoursUntilDue > 0) {
          if (showNotifications && 'Notification' in window) {
            new Notification(`Reminder: ${reminder.title}`, {
              body: `Due in ${Math.round(hoursUntilDue)} hours ${reminder.type === 'bill' && reminder.amount ? `- ₱${reminder.amount}` : ''}`,
              icon: '/icon.svg'
            });
          }

          // Mark notification as sent
          setReminders(prev => prev.map(r => 
            r.id === reminder.id ? { ...r, notificationSent: true } : r
          ));
        }
      });
    };

    const interval = setInterval(checkAndNotify, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [reminders, showNotifications, setReminders]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.dueDate) {
      return;
    }

    const newReminder: Reminder = {
      id: editingReminder?.id || Date.now().toString(),
      type: formData.type,
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      dueTime: formData.dueTime,
      amount: formData.type === 'bill' && formData.amount ? parseFloat(formData.amount) : undefined,
      category: formData.type === 'bill' ? formData.category : undefined,
      priority: formData.priority,
      isCompleted: editingReminder?.isCompleted || false,
      notificationSent: editingReminder?.notificationSent || false,
      createdAt: editingReminder?.createdAt || new Date().toISOString(),
      recurrence: formData.recurrence
    };

    if (editingReminder) {
      setReminders(prev => prev.map(r => r.id === editingReminder.id ? newReminder : r));
    } else {
      setReminders(prev => [...prev, newReminder]);
    }

    setFormData({
      type: 'task',
      title: '',
      description: '',
      dueDate: '',
      dueTime: '09:00',
      amount: '',
      category: '',
      priority: 'medium',
      recurrence: 'none'
    });
    setEditingReminder(null);
    setIsAddDialogOpen(false);
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setFormData({
      type: reminder.type,
      title: reminder.title,
      description: reminder.description,
      dueDate: reminder.dueDate,
      dueTime: reminder.dueTime || '09:00',
      amount: reminder.amount?.toString() || '',
      category: reminder.category || '',
      priority: reminder.priority,
      recurrence: reminder.recurrence || 'none'
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const handleToggleComplete = (id: string) => {
    setReminders(prev => prev.map(r =>
      r.id === id ? { ...r, isCompleted: !r.isCompleted } : r
    ));
  };

  // Filter reminders
  const getFilteredReminders = () => {
    let filtered = reminders.filter(r => !r.isCompleted);

    if (activeTab === 'bills') {
      filtered = filtered.filter(r => r.type === 'bill');
    } else if (activeTab === 'tasks') {
      filtered = filtered.filter(r => r.type === 'task');
    }

    return filtered.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  };

  const getUpcomingReminders = () => {
    const now = new Date();
    const upcoming = reminders.filter(r => {
      const dueDate = new Date(r.dueDate);
      return dueDate > now && !r.isCompleted;
    });
    return upcoming.slice(0, 5);
  };

  const getDaysUntilDue = (dueDate: string): number => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getBadgeColor = (priority: string, daysUntil: number) => {
    if (daysUntil < 0) return 'bg-red-100 text-red-800';
    if (daysUntil === 0) return 'bg-orange-100 text-orange-800';
    if (priority === 'high') return 'bg-red-100 text-red-800';
    if (priority === 'medium') return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800';
  };

  const filteredReminders = getFilteredReminders();
  const upcomingReminders = getUpcomingReminders();
  const completedCount = reminders.filter(r => r.isCompleted).length;
  const totalBills = reminders.filter(r => r.type === 'bill').length;
  const totalTasks = reminders.filter(r => r.type === 'task').length;
  const totalBillAmount = reminders
    .filter(r => r.type === 'bill' && !r.isCompleted)
    .reduce((sum, r) => sum + (r.amount || 0), 0);

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl">Bill & Task Reminders</h1>
          <p className="text-muted-foreground">Stay on top of your bills and daily priorities</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingReminder ? 'Edit Reminder' : 'Add New Reminder'}
              </DialogTitle>
              <DialogDescription>
                Set up a {editingReminder ? 'reminder' : 'bill or task reminder'} with automatic notifications
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'bill' | 'task') =>
                    setFormData(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="task">Task</SelectItem>
                    <SelectItem value="bill">Bill</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Pay electricity bill"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Add details"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={formData.dueTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueTime: e.target.value }))}
                  />
                </div>
              </div>

              {formData.type === 'bill' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Amount (₱)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Utilities">Utilities</SelectItem>
                        <SelectItem value="Rent">Rent</SelectItem>
                        <SelectItem value="Insurance">Insurance</SelectItem>
                        <SelectItem value="Internet">Internet</SelectItem>
                        <SelectItem value="Phone">Phone</SelectItem>
                        <SelectItem value="Subscription">Subscription</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: 'low' | 'medium' | 'high') =>
                      setFormData(prev => ({ ...prev, priority: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Recurrence</Label>
                  <Select
                    value={formData.recurrence}
                    onValueChange={(value: 'none' | 'daily' | 'weekly' | 'monthly') =>
                      setFormData(prev => ({ ...prev, recurrence: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingReminder ? 'Update' : 'Add'} Reminder
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setEditingReminder(null);
                    setFormData({
                      type: 'task',
                      title: '',
                      description: '',
                      dueDate: '',
                      dueTime: '09:00',
                      amount: '',
                      category: '',
                      priority: 'medium',
                      recurrence: 'none'
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Active Reminders</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{filteredReminders.length}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Bills Due</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-orange-600">₱{totalBillAmount.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{totalTasks - reminders.filter(r => r.type === 'task' && r.isCompleted).length}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">{completedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {['all', 'bills', 'tasks'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
              activeTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filteredReminders.length > 0 ? (
          filteredReminders.map(reminder => {
            const daysUntil = getDaysUntilDue(reminder.dueDate);
            const isOverdue = daysUntil < 0;
            const isDueToday = daysUntil === 0;

            return (
              <Card key={reminder.id} className="border-0 shadow-sm hover:shadow-md transition">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleComplete(reminder.id)}
                          className="p-0 h-6 w-6"
                        >
                          <CheckCircle2 className={`h-5 w-5 ${reminder.isCompleted ? 'text-green-600' : 'text-muted-foreground'}`} />
                        </Button>
                        <h3 className={`font-semibold ${reminder.isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                          {reminder.title}
                        </h3>
                        <Badge className={getBadgeColor(reminder.priority, daysUntil)}>
                          {reminder.type === 'bill' ? 'Bill' : 'Task'}
                        </Badge>
                      </div>

                      {reminder.description && (
                        <p className="text-sm text-muted-foreground mb-2">{reminder.description}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(reminder.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          {reminder.dueTime && ` at ${reminder.dueTime}`}
                        </span>

                        {isOverdue && (
                          <Badge variant="destructive">Overdue by {Math.abs(daysUntil)} days</Badge>
                        )}
                        {isDueToday && (
                          <Badge className="bg-orange-100 text-orange-800">Due Today</Badge>
                        )}
                        {!isOverdue && !isDueToday && daysUntil > 0 && (
                          <span className="text-muted-foreground">Due in {daysUntil} days</span>
                        )}

                        {reminder.type === 'bill' && reminder.amount && (
                          <span className="font-semibold text-orange-600">₱{reminder.amount.toFixed(2)}</span>
                        )}

                        {reminder.recurrence && reminder.recurrence !== 'none' && (
                          <Badge variant="outline">{reminder.recurrence}</Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(reminder)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(reminder.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8">
              <p className="text-center text-muted-foreground">No reminders found. Add one to get started!</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upcoming Preview */}
      {upcomingReminders.length > 0 && (
        <Card className="border-0 shadow-sm bg-blue-50">
          <CardHeader>
            <CardTitle>Upcoming Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingReminders.map(reminder => (
                <div key={reminder.id} className="flex items-center justify-between p-2 bg-white rounded">
                  <div>
                    <p className="font-medium text-sm">{reminder.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(reminder.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  {reminder.type === 'bill' && reminder.amount && (
                    <span className="font-semibold text-orange-600">₱{reminder.amount.toFixed(2)}</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
