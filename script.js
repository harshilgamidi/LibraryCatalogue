// Define the Book class
class Book {
    constructor(title, author, isbn, genre, imageUrl,available=true) {
        this._title = title;
        this._author = author;
        this._isbn = isbn;
        this._genre = genre;
        this._available = available;
        this._imageUrl = imageUrl;
    }

    // Getter methods
    getTitle() {
        return this._title;
    }

    getAuthor() {
        return this._author;
    }

    getISBN() {
        return this._isbn;
    }

    getGenre() {
        return this._genre;
    }

    getImageUrl() {
        return this._imageUrl;
    }

    // Getter and setter for availability
    isAvailable() {
        return this._available;
    }

    setAvailable(availability) {
        this._available = availability;
    }

    // Method to check out a book
    checkOut() {
        if (this.isAvailable()) { 
            this.setAvailable(false); 
            console.log(`"${this.getTitle()}" has been checked out.`);
            console.log(libraryCatalog.books);
            libraryCatalog.saveToLocalStorage();
        
        } else {
            console.log(`"${this.getTitle()}" is not available.`);
        }
    }
    
    // Method to return a book
    returnBook() {
        if (!this.isAvailable()) { 
            this.setAvailable(true); 
            console.log(`"${this.getTitle()}" has been returned.`);
        } else {
            console.log(`"${this.getTitle()}" is already available.`);
        }

    }

    // Method to display book details
    displayDetails() {
        console.log(`Image: ${this._imageUrl}`);
        console.log(`Title: ${this._title}`);
        console.log(`Author: ${this._author}`);
        console.log(`ISBN: ${this._isbn}`);
        console.log(`Genre: ${this._genre}`);
        console.log(`Availability: ${this._available ? 'Available' : 'Not Available'}`);
    }
}

// Define the ReferenceBook class, extending Book
class ReferenceBook extends Book {
    constructor(title, author, isbn, genre, imageUrl, referenceCode, available = true) {
        super(title, author, isbn, genre, imageUrl, available); 
        this._referenceCode = referenceCode;
    }

    // Method specific to ReferenceBook
    getReferenceCode() {
        return this._referenceCode;
    }
}
var libraryCatalog;
// LibraryCatalog class
class LibraryCatalog {
    constructor() {
        this.books = [];
        this.loadFromLocalStorage();
    }

    // Method to add a book to the catalog
    addBook(book) {
        this.books.push(book);
        this.saveToLocalStorage();
        console.log(`"${book.getTitle()}" has been added to the catalog.`);
    }

    // Method to remove a book from the catalog
    removeBook(isbn) {
        this.books = this.books.filter(book => book.getISBN() !== isbn);
        this.saveToLocalStorage();
        console.log(`Book with ISBN ${isbn} has been removed from the catalog.`);
    }

    // Method to save libraryCatalog to local storage
    saveToLocalStorage() {
        localStorage.setItem('libraryCatalog', JSON.stringify(this.books));
    }

    // Method to load libraryCatalog from local storage
    loadFromLocalStorage() {
        const storedBooks = localStorage.getItem('libraryCatalog');
        if (storedBooks) {
            try {
                const parsedBooks = JSON.parse(storedBooks);
                console.log('Parsed books:', parsedBooks); // Log the parsed books array
                if (Array.isArray(parsedBooks)) {
                    this.books = parsedBooks
                        .filter(bookData => bookData !== null && typeof bookData === 'object') // Filter out null values and non-objects
                        .map(bookData => {
                            console.log('Book data:', bookData); // Log the book data to inspect it
                            if (bookData._referenceCode) {
                                return new ReferenceBook(bookData._title, bookData._author, bookData._isbn, bookData._genre, bookData._imageUrl, bookData._referenceCode, bookData._available);
                            } else {
                                const newBook = new Book(bookData._title, bookData._author, bookData._isbn, bookData._genre, bookData._imageUrl);
                                // Set availability based on stored value
                                newBook.setAvailable(bookData._available);
                                return newBook;
                            }
                        });
                } else {
                    console.error('Stored books data is not in the expected format: not an array.');
                }
            } catch (error) {
                console.error('Error parsing stored books:', error);
            }
        }
    }
    
    
    

