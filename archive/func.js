/* FUNCTIONS */
async function readProjects() {
    fetch("projs.json")
    .then(res => res.json())
    .then(data => createList(data, fOrder.value, fTags.value, search.value))
}


function createList(projs, alphabetical, tags, query){
    projsWrapper.innerHTML = "";

    
    if (tags != "") {
        console.log(tags);
        projs = projs.filter(item => item.tags.indexOf(tags) > -1);
    }

    if (query != "") {
        projs = projs.filter(item=>item.title.toLowerCase().includes(query.toLowerCase()));
    }

    if (alphabetical == "true") {
        projs.sort((a,b) => a.title > b.title ? 1 : -1);
    }


    for(let i = 0; i <= projs.length -1; i++){
        let a = document.createElement("a");
        a.title = "Open the project " + projs[i].title;
        a.href = "?p="+projs[i].name;
        let li = document.createElement("li");
        let pName = document.createElement("p");
        let pYear = document.createElement("p");
        pName.classList.add("p_name");
        pName.innerHTML = projs[i].title;
        pYear.classList.add("p_year");
        pYear.innerHTML = projs[i].year;
        li.appendChild(pName);
        li.appendChild(pYear);
        a.appendChild(li);
        projsWrapper.append(a);

        if (getParameterByName("p") != null) {
            if (getParameterByName("p").includes(projs[i].name)){
                openProject(projs[i]);
                a.classList.add("selected");
            }
        }
    }
}

function openProject(proj) {
    feed.innerHTML = '<iframe src="proj/'+proj.name+'.html" loading="lazy"></iframe>';
}

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function triggerOptions(){
    let filters = document.getElementById("filters");
    let list = document.getElementById("list");
    let links = document.getElementById("links");
    if (filters.style.display == "none" || filters.style.display == "") {
        filters.style.display = "block";
        list.style.display = "block";
        links.style.display = "block";
    }else{
        filters.style.display = "none";
        list.style.display = "none";
        links.style.display = "none";
    }
}


function resizeListHeight(){
    let hgt = window.innerHeight - (header.offsetHeight + filters.offsetHeight + links.offsetHeight) - (13 + 22) - 70;
    projsWrapper.style.maxHeight = hgt + "px";
    console.log(window.innerHeight, hgt);
    console.log(projsWrapper.style.maxHeight);
}


















