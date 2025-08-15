'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  CreditCard,
  Download,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Star,
  Crown,
  Zap,
} from 'lucide-react';

export default function BillingPage() {
  const currentPlan = {
    name: 'Pro',
    price: '$29',
    period: 'month',
    features: [
      '500 queries per day',
      '3 widgets',
      'Priority support',
      'Advanced analytics',
      'Custom styling',
      'API access',
    ],
    usage: {
      queries: { used: 1250, limit: 500 },
      widgets: { used: 2, limit: 3 },
    },
  };

  const billingHistory = [
    {
      id: 'inv_001',
      date: '2024-01-01',
      amount: '$29.00',
      status: 'paid',
      description: 'Pro Plan - January 2024',
    },
    {
      id: 'inv_002',
      date: '2023-12-01',
      amount: '$29.00',
      status: 'paid',
      description: 'Pro Plan - December 2023',
    },
    {
      id: 'inv_003',
      date: '2023-11-01',
      amount: '$29.00',
      status: 'paid',
      description: 'Pro Plan - November 2023',
    },
  ];

  const plans = [
    {
      name: 'Starter',
      price: '$9',
      period: 'month',
      description: 'Perfect for small websites',
      features: [
        '50 queries per day',
        '1 widget',
        'Email support',
        'Basic analytics',
      ],
      icon: Zap,
      current: false,
    },
    {
      name: 'Pro',
      price: '$29',
      period: 'month',
      description: 'Ideal for growing businesses',
      features: [
        '500 queries per day',
        '3 widgets',
        'Priority support',
        'Advanced analytics',
        'Custom styling',
        'API access',
      ],
      icon: Star,
      current: true,
      popular: true,
    },
    {
      name: 'Enterprise',
      price: '$99',
      period: 'month',
      description: 'For large organizations',
      features: [
        'Unlimited queries',
        '10+ widgets',
        'Dedicated support',
        'Custom integrations',
        'White-label options',
        'SLA guarantee',
      ],
      icon: Crown,
      current: false,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Paid
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary">
            <AlertCircle className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          Billing & Subscription
        </h2>
        <p className="text-muted-foreground">
          Manage your subscription and billing information
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="history">Billing History</TabsTrigger>
          <TabsTrigger value="payment">Payment Method</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-purple-600" />
                  <span>Current Plan</span>
                </CardTitle>
                <CardDescription>
                  Your active subscription details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{currentPlan.name}</p>
                    <p className="text-muted-foreground">
                      {currentPlan.price}/{currentPlan.period}
                    </p>
                  </div>
                  <Badge
                    variant="default"
                    className="bg-purple-100 text-purple-800"
                  >
                    Active
                  </Badge>
                </div>
                <div className="space-y-2">
                  {currentPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Change Plan
                  </Button>
                  <Button variant="outline" className="flex-1 bg-transparent">
                    Cancel Subscription
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span>Usage This Month</span>
                </CardTitle>
                <CardDescription>
                  Your current usage against plan limits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Queries</span>
                    <span>
                      {currentPlan.usage.queries.used.toLocaleString()} /{' '}
                      {currentPlan.usage.queries.limit.toLocaleString()}
                    </span>
                  </div>
                  <Progress
                    value={
                      (currentPlan.usage.queries.used /
                        currentPlan.usage.queries.limit) *
                      100
                    }
                    className="h-2"
                  />
                  {currentPlan.usage.queries.used >
                    currentPlan.usage.queries.limit && (
                    <p className="text-xs text-orange-600">
                      Over limit by{' '}
                      {(
                        (currentPlan.usage.queries.used /
                          currentPlan.usage.queries.limit -
                          1) *
                        100
                      ).toFixed(0)}
                      %
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Widgets</span>
                    <span>
                      {currentPlan.usage.widgets.used} /{' '}
                      {currentPlan.usage.widgets.limit}
                    </span>
                  </div>
                  <Progress
                    value={
                      (currentPlan.usage.widgets.used /
                        currentPlan.usage.widgets.limit) *
                      100
                    }
                    className="h-2"
                  />
                </div>
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    Next billing date: <strong>February 1, 2024</strong>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${plan.current ? 'ring-2 ring-purple-600' : ''}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <plan.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="text-3xl font-bold">
                    {plan.price}
                    <span className="text-sm font-normal text-muted-foreground">
                      /{plan.period}
                    </span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.current ? 'secondary' : 'default'}
                    disabled={plan.current}
                  >
                    {plan.current ? 'Current Plan' : 'Upgrade'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Your past invoices and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {billingHistory.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.id}
                      </TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>{invoice.description}</TableCell>
                      <TableCell>{invoice.amount}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Payment Method</span>
              </CardTitle>
              <CardDescription>Manage your payment information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-muted-foreground">
                      Expires 12/25
                    </p>
                  </div>
                </div>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  Default
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline">Add Payment Method</Button>
                <Button variant="outline">Update Billing Address</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
