export interface ThemeConfig {
  name: string;
  height: number;
  width: number;
  chatBubbleWidth: number;
  chatInputHeight: number;
  colors: {
    primary: string;
    primaryHover: string;
    secondary: string;
    text: string;
    textSecondary: string;
    border: string;
    background: string;
    received: string;
    sent: string;
    accent: string;
    surface: string;
  };
  branding: {
    companyName: string;
    supportTitle: string;
    supportSubtitle: string;
    placeholder: string;
    footerText: string;
  };
}
