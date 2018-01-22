mcontainer = document['getElementById']('mroot');
mapcar = R.map;
objValues = R.values;
mapObjIndexed = R.mapObjIndexed;
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
                                  'margin-top' : px(props.yJiggle)
                                }
                    });
};
function cone(health) {
    if (health === undefined) {
        health = 21;
    };
    return m('img', 14 < health ? { 'class' : 'cone', 'src' : './assets/cone.png' } : (8 < health ? { 'class' : 'cone damaged', 'src' : './assets/cone-2.png' } : { 'class' : 'cone badly-damaged', 'src' : './assets/cone-3.png' }));
};
function mzombie(props) {
    return m('div', { 'key' : props['index'],
                      'class' : 'zombie',
                      'style' : { 'left' : px(props.x),
                                  'top' : px(props.y),
                                  'top-margin' : px(props.yOffset),
                                  'position' : 'absolute'
                                }
                    }, m('img', { 'src' : './assets/zombie.png' }), props.cone && cone(props.cone.health));
};
function peashooter(props) {
    if (props === undefined) {
        props = { 'x' : 250 };
    };
    return m('img', { 'key' : 'pea',
                      'src' : './assets/pea-shooter-pixelated.png',
                      'onclick' : function (event) {
        plantFoodbang(props);
        return event['stopPropagation']();
    },
                      'style' : { 'position' : 'absolute',
                                  'left' : px(props.x),
                                  'top' : '25%'
                                }
                    });
};
function mapp() {
    return m('div', { 'id' : 'mapp', 'position' : 'relative' }, m('div', { 'class-name' : 'row',
                                                                           'onclick' : spawnZombiebang,
                                                                           'style' : { 'position' : 'relative',
                                                                                       'height' : '140px',
                                                                                       'background-color' : '#afa'
                                                                                     }
                                                                         }, mapcar(peashooter, objValues(STATE.plants)), mapcar(mzombie, objValues(STATE.zombies)), mapcar(shot, shots())), m('button', { 'onclick' : playPause }, STATE.running ? 'Pause' : 'Play'), !STATE.running && m('button', { 'onclick' : step }, 'step'), m('button', { 'onclick' : window.spawnZombiebang }, 'Spawn Zombie'), m('button', { 'onclick' : window.spawnConeHeadbang }, 'Spawn Cone-Head'), m('button', { 'onclick' : window.spawnPlantbang }, 'Spawn Plant'), m('button', { 'onclick' : window.initStatebang }, 'Reset'), m('pre', { 'style' : { 'position' : 'relative' } }, JSON.stringify({ 'state' : STATE }, null, 2)));
};
function mrender() {
    return m.render(mcontainer, mapp());
};
function mainLoop() {
    try {
        return STATE.running && step();
    } finally {
        requestAnimationFrame(mainLoop);
    };
};
initStatebang();
mainLoop();
function step() {
    tickbang();
    return mrender();
};