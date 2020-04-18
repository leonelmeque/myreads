import React from "react";
import * as BooksAPI from "./BooksAPI";
import "./App.css";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";

//Want To Read View Component
class WantToReadPage extends React.Component {
  render() {
    const { books, changeShelf } = this.props; // Passing Props
    return (
      <>
        {books.map((book) => {
          if (book.shelf !== "wantToRead") {
            return null;
          } else {
            return (
              <div className="list-book-description" key={book.id}>
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
                          book.imageLinks.smallThumbnail
                        }")`,
                      }}
                    />
                    <div className="book-shelf-changer">
                      <select
                        onChange={(e) => {
                          changeShelf(book.id, e.target.value);
                        }}
                      >
                        <option value="move" defaultValue>
                          Move to...
                        </option>
                        <option value="currentlyReading">
                          Currently Reading
                        </option>
                        <option value="wantToRead">Want to Read</option>
                        <option value="read">Read</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <h3>{book.title}</h3>
                  <div className="book-title">Year: {book.publishedDate}</div>

                  <div className="book-authors">Author: {book.authors}</div>
                  <div className="text-box">
                    <p>{book.description}</p>

                    {book.description.length < 550 ? (
                      <></>
                    ) : (
                      <p className="read-more">
                        <a href="/">See More</a>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          }
        })}
      </>
    );
  }
}

// Currently Reading View component
class CurrentlyReading extends React.Component {
  render() {
    const { books, changeShelf } = this.props; // Passing Props
    return (
      <>
        {books.map((book) => {
          if (book.shelf !== "currentlyReading") {
            return null;
          } else {
            return (
              <div key={book.id}>
                <h3>{book.title}</h3>
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
                          book.imageLinks.smallThumbnail
                        }")`,
                      }}
                    />
                    <div className="book-shelf-changer">
                      <select
                        onChange={(e) => {
                          changeShelf(book.id, e.target.value);
                        }}
                      >
                        <option value="move" defaultValue>
                          Move to...
                        </option>
                        <option value="currentlyReading">
                          Currently Reading
                        </option>
                        <option value="wantToRead">Want to Read</option>
                        <option value="read">Read</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </>
    );
  }
}
// Read View Component
class Read extends React.Component {
  render() {
    const { books, changeShelf } = this.props; // Passing Props
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          placeContent: "end"
        }}
      >
        {books.map((book) => {
          if (book.shelf !== "read") {
            return null;
          } else {
            return (
              <div key={book.id} style={{ alignSelf: "flex-end", flexBasis:"content", margin:"0px 20px" }}>
                <h3 style={{width: 240}}>{book.title}</h3>
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
                          book.imageLinks.smallThumbnail
                        }")`,
                      }}
                    />
                    <div className="book-shelf-changer">
                      <select
                        onChange={(e) => {
                          changeShelf(book.id, e.target.value);
                        }}
                      >
                        <option value="move" defaultValue>
                          Move to...
                        </option>
                        <option value="currentlyReading">
                          Currently Reading
                        </option>
                        <option value="wantToRead">Want to Read</option>
                        <option value="read">Read</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
    );
  }
}

// Search View Component

function SearchResults(props) {
  let { book, changeShelf } = props;

  return (
    <>
      <div className="book">
        <h3>{book.title}</h3>
        <div className="book-top">
          <div
            className="book-cover"
            style={{
              width: "100%",
              height: 293,
              backgroundRepeat: "non-repeat",
              backgroundSize: "100% 100%",

              backgroundImage: `url("${book.imageLinks.smallThumbnail}")`,
            }}
          />
          <div className="book-shelf-changer">
            <select
              onChange={(e) => {
                changeShelf(book.id, e.target.value);
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
      </div>
    </>
  );
}

class BooksApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSearchPage: false,
      books: [],
      activePage: 1,
      query: "",
    };
  }

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({
        books: books,
      });
    });
  }

  updateOnApi = (book, shelf) => {
    BooksAPI.update(book.shelf);
  };

  updateActivePage = (page, event) => {
    event.stopPropagation();
    this.setState((current) => ({
      activePage: page,
    }));
  };

  queryBooks = (query) => {
    console.log(query);
    this.setState(() => ({
      query: query.concat(),
    }));
  };

  cleanQuery = () => {
    this.queryBooks("");
  };

  changeShelf = (id, newShelf) => {
    if (newShelf === "move") alert("Select a Shelf");
    else
      this.setState((state) => ({
        books: state.books.map((book) => {
          if (book.id === id) {
            book.shelf = newShelf;
            BooksAPI.update(book, newShelf);
            return book;
          }
          return book;
        }),
      }));
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
                  onClick={() => this.setState({ showSearchPage: false })}
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
                      this.queryBooks(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="search-books-results">
                {query === ""
                  ? this.state.books.map((book) => {
                      return (
                        <SearchResults
                          style={{margin:"0px 20px 20px 0px"}}
                          key={book.id}
                          book={book}
                          changeShelf={this.changeShelf}
                        />
                      );
                    })
                  : this.state.books.map((book) => {
                      if (
                        book.title.toLowerCase().includes(query.toLowerCase())
                      ) {
                        return (
                          <SearchResults
                            key={book.id}
                            book={book}
                            changeShelf={this.changeShelf}
                          />
                        );
                      }
                      return null;
                    })}
                <ol className="books-grid" />
              </div>
            </div>
          ) : (
            <>
              <div className="list-books-title">
                <h1>MyReads</h1>
              </div>
              <div className="page-container">
                <div className="page-side-nav">
                  <ol>
                    <li>
                      {this.state.activePage === 1 && (
                        <div className="link-circle"> </div>
                      )}{" "}
                      <Link
                        onClick={(e) => {
                          this.updateActivePage(1, e);
                        }}
                        to="/"
                      >
                        Want To Read
                      </Link>
                    </li>
                    <li>
                      {this.state.activePage === 2 && (
                        <div className="link-circle"> </div>
                      )}
                      <Link
                        onClick={(e) => {
                          this.updateActivePage(2, e);
                        }}
                        to="/currentbooks"
                      >
                        Currently Reading
                      </Link>
                    </li>
                    <li>
                      {this.state.activePage === 3 && (
                        <div className="link-circle"> </div>
                      )}
                      <Link
                        onClick={(e) => {
                          this.updateActivePage(3, e);
                        }}
                        to="/read"
                      >
                        Read
                      </Link>
                    </li>
                  </ol>
                </div>
                <div className="page-main-content">
                  <Switch>
                    <Route
                      exact
                      path="/"
                      component={() => (
                        <WantToReadPage
                          books={this.state.books}
                          changeShelf={this.changeShelf}
                        />
                      )}
                    />
                    <Route
                      path="/currentbooks"
                      component={() => (
                        <CurrentlyReading
                          books={this.state.books}
                          changeShelf={this.changeShelf}
                        />
                      )}
                    />
                    <Route
                      path="/read"
                      component={() => (
                        <Read
                          books={this.state.books}
                          changeShelf={this.changeShelf}
                        />
                      )}
                    />
                  </Switch>
                </div>
              </div>
            </>
          )}
          <div className="open-search">
            <button onClick={() => this.setState({ showSearchPage: true })}>
              Add a book
            </button>
            <span className="tooltip">Add New Book</span>
          </div>
        </div>
      </Router>
    );
  }
}

export default BooksApp;
