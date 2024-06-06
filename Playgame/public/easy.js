/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*********************!*\
  !*** ./src/easy.js ***!
  \*********************/
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function rand(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
var DropZone = document.querySelectorAll(".drop-zone");
var AllShips = document.querySelectorAll(".ship");
var FlipBtn = document.querySelector(".btnFlip");
var ComputersBlock = document.querySelectorAll(".computer-board div");
var AllPlayerBlocks = document.querySelectorAll(".player-board div");
var Message = document.querySelector(".message");
var AllPlayerShips = document.querySelectorAll(".ship");
var StartBtn = document.querySelector(".btnStart");
var html = " <div class=\"zone nothit\">\n  <div class=\"animationNot-container\">\n    <div class=\"animationNot animation\"></div>\n    <div class=\"animationNot-delay animation\"></div>\n    <div class=\"animationNot-delay2 animation\"></div>\n  </div>\n  </div>";
var Hithtml = "<div class=\"zone hitSkull\">\n  <div class=\"skull\"><i class=\"fa-solid fa-skull\"></i></div>\n  </div>";
var angle = 0;
var UsedShipblocks = [];
var UsedPlayerShipblocks = [];
var PlayerTrophies = [];
var ComputerTrophies = [];
var notDropped;
var timerId;

//give every field Id

ComputersBlock.forEach(function (block, i) {
  block.dataset.id = i;
});
AllPlayerBlocks.forEach(function (block, i) {
  block.dataset.id = i;
});

//buttons

FlipBtn.addEventListener("click", function () {
  angle = angle === 0 ? 90 : 0;
  AllShips.forEach(function (ship) {
    ship.style.rotate = "".concat(angle, "deg");
  });
});

//ships creator
var Ship = /*#__PURE__*/_createClass(function Ship(name, length) {
  _classCallCheck(this, Ship);
  this.name = name;
  this.length = length;
});
var destroyer = new Ship("destroyer", 2);
var submarine = new Ship("submarine", 3);
var cruiser = new Ship("cruiser", 3);
var battleship = new Ship("battleship", 4);
var carrier = new Ship("carrier", 5);
var AllShipsArray = [carrier, battleship, cruiser, submarine, destroyer];
// add ships

function infoLine(message, color) {
  var turn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "Player's";
  Message.innerHTML = message;
  Message.style.color = color;
  document.querySelector(".turn").innerHTML = turn;
}
function AllAroundBlocks(Boardblocks, block) {
  var numblockId = Number(block.dataset.id);
  var allAroundBlock = [];
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
  allAroundBlock = allAroundBlock.filter(function (block) {
    return block !== undefined;
  });
  allAroundBlock = allAroundBlock.filter(function (block) {
    return !block.classList.contains("used");
  });
  return allAroundBlock;
}
function AllAroundLuckyCrossBlocks(Boardblocks, block) {
  var numblockId = Number(block.dataset.id);
  var allAroundBlock = [];
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
  allAroundBlock = allAroundBlock.filter(function (block) {
    return block !== undefined;
  });
  allAroundBlock = allAroundBlock.filter(function (block) {
    return !block.classList.contains("used");
  });
  return allAroundBlock;
}
function CheckAroundBlocksProduction(arr, shipName) {
  arr = arr.filter(function (block) {
    return !block.classList.contains(shipName);
  });
  return arr.every(function (block) {
    return !block.classList.contains("taken");
  });
}
function CheckAroundTakenBlocks(block) {
  return block.classList.contains("takenArround");
}
function CheckHitTakenBlocks(zone) {
  return zone.classList.contains("taken"); //ieskojimui
}
function AddPiece(ship) {
  var RandomIndex = rand(0, 99);
  var isHorrizontal = !!rand(0, 1);
  var validHoriz;
  var validBlock;
  var i = 0;
  var shipBlocks = [];
  do {
    if (isHorrizontal) {
      validBlock = ComputersBlock[RandomIndex + i];
      validHoriz = Number(ComputersBlock[RandomIndex].dataset.id) % 10 + ship.length <= 9;
      if (validHoriz && validBlock != undefined && !UsedShipblocks.includes(validBlock) && CheckAroundBlocksProduction(AllAroundBlocks(ComputersBlock, validBlock), ship.name)) {
        shipBlocks.push(validBlock);
      } else {
        i = 0;
        shipBlocks = [];
        RandomIndex = rand(0, 99);
      }
    } else if (!isHorrizontal) {
      validBlock = ComputersBlock[RandomIndex + i * 10];
      if (validBlock != undefined && !UsedShipblocks.includes(validBlock) && CheckAroundBlocksProduction(AllAroundBlocks(ComputersBlock, validBlock), ship.name)) {
        shipBlocks.push(validBlock);
      } else {
        i = 0;
        shipBlocks = [];
        RandomIndex = rand(0, 99);
      }
    }
    if (shipBlocks.length == ship.length) {
      shipBlocks.forEach(function (block) {
        return UsedShipblocks.push(block);
      });
    }
    i++;
  } while (shipBlocks.length != ship.length);
  shipBlocks.forEach(function (block, i) {
    block.classList.add(ship.name);
    block.classList.add("taken");
    // block.classList.remove("drop-zone"); // parodo visus computer blockus
    block.style.border = "1px solid greenyellow";
    AllAroundBlocks(ComputersBlock, block).forEach(function (blocks) {
      if (blocks != shipBlocks[i + 1] && !blocks.classList.contains("taken")) {
        blocks.classList.add("takenArround");
      }
    });
  });
}
AllShipsArray.forEach(function (ship) {
  return AddPiece(ship);
});

//player drop

function AddPlayerPiece(ship, startIndex) {
  var validHoriz;
  var validBlock;
  var i = 0;
  var shipBlocks = [];
  do {
    if (angle == 0) {
      validBlock = AllPlayerBlocks[startIndex + i];
      validHoriz = Number(AllPlayerBlocks[startIndex].dataset.id) % 10 + ship.length <= 10; // kazkodel cia 10 o computer 9
      if (validHoriz && !UsedPlayerShipblocks.includes(validBlock) && validBlock != undefined && CheckAroundBlocksProduction(AllAroundBlocks(AllPlayerBlocks, validBlock), ship.name)) {
        shipBlocks.push(validBlock);
      } else {
        infoLine("You cant place here", "rgba(183, 138, 24, 0.821)");
        notDropped = true;
        return false;
      }
    }
    if (angle == 90) {
      validBlock = AllPlayerBlocks[startIndex + i * 10];
      if (!UsedPlayerShipblocks.includes(validBlock) && validBlock != undefined && CheckAroundBlocksProduction(AllAroundBlocks(AllPlayerBlocks, validBlock), ship.name)) {
        shipBlocks.push(validBlock);
      } else {
        infoLine("You cant place here", "rgba(183, 138, 24, 0.821)");
        notDropped = true;
        return false;
      }
    }
    if (shipBlocks.length == ship.length) {
      shipBlocks.forEach(function (block) {
        return UsedPlayerShipblocks.push(block);
      });
    }
    i++;
  } while (shipBlocks.length != ship.length);
  shipBlocks.forEach(function (block, i) {
    block.classList.add(ship.name);
    block.classList.add("taken");
    block.classList.remove("drop-zone");
    block.style.border = "1px solid greenyellow";
    AllAroundBlocks(AllPlayerBlocks, block).forEach(function (blocks) {
      if (blocks != shipBlocks[i + 1] && !blocks.classList.contains("taken")) {
        blocks.classList.add("takenArround");
      }
    });
  });
}

// drag

var draggedShip;

//
function shadowedDragBlock(arr, percentP, percentC, etarget) {
  var ship = AllShipsArray[etarget.id];
  document.querySelector(".computer-board").style.opacity = percentC;
  arr.forEach(function (block) {
    if (block.classList.contains("taken") || block.classList.contains("takenArround")) {
      block.style.opacity = percentP;
    }
    if (angle == 0 && Number(block.dataset.id) % 10 + ship.length > 10) {
      block.style.opacity = percentP;
    } else if (angle == 90 && Number(block.dataset.id) + ship.length * 10 >= 110) {
      block.style.opacity = percentP;
    }
  });
  UsedPlayerShipblocks.forEach(function (block) {
    if (angle == 0) {
      for (var i = 1; i <= ship.length; i++) {
        var newIndexminus = Number(block.dataset.id) - i;
        var newIndextenminus = newIndexminus - 10;
        var newIndexplus = newIndexminus + 10;
        if (AllPlayerBlocks[newIndexminus] != undefined && Number(block.dataset.id) % 10 > 0) {
          AllPlayerBlocks[newIndexminus].style.opacity = percentP;
        }
        if (AllPlayerBlocks[newIndextenminus] != undefined && Number(block.dataset.id) % 10 > 0) {
          AllPlayerBlocks[newIndextenminus].style.opacity = percentP;
        }
        if (AllPlayerBlocks[newIndexplus] != undefined && Number(block.dataset.id) % 10 > 0) {
          AllPlayerBlocks[newIndexplus].style.opacity = percentP;
        }
      }
    } else if (angle == 90) {
      for (var _i = 1; _i <= ship.length; _i++) {
        var _newIndexminus = Number(block.dataset.id) - _i * 10;
        var _newIndextenminus = _newIndexminus - 1;
        var _newIndexplus = _newIndexminus + 1;
        if (AllPlayerBlocks[_newIndexminus] != undefined) {
          AllPlayerBlocks[_newIndexminus].style.opacity = percentP;
        }
        if (AllPlayerBlocks[_newIndextenminus] != undefined && Number(block.dataset.id) % 10 > 0) {
          AllPlayerBlocks[_newIndextenminus].style.opacity = percentP;
        }
        if (AllPlayerBlocks[_newIndexplus] != undefined && Number(block.dataset.id) % 10 < 9) {
          AllPlayerBlocks[_newIndexplus].style.opacity = percentP;
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
  AllPlayerBlocks.forEach(function (block) {
    return block.style.opacity = "100%";
  });
  document.querySelector(".computer-board").style.opacity = "100%";
}
function dropShip(e) {
  e.target.classList.remove("dragover");
  var startId = Number(e.target.dataset.id);
  var ship = AllShipsArray[draggedShip.id];
  AddPlayerPiece(ship, startId);
  dragEnd();
  if (!notDropped) {
    draggedShip.remove();
    draggedShip = null;
  }
  if (UsedPlayerShipblocks.length == 17) {
    infoLine("Press START to begin the game", "rgba(172, 255, 47, 0.471)");
    timerId = setInterval(function (_) {
      StartBtn.style.color = StartBtn.style.color == "yellowgreen" ? "rgba(172, 255, 47, 0.0)" : "yellowgreen";
    }, 800);
    StartBtn.addEventListener("click", function (event) {
      infoLine("Game started, your turn", "rgba(172, 255, 47, 0.471)");
      clearInterval(timerId);
      StartBtn.style.color = "yellowgreen";
      Player();
    }, {
      once: true
    });
  }
}
AllPlayerShips.forEach(function (optionShip) {
  return optionShip.addEventListener("dragstart", dragStart);
});
AllPlayerShips.forEach(function (optionShip) {
  return optionShip.addEventListener("dragend", dragEnd);
});
AllPlayerBlocks.forEach(function (playerblock) {
  playerblock.addEventListener("dragover", dragOver);
  playerblock.addEventListener("drop", dropShip);
  playerblock.addEventListener("dragleave", function (e) {
    if (e.target.classList.contains("drop-zone")) {
      e.target.classList.remove("dragover");
    }
  });
});

//animation

//add piece perdaryti i computer ir player

//start game

var PlayerTurn = true;
var Gameover = false;
var lastComputerLuckyHit = "";
var lastSavedZone;
var FirstShot = true;
var sessionHit = {
  TrophiesLenght: 0,
  Trophies: []
};
function randUnusedZone() {
  var zone;
  do {
    zone = AllPlayerBlocks[rand(0, 99)];
  } while (zone.classList.contains("--used"));
  return zone;
}
function executeHit(block) {
  AllShipsArray.forEach(function (ship) {
    if (block.classList.contains(ship.name)) {
      ComputerTrophies.push(ship.name);
      var hitSum = ComputerTrophies.filter(function (word) {
        return word == ship.name;
      });
      if (ComputerTrophies.length == UsedShipblocks.length) {
        infoLine("Computer sunk all your ships, you lost!", "rgb(81, 27, 20)", "Computer's");
        return Gameover = true;
      } else if (hitSum.length == ship.length) {
        lastComputerLuckyHit = "";
        infoLine("Computer sunk your ".concat(ship.name, "!"), "rgb(81, 27, 20)", "Computer's");
      } else lastComputerLuckyHit = "hit";
      infoLine("Your ".concat(ship.name, " was damaged"), "rgba(183, 138, 24, 0.821)", "Computer's");
      sessionHit.Name = ship.name;
      sessionHit.Shiplength = ship.length;
      sessionHit.TrophiesLenght += 1;
      sessionHit.Trophies.push(block);
    }
  });
  lastSavedZone = block;
  block.classList.add("--used");
  block.innerHTML = Hithtml;
}
function executeLuck(block) {
  block.innerHTML = html;
  block.classList.add("--used");
  infoLine("That was close!", "rgba(183, 138, 24, 0.821)", "Computer's");
  block.querySelectorAll(".animation").forEach(function (animation) {
    animation.style.border = "2px solid rgb(153, 186, 105)";
  });
}
function executeMiss(block) {
  block.classList.add("--used");
  block.innerHTML = html;
  infoLine("Missed", "rgba(255, 255, 255, 0.666)", "Computer's");
}
function Randomhit() {
  PlayerTurn = true;
  sessionHit = {};
  sessionHit.TrophiesLenght = 0;
  sessionHit.Trophies = [];
  var zone = randUnusedZone();
  if (CheckAroundTakenBlocks(zone)) {
    lastComputerLuckyHit = "lucky";
    lastSavedZone = zone;
    executeLuck(zone);
  } else if (CheckHitTakenBlocks(zone)) {
    executeHit(zone);
  } else if (!zone.classList.contains("--used") && !Gameover) {
    lastComputerLuckyHit = "";
    executeMiss(zone);
  } else return Computer();
}
function Luckyhit(SavedZone) {
  PlayerTurn = true;
  var arr2 = AllAroundBlocks(AllPlayerBlocks, SavedZone);
  var RandomIndex;
  var zone;
  arr2 = arr2.filter(function (block) {
    return !block.classList.contains("--used");
  });
  if (arr2 == []) {
    return Randomhit();
  }
  RandomIndex = Number(arr2[rand(0, arr2.length - 1)].dataset.id);
  zone = AllPlayerBlocks[RandomIndex];
  var arr2Check = arr2.some(function (block) {
    return block.classList.contains("taken") && !block.classList.contains("--used");
  });
  if (CheckAroundTakenBlocks(zone)) {
    lastComputerLuckyHit = "lucky";
    lastSavedZone = !!arr2Check ? SavedZone : randUnusedZone();
    return executeLuck(zone);
  } else if (CheckHitTakenBlocks(zone)) {
    return executeHit(zone);
  } else if (!zone.classList.contains("--used") && !Gameover) {
    return executeMiss(zone);
  } else return Computer();
}
function Shiphit(SavedZone) {
  PlayerTurn = true;
  var arr1;
  var RandomIndex;
  var zone;
  var differ;
  if (sessionHit.TrophiesLenght > 1) {
    differ = Number(sessionHit.Trophies[0].dataset.id) - Number(sessionHit.Trophies[1].dataset.id);
    RandomIndex = Number(SavedZone.dataset.id) - differ;
    if (RandomIndex % 10 == 0 && (RandomIndex + differ) % 10 == 9) {
      RandomIndex = Number(sessionHit.Trophies[0].dataset.id) + differ;
    } else if (AllPlayerBlocks[RandomIndex] == undefined || AllPlayerBlocks[RandomIndex].classList.contains("--used")) {
      RandomIndex = Number(sessionHit.Trophies[0].dataset.id) + differ;
      if (AllPlayerBlocks[RandomIndex].classList.contains("--used")) {
        RandomIndex = Number(sessionHit.Trophies[sessionHit.Trophies.length - 1].dataset.id) + differ;
      }
    }
  } else {
    arr1 = AllAroundLuckyCrossBlocks(AllPlayerBlocks, SavedZone);
    arr1 = arr1.filter(function (block) {
      return !block.classList.contains("--used");
    });
    if (arr1 == []) {
      return Randomhit();
    }
    RandomIndex = Number(arr1[rand(0, arr1.length - 1)].dataset.id);
  }
  zone = AllPlayerBlocks[RandomIndex];
  if (sessionHit.TrophiesLenght == sessionHit.Shiplength) {
    return Randomhit();
  }
  if (CheckAroundTakenBlocks(zone)) {
    lastComputerLuckyHit = "hit";
    lastSavedZone = lastSavedZone;
    executeLuck(zone);
  } else if (CheckHitTakenBlocks(zone)) {
    executeHit(zone);
    if (sessionHit.TrophiesLenght == sessionHit.Shiplength) {
      sessionHit.Trophies.forEach(function (blockShip) {
        AllAroundBlocks(AllPlayerBlocks, blockShip).forEach(function (block) {
          return block.classList.add("--used");
        });
      });
    }
  } else if (!zone.classList.contains("--used") && !Gameover) {
    executeMiss(zone);
  } else return Computer();
}
function Computer() {
  setTimeout(function (_) {
    PlayerTurn = true;
    if (!Gameover) {
      switch (lastComputerLuckyHit) {
        case "":
          {
            Randomhit();
            break;
          }
        case "lucky":
          {
            Luckyhit(lastSavedZone);
            break;
          }
        case "hit":
          {
            Shiphit(lastSavedZone);
            break;
          }
      }
    }
  }, 2000);
}
function Player() {
  ComputersBlock.forEach(function (zone) {
    zone.addEventListener("click", function () {
      if (CheckAroundTakenBlocks(zone) && !zone.classList.contains("--used") && PlayerTurn == true && !Gameover) {
        PlayerTurn = false;
        executeLuck(zone);
        return Computer();
      } else if (!zone.classList.contains("--used") && CheckHitTakenBlocks(zone) && PlayerTurn == true && !Gameover) {
        AllShipsArray.forEach(function (ship) {
          if (zone.classList.contains(ship.name)) {
            PlayerTrophies.push(ship.name);
            var hitSum = PlayerTrophies.filter(function (word) {
              return word == ship.name;
            });
            if (PlayerTrophies.length == UsedShipblocks.length) {
              infoLine("You sunk all ships, you WON!", "rgb(81, 27, 20)");
              return Gameover = true;
            } else if (hitSum.length == ship.length) {
              infoLine("You sunk his ".concat(ship.name, "!"), "rgb(81, 27, 20)");
            } else infoLine("You damaged his ".concat(ship.name, "!"), "rgba(183, 138, 24, 0.821)");
          }
        });
        PlayerTurn = false;
        zone.classList.add("--used");
        zone.innerHTML = Hithtml;
        return Computer();
      } else if (!zone.classList.contains("--used") && PlayerTurn == true && !Gameover) {
        PlayerTurn = false;
        executeMiss(zone);
        return Computer();
      }
    });
  });
}
/******/ })()
;