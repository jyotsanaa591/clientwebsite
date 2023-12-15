import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import clientsList from './features/clientsList';
import clients from './features/clients';
import recipe from './features/recipe';
import recipeList from './features/recipeList';
import combination from './features/combination';
import combinationList from './features/combinationList';
import combination_recipe from './features/combination_recipe';
import scheduleList from './features/scheduleList';
import schedule from './features/schedule';
import user from './features/user';

const clientRoot = combineReducers({
  clientsList: clientsList,
  clients: clients,
});

const scheduleRoot = combineReducers({
  scheduleList: scheduleList,
  schedule: schedule,
});

const recipeRoot = combineReducers({
  recipe: recipe,
  recipeList: recipeList,
});

const combinationRoot = combineReducers({
  combination: combination,
  combinationList: combinationList,
  combination_recipe: combination_recipe,
});

export const store = () => {
  return configureStore({
    reducer: {
      user: user,
      scheduleRoot: scheduleRoot,
      clientRoot: clientRoot,
      recipeRoot: recipeRoot,
      combinationRoot: combinationRoot,
    },
  });
};
