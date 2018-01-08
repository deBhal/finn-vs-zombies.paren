['progn', ['setq', 'httpdPort', 8081], ['httpdServeDirectory', ['format', '%s', 'defaultDirectory']], ['browseUrl', ['format', 'http://127.0.0.1:%d/index.html', 'httpdPort']], ['slimeMode'], ['tridentMode'], ['stealSlimeKeysForTridentbang']];
['progn', ['slimeEval', ['quote', ['quickload', 'parenscript']]], ['slimeEval', ['quote', ['and', ['defpackage', 'fvz', ['use', 'common-lisp', 'parenscript']], 'Created Package fvz']]], ['slimeEval', ['quote', ['progn', ['defpackage', 'fvz', ['use', 'common-lisp', 'parenscript']], ['inPackage', 'fvz'], ['usePackage', 'parenscript'], 'Created Package fvz']]], ['slimeReplSetPackage', 'fvz']];
function clog() {
    var args = Array.prototype.slice.call(arguments, 0);
    return console.log.apply(console, args);
};
clog('Trident is working as expected');