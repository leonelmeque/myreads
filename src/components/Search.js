import React from "react";
import { Link } from "react-router-dom";
import Book from "./Book";
import * as BooksAPI from "../BooksAPI";

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

export default class SearchView extends React.Component  {
  constructor(props) {
    super(props);
    this.state = {
      exploreBooks: [],
      query: "",
    };
  }

  
  queryExploreBooks = (query) => {
    this.setState({
      query: query.concat(),
    });

    if (this.state.query.length > 0) {
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
                !this.props.books.find((bookInShef) => {
                  return book.id === bookInShef.id;
                })
            ),
          }));
          //Adding all books to the explore page
          this.setState((currentState) => ({
            exploreBooks: currentState.exploreBooks.concat(this.props.books),
          }));
        } else {
          this.setState({
            exploreBooks: [],
          });
        }
      });
    }
  };

  cleanQuery = () => {
    this.queryExploreBooks("");
  };

  render() {
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link
            to="/"
            className="close-search"
            onClick={() => {
              this.cleanQuery();
              window.addEventListener("scroll", this.props.watchScroll, true);
            }}
          >
            Close
          </Link>
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
              value={this.state.query}
              placeholder="Search by title or author"
              onChange={(e) => {
                this.queryExploreBooks(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="search-books-results">
          {this.state.query !== "" && (
            <SearchResults
              style={{ margin: "0px 20px 20px 0px" }}
              books={this.state.exploreBooks}
              addNewBook={this.props.addNewBook}
            />
          )}
          <ol className="books-grid" />
        </div>
      </div>
    );
  }
}
