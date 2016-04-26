sqlite.$inject = ["$q"];

function sqlite($q) {
    return {
        db: null,
        echoTest: function () {
            let defered = $q.defer();
            if (window.sqlitePlugin != undefined) {
                window.sqlitePlugin.echoTest(function () {
                    defered.resolve(true);
                });
            } else {
                defered.reject(false);
            }
            return defered.promise;
        },
        openDatabase: function () {
            let defered = $q.defer();
            window.sqlitePlugin.openDatabase({name: 'csa.db', location: 'default'}, function (db) {
                defered.resolve(db);
            }, function () {
                defered.inject();
            });
            return defered.promise;
        },
        insert: function () {
            this.openDatabase().then(db=> {
                db.executeSql('INSERT INTO MyTable VALUES (?)', ['test-value'], function (resultSet) {
                    console.log('resultSet.insertId: ' + resultSet.insertId);
                    console.log('resultSet.rowsAffected: ' + resultSet.rowsAffected);
                }, function (error) {
                    console.log('SELECT error: ' + error.message);
                });
            });
        }
    };
}

module.exports = sqlite;