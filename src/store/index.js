import { configureStore } from '@reduxjs/toolkit';
import heroes from '../components/heroesList/heroesSlice';
import filters from '../components/heroesFilters/filtersSlice';

const stringMiddleware = () => (next) => (action) => { // наш middleware
    if (typeof action === 'string') { // проверили приходит ли строка
        return next({
            type: action
        })
    }
    return next(action);
};


/* const store = createStore(  // способ без redux toolkit
                            combineReducers({heroes, filters}), 
                            compose(applyMiddleware(thunk, stringMiddleware), // для добавления stringMiddleware и redux_devtools
                            window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
                            ); */

const store = configureStore({
    reducer: {heroes, filters}, // добавили наши редюсеры
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware), // добавили наш middleware
    devTools: process.env.NODE_ENV !== 'production' // если проект запущен не в режиме production то devtools запускаться не будет

})                            

export default store;