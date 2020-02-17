import generation from './generation';
import { combineReducers } from 'redux';
import account from './account';
import dragon from './dragon';
import accountDragons from './accountDragons';
import accountInfo from './accountInfo';
import publicDragons from './publicDragons';


export default combineReducers({
    generation,
    dragon,
    account,
    accountDragons,
    accountInfo,
    publicDragons
});