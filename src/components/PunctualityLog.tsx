import { useState } from "react";
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
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "./ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { 
  Plus, 
  Clock, 
  Calendar,
  Trash2,
} from "./icons";
import { SimpleLineChart, SimpleBarChart } from "./simple-charts";

interface AttendanceRecord {
  id: string;
  date: string;
  subject: string;
  scheduledTime: string;
  actualTime: string;
  status: 'on-time' | 'late' | 'absent';
  notes?: string;
}

interface PunctualityLogProps {
  attendanceRecords: AttendanceRecord[];
  setAttendanceRecords: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
}

const subjects = [
  'Networking 2 (LAB)',
  'Networking 2 (LEC)',
  'Integrative Programming and Technologies (LAB)',
  'Integrative Programming and Technologies (LEC)',
  'IT Elective 1 - Project Management & Agile Methodologies (LAB)',
  'IT Elective 1 - Project Management & Agile Methodologies (LEC)',
  'IT Research Methods (LAB)',
  'IT Research Methods (LEC)',
  'Event Driven Programming (LAB)',
  'Event Driven Programming (LEC)',
  'Business Analytics (LAB)',
  'Business Analytics (LEC)',
  'IT Elective 2 - Web/Mobile Frontend Development (LAB)',
  'IT Elective 2 - Web/Mobile Frontend Development (LEC)'
];

