import fs from 'fs';
import dotenv from 'dotenv';
import { sequelize, Recipe } from './src/models/index.js';

dotenv.config();

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    await sequelize.sync({ alter: true });
    console.log('Tables synchronized.');

    const raw = fs.readFileSync('./sample_data/recipes.json', 'utf-8');
    const data = JSON.parse(raw);

    for (const r of data) {
      const rating = isNaN(Number(r.rating)) ? null : Number(r.rating);
      const prep_time = isNaN(Number(r.prep_time)) ? null : Number(r.prep_time);
      const cook_time = isNaN(Number(r.cook_time)) ? null : Number(r.cook_time);
      const total_time = isNaN(Number(r.total_time)) ? null : Number(r.total_time);

      await Recipe.create({
        Contient: r.Contient || null,
        Country_State: r.Country_State || null,
        cuisine: r.cuisine || null,
        title: r.title || null,
        URL: r.URL || null,
        rating,
        prep_time,
        cook_time,
        total_time,
        description: r.description || null,
        ingredients: r.ingredients || null,       // JSON array
        instructions: r.instructions || null,     // JSON array
        nutrients: r.nutrients || null,           // JSON object
        serves: r.serves || null
      });
    }

    console.log('Seeding finished!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
