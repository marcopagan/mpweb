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
            }else{homePG = true}
        }else{homePG = true}

    }
    if (homePG) {runSVG()}
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
    feedSVG.style.width = feed.offsetWidth - 15;
    feedSVG.style.height = feed.offsetHeight - 15;
}


function runSVG(){
    const svgns = "http://www.w3.org/2000/svg";
    setInterval(() => {
        let rect = document.createElementNS(svgns, 'rect');
        rect.setAttributeNS(null, 'x', Math.floor((feed.offsetWidth - 15) * Math.random()));
        rect.setAttributeNS(null, 'y', "-100");
        rect.setAttributeNS(null, 'width', "100");
        rect.setAttributeNS(null, 'height', "100");
        rect.setAttributeNS(null, 'rx', '5');
        rect.setAttributeNS(null, 'ry', '5');
        rect.setAttributeNS(null, 'stroke', "var(--pback)");
        rect.setAttributeNS(null, 'fill', "var(--back)");
        rect.setAttributeNS(null, 'stroke-width', '10');
        feedSVG.appendChild(rect);
        setInterval(() => {
            y = parseInt(rect.getAttribute("y")) + 5;
            r = parseInt(rect.getAttribute("y"));
            rect.setAttributeNS(null, 'y', y);
            rect.setAttributeNS(null, 'transform', "rotate("+y+")");
            if (rect.getAttribute("y") >= feed.offsetHeight - 15) {
                rect.remove();
            }
          }, 1000/40);
    }, 3000);
}















