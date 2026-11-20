import 'dotenv/config';
import { app } from './app.js';

const port = process.env.PORT || 4000;
app.listen(port, '0.0.0.0', () => {
  console.log(`FTX API listening on http://localhost:${port}`);
  console.log(`Phone on your LAN: http://<YOUR_COMPUTER_LAN_IP>:${port}/api`);
});