export function PunctualityLog({ attendanceRecords, setAttendanceRecords }: PunctualityLogProps) {
  const records = attendanceRecords;
  const setRecords = setAttendanceRecords;
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    subject: '',
    scheduledTime: '',
    actualTime: '',
    status: 'on-time' as 'on-time' | 'late' | 'absent',
    notes: ''
  });

  // Calculate statistics
  const totalRecords = records.length;
  const onTimeRecords = records.filter(r => r.status === 'on-time').length;
  const lateRecords = records.filter(r => r.status === 'late').length;
  const absentRecords = records.filter(r => r.status === 'absent').length;
  const punctualityRate = Math.round((onTimeRecords / totalRecords) * 100);

  // Generate weekly trend data
  const weeklyData = records.reduce((acc, record) => {
    const date = new Date(record.date);
    const week = `W${Math.ceil(date.getDate() / 7)}`;
    
    if (!acc[week]) {
      acc[week] = { week, onTime: 0, late: 0, absent: 0, total: 0 };
    }
    
    acc[week].total++;
    if (record.status === 'on-time') acc[week].onTime++;
    else if (record.status === 'late') acc[week].late++;
    else acc[week].absent++;
    
    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(weeklyData).map((week: any) => ({
    week: week.week,
    punctualityRate: Math.round((week.onTime / week.total) * 100)
  }));

  // Subject-wise performance
  const subjectData = subjects.map(subject => {
    const subjectRecords = records.filter(r => r.subject === subject);
    const subjectOnTime = subjectRecords.filter(r => r.status === 'on-time').length;
    return {
      subject,
      punctualityRate: subjectRecords.length > 0 ? Math.round((subjectOnTime / subjectRecords.length) * 100) : 0,
      total: subjectRecords.length
    };
  }).filter(s => s.total > 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on-time':
        return <Badge className="bg-green-100 text-green-800 border-green-200">On Time</Badge>;
      case 'late':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Late</Badge>;
      case 'absent':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Absent</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-time':
        return '✓';
      case 'late':
        return '⏱️';
      case 'absent':
        return '✕';
      default:
        return '-';
    }
  };

  const calculateLateness = (scheduled: string, actual: string) => {
    if (!actual) return null;
    const scheduledTime = new Date(`2024-01-01T${scheduled}`);
    const actualTime = new Date(`2024-01-01T${actual}`);
    const diffMs = actualTime.getTime() - scheduledTime.getTime();
    const diffMins = Math.round(diffMs / (1000 * 60));
    return diffMins;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.date || !formData.subject || !formData.scheduledTime) {
      return;
    }

    if (formData.status !== 'absent' && !formData.actualTime) {
      return;
    }

    const newRecord: AttendanceRecord = {
      id: editingRecord?.id || Date.now().toString(),
      date: formData.date,
      subject: formData.subject,
      scheduledTime: formData.scheduledTime,
      actualTime: formData.status === 'absent' ? '' : formData.actualTime,
      status: formData.status,
      notes: formData.notes
    };

    if (editingRecord) {
      setRecords(prev => prev.map(r => r.id === editingRecord.id ? newRecord : r));
    } else {
      setRecords(prev => [...prev, newRecord]);
    }

    setFormData({
      date: '',
      subject: '',
      scheduledTime: '',
      actualTime: '',
      status: 'on-time',
      notes: ''
    });
    setEditingRecord(null);
    setIsAddDialogOpen(false);
  };

  const handleEdit = (record: AttendanceRecord) => {
    setEditingRecord(record);
    setFormData({
      date: record.date,
      subject: record.subject,
      scheduledTime: record.scheduledTime,
      actualTime: record.actualTime,
      status: record.status,
      notes: record.notes || ''
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl">Punctuality Log</h1>
          <p className="text-muted-foreground">Track your attendance and improve your time management</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Log Attendance
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingRecord ? 'Edit Attendance' : 'Log Attendance'}</DialogTitle>
              <DialogDescription>
                {editingRecord ? 'Update your attendance record' : 'Record your attendance for a class or event'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Subject *</Label>
                  <Select 
                    value={formData.subject} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Scheduled Time *</Label>
                  <Input
                    type="time"
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Status *</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: 'on-time' | 'late' | 'absent') => 
                      setFormData(prev => ({ ...prev, status: value, actualTime: value === 'absent' ? '' : prev.actualTime }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on-time">On Time</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {formData.status !== 'absent' && (
                <div className="space-y-2">
                  <Label>Actual Arrival Time *</Label>
                  <Input
                    type="time"
                    value={formData.actualTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, actualTime: e.target.value }))}
                    required
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label>Notes</Label>
                <Input
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Optional notes (e.g., reason for delay)"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingRecord ? 'Update' : 'Log Attendance'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setEditingRecord(null);
                    setFormData({
                      date: '',
                      subject: '',
                      scheduledTime: '',
                      actualTime: '',
                      status: 'on-time',
                      notes: ''
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Punctuality Rate</CardTitle>
            🎯
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">{punctualityRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {onTimeRecords} of {totalRecords} on time
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">On Time</CardTitle>
            ✓
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">{onTimeRecords}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Late</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-yellow-600">{lateRecords}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Absent</CardTitle>
            ✕
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-red-600">{absentRecords}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Punctuality Trend */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Punctuality Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <SimpleLineChart data={chartData} />
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subject Performance */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Subject-wise Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {subjectData.length > 0 ? (
              <SimpleBarChart data={subjectData.map(s => ({ name: s.subject, value: s.punctualityRate }))} />
            ) : (
              <div className="h-48 flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Improvement Insights */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Improvement Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="text-green-800 mb-2">Strong Performance</h4>
              <p className="text-sm text-green-700">
                Your overall punctuality rate of {punctualityRate}% is excellent! Keep up the great work.
              </p>
            </div>
            
            {lateRecords > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="text-yellow-800 mb-2">Area for Improvement</h4>
                <p className="text-sm text-yellow-700">
                  You've been late {lateRecords} times. Consider setting earlier alarms or planning your route better.
                </p>
              </div>
            )}
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-blue-800 mb-2">Goal Setting</h4>
              <p className="text-sm text-blue-700">
                Aim for 95% punctuality rate. You're {punctualityRate >= 95 ? 'already there!' : `${95 - punctualityRate}% away from your goal.`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Records */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Recent Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 px-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">Date</TableHead>
                  <TableHead className="min-w-[200px]">Subject</TableHead>
                  <TableHead className="hidden sm:table-cell">Scheduled</TableHead>
                  <TableHead className="hidden sm:table-cell">Actual</TableHead>
                  <TableHead className="min-w-[120px]">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Lateness</TableHead>
                  <TableHead className="hidden lg:table-cell">Notes</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.slice().reverse().map((record) => {
                  const lateness = calculateLateness(record.scheduledTime, record.actualTime);
                  return (
                    <TableRow key={record.id}>
                      <TableCell className="whitespace-nowrap">{new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{record.subject}</TableCell>
                      <TableCell className="hidden sm:table-cell whitespace-nowrap">{record.scheduledTime}</TableCell>
                      <TableCell className="hidden sm:table-cell whitespace-nowrap">{record.actualTime || '-'}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{getStatusIcon(record.status)}</span>
                          {getStatusBadge(record.status)}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell whitespace-nowrap">
                        {lateness !== null ? (
                          <span className={lateness > 0 ? 'text-red-600' : lateness < 0 ? 'text-green-600' : ''}>
                            {lateness > 0 ? `+${lateness}` : lateness < 0 ? `${lateness}` : '0'} min
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm text-muted-foreground max-w-[150px] truncate">
                        {record.notes || '-'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              ⋮
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(record)} className="cursor-pointer">
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(record.id)} 
                              className="cursor-pointer text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
