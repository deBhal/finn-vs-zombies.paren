console.log('state.paren: Trident is working as expected');
mapcar = R.map;
function generateNewZombieIndex() {
    return STATE.zombieIndex = 1 + STATE.zombieIndex;
};
var initialState = { 'title' : 'Finn vs Zombies',
                     'running' : true,
                     'time' : 0,
                     'zombieIndex' : 0,
                     'zombies' : {  }
                   };
var SHOTSPEED = 10;
function randomintbelow(n) {
    return Math.floor(n * Math.random());
};
function createZombiebang(x) {
    if (x === undefined) {
        x = 1200;
    };
    var index = generateNewZombieIndex();
    var zombie = { 'x' : x,
                   'y' : 10 - randomintbelow(20),
                   'health' : 10,
                   'index' : index
                 };
    STATE['zombies'][index] = zombie;
    return zombie;
};
function initZombie() {
    return null;
};
function initZombies() {
    return mapcar(createZombiebang, [900]);
};
function deadp(zombie) {
    return zombie.health <= 0;
};
function autoResetZombie(zombie) {
    return deadp(zombie) ? resetZombie(zombie) : zombie;
};
function walk(zombie) {
    zombie.x -= 1;
    return zombie;
};
function resetZombie(zombie) {
    return Object.assign(zombie, { 'x' : 1200, 'health' : 10 });
};
function createShot(plant) {
    var x = 70;
    var y = 55;
    return { 'x' : x, 'y' : y };
};
function updateShot() {
    return aShot.x = SHOTSPEED + aShot.x;
};
function resetShot() {
    return aShot = createShot();
};
function updateZombieHitByShot() {
    return aZombie.health -= 1;
};
function autoResetShot() {
    return 1200 <= aShot.x ? resetShot() : aShot;
};
function initStatebang() {
    STATE = Object.assign({  }, initialState);
    aShot = { 'x' : 120, 'y' : 65 };
    initZombie();
    initZombies();
    STATE.callbacks = { 'create-zombie' : function () {
        return createZombiebang();
    } };
    return STATE;
};
function updateZombie(zombie) {
    zombie.x -= 1;
    return autoResetZombie(zombie);
};
mapcar();
function updateZombies() {
    return STATE.zombies = mapcar(updateZombie, STATE.zombies);
};
function playPause() {
    return STATE.running = !STATE.running;
};
initStatebang();
minBy = R.minBy;
prop = R.prop;
reduce = R.reduce;
objValues = R.values;
function leftMost(zombies) {
    return reduce(minBy(prop('x')), { 'x' : Infinity }, objValues(zombies));
};
function calculateCollisions() {
    var collisions = [];
    var frontZombie = leftMost(STATE.zombies);
    if (frontZombie.x <= aShot.x) {
        resetShot();
        return [{ 'shot' : aShot, 'zombie' : frontZombie }];
    } else {
        return [];
    };
};
function processCollisionbang(collision) {
    var index = collision.zombie['index'];
    var theZombie = STATE['zombies'][index];
    var health = theZombie['health'];
    STATE[0] = [index, health];
    return STATE['zombies'][index]['health'] = health - 1;
};
function processCollisionsbang() {
    return mapcar(processCollisionbang, STATE['collisions']);
};
/** update all the things */
function tickbang() {
    STATE.time = 1 + STATE.time;
    updateZombies();
    updateShot();
    STATE['collisions'] = calculateCollisions();
    processCollisionsbang();
    return autoResetShot();
};
tickbang();
function mainLoop() {
    if (STATE.running) {
        try {
            tickbang();
            'undefined' !== typeof render && render();
            return 'undefined' !== typeof mrender && mrender();
        } finally {
            requestAnimationFrame(mainLoop);
        };
    };
};
mainLoop();