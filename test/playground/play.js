function rand(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const DropZone = document.querySelectorAll(".drop-zone");
const AllShips = document.querySelectorAll(".ship");
const FlipBtn = document.querySelector(".btnFlip");
const ComputersBlock = document.querySelectorAll(".computer-board div");

let html = ` <div class="zone nothit">
<div class="animationNot-container">
  <div class="animationNot"></div>
  <div class="animationNot-delay"></div>
  <div class="animationNot-delay2"></div>
</div>
</div>`;
let angle = 0;

//give every field Id

ComputersBlock.forEach((block, i) => {
  block.id = i;
  // block.style.backgroundColor = "rgb(2, 43, 79)";
});

//buttons

FlipBtn.addEventListener("click", function () {
  angle = angle === 0 ? 90 : 0;
  AllShips.forEach((ship) => {
    ship.style.rotate = `${angle}deg`;
  });
});

//ships creator
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

// add ships

function AddPiece(ship) {
  let RandomIndex = rand(0, 99);
  let isHorrizontal = !!rand(0, 1);

  let validBlock;
  let i = 0;
  let shipBlocks = [];

  do {
    if (isHorrizontal) {
      validBlock = ComputersBlock[RandomIndex + i];
      if (validBlock != undefined) {
        shipBlocks.push(validBlock);
      } else {
        i = 0;
        shipBlocks = [];
        RandomIndex = rand(0, 99);
      }
    } else if (!isHorrizontal) {
      validBlock = ComputersBlock[RandomIndex + i * 10];
      if (validBlock != undefined) {
        shipBlocks.push(validBlock);
      } else {
        i = 0;
        shipBlocks = [];
        RandomIndex = rand(0, 99);
      }
    }
    i++;
  } while (shipBlocks.length != ship.length);
  console.log(shipBlocks, ship.length, shipBlocks.length == ship.length);

  // for (let i = 0; i < ship.length; i++) {
  //   if (isHorrizontal) {
  //     validBlock = ComputersBlock[RandomIndex + i];
  //     // console.log(validBlock, i);
  //     if (validBlock == undefined) {
  //       i = 0;
  //       console.log(i);
  //     } else shipBlocks.push(ComputersBlock[RandomIndex + i]);
  //   } else if (!isHorrizontal) {
  //     validBlock = ComputersBlock[RandomIndex + i * 10];

  //     if (validBlock == undefined) {
  //       i = 0;
  //       console.log(i);
  //     } else shipBlocks.push(ComputersBlock[RandomIndex + i * 10]);
  //   }
  // }
  shipBlocks.forEach((block) => {
    block.classList.add(ship.name);
    block.classList.add("taken");
    block.classList.remove("drop-zone"); // reikes istrinti kai baigsiu daryt computer
    block.style.border = "1px solid greenyellow";
  });
}

// AllShipsArray.forEach((ship) => AddPiece(ship));

// AddPiece(destroyer);
AddPiece(submarine);

//animation

DropZone.forEach((zone) =>
  zone.addEventListener("click", function () {
    console.log(zone);
    zone.innerHTML = html;
  })
);

// DropZone.forEach((zone) => {
//   zone.addEventListener("dragover", function (event) {
//     event.preventDefault();
//   });
//   zone.addEventListener("drop", function (event) {
//     // zone.prepend(card);
//     zone.appendChild(card);
//   });
// });
