
function getAccessToken() {

        const clientID = 'b6bd1bc8d3484d1e9254244c435cc6be';

        const redirect_uri = 'http://localhost:3000/';

        let url = 'https://accounts.spotify.com/authorize';

        url += '?response_type=token';
        url += '&client_id=' + encodeURIComponent(clientID);
        url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
        
        window.location = url;

}

export default getAccessToken;

