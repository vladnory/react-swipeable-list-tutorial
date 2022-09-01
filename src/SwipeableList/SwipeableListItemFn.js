import "./SwipeableListItem.css";
import React, { useEffect, useRef } from "react";

const SwipeableListItemFn = (props) => {
  let // Drag & Drop
    dragStartX = 0,
    left = 0,
    dragged = false,
    // FPS Limit
    startTime,
    fpsInterval = 1000 / 60;
  // Dom refs
  const listElement = useRef(null);
  const wrapper = useRef(null);
  const background = useRef(null);

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
    if (evt.touches.length === 1) {
      props.onSwipe("start");
      const touch = evt.targetTouches[0];
      onDragStart(touch.clientX);
      window.addEventListener("touchmove", onTouchMove);
    }
  };

  const onDragStart = (clientX) => {
    const list = document.getElementsByName("list-swipe")[0];
    list.style.position = "fixed";
    dragged = true;
    dragStartX = clientX;
    listElement.current.className = "ListItem";
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
      const list = document.getElementsByName("list-swipe")[0];
      list.style.position = "inherit";

      dragged = false;
      const threshold = props.threshold || 0.3;
      if (Math.abs(left) > Math.abs(listElement.current.offsetWidth * threshold)) {
        left = 2 * left < 0 ? -listElement.current.offsetWidth : listElement.current.offsetWidth;
        wrapper.current.style.maxHeight = 0;
        onSwiped();
      } else {
        left = 0;
      }

      listElement.current.className = "BouncingListItem";
      listElement.current.style.transform = `translateX(${left}px)`;
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
      listElement.current.style.transform = `translateX(${left}px)`;

      const opacity = (Math.abs(left) / 100).toFixed(2);
      if (opacity < 1 && opacity.toString() !== background.current.style.opacity) {
        background.current.style.opacity = opacity.toString();
      }
      if (opacity >= 1) {
        background.current.style.opacity = "1";
      }

      startTime = Date.now();
    }
  };

  const onClicked = () => {
    if (props.onSwipe) {
      props.onSwipe("clicked");
    }
  };

  const onSwiped = () => {
    if (props.onSwipe) {
      props.onSwipe("end");
    }
  };

  return (
    <>
      <div className="Wrapper" ref={wrapper}>
        <div ref={background} className="Background">
          {props.background ? props.background : <span>Delete it</span>}
        </div>
        <div
          onClick={onClicked}
          ref={listElement}
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
