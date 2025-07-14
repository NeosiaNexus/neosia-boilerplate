import { cookies } from 'next/headers';

import ClientToasts from './ServerClientToaster';

const ServerToaster = async (): Promise<React.JSX.Element> => {
  const cookieStore = await cookies();
  const toasts = cookieStore
    .getAll()
    .filter(cookie => cookie.name.startsWith('toast-') && cookie.value)
    .map(cookie => {
      const { message, type, description } = JSON.parse(cookie.value);
      return {
        id: cookie.name,
        message,
        type,
        description,
        dismiss: async () => {
          'use server';
          const cookieStore = await cookies();
          cookieStore.delete(cookie.name);
        },
      };
    });

  return <ClientToasts toasts={toasts} />;
};

export default ServerToaster;
