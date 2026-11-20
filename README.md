# FTX

Minimal farming app scaffold: a React Native/NativeWind mobile app, Express/PostgreSQL API, and static landing page.

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

Optional free live-data providers:

- Add `NEWS_API_KEY` from GNews to replace seed news with live agriculture news.
- Add `MARKET_API_KEY` from API Ninjas to replace fallback market prices with commodity data.
- Planting climate data uses Open-Meteo automatically; no key is required.

## Run the mobile app

```bash
cd mobile
npm install
# Set the API URL for a local Android build.
FTX_API_URL=http://<COMPUTER_LAN_IP>:4000/api npm run android
```

For native Android development on a physical phone:

1. Install Android Studio, the Android SDK, and platform tools.
2. Enable USB debugging and connect the phone, or start an Android emulator.
3. Start the API with `cd server && npm run dev`.
4. Connect the phone and computer to the same Wi-Fi network when using the computer's LAN API.
5. Run `FTX_API_URL=http://<COMPUTER_LAN_IP>:4000/api npm run android` from `mobile/`.

Find your computer LAN IP with `hostname -I` on Linux, `ipconfig` on Windows, or `ifconfig` on macOS. Do not use `localhost` on the phone; it refers to the phone itself.

The demo account seeded by the server is `farmer@example.com` / `password123`.

## Landing page

GitHub Pages publishes [landing/index.html](/workspaces/ftx/landing/index.html) automatically.

When a GitHub Release is published with an `.apk` asset, the Pages workflow downloads it as `app/FTX.apk` and updates `app/version.json`. Android installs can replace the existing app when the APK keeps the same package name and signing key and its `versionCode` is higher.

## Deploy the server and Neon database

Neon hosts PostgreSQL only; it cannot run the Express app process.

1. In Neon, copy the pooled PostgreSQL connection string.
2. Deploy [server/](/workspaces/ftx/server) to a Node host such as Render or Railway.
3. Set these environment variables on the server host:
   - `DATABASE_URL` = the Neon pooled connection string
   - `JWT_SECRET` = a long random value
   - `PORT` = `4000` or the host-provided port
   - optional `NEWS_API_KEY` and `MARKET_API_KEY`
4. Run `npm install`, `npm run seed`, then `npm start` on the server host.
5. Set the GitHub Actions `FTX_API_URL` secret to `<HTTPS_SERVER_URL>/api`.

GitHub Actions APK automation:

1. In the repository Settings, create the `FTX_API_URL` repository secret.
2. Run **Build and release FTX Android app** from the Actions tab, or publish a GitHub Release.
3. GitHub Actions runs the native Gradle build, uploads `FTX.apk` to the release, and the Pages workflow publishes it at `app/FTX.apk`.