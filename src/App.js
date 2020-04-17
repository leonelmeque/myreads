import React from "react";
import * as BooksAPI from "./BooksAPI";
import "./App.css";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";

//Returning the Want TO Read View
class WantToReadPage extends React.Component {
  render() {
    const { books, changeShelf } = this.props;
    return (
      <>
        {books.map((book) => (
          <div key={book.id}>
            {book.shelf !== "wantToRead" ? (
              <></>
            ) : (
              <div className="list-book-description" key={book.id}>
                <div className="book">
                  <div className="book-top">
                    <div
                      className="book-cover"
                      style={{
                        width: "100%",
                        height: 193,
                        backgroundRepeat: "non-repeat",
                        backgroundSize: "100% 100%",

                        backgroundImage: `url("${
                          book.imageLinks.smallThumbnail
                        }")`,
                      }}
                    />
                    <div className="book-shelf-changer">
                      <select onChange={(e)=>{changeShelf(book.id,e.target.value)}}>
                        <option value="move" disabled>
                          Move to...
                        </option>
                        <option value="currentlyReading">
                          Currently Reading
                        </option>
                        <option  value="wantToRead">Want to Read</option>
                        <option value="read">Read</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <h3>
                      {book.title}
                  </h3>
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
            )}
          </div>
        ))}
      </>
    );
  }
}

function CurrentlyReading(props) {
  const { books } = props;
  return (
    <>
      <div className="">Currently Reading</div>
    </>
  );
}

function Read(props) {
  return (
    <>
      <div className="">Read</div>
    </>
  );
}

class BooksApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSearchPage: false,
      books: [],
    };
  }

  componentDidMount() {
    BooksAPI.getAll().then((books) => {
      this.setState({
        books: books,
      });
    });
  }

  changeShelf= (id, newShelf)=> {
    this.setState((state) => ({
      books: state.books.map((book) => {
        if (book.id === id) {
          console.log("Book changed to " + newShelf);
          book.shelf = newShelf;
          return book;
        }
        return book;
      }),
    }));
  }

  render() {
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
                  <input type="text" placeholder="Search by title or author" />
                </div>
              </div>
              <div className="search-books-results">
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
                      <Link to="/">Want To Read</Link>
                    </li>
                    <li>
                      <Link to="/currentbooks">Currently Reading</Link>
                    </li>
                    <li>
                      <Link to="/read">Read</Link>
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
        </div>
      </Router>
    );
  }
}

export default BooksApp;
