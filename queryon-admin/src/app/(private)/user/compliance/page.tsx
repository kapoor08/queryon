'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  FileText,
  Download,
  Eye,
  Lock,
  Users,
  Database,
  Settings,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

export default function CompliancePage() {
  const [gdprSettings, setGdprSettings] = useState({
    cookieConsent: true,
    dataProcessingConsent: true,
    rightToErasure: true,
    dataPortability: true,
    privacyByDesign: true,
  });

  const complianceStatus = [
    {
      framework: 'GDPR',
      status: 'compliant',
      score: 95,
      lastAudit: '2 weeks ago',
      requirements: 12,
      completed: 11,
      description: 'General Data Protection Regulation',
    },
    {
      framework: 'CCPA',
      status: 'compliant',
      score: 88,
      lastAudit: '1 month ago',
      requirements: 8,
      completed: 7,
      description: 'California Consumer Privacy Act',
    },
    {
      framework: 'HIPAA',
      status: 'partial',
      score: 72,
      lastAudit: '3 weeks ago',
      requirements: 15,
      completed: 11,
      description: 'Health Insurance Portability and Accountability Act',
    },
    {
      framework: 'SOC 2',
      status: 'in-progress',
      score: 65,
      lastAudit: '1 week ago',
      requirements: 20,
      completed: 13,
      description: 'Service Organization Control 2',
    },
  ];

  const dataRequests = [
    {
      id: 1,
      type: 'Data Export',
      requester: 'john.doe@example.com',
      status: 'completed',
      requestDate: '2024-01-15',
      completedDate: '2024-01-16',
      dataTypes: ['Chat history', 'Profile data', 'Preferences'],
    },
    {
      id: 2,
      type: 'Data Deletion',
      requester: 'jane.smith@example.com',
      status: 'in-progress',
      requestDate: '2024-01-18',
      completedDate: null,
      dataTypes: ['All personal data'],
    },
    {
      id: 3,
      type: 'Data Correction',
      requester: 'mike.wilson@example.com',
      status: 'pending',
      requestDate: '2024-01-20',
      completedDate: null,
      dataTypes: ['Contact information'],
    },
  ];

  const auditLogs = [
    {
      id: 1,
      action: 'Data Export Request',
      user: 'john.doe@example.com',
      timestamp: '2024-01-16 14:30:00',
      details: 'User requested data export via privacy portal',
      status: 'success',
    },
    {
      id: 2,
      action: 'Cookie Consent Updated',
      user: 'system',
      timestamp: '2024-01-16 12:15:00',
      details: 'Cookie consent banner updated with new categories',
      status: 'success',
    },
    {
      id: 3,
      action: 'Data Retention Policy Applied',
      user: 'system',
      timestamp: '2024-01-15 23:00:00',
      details: 'Automated deletion of data older than 2 years',
      status: 'success',
    },
    {
      id: 4,
      action: 'Privacy Policy Access',
      user: 'visitor',
      timestamp: '2024-01-15 16:45:00',
      details: 'Privacy policy viewed from chat widget',
      status: 'info',
    },
  ];

  const privacyPolicies = [
    {
      name: 'Privacy Policy',
      version: '2.1',
      lastUpdated: '2024-01-10',
      status: 'active',
      languages: ['English', 'Spanish', 'French', 'German'],
    },
    {
      name: 'Cookie Policy',
      version: '1.8',
      lastUpdated: '2024-01-08',
      status: 'active',
      languages: ['English', 'Spanish'],
    },
    {
      name: 'Terms of Service',
      version: '3.2',
      lastUpdated: '2023-12-15',
      status: 'active',
      languages: ['English'],
    },
    {
      name: 'Data Processing Agreement',
      version: '1.4',
      lastUpdated: '2023-11-20',
      status: 'active',
      languages: ['English', 'German'],
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'compliant':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Compliant
          </Badge>
        );
      case 'partial':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Partial
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3 mr-1" />
            In Progress
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Completed
          </Badge>
        );
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'active':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Active
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleSettingChange = (setting: string, value: boolean) => {
    setGdprSettings({ ...gdprSettings, [setting]: value });
    toast(`${setting} has been ${value ? 'enabled' : 'disabled'}.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Compliance & Privacy
          </h2>
          <p className="text-muted-foreground">
            Manage data privacy, compliance frameworks, and user rights
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <Shield className="mr-2 h-4 w-4" />
            Run Audit
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Compliance Score
            </CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+3%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Requests</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Data Retention
            </CardTitle>
            <Database className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 years</div>
            <p className="text-xs text-muted-foreground">Default policy</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Audit</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 weeks</div>
            <p className="text-xs text-muted-foreground">ago</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="gdpr">GDPR Settings</TabsTrigger>
          <TabsTrigger value="requests">Data Requests</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6">
            {complianceStatus.map((framework, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-blue-50">
                        <Shield className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">
                          {framework.framework}
                        </CardTitle>
                        <CardDescription>
                          {framework.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-2xl font-bold ${getScoreColor(framework.score)}`}
                      >
                        {framework.score}%
                      </span>
                      {getStatusBadge(framework.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Requirements Completed</span>
                        <span>
                          {framework.completed}/{framework.requirements}
                        </span>
                      </div>
                      <Progress
                        value={
                          (framework.completed / framework.requirements) * 100
                        }
                        className="h-2"
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Last audit: {framework.lastAudit}</span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="gdpr" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>GDPR Compliance Settings</CardTitle>
              <CardDescription>
                Configure GDPR compliance features for your chat widget
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Cookie Consent Banner</Label>
                    <p className="text-sm text-muted-foreground">
                      Display cookie consent banner to comply with GDPR
                      requirements
                    </p>
                  </div>
                  <Switch
                    checked={gdprSettings.cookieConsent}
                    onCheckedChange={(checked) =>
                      handleSettingChange('cookieConsent', checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Data Processing Consent</Label>
                    <p className="text-sm text-muted-foreground">
                      Require explicit consent before processing personal data
                    </p>
                  </div>
                  <Switch
                    checked={gdprSettings.dataProcessingConsent}
                    onCheckedChange={(checked) =>
                      handleSettingChange('dataProcessingConsent', checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Right to Erasure</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to request deletion of their personal data
                    </p>
                  </div>
                  <Switch
                    checked={gdprSettings.rightToErasure}
                    onCheckedChange={(checked) =>
                      handleSettingChange('rightToErasure', checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Data Portability</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable users to export their data in a machine-readable
                      format
                    </p>
                  </div>
                  <Switch
                    checked={gdprSettings.dataPortability}
                    onCheckedChange={(checked) =>
                      handleSettingChange('dataPortability', checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Privacy by Design</Label>
                    <p className="text-sm text-muted-foreground">
                      Implement privacy-first defaults and data minimization
                    </p>
                  </div>
                  <Switch
                    checked={gdprSettings.privacyByDesign}
                    onCheckedChange={(checked) =>
                      handleSettingChange('privacyByDesign', checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Retention Settings</CardTitle>
              <CardDescription>
                Configure how long different types of data are retained
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Chat Messages</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="1">1 year</option>
                      <option value="2" selected>
                        2 years
                      </option>
                      <option value="3">3 years</option>
                      <option value="indefinite">Indefinite</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>User Profiles</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="1">1 year</option>
                      <option value="2" selected>
                        2 years
                      </option>
                      <option value="3">3 years</option>
                      <option value="indefinite">Indefinite</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Analytics Data</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="6months">6 months</option>
                      <option value="1" selected>
                        1 year
                      </option>
                      <option value="2">2 years</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Audit Logs</Label>
                    <select className="w-full p-2 border rounded-md">
                      <option value="1">1 year</option>
                      <option value="2">2 years</option>
                      <option value="5" selected>
                        5 years
                      </option>
                      <option value="indefinite">Indefinite</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Subject Requests</CardTitle>
              <CardDescription>
                Manage user requests for data access, correction, and deletion
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dataRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-gray-50">
                        <FileText className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{request.type}</h3>
                        <p className="text-sm text-muted-foreground">
                          {request.requester}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            Requested: {request.requestDate}
                          </span>
                          {request.completedDate && (
                            <span className="text-xs text-muted-foreground">
                              Completed: {request.completedDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {request.dataTypes.map((type, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {type}
                            </Badge>
                          ))}
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Policies & Documents</CardTitle>
              <CardDescription>
                Manage your privacy policies and legal documents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {privacyPolicies.map((policy, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-blue-50">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{policy.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Version {policy.version}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Updated: {policy.lastUpdated}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex flex-wrap gap-1 mb-2">
                          {policy.languages.map((lang, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {lang}
                            </Badge>
                          ))}
                        </div>
                        {getStatusBadge(policy.status)}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
              <CardDescription>
                Complete log of all privacy and compliance-related activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start space-x-4 p-4 border rounded-lg"
                  >
                    <div className="p-2 rounded-lg bg-gray-50">
                      <Lock className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium">{log.action}</h3>
                        <Badge
                          variant={
                            log.status === 'success' ? 'default' : 'secondary'
                          }
                          className={
                            log.status === 'success'
                              ? 'bg-green-100 text-green-800'
                              : log.status === 'info'
                                ? 'bg-blue-100 text-blue-800'
                                : ''
                          }
                        >
                          {log.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {log.details}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>User: {log.user}</span>
                        <span>Time: {log.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
