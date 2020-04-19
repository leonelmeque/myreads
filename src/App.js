import React from "react";
import * as BooksAPI from "./BooksAPI";
import "./App.css";
import { BrowserRouter as Router, Link} from "react-router-dom";
import PropTypes from "prop-types";
import Book from "./components/Book";
import Shelf from "./components/Shelf";

// Search View Component
function SearchResults(props) {
  let { books, addNewBook } = props;

  if (books === undefined || books.hasOwnProperty("length") === false) {
    return null;
  } else {
    return (
      <>
        {books.map((book) => {
          return (
            <div key={book.id}>
              <Book book={book} changeShelf={addNewBook} />
            </div>
          );
        })}
      </>
    );
  }
}

//About This Project View
// function About() {
//   return <></>;
// }

class BooksApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSearchPage: false,
      books: [],
      exploreBooks: [],
      activePage: 1,
      query: "",
      navPosition: -1,
      controlScroll: false,
    };
    this.myRef = React.createRef();
  }

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({
        books: books,
      });
    });

    window.addEventListener("scroll", this.watchScroll, true);
  }

  updateActivePage = (page, event) => {
    event.stopPropagation();
    this.setState((current) => ({
      activePage: page,
    }));
  };

  queryExploreBooks = (query) => {
    this.setState({
      query: query.concat(),
    });

    if (query.length > 0) {
      BooksAPI.search(query).then((books) => {
        if (books != null && books.hasOwnProperty("length"))
          this.setState((state) => ({
            exploreBooks: books.filter(
              (book) =>
                !this.state.books.find((bookInShef) => {
                  return book.id === bookInShef.id;
                })
            ),
          }));
      });
    }
  };

  cleanQuery = () => {
    this.queryExploreBooks("");
  };

  changeShelf = (receivedBook, newShelf) => {
    if (newShelf === "move") alert("Select a Shelf");
    else
      this.setState((state) => ({
        books: state.books.map((book) => {
          if (book.id === receivedBook.id) {
            book.shelf = newShelf;
            BooksAPI.update(receivedBook.id, newShelf);
            return book;
          }
          return book;
        }),
      }));
  };

  addNewBook = (newBook, newShelf) => {
    newBook.shelf = newShelf;

    if (this.state.books.indexOf(newBook) === -1) {
      this.setState((state) => ({
        books: state.books.concat(newBook),
      }));
      BooksAPI.update(newBook.id, newShelf);
    } else {
      alert("Book Already In Shelf");
    }
  };

  watchScroll = () => {
    let value = window.scrollY;
    const navElement = this.myRef.current;

    if (value > 44) {
      navElement.style.top = 0 + "px";
    } else if (value < 23) {
      navElement.style.top = 75 + "px";
    }
  };

  render() {
    let { query } = this.state;

    return (
      <Router>
        <div className="app">
          {this.state.showSearchPage ? (
            <div className="search-books">
              <div className="search-books-bar">
                <button
                  className="close-search"
                  onClick={() => {
                    window.addEventListener("scroll", this.watchScroll, true);
                    this.setState({ showSearchPage: false });
                  }}
                >
                  Close
                </button>
                <div className="search-books-input-wrapper">
                  {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                  <input
                    type="text"
                    value={query}
                    placeholder="Search by title or author"
                    onChange={(e) => {
                      this.queryExploreBooks(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="search-books-results">
                {query !== "" && (
                  <SearchResults
                    style={{ margin: "0px 20px 20px 0px" }}
                    books={this.state.exploreBooks}
                    addNewBook={this.addNewBook}
                  />
                )}
                <ol className="books-grid" />
              </div>
            </div>
          ) : (
            <div>
              <nav className="list-books-title">
                <h1>MyReads</h1>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
              </nav>
              <div className="page-container">
                <div className="page-side-nav" ref={this.myRef}>
                  <ol>
                    <li>
                      <Link
                        onClick={(e) => {
                          this.updateActivePage(1, e);
                        }}
                        to="/wantToRead"
                      >
                        Want To Read
                      </Link>
                      {this.state.activePage === 1 && (
                        <div className="link-circle"> </div>
                      )}{" "}
                    </li>
                    <li>
                      <Link
                        onClick={(e) => {
                          this.updateActivePage(2, e);
                        }}
                        to="/currentlyReading"
                      >
                        Currently Reading
                      </Link>
                      {this.state.activePage === 2 && (
                        <div className="link-circle"> </div>
                      )}{" "}
                    </li>
                    <li>
                      <Link
                        onClick={(e) => {
                          this.updateActivePage(3, e);
                        }}
                        to="/read"
                      >
                        Read
                      </Link>
                      {this.state.activePage === 3 && (
                        <div className="link-circle"> </div>
                      )}{" "}
                    </li>
                  </ol>
                </div>
                <div className="page-main-content">
                  <Shelf
                    books={this.state.books}
                    changeShelf={this.changeShelf}
                    selectedShelf={"wantToRead"}
                  />

                  <Shelf
                    books={this.state.books}
                    changeShelf={this.changeShelf}
                    selectedShelf={"currentlyReading"}
                  />
                  <Shelf
                    books={this.state.books}
                    changeShelf={this.changeShelf}
                    selectedShelf={"read"}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="open-search">
            <button
              onClick={() => {
                window.removeEventListener("scroll", this.watchScroll, true);
                this.setState({ showSearchPage: true });
              }}
            >
              Add a book
            </button>
            <span className="tooltip">Add New Book</span>
          </div>
        </div>
      </Router>
    );
  }
}

BooksApp.propTyoes = {
  exploreBooks: PropTypes.array,
};

export default BooksApp;
