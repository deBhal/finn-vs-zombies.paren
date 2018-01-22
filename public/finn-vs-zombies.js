['progn', ['setq', 'httpdPort', 8081], ['httpdServeDirectory', ['format', '%s', 'defaultDirectory']], ['browseUrl', ['format', 'http://127.0.0.1:%d/index.html', 'httpdPort']], ['slimeMode'], ['tridentMode'], ['stealSlimeKeysForTridentbang']];
['progn', ['slimeLoadFile', 'finn-vs-zombies.lisp'], ['slimeReplSetPackage', 'fvz']];
function clog() {
    var args = Array.prototype.slice.call(arguments, 0);
    return console.log.apply(console, args);
};
clog('Trident is working as expected');