angular.module("DayTrackerApp")
    .service("LocalStorageService", localStorageService);

localStorageService.$inject = [];

function localStorageService() {

    let _isAvailable = false;
    const _storage = window.localStorage;

    let service = {
        init: initialize,
        exists: isExists,
        has: hasItem,
        save: saveItem,
        update: updateItem,
        replace: replaceItem,
        get: getItem,
        delete: deleteItem,
        size: getSize
    };

    return service;

    function initialize() {
        if (typeof(Storage) == "undefined") {
            _isAvailable = false;
        } else {
            _isAvailable = true;
        }
    }

    function isExists() {
        return _isAvailable;
    }

    function hasItem(key) {
        let value = getItem(key);
        return value != undefined || value != null;
    }

    function saveItem(key, value) {
        if (!_isAvailable) return;
        _storage.setItem(key, JSON.stringify(value));
    }

    function updateItem(key, value) {
        if (!_isAvailable) return;
        let oldValue = getItem(key, {});
        _storage.setItem(key, JSON.stringify({...oldValue, ...value }));
    }

    function replaceItem(key, value) {
        if (!_isAvailable) return;
        _storage.removeItem(key);
        saveItem(key, value);
    }

    function getItem(key, defaultValue) {
        let value = _storage[key];
        if (value && value.length)
            return JSON.parse(value);
        return defaultValue ? defaultValue : undefined;
    }

    function deleteItem(key) {
        if (hasItem(key)) {
            delete _storage[key];
        }
    }

    function getSize() {
        if (!_isAvailable) return;
        var data = encodeURIComponent(JSON.stringify(_storage));
        //16 utf-16. 8 bits to 1 byte, 1024 bytes to 1 kilobyte
        return data ? (((data.length * 16) / (8 * 1024))).toFixed(3) + ' KB' : 'Empty (0 KB)';
    }
}