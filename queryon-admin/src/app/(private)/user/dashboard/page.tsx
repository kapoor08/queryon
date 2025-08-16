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
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Bot,
  Key,
  Plus,
  Settings,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Zap,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { queryData, stats, widgetsList } from '@/data';

export default function UserDashboard() {
  const usagePercentage = (1250 / 500) * 100; // Over limit

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with your chat widgets today.
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Widget
        </Button>
      </div>

      {/* Usage Alert */}
      {usagePercentage > 100 && (
        <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800 dark:text-orange-200">
            <strong>Usage Limit Exceeded:</strong> You&apos;ve used{' '}
            {Math.round(usagePercentage)}% of your monthly query limit.
            <Button
              variant="link"
              className="p-0 ml-2 text-orange-800 dark:text-orange-200 underline"
            >
              Upgrade your plan
            </Button>{' '}
            to avoid service interruption.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stat.value}
                {stat.limit && (
                  <span className="text-sm font-normal text-muted-foreground">
                    {' '}
                    / {stat.limit}
                  </span>
                )}
              </div>
              {stat.isOverLimit && (
                <div className="mt-2">
                  <Progress
                    value={Math.min(usagePercentage, 100)}
                    className="h-2"
                  />
                  <p className="text-xs text-orange-600 mt-1">
                    Over limit by {Math.round(usagePercentage - 100)}%
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Active Widgets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <span>Active Widgets</span>
            </CardTitle>
            <CardDescription>
              Your deployed chat widgets and their performance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {widgetsList.map((widget) => (
              <div
                key={widget.id}
                className="p-4 border rounded-lg hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium">{widget.name}</p>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Globe className="h-3 w-3 mr-1" />
                      {widget.domain}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="default"
                      className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {widget.status}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Queries</p>
                    <p className="font-medium">
                      {widget.queries.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Response Time</p>
                    <p className="font-medium">{widget.responseTime}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Satisfaction</p>
                    <p className="font-medium">{widget.satisfaction}/5.0</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Last active {widget.lastActive}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Query Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <span>Weekly Query Volume</span>
            </CardTitle>
            <CardDescription>Query volume over the past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={queryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="queries"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-yellow-600" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              className="h-20 flex-col space-y-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900 dark:border-blue-800"
              variant="outline"
            >
              <Plus className="h-5 w-5" />
              <span className="text-sm">Create Widget</span>
            </Button>
            <Button
              className="h-20 flex-col space-y-2 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 dark:bg-green-950 dark:text-green-300 dark:hover:bg-green-900 dark:border-green-800"
              variant="outline"
            >
              <Key className="h-5 w-5" />
              <span className="text-sm">Generate API Key</span>
            </Button>
            <Button
              className="h-20 flex-col space-y-2 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:hover:bg-purple-900 dark:border-purple-800"
              variant="outline"
            >
              <BarChart3 className="h-5 w-5" />
              <span className="text-sm">View Analytics</span>
            </Button>
            <Button
              className="h-20 flex-col space-y-2 bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:hover:bg-orange-900 dark:border-orange-800"
              variant="outline"
            >
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm">Upgrade Plan</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
