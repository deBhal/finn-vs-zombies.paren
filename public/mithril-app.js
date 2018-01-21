mcontainer = document['getElementById']('mroot');
mapcar = R.map;
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
function mzombie(props) {
    return m('img', { 'key' : props['index'],
                      'class' : 'zombie',
                      'src' : './assets/zombie.png',
                      'style' : { 'left' : px(props.x),
                                  'top' : px(props.y),
                                  'top-margin' : px(props.yOffset),
                                  'position' : 'absolute'
                                }
                    });
};
function peashooter(props) {
    return m('img', { 'key' : 'pea',
                      'src' : './assets/pea-shooter-pixelated.png',
                      'onclick' : function (event) {
        window.spawnShotbang();
        return event['stopPropagation']();
    },
                      'style' : { 'position' : 'absolute', 'top' : '25%' }
                    });
};
objValues = R.values;
mapObjIndexed = R.mapObjIndexed;
function mapp() {
    return m('div', { 'id' : 'mapp', 'position' : 'relative' }, m('div', { 'class-name' : 'row',
                                                                           'onclick' : STATE.callbacks['create-zombie'],
                                                                           'style' : { 'position' : 'relative',
                                                                                       'height' : '140px',
                                                                                       'background-color' : '#afa'
                                                                                     }
                                                                         }, peashooter(), mapcar(mzombie, objValues(STATE.zombies)), mapcar(shot, shots())), m('button', { 'onclick' : playPause }, STATE.running ? 'Pause' : 'Play'), !STATE.running && m('button', { 'onclick' : step }, 'step'), m('button', { 'onclick' : window.createZombiebang }, 'Spawn Zombie'), m('button', { 'onclick' : window.initStatebang }, 'Reset'), m('pre', { 'style' : { 'position' : 'relative' } }, JSON.stringify({ 'state' : STATE }, null, 2)));
};
function mrender() {
    return m.render(mcontainer, mapp());
};