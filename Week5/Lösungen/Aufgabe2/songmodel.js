const songs = [
    {"id": "01", "title": "Bleed", "artist": "Meshuggah", "rating": 3},
    {"id": "02", "title": "Ghost Love Score", "artist": "Nightwish", "rating": 2},
    {"id": "03", "title": "Demons Are a Girl's Best Friend", "artist": "Powerwolf", "rating": 1},
    {"id": "04", "title": "Heavy Metal Breakdown", "artist": "Gravedigger", "rating": 0},
    {"id": "05", "title": "Roll Over Beethoven", "artist": "Electric Light Orchestra", "rating": 0},
    {"id": "06", "title": "The Phalanx", "artist": "Trivium", "rating": 0},
    {"id": "07", "title": "Beds Are Burning", "artist": "Diesel and Dust", "rating": 0},
    {"id": "08", "title": "Rational Gaze", "artist": "Meshuggah ", "rating": 0},
];


function compareSongs(s1, s2) {
    return s2.rating - s1.rating;
}

function songsSorted(){
    return [...songs].sort(compareSongs);
}

function findSong(id) {
    return songs.find(song => parseInt(id) === parseInt(song.id));
}

function rateSong(songId, delta) {
    let song = findSong(songId);

    if(song) {
        song.rating += delta;
        return true;
    }
    return false;
}