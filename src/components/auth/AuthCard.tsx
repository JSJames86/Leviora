import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";
import { Card, CardBody } from "@/components/ui/Card";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>
        <Card className="px-2">
          <CardBody className="pt-8">
            <div className="mb-6 text-center">
              <h1 className="font-heading text-2xl font-medium text-text-primary">{title}</h1>
              {subtitle && <p className="mt-2 text-sm text-text-secondary">{subtitle}</p>}
            </div>
            {children}
          </CardBody>
        </Card>
        {footer && <div className="mt-6 text-center text-sm text-text-secondary">{footer}</div>}
      </div>
    </div>
  );
}
