## ⚙️ Configuration des variables d'environnement

> Ce projet utilise **Prisma**, **Supabase**, **Better Auth**, **React Email**, **Nodemailer**, et potentiellement **Google OAuth**. Voici toutes les variables nécessaires à définir dans un fichier `.env` à la racine du projet.

### 🗄️ Base de données (Prisma)

```env
DATABASE_URL=postgresql://user:password@host:port/dbname
```

---

### 🔐 Authentification (Better Auth)

```env
BETTER_AUTH_SECRET=un_secret_fort
BETTER_AUTH_URL=http://localhost:3000/api/auth
```

---

### 🔑 OAuth (Google)

> Optionnel — à configurer si tu actives la connexion avec Google

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

### ☁️ Supabase (storage, fichiers, etc.)

```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=supabase-anon-or-service-role-key
```

---

### 📬 Envoi d’emails (Nodemailer)

> Utilisé pour `react-email` + `nodemailer` (emails transactionnels, magic links, etc.)

```env
MAILER_HOST=smtp.example.com
MAILER_PORT=465
MAILER_SECURE=true
MAILER_AUTH_USER=your@email.com
MAILER_AUTH_PASS=your-password
```

---

### ✅ Exemple de `.env.local` complet

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/neosia

BETTER_AUTH_SECRET=supersecret
BETTER_AUTH_URL=http://localhost:3000/api/auth

GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

SUPABASE_URL=https://xyzcompany.supabase.co
SUPABASE_KEY=public-anon-key

MAILER_HOST=smtp.mailtrap.io
MAILER_PORT=587
MAILER_SECURE=false
MAILER_AUTH_USER=username
MAILER_AUTH_PASS=password
```