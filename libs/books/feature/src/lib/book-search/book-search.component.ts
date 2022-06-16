import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  getBooksError,
  ReadingListBook,
  searchBooks
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import { Observable, Subscription } from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit, OnDestroy {
  books: ReadingListBook[];
  bookSearchSubscription$: Subscription;
  searchForm = this.fb.group({
    term: ''
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder
  ) {}

  readonly getAllBooks$: Observable<ReadingListBook[]> = this.store.select(getAllBooks);
  readonly bookSearchErr$: any = this.store.select(getBooksError);

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {
    this.bookSearchSubscription$ = this.searchForm.get("term").valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(newVal => {
      if (newVal) {
        this.store.dispatch(searchBooks({ term: newVal }));
      } else {
        this.store.dispatch(clearSearch());
      }
    })
  }

  formatDate(date: void | string) {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
  }

  searchExample() {
    this.searchForm.controls.term.setValue('javascript');
  }

  ngOnDestroy() {
    this.bookSearchSubscription$.unsubscribe();
  }
}
