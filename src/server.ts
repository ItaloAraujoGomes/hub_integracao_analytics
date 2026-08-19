import { app } from './app.js';

const port = 3000;

app.listen(port, () => {
  console.log(`API disponível em http://localhost:${port}`);
});
