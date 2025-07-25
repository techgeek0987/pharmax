import { useState, useMemo } from 'react'
import { type Task } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { IconPlus, IconSearch, IconClipboardList, IconCalendar } from '@tabler/icons-react'

// Dummy data
const dummyTasks = [
  {
    _id: '1',
    title: 'Update inventory system',
    description: 'Implement new inventory tracking features and update the database schema',
    status: 'in-progress' as const,
    priority: 'high' as const,
    project: 'PharmX Inventory',
    tags: ['backend', 'database', 'urgent'],
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    assignedTo: 'John Smith',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'Process new orders',
    description: 'Review and process all pending orders from the last 24 hours',
    status: 'todo' as const,
    priority: 'urgent' as const,
    project: 'Order Management',
    tags: ['orders', 'processing', 'daily'],
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    assignedTo: 'Sarah Johnson',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '3',
    title: 'Quality control check',
    description: 'Perform quality control checks on all outgoing shipments',
    status: 'completed' as const,
    priority: 'medium' as const,
    project: 'Quality Assurance',
    tags: ['quality', 'shipment', 'routine'],
    dueDate: new Date(Date.now() - 86400000).toISOString(),
    assignedTo: 'Mike Wilson',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '4',
    title: 'Prepare shipment documentation',
    description: 'Generate and prepare all necessary documentation for international shipments',
    status: 'review' as const,
    priority: 'medium' as const,
    project: 'Shipping & Logistics',
    tags: ['documentation', 'international', 'compliance'],
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    assignedTo: 'Emily Davis',
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '5',
    title: 'Coordinate with suppliers',
    description: 'Schedule meetings with key suppliers to discuss upcoming orders and pricing',
    status: 'in-progress' as const,
    priority: 'low' as const,
    project: 'Supplier Relations',
    tags: ['suppliers', 'meetings', 'procurement'],
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    assignedTo: 'David Brown',
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '6',
    title: 'Review safety protocols',
    description: 'Annual review of all safety protocols and update documentation as needed',
    status: 'todo' as const,
    priority: 'high' as const,
    project: 'Safety & Compliance',
    tags: ['safety', 'protocols', 'annual'],
    dueDate: new Date(Date.now() + 86400000 * 14).toISOString(),
    assignedTo: 'Lisa Anderson',
    createdAt: new Date(Date.now() - 518400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '7',
    title: 'Train new staff members',
    description: 'Conduct orientation and training sessions for newly hired staff',
    status: 'cancelled' as const,
    priority: 'medium' as const,
    project: 'Human Resources',
    tags: ['training', 'onboarding', 'hr'],
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    assignedTo: null,
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export function Tasks() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  // Filter tasks based on search and filters
  const filteredTasks = useMemo(() => {
    return dummyTasks.filter(task => {
      const matchesSearch = searchTerm === '' || 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.project?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter
      const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter
      
      return matchesSearch && matchesStatus && matchesPriority
    })
  }, [searchTerm, statusFilter, priorityFilter])

  const tasks = filteredTasks

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default'
      case 'in-progress':
        return 'secondary'
      case 'review':
        return 'outline'
      case 'todo':
        return 'destructive'
      case 'cancelled':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive'
      case 'high':
        return 'secondary'
      case 'medium':
        return 'outline'
      case 'low':
        return 'outline'
      default:
        return 'outline'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tasks</h1>
        <Button>
          <IconPlus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="review">Review</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tasks List */}
      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task._id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {task.description}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                  <Badge variant={getStatusColor(task.status)}>
                    {task.status.replace('-', ' ')}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Project</div>
                  <div className="text-sm">{task.project || 'No project assigned'}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Due Date</div>
                  <div className="text-sm flex items-center">
                    <IconCalendar className="mr-1 h-4 w-4" />
                    {task.dueDate 
                      ? new Date(task.dueDate).toLocaleDateString()
                      : 'No due date'
                    }
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Assigned To</div>
                  <div className="text-sm">{task.assignedTo || 'Unassigned'}</div>
                </div>
              </div>

              {task.tags && task.tags.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm font-medium text-muted-foreground mb-2">Tags</div>
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(task.createdAt).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tasks.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <IconClipboardList className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No tasks found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}