mcontainer = document['getElementById']('mroot');
addIndex = R.addIndex;
mapcar = R.map;
mapObjIndexed = R.mapObjIndexed;
concat = R.concat;
join = R.join;
objValues = R.values;
reduce = R.reduce;
mapIndexed = addIndex(mapcar);
reduceIndexed = addIndex(reduce);
function px(n) {
    return n + 'px';
};
function dump(key, value) {
    STATE[key] = value;
    return window[key] = value;
};
function shot(props) {
    return m('img', { 'src' : './assets/pea.png',
                      'class' : 'shot',
                      'style' : { 'position' : 'absolute',
                                  'float' : 'left',
                                  'left' : px(props.x),
                                  'transform' : 'translateY(' + px(props.yJiggle) + ')'
                                }
                    }, null);
};
function cone(index, health) {
    if (health === undefined) {
        health = 21;
    };
    var _attrs = 14 < health ? { 'class' : 'cone', 'src' : './assets/cone.png' } : (8 < health ? { 'class' : 'cone damaged', 'src' : './assets/cone-2.png' } : { 'class' : 'cone badly-damaged', 'src' : './assets/cone-3.png' });
    var attrs = Object.assign(_attrs, { 'index' : index, 'key' : 'cone-' + index });
    return m('img', attrs);
};
function mzombie(props) {
    var key = 'zombie-' + props.index;
    return m('div', { 'key' : key,
                      'data-key' : key,
                      'class' : 'zombie',
                      'style' : { 'left' : px(props.x), 'margin-bottom' : px(props.y) }
                    }, m('img', { 'src' : './assets/zombie.png', 'key' : 'img-' + key }), props.cone ? cone(props.index, props.cone.health) : null);
};
function peashooterOnclick(event) {
    event['stopPropagation']();
    var it = event.target.dataset;
    return it ? plantFoodbang(it.column, it.row) : clog('missing dataset in peashooter-onclick event:', event) || it;
};
function peashooter(props) {
    var key = 'peashooter-' + props.index;
    return m('img', { 'key' : key,
                      'data-index' : props.index,
                      'data-key' : key,
                      'data-row' : props.row,
                      'data-column' : props.column,
                      'class' : 'plant peashooter' + (props.shooting ? ' shooting' : ''),
                      'src' : './assets/pea-shooter-pixelated.png',
                      'onclick' : peashooterOnclick,
                      'style' : styleStringify({ 'left' : px(props.x) })
                    }, null);
};
function turfClick(event) {
    var object261 = event.target.dataset;
    return spawnPlantbang(object261.column, object261.row);
};
function styleEntryFromValueKey(value, key) {
    return key + ':' + value + ';';
};
function styleStringify(style) {
    return join('', objValues(mapObjIndexed(styleEntryFromValueKey, style)));
};
function mturf(props, column, row) {
    var it;
    var key = 'turf-' + column;
    return m('div', { 'class' : 'turf',
                      'key' : key,
                      'data-key' : key,
                      'data-row' : row,
                      'data-column' : column,
                      'onclick' : turfClick,
                      'style' : 'width:' + constant('turfWidth') + 'px;' + 'background-color:' + (((Number(column) + Number(row)) % 2 + 2) % 2 ? 'lightgreen' : 'darkgreen') + ';'
                    }, (it = props && peashooter(props), it ? it : null || it));
};
function mrow(props, rowIndex) {
    var key = 'row-' + rowIndex;
    return m('div', { 'class' : 'row',
                      'key' : key,
                      'data-key' : key
                    }, reduce(concat, [], [objValues(mapObjIndexed(function (props, column) {
        return mturf(props, column, rowIndex);
    }, props.plants)), mapcar(mzombie, objValues(props.zombies)), mapcar(shot, objValues(props.shots)), [m('button', { 'key' : 'spawn-zombie' + rowIndex,
                                                                                                                       'data-row' : rowIndex,
                                                                                                                       'onclick' : mspawnZombiebang
                                                                                                                     }, 'Spawn Zombie'), m('button', { 'key' : 'spawn-conehead' + rowIndex,
                                                                                                                                                       'data-row' : rowIndex,
                                                                                                                                                       'onclick' : mspawnConeheadbang
                                                                                                                                                     }, 'Spawn Cone-Head')]]));
};
function thunkedMrender() {
    return window.mrender();
};
function mreset() {
    initStatebang();
    return mrender();
};
function mapp() {
    return m('div', { 'id' : 'mapp',
                      'key' : 'mapp',
                      'data-key' : 'mapp',
                      'position' : 'relative'
                    }, m('div', { 'id' : 'field',
                                  'class' : 'field',
                                  'key' : 'field',
                                  'data-key' : 'field'
                                }, objValues(mapObjIndexed(mrow, STATE.rows))), m('button', { 'key' : 'play-pause',
                                                                                              'id' : 'play-pause',
                                                                                              'onclick' : playPause
                                                                                            }, STATE.running ? 'Pause' : 'Play'), STATE.running ? null : m('button', { 'key' : 'step', 'onclick' : step }, 'step'), m('button', { 'key' : 'reset', 'onclick' : mreset }, 'Reset'), m('button', { 'key' : 'render', 'onclick' : thunkedMrender }, 'Render'), m('pre', { 'id' : 'state',
                                                                                                                                                                                                                                                                                                                                                                       'key' : 'state',
                                                                                                                                                                                                                                                                                                                                                                       'style' : styleStringify({ 'position' : 'relative' })
                                                                                                                                                                                                                                                                                                                                                                     }, JSON.stringify({ 'state' : STATE }, null, 2)));
};
function mrender() {
    return m.render(mcontainer, mapp());
};
function mspawnZombiebang(event) {
    return spawnZombiebang(event.target.dataset.row);
};
function mspawnConeheadbang(event) {
    return spawnConeheadbang(event.target.dataset.row);
};
function debugOnce(func) {
    var realFunc = window[func];
    return window[func] = function () {
        var args = Array.prototype.slice.call(arguments, 0);
        window[func] = realFunc;
        debugger;
        return realFunc.apply(this, args);
    };
};
function nextLoop() {
    return requestAnimationFrame(mainLoop);
};
function timeoutNextLoop() {
    return setTimeout(nextLoop);
};
function mainLoop() {
    try {
        return STATE.running && step();
    } finally {
        timeoutNextLoop();
    };
};
initStatebang();
mainLoop();
function step() {
    mrender();
    return tickbang();
};