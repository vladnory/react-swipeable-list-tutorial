import React from "react";
import "./SwipeableList.css";

const SwipeableList = ({ children, background }) => {
  let isDragging = false;

  const onSwipe = (evt) => {
    if (evt === "start") {
      isDragging = true;
    } else {
      isDragging = false;
    }
    console.log("onSwipe", isDragging);
  };
  const childrenWithProps = React.Children.map(children, (child) => {
    if (!child.props.background) {
      return React.cloneElement(child, { background, isDragging, onSwipe });
    }
    return child;
  });

  return (
    <div className="List" name="list-swipe">
      {childrenWithProps}
    </div>
  );
};

export default SwipeableList;
