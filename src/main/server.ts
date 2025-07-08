import { createExpressApp } from './config/express';

const app = createExpressApp();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 HTTP Server running on port ${PORT}`);
});
