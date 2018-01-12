console.log('state.paren: Trident is working as expected');
mapcar = R.map;
function generateNewZombieIndex() {
    return STATE.zombieIndex = 1 + STATE.zombieIndex;
};
var initialState = { 'title' : 'Finn vs Zombies',
                     'running' : true,
                     'time' : 0,
                     'zombieIndex' : 0,
                     'zombies' : {  },
                     'shots' : {  }
                   };
var SHOTSPEED = 10;
function randomintbelow(n) {
    return Math.floor(n * Math.random());
};
function plusorminus(n) {
    return n - randomintbelow(1 + 2 * n);
};
function createZombiebang(x) {
    if (x === undefined) {
        x = 1200;
    };
    var x21 = Number.isFinite(x) ? x : 1200;
    var index = generateNewZombieIndex();
    var zombie = { 'x' : x21,
                   'y' : plusorminus(5),
                   'health' : 10,
                   'index' : index
                 };
    STATE['zombies'][index] = zombie;
    return zombie;
};
function spawnShotbang(plantId) {
    if (plantId === undefined) {
        plantId = 0;
    };
    var index = generateNewZombieIndex();
    var x = 120;
    return STATE['shots'][index] = { x : x,
                                  yJiggle : plusorminus(5),
                                  shooterId : plantId,
                                  index : index
                                };
};
function initZombie() {
    return null;
};
function initZombies() {
    return mapcar(createZombiebang, [900]);
};
function alivep(zombie) {
    return !(zombie.health <= 0 || zombie.x <= -100 || 1300 <= zombie.x || zombie['dead']);
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
function updateShot(aShot) {
    aShot.x = SHOTSPEED + aShot.x;
    return aShot;
};
function resetShot() {
    return aShot = createShot();
};
function updateZombieHitByShot() {
    return aZombie.health -= 1;
};
clone = R.clone;
function initStatebang() {
    STATE = clone(initialState);
    initZombie();
    initZombies();
    STATE.callbacks = { 'create-zombie' : function () {
        return createZombiebang();
    } };
    return STATE;
};
function updateZombie(zombie) {
    zombie.x -= 1;
    return zombie;
};
function updateZombies() {
    return STATE.zombies = mapcar(updateZombie, STATE.zombies);
};
function playPause() {
    STATE.running = !STATE.running;
    return mrender();
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
    var frontZombie = leftMost(STATE.zombies);
    return frontZombie && (STATE.frontZombie = frontZombie, (function () {
        var _js22 = shots();
        var _js24 = _js22.length;
        var collect25 = [];
        for (var _js23 = 0; _js23 < _js24; _js23 += 1) {
            var aShot = _js22[_js23];
            if (frontZombie.x <= aShot.x) {
                collect25.push({ 'shot' : aShot, 'zombie' : frontZombie });
            };
        };
        return collect25;
    })());
};
function processCollisionbang(collision) {
    var zombieId = collision.zombie['index'];
    var theZombie = STATE['zombies'][zombieId];
    var shotId = collision.shot['index'];
    var health = theZombie['health'];
    STATE['zombies'][zombieId]['health'] = health - 1;
    return STATE['shots'][shotId]['dead'] = true;
};
function processCollisionsbang() {
    return mapcar(processCollisionbang, STATE['collisions']);
};
function shots() {
    return objValues(STATE.shots);
};
filter = R.filter;
fitlerDead = filter(R.negate(prop('dead')));
prop = R.prop;
/** update all the things */
function tickbang() {
    STATE.time = 1 + STATE.time;
    updateZombies();
    STATE['shots'] = R.map(updateShot, STATE['shots']);
    STATE['collisions'] = calculateCollisions();
    processCollisionsbang();
    STATE['shots'] = filter(alivep, STATE['shots']);
    return STATE['zombies'] = filter(alivep, STATE['zombies']);
};
tickbang();
function mainLoop() {
    try {
        return STATE.running && (tickbang(), 'undefined' !== typeof render && render(), 'undefined' !== typeof mrender && mrender());
    } finally {
        requestAnimationFrame(mainLoop);
    };
};
mainLoop();
function step() {
    tickbang();
    return mrender();
};