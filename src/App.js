import React from "react";
import * as BooksAPI from "./BooksAPI";
import "./App.css";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";

function Stars(props) {
  let count = parseInt(props.rating);
  const stars = [];
  while (count !== 0) {
    stars.push(<div className="rating" />);
    count--;
  }

  return <>{stars.map((obj) => obj)}</>;
}

//Book List View
function Book(props) {
  const { book, changeShelf } = props; // Passing Props

  return (
    <>
      <div className="book">
        <div className="book-top">
          <div
            className="book-cover"
            style={{
              width: "100%",
              height: 293,
              backgroundRepeat: "non-repeat",
              backgroundSize: "100% 100%",

              backgroundImage: `url("${
                book.hasOwnProperty("imageLinks")
                  ? book.imageLinks.thumbnail
                  : ""
              }")`,
            }}
          />
          <div className="book-shelf-changer">
            <select
              onChange={(e) => {
                changeShelf(book, e.target.value);
              }}
            >
              <option value="move" defaultValue>
                Move to...
              </option>
              <option value="currentlyReading">Currently Reading</option>
              <option value="wantToRead">Want to Read</option>
              <option value="read">Read</option>
              <option value="none">None</option>
            </select>
          </div>
        </div>
        <div>
          <h3
            style={{ fontSize: `${book.title.length > 25 ? "9pt" : "1.17em"}` }}
          >
            {book.title}
          </h3>
          <div className="book-title">Year: {book.publishedDate}</div>

          <div className="book-authors">Author: {book.authors}</div>
          <div style={{display:'inline-flex'}}>
            Rating: {book.hasOwnProperty("averageRating") ? <>{<Stars rating={book.averageRating}/>}</> : 'Not rated Yet' }
          </div>
        </div>
      </div>
    </>
  );
}

// Shelf View Component
class Shelf extends React.Component {
  render() {
    const { books, changeShelf, selectedShelf } = this.props; // Passing Props
    console.log(selectedShelf);
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          placeContent: "end space-between",
          padding: "0px 30px",
        }}
      >
        {books.map((book) => {
          if (book.shelf !== selectedShelf) {
            return null;
          } else {
            return <Book book={book} changeShelf={changeShelf} />;
          }
        })}
      </div>
    );
  }
}

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
function About() {
  return <></>;
}

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
    BooksAPI.search(query).then((books) => {
      this.setState((state) => ({
        exploreBooks: books,
      }));
    });

    this.setState({
      query: query.trim(),
    });
  };

  queryShelfBooks = (query) => {
    this.setState(() => ({
      query: query.trim(),
    }));
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
    if (
      this.state.books.find(
        (book) => book.id === newBook.id && book.shelf !== newBook.shelf
      ) !== -1
    ) {
      this.setState((state) => ({
        books: state.books.concat(newBook),
      }));
      BooksAPI.update(newBook.id, newShelf);
    }

    console.log(this.state.books);
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
                        to="/"
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
                        to="/currentbooks"
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
                  <Switch>
                    <Route
                      exact
                      path="/"
                      component={() => (
                        <Shelf
                          books={this.state.books}
                          changeShelf={this.changeShelf}
                          selectedShelf={"wantToRead"}
                        />
                      )}
                    />
                    <Route
                      path="/currentbooks"
                      component={() => (
                        <Shelf
                          books={this.state.books}
                          changeShelf={this.changeShelf}
                          selectedShelf={"currentlyReading"}
                        />
                      )}
                    />
                    <Route
                      path="/read"
                      component={() => (
                        <Shelf
                          books={this.state.books}
                          changeShelf={this.changeShelf}
                          selectedShelf={"read"}
                        />
                      )}
                    />
                  </Switch>
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
