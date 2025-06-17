import { Image as ImageIcon, Mail, Trash2, User } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import auth from '@/lib/auth/auth';

import UserSignoutButton from './components/user-signout-button';

export default async function ProfilePage(): Promise<React.JSX.Element> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="container mx-auto py-10">
      <Card className="mx-auto max-w-2xl">
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Profil</CardTitle>
            <CardDescription>
              Gérez vos informations personnelles et vos préférences
            </CardDescription>
          </div>
          <UserSignoutButton />
        </CardHeader>
        <CardContent>
          <form
            action={async (formData: FormData) => {
              'use server';

              const { name } = Object.fromEntries(formData);

              try {
                await auth.api.updateUser({
                  headers: await headers(),
                  body: {
                    name: name as string,
                  },
                });
                revalidatePath('/profile');
              } catch {
                throw new Error('Une erreur est survenue lors de la mise à jour de votre profil');
              }
            }}
            className="space-y-6"
          >
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={session?.user.image || undefined}
                  alt={session?.user.name || ''}
                />
                <AvatarFallback>
                  {session?.user.name
                    ?.split(' ')
                    .map(n => n[0])
                    .join('') || 'Aucun'}
                </AvatarFallback>
              </Avatar>
              <div className="cursor-not-allowed space-y-2">
                <Button variant="outline" className="gap-2" type="button" disabled>
                  <ImageIcon className="h-4 w-4" />
                  Changer la photo
                </Button>
                <p className="text-muted-foreground text-sm">PNG, JPG jusqu&apos;à 2MB</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <div className="relative">
                  <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input id="name" name="name" defaultValue={session?.user.name} className="pl-9" />
                </div>
              </div>

              <div className="cursor-not-allowed space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={session?.user.email}
                    className="pl-9"
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <Button type="submit" variant="destructive" className="gap-2">
                <Trash2 className="h-4 w-4" />
                Supprimer mon compte
              </Button>
              <div className="flex gap-4">
                <Link href="/">
                  <Button type="button" variant="outline">
                    Annuler
                  </Button>
                </Link>
                <Button type="submit">Enregistrer les modifications</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
