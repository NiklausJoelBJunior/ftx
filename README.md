# FTX

Minimal farming app scaffold: an Expo/NativeWind mobile app, Express/PostgreSQL API, and static landing page.

## Run the API

```bash
cd server
cp .env.example .env
# Edit .env and paste your NeonDB DATABASE_URL and a JWT_SECRET.
npm install
psql "$DATABASE_URL" -f src/db/schema.sql
npm run seed
npm run dev
```

If `psql` is unavailable, `npm run seed` also creates the schema before inserting sample data.

## Run the mobile app

```bash
cd mobile
npm install
# Optional: set EXPO_PUBLIC_API_URL in your Expo environment.
npm start
```

For Expo Go on a physical phone:

1. Connect the phone and computer to the **same Wi-Fi network**.
2. In `mobile/.env`, set `EXPO_PUBLIC_API_URL` to `http://<COMPUTER_LAN_IP>:4000/api`.
3. Start the API with `cd server && npm run dev`.
4. Start Expo with `cd mobile && npm start`.
5. Scan the QR code with Expo Go or the phone camera.

Find your computer LAN IP with `hostname -I` on Linux, `ipconfig` on Windows, or `ifconfig` on macOS. Do not use `localhost` on the phone; it refers to the phone itself.

The demo account seeded by the server is `farmer@example.com` / `password123`.

## Landing page

GitHub Pages publishes [landing/index.html](/workspaces/ftx/landing/index.html) automatically.

When a GitHub Release is published with an `.apk` asset, the Pages workflow downloads it as `app/FTX.apk` and updates `app/version.json`. Android installs can replace the existing app when the APK keeps the same package name and signing key and its `versionCode` is higher.