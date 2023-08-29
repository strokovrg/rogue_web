var Game = {
    map: [],
    hero: {},
    enemies: [],
    swords: [],
    poisons: [],
    width: 40,
    height: 24,
    enemyBaseHealth: 10,
    enemyBaseDamage: 4,
    heroBaseHealth: 10,
    heroBaseDamage: 4,
    poisonBoost: 4,
    swordBoost: 4,
    enemyCount: 10,
    swordCount: 2,
    poisonCount: 10
}

function genMap() {
    // Заполнение карты стеной
    for (let y = 0; y < Game.height; y++) {
        let row = [];
        for (let x = 0; x < Game.width; x++) {
            row.push("Wall");
        }
        Game.map.push(row);
    }

    // Функция для проверки пересечения комнат
    function isOverlap(room1, room2) {
        return (
            room1.x1 <= room2.x2 &&
            room1.x2 >= room2.x1 &&
            room1.y1 <= room2.y2 &&
            room1.y2 >= room2.y1
        );
    }

    // Генерация прямоугольных комнат
    let numRooms = getRandomNumber(5, 10);
    let rooms = [];
    let verticalCorridors = [];
    let horizontalCorridors = [];
    let intersectedRooms = [];

    for (let i = 0; i < numRooms; i++) {
        const roomWidth = getRandomNumber(3, 8);
        const roomHeight = getRandomNumber(3, 8);

        const room = {
            x1: getRandomNumber(1, Game.width - roomWidth - 1),
            y1: getRandomNumber(1, Game.height - roomHeight - 1),
            x2: 0,
            y2: 0
        };

        room.x2 = room.x1 + roomWidth;
        room.y2 = room.y1 + roomHeight;
        // Проверка на пересечение с другими комнатами
        let isOverlapFound = false;
        for (let existingRoom of rooms) {
            if (isOverlap(room, existingRoom)) {
                isOverlapFound = true;
                break;
            }
        }

        // Если есть пересечение, пропустить комнату
        if (isOverlapFound) {
            continue;
        }

        // Добавление комнаты в карту
        for (let y = room.y1; y <= room.y2; y++) {
            for (let x = room.x1; x <= room.x2; x++) {
                Game.map[y][x] = "Floor";
            }
        }
        rooms.push(room);
    }

    //рейтинг лучших строк для коридоров
    for (let i = 0; i < rooms.length; i++) {
        intersectedRooms.push(0);
    }
    let RowRaiting = getRowRaitings(rooms, intersectedRooms);

    let numHorizontalCorridors = getRandomNumber(3, 5);

    //выбор лучших или случайных строк
    for (let y = 0; y < numHorizontalCorridors; y++) {
        if (intersectedRooms.indexOf(0) == -1) {
            while (1) {
                let newRow = getRandomNumber(0, Game.height - 1);
                if (horizontalCorridors.indexOf(newRow) == -1) {
                    horizontalCorridors.push(newRow);
                    break;
                }
            }
        }
        else {
            let newRow = RowRaiting.indexOf(Math.max.apply(null, RowRaiting));
            markIntersectedRoomsY(rooms, intersectedRooms, newRow);
            horizontalCorridors.push(newRow);
        }
        RowRaiting = getRowRaitings(rooms, intersectedRooms);
    }

    //рейтинг лучших столбцов для коридоров
    let ColumnRaiting = getColumnRaitings(rooms, intersectedRooms);
    let numVerticalCorridors = getRandomNumber(3, 5);

    //выбор лучших или случайных столбцов
    for (let x = 0; x < numVerticalCorridors; x++) {
        if (intersectedRooms.indexOf(0) == -1) {
            while (1) {
                let newColumn = getRandomNumber(0, Game.width - 1);
                if (verticalCorridors.indexOf(newColumn) == -1) {
                    verticalCorridors.push(newColumn);
                    break;
                }
            }
        }
        else {
            let newColumn = ColumnRaiting.indexOf(Math.max(ColumnRaiting));
            markIntersectedRoomsX(rooms, intersectedRooms, newColumn);
            verticalCorridors.push(newRow);
        }
        ColumnRaiting = getColumnRaitings(rooms, intersectedRooms);
    }

    // отрисовка коридоров
    for (let i = 0; i < horizontalCorridors.length; i++) {
        let y = horizontalCorridors[i];
        for (let x = 0; x < Game.width; x++) {
            Game.map[y][x] = 'Floor';
        }
    }

    for (let i = 0; i < verticalCorridors.length; i++) {
        for (let y = 0; y < Game.height; y++) {
            Game.map[y][verticalCorridors[i]] = 'Floor';
        }
    }
}

