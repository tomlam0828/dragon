import generation from './generation';
import { combineReducers } from 'redux';
import account from './account';
import dragon from './dragon';
import accountDragons from './accountDragons';

export default combineReducers({
    generation,
    dragon,
    account,
    accountDragons
});