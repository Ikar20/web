function isOnline(){
    return navigator.onLine;
}

var useLocalStorage = true;

class LocalStorageManager{
    addNew(type, obj){
        if (!isOnline()){
            let existing = this.getExisting(type, true);
            existing.push(obj);
            existing = JSON.stringify(existing);
            localStorage.setItem(type.concat("List"), existing);
        }
        else{
            let url;
            if(type == "appeal"){
                url = "/addAppeal";
            }
            else if(type == "news"){
                url = "/addNews";
            }
            console.log("Using my server");
            $.ajax({
                type: "POST",
                url: url,
                data: obj,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function(data){},
                failure: function(errMsg) {
                    console.log(errMsg);
                }
            });
        }
    }
    getExisting(type, important = false){
        if (isOnline() || important){
            let existing = localStorage.getItem(type.concat("List"));
            existing = JSON.parse(existing);
            if (existing === null){
                existing = [];
            }
            console.log(existing);
            return existing;
        }
        else{
            console.log("Using server.....");
            return [];
        }
    }
    clearStorage(type){
        localStorage.removeItem(type.concat("List"));
    }
}

class IndexedDBManager{
    connectDB(f) {
        var indexedDB = window.indexedDB;
        let request = indexedDB.open("mydb", 1);
        request.onerror = function(err) {
            console.log(err);
        };
        request.onsuccess = function() {
            f(request.result);
        }
        request.onupgradeneeded = function(e) {
            e.currentTarget.result.createObjectStore("appealList", {
                keyPath: "id",
                autoIncrement: true
            });
            e.currentTarget.result.createObjectStore("newsList", {
                keyPath: "id",
                autoIncrement: true
            });
        }
    }

    clearStorage(type) {
        var request = window.indexedDB.deleteDatabase("mydb");
        request.onerror;;
        request.onsuccess;
    }

    addNew(type, obj) {
        if (!isOnline()){
            let storageName = type.concat("List");
            this.connectDB(function(db) {
                obj = JSON.parse(obj);
                var request = db.transaction([storageName], "readwrite").objectStore(storageName).put(obj);

                request.onerror;
                request.onsuccess;
            });
        }
        else{
            console.log("Using server.....");
        }
    }

    getExisting(type, important = false) {
        if (isOnline()){
            let storageName = type.concat("List")
            this.connectDB(function(db) {
                var request = db.transaction(storageName).objectStore(storageName).getAll();
                request.onerror;
                request.onsuccess = function(){
                    let arr = [];
                    request.result.forEach(function(el){
                        arr.push(JSON.stringify(el));
                    });
                    if (type == "appeal"){
                        showAppeals(false, arr);
                    }
                    else if(type == "news"){
                        showNews(arr);
                    }
                }
            });
            return window.existing;
        }
        else{
            console.log("Using server.....");
            return [];
        }
    }

}
var dataProvider;
(function(){
    if (useLocalStorage){
        dataProvider = new LocalStorageManager();
    }
    else{
        dataProvider = new IndexedDBManager();
    }
})();

