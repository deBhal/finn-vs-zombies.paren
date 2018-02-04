console.log('in state.paren');
assoc = R.assoc;
assocPath = R.assocPath;
clone = R.clone;
complement = R.complement;
drop = R.drop;
dropLast = R.dropLast;
filter = R.filter;
find = R.find;
findIndex = R.findIndex;
head = R.head;
car = R.head;
isEmpty = R.isEmpty;
keys = R.keys;
last = R.last;
mapcar = R.map;
mergeAll = R.mergeAll;
minBy = R.minBy;
not = R.not;
path = R.path;
pipe = R.pipe;
prop = R.prop;
range = R.range;
reduce = R.reduce;
reject = R.reject;
repeat = R.repeat;
tail = R.tail;
take = R.take;
times = R.times;
objValues = R.values;
zipObj = R.zipObj;
function merge() {
    var args = Array.prototype.slice.call(arguments, 0);
    return reduce(R.merge, {  }, args);
};
function objectifyArray(list) {
    return zipObj(range(0, list.length), list);
};
function createEmptyRow() {
    return { 'plants' : objectifyArray(repeat(null, 9)),
             'zombies' : {  },
             'shots' : {  }
           };
};
var initialState = { 'title' : 'Finn vs Zombies',
                     'running' : true,
                     'time' : 0,
                     'zombieIndex' : 10,
                     'zombieGenerator' : {  },
                     'rows' : objectifyArray(times(createEmptyRow, 6)),
                     'constants' : { 'plantShotCooldown' : 150,
                                     'plantFoodedShotCount' : 50,
                                     shotSpeed : 4,
                                     turfWidth : 100
                                   }
                   };
