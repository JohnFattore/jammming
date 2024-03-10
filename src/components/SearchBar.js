import React, {useState, useEffect} from 'react';
import SearchResults from './SearchResults';
//form to type in search, passes to results to get them
//for onSubmit, may want this to be changing the form value to trigger a re render...
function SearchBar(props) {
    const [search,setSearch] = useState('');

// to see if key changes, here is URL at 1 pm 
// http://localhost:3000/#access_token=BQAGvFcwmyUMTvUrVeo4mYt3lEzauKgnNr8nPQpo5tbmz4wC_4iobaCkTy51Ix2uWK__Sta71Sd3xEXGNEQeGVQ6YsZiGSULOYp3VYYvnF5BfRMnL6in8Q1PSqA8RrQNRVk0jDmygYXiPHJbtqmdcFU6kqVvR52tQ_zQ8KH2NFhP9RNtuWu1n78m7PT8gHGQb4fDUS_RIZJBq9CKwldqjtSMoJzHrjbR3mBwoTtiL7DCj5Bo-wpFrRKc&token_type=Bearer&expires_in=3600
 
    //Get Access token to make calls
    useEffect(() => {
        if (props.aToken === '') {
            const searchParams = new URLSearchParams(window.location.hash); //if after # then .has, after ? then .search
            props.setToken(searchParams.get('#access_token'));
        }
    },[]);
    

    const [tracks,setTracks] = useState([])

    //API Call to get tracks and set track

    async function searchTracks() {

        try {
            let host = "https://api.spotify.com";
            let endpoint = "/v1/search?";
            //let query = "?q=" + search + '&type=track';

            let response = await fetch(host+endpoint + new URLSearchParams({
                q: search,
                type: "track",
            }), {
                headers: {
                    'Authorization': 'Bearer ' + props.aToken
                }
            })

            if (response.ok) {
                const jsonResponse = await response.json();
                //console.log(jsonResponse.tracks.items);
                setTracks(jsonResponse.tracks.items);
            }
            else {
                console.log(response.statusText)
                throw new Error('Fail');
            }

        } catch(e) {
            console.log(e);
        }
    }


    const changeHanlder = (e) => {
        setSearch(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (search !== '') {
            searchTracks();
        }
    }

     return (
        <>
            <div className = 'searchbar'>
                <form onSubmit = {handleSubmit}>
                    <label htmlFor ='search'>Search for a Song</label>
                    <input name = 'search' type = 'text' value = {search} onChange = {changeHanlder} placeholder = 'Search for a song title'/>
                    <input name = 'submit' type = 'submit' value = 'Submit' />
                </form>
            </div>

            <SearchResults tracks = {tracks} addPlay = {props.addPlay}/>
        </>
    );
}

export default SearchBar;