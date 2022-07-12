
  

import { createAction, props } from '@ngrx/store';

export const StartLoading = createAction('[Loading Page] Start Loading');
export const StopLoading = createAction('[Loading Page] Stop Loading');
export const ToggleLoading = createAction('[Loading Page] Toggle Loading');


// DATA EXAMPLE
// export const setScores = createAction('[Scoreboard Page] Set Scores', props<{game: Game}>());