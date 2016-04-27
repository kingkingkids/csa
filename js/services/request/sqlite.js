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
        saveUserInfo: function (str) {
            this.openDatabase().then(db=> {
                db.transaction(tx=> {
                    //tx.executeSql('DROP TABLE IF EXISTS usersTable');
                    tx.executeSql('CREATE TABLE IF NOT EXISTS usersTable (id integer primary key, datas text)');//如果没有数据库则先创建一个数据库
                    tx.executeSql("SELECT count(id) as cnt FROM usersTable;", [], function (tx, res) {//检查是否存在记录，否则插入一条新的记录
                        if (res.rows.item(0).cnt == 0) {
                            tx.executeSql("INSERT  INTO usersTable (datas) VALUES (?);", [str], function (tx, res) {
                                tx.executeSql("SELECT  datas as dd  FROM  usersTable;", [], function (tx, res) {
                                    console.log("hello:" + res.rows.item(0).dd);
                                });
                            });
                        } else {
                            //如果已经有记录，则更新首行
                            tx.executeSql("UPDATE  usersTable SET  datas = ? WHERE id =1", [str], function (tx, res) {
                                tx.executeSql("SELECT  datas as dd  FROM  usersTable;", [], function (tx, res) {
                                    console.log("hello:" + res.rows.item(0).dd);
                                });
                            });
                        }
                    });
                }, function () {
                    db.close();
                }, function () {
                    db.close();
                });
            });
        }
    };
}

module.exports = sqlite;