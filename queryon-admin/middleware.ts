import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  // A list of all locales that are supported
  locales: [
    "en",
    "es",
    "fr",
    "de",
    "pt",
    "zh-CN",
    "ja",
    "ko",
    "hi",
    "it",
    "nl",
    "pl",
    "sv",
    "tr",
    "ar",
    "ru",
    "th",
    "vi",
  ],

  // Used when no locale matches
  defaultLocale: "en",

  // Locale detection
  localeDetection: true,

  // Domain-based routing (optional)
  domains: [
    {
      domain: "chatwidget.com",
      defaultLocale: "en",
      // Specify which locales are supported on this domain
      locales: [
        "en",
        "es",
        "fr",
        "de",
        "pt",
        "zh-CN",
        "ja",
        "ko",
        "hi",
        "it",
        "nl",
        "pl",
        "sv",
        "tr",
        "ar",
        "ru",
        "th",
        "vi",
      ],
    },
    {
      domain: "chatwidget.es",
      defaultLocale: "es",
      // You can specify only relevant locales for this domain
      locales: ["es", "en"],
    },
  ],
});

export const config = {
  // Match only internationalized pathnames
  matcher: [
    "/",
    "/(de|es|fr|pt|zh-CN|ja|ko|hi|it|nl|pl|sv|tr|ar|ru|th|vi)/:path*",
  ],
};
