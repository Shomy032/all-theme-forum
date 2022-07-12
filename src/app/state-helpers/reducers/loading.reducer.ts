import {  Action, createReducer, State , on, ActionReducer } from '@ngrx/store';
import { AppState } from 'src/app/models/app.state';
import { StartLoading, StopLoading, ToggleLoading } from "./../actions/loading.actions"
 
export const initialState = false;
  

const _loadingReducer = createReducer(
    initialState,
    on(StartLoading, state => true),
    on(StopLoading, state => false),
    on(ToggleLoading, state => !state),
  );
  
  
  export function loading(state: boolean | undefined, action: Action): any {
    return _loadingReducer(state, action);
  }