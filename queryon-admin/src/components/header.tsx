"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSelector, ThemeToggle } from "@/components";
import { TranslatableText } from "@/shared/elements";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              ChatWidget
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <TranslatableText text="Features" />
            </Link>
            <Link
              href="#how-it-works"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <TranslatableText text="How it Works" />
            </Link>
            <Link
              href="#pricing"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <TranslatableText text="Pricing" />
            </Link>
            <Link
              href="#testimonials"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <TranslatableText text="Reviews" />
            </Link>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSelector />
            <ThemeToggle />
            <Button variant="ghost" asChild>
              <Link href="/auth/login">
                <TranslatableText text="Sign In" />
              </Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">
                <TranslatableText text="Get Started" />
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-8 w-8 px-0"
            >
              {isMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col space-y-4">
              <Link
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <TranslatableText text="Features" />
              </Link>
              <Link
                href="#how-it-works"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <TranslatableText text="How it Works" />
              </Link>
              <Link
                href="#pricing"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <TranslatableText text="Pricing" />
              </Link>
              <Link
                href="#testimonials"
                className="text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <TranslatableText text="Reviews" />
              </Link>
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                {/* Language Selector for Mobile */}
                <div className="pb-2">
                  <LanguageSelector />
                </div>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">
                    <TranslatableText text="Sign In" />
                  </Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">
                    <TranslatableText text="Get Started" />
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
