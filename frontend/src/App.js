import React from 'react';
import RecipesTable from './components/RecipesTable';
export default function App(){
  return (
    <div style={{ padding: 24 }}>
      <h2>Recipes</h2>
      <RecipesTable />
    </div>
  );
}