//составление рейтинга строк  
function getRowRaitings(rooms, intersectedRooms) {
    var RowRaiting = [];
    for (let y = 0; y < Game.height; y++) {
        let raiting = 0;
        for (let r = 0; r < rooms.length; r++) {
            if (y <= rooms[r]?.y2 + 1 && y >= rooms[r]?.y1 - 1 && intersectedRooms[r] == 0) {
                raiting++;
            }
        }
        RowRaiting.push(raiting);
    }
    return RowRaiting;
}
//составление рейтинга столбцов  
function getColumnRaitings(rooms, intersectedRooms) {
    var ColumnRaiting = [];
    for (let x = 0; x < Game.width; x++) {
        let raiting = 0;
        for (let r = 0; r < rooms.length; r++) {
            if (x <= rooms[r]?.x2 + 1 && x >= rooms[r]?.x1 - 1 && intersectedRooms[r] == 0) {
                raiting++;
            }
        }
        ColumnRaiting.push(raiting);
    }
    return ColumnRaiting;
}

function markIntersectedRoomsY(rooms, intersectedRooms, y) {
    for (let r = 0; r < rooms.length; r++) {
        if (y <= rooms[r]?.y2 + 1 && y >= rooms[r]?.y1 - 1) {
            intersectedRooms[r] = 1;
        }
    }
}
function markIntersectedRoomsX(rooms, intersectedRooms, x) {
    for (let r = 0; r < rooms.length; r++) {
        if (x <= rooms[r]?.x2 + 1 && x >= rooms[r]?.x1 - 1) {
            intersectedRooms[r] = 1;
        }
    }
}

function genStuff() {
    let freeTiles = [];
    for (let y = 0; y < Game.height; y++) {
        for (let x = 0; x < Game.width; x++) {
            if (Game.map[y][x] === "Floor") {
                freeTiles.push([y, x]);
            }
        }
    }
    position = genStuffObjects(Game.swordCount, "Sword", freeTiles);
    position = genStuffObjects(Game.poisonCount, "Poison", freeTiles);
    position = genStuffObjects(Game.enemyCount, "Enemy", freeTiles);
    position = genStuffObjects(1, "Hero", freeTiles);
}

function genStuffObjects(num, object, freeTiles) {
    if (object == "Hero" && num != 1) {
        alert("Multiple Heroes");
        return;
    }
    for (let i = 0; i < num; i++) {
        let n = getRandomNumber(0, freeTiles.length - 1);
        switch (object) {
            case "Sword":
                Game.swords.push({
                    y: freeTiles[n][0],
                    x: freeTiles[n][1]
                });
                break;
            case "Poison":
                Game.poisons.push({
                    y: freeTiles[n][0],
                    x: freeTiles[n][1]
                });
                break;
            case "Enemy":
                Game.enemies.push({
                    y: freeTiles[n][0],
                    x: freeTiles[n][1],
                    health: Game.enemyBaseHealth,
                    damage: Game.enemyBaseDamage
                });
                break;
            case "Hero":
                Game.hero = {
                    y: freeTiles[n][0],
                    x: freeTiles[n][1],
                    health: Game.heroBaseHealth,
                    damage: Game.heroBaseDamage
                };
                break;
            default:
                return;
        }
        freeTiles.splice(n, 1);
    }
}

function drawGame() {
    const field = document.querySelector('.field');
    for (let y = 0; y < Game.height; y++) {
        for (let x = 0; x < Game.width; x++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            if (Game.map[y][x] === "Wall") {
                tile.classList.add('tileW');
            }
            else if (Game.map[y][x] === "Floor") {
                tile.classList.add('tile');
            }
            field.appendChild(tile);
        }
    }
    for (const s of Game.swords) {
        field.children.item(s.y * Game.width + s.x).classList.add("tileSW");
    }
    for (const p of Game.poisons) {
        field.children.item(p.y * Game.width + p.x).classList.add("tileHP");
    }
    for (const e of Game.enemies) {
        let health = document.createElement('div');
        health.classList.add('health');
        let tile = field.children.item(e.y * Game.width + e.x);
        tile.classList.add("tileE");
        health.style.width = String((e.health / Game.enemyBaseHealth) * 100) + "%";
        tile.appendChild(health);
    }
    const health = document.createElement('div');
    health.classList.add('health');
    const tile = field.children.item(Game.hero.y * Game.width + Game.hero.x);
    tile.classList.add("tileP");
    health.style.width = String((Game.hero.health / Game.heroBaseHealth) * 100) + "%";
    tile.appendChild(health);
}

