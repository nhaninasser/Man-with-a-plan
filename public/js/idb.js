let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
    const db = event.target.result;

    db.createObjectStore("new_tracker", { autoIncrement: true });
};
request.onsuccess = function (event) {
    db = event.target.result;
    if (navigator.onLine) {
        uploadTransaction();
     }
};
request.onerror = function (event) {
    console.log(event.target.errorCode);
};

function saveTracker(tracker) {
    const transaction = db.transaction(["new_tracker"], "readwrite");
    const budgetObjectStore = transaction.objectStore("new_tracker");
    budgetObjectStore.add(tracker);
}

function uploadTransaction() {
    const transaction = db.transaction(["new_tracker"], "readwrite");
    const budgetObjectStore = transaction.objectStore("new_tracker");
    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch("/api/transaction", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then((serverResponse) => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }

                    const transaction = db.transaction(["new_tracker"], "readwrite");
                    const budgetObjectStore = transaction.objectStore("new_tracker");

                    budgetObjectStore.clear();

                    alert("All saved transactions has been submitted!");
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };
}


window.addEventListener("online", uploadTransaction);