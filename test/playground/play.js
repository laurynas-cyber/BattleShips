// https://web.dev/articles/drag-and-drop

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
const StartBtn = document.querySelector(".btnStart");
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
let PlayerTrophies = [];
let ComputerTrophies = [];
let notDropped;

let timerId;

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

const AllShipsArray = [carrier, battleship, cruiser, submarine, destroyer];
// add ships

function infoLine(message, color, turn = "Player's") {
  Message.innerHTML = message;
  Message.style.color = color;
  document.querySelector(".turn").innerHTML = turn;
}

function AllAroundBlocks(Boardblocks, block) {
  let numblockId = Number(block.dataset.id);
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
  allAroundBlock = allAroundBlock.filter(
    (block) => !block.classList.contains("used")
  );
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
    // block.classList.remove("drop-zone"); // reikes istrinti kai baigsiu daryt computer
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
        infoLine("You cant place here", "rgba(183, 138, 24, 0.821)");
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
        infoLine("You cant place here", "rgba(183, 138, 24, 0.821)");
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

let gameStart = false;
function dropShip(e) {
  e.target.classList.remove("dragover");
  const startId = Number(e.target.dataset.id);
  const ship = AllShipsArray[draggedShip.id];
  AddPlayerPiece(ship, startId);
  dragEnd();
  if (!notDropped) {
    draggedShip.remove();
    draggedShip = null;
  }
  if (UsedPlayerShipblocks.length == 17) {
    gameStart = true;
    console.log(gameStart);
    infoLine("Press START to begin the game", "rgba(172, 255, 47, 0.471)");
    timerId = setInterval((_) => {
      StartBtn.style.color =
        StartBtn.style.color == "yellowgreen"
          ? "rgba(172, 255, 47, 0.0)"
          : "yellowgreen";
    }, 800);
    StartBtn.addEventListener(
      "click",
      (event) => {
        console.log("clicked");
        infoLine("Game started, your turn", "rgba(172, 255, 47, 0.471)");
        clearInterval(timerId);
        StartBtn.style.color = "yellowgreen";
        Player();
      },
      { once: true }
    );
  }
}

AllPlayerShips.forEach((optionShip) =>
  optionShip.addEventListener("dragstart", dragStart)
);

AllPlayerShips.forEach((optionShip) =>
  optionShip.addEventListener("dragend", dragEnd)
);

AllPlayerBlocks.forEach((playerblock) => {
  playerblock.addEventListener("dragover", dragOver);
  playerblock.addEventListener("drop", dropShip);
  playerblock.addEventListener("dragleave", (e) => {
    if (e.target.classList.contains("drop-zone")) {
      e.target.classList.remove("dragover");
    }
  });
});

//animation

//add piece perdaryti i computer ir player

//start game

// function ComputersNextMove(LuckyBlock) {
//   let nextIndex;
//   let arr1 = AllAroundLuckyCrossBlocks(AllPlayerBlocks, LuckyBlock);
//   let arr2 = AllAroundBlocks(AllPlayerBlocks, LuckyBlock);
//   if (ComputerhitShip) {
//     console.log(nextIndex);
//     nextIndex = arr1[rand(0, arr1.length - 1)].dataset.id;
//     if (nextIndex == undefined) {
//       return (lastComputerLuckyHit = "");
//     } else return nextIndex;
//   } else {
//     console.log(nextIndex);
//     nextIndex = arr2[rand(0, arr2.length - 1)].dataset.id;
//     if (nextIndex == undefined) {
//       return (lastComputerLuckyHit = "");
//     } else return nextIndex;
//   }
// }

function AllAroundLuckyCrossBlocks(Boardblocks, block) {
  let numblockId = Number(block.dataset.id);
  let allAroundBlock = [];
  if (numblockId % 10 != 9 && numblockId % 10 != 0) {
    allAroundBlock.push(Boardblocks[numblockId + 1]);
    allAroundBlock.push(Boardblocks[numblockId - 1]);
    allAroundBlock.push(Boardblocks[numblockId + 1 * 10]);
    allAroundBlock.push(Boardblocks[numblockId - 1 * 10]);
  } else if (numblockId % 10 == 0) {
    allAroundBlock.push(Boardblocks[numblockId + 1]);
    allAroundBlock.push(Boardblocks[numblockId + 1 * 10]);
    allAroundBlock.push(Boardblocks[numblockId - 1 * 10]);
  } else if (numblockId % 10 == 9) {
    allAroundBlock.push(Boardblocks[numblockId - 1]);
    allAroundBlock.push(Boardblocks[numblockId + 1 * 10]);
    allAroundBlock.push(Boardblocks[numblockId - 1 * 10]);
  }
  allAroundBlock = allAroundBlock.filter((block) => block !== undefined);
  allAroundBlock = allAroundBlock.filter(
    (block) => !block.classList.contains("used")
  );
  return allAroundBlock;
}

let PlayerTurn = true;
let Gameover = false;
let lastComputerLuckyHit = "";
let lastSavedZone;
let FirstShot = true;
let sessionHit = { TrophiesLenght: 0, Trophies: [] };

function randUnusedZone() {
  let zone;
  do {
    zone = AllPlayerBlocks[rand(0, 99)];
    console.log("randFunk", zone);
  } while (zone.classList.contains("--used"));
  return zone;
}
function Randomhit() {
  PlayerTurn = true;
  sessionHit = {};
  sessionHit.TrophiesLenght = 0;
  sessionHit.Trophies = [];
  let zone = randUnusedZone();

  if (CheckAroundTakenBlocks(zone)) {
    lastComputerLuckyHit = "lucky";
    lastSavedZone = zone;
    zone.innerHTML = html;
    zone.classList.add("--used");
    infoLine("That was close!", "rgba(183, 138, 24, 0.821)", "Computer's");
    zone.querySelectorAll(".animation").forEach((animation) => {
      animation.style.border = "2px solid rgb(153, 186, 105)";
    });
  } else if (CheckHitTakenBlocks(zone)) {
    AllShipsArray.forEach((ship) => {
      if (zone.classList.contains(ship.name)) {
        ComputerTrophies.push(ship.name);

        let hitSum = ComputerTrophies.filter((word) => word == ship.name);
        if (ComputerTrophies.length == UsedShipblocks.length) {
          infoLine(
            `Computer sunk all your ships, you lost!`,
            "rgb(81, 27, 20)",
            "Computer's"
          );
          return (Gameover = true);
        } else if (hitSum.length == ship.length) {
          lastComputerLuckyHit = "";
          infoLine(
            `Computer sunk your ${ship.name}!`,
            "rgb(81, 27, 20)",
            "Computer's"
          );
        } else lastComputerLuckyHit = "hit";
        infoLine(
          `Your ${ship.name} was damaged`,
          "rgba(183, 138, 24, 0.821)",
          "Computer's"
        );
        sessionHit.Name = ship.name;
        sessionHit.Shiplength = ship.length;
        sessionHit.TrophiesLenght += 1;
        sessionHit.Trophies.push(zone);
      }
    });
    lastSavedZone = zone;
    zone.classList.add("--used");
    zone.innerHTML = Hithtml;
  } else if (!zone.classList.contains("--used") && !Gameover) {
    zone.classList.add("--used");
    zone.innerHTML = html;
    infoLine("Missed", "rgba(255, 255, 255, 0.666)", "Computer's");
  } else return Computer();
}

function Luckyhit(SavedZone) {
  PlayerTurn = true;
  let arr2 = AllAroundBlocks(AllPlayerBlocks, SavedZone);
  let RandomIndex;
  let zone;
  arr2 = arr2.filter((block) => !block.classList.contains("--used"));
  if (arr2 == []) {
    return Randomhit();
  }
  RandomIndex = Number(arr2[rand(0, arr2.length - 1)].dataset.id);

  zone = AllPlayerBlocks[RandomIndex];

  let arr2Check = arr2.some(
    (block) =>
      block.classList.contains("taken") && !block.classList.contains("--used")
  );

  if (CheckAroundTakenBlocks(zone)) {
    lastComputerLuckyHit = "lucky";
    lastSavedZone = !!arr2Check ? SavedZone : randUnusedZone();
    // lastSavedZone = zone;
    zone.innerHTML = html;
    zone.classList.add("--used");
    infoLine("That was close!", "rgba(183, 138, 24, 0.821)", "Computer's");
    zone.querySelectorAll(".animation").forEach((animation) => {
      animation.style.border = "2px solid rgb(153, 186, 105)";
    });
  } else if (CheckHitTakenBlocks(zone)) {
    AllShipsArray.forEach((ship) => {
      if (zone.classList.contains(ship.name)) {
        ComputerTrophies.push(ship.name);

        let hitSum = ComputerTrophies.filter((word) => word == ship.name);
        if (ComputerTrophies.length == UsedShipblocks.length) {
          infoLine(
            `Computer sunk all your ships, you lost!`,
            "rgb(81, 27, 20)",
            "Computer's"
          );
          return (Gameover = true);
        } else if (hitSum.length == ship.length) {
          lastComputerLuckyHit = "";
          infoLine(
            `Computer sunk your ${ship.name}!`,
            "rgb(81, 27, 20)",
            "Computer's"
          );
        } else lastComputerLuckyHit = "hit";

        infoLine(
          `Your ${ship.name} was damaged`,
          "rgba(183, 138, 24, 0.821)",
          "Computer's"
        );
        sessionHit.Name = ship.name;
        sessionHit.Shiplength = ship.length;
        sessionHit.Trophies.push(zone);
        sessionHit.TrophiesLenght += 1;
      }
    });
    lastSavedZone = zone;
    console.log(lastSavedZone);
    zone.classList.add("--used");
    zone.innerHTML = Hithtml;
  } else if (!zone.classList.contains("--used") && !Gameover) {
    zone.classList.add("--used");
    zone.innerHTML = html;
    infoLine("Missed", "rgba(255, 255, 255, 0.666)", "Computer's");
  } else return Computer();
}

function Shiphit(SavedZone) {
  PlayerTurn = true;
  let arr1;
  let RandomIndex;
  let zone;
  let differ;
  if (sessionHit.TrophiesLenght > 1) {
    differ =
      Number(sessionHit.Trophies[0].dataset.id) -
      Number(sessionHit.Trophies[1].dataset.id);

    RandomIndex = Number(SavedZone.dataset.id) - differ;
    console.log(lastSavedZone, differ, RandomIndex);
    if (RandomIndex % 10 == 0 && (RandomIndex + differ) % 10 == 9) {
      RandomIndex = Number(sessionHit.Trophies[0].dataset.id) + differ;
    } else if (
      AllPlayerBlocks[RandomIndex] == undefined ||
      AllPlayerBlocks[RandomIndex].classList.contains("--used")
    ) {
      RandomIndex = Number(sessionHit.Trophies[0].dataset.id) + differ;
      console.log(RandomIndex);
      if (AllPlayerBlocks[RandomIndex].classList.contains("--used")) {
        RandomIndex =
          Number(
            sessionHit.Trophies[sessionHit.Trophies.length - 1].dataset.id
          ) + differ;
        console.log(RandomIndex);
      }
    }
  } else {
    console.log();
    arr1 = AllAroundLuckyCrossBlocks(AllPlayerBlocks, SavedZone);
    arr1 = arr1.filter((block) => !block.classList.contains("--used"));
    if (arr1 == []) {
      return Randomhit();
    }
    RandomIndex = Number(arr1[rand(0, arr1.length - 1)].dataset.id);
    console.log(RandomIndex);
  }

  zone = AllPlayerBlocks[RandomIndex];
  if (sessionHit.TrophiesLenght == sessionHit.Shiplength) {
    console.log("samone");
    return Randomhit();
  }

  if (CheckAroundTakenBlocks(zone)) {
    lastComputerLuckyHit = "hit";
    lastSavedZone = lastSavedZone;
    zone.innerHTML = html;
    zone.classList.add("--used");
    infoLine("That was close!", "rgba(183, 138, 24, 0.821)", "Computer's");
    zone.querySelectorAll(".animation").forEach((animation) => {
      animation.style.border = "2px solid rgb(153, 186, 105)";
    });
  } else if (CheckHitTakenBlocks(zone)) {
    AllShipsArray.forEach((ship) => {
      if (zone.classList.contains(ship.name)) {
        ComputerTrophies.push(ship.name);
        let hitSum = ComputerTrophies.filter((word) => word == ship.name);
        if (ComputerTrophies.length == UsedShipblocks.length) {
          infoLine(
            `Computer sunk all your ships, you lost!`,
            "rgb(81, 27, 20)",
            "Computer's"
          );
          return (Gameover = true);
        } else if (hitSum.length == ship.length) {
          lastComputerLuckyHit = "";
          infoLine(
            `Computer sunk your ${ship.name}!`,
            "rgb(81, 27, 20)",
            "Computer's"
          );
        } else lastComputerLuckyHit = "hit";
        infoLine(
          `Your ${ship.name} was damaged`,
          "rgba(183, 138, 24, 0.821)",
          "Computer's"
        );
        //
        sessionHit.Name = ship.name;
        sessionHit.Shiplength = ship.length;
        sessionHit.Trophies.push(zone);
        sessionHit.TrophiesLenght += 1;
        if (sessionHit.TrophiesLenght == sessionHit.Shiplength) {
          sessionHit.Trophies.forEach((blockShip) => {
            AllAroundBlocks(AllPlayerBlocks, blockShip).forEach((block) =>
              block.classList.add("--used")
            );
          });
        }
      }
    });
    lastSavedZone = zone;
    zone.classList.add("--used");
    zone.innerHTML = Hithtml;
  } else if (!zone.classList.contains("--used") && !Gameover) {
    zone.classList.add("--used");
    zone.innerHTML = html;
    infoLine("Missed", "rgba(255, 255, 255, 0.666)", "Computer's");
  } else return Computer();
}

function Computer() {
  setTimeout((_) => {
    PlayerTurn = true;
    if (!Gameover) {
      switch (lastComputerLuckyHit) {
        case "": {
          console.log("rand");
          Randomhit();
          break;
        }
        case "lucky": {
          console.log("luck");
          console.log(lastSavedZone);
          Luckyhit(lastSavedZone);
          break;
        }
        case "hit": {
          console.log(lastSavedZone);
          console.log("hit");
          Shiphit(lastSavedZone);
          break;
        }
      }
    }
  }, 2000);
}

function Player() {
  ComputersBlock.forEach((zone) => {
    zone.addEventListener("click", function () {
      if (
        CheckAroundTakenBlocks(zone) &&
        !zone.classList.contains("--used") &&
        PlayerTurn == true &&
        !Gameover
      ) {
        console.log("P turn");
        PlayerTurn = false;
        zone.innerHTML = html;
        zone.classList.add("--used");
        infoLine("That was close!", "rgba(183, 138, 24, 0.821)");
        zone.querySelectorAll(".animation").forEach((animation) => {
          animation.style.border = "2px solid rgb(153, 186, 105)";
        });

        return Computer();
      } else if (
        !zone.classList.contains("--used") &&
        CheckHitTakenBlocks(zone) &&
        PlayerTurn == true &&
        !Gameover
      ) {
        console.log("P turn");
        AllShipsArray.forEach((ship) => {
          if (zone.classList.contains(ship.name)) {
            PlayerTrophies.push(ship.name);
            let hitSum = PlayerTrophies.filter((word) => word == ship.name);
            if (PlayerTrophies.length == UsedShipblocks.length) {
              infoLine(`You sunk all ships, you WON!`, "rgb(81, 27, 20)");
              return (Gameover = true);
            } else if (hitSum.length == ship.length) {
              infoLine(`You sunk his ${ship.name}!`, "rgb(81, 27, 20)");
            } else
              infoLine(
                `You damaged his ${ship.name}!`,
                "rgba(183, 138, 24, 0.821)"
              );
          }
        });
        PlayerTurn = false;
        zone.classList.add("--used");
        zone.innerHTML = Hithtml;
        return Computer();
      } else if (
        !zone.classList.contains("--used") &&
        PlayerTurn == true &&
        !Gameover
      ) {
        console.log("P turn");
        PlayerTurn = false;
        zone.classList.add("--used");
        zone.innerHTML = html;
        infoLine("Missed", "rgba(255, 255, 255, 0.666)");

        return Computer();
      }
    });
  });
}

// StartBtn.addEventListener("click", (event) => {
//   console.log("clicked");
//   // if (UsedPlayerShipblocks.length == 17) {
//   infoLine("Game started, your turn", "rgba(172, 255, 47, 0.471)");
//   clearInterval(timerId);
//   StartBtn.style.color = "yellowgreen";
//   Player();
//   // }
// });
