import React from "react";
// import * as BooksAPI from './BooksAPI'
import "./App.css";
import * as Api from "./api";

function WantToReadPage(props) {
  let { books } = props;

  return (
    <>
      
        {books.map((book) => (
      <div className="list-book-description" key={book.id}>
          {console.log(book.id)}
            <div className="book" >
              <div className="book-top">
                <div
                  className="book-cover"
                  style={{
                    width: "100%",
                    height: 193,
                    backgroundRepeat: "non-repeat",
                    backgroundSize: "100% 100%",

                    backgroundImage:
                      `url("${book.imageLinks.smallThumbnail}")`,
                  }}
                />
                <div className="book-shelf-changer">
                  <select>
                    <option value="move" disabled>
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

            <div>
              <div className="book-title">1776</div>
              <div className="book-authors">David McCullough</div>
              <div style={{fontSize:"12pt"}}>
                <p style={{backgroundImage:'linear-gradient(to bottom, transparent, black);'}}>
                { book.description}
                </p>
                <p>
                  <a href='/'>Read More</a> 
                </p>
              </div>
            </div>
            </div>
        ))}
    
    </>
  );
}

function CurrentlyReading(props) {
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
      user: {
        current: [],
        want: [],
        read: [],
      },
    };
  }

  componentDidMount() {
    Api.getBooks().then((books) => {
      this.setState({
        books: books,
      });
    });
  }

  render() {
    return (
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
            <div className="page-container">
              <div className="page-side-nav">
                <ol>
                  <li>Want To Read</li>
                  <li>Currently Reading</li>
                  <li>Read</li>
                </ol>
              </div>
              <div className="page-main-content">
                <WantToReadPage books={this.state.books} />
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
}

export default BooksApp;
