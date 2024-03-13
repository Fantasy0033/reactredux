import {useHttp} from '../../hooks/http.hook';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

import { heroesFetching, heroesFetched, heroesFetchingError, heroDeleted } from '../heroesList/heroesSlice';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {

    const filteredHeroesSelector = createSelector( // для оптимизации(мемоизации), при нажатии all не будет рендерить заново если и так стоит all
        (state) => state.filters.activeFilter,
        (state) => state.heroes.heroes,
        (filter, heroes) => {
            if (filter === 'all') {
                console.log('render');
                return heroes;
            } else {
                return heroes.filter(item => item.element === filter);
            }
        }
    );

    const filteredHeroes = useSelector(filteredHeroesSelector);
    const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus); // useSelector - вытягиваем кусочки глобального стейта
    const dispatch = useDispatch(); // для получения функции usedispatch 
    const {request} = useHttp(); // вытягиваем request из useHttp
 
    useEffect(() => {
        dispatch(heroesFetching); // запускаем загрузку 
        request("http://localhost:3001/heroes") // запрос
            .then(data => dispatch(heroesFetched(data))) // записываем данные в стейт
            .catch(() => dispatch(heroesFetchingError())) // если ошибка то ставим в ошибку
        // eslint-disable-next-line
    }, []);

    const onDelete = useCallback((id) => {
        request(`http://localhost:3001/heroes/${id}`, 'DELETE')
        .then(data => console.log(data, 'Deleted'))
        .then(() => dispatch(heroDeleted(id)))
        .catch(err => console.log(err));
    }, [dispatch, request]);

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }

        return arr.map(({id, ...props}) => {
            return <HeroesListItem key={id} {...props} onDelete={() => onDelete(id)}/>
        })
    }

    const elements = renderHeroesList(filteredHeroes);
    return (
        <ul>
            {elements}
        </ul>
    )
}

export default HeroesList;