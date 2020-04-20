import React from "react";
import * as BooksAPI from "./BooksAPI";
import "./App.css";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import PropTypes from "prop-types";
import Shelf from "./components/Shelf";
import Search from './components/Search'


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
        if (books != null && books.hasOwnProperty("length")) {
          //Adding all search results books to none
          books.forEach((element) => {
            element.shelf = "none";
          });
          //adding books to state
          this.setState(() => ({
            exploreBooks: books.filter(
              (book) =>
                !this.state.books.find((bookInShef) => {
                  return book.id === bookInShef.id;
                })
            ),
          }));
          //Adding all books to the explore page
          this.setState((currentState) => ({
            exploreBooks: currentState.exploreBooks.concat(this.state.books),
          }));
        } else {
          this.setState({
            exploreBooks: [],
          });
        }
      });
    }
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
      alert("Book Already In Shelf, will only update to a new shelf :-)");
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
    return (
      <Router>
        <div className="app">
          <Switch>
            <Route exact path="/">
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
            </Route>
            <Route
              path="/search"
              component={() => (
                <Search
                  addNewBook={this.addNewBook}
                  books={this.state.books}
                  watchScroll={this.watchScroll}
                />
              )}
            />
          </Switch>
          <div className="open-search">
            <Link
              to="/search"
              onClick={() => {
                window.removeEventListener("scroll", this.watchScroll, true);
              }}
            >
              Add a book
            </Link>
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
