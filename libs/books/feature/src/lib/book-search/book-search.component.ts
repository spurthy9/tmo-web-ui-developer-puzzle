import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  getBooksError,
  ReadingListBook,
  searchBooks,
  removeFromReadingList
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit {
  books: ReadingListBook[];

  searchForm = this.fb.group({
    term: ''
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) {}

  readonly getAllBooks$: Observable<ReadingListBook[]> = this.store.select(getAllBooks);
  readonly bookSearchErr$: any = this.store.select(getBooksError);

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {
    this.searchForm.get("term").valueChanges.subscribe(newVal => {
      if(!newVal) this.store.dispatch(clearSearch());
    })
  }

  formatDate(date: void | string) {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
    const snackBarRef = this._snackBar.open(`Added ${book.title} to Reading List`, "Undo", {
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      duration: 3000,
    });
    snackBarRef.onAction().subscribe(() => {
      this.store.dispatch(removeFromReadingList({
        item: {
          bookId: book.id,
          ...book
        }
      }))
    })
  }

  searchExample() {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks() {
    const searchText = this.searchTerm;
    if (searchText) {
      this.store.dispatch(searchBooks({ term: searchText }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }
}