defaultPlant = { x : 0,
              index : 0,
              types : ['plant', 'mob']
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
    return STATE = assocPath(path, value, STATE);
};
function constant(key) {
    return STATE['constants'][key];
};
function tempProp(key, duration) {
    clog('temp-prop', key);
    var propDuration = 'undefined' !== typeof duration ? duration : defaultDuration(key);
    return assoc(key, { 'at' : time(), 'duration' : propDuration }, {  });
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
function randomIntBelow(n) {
    return Math.floor(n * Math.random());
};
function plusOrMinus(n) {
    return n - randomIntBelow(1 + 2 * n);
};
function createZombie(x) {
    var x245 = Number.isFinite(x) ? x : 9 * constant('turfWidth');
    var index = generateNewMobIndex();
    return { 'x' : x245,
             'y' : plusOrMinus(5),
             'health' : 10,
             'index' : index
           };
};
function spawnZombiebang(row, x) {
    var row246 = 'undefined' !== typeof row ? row : randomRow();
    var zombie = createZombie(x);
    return STATE['rows'][row246]['zombies'][zombie.index] = assoc('row', row246, zombie);
};
function spawnConeheadbang(row, x) {
    var zombie = spawnZombiebang(row, x);
    return updatebang('rows', Number(row), 'zombies', zombie.index, merge(zombie, { 'cone' : { 'health' : 21 } }));
};
function createEnemy(type) {
    switch (type) {
    case 'cone':
        return merge(createZombie(), { 'cone' : { 'health' : 21 } });
    default:
        return createZombie();
    };
};
function spawnbang(zombie, row) {
    var row247 = 'undefined' !== typeof row ? row : randomRow();
    return STATE['rows'][row247]['zombies'][zombie.index] = assoc('row', row247, zombie);
};
function spawnShotbang(plant) {
    var index = generateNewMobIndex();
    var plantX = plant && plant.x || 0;
    var x = plantX + 55;
    var row248 = plant.row;
    return STATE['rows'][row248]['shots'][index] = { x : x,
                                                  yJiggle : plusOrMinus(5),
                                                  shooterId : index,
                                                  index : index
                                                };
};
function spawnPlantbang(column, row) {
    if (column === undefined) {
        column = 0;
    };
    if (row === undefined) {
        row = 0;
    };
    var mobIndex = generateNewMobIndex();
    return STATE['rows'][row]['plants'][column] = merge(defaultPlant, { x : 25 + column * constant('turfWidth') + 0,
                                                                     index : mobIndex,
                                                                     column : column,
                                                                     row : row
                                                                   });
};
function time() {
    return STATE.time;
};
function plantFoodbang(column, row) {
    return setPlantbang(column, row, merge(plant(column, row), tempProp('plantFooded')));
};
function initZombies() {
    return mapcar(spawnZombiebang, [900]);
};
function alivep(zombie) {
    return !zombie || !('undefined' !== typeof zombie.health && zombie.health <= 0 || 'undefined' !== typeof zombie.x && (zombie.x <= -100 || 1300 <= zombie.x) || zombie['dead']);
};
function walk(zombie) {
    zombie.x -= 1;
    return zombie;
};
function plantFoodedShotCooldown() {
    return defaultDuration('plantFooded') / constant('plantFoodedShotCount');
};
function shotIsCool(plant) {
    var object249 = merge(defaultPlant, plant);
    var currentTime = STATE.time;
    var timeSinceLastShot = currentTime - object249.timeOfLastShot;
    var cooldown = plantFoodActivep(plant) ? plantFoodedShotCooldown() : constant('plantShotCooldown');
    return !object249.timeOfLastShot || cooldown <= timeSinceLastShot;
};
function plantFoodActivep(plant) {
    return plant.plantFooded;
};
function updateRow(row) {
    var plants250 = mapcar(updateTurf, row.plants);
    var zombies251 = updateZombies(row.zombies);
    var shots252 = mapcar(updateShot, row.shots);
    var collisions = calculateCollisions(row);
    var newRow = { 'plants' : plants250,
                   'zombies' : zombies251,
                   'shots' : shots252,
                   'collisions' : collisions
                 };
    return mapcar(filter(alivep), processCollisions(newRow, collisions));
};
function updateTurf(turf) {
    return turf && updatePlant(turf);
};
function plant(column, row) {
    return STATE['rows'][row]['plants'][column];
};
function setPlantbang(column, row, value) {
    return STATE['rows'][row]['plants'][column] = value;
};
function savePlantbang(plant) {
    return setPlantbang(plant.column, plant.row, plant);
};
function updatePlant(plant) {
    if (!plant) {
        return plant;
    } else {
        var plant253 = filterOutExpiredTempProps(plant);
        var object254 = merge(defaultPlant, plant253);
        var currentTime = STATE.time;
        var timeSinceLastShot = currentTime - object254.timeOfLastShot;
        var myRow = STATE['rows'][object254.row];
        var hasTarget = !isEmpty(myRow.zombies);
        var wantsToShoot = hasTarget || object254.plantFooded;
        var shouldShoot = wantsToShoot && shotIsCool(plant253);
        var derivedProps = { shouldShoot : shouldShoot,
                             timeSinceLastShot : timeSinceLastShot,
                             currentTime : currentTime,
                             wantsToShoot : wantsToShoot,
                             hasTarget : hasTarget
                           };
        return mergeAll([filterOutExpiredTempProps(plant253), shouldShoot && (spawnShotbang(plant253), merge({ timeOfLastShot : currentTime }, tempProp('shooting', 10)))]);
    };
};
function updateShot(aShot) {
    aShot.x = constant('shotSpeed') + aShot.x;
    return aShot;
};
function initZombieGenerator() {
    return { 'waveCount' : 0,
             'zombiesSpawned' : 0,
             'zombieQueue' : []
           };
};
function initStatebang() {
    var preservedRunning = 'undefined' !== typeof STATE && 'undefined' !== typeof STATE.running ? STATE.running : initialState.running;
    STATE = clone(initialState);
    updatebang('running', preservedRunning);
    STATE.callbacks = { 'spawn-zombie' : function () {
        return spawnZombiebang();
    } };
    updatebang('constants', 'plantFoodedShotCount', 50);
    updatebang('constants', 'shotSpeed', 2);
    updatebang('constants', 'turfWidth', 100);
    updatebang('constants', 'zombieWalkingSpeed', 0.05);
    updatebang('constants', 'plantShotCooldown', 30 / constant('zombieWalkingSpeed'));
    setConstant('pauseBetweenZombies', 30 / constant('zombieWalkingSpeed'));
    updatebang('defaultDurations', 'default', 200);
    updatebang('defaultDurations', 'plantFooded', 100);
    updatebang('defaultDurations', 'cooldownQueueZombies', 400 / constant('zombieWalkingSpeed'));
    updatebang('zombieGenerator', initZombieGenerator());
    return STATE;
};
/** Ah, delicious irony */
function setConstant(key, value) {
    return updatebang('constants', key, value);
};
function updateZombie(zombie) {
    zombie.x -= constant('zombieWalkingSpeed');
    return filter(alivep, zombie);
};
function updateZombies(zombies) {
    return filter(alivep, mapcar(updateZombie, zombies));
};
function pause() {
    STATE.running = false;
    return mrender();
};
function playPause() {
    return STATE.running ? pause() : (STATE.running = true);
};
function leftMost(zombies) {
    var zombies255 = objValues(zombies);
    return reduce(minBy(prop('x')), head(zombies255), tail(zombies255));
};
function calculateCollisions(row) {
    var frontZombie = leftMost(row.zombies);
    if (frontZombie) {
        row.frontZombie = frontZombie;
        return (function () {
            var _js256 = objValues(row.shots);
            var _js258 = _js256.length;
            var collect259 = [];
            for (var _js257 = 0; _js257 < _js258; _js257 += 1) {
                var aShot = _js256[_js257];
                if (frontZombie.x <= aShot.x) {
                    collect259.push({ 'shot' : aShot,
                                      'zombie' : frontZombie,
                                      'row' : row
                                    });
                };
            };
            return collect259;
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
function processCollision(row, collision) {
    var zombieId = collision.zombie['index'];
    var theZombie = collision.row['zombies'][zombieId];
    var shotId = collision.shot['index'];
    collision.row['zombies'][zombieId] = hurt(theZombie);
    collision.row['shots'][shotId]['dead'] = true;
    return collision.row;
};
function processCollisions(row, collisions) {
    return reduce(processCollision, row, collisions);
};
filterDead = filter(R.negate(prop('dead')));
function findZombie() {
    return find(complement(isEmpty), objValues(mapcar(pipe(prop('zombies')), STATE.rows)));
};
function randomRow() {
    return randomIntBelow(keys(STATE['rows']).length);
};
function queueZombies(zombieGenerator) {
    var object260 = filterOutExpiredTempProps(zombieGenerator);
    return object260.cooldownQueueZombies && findZombie() ? zombieGenerator : merge(zombieGenerator, tempProp('cooldownQueueZombies'), { zombieQueue : concat(object260.zombieQueue, [true, true, true, 'cone']), waveCount : 1 + object260.waveCount });
};
function generateZombie(zombieGenerator) {
    if (zombieGenerator.pauseBetweenZombies || isEmpty(zombieGenerator.zombieQueue)) {
        return zombieGenerator;
    } else {
        var newZombieType = car(zombieGenerator.zombieQueue);
        var row = randomRow();
        spawnbang(createEnemy(newZombieType), row);
        return merge(zombieGenerator, tempProp('pauseBetweenZombies'), { 'zombiesSpawned' : 1 + zombieGenerator.zombiesSpawned, 'zombieQueue' : drop(1, zombieGenerator.zombieQueue) });
    };
};
function updateZombieGenerator(zombieGenerator) {
    return pipe(filterOutExpiredTempProps, queueZombies, generateZombie)(zombieGenerator);
};
/** update all the things */
function tickbang() {
    STATE.time = 1 + STATE.time;
    STATE['rows'] = mapcar(updateRow, STATE['rows']);
    STATE.zombieGenerator = updateZombieGenerator(STATE.zombieGenerator);
    return STATE;
};