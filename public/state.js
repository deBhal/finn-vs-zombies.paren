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
/** Change the state. The first n arguments are the path to the data to be updated in the state, and the last argument is the new value to store there. */
function updatebang() {
    var pathThenValue = Array.prototype.slice.call(arguments, 0);
    var value = last(pathThenValue);
    var path = dropLast(1, pathThenValue);
    STATE = assocPath(path, value, STATE);
    return STATE;
};
function constant(key) {
    return STATE['constants'][key];
};
/**
 * Returns or updates an object like {plantFooded: {at:2018, duration: 200}} suitable for merging into another object (or setting by key)
 * 
 *   The idea is that code that only cares about the property can just check if it's truthy, but it wraps up enough data to clear out the prop later.
 */
function tempProp(key, duration, target) {
    if (target === undefined) {
        target = {  };
    };
    target[key] = merge({ 'at' : time() }, { 'duration' : 'undefined' !== typeof duration ? duration : defaultDuration(key) });
    return target;
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
function spawnZombiebang(x) {
    if (x === undefined) {
        x = 1200;
    };
    var x28 = Number.isFinite(x) ? x : 1200;
    var index = generateNewMobIndex();
    var zombie = { 'x' : x28,
                   'y' : plusorminus(5),
                   'health' : 10,
                   'index' : index
                 };
    STATE['zombies'][index] = zombie;
    return zombie;
};
function spawnConeHeadbang(x) {
    if (x === undefined) {
        x = 1200;
    };
    var zombie = spawnZombiebang(x);
    return updatebang('zombies', zombie.index, merge(zombie, { 'cone' : { 'health' : 21 } }));
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
    var _js30 = arguments.length;
    for (var n29 = 0; n29 < _js30; n29 += 2) {
        switch (arguments[n29]) {
        case 'x':
            x = arguments[n29 + 1];
        };
    };
    var x;
    var x31 = x || 70 * keys(get('plants')).length;
    var index = generateNewMobIndex();
    return STATE['plants'][index] = merge(defaultPlant, { x : x31, index : index });
};
function time() {
    return STATE.time;
};
function plantFoodbang(plant) {
    return updatebang('plants', plant.index, merge(plant, tempProp('plantFooded')));
};
function initZombies() {
    return mapcar(spawnZombiebang, [900]);
};
function alivep(zombie) {
    return !('undefined' !== typeof zombie.health && zombie.health <= 0 || 'undefined' !== typeof zombie.x && (zombie.x <= -100 || 1300 <= zombie.x) || zombie['dead']);
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
    var object32 = merge(defaultPlant, plant);
    var currentTime = STATE.time;
    var timeSinceLastShot = currentTime - object32.timeOfLastShot;
    var cooldown = plantFoodActivep(plant) ? plantFoodedShotCooldown() : constant('plantShotCooldown');
    return !object32.timeOfLastShot || cooldown <= timeSinceLastShot;
};
function plantFoodActivep(plant) {
    return plant.plantFooded;
};
function updatePlant(plant) {
    var plant33 = filterOutExpiredTempProps(plant);
    var object34 = merge(defaultPlant, plant33);
    var currentTime = STATE.time;
    var timeSinceLastShot = currentTime - object34.timeOfLastShot;
    var hasTarget = !isEmpty(STATE.zombies);
    var wantsToShoot = hasTarget || object34.plantFooded;
    var shouldShoot = wantsToShoot && shotIsCool(plant33);
    return mergeAll([filterOutExpiredTempProps(plant33), { derived : { shouldShoot : shouldShoot,
                                                                       timeSinceLastShot : timeSinceLastShot,
                                                                       currentTime : currentTime,
                                                                       wantsToShoot : wantsToShoot,
                                                                       hasTarget : hasTarget
                                                                     } }, shouldShoot && (spawnShotbang(plant33), { timeOfLastShot : currentTime })]);
};
function updateShot(aShot) {
    aShot.x = constant('shotSpeed') + aShot.x;
    return aShot;
};
function initStatebang() {
    STATE = clone(initialState);
    initZombies();
    STATE.callbacks = { 'spawn-zombie' : function () {
        return spawnZombiebang();
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
    return filter(alivep, zombie);
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
    var zombies35 = objValues(zombies);
    return reduce(minBy(prop('x')), head(zombies35), tail(zombies35));
};
function calculateCollisions() {
    var frontZombie = leftMost(STATE.zombies);
    if (frontZombie) {
        STATE.frontZombie = frontZombie;
        return (function () {
            var _js36 = shots();
            var _js38 = _js36.length;
            var collect39 = [];
            for (var _js37 = 0; _js37 < _js38; _js37 += 1) {
                var aShot = _js36[_js37];
                if (frontZombie.x <= aShot.x) {
                    collect39.push({ 'shot' : aShot, 'zombie' : frontZombie });
                };
            };
            return collect39;
        })();
    } else {
        return [];
    };
};
/** Returns a path to the health that should be decremented e.g. a plant's health, or a zombie's bucket */
function findArmor(mob) {
    if (mob.cone) {
        return ['cone', 'health'];
    } else if (mob.bucket) {
        return ['bucket', 'health'];
    } else {
        return ['health'];
    };
};
/** Subtract damage from the mobs health (or bucket) */
function hurt(mob, damage) {
    if (damage === undefined) {
        damage = 1;
    };
    var healthPath = findArmor(mob);
    var health = path(healthPath, mob);
    return assocPath(healthPath, health - damage, mob);
};
function processCollisionbang(collision) {
    var zombieId = collision.zombie['index'];
    var theZombie = STATE['zombies'][zombieId];
    var shotId = collision.shot['index'];
    STATE['zombies'][zombieId] = hurt(theZombie);
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