'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}): React.JSX.Element {
  const router = useRouter();

  return (
    <div className="container mx-auto py-10">
      <Card className="mx-auto max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle>Une erreur est survenue</CardTitle>
          <CardDescription>
            {error.message ?? "Nous n'avons pas pu traiter votre demande"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Button onClick={() => router.push('/')} variant="outline">
              Retour à l&apos;accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
