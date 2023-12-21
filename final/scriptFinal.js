function generate_results() {
    let params = (new URL(document.location)).searchParams;
    let metric = "";
    if (params.has('metric')){
        metric = params.get('metric');
        document.getElementById(metric).checked = true;

        //Fill inputs 
        for (i=1;i<=20;i++){
            document.getElementById(`song${i}`).value = params.get(`song${i}`);
            document.getElementById(`artist${i}`).value = params.get(`artist${i}`);
        }
    }  


    let tokenUri = 'https://accounts.spotify.com/api/token'
    let tokenRequest = new XMLHttpRequest();
    tokenRequest.open("POST", tokenUri);
    tokenRequest.setRequestHeader('Content-Type','application/x-www-form-urlencoded')
    tokenRequest.send("grant_type=client_credentials&client_id=7709891d0da644cf82caa446d1dfd4d6&client_secret=608d77f2c16a476d83499221a95bdeb8")
    tokenRequest.onreadystatechange = function() {

        //everything with API call should happen in here
        if(this.readyState == 4 && this.status == 200){
            let token_response = tokenRequest.responseText;
            let access_token = JSON.parse(token_response).access_token;
            console.log(tokenRequest.responseText);
            console.log(access_token);

            var songIdList = [];
            let songIdListString = "";
            let songi="";
            let artisti="";

            let searchRequests = [];
            let searchUrls = [];
            let c=0; //number of songs

            //Prepare search URLs in array
            for (i=1;i<=20;i++) {
                if (params.has(`song${i}`) && params.get(`song${i}`)!="") {

                    songi = params.get(`song${i}`);
                    console.log(songi);

                    artisti=params.get(`artist${i}`);
                    console.log(artisti);

                    //create api call url
                    searchUrls[c] = `https://api.spotify.com/v1/search?q=track:"${songi}"`;
                    if (artisti != ""){
                        searchUrls[c] = searchUrls[c] + ` artist:"${artisti}"`;
                    }
                    searchUrls[c] = searchUrls[c] + `&type=track&limit=1`;

                    c=c+1;  
                    console.log("c="+c);
                }
            }
            
            
            //make API calls in array
            var searchCounter = 0;
            var searchResults = [];
            for (j=0;j<c;j++){
                console.log(`Search Url ${j}: `+searchUrls[j]);
                searchRequests[j]= new XMLHttpRequest();
                searchRequests[j].open("GET", searchUrls[j]);
                searchRequests[j].setRequestHeader('Authorization',`Bearer  ${access_token}`);
                searchRequests[j].send();
                searchRequests[j].onreadystatechange = function() {
                    if(this.readyState == 4 && this.status == 200){
                        let retrievedData = this.responseText;
                        console.log(retrievedData);

                        parsedData = JSON.parse(retrievedData);
                        searchResults[searchCounter] = parsedData.tracks.items[0];
                        console.log(searchResults[searchCounter]);

                        //THIS IS THE ARTISTS NAME FROM THE SEARCH
                        console.log(parsedData.tracks.items[0].artists[0].name);

                        console.log(parsedData.tracks.items[0].id)

                        searchCounter = searchCounter + 1;
                        console.log("searchCounter="+searchCounter);

                        //Here goes ALL CODE using artist/track info.
                        if(searchCounter==c){
                            console.log(searchResults);
                            for(a=0;a<c;a++){
                                songIdListString += searchResults[a].id + ",";
                            }
                            songIdListString = songIdListString.slice(0,-1);
                            console.log(songIdListString);
                            let trackInfoUrl = `https://api.spotify.com/v1/audio-features?ids=${songIdListString}`
                            var trackInfo = new XMLHttpRequest();
                            trackInfo.open("GET", trackInfoUrl);
                            trackInfo.setRequestHeader('Authorization',`Bearer  ${access_token}`);
                            trackInfo.send();
                            trackInfo.onreadystatechange = function() {
                                if(this.readyState == 4 && this.status == 200){
                                    let trackDataUnparsed = this.responseText;
                                    let trackData = JSON.parse(trackDataUnparsed).audio_features;
                                    console.log(trackData);

                                    //Ordering happens here
                                    switch(metric) {
                                        case "tempoUp":
                                            console.log("tempoUp");
                                            orderedTracks = trackData.sort(function(a,b){return a.tempo - b.tempo});
                                            console.log(orderedTracks);
                                            break;
                                        case "tempoDown":
                                            console.log("tempoDown");
                                            orderedTracks = trackData.sort(function(a,b){return b.tempo - a.tempo});
                                            console.log(orderedTracks);
                                            break;
                                        case "danceUp":
                                            console.log("danceUp");
                                            orderedTracks = trackData.sort(function(a,b){return a.danceability - b.danceability});
                                            console.log(orderedTracks);
                                            break;
                                        case "danceDown":
                                            console.log("danceDown");
                                            orderedTracks = trackData.sort(function(a,b){return b.danceability - a.danceability});
                                            console.log(orderedTracks);
                                            break;
                                        case "loudUp":
                                            console.log("loudUp");
                                            orderedTracks = trackData.sort(function(a,b){return a.loudness - b.loudness});
                                            console.log(orderedTracks);
                                            break;
                                        case "loudDown":
                                            console.log("loudDown");
                                            orderedTracks = trackData.sort(function(a,b){return b.loudness - a.loudness});
                                            console.log(orderedTracks);
                                            break;
                                        case "energyUp":
                                            console.log("energyUp");
                                            orderedTracks = trackData.sort(function(a,b){return a.energy - b.energy});
                                            console.log(orderedTracks);
                                            break;
                                        case "energyDown":
                                            console.log("energyDown");
                                            orderedTracks = trackData.sort(function(a,b){return b.energy - a.energy});
                                            console.log(orderedTracks);
                                            break;
                                        case "posUp":
                                            console.log("posUp");
                                            orderedTracks = trackData.sort(function(a,b){return a.valence - b.valence});
                                            console.log(orderedTracks);
                                            break;
                                        case "posDown":
                                            console.log("posDown");
                                            orderedTracks = trackData.sort(function(a,b){return b.valence - a.valence});
                                            console.log(orderedTracks);
                                            break;
                                        case "speechUp":
                                            console.log("speechUp");
                                            orderedTracks = trackData.sort(function(a,b){return a.speechiness - b.speechiness});
                                            console.log(orderedTracks);
                                            break;
                                        case "speechDown":
                                            console.log("speechDown");
                                            orderedTracks = trackData.sort(function(a,b){return b.speechiness - a.speechiness});
                                            console.log(orderedTracks);
                                            break;
                                        case "instUp":
                                            console.log("instUp");
                                            orderedTracks = trackData.sort(function(a,b){return a.instrumentalness - b.instrumentalness});
                                            console.log(orderedTracks);
                                            break;
                                        case "instDown":
                                            console.log("instDown");
                                            orderedTracks = trackData.sort(function(a,b){return b.instrumentalness - a.instrumentalness});
                                            console.log(orderedTracks);
                                            break;
                                    }

                                    //Create table
                                    var tableHtml = "<table border=1><tr><td>Track</td><td>Artist</td></tr>";
                                    songIdList = songIdListString.split(",");
                                    console.log(songIdList);
                                    console.log(searchResults);
                                    for (k=0;k<c;k++){
                                        let orderedTrackId = orderedTracks[k].id;
                                        console.log(`ID ${k}: `+orderedTrackId);

                                        console.log(`songIdlist${k}: `+songIdList[k]);

                                        let trackIndex = songIdList.findIndex(matchId);
                                        console.log(`Index in results of ID ${k}: `+trackIndex);

                                        tableHtml += "<tr>";
                                        tableHtml += `<td>${searchResults[trackIndex].name}</td><td>${searchResults[trackIndex].artists[0].name}</td>`;
                                        tableHtml += "</tr>";

                                        function matchId(inputId){
                                            return inputId == orderedTrackId
                                        }
                                    }
                                    tableHtml += "</table>";

                                    document.getElementById("results-table").innerHTML = tableHtml
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

window.onload = generate_results();