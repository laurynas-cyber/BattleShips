function rand(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const DropZone = document.querySelectorAll(".drop-zone");
const AllShips = document.querySelectorAll(".ship");
const FlipBtn = document.querySelector(".btnFlip");
const ComputersBlock = document.querySelectorAll(".computer-board div");
const Message = document.querySelector(".message");
// const AnimationNot = document.querySelector()

let html = ` <div class="zone nothit">
<div class="animationNot-container">
  <div class="animationNot animation"></div>
  <div class="animationNot-delay animation"></div>
  <div class="animationNot-delay2 animation"></div>
</div>
</div>`;
let angle = 0;
let UsedShipblocks = [];

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
function checkAroundBlock(block) {
  let numblockId = Number(block.id);

  if (numblockId % 10 != 9 && numblockId % 10 != 0) {
    if (
      UsedShipblocks.includes(ComputersBlock[numblockId + 1]) ||
      UsedShipblocks.includes(ComputersBlock[numblockId - 1]) ||
      UsedShipblocks.includes(ComputersBlock[numblockId + 1 * 10]) ||
      UsedShipblocks.includes(ComputersBlock[numblockId - 1 * 10]) ||
      UsedShipblocks.includes(ComputersBlock[numblockId - 1 * 10 - 1]) ||
      UsedShipblocks.includes(ComputersBlock[numblockId - 1 * 10 + 1]) ||
      UsedShipblocks.includes(ComputersBlock[numblockId + 1 * 10 - 1]) ||
      UsedShipblocks.includes(ComputersBlock[numblockId + 1 * 10 + 1])
    ) {
      return true;
    }
  } else if (numblockId % 10 == 0) {
    if (
      UsedShipblocks.includes(ComputersBlock[numblockId + 1]) ||
      UsedShipblocks.includes(ComputersBlock[numblockId + 1 * 10]) ||
      UsedShipblocks.includes(ComputersBlock[numblockId - 1 * 10]) ||
      UsedShipblocks.includes(ComputersBlock[numblockId - 1 * 10 + 1]) ||
      UsedShipblocks.includes(ComputersBlock[numblockId + 1 * 10 + 1])
    ) {
      return true;
    }
  } else if (numblockId % 10 == 9) {
    if (
      UsedShipblocks.includes(ComputersBlock[numblockId - 1]) ||
      UsedShipblocks.includes(ComputersBlock[numblockId + 1 * 10]) ||
      UsedShipblocks.includes(ComputersBlock[numblockId - 1 * 10]) ||
      UsedShipblocks.includes(ComputersBlock[numblockId - 1 * 10 - 1]) ||
      UsedShipblocks.includes(ComputersBlock[numblockId + 1 * 10 - 1])
    ) {
      return true;
    }
  }
}

function ProducingShip(block, shipName) {
  let numblockId = Number(block.id);
  let allAroundBlock = [];
  if (numblockId % 10 != 9 && numblockId % 10 != 0) {
    allAroundBlock.push(ComputersBlock[numblockId + 1]);
    allAroundBlock.push(ComputersBlock[numblockId - 1]);
    allAroundBlock.push(ComputersBlock[numblockId + 1 * 10]);
    allAroundBlock.push(ComputersBlock[numblockId - 1 * 10]);
    allAroundBlock.push(ComputersBlock[numblockId - 1 * 10 - 1]);
    allAroundBlock.push(ComputersBlock[numblockId - 1 * 10 + 1]);
    allAroundBlock.push(ComputersBlock[numblockId + 1 * 10 - 1]);
    allAroundBlock.push(ComputersBlock[numblockId + 1 * 10 + 1]);
  } else if (numblockId % 10 == 0) {
    allAroundBlock.push(ComputersBlock[numblockId + 1]);
    allAroundBlock.push(ComputersBlock[numblockId + 1 * 10]);
    allAroundBlock.push(ComputersBlock[numblockId - 1 * 10]);
    allAroundBlock.push(ComputersBlock[numblockId - 1 * 10 + 1]);
    allAroundBlock.push(ComputersBlock[numblockId + 1 * 10 + 1]);
  } else if (numblockId % 10 == 9) {
    allAroundBlock.push(ComputersBlock[numblockId - 1]);
    allAroundBlock.push(ComputersBlock[numblockId + 1 * 10]);
    allAroundBlock.push(ComputersBlock[numblockId - 1 * 10]);
    allAroundBlock.push(ComputersBlock[numblockId - 1 * 10 - 1]);
    allAroundBlock.push(ComputersBlock[numblockId + 1 * 10 - 1]);
  }

  allAroundBlock = allAroundBlock.filter((block) => block !== undefined);
  allAroundBlock = allAroundBlock.filter(
    (block) => !block.classList.contains(shipName)
  );
  return allAroundBlock.every((block) => !block.classList.contains("taken"));
}

function AddPiece(ship) {
  let RandomIndex = rand(0, 99);
  let isHorrizontal = !!rand(0, 1);

  let validHoriz;
  let validBlock;
  let i = 0;
  let shipBlocks = [];

  do {
    if (isHorrizontal) {
      validBlock = ComputersBlock[RandomIndex + i];
      if (
        validBlock != undefined &&
        !UsedShipblocks.includes(validBlock) &&
        ProducingShip(validBlock, ship.name)
      ) {
        validHoriz =
          (Number(ComputersBlock[RandomIndex].id) % 10) + ship.length <= 9;
        if (validHoriz) {
          shipBlocks.push(validBlock);
        }
      } else {
        i = 0;
        shipBlocks = [];
        RandomIndex = rand(0, 99);
      }
    } else if (!isHorrizontal) {
      validBlock = ComputersBlock[RandomIndex + i * 10];
      if (
        validBlock != undefined &&
        !UsedShipblocks.includes(validBlock) &&
        ProducingShip(validBlock, ship.name)
      ) {
        shipBlocks.push(validBlock);
      } else {
        i = 0;
        shipBlocks = [];
        RandomIndex = rand(0, 99);
      }
    }
    if (shipBlocks.length == ship.length) {
      shipBlocks.forEach((block) => UsedShipblocks.push(block));
    }
    i++;
  } while (shipBlocks.length != ship.length);

  shipBlocks.forEach((block) => {
    block.classList.add(ship.name);
    block.classList.add("taken");
    block.classList.remove("drop-zone"); // reikes istrinti kai baigsiu daryt computer
    block.style.border = "1px solid greenyellow";
  });
}

AllShipsArray.forEach((ship) => AddPiece(ship));

//animation

DropZone.forEach((zone) =>
  zone.addEventListener("click", function () {
    console.log(zone);
    zone.innerHTML = html;
    if (checkAroundBlock(zone)) {
      Message.innerHTML = "That was close!";
      Message.style.color = "rgba(183, 138, 24, 0.821)";
      zone.querySelectorAll(".animation").forEach((animation) => {
        animation.style.border = "2px solid rgba(183, 138, 24)";
      });
    } else {
      Message.innerHTML = "Missed";
      Message.style.color = "rgba(172, 255, 47, 0.471)";
    }
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
