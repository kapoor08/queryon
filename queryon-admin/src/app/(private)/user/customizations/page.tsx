'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Copy,
  Check,
  Palette,
  MessageSquare,
  Settings,
  Code,
} from 'lucide-react';
import { ALL_THEMES } from '@/data';
import { ThemeConfig } from '@/types/theme';
import { ChatWidget } from '@/components';

export default function CustomizationPage() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeConfig>(
    ALL_THEMES[3]
  ); // Forest Green default
  const [customTheme, setCustomTheme] = useState<ThemeConfig>(ALL_THEMES[3]);
  const [copied, setCopied] = useState(false);

  const handleThemeChange = (themeName: string) => {
    const theme = ALL_THEMES.find((t) => t.name === themeName);
    if (theme) {
      setSelectedTheme(theme);
      setCustomTheme({ ...theme });
    }
  };

  const handleCustomColorChange = (key: string, value: string) => {
    setCustomTheme((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value,
      },
    }));
  };

  const handleBrandingChange = (key: string, value: string) => {
    setCustomTheme((prev) => ({
      ...prev,
      branding: {
        ...prev.branding,
        [key]: value,
      },
    }));
  };

  const generateEmbedCode = () => {
    const config = {
      theme: customTheme.colors,
      branding: customTheme.branding,
      position: 'bottom-right',
      size: 'medium',
    };

    return `<script>
  window.ChatWidgetConfig = ${JSON.stringify(config, null, 2)};
</script>
<script src="https://your-chat-widget.vercel.app/widget.js"></script>`;
  };

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(generateEmbedCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Widget Customization
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Customize your chat widget&apos;s appearance and behavior to match
          your brand
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Customization Panel */}
        <div className="space-y-6">
          <Tabs defaultValue="style" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="style" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Style
              </TabsTrigger>
              <TabsTrigger value="text" className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Text
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="code" className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="style" className="space-y-6">
              {/* Theme Selector */}
              <Card>
                <CardHeader>
                  <CardTitle>Choose Theme</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Label htmlFor="theme-select">Select a preset theme</Label>
                    <Select
                      value={selectedTheme.name}
                      onValueChange={handleThemeChange}
                    >
                      <SelectTrigger>
                        <SelectValue>
                          <div className="flex items-center space-x-3">
                            <div className="flex space-x-1">
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{
                                  backgroundColor: selectedTheme.colors.primary,
                                }}
                              />
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{
                                  backgroundColor:
                                    selectedTheme.colors.secondary,
                                }}
                              />
                              <div
                                className="w-4 h-4 rounded-full"
                                style={{
                                  backgroundColor: selectedTheme.colors.accent,
                                }}
                              />
                            </div>
                            <span>{selectedTheme.name}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {ALL_THEMES.map((theme) => (
                          <SelectItem key={theme.name} value={theme.name}>
                            <div className="flex items-center space-x-3">
                              <div className="flex space-x-1">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{
                                    backgroundColor: theme.colors.primary,
                                  }}
                                />
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{
                                    backgroundColor: theme.colors.secondary,
                                  }}
                                />
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{
                                    backgroundColor: theme.colors.accent,
                                  }}
                                />
                              </div>
                              <span>{theme.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Custom Colors */}
              <Card>
                <CardHeader>
                  <CardTitle>Custom Colors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primary">Primary Color</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          id="primary"
                          type="color"
                          value={customTheme.colors.primary}
                          onChange={(e) =>
                            handleCustomColorChange('primary', e.target.value)
                          }
                          className="w-12 h-10 p-1 border rounded"
                        />
                        <Input
                          value={customTheme.colors.primary}
                          onChange={(e) =>
                            handleCustomColorChange('primary', e.target.value)
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="primaryHover">Primary Hover</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          id="primaryHover"
                          type="color"
                          value={customTheme.colors.primaryHover}
                          onChange={(e) =>
                            handleCustomColorChange(
                              'primaryHover',
                              e.target.value
                            )
                          }
                          className="w-12 h-10 p-1 border rounded"
                        />
                        <Input
                          value={customTheme.colors.primaryHover}
                          onChange={(e) =>
                            handleCustomColorChange(
                              'primaryHover',
                              e.target.value
                            )
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="background">Background</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          id="background"
                          type="color"
                          value={customTheme.colors.background}
                          onChange={(e) =>
                            handleCustomColorChange(
                              'background',
                              e.target.value
                            )
                          }
                          className="w-12 h-10 p-1 border rounded"
                        />
                        <Input
                          value={customTheme.colors.background}
                          onChange={(e) =>
                            handleCustomColorChange(
                              'background',
                              e.target.value
                            )
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="text">Text Color</Label>
                      <div className="flex items-center space-x-2 mt-1">
                        <Input
                          id="text"
                          type="color"
                          value={customTheme.colors.text}
                          onChange={(e) =>
                            handleCustomColorChange('text', e.target.value)
                          }
                          className="w-12 h-10 p-1 border rounded"
                        />
                        <Input
                          value={customTheme.colors.text}
                          onChange={(e) =>
                            handleCustomColorChange('text', e.target.value)
                          }
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="text" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Branding & Messages</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={customTheme.branding.companyName}
                      onChange={(e) =>
                        handleBrandingChange('companyName', e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="supportTitle">Support Title</Label>
                    <Input
                      id="supportTitle"
                      value={customTheme.branding.supportTitle}
                      onChange={(e) =>
                        handleBrandingChange('supportTitle', e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="supportSubtitle">Support Subtitle</Label>
                    <Input
                      id="supportSubtitle"
                      value={customTheme.branding.supportSubtitle}
                      onChange={(e) =>
                        handleBrandingChange('supportSubtitle', e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="placeholder">Input Placeholder</Label>
                    <Input
                      id="placeholder"
                      value={customTheme.branding.placeholder}
                      onChange={(e) =>
                        handleBrandingChange('placeholder', e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="footerText">Footer Text</Label>
                    <Textarea
                      id="footerText"
                      value={customTheme.branding.footerText}
                      onChange={(e) =>
                        handleBrandingChange('footerText', e.target.value)
                      }
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Widget Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Widget Position</Label>
                    <Select defaultValue="bottom-right">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bottom-right">
                          Bottom Right
                        </SelectItem>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        <SelectItem value="top-right">Top Right</SelectItem>
                        <SelectItem value="top-left">Top Left</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Widget Size</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (320x400)</SelectItem>
                        <SelectItem value="medium">Medium (380x500)</SelectItem>
                        <SelectItem value="large">Large (420x600)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="code" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Embed Code</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{generateEmbedCode()}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 bg-transparent"
                      onClick={copyEmbedCode}
                    >
                      {copied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Installation Instructions
                    </h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800 dark:text-blue-200">
                      <li>Copy the embed code above</li>
                      <li>
                        Paste it before the closing &lt;/body&gt; tag on your
                        website
                      </li>
                      <li>The widget will appear automatically on your site</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Live Preview */}
        <div className="lg:sticky lg:top-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Live Preview
                <Badge variant="secondary">Interactive</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-96 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg overflow-hidden border">
                {/* Website mockup */}
                <div className="absolute top-4 left-4 right-4">
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-lg">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Your Website
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      This is how your chat widget will appear on your website
                    </p>
                  </div>
                </div>

                {/* Chat Widget Preview */}
                <div className="absolute bottom-4 right-4">
                  <ChatWidget
                    theme={customTheme}
                    position="bottom-right"
                    isPreview={true}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
