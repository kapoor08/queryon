import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from '@/components';
import { Button } from '@/components/ui/button';
import { Github, Mail } from 'lucide-react';
import Image from 'next/image';
import { ReactNode } from 'react';
import Link from 'next/link';
import { TranslatableText } from '../elements';

interface AuthFormContainerProps {
  title: string;
  description: string;
  children: ReactNode;
  bottomText: ReactNode;
}

const AuthFormContainer = ({
  title,
  description,
  children,
  bottomText,
}: AuthFormContainerProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center">
          <Link
            href="/"
            className="flex items-center justify-center space-x-2 mb-4"
          >
            <Image
              src="/logo.png"
              alt="logo"
              className="text-xl font-bold text-foreground"
              width={200}
              height={50}
            />
          </Link>
          <CardTitle className="text-2xl font-bold text-foreground">
            <TranslatableText text={title} />
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            <TranslatableText text={description} />
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {children}

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                <TranslatableText text="Or continue with" />
              </span>
            </div>
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="w-full bg-transparent cursor-pointer"
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
            <Button
              variant="outline"
              className="w-full bg-transparent cursor-pointer"
            >
              <Mail className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>

          {/* Bottom link */}
          <div className="text-center text-sm text-muted-foreground">
            {bottomText}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthFormContainer;
