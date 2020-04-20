import React from "react";
import Book from "./Book";
// Shelf View Component
export default function Shelf(props){
  
    const { books, changeShelf, selectedShelf } = props; // Passing Props
    const header = () => {
      switch (selectedShelf) {
        case "wantToRead":
          return "Want To Read";
        case "currentlyReading":
          return "Currently Reading";
        case "read":
          return "Read";
        default:
          return "";
      }
    };

    if (books.find((el) => el.shelf === selectedShelf)) {
      return (
        <>
          <h3 id={header()}>{header()}</h3>
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
                return <Book key={book.id} book={book} changeShelf={changeShelf} />;
              }
            })}
          </div>
        </>
      );
    } else {
      return (
        <>
          <h3 id={header()}>{header()}</h3>
          Ops, no Books!
        </>
      );
    }
  }

