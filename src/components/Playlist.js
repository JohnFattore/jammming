import React, {useState} from 'react';
import Track from './Track';

function PlayList(props) {

    const [title, setTitle] = useState('');

    const [userID, setUserID] = useState('');

    const [playlistID, setPlaylistID] = useState('');

    const uris = [];
    props.playlist.forEach(track => uris.push(track.uri)); //spotify uses to referemce tracks in the spotify libray

    const removeFromPlaylist = (e) => {
        const index = Number(e.target.getAttribute('valueindex'));
        props.setPlaylist(list =>  list.filter((_,j) => j !== index));
    };

    async function getUserId() {

        try {
            let url = 'https://api.spotify.com/';
            let endpoint = 'v1/me';
            let response = await fetch(url + endpoint, {
                headers: {
                    'Authorization': 'Bearer ' + props.aToken
                }
            })

            if (response.ok) {
                const jsonResponse = await response.json();

                setUserID(jsonResponse.id);
            } else {
                console.log(response)
                throw new Error('Fail userID get');
            }
        } catch(e) {
            console.log(e);
        }
        
    };

    async function createPlaylist() {
        try {
            let url = 'https://api.spotify.com/';
            let endpoint = 'v1/users/' + userID + '/playlists'
            let response = await fetch(url+endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + props.aToken
                },
                data: {
                    'name': title,
                    'description': 'New Playlist Created on Jammming',
                    'public': false
                }
            })

            if (response.ok) {
                let jsonResponse = await response.json();
                setPlaylistID(jsonResponse.id);
            } else {
                throw new Error('Fail create playlist');
            }
        } catch(e) {
            console.log(e);
        }
    }

    async function addPlaylist(e) {
        try {

            let url = 'https://api/spotify.com/';
            let endpoint = 'v1/playlists/' + playlistID + '/tracks';
            //let uriString = uris.join(); //joins by comma
            let response = await fetch(url+endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + props.aToken
                },
                data: {
                    'uris': uris
                }
            })

            if(response.ok) {
                props.setPlaylist([]);
            } else {
                throw new Error('Error add tracks!');
            }

        } catch(er) {
            console.log(er);
        }
    }


     async function handleSubmit (e) {
        
        //Get UserID
        e.preventDefault();

        if (userID === '') {
           await getUserId();
        }
        //Create playlist
        await createPlaylist();
        //Add items to playlist
        await addPlaylist();
    };
    

    return (
        <>
            <div className = 'playlist'>
                <div className = 'playlistname'>
                    <h1>Playlist</h1>
                    <form>
                        <input name = 'title' type = 'text' value = {title} onChange = {(e) => setTitle(e.target.value)} placeholder = 'Enter a playlist title'></input>
                    </form>
                </div>
            {
                props.playlist.map((track,i) => {
                    return (
                        <>
                            <div className = 'trackP' key = {String(i) + 'p'}>
                                <Track track = {track}/>
                                <div className = 'delete'>
                                    <p onClick = {removeFromPlaylist} valueindex = {i}>-</p>
                                </div>
                            </div>
                    </>
                    )
                })
            }
            </div>
            <div className ='savetospotify'>
                <form onSubmit = {handleSubmit}>
                    <input type ='submit' value = 'Save To Spotify'></input>
                </form>
            </div>
        </>

    );
}

export default PlayList;