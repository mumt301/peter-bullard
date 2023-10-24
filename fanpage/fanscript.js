function openPage(pageName,elmnt,evt,colorDark,colorMid,colorLight) {
    var i, tabcontent, tablinks, tab, r;

    //Hide all content
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    //set all tablinks inactive
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    //set clicked button active
    evt.currentTarget.className += " active";

    //Set tab color
    tab = document.getElementsByClassName("tab");
    for (i = 0; i < tab.length; i++){
        tab[i].style.backgroundColor = colorMid;
    }

    //Display chosen content
    document.getElementById(pageName).style.display = "block";

    //Change color scheme
    r=document.querySelector(':root');
    r.style.setProperty('--colorDark', colorDark);
    r.style.setProperty('--colorMid', colorMid);
    r.style.setProperty('--colorLight', colorLight);
}

function albumInfo(release, label) {
    var paragraph = document.getElementById("albumInfo");
    paragraph.innerHTML = "Release: " + release + "<br>Label: " + label;
}

document.getElementById("defaultOpen").click();