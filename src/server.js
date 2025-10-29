// src/server.js
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes.js';

// ➜ Swagger UI + YAML support
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// __dirname shim for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// API routes
app.use('/tasks', taskRoutes);

// ➜ Serve OpenAPI docs at /api-docs (expects public/bundled.yaml)
const bundledPath = path.join(__dirname, '../public', 'bundled.yaml'); // note the .. because server.js is inside src/
if (fs.existsSync(bundledPath)) {
  const spec = yaml.parse(fs.readFileSync(bundledPath, 'utf8'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));
}

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    error: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
