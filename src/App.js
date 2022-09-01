import React, { Component } from "react";
import SwipeableListItem from "./SwipeableList/SwipeableListItemFn";
import SwipeableList from "./SwipeableList/SwipeableList";
import "./App.css";

const background = (
  <>
    <span>Approve</span>
    <span>Approve</span>
  </>
);
const fakeContent = (
  <div className="FakeContent">
    <span>Swipe to approve timecard</span>
  </div>
);

class App extends Component {
  render() {
    return (
      <div className="App">
        <SwipeableList background={background}>
          <SwipeableListItem>{fakeContent}</SwipeableListItem>
          <SwipeableListItem>{fakeContent}</SwipeableListItem>
          <SwipeableListItem>{fakeContent}</SwipeableListItem>
          <SwipeableListItem>{fakeContent}</SwipeableListItem>
          <SwipeableListItem>{fakeContent}</SwipeableListItem>
        </SwipeableList>
      </div>
    );
  }
}

export default App;
