import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { SearchState } from './search.reducer';

export const selectSearchState = createFeatureSelector<AppState, SearchState>(
  'search'
);

export const selectQuery = createSelector(
  selectSearchState,
  (state: SearchState) => state.query
);

export const selectSearchResults = createSelector(
  selectSearchState,
  (state: SearchState) => state.results
);

export const selectSearchLoading = createSelector(
  selectSearchState,
  (state: SearchState) => state.loading
);

export const selectSearchError = createSelector(
  selectSearchState,
  (state: SearchState) => state.error
);