    // Method to search for a book by title, author, or genre
    search(query) {
        const results = this.books.filter(book =>
            book.getTitle().toLowerCase().includes(query.toLowerCase()) ||
            book.getAuthor().toLowerCase().includes(query.toLowerCase()) ||
            book.getGenre().toLowerCase().includes(query.toLowerCase())
        );
        return results;
    }

    // Method to display all books in the catalog
    displayAllBooks() {
        console.log("Library Catalog:");
        this.books.forEach(book => {
            book.displayDetails();
            console.log("-----------------------------");
        });
    }
}

// Function to remove a book
function removeBook(isbn) {
    libraryCatalog.removeBook(isbn);
    displayBooks(libraryCatalog.books);
}

// Function to display books in the UI

function displayBooks(books) {
    const bookListDiv = document.getElementById('bookList');
    bookListDiv.innerHTML = ''; // Clear previous content
    books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.innerHTML = `
            <div class="book-info">
                <div class="book-image">
                    <img src="${book.getImageUrl()}" alt="${book.getTitle()}">
                </div>
                <div class="book-details">
                    <strong>Title:</strong> ${book.getTitle()}<br>
                    <strong>Author:</strong> ${book.getAuthor()}<br>
                    <strong>ISBN:</strong> ${book.getISBN()}<br>
                    <strong>Genre:</strong> ${book.getGenre()}<br>
                    ${book instanceof ReferenceBook ? `<strong>Reference Code:</strong> ${book.getReferenceCode()}<br>` : ''}
                    <strong>Availability:</strong> ${book.isAvailable() ? 'Available' : 'Not Available'}<br>
                    ${book.isAvailable() ? `<button onclick="checkOutBook('${book.getISBN()}')">Check Out</button>` : `<button onclick="returnBook('${book.getISBN()}')">Return</button>`}
                    <span class="remove-book" data-isbn="${book.getISBN()}">&#10006;</span>
                </div>
            </div>
        `;
        bookListDiv.appendChild(bookDiv);
    });
}



// Function to add a new book
function addBook() {
    const imageUrl = document.getElementById('imageInput').value.trim();
    const title = document.getElementById('titleInput').value.trim();
    const author = document.getElementById('authorInput').value.trim();
    const isbn = document.getElementById('isbnInput').value.trim();
    const genre = document.getElementById('genreInput').value.trim();
    const referenceCode = document.getElementById('referenceInput').value.trim();

    // Check if any of the fields are empty
    if (!imageUrl || !title || !author || !isbn || !genre || !referenceCode) {
        alert('Please fill in all fields.');
        return;
    }

    const newBook = new ReferenceBook(title, author, isbn, genre, imageUrl, referenceCode);
    libraryCatalog.addBook(newBook);
    displayBooks(libraryCatalog.books);

    // Clear input fields
    document.getElementById('imageInput').value = '';
    document.getElementById('titleInput').value = '';
    document.getElementById('authorInput').value = '';
    document.getElementById('isbnInput').value = '';
    document.getElementById('genreInput').value = '';
    document.getElementById('referenceInput').value = '';
}

// Function to search for books
function searchBooks() {
    const query = document.getElementById('searchInput').value;
    const results = libraryCatalog.search(query);
    displayBooks(results);
}

// Function to check out a book
function checkOutBook(isbn) {
    const book = libraryCatalog.books.find(book => book.getISBN() === isbn);
    if (book) {
        book.checkOut();
        libraryCatalog.saveToLocalStorage();
        displayBooks(libraryCatalog.books);
    }
}

// Function to return a book
function returnBook(isbn) {
    const book = libraryCatalog.books.find(book => book.getISBN() === isbn);
    if (book) {
        book.returnBook();
        libraryCatalog.saveToLocalStorage();
        displayBooks(libraryCatalog.books);
    }
}

// Initialize Library Catalog
libraryCatalog = new LibraryCatalog();

// Display stored books when the HTML document is loaded
document.addEventListener('DOMContentLoaded', function () {
    libraryCatalog.saveToLocalStorage();
    libraryCatalog.loadFromLocalStorage();
    console.log(libraryCatalog.books);
    displayBooks(libraryCatalog.books);
});

