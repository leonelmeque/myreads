import React from "react";

function Stars(props) {
  let count = parseInt(props.rating);
  const stars = [];
  while (count !== 0) {
    stars.push(<div className="rating" />);
    count--;
  }
  return (
    <>
      {stars.map((obj,index) => {
        return <div key={index}>{obj}</div>;
      })}
    </>
  );
}

//Book List View
export default function Book(props) {
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
              value={book.shelf}
            >
              {}
              <option value="move" disabled>
                Move to...
              </option>
             
              <option value="currentlyReading" >Currently Reading</option>
              <option value="wantToRead">Want to Read</option>
              <option value="read">Read</option>
              <option value="none" >
                None
              </option>
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
          <div style={{ display: "inline-flex" }}>
            Rating:{" "}
            {book.hasOwnProperty("averageRating") ? (
              <>{<Stars rating={book.averageRating} />}</>
            ) : (
              "Not rated Yet"
            )}
          </div>
        </div>
      </div>
    </>
  );
}
