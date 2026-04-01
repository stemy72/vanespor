# 🎯 Vanespor

Vaneloggings-app med Google-innlogging. Bygg gode vaner, én dag om gangen.

## Tech Stack

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + RLS)
- **Hosting:** Netlify

## Oppsett

### 1. Installer avhengigheter

```bash
npm install
```

### 2. Miljøvariabler

Opprett `.env` i prosjektets rot:

```
VITE_SUPABASE_URL=https://eshwhwaekdfldrmlfzqa.supabase.co
VITE_SUPABASE_ANON_KEY=din-anon-key
```

### 3. Google OAuth

1. Gå til [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Opprett OAuth 2.0 Client ID (Web application)
3. Legg til redirect URI: `https://eshwhwaekdfldrmlfzqa.supabase.co/auth/v1/callback`
4. Kopier Client ID og Client Secret til Supabase Dashboard → Authentication → Providers → Google
5. I Supabase → Authentication → URL Configuration:
   - Site URL: `https://din-app.netlify.app`
   - Redirect URLs: `https://din-app.netlify.app`, `http://localhost:5173`

### 4. Kjør lokalt

```bash
npm run dev
```

### 5. Deploy til Netlify

Push til GitHub og koble repoet i Netlify. Husk å legge inn miljøvariabler i Netlify Dashboard.

## Lisens

MIT
