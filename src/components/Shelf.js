import React from 'react';
import Book from './Book'
// Shelf View Component
export default class Shelf extends React.Component {
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