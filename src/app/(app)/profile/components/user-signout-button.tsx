'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import authClient from '@/lib/auth/auth-client';

const UserSignoutButton = (): React.JSX.Element => {
  const router = useRouter();

  const handleSignOut = async (): Promise<void> => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/');
        },
      },
    });
  };

  return (
    <Button onClick={handleSignOut} variant="outline" size="icon" className="rounded-full">
      <LogOut />
    </Button>
  );
};

export default UserSignoutButton;
