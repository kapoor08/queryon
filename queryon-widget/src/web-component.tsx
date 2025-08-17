/* eslint-disable no-console */
// src/web-component.tsx - FIXED VERSION WITH REAL-TIME UPDATES
import ReactDOM from "react-dom/client";
import { ChatWidget } from "@/components";
import {
  ModernDarkTheme,
  GlassmorphismTheme,
  NeonCyberTheme,
  ForestGreenTheme,
  EarthToneTheme,
  SunsetOrangeTheme,
  ElectricPinkTheme,
  ElegantPurpleTheme,
  RoyalGoldTheme,
  CorporateBlueTheme,
  MinimalistGrayTheme,
  OceanBlueTheme,
  DeepSeaTheme,
  MedicalTheme,
  WellnessGreenTheme,
  FintechTheme,
  BankingTheme,
  CreativeStudioTheme,
  RainbowTheme,
  GamingTheme,
  EntertainmentTheme,
  MonochromeTheme,
  RetroTheme,
  PastelDreamTheme,
  WinterFrostTheme,
  AutumnHarvestTheme,
  SpringBloomTheme,
  PlatinumEliteTheme,
  RoseGoldTheme,
  SiliconValleyTheme,
  BlockchainTheme,
  AviationTheme,
  AutomotiveTheme,
  RealEstateTheme,
  ZenTheme,
  EnergeticTheme,
  NordicTheme,
  MediterraneanTheme,
  CosmicTheme,
  GalaxyTheme,
  CoffeeShopTheme,
  WineDineTheme,
  JazzClubTheme,
  RockConcertTheme,
  FitnessTheme,
  OceanSportsTheme,
  AcademicTheme,
  LibraryTheme,
  TropicalParadiseTheme,
  MountainAdventureTheme,
  ArtDecoTheme,
  VintageTheme,
  ValentineTheme,
  HalloweenTheme,
  ThunderstormTheme,
  DesertSunsetTheme,
  MarbleTheme,
  WoodGrainTheme,
} from "@/components/ChatWidget/config";

// Complete theme mapping for all 58 themes
type ThemeType = {
  colors: Record<string, string>;
  branding: Record<string, string>;
  width?: number;
  height?: number;
  [key: string]: unknown;
};

const THEME_MAP: Record<string, ThemeType> = {
  // Modern & Tech Themes
  "modern-dark": ModernDarkTheme,
  glassmorphism: GlassmorphismTheme,
  "neon-cyber": NeonCyberTheme,
  "silicon-valley": SiliconValleyTheme,
  blockchain: BlockchainTheme,
  "minimalist-gray": MinimalistGrayTheme,

  // Business & Corporate Themes
  "corporate-blue": CorporateBlueTheme,
  banking: BankingTheme,
  fintech: FintechTheme,
  "real-estate": RealEstateTheme,
  academic: AcademicTheme,
  aviation: AviationTheme,
  automotive: AutomotiveTheme,

  // Nature & Seasonal Themes
  "forest-green": ForestGreenTheme,
  "earth-tone": EarthToneTheme,
  "wellness-green": WellnessGreenTheme,
  "ocean-blue": OceanBlueTheme,
  "deep-sea": DeepSeaTheme,
  "winter-frost": WinterFrostTheme,
  "autumn-harvest": AutumnHarvestTheme,
  "spring-bloom": SpringBloomTheme,
  "tropical-paradise": TropicalParadiseTheme,
  "mountain-adventure": MountainAdventureTheme,
  "desert-sunset": DesertSunsetTheme,

  // Creative & Artistic Themes
  "electric-pink": ElectricPinkTheme,
  "creative-studio": CreativeStudioTheme,
  rainbow: RainbowTheme,
  "pastel-dream": PastelDreamTheme,
  "art-deco": ArtDecoTheme,
  vintage: VintageTheme,

  // Premium & Luxury Themes
  "elegant-purple": ElegantPurpleTheme,
  "royal-gold": RoyalGoldTheme,
  "rose-gold": RoseGoldTheme,
  "platinum-elite": PlatinumEliteTheme,
  marble: MarbleTheme,
  "wood-grain": WoodGrainTheme,

  // Entertainment & Lifestyle Themes
  gaming: GamingTheme,
  entertainment: EntertainmentTheme,
  retro: RetroTheme,
  fitness: FitnessTheme,
  "ocean-sports": OceanSportsTheme,
  "coffee-shop": CoffeeShopTheme,
  "wine-dine": WineDineTheme,
  "jazz-club": JazzClubTheme,
  "rock-concert": RockConcertTheme,

  // Specialty & Industry Themes
  medical: MedicalTheme,
  library: LibraryTheme,
  zen: ZenTheme,
  energetic: EnergeticTheme,
  nordic: NordicTheme,
  mediterranean: MediterraneanTheme,

  // Unique & Fun Themes
  monochrome: MonochromeTheme,
  cosmic: CosmicTheme,
  galaxy: GalaxyTheme,
  valentine: ValentineTheme,
  halloween: HalloweenTheme,
  thunderstorm: ThunderstormTheme,

  // Color-based Themes
  "sunset-orange": SunsetOrangeTheme,
};