function clearField() {
    const field = document.querySelector('.field');
    field.innerHTML = '';
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function processKeydown(e) {
    let heroShift = [0, 0];
    switch (e.code) {
        case "KeyW":
            heroShift = [-1, 0];
            break;
        case "KeyA":
            heroShift = [0, -1];
            break;
        case "KeyS":
            heroShift = [1, 0];
            break;
        case "KeyD":
            heroShift = [0, 1];
            break;
        case "Space":
            attackEnemies();
            return;
        default:
            break;
    }
    let newY = Game.hero.y + heroShift[0];
    let newX = Game.hero.x + heroShift[1];
    if (newX < 0 || newX >= Game.width || newY < 0 || newY >= Game.height) {
        return;
    }
    if (Game.map[newY][newX] == "Wall") {
        return;
    }
    for (let e of Game.enemies) {
        if (e.y == newY && e.x == newX) {
            return;
        }
    }
    let newHealth = Game.hero.health;
    let newDamage = Game.hero.damage;
    for (let p of Game.poisons) {
        if (p.y == newY && p.x == newX) {
            newHealth = Math.min(Game.heroBaseHealth, Game.hero.health + Game.poisonBoost);
            Game.poisons.splice(Game.poisons.indexOf(p), 1);
            break;
        }
    }
    for (let s of Game.swords) {
        if (s.y == newY && s.x == newX) {
            newDamage += Game.swordBoost;
            Game.swords.splice(Game.swords.indexOf(s), 1);
            break;
        }
    }
    Game.hero = {
        y: newY,
        x: newX,
        health: newHealth,
        damage: newDamage
    };
}

function attackEnemies() {
    for (let e of Game.enemies) {
        if (Math.abs(e.y - Game.hero.y) <= 1 && Math.abs(e.x - Game.hero.x) <= 1) {
            e.health -= Game.hero.damage;
            if (e.health <= 0) {
                Game.enemies.splice(Game.enemies.indexOf(e), 1);
            }
        }
    }
}

function updateGame() {
    for (let e of Game.enemies) {
        if (Math.abs(e.y - Game.hero.y) <= 1 && Math.abs(e.x - Game.hero.x) <= 1) {
            Game.hero.health -= e.damage;
        }
        else {
            enemyMakeRandomStep(e);
        }
    }
}

function enemyMakeRandomStep(enemy) {
    let shifts = [{ y: -1, x: 0 },
    { y: 0, x: 1 },
    { y: 1, x: 0 },
    { y: 0, x: -1 }];
    let newPositions = [];
    for (let s of shifts) {
        let newY = enemy.y + s.y;
        let newX = enemy.x + s.x;
        if (newX < 0 || newX >= Game.width || newY < 0 || newY >= Game.height) {
            continue;
        }
        if (Game.map[newY][newX] == "Wall") {
            continue;
        }
        let enemyCollisionFound = false;
        for (let e of Game.enemies) {
            if (e.y == newY && e.x == newX) {
                enemyCollisionFound = true;
                break;
            }
        }
        if (enemyCollisionFound) {
            continue;
        }
        newPositions.push({ y: newY, x: newX });
    }
    if (newPositions.length == 0) {
        return;
    }
    let newPosition = newPositions[getRandomNumber(0, newPositions.length - 1)];
    enemy.y = newPosition?.y;
    enemy.x = newPosition?.x;
}

function win() {
    const body = document.querySelector("body");
    const text = document.createElement("h1");
    text.textContent = "WIN";
    text.style.position = "absolute";
    text.style.left = 0;
    text.style.right = 0;
    text.style.top = 0;
    text.style.margin = "auto";
    text.style.textAlign = "center";
    text.style.color = "#00FF00";
    body.appendChild(text);
    removeEventListener("keydown", keydownHandler);
}

function lose() {
    const body = document.querySelector("body");
    const text = document.createElement("h1");
    text.textContent = "LOSE";
    text.style.position = "absolute";
    text.style.left = 0;
    text.style.right = 0;
    text.style.top = 0;
    text.style.margin = "auto";
    text.style.textAlign = "center";
    text.style.color = "#FF0000";
    body.appendChild(text);
    removeEventListener("keydown", keydownHandler);
}

function initGame() {
    clearField();
    genMap();
    genStuff();
    drawGame();
}

function keydownHandler(e) {
    if (e.code != "KeyW" && e.code != "KeyA" &&
        e.code != "KeyS" && e.code != "KeyD" &&
        e.code != "Space") {
        return;
    }
    processKeydown(e);
    updateGame();
    if (Game.enemies.length == 0) {
        win();
    }
    if (Game.hero.health <= 0) {
        lose();
    }
    clearField();
    drawGame();
}

function runGame() {
    initGame();
    addEventListener("keydown", keydownHandler);
}

runGame()