// server.js
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan'; // for logging
import { sequelize, Recipe } from './src/models/index.js';
import { Op } from 'sequelize';

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());             // ✅ allow cross-origin requests
app.use(morgan('dev'));      // ✅ logs requests in console

// Health check
app.get('/api/health', (req, res) => res.json({ ok: true }));

// GET /api/recipes?page=1&limit=10
app.get('/api/recipes', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { rows, count } = await Recipe.findAndCountAll({
      order: [['rating', 'DESC']],
      offset,
      limit
    });

    res.json({ page, limit, total: count, data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

// GET /api/recipes/search
// supports: title (partial), cuisine (exact), rating (>=4.5), total_time (<=120), calories (<=400)
app.get('/api/recipes/search', async (req, res) => {
  try {
    const { title, cuisine, rating, total_time, calories } = req.query;
    const where = {};

    if (title) {
      where.title = { [Op.like]: `%${title}%` };
    }
    if (cuisine) where.cuisine = cuisine;

    // rating filter
    if (rating) {
      const m = rating.match(/(>=|<=|=|>|<)?\s*(\d+(\.\d+)?)/);
      if (m) {
        const op = m[1] || '=';
        const val = parseFloat(m[2]);
        const map = { '>': Op.gt, '<': Op.lt, '>=': Op.gte, '<=': Op.lte, '=': Op.eq };
        where.rating = { [map[op]]: val };
      }
    }

    // total_time filter
    if (total_time) {
      const m = total_time.match(/(>=|<=|=|>|<)?\s*(\d+)/);
      if (m) {
        const op = m[1] || '=';
        const val = parseInt(m[2]);
        const map = { '>': Op.gt, '<': Op.lt, '>=': Op.gte, '<=': Op.lte, '=': Op.eq };
        where.total_time = { [map[op]]: val };
      }
    }

    // initial query
    let results = await Recipe.findAll({ where });

    // calories filter (inside nutrients JSON)
    if (calories) {
      const m = calories.match(/(>=|<=|=|>|<)?\s*(\d+)/);
      if (m) {
        const op = m[1] || '=';
        const intVal = parseInt(m[2]);
        const pass = (cStr) => {
          if (!cStr) return false;
          const n = parseInt(cStr.replace(/[^0-9]/g, ''));
          if (isNaN(n)) return false;
          switch (op) {
            case '>': return n > intVal;
            case '<': return n < intVal;
            case '>=': return n >= intVal;
            case '<=': return n <= intVal;
            case '=': return n === intVal;
            default: return n === intVal;
          }
        };
        results = results.filter(r => pass(r.nutrients && r.nutrients.calories));
      }
    }

    res.json({ data: results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
});

const PORT = process.env.PORT || 5000;
async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');
    await sequelize.sync();
    app.listen(PORT, () => console.log(`🚀 Server listening on http://localhost:${PORT}`));
  } catch (err) {
    console.error('❌ Failed to start', err);
  }
}
start();
