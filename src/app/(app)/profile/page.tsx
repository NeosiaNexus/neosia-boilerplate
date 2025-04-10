import { Image as ImageIcon, Mail, Trash2, User } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import Link from 'next/link';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import auth from '@/lib/auth';

import UserSignoutButton from './components/user-signout-button';

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex justify-between items-center">
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
              <div className="space-y-2 cursor-not-allowed">
                <Button variant="outline" className="gap-2" type="button" disabled>
                  <ImageIcon className="h-4 w-4" />
                  Changer la photo
                </Button>
                <p className="text-sm text-muted-foreground">PNG, JPG jusqu&apos;à 2MB</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input id="name" name="name" defaultValue={session?.user.name} className="pl-9" />
                </div>
              </div>

              <div className="space-y-2 cursor-not-allowed">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={session?.user.email}
                    className="pl-9 "
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center gap-4 flex-wrap">
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
