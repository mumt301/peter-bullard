//Modified code from mumt301 page

function generate_results() {
    // Extracting the data from the form
    let params = (new URL(document.location)).searchParams;
    if (params.has('artist')){
        let artist = params.get('artist');
        console.log(artist);
        // Filling-in the placeholder element
        let placeholder = document.getElementById('theresult');
        //placeholder.innerHTML = `The artist you are searching for is: ${artist}`;

        let queryURL = `https://musicbrainz.org/ws/2/artist?query=${artist}&limit=1`

        //Make the query (https://www.w3schools.com/js/js_ajax_http.asp - last two tables)
        let xmlHttp = new XMLHttpRequest(); // Create an XMLHttpRequest object
        xmlHttp.open("GET", queryURL); // Set the request method and URL
        xmlHttp.send(); // Initiates (sends) the request
        // Defines a function to be called when the readyState property changes
        xmlHttp.onreadystatechange = function() {
            if(this.readyState == 4 && this.status == 200){
                // readyState: holds the status of the XMLHttpRequest (0: request not initialized, 1: server connection established, 2: request received, 3: processing request, 4: request finished and response is ready)
                // status: returns the status-number of a request (200: "OK", 403: "Forbidden", 404: "Not Found")
                let retrievedData = this.responseXML; // Returns the response as document (XML data)
                console.log(retrievedData);


                //Choose top result for lookup
                let id = retrievedData.getElementsByTagName("artist")[0].id;
                console.log(id);

                let lookupURL = `https://musicbrainz.org/ws/2/artist/${id}?inc=release-groups`
                //do lookup to get discography
                let xmlHttp2 = new XMLHttpRequest();
                xmlHttp2.open("GET", lookupURL); // Set the request method and URL
                xmlHttp2.send(); // Initiates (sends) the request
                // Defines a function to be called when the readyState property changes
                xmlHttp2.onreadystatechange = function() {
                    if(this.readyState == 4 && this.status == 200){
                        // readyState: holds the status of the XMLHttpRequest (0: request not initialized, 1: server connection established, 2: request received, 3: processing request, 4: request finished and response is ready)
                        // status: returns the status-number of a request (200: "OK", 403: "Forbidden", 404: "Not Found")
                        let retrievedArtist = this.responseXML; // Returns the response as document (XML data)
                        console.log(retrievedArtist);

                        //Get titles and dates into arrays
                        let albums = retrievedArtist.getElementsByTagName("release-group");
                        let titles = Array(albums.length).fill(0);
                        let dates = Array(albums.length).fill(0);
                        for(i=0;i<titles.length;i++){
                            titles[i]=retrievedArtist.getElementsByTagName("title")[i];
                            dates[i]=retrievedArtist.getElementsByTagName("first-release-date")[i];
                        }
                        console.log(titles[0]);
                        console.log(dates[0]); 
                        
                        document.getElementById("results-table").innerHTML = makeTableHTML(titles,dates);
                        console.log(makeTableHTML(titles,dates));
                    }
                }

            }
        }

        
    }
}

//inspired by https://stackoverflow.com/a/15164796
function makeTableHTML(titles,dates) {
    var result = "<table border=1><tr><td>Album</td><td>Release Date</td></tr>";
    for(var i=0; i<titles.length; i++) {
        result += "<tr>";
        result += "<td>"+titles[i].innerHTML+"</td><td>"+dates[i].innerHTML+"</td>";
        result += "</tr>";
    }
    result += "</table>";
    return result;
    
}

window.onload = generate_results();
