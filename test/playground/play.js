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
let UsedPlayerShipblocks = [];
let notDropped;

//give every field Id

ComputersBlock.forEach((block, i) => {
  block.id = i;
});

AllPlayerBlocks.forEach((block, i) => {
  block.dataset.id = i;
});

//buttons

FlipBtn.addEventListener("click", function () {
  angle = angle === 0 ? 90 : 0;
  console.log(angle);
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

function AllAroundBlocks(block, shipName = "") {
  let numblockId = Number(block.id); // reikia nustatyi ar bus user ar computer arba kompui padaryti irgi data set id
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
  if (!!shipName) {
    allAroundBlock = allAroundBlock.filter(
      (block) => block !== undefined && !block.classList.contains(shipName)
    );
    return allAroundBlock.every((block) => !block.classList.contains("taken")); // gamybai
  } else {
    allAroundBlock = allAroundBlock.filter((block) => block !== undefined);
    return allAroundBlock.some((block) => block.classList.contains("taken")); //ieskojimui
  }
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
        (Number(ComputersBlock[RandomIndex].id) % 10) + ship.length <= 9;
      if (
        validHoriz &&
        validBlock != undefined &&
        !UsedShipblocks.includes(validBlock) &&
        AllAroundBlocks(validBlock, ship.name)
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
        AllAroundBlocks(validBlock, ship.name) //uzloopina
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

//player drop

function AddPlayerPiece(ship, startIndex) {
  Message.innerHTML = "Place your ship";
  Message.style.color = "green";
  // notDropped = false;
  let validHoriz;
  let validBlock;
  let i = 0;
  let shipBlocks = [];

  console.log(startIndex);
  console.log(angle);
  console.log(UsedPlayerShipblocks);

  do {
    if (angle == 0) {
      validBlock = AllPlayerBlocks[startIndex + i];
      validHoriz =
        (Number(AllPlayerBlocks[startIndex].dataset.id) % 10) + ship.length <=
        10; // kazkodel cia 10 o computer 9
      if (
        validHoriz &&
        !UsedPlayerShipblocks.includes(validBlock) &&
        validBlock != undefined
        //  && AllAroundBlocks(validBlock, ship.name)
      ) {
        console.log(validBlock);
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
        validBlock != undefined
        // && AllAroundBlocks(validBlock, ship.name)
      ) {
        console.log(validBlock);
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

  shipBlocks.forEach((block) => {
    block.classList.add(ship.name);
    block.classList.add("taken");
    block.classList.remove("drop-zone"); // reikes istrinti kai baigsiu daryt computer
    block.style.border = "1px solid greenyellow";
  });
}

const AllPlayerShips = document.querySelectorAll(".ship");

let draggedShip;

AllPlayerShips.forEach((optionShip) =>
  optionShip.addEventListener("dragstart", dragStart)
);

AllPlayerBlocks.forEach((playerblock) => {
  playerblock.addEventListener("dragover", dragOver);
  playerblock.addEventListener("drop", dropShip);
});

function shadowedDragBlock() {
  document.querySelector(".computer-board").style.opacity = "50%";
  UsedPlayerShipblocks.forEach((block) => {
    AllAroundBlocks(block); // parasyti funkcija kuri surenka visus aplinkinius blokus

    block.style.opacity = "70%";
  });
}

function dragStart(e) {
  shadowedDragBlock();
  notDropped = false;
  draggedShip = e.target;
}

function dragOver(e) {
  e.preventDefault();
  // e.target.style.backgroundColor = "red";
}

function dropShip(e) {
  const startId = Number(e.target.dataset.id);
  const ship = AllShipsArray[draggedShip.id];

  AddPlayerPiece(ship, startId);
  document.querySelector(".computer-board").style.opacity = "100%";
  UsedPlayerShipblocks.forEach((block) => (block.style.opacity = "100%"));
  if (!notDropped) {
    draggedShip.remove();
  }
}

//add Highlight for blocks

function HighlightAre(startIndex, index) {
  AllPlayerBlocks;
}

//animation

DropZone.forEach((zone) =>
  zone.addEventListener("click", function () {
    console.log(zone);

    zone.innerHTML = html;
    if (AllAroundBlocks(zone)) {
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


// All arround funkcija pertvarkyti kad atskira funkcija rinktu ir grazintu masyva su aplinkiniais blokais 
// reikia nustatyi ar bus user ar computer arba kompui padaryti irgi data set id
