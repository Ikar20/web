
// --------------------- fans appeal ----------------------

function createAppeal(){
    let text = document.getElementById("text");
    if (text.value.trim() === "") {
        // text.classList.add("not-valid");
        console.log("Invalid value");
        return;
    }
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let text1 = text.value;
    let Appeal = {
        appeal: text1,
        date: date,
        time: time,
        user: "User"
    };
    let serialNewAppeal = JSON.stringify(Appeal);
    saveToLocalStorage(serialNewAppeal, "fans_appeals");
    document.getElementById("text").value = "";
}
function addAppealOnPage() {
    var existingAppeals = getExistingFromLocalStorage("fans_appeals");
    let appeal;
    for (appeal in existingAppeals) {
        appeal = JSON.parse(existingAppeals[appeal]);
        let div = document.createElement("div");
        div.className = "container 	background-color: #17181c";
        let divCont = document.createElement("div");
        divCont.className = "row";
        let divInfo = document.createElement("div");
        divInfo.className = "user-info col-md-3";

        let p1 = document.createElement("p");
        let p2 = document.createElement("p");
        let p3 = document.createElement("p");
        let node_username = document.createTextNode(appeal.user);
        let node_time = document.createTextNode(appeal.time);
        let node_date = document.createTextNode(appeal.date);
        let node_text = document.createTextNode(appeal.appeal);
        p1.appendChild(node_username);
        p2.appendChild(node_time);
        p3.appendChild(node_date);
        divInfo.appendChild(p1);
        divInfo.appendChild(p2);
        divInfo.appendChild(p3);
        let parent = document.getElementById("news-block");
        let text_div = document.createElement("div");
        text_div.className = "text col-md-9";
        let pText = document.createElement("p");
        pText.appendChild(node_text);
        text_div.appendChild(pText);
        divCont.appendChild(divInfo);
        divCont.appendChild(text_div);
        div.appendChild(divCont);
        parent.appendChild(div);
        document.getElementById("text").value = "";
    }
}

// ------------------------ news --------------------------

let src;
function add_news_img(files) {
    let img = document.getElementById("image");
    let reader = new FileReader();
    reader.onload = function(){
        src = reader.result;
        img.src = src;
    };
    reader.readAsDataURL(files[0]);
    alert("Uploaded");
}
function add_news() {
    let title = document.getElementById("title").value;
    let news = document.getElementById("news").value;
    let bool = true;
    let img_2 = document.getElementById("image");
    if(title === "") {
        alert("News Title is empty");
        title = document.getElementById("title");
        bool = false;
    }
    if(news === "") {
        alert("News Body is empty");
        title = document.getElementById("news");
        bool = false;
    }
    if(bool) {
        alert("Successfully added");
        let News = {
            img: src,
            title: title,
            text: news,
        };
        let serialNewNews = JSON.stringify(News);
        saveToLocalStorage(serialNewNews, "news");
        document.getElementById("title").value = "";
        document.getElementById("news").value = "";
        document.getElementById("image").src = "images/img_empty.png";
    }
}
function addNewsOnPage() {
    let existingNews = getExistingFromLocalStorage("news");
    let news;
    for (news in existingNews){
        news = JSON.parse(existingNews[news]);

        let div = document.getElementById("news-div");
        let child_div = div.lastElementChild;

        let div_1 = document.createElement("div");
        div_1.className = "container 	background-color: #17181c";
        let div_2 = document.createElement("div");
        let img = document.createElement("img");
        let h5 = document.createElement("h5");
        let b = document.createElement("b");
        let p = document.createElement("p");

        
        img.className = "card-img-top";
        div_2.className = "card-body";
        // div_1.className = "card";
        h5.className = "card-title";
        p.className = "card-text";

        img.style = "width: 287px;";
        div_1.style = "max-width: 290px;";
        h5.style = "text-align: center;";

        let node_text = document.createTextNode(news.text);
        let node_title = document.createTextNode(news.title);
        img.src = news.img;
        div_1.appendChild(img);
        b.appendChild(node_title);
        h5.appendChild(b);
        div_2.appendChild(h5);
        p.appendChild(node_text);
        div_2.appendChild(p);
        div_1.appendChild(div_2);
        child_div.appendChild(div_1);
    }
}

// --------------------  localStorage- --------------------

function saveToLocalStorage(object, key){
    if (isOnline()){
        alert("Server communication");
    }
    else {
        let existingObjects = getExistingFromLocalStorage(key);
        existingObjects.push(object);
        existingObjects = JSON.stringify(existingObjects);
        localStorage.setItem(key, existingObjects);
    }
}
function getExistingFromLocalStorage(key){
    let existingObjects = localStorage.getItem(key);
    existingObjects = JSON.parse(existingObjects);
    if (existingObjects === null){
        existingObjects = [];
    }
    return existingObjects;
}

// ---------------  Additional functions ------------------

function isOnline() {
    return window.navigator.onLine;
}
function handleConnectionChange(event){
    if(event.type === "offline"){
        alert("You are offline")
    }
    if(event.type === "online"){
        alert("Connection established");
        addAppealOnPage();
        addNewsOnPage();
        localStorage.removeItem('fans_appeals');
        localStorage.removeItem('news')
    }
}
window.addEventListener('online', handleConnectionChange);
window.addEventListener('offline', handleConnectionChange);
