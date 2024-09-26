import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  searchTerm: string = '';
  books = [
    {
      title: 'Game of Thrones',
      author: 'George R.R Martin',
      image: 'assets/images/got.png',
      description: 'A Game of Thrones is the first novel in A Song of Ice and Fire, ' +
        'a series of fantasy novels by the American author George R. R. Martin. ' +
        'It was first published on August 6, 1996.'

    },
    {
      title: 'The Hobbit',
      author: 'J.R.R Tolkien',
      image: 'assets/images/hobbit.png',
      description: 'The Hobbit, or There and Back Again is a childrens fantasy novel ' +
        'by English author J. R. R. Tolkien. It was published on 21 September 1937 ' +
        'to wide critical acclaim, being nominated for the Carnegie Medal and awarded ' +
        'a prize from the New York Herald Tribune for best juvenile fiction.'

    }
    // Add more books as needed
  ];

  filteredBooks = this.books;

  onBookClick(book: any) {
    console.log('Book clicked:', book);
    // Add your logic here, e.g., navigate to a book detail page
  }

  filterBooks() {
    this.filteredBooks = this.books.filter(book =>
      book.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  clearFilters() {
    this.searchTerm = '';
    this.filteredBooks = this.books;
  }
}
