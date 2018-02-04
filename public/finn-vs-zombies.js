['progn', ['setq', 'httpdPort', 8081], ['httpdServeDirectory', ['format', '%s', 'defaultDirectory']], ['browseUrl', ['format', 'http://127.0.0.1:%d/index.html', 'httpdPort']], ['slimeMode'], ['tridentMode'], ['stealSlimeKeysForTridentbang'], ['slimeLoadFile', 'finn-vs-zombies.lisp']];
['progn', ['slimeLoadFile', 'finn-vs-zombies.lisp'], ['slimeReplSetPackage', 'fvz']];
function clog() {
    var args = Array.prototype.slice.call(arguments, 0);
    return console.log.apply(console, args);
};
/** Trigger a debug so we can find where the browser has loaded dynamic scripts */
function triggerDebug() {
    debugger;
    return null;
};
clog('Trident is working as expected');