// Position options for widget placement
const POSITION_MAP: Record<
  string,
  { bottom?: string; right?: string; left?: string; top?: string }
> = {
  "bottom-right": { bottom: "20px", right: "20px" },
  "bottom-left": { bottom: "20px", left: "20px" },
  "top-right": { top: "20px", right: "20px" },
  "top-left": { top: "20px", left: "20px" },
  "center-right": { top: "50%", right: "20px" },
  "center-left": { top: "50%", left: "20px" },
};

// Converts kebab-case to camelCase
const normalizeAttribute = (attribute: string) => {
  return attribute.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};

interface WidgetConfig {
  theme?: string;
  companyName?: string;
  supportTitle?: string;
  supportSubtitle?: string;
  placeholder?: string;
  footerText?: string;
  position?: string;
  width?: string;
  height?: string;
  zIndex?: string;
  apiEndpoint?: string;
  webhookUrl?: string;
  customStyles?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  borderRadius?: string;
  animation?: string;
}

class WidgetWebComponent extends HTMLElement {
  private root: ReactDOM.Root | null = null;
  private config: WidgetConfig = {};
  private _isConnected = false;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    console.log("🔧 WidgetWebComponent constructor called");
  }

  static get observedAttributes() {
    return [
      "theme",
      "company-name",
      "support-title",
      "support-subtitle",
      "placeholder",
      "footer-text",
      "position",
      "width",
      "height",
      "z-index",
      "api-endpoint",
      "webhook-url",
      "custom-styles",
      "primary-color",
      "secondary-color",
      "text-color",
      "border-radius",
      "animation",
    ];
  }

  connectedCallback() {
    console.log("🔗 WidgetWebComponent connected to DOM");
    this._isConnected = true;
    try {
      this.config = this.parseConfiguration();
      this.render();
    } catch (error) {
      console.error("❌ Error in connectedCallback:", error);
    }
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    console.log(`🔄 Attribute changed: ${name} from "${oldValue}" to "${newValue}"`);

    // Only update if the component is connected and the value actually changed
    if (this._isConnected && oldValue !== newValue) {
      try {
        // Update the config with the new value
        this.config = this.parseConfiguration();

        // Re-render the component with new configuration
        this.render();

        console.log(`✅ Successfully updated ${name}`);
      } catch (error) {
        console.error(`❌ Error updating attribute ${name}:`, error);
      }
    }
  }

  disconnectedCallback() {
    console.log("🔌 WidgetWebComponent disconnected from DOM");
    this._isConnected = false;
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }

  private parseConfiguration(): WidgetConfig {
    const config: WidgetConfig = {};

    // Parse all attributes
    for (let i = 0; i < this.attributes.length; i++) {
      const attr = this.attributes[i];
      const normalizedName = normalizeAttribute(attr.name) as keyof WidgetConfig;
      config[normalizedName] = attr.value;
    }

    console.log("📝 Parsed config:", config);
    return config;
  }

  private createCustomTheme() {
    console.log("🎨 Creating custom theme...");

    try {
      const themeName = this.config.theme || "forest-green";
      console.log("🎯 Using theme name:", themeName);

      // Get base theme from the map
      const baseTheme = THEME_MAP[themeName] || ForestGreenTheme;
      console.log("🏗️ Base theme:", baseTheme);

      // Validate that baseTheme has required structure
      if (!baseTheme || !baseTheme.colors || !baseTheme.branding) {
        console.error("❌ Invalid base theme structure:", baseTheme);
        throw new Error("Invalid theme structure");
      }

      // Create a deep copy of the base theme to avoid mutations
      const customTheme = JSON.parse(JSON.stringify(baseTheme));
      console.log("📋 Copied theme:", customTheme);

      // Override colors if custom colors are provided
      if (this.config.primaryColor) {
        customTheme.colors.primary = this.config.primaryColor;
        customTheme.colors.sent = this.config.primaryColor;
        // Generate a darker version for hover
        customTheme.colors.primaryHover = this.darkenColor(this.config.primaryColor, 10);
        console.log("🎨 Applied custom primary color:", this.config.primaryColor);
      }

      if (this.config.secondaryColor) {
        customTheme.colors.secondary = this.config.secondaryColor;
        customTheme.colors.background = this.config.secondaryColor;
        console.log("🎨 Applied custom secondary color:", this.config.secondaryColor);
      }

      if (this.config.textColor) {
        customTheme.colors.text = this.config.textColor;
        console.log("🎨 Applied custom text color:", this.config.textColor);
      }

      // Override branding with custom values if provided
      if (this.config.companyName) {
        customTheme.branding.companyName = this.config.companyName;
      }
      if (this.config.supportTitle) {
        customTheme.branding.supportTitle = this.config.supportTitle;
      }
      if (this.config.supportSubtitle) {
        customTheme.branding.supportSubtitle = this.config.supportSubtitle;
      }
      if (this.config.placeholder) {
        customTheme.branding.placeholder = this.config.placeholder;
      }
      if (this.config.footerText) {
        customTheme.branding.footerText = this.config.footerText;
      }

      // Override dimensions if provided
      if (this.config.width) {
        const newWidth = parseInt(this.config.width);
        if (!isNaN(newWidth)) {
          customTheme.width = newWidth;
          console.log("📐 Applied custom width:", newWidth);
        }
      }
      if (this.config.height) {
        const newHeight = parseInt(this.config.height);
        if (!isNaN(newHeight)) {
          customTheme.height = newHeight;
          console.log("📐 Applied custom height:", newHeight);
        }
      }

      console.log("✅ Final custom theme:", customTheme);
      return customTheme;
    } catch (error) {
      console.error("❌ Error creating custom theme:", error);

      // Return a fallback theme if everything fails
      return {
        colors: {
          primary: this.config.primaryColor || "#059669",
          primaryHover: this.darkenColor(this.config.primaryColor || "#059669", 10),
          secondary: this.config.secondaryColor || "#f0fdf4",
          text: this.config.textColor || "#1f2937",
          textSecondary: "#6b7280",
          border: "#d1d5db",
          background: this.config.secondaryColor || "#ffffff",
          received: "#f3f4f6",
          sent: this.config.primaryColor || "#059669",
          accent: "#f59e0b",
          surface: "#fefefe",
        },
        branding: {
          companyName: this.config.companyName || "Your Company",
          supportTitle: this.config.supportTitle || "Customer Support",
          supportSubtitle: this.config.supportSubtitle || "We're here to help",
          placeholder: this.config.placeholder || "Type your message...",
          footerText: this.config.footerText || "We typically reply in a few minutes",
        },
        width: parseInt(this.config.width || "360"),
        height: parseInt(this.config.height || "500"),
      };
    }
  }

  private darkenColor(color: string, percent: number): string {
    // Simple color darkening function
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00ff) - amt;
    const B = (num & 0x0000ff) - amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  }

  private applyCustomStyles() {
    try {
      const position = this.config.position || "bottom-right";
      const positionStyles = POSITION_MAP[position] || POSITION_MAP["bottom-right"];
      const zIndex = this.config.zIndex || "1000";

      console.log("📍 Applying position:", position, positionStyles);

      // Clear all position styles first
      this.style.top = "";
      this.style.bottom = "";
      this.style.left = "";
      this.style.right = "";

      // Apply positioning to the host element
      this.style.position = "fixed";
      this.style.zIndex = zIndex;

      Object.entries(positionStyles).forEach(([key, value]) => {
        if (value) {
          this.style.setProperty(key, value);
          console.log(`📌 Set ${key}: ${value}`);
        }
      });

      // Apply border radius if provided
      if (this.config.borderRadius) {
        this.style.borderRadius = this.config.borderRadius;
      }

      // Apply animations if provided
      if (this.config.animation) {
        this.style.animation = this.config.animation;
      }

      // Apply custom styles if provided
      if (this.config.customStyles) {
        try {
          const customStyles = JSON.parse(this.config.customStyles);
          Object.entries(customStyles).forEach(([key, value]) => {
            this.style.setProperty(key, String(value));
          });
        } catch {
          console.warn("Invalid custom styles JSON:", this.config.customStyles);
        }
      }
    } catch (error) {
      console.error("❌ Error applying custom styles:", error);
    }
  }

  private render() {
    try {
      console.log("🚀 Starting render...");

      if (!this.root) {
        this.root = ReactDOM.createRoot(this.shadowRoot!);
        console.log("📦 Created React root");
      }

      this.applyCustomStyles();
      const customTheme = this.createCustomTheme();

      const props = {
        theme: customTheme,
        apiEndpoint: this.config.apiEndpoint,
        webhookUrl: this.config.webhookUrl,
        ...this.config,
      };

      console.log("🎭 Rendering ChatWidget with props:", props);
      this.root.render(<ChatWidget {...props} />);
      console.log("✅ Render completed successfully");
    } catch (error) {
      console.error("❌ Error in render method:", error);

      // Try to render a simple fallback
      if (this.root) {
        try {
          this.root.render(
            <div
              style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                background: "red",
                color: "white",
                padding: "10px",
                borderRadius: "8px",
                zIndex: 9999,
              }}>
              Error loading widget
            </div>,
          );
        } catch (fallbackError) {
          console.error("❌ Even fallback render failed:", fallbackError);
        }
      }
    }
  }

  // Public method to force re-render (for debugging)
  public forceUpdate() {
    console.log("🔄 Force updating widget...");
    this.config = this.parseConfiguration();
    this.render();
  }
}

export default WidgetWebComponent;
