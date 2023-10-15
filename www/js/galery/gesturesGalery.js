let GestureElement = document.getElementById("galeryContainer");
let ComponentLeft = document.getElementById("gesture_slideLeft");
let backgroundGesture = document.getElementById("gestureBackground");
let bigImagesGesture = document.getElementById("appShowImageFull");

// create a simple instance
// by default, it only adds horizontal recognizers
let Gestures = new Hammer(GestureElement);
let GesturesBigImage = new Hammer(bigImagesGesture);

GesturesBigImage.on("swiperight", closeBigImage);

Gestures.on("swiperight swipeleft", handleDrag);
function closeBigImage(event) {
  console.log(event);
  if (event.type == "swiperight") {
    closeImageFullSize();
  }
}

function handleDrag(event) {
  if (event.type == "swiperight") {
    swipeRight();
  }
  if (event.type == "swipeleft") {
    swipeLeft();
  }
}

function swipeLeft() {
  backgroundGesture.style.display = "flex";
  setTimeout(() => {
    backgroundGesture.style.opacity = 0.9;
    $("#gesture_slideRight").css("margin-right", `${0}px`);
    nextPage();

    setTimeout(() => {
      $("#gesture_slideRight").css("margin-right", `${-50}px`);

      backgroundGesture.style.opacity = 0;
      setTimeout(() => {
        backgroundGesture.style.display = "none";
      }, 1000);
    }, 1000);
  }, 10);
}
function swipeRight() {
  backgroundGesture.style.display = "flex";
  setTimeout(() => {
    backgroundGesture.style.opacity = 0.9;
    $("#gesture_slideLeft").css("margin-right", `${-50}px`);
    previousPage();

    setTimeout(() => {
      $("#gesture_slideLeft").css("margin-right", `${50}px`);

      backgroundGesture.style.opacity = 0;
      setTimeout(() => {
        backgroundGesture.style.display = "none";
      }, 1000);
    }, 1000);
  }, 10);
}

function loadComponentsSliders() {
  $("#gesture_slideLeft").css("margin-right", `${50}px`);
  $("#gesture_slideLeft").css("transition", "0.3s");

  $("#gesture_slideRight").css("margin-right", `${-50}px`);
  $("#gesture_slideRight").css("transition", "0.3s");
}
loadComponentsSliders();
