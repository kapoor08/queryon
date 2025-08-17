/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Layers,
  Plus,
  Search,
  Star,
  Download,
  Eye,
  Copy,
  Edit,
  Trash2,
  ShoppingCart,
  Headphones,
  GraduationCap,
  Building,
  Heart,
  Briefcase,
} from 'lucide-react';
import { toast } from 'sonner';

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);

  const templates = [
    {
      id: 1,
      name: 'E-commerce Support',
      description:
        'Perfect for online stores with product inquiries and order support',
      category: 'E-commerce',
      icon: ShoppingCart,
      color: 'bg-green-100 text-green-800',
      rating: 4.9,
      downloads: 2340,
      features: [
        'Product recommendations',
        'Order tracking',
        'Return assistance',
        'Live agent handoff',
      ],
      preview: {
        primaryColor: '#10B981',
        position: 'bottom-right',
        welcomeMessage: 'Hi! How can I help you with your order today?',
        avatar: '/placeholder.svg?height=40&width=40',
      },
    },
    {
      id: 2,
      name: 'Customer Support',
      description: 'General customer support template with ticket creation',
      category: 'Support',
      icon: Headphones,
      color: 'bg-blue-100 text-blue-800',
      rating: 4.8,
      downloads: 1890,
      features: [
        'Ticket creation',
        'FAQ integration',
        'Escalation rules',
        'Satisfaction surveys',
      ],
      preview: {
        primaryColor: '#3B82F6',
        position: 'bottom-right',
        welcomeMessage:
          "Welcome! I'm here to help with any questions you have.",
        avatar: '/placeholder.svg?height=40&width=40',
      },
    },
    {
      id: 3,
      name: 'Lead Generation',
      description: 'Capture leads and qualify prospects automatically',
      category: 'Sales',
      icon: Briefcase,
      color: 'bg-purple-100 text-purple-800',
      rating: 4.7,
      downloads: 1560,
      features: [
        'Lead capture forms',
        'Qualification questions',
        'CRM integration',
        'Follow-up automation',
      ],
      preview: {
        primaryColor: '#8B5CF6',
        position: 'bottom-left',
        welcomeMessage:
          'Hi there! Interested in learning more about our solutions?',
        avatar: '/placeholder.svg?height=40&width=40',
      },
    },
    {
      id: 4,
      name: 'Educational Platform',
      description: 'Help students and educators with course-related questions',
      category: 'Education',
      icon: GraduationCap,
      color: 'bg-orange-100 text-orange-800',
      rating: 4.6,
      downloads: 1230,
      features: [
        'Course recommendations',
        'Assignment help',
        'Schedule assistance',
        'Resource sharing',
      ],
      preview: {
        primaryColor: '#F97316',
        position: 'bottom-right',
        welcomeMessage: 'Hello! Need help with your courses or have questions?',
        avatar: '/placeholder.svg?height=40&width=40',
      },
    },
    {
      id: 5,
      name: 'Healthcare Assistant',
      description: 'Patient support and appointment scheduling for healthcare',
      category: 'Healthcare',
      icon: Heart,
      color: 'bg-red-100 text-red-800',
      rating: 4.9,
      downloads: 980,
      features: [
        'Appointment booking',
        'Symptom checker',
        'Insurance help',
        'Provider directory',
      ],
      preview: {
        primaryColor: '#EF4444',
        position: 'bottom-center',
        welcomeMessage:
          'Hi! I can help you with appointments and health-related questions.',
        avatar: '/placeholder.svg?height=40&width=40',
      },
    },
    {
      id: 6,
      name: 'SaaS Onboarding',
      description: 'Guide new users through your software platform',
      category: 'SaaS',
      icon: Building,
      color: 'bg-indigo-100 text-indigo-800',
      rating: 4.8,
      downloads: 1450,
      features: [
        'Feature tours',
        'Setup assistance',
        'Integration help',
        'Best practices',
      ],
      preview: {
        primaryColor: '#6366F1',
        position: 'bottom-right',
        welcomeMessage: 'Welcome to our platform! Let me help you get started.',
        avatar: '/placeholder.svg?height=40&width=40',
      },
    },
  ];

  const categories = [
    { id: 'all', name: 'All Templates', count: templates.length },
    { id: 'E-commerce', name: 'E-commerce', count: 1 },
    { id: 'Support', name: 'Support', count: 1 },
    { id: 'Sales', name: 'Sales', count: 1 },
    { id: 'Education', name: 'Education', count: 1 },
    { id: 'Healthcare', name: 'Healthcare', count: 1 },
    { id: 'SaaS', name: 'SaaS', count: 1 },
  ];

  const myTemplates = [
    {
      id: 1,
      name: 'Custom Support Template',
      description: 'My customized support template',
      lastModified: '2 days ago',
      status: 'active',
      widgets: 3,
    },
    {
      id: 2,
      name: 'Sales Qualified Template',
      description: 'Template for qualified sales leads',
      lastModified: '1 week ago',
      status: 'draft',
      widgets: 1,
    },
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (template: any) => {
    toast(`${template.name} has been applied to your widget.`);
  };

  const handlePreview = (template: any) => {
    setSelectedTemplate(template);
    setIsPreviewOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Widget Templates
          </h2>
          <p className="text-muted-foreground">
            Choose from pre-built templates or create your own
          </p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Available Templates
            </CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
            <p className="text-xs text-muted-foreground">Ready to use</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Templates</CardTitle>
            <Edit className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myTemplates.length}</div>
            <p className="text-xs text-muted-foreground">Custom templates</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Downloads
            </CardTitle>
            <Download className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">9.4K</div>
            <p className="text-xs text-muted-foreground">Community downloads</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">User satisfaction</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="browse" className="space-y-4">
        <TabsList>
          <TabsTrigger value="browse">Browse Templates</TabsTrigger>
          <TabsTrigger value="my-templates">My Templates</TabsTrigger>
          <TabsTrigger value="create">Create New</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    selectedCategory === category.id ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="hover:shadow-lg transition-all duration-200"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gray-50">
                        <template.icon className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {template.name}
                        </CardTitle>
                        <Badge className={template.color}>
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {template.rating}
                      </span>
                    </div>
                  </div>
                  <CardDescription className="mt-2">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Features</h4>
                      <ul className="space-y-1">
                        {template.features.slice(0, 3).map((feature, index) => (
                          <li
                            key={index}
                            className="text-sm text-muted-foreground flex items-center"
                          >
                            <div className="w-1 h-1 bg-purple-600 rounded-full mr-2"></div>
                            {feature}
                          </li>
                        ))}
                        {template.features.length > 3 && (
                          <li className="text-sm text-muted-foreground">
                            +{template.features.length - 3} more features
                          </li>
                        )}
                      </ul>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Download className="h-3 w-3" />
                        <span>
                          {template.downloads.toLocaleString()} downloads
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => handlePreview(template)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => handleUseTemplate(template)}
                      >
                        Use Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>My Custom Templates</CardTitle>
              <CardDescription>
                Templates you&apos;ve created or customized
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-purple-50">
                        <Layers className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{template.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-muted-foreground">
                            Modified {template.lastModified}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Used in {template.widgets} widgets
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          template.status === 'active' ? 'default' : 'secondary'
                        }
                      >
                        {template.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Template</CardTitle>
              <CardDescription>
                Build a custom template from scratch or modify an existing one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="cursor-pointer hover:shadow-md transition-shadow border-dashed">
                  <CardContent className="flex flex-col items-center justify-center p-8">
                    <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">Start from Scratch</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Create a completely new template with custom design and
                      functionality
                    </p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:shadow-md transition-shadow border-dashed">
                  <CardContent className="flex flex-col items-center justify-center p-8">
                    <Copy className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">Duplicate Existing</h3>
                    <p className="text-sm text-muted-foreground text-center">
                      Start with an existing template and customize it to your
                      needs
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Template Preview</DialogTitle>
            <DialogDescription>
              {selectedTemplate?.name} - {selectedTemplate?.description}
            </DialogDescription>
          </DialogHeader>
          {selectedTemplate && (
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-3">Template Details</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Category</span>
                    <Badge className={selectedTemplate.color}>
                      {selectedTemplate.category}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{selectedTemplate.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Downloads</span>
                    <span className="text-sm">
                      {selectedTemplate.downloads.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Features</h4>
                  <ul className="space-y-1">
                    {selectedTemplate.features.map(
                      (feature: string, index: number) => (
                        <li
                          key={index}
                          className="text-sm text-muted-foreground flex items-center"
                        >
                          <div className="w-1 h-1 bg-purple-600 rounded-full mr-2"></div>
                          {feature}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3">Live Preview</h4>
                <div className="relative bg-gray-100 rounded-lg p-4 h-64">
                  <div className="absolute bottom-4 right-4">
                    <div
                      className="bg-white rounded-lg shadow-lg p-3 max-w-xs"
                      style={{
                        borderTop: `3px solid ${selectedTemplate.preview.primaryColor}`,
                      }}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <img
                          src={
                            selectedTemplate.preview.avatar ||
                            '/placeholder.svg'
                          }
                          alt="Avatar"
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm font-medium">ChatWidget</span>
                      </div>
                      <p className="text-sm">
                        {selectedTemplate.preview.welcomeMessage}
                      </p>
                      <div className="flex space-x-2 mt-2">
                        <Button
                          size="sm"
                          style={{
                            backgroundColor:
                              selectedTemplate.preview.primaryColor,
                          }}
                        >
                          Get Started
                        </Button>
                        <Button variant="outline" size="sm">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() =>
                selectedTemplate && handleUseTemplate(selectedTemplate)
              }
            >
              Use This Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
