import { adminClient, magicLinkClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

const authClient = createAuthClient({
  baseURL: 'http://localhost:3000',
  plugins: [adminClient(), magicLinkClient()],
});

export default authClient;
