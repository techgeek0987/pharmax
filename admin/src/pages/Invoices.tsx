import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { invoicesApi, type Invoice } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { IconPlus, IconSearch, IconFileInvoice, IconCalendar, IconUser } from '@tabler/icons-react'

export function Invoices() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all')

  const { data: invoicesData, isLoading } = useQuery({
    queryKey: ['invoices', searchTerm, statusFilter, paymentStatusFilter],
    queryFn: () => invoicesApi.getAll({
      search: searchTerm || undefined,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      paymentStatus: paymentStatusFilter !== 'all' ? paymentStatusFilter : undefined,
      limit: 50,
      sort: '-createdAt'
    }),
  })

  const invoices = invoicesData?.data.data || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default'
      case 'sent':
        return 'secondary'
      case 'viewed':
        return 'outline'
      case 'overdue':
        return 'destructive'
      case 'draft':
        return 'outline'
      case 'cancelled':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getPaymentStatusColor = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'paid':
        return 'default'
      case 'partial':
        return 'secondary'
      case 'pending':
        return 'outline'
      case 'failed':
        return 'destructive'
      case 'refunded':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const isOverdue = (invoice: Invoice) => {
    return new Date(invoice.dates.dueDate) < new Date() && invoice.paymentStatus !== 'paid'
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Invoices</h1>
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <Button>
          <IconPlus className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
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
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="viewed">Viewed</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Payment status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payments</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Invoices List */}
      <div className="grid gap-4">
        {invoices.map((invoice) => (
          <Card key={invoice._id} className={`hover:shadow-md transition-shadow ${isOverdue(invoice) ? 'border-red-200' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center">
                    <IconFileInvoice className="mr-2 h-5 w-5" />
                    {invoice.invoiceNumber}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <IconUser className="mr-1 h-4 w-4" />
                    {invoice.customer.name}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={getStatusColor(invoice.status)}>
                    {invoice.status}
                  </Badge>
                  <Badge variant={getPaymentStatusColor(invoice.paymentStatus)}>
                    {invoice.paymentStatus}
                  </Badge>
                  {isOverdue(invoice) && (
                    <Badge variant="destructive">
                      Overdue
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Total Amount</div>
                  <div className="text-2xl font-bold">
                    ${invoice.totalAmount.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Issue Date</div>
                  <div className="text-sm flex items-center">
                    <IconCalendar className="mr-1 h-4 w-4" />
                    {new Date(invoice.dates.issueDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Due Date</div>
                  <div className="text-sm flex items-center">
                    <IconCalendar className="mr-1 h-4 w-4" />
                    {new Date(invoice.dates.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Customer Contact</div>
                  <div className="text-sm">{invoice.customer.email}</div>
                  <div className="text-xs text-muted-foreground">{invoice.customer.phone}</div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(invoice.createdAt).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                  <Button size="sm" variant="outline">
                    View PDF
                  </Button>
                  <Button size="sm" variant="outline">
                    Send
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {invoices.length === 0 && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <IconFileInvoice className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No invoices found</h3>
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