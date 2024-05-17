const DropZone = document.querySelectorAll(".drop-zone");
const AllShips = document.querySelectorAll(".ship");
const FlipBtn = document.querySelector(".btnFlip");

let angle = 0;

//buttons

FlipBtn.addEventListener("click", function () {
  angle = angle === 0 ? 90 : 0;
  AllShips.forEach((ship) => {
    ship.style.rotate = `${angle}deg`;
  });
});

//
class Ship {
  constructor(name, length) {
    this.name = name;
    this.length = length;
  }
}

const destroyer = new Ship("destroyer", 2);
const submarine = new Ship("submarine", 3);
const cruiser = new Ship("cruiser", 3);
const battleship = new Ship("battleship", 4);
const carrier = new Ship("carrier", 5);

const AllShipsArray = [destroyer, submarine, cruiser, battleship, carrier];

DropZone.forEach((zone) => {
  zone.addEventListener("dragover", function (event) {
    event.preventDefault();
  });
  zone.addEventListener("drop", function (event) {
    // zone.prepend(card);
    zone.appendChild(card);
  });
});

//animation

DropZone.forEach((zone) =>
  zone.addEventListener("click", function () {
    let html = ` <div class="zone nothit">
  <div class="animationNot-container">
    <div class="animationNot"></div>
    <div class="animationNot-delay"></div>
    <div class="animationNot-delay2"></div>
  </div>
</div>`;
    console.log(zone);
    zone.innerHTML = html;
  })
);
