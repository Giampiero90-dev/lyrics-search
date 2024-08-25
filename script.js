const form = document.getElementById('form');
const search = document.getElementById('search');
const results = document.getElementById('results');
const more = document.getElementById('more');
const counter = document.getElementById('counter');

const apiURL = 'https://api.lyrics.ovh'

// Search by song or artist
async function searchSongs(term) {
    // fetch(`${apiURL}/suggest/${term}`).then(res => res.json()).then(data => console.log(data));
    
    const res = await fetch(`${apiURL}/suggest/${term}`);
    const data = await res.json();
        
    showData(data);
}

// Show songs and artist in DOM
function showData(data) {
    let output = '';
    
    data.data.forEach(song => {
        results.innerHTML = `
            <ul class="songs">
                ${data.data.map(song =>
                    `<li>
                        <span><strong>${song.artist.name}</strong> - ${song.title}</span>
                        <button class="btn" data-artist="${song.artist.name}" data-song-title="${song.title}">Get Lyrics</button>
                    </li>`).join('')
                }
            </ul>
        `;
        
        counter.innerText = `${data.total} results`;
        
        if(data.prev || data.next) {
            more.innerHTML = `
                ${data.prev ?  `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>` : ''}
                ${data.next ?  `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>` : ''}
            `;
        } else {
            more.innerHTML = '';
        }
    });
}

// Get prev and next songs
async function getMoreSongs(url) {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await res.json();
    
    showData(data);
}

// Get Lyrics
async function getLyrics(artist, song) {
    const res = await fetch(`${apiURL}/v1/${artist}/${song}`);
    const data = await res.json();
        
    if(data.lyrics) {
        const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
    
        results.innerHTML = `
            <h2><strong>${artist}</strong> - ${song}</h2>
            <span>${lyrics}</span>
        `;
    } else {
        results.innerHTML = '<h2>No lyrics found</h2>'
    }
    
    more.innerHTML = '';
    counter.innerHTML = '';
}

// Event listeners
form.addEventListener('submit', e => {
    e.preventDefault();
    
    const searchTerm = search.value.trim();
    if(!searchTerm) {
        alert('Please type a search term');
    } else {
        searchSongs(searchTerm);
    }
});

// Get Lyrics button
results.addEventListener('click', e => {
    if(e.target.tagName === 'BUTTON') {
        const artist = e.target.getAttribute('data-artist');
        const song = e.target.getAttribute('data-song-title');
        console.log(artist, song)
        getLyrics(artist, song);
    }
});
