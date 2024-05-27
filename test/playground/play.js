function rand(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const DropZone = document.querySelectorAll(".drop-zone");
const AllShips = document.querySelectorAll(".ship");
const FlipBtn = document.querySelector(".btnFlip");
const ComputersBlock = document.querySelectorAll(".computer-board div");
const AllPlayerBlocks = document.querySelectorAll(".player-board div");
const Message = document.querySelector(".message");
const AllPlayerShips = document.querySelectorAll(".ship");
// const AnimationNot = document.querySelector()

let html = ` <div class="zone nothit">
<div class="animationNot-container">
  <div class="animationNot animation"></div>
  <div class="animationNot-delay animation"></div>
  <div class="animationNot-delay2 animation"></div>
</div>
</div>`;

let Hithtml = `<div class="zone hitSkull">
<div class="skull"><i class="fa-solid fa-skull"></i></div>
</div>`;
let angle = 0;
let UsedShipblocks = [];
let UsedPlayerShipblocks = [];
let notDropped;

//give every field Id

ComputersBlock.forEach((block, i) => {
  block.dataset.id = i;
});

AllPlayerBlocks.forEach((block, i) => {
  block.dataset.id = i;
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

// const AllShipsArray = [destroyer, submarine, cruiser, battleship, carrier];
const AllShipsArray = [carrier, battleship, cruiser, submarine, destroyer];
// add ships

function AllAroundBlocks(Boardblocks, block) {
  let numblockId = Number(block.dataset.id); // reikia nustatyi ar bus user ar computer arba kompui padaryti irgi data set id
  let allAroundBlock = [];
  if (numblockId % 10 != 9 && numblockId % 10 != 0) {
    allAroundBlock.push(Boardblocks[numblockId + 1]);
    allAroundBlock.push(Boardblocks[numblockId - 1]);
    allAroundBlock.push(Boardblocks[numblockId + 1 * 10]);
    allAroundBlock.push(Boardblocks[numblockId - 1 * 10]);
    allAroundBlock.push(Boardblocks[numblockId - 1 * 10 - 1]);
    allAroundBlock.push(Boardblocks[numblockId - 1 * 10 + 1]);
    allAroundBlock.push(Boardblocks[numblockId + 1 * 10 - 1]);
    allAroundBlock.push(Boardblocks[numblockId + 1 * 10 + 1]);
  } else if (numblockId % 10 == 0) {
    allAroundBlock.push(Boardblocks[numblockId + 1]);
    allAroundBlock.push(Boardblocks[numblockId + 1 * 10]);
    allAroundBlock.push(Boardblocks[numblockId - 1 * 10]);
    allAroundBlock.push(Boardblocks[numblockId - 1 * 10 + 1]);
    allAroundBlock.push(Boardblocks[numblockId + 1 * 10 + 1]);
  } else if (numblockId % 10 == 9) {
    allAroundBlock.push(Boardblocks[numblockId - 1]);
    allAroundBlock.push(Boardblocks[numblockId + 1 * 10]);
    allAroundBlock.push(Boardblocks[numblockId - 1 * 10]);
    allAroundBlock.push(Boardblocks[numblockId - 1 * 10 - 1]);
    allAroundBlock.push(Boardblocks[numblockId + 1 * 10 - 1]);
  }
  allAroundBlock = allAroundBlock.filter((block) => block !== undefined);
  return allAroundBlock;
}

function CheckAroundBlocksProduction(arr, shipName) {
  arr = arr.filter((block) => !block.classList.contains(shipName));
  return arr.every((block) => !block.classList.contains("taken"));
}

function CheckAroundTakenBlocks(block) {
  return block.classList.contains("takenArround");
}

// function CheckAroundTakenBlocks(arr) {
//   return arr.some((block) => block.classList.contains("taken")); //ieskojimui
// }

function CheckHitTakenBlocks(zone) {
  return zone.classList.contains("taken"); //ieskojimui
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
      validHoriz =
        (Number(ComputersBlock[RandomIndex].dataset.id) % 10) + ship.length <=
        9;
      if (
        validHoriz &&
        validBlock != undefined &&
        !UsedShipblocks.includes(validBlock) &&
        CheckAroundBlocksProduction(
          AllAroundBlocks(ComputersBlock, validBlock),
          ship.name
        )
      ) {
        shipBlocks.push(validBlock);
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
        CheckAroundBlocksProduction(
          AllAroundBlocks(ComputersBlock, validBlock),
          ship.name
        ) //uzloopina
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

  shipBlocks.forEach((block, i) => {
    block.classList.add(ship.name);
    block.classList.add("taken");
    block.classList.remove("drop-zone"); // reikes istrinti kai baigsiu daryt computer
    block.style.border = "1px solid greenyellow";
    AllAroundBlocks(ComputersBlock, block).forEach((blocks) => {
      if (blocks != shipBlocks[i + 1] && !blocks.classList.contains("taken")) {
        blocks.classList.add("takenArround");
      }
    });
  });
}

AllShipsArray.forEach((ship) => AddPiece(ship));

//player drop

function AddPlayerPiece(ship, startIndex) {
  Message.innerHTML = "Place your ship";
  Message.style.color = "green";
  let validHoriz;
  let validBlock;
  let i = 0;
  let shipBlocks = [];

  do {
    if (angle == 0) {
      validBlock = AllPlayerBlocks[startIndex + i];
      validHoriz =
        (Number(AllPlayerBlocks[startIndex].dataset.id) % 10) + ship.length <=
        10; // kazkodel cia 10 o computer 9
      if (
        validHoriz &&
        !UsedPlayerShipblocks.includes(validBlock) &&
        validBlock != undefined &&
        CheckAroundBlocksProduction(
          AllAroundBlocks(AllPlayerBlocks, validBlock),
          ship.name
        )
      ) {
        shipBlocks.push(validBlock);
      } else {
        Message.innerHTML = "You cant place here";
        Message.style.color = "rgba(183, 138, 24, 0.821)";
        notDropped = true;
        return false;
      }
    }
    if (angle == 90) {
      validBlock = AllPlayerBlocks[startIndex + i * 10];
      if (
        !UsedPlayerShipblocks.includes(validBlock) &&
        validBlock != undefined &&
        CheckAroundBlocksProduction(
          AllAroundBlocks(AllPlayerBlocks, validBlock),
          ship.name
        )
      ) {
        shipBlocks.push(validBlock);
      } else {
        Message.innerHTML = "You cant place here";
        Message.style.color = "rgba(183, 138, 24, 0.821)";
        notDropped = true;
        return false;
      }
    }
    if (shipBlocks.length == ship.length) {
      shipBlocks.forEach((block) => UsedPlayerShipblocks.push(block));
    }
    i++;
  } while (shipBlocks.length != ship.length);

  shipBlocks.forEach((block, i) => {
    block.classList.add(ship.name);
    block.classList.add("taken");
    block.classList.remove("drop-zone"); // reikes istrinti kai baigsiu daryt computer
    block.style.border = "1px solid greenyellow";
    AllAroundBlocks(AllPlayerBlocks, block).forEach((blocks) => {
      if (blocks != shipBlocks[i + 1] && !blocks.classList.contains("taken")) {
        blocks.classList.add("takenArround");
      }
    });
  });
}

// drag

let draggedShip;

//
function shadowedDragBlock(arr, percentP, percentC, etarget) {
  const ship = AllShipsArray[etarget.id];
  document.querySelector(".computer-board").style.opacity = percentC;
  arr.forEach((block) => {
    if (
      block.classList.contains("taken") ||
      block.classList.contains("takenArround")
    ) {
      block.style.opacity = percentP;
    }

    if (angle == 0 && (Number(block.dataset.id) % 10) + ship.length > 10) {
      block.style.opacity = percentP;
    } else if (
      angle == 90 &&
      Number(block.dataset.id) + ship.length * 10 >= 110
    ) {
      block.style.opacity = percentP;
    }
  });

  UsedPlayerShipblocks.forEach((block) => {
    if (angle == 0) {
      for (let i = 1; i <= ship.length; i++) {
        let newIndexminus = Number(block.dataset.id) - i;
        let newIndextenminus = newIndexminus - 10;
        let newIndexplus = newIndexminus + 10;
        if (AllPlayerBlocks[newIndexminus] != undefined) {
          AllPlayerBlocks[newIndexminus].style.opacity = percentP;
        }
        if (AllPlayerBlocks[newIndextenminus] != undefined) {
          AllPlayerBlocks[newIndextenminus].style.opacity = percentP;
        }
        if (AllPlayerBlocks[newIndexplus] != undefined) {
          AllPlayerBlocks[newIndexplus].style.opacity = percentP;
        }
      }
    } else if (angle == 90) {
      for (let i = 1; i <= ship.length; i++) {
        let newIndexminus = Number(block.dataset.id) - i * 10;
        let newIndextenminus = newIndexminus - 1;
        let newIndexplus = newIndexminus + 1;
        if (AllPlayerBlocks[newIndexminus] != undefined) {
          AllPlayerBlocks[newIndexminus].style.opacity = percentP;
        }
        if (
          AllPlayerBlocks[newIndextenminus] != undefined &&
          Number(block.dataset.id) % 10 > 0
        ) {
          AllPlayerBlocks[newIndextenminus].style.opacity = percentP;
        }
        if (
          AllPlayerBlocks[newIndexplus] != undefined &&
          Number(block.dataset.id) % 10 < 9
        ) {
          AllPlayerBlocks[newIndexplus].style.opacity = percentP;
        }
      }
    }
  });
}

function dragStart(e) {
  shadowedDragBlock(AllPlayerBlocks, "20%", "50%", e.target);
  notDropped = false;
  draggedShip = e.target;
  console.log(e.target);
}

function dragOver(e) {
  e.preventDefault();
  if (e.target.classList.contains("drop-zone")) {
    e.target.classList.add("dragover");
  }
}

function dragEnd() {
  AllPlayerBlocks.forEach((block) => (block.style.opacity = "100%"));
  document.querySelector(".computer-board").style.opacity = "100%";
}

function dropShip(e) {
  const startId = Number(e.target.dataset.id);
  const ship = AllShipsArray[draggedShip.id];
  AddPlayerPiece(ship, startId);
  e.target.classList.remove("dragover");
  dragEnd();
  if (!notDropped) {
    draggedShip.remove();
  }
}

document.querySelectorAll("h5").forEach((h) =>
  h.addEventListener("dragstart", (event) => {
    event.stopPropagation();
    event.bubbles = false;
    console.log(event);
    console.log(event.target);
  })
);

document.querySelectorAll(".ship-container").forEach((h) =>
  h.addEventListener("dragstart", (event) => {
    event.stopPropagation();
    console.log(event.target);
  })
);

document
  .querySelector(".option-container")
  .addEventListener("dragstart", (event) => {
    event.stopPropagation();
    event.bubbles = false;
    console.log(event);
  });

AllPlayerShips.forEach((optionShip) => {
  optionShip.addEventListener("dragstart", (event) => {
    event.stopPropagation(); // nedirba
    dragStart(event);
    console.log(event.target); //nekonsolina kai dragginu uzrasa
  });
});

AllPlayerShips.forEach((optionShip) => {
  optionShip.addEventListener("dragend", (event) => {
    // draggedShip.remove();
    // notDropped = false;
    event.stopPropagation(); // nedirba
    dragEnd(event);
    // event.preventDefault();
  });
});

// AllPlayerShips.forEach((optionShip) =>
//   optionShip.addEventListener("dragend", dragEnd)
// ); atkomentuoti

AllPlayerBlocks.forEach((playerblock) => {
  playerblock.addEventListener("dragover", dragOver);
  // playerblock.addEventListener("drop", dropShip); // atkomentuoti
  playerblock.addEventListener("drop", (event) => {
    event.stopPropagation(); // nedirba
    dropShip(event);
  });
  playerblock.addEventListener("dragleave", (e) => {
    if (e.target.classList.contains("drop-zone")) {
      e.target.classList.remove("dragover");
    }
  });
});

//animation

DropZone.forEach((zone) =>
  zone.addEventListener("click", function () {
    zone.innerHTML = html;
    // zone.innerHTML = Hithtml;
    if (CheckAroundTakenBlocks(zone)) {
      zone.innerHTML = html;
      Message.innerHTML = "That was close!";
      Message.style.color = "rgba(183, 138, 24, 0.821)";
      zone.querySelectorAll(".animation").forEach((animation) => {
        animation.style.border = "2px solid rgb(162, 188, 122)";
        // animation.style.border = "2px solid greenyellow";
      });
    } else {
      Message.innerHTML = "Missed";
      Message.style.color = "rgba(172, 255, 47, 0.471)";
    }
    if (CheckHitTakenBlocks(zone)) {
      zone.innerHTML = Hithtml;
      console.log(CheckHitTakenBlocks(zone));
    }
  })
);

//add piece perdaryti i computer ir player
// sutvarkyti bubblinima t.y. perkelti zodzius
