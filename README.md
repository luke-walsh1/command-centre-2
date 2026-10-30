# command-centre-2

command centre claude

url- https://ctpgfenlqvzgfhcveovi.supabase.co

publishable key-sb_publishable_qDLp-eHYmQ2rz_3TsAycGw_f3sUta5H

## Supabase setup
1. Supabase > SQL Editor > run `supabase-setup.sql` (creates the `dashboard_state` table with row level security).
2. Authentication > Sign In / Providers > Email: turn **Confirm email** off for instant sign-up, or leave it on and set
   Authentication > URL Configuration > Site URL to the GitHub Pages address.
3. Open the site, create an account. Each user's data is saved as one row and syncs automatically across devices.

The URL and publishable key above are also set at the top of the sync script in `index.html`.
