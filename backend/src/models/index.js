import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false
  }
);

export const Recipe = sequelize.define('Recipe', {
  Contient: { type: DataTypes.STRING },
  Country_State: { type: DataTypes.STRING },
  cuisine: { type: DataTypes.STRING },
  title: { type: DataTypes.STRING },
  URL: { type: DataTypes.STRING },
  rating: { type: DataTypes.FLOAT, allowNull: true },
  prep_time: { type: DataTypes.INTEGER, allowNull: true },
  cook_time: { type: DataTypes.INTEGER, allowNull: true },
  total_time: { type: DataTypes.INTEGER, allowNull: true },
  description: { type: DataTypes.TEXT },
  ingredients: { type: DataTypes.JSON },      
  instructions: { type: DataTypes.JSON },     
  nutrients: { type: DataTypes.JSON },        
  serves: { type: DataTypes.STRING }
}, {
  tableName: 'recipes',
  timestamps: false
});
