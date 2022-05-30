import * as ReadingListActions from './reading-list.actions';
import {
  initialState,
  readingListAdapter,
  reducer,
  State
} from './reading-list.reducer';
import { createBook, createReadingListItem } from '@tmo/shared/testing';

describe('Books Reducer', () => {
  describe('valid Books actions', () => {
    let state: State;

    beforeEach(() => {
      state = readingListAdapter.setAll(
        [createReadingListItem('A'), createReadingListItem('B')],
        initialState
      );
    });

    it('loadBooksSuccess should load books from reading list', () => {
      const list = [
        createReadingListItem('A'),
        createReadingListItem('B'),
        createReadingListItem('C')
      ];
      const action = ReadingListActions.loadReadingListSuccess({ list });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toEqual(3);
    });

    it('failedAddToReadingList should undo book addition to the state', () => {
      const action = ReadingListActions.failedAddToReadingList({
        book: createBook('B')
      });

      const result: State = reducer(state, action);

      expect(result.ids).toEqual(['A']);
    });

    it('failedRemoveFromReadingList should undo book removal from the state', () => {
      const action = ReadingListActions.failedRemoveFromReadingList({
        item: createReadingListItem('C')
      });

      const result: State = reducer(state, action);

      expect(result.ids).toEqual(['A', 'B', 'C']);
    });

    it('should load error for reading list', () => {
      const action = ReadingListActions.loadReadingListError({ error:'Error' });
      const result: State = reducer(initialState, action);
      expect(result.error).toBe('Error');
    });

    it('should add to reading list', () => {
      const action = ReadingListActions.addToReadingList({ book: createBook('F') });
      const result: State = reducer(initialState, action);
      expect(result.ids.length).toEqual(1);
    });

    it('should remove from reading list', () => {
      const list = [
        createReadingListItem('A'),
        createReadingListItem('B'),
        createReadingListItem('C')
      ];
      ReadingListActions.loadReadingListSuccess({ list });
      const action = ReadingListActions.removeFromReadingList({ item: createReadingListItem('F') });
      const result: State = reducer(initialState, action);
      expect(result.ids.length).toEqual(0);
    });

    it('confirmedMarkAsRead should mark a book as read', () => {
      const item = {
        ...createReadingListItem('A'),
        finished: true,
        finishedDate: new Date().toISOString()
      }
      const action = ReadingListActions.confirmedMarkAsRead({
        item
      });
      const result: State = reducer(state, action);
      expect(result.entities['A']).toEqual(item);
    });


    it('failedMarkAsRead should undo book reading status', () => {
      const item = {
        ...createReadingListItem('A'),
        finished: true,
        finishedDate: new Date().toISOString()
      }
      const action = ReadingListActions.failedMarkAsRead({
        item
      });
      const result: State = reducer(state, action);
      expect(result.entities['A'].finished).toEqual(false);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toEqual(initialState);
    });
  });
});
