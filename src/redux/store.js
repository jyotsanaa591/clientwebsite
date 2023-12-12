import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import clientsList from './features/clientsList';
import clients from './features/clients';
import recipe from './features/recipe';
import recipeList from './features/recipeList';
import combination from './features/combination';
import combinationList from './features/combinationList';
import user from './features/user';

const clientRoot = combineReducers({
  clientsList: clientsList,
  clients: clients,
});

const recipeRoot = combineReducers({
  recipe: recipe,
  recipeList: recipeList,
});

const combinationRoot = combineReducers({
  combination: combination,
  combinationList: combinationList,
});

export const store = () => {
  return configureStore({
    reducer: {
      user: user,
      clientRoot: clientRoot,
      recipeRoot: recipeRoot,
      combinationRoot: combinationRoot,
    },
  });
};
