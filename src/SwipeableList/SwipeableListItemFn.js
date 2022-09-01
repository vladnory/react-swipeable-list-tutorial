import "./SwipeableListItem.css";
import React, { useEffect } from "react";

const SwipeableListItemFn = (props) => {
  // DOM Refs
  let listElement = null,
    wrapper = null,
    background = null,
    // Drag & Drop
    dragStartX = 0,
    left = 0,
    dragged = false,
    // FPS Limit
    startTime,
    fpsInterval = 1000 / 60;

  useEffect(() => {
    window.addEventListener("mouseup", onDragEndMouse);
    window.addEventListener("touchend", onDragEndTouch);

    return () => {
      window.removeEventListener("mouseup", onDragEndMouse);
      window.removeEventListener("touchend", onDragEndTouch);
    };
  }, []);

  const onDragStartMouse = (evt) => {
    onDragStart(evt.clientX);
    window.addEventListener("mousemove", onMouseMove);
  };

  const onDragStartTouch = (evt) => {
    const touch = evt.targetTouches[0];
    onDragStart(touch.clientX);
    window.addEventListener("touchmove", onTouchMove);
  };

  const onDragStart = (clientX) => {
    dragged = true;
    dragStartX = clientX;
    listElement.className = "ListItem";
    startTime = Date.now();
    requestAnimationFrame(updatePosition);
  };

  const onDragEndMouse = (evt) => {
    window.removeEventListener("mousemove", onMouseMove);
    onDragEnd();
  };

  const onDragEndTouch = (evt) => {
    window.removeEventListener("touchmove", onTouchMove);
    onDragEnd();
  };

  const onDragEnd = () => {
    if (dragged) {
      dragged = false;
      const threshold = props.threshold || 0.3;
      if (Math.abs(left) > Math.abs(listElement.offsetWidth * threshold)) {
        left = 2 * left < 0 ? -listElement.offsetWidth : listElement.offsetWidth;
        wrapper.style.maxHeight = 0;
        onSwiped();
      } else {
        left = 0;
      }

      listElement.className = "BouncingListItem";
      listElement.style.transform = `translateX(${left}px)`;
    }
  };

  const onMouseMove = (evt) => {
    const newLeft = evt.clientX - dragStartX;
    left = newLeft;
  };

  const onTouchMove = (evt) => {
    const touch = evt.targetTouches[0];
    const newLeft = touch.clientX - dragStartX;
    left = newLeft;
  };

  const updatePosition = () => {
    if (dragged) {
      requestAnimationFrame(updatePosition);
    }

    const now = Date.now();
    const elapsed = now - startTime;

    if (dragged && elapsed > fpsInterval) {
      listElement.style.transform = `translateX(${left}px)`;

      const opacity = (Math.abs(left) / 100).toFixed(2);
      if (opacity < 1 && opacity.toString() !== background.style.opacity) {
        background.style.opacity = opacity.toString();
      }
      if (opacity >= 1) {
        background.style.opacity = "1";
      }

      startTime = Date.now();
    }
  };

  const onClicked = () => {
    if (props.onSwipe) {
      props.onSwipe();
    }
  };

  const onSwiped = () => {
    if (props.onSwipe) {
      props.onSwipe();
    }
  };

  return (
    <>
      <div className="Wrapper" ref={(div) => (wrapper = div)}>
        <div ref={(div) => (background = div)} className="Background">
          {props.background ? props.background : <span>Delete it</span>}
        </div>
        <div
          onClick={onClicked}
          ref={(div) => (listElement = div)}
          onMouseDown={onDragStartMouse}
          onTouchStart={onDragStartTouch}
          className="ListItem"
        >
          {props.children}
        </div>
      </div>
    </>
  );
};

export default SwipeableListItemFn;
