mcontainer = document['getElementById']('mroot');
mapcar = R.map;
function px(n) {
    return n + 'px';
};
function shot(props) {
    return m('img', { 'src' : './assets/pea.png', 'style' : { 'position' : 'absolute',
                                                              'float' : 'left',
                                                              'left' : px(props.x),
                                                              'top' : px(props.y)
                                                            } });
};
function mzombie(props) {
    return m('img', { 'key' : props['index'],
                      'class' : 'zombie',
                      'src' : './assets/zombie.png',
                      'style' : { 'left' : px(props.x),
                                  'top' : px(props.y),
                                  'position' : 'absolute'
                                }
                    });
};
function peashooter(props) {
    return m('img', { 'key' : 'pea',
                      'src' : './assets/pea-shooter-pixelated.png',
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
                                                                         }, peashooter(), mapcar(mzombie, objValues(STATE.zombies)), shot(aShot)), m('pre', { 'style' : { 'position' : 'relative' } }, JSON.stringify({ 'state' : STATE, 'a-shot' : aShot }, null, 2)));
};
function mrender() {
    return m.render(mcontainer, mapp());
};
