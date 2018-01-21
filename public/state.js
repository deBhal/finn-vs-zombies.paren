console.log('state.paren: Trident is working as expected');
assocPath = R.assocPath;
clone = R.clone;
dropLast = R.dropLast;
filter = R.filter;
head = R.head;
isEmpty = R.isEmpty;
keys = R.keys;
last = R.last;
mapcar = R.map;
mergeAll = R.mergeAll;
minBy = R.minBy;
path = R.path;
prop = R.prop;
reduce = R.reduce;
reject = R.reject;
tail = R.tail;
take = R.take;
objValues = R.values;
function merge() {
    var args = Array.prototype.slice.call(arguments, 0);
    return reduce(R.merge, {  }, args);
};
var initialState = { 'title' : 'Finn vs Zombies',
                     'running' : true,
                     'time' : 0,
                     'zombieIndex' : 1,
                     'zombies' : {  },
                     'plants' : {  },
                     'shots' : {  }
                   };
function get() {
    var propPath = Array.prototype.slice.call(arguments, 0);
    return path(propPath)(STATE);
};
function generateNewMobIndex() {
    return STATE.zombieIndex = 1 + STATE.zombieIndex;
};
/** Change the state */
function updatebang() {
    var pathAndValue = Array.prototype.slice.call(arguments, 0);
    var value = last(pathAndValue);
    var path = dropLast(1, pathAndValue);
    STATE = assocPath(path, value, STATE);
    return STATE;
};
function constant(key) {
    return STATE['constants'][key];
};
function tempProp(key, duration) {
    var result = {  };
    result[key] = merge({ 'at' : time() }, { 'duration' : 'undefined' !== typeof duration ? duration : defaultDuration(key) });
    return result;
};
function isExpiredTempProp(obj) {
    return obj && obj.at + obj.duration <= time();
};
function filterOutExpiredTempProps(obj) {
    return reject(isExpiredTempProp, obj);
};
function defaultDuration(key) {
    return get('defaultDurations', key) || get('defaultDurations', 'default');
};
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
    var x223 = Number.isFinite(x) ? x : 1200;
    var index = generateNewMobIndex();
    var zombie = { 'x' : x223,
                   'y' : plusorminus(5),
                   'health' : 10,
                   'index' : index
                 };
    STATE['zombies'][index] = zombie;
    return zombie;
};
function spawnShotbang(plant) {
    if (plant === undefined) {
        plant = { 'x' : 120, 'index' : 0 };
    };
    var index = generateNewMobIndex();
    var plantX = plant && plant.x || 0;
    var x = plantX + 60;
    return STATE['shots'][index] = { x : x,
                                  yJiggle : plusorminus(5),
                                  shooterId : index,
                                  index : index
                                };
};
function spawnPlantbang() {
    var _js225 = arguments.length;
    for (var n224 = 0; n224 < _js225; n224 += 2) {
        switch (arguments[n224]) {
        case 'x':
            x = arguments[n224 + 1];
        };
    };
    var x;
    var x226 = x || 70 * keys(get('plants')).length;
    var index = generateNewMobIndex();
    return STATE['plants'][index] = merge(defaultPlant, { x : x226, index : index });
};
function time() {
    return STATE.time;
};
function plantFoodbang(plant) {
    return updatebang('plants', plant.index, merge(plant, tempProp('plantFooded')));
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
defaultPlant = { x : 0, index : 0 };
function plantFoodedShotCooldown() {
    return defaultDuration('plantFooded') / constant('plantFoodedShotCount');
};
function shotIsCool(plant) {
    var object227 = merge(defaultPlant, plant);
    var currentTime = STATE.time;
    var timeSinceLastShot = currentTime - object227.timeOfLastShot;
    var cooldown = plantFoodActivep(plant) ? plantFoodedShotCooldown() : constant('plantShotCooldown');
    return !object227.timeOfLastShot || cooldown <= timeSinceLastShot;
};
function plantFoodActivep(plant) {
    return plant.plantFooded;
};
function updatePlant(plant) {
    var plant228 = filterOutExpiredTempProps(plant);
    var object229 = merge(defaultPlant, plant228);
    var currentTime = STATE.time;
    var timeSinceLastShot = currentTime - object229.timeOfLastShot;
    var hasTarget = !isEmpty(STATE.zombies);
    var wantsToShoot = hasTarget || object229.plantFooded;
    var shouldShoot = wantsToShoot && shotIsCool(plant228);
    return mergeAll([filterOutExpiredTempProps(plant228), { derived : { shouldShoot : shouldShoot,
                                                                        timeSinceLastShot : timeSinceLastShot,
                                                                        currentTime : currentTime,
                                                                        wantsToShoot : wantsToShoot,
                                                                        hasTarget : hasTarget
                                                                      } }, shouldShoot && (spawnShotbang(plant228), { timeOfLastShot : currentTime })]);
};
function updateShot(aShot) {
    aShot.x = constant('shotSpeed') + aShot.x;
    return aShot;
};
function updateZombieHitByShot() {
    return aZombie.health -= 1;
};
function initStatebang() {
    STATE = clone(initialState);
    initZombies();
    STATE.callbacks = { 'create-zombie' : function () {
        return createZombiebang();
    } };
    updatebang('constants', { 'plantShotCooldown' : 150,
                              'plantFoodedShotCount' : 50,
                              shotSpeed : 4
                            });
    updatebang('defaultDurations', { 'default' : 200, plantFooded : 100 });
    return STATE;
};
function updateZombie(zombie) {
    zombie.x -= 0.1;
    return zombie;
};
function updateZombies() {
    return STATE.zombies = mapcar(updateZombie, STATE.zombies);
};
function pause() {
    STATE.running = false;
    return mrender();
};
function playPause() {
    return STATE.running ? pause() : (STATE.running = true);
};
function leftMost(zombies) {
    var zombies230 = objValues(zombies);
    return reduce(minBy(prop('x')), head(zombies230), tail(zombies230));
};
function calculateCollisions() {
    var frontZombie = leftMost(STATE.zombies);
    if (frontZombie) {
        STATE.frontZombie = frontZombie;
        return (function () {
            var _js231 = shots();
            var _js233 = _js231.length;
            var collect234 = [];
            for (var _js232 = 0; _js232 < _js233; _js232 += 1) {
                var aShot = _js231[_js232];
                if (frontZombie.x <= aShot.x) {
                    collect234.push({ 'shot' : aShot, 'zombie' : frontZombie });
                };
            };
            return collect234;
        })();
    } else {
        return [];
    };
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
fitlerDead = filter(R.negate(prop('dead')));
/** update all the things */
function tickbang() {
    STATE.time = 1 + STATE.time;
    updateZombies();
    STATE['shots'] = mapcar(updateShot, STATE['shots']);
    STATE['plants'] = mapcar(updatePlant, STATE['plants']);
    STATE['collisions'] = calculateCollisions();
    processCollisionsbang();
    STATE['shots'] = filter(alivep, STATE['shots']);
    return STATE['zombies'] = filter(alivep, STATE['zombies']);
};