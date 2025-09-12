import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, DollarSign, CreditCard, TrendingUp, RefreshCw, Download } from "lucide-react";
import { AdminSidebar } from "@/components/admin-sidebar";
import { format } from "date-fns";

interface Payment {
  id: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  class: {
    id: string;
    title: string;
    teacher: {
      firstName: string;
      lastName: string;
    };
  };
}

interface PaymentStats {
  totalRevenue: number;
  totalTransactions: number;
  successRate: number;
  averageOrderValue: number;
  monthlyGrowth: number;
}

export function AdminPayments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState("");
  
  const { data: payments, isLoading } = useQuery<Payment[]>({
    queryKey: ["/api/admin/payments"],
  });

  const { data: stats } = useQuery<PaymentStats>({
    queryKey: ["/api/admin/payment-stats"],
  });

  const filteredPayments = payments?.filter(payment => {
    const matchesSearch = payment.student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.class.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'refunded': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const mockStats: PaymentStats = stats || {
    totalRevenue: 0,
    totalTransactions: 0,
    successRate: 0,
    averageOrderValue: 0,
    monthlyGrowth: 0
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AdminSidebar />
        <main className="pl-64 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">Loading payment data...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      <main className="pl-64 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Payment Management</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">Monitor transactions and revenue analytics</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" data-testid="button-refresh">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" data-testid="button-export">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Payment Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-total-revenue">
                  ${mockStats.totalRevenue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">All time earnings</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-total-transactions">
                  {mockStats.totalTransactions}
                </div>
                <p className="text-xs text-muted-foreground">Total payments</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-success-rate">
                  {mockStats.successRate.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">Payment success</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Order Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-avg-order">
                  ${mockStats.averageOrderValue.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground">Per transaction</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-monthly-growth">
                  {mockStats.monthlyGrowth > 0 ? '+' : ''}{mockStats.monthlyGrowth.toFixed(1)}%
                </div>
                <p className="text-xs text-muted-foreground">vs last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by student, class, or transaction ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40" data-testid="select-status-filter">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-40" data-testid="select-date-filter">
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This week</SelectItem>
                <SelectItem value="month">This month</SelectItem>
                <SelectItem value="quarter">This quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payments List */}
          {!filteredPayments || filteredPayments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-xl font-semibold mb-2" data-testid="text-no-payments">
                  {searchQuery || statusFilter ? "No payments found" : "No payments yet"}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {searchQuery || statusFilter 
                    ? "Try adjusting your search or filters"
                    : "Payments will appear here as students enroll in classes"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Payment Transactions ({filteredPayments.length})</CardTitle>
                <CardDescription>Recent payment activity and transaction details</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0 divide-y">
                  {filteredPayments.map((payment) => (
                    <div key={payment.id} className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback data-testid={`avatar-student-${payment.id}`}>
                            {payment.student.firstName[0]}{payment.student.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold" data-testid={`text-student-name-${payment.id}`}>
                              {payment.student.firstName} {payment.student.lastName}
                            </h3>
                            <Badge className={getStatusColor(payment.status)} data-testid={`badge-status-${payment.id}`}>
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-1" data-testid={`text-class-title-${payment.id}`}>
                            {payment.class.title}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                            <span data-testid={`text-transaction-id-${payment.id}`}>
                              ID: {payment.transactionId}
                            </span>
                            <span data-testid={`text-payment-method-${payment.id}`}>
                              {payment.paymentMethod}
                            </span>
                            <span data-testid={`text-payment-date-${payment.id}`}>
                              {format(new Date(payment.createdAt), 'MMM dd, yyyy HH:mm')}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-xl font-bold" data-testid={`text-payment-amount-${payment.id}`}>
                            ${payment.amount.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400" data-testid={`text-teacher-name-${payment.id}`}>
                            to {payment.class.teacher.firstName} {payment.class.teacher.lastName}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}