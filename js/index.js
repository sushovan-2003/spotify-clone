let currentsong = new Audio()
let currfolder
let songs


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getsongs(folder) {
    currfolder = folder
    let x = await fetch(`/${folder}/`)
    let response = await x.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    
    let songsul = document.querySelector(".urplaylist").getElementsByTagName("ul")[0]
    songsul.innerHTML=""
    for (const song of songs) {
        songsul.innerHTML = songsul.innerHTML + `<li> 
                        <img src="img/music.svg" alt="">
                        <p> ${song.replaceAll("%20", " ").replaceAll("%", " ")}</p>
                        <div class="info flex">
                            <p> Play Now </p>
                            <img src="img/play.svg" alt="">
                        </div>


    </li>`
    }

    Array.from(document.querySelector(".urplaylist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", (element) => {
            playmusic(e.querySelector("p").innerHTML.trim())
            console.log(e.querySelector("p").innerHTML.trim())
        })

    })
    return songs
}

let playmusic = (track, pause = false) => {
    currentsong.src = `/${currfolder}/` + track
    if (!pause) {

        currentsong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}

async function displayalbums() {
    let x = await fetch(`/songs/`)
    let response = await x.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];

        if (e.href.includes("/songs/")) {
            let folder = e.href.split("/").slice(-2)[0]
            let x = await fetch(`/songs/${folder}/info.json`)
            let response = await x.json()
            console.log(response)
            document.querySelector(".spotifyplaylist").innerHTML = document.querySelector(".spotifyplaylist").innerHTML + ` <div class="card" data-folder="${folder}">
             <img src="img/greenplay.svg" alt="">
                    <img src="/songs/${folder}/cover.jpg/" alt="">
                    <p>${response.title}</p>
                    <p>${response.description}</p>
                </div>`
        }

    }


    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playmusic(songs[0])
        })

    })
}
async function main() {


    await getsongs("songs/cs")

    //display all the albuma in the playlist
    await displayalbums()

    playmusic(songs[0], true)

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "img/pause.svg"
        } else {
            currentsong.pause()
            play.src = "img/play.svg"
        }
    })

    currentsong.addEventListener("timeupdate", () => {

        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`

        document.querySelector(".circle").style.left = ((currentsong.currentTime) / (currentsong.duration)) * 100 + "%"
    })

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentsong.currentTime = (currentsong.duration * percent) / 100
    })

    //previous
    previous.addEventListener("click", () => {

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if (index - 1 >= 0) {
            playmusic(songs[index - 1])
        }



    })
    //next
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if (index + 1 < songs.length) {
            playmusic(songs[index + 1])
        }

    })

    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0%"

    })
    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-100%"

    })

    document.querySelector(".timevol").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100

        if(currentsong.volume>0){
            document.querySelector(".timevol>img").src=document.querySelector(".timevol>img").src.replace("img/mute.svg", "img/volume.svg")
        }
    })

    document.querySelector(".timevol img").addEventListener("click", (e) => {
        if (e.target.src.includes("img/volume.svg")) {
            document.querySelector(".timevol").getElementsByTagName("input")[0].value = 0
            e.target.src = e.target.src.replace("img/volume.svg", "img/mute.svg")
            currentsong.volume = 0
        } else {
            e.target.src = e.target.src.replace("img/mute.svg", "img/volume.svg")
            document.querySelector(".timevol").getElementsByTagName("input")[0].value = 10
            currentsong.volume = .20
        }

    })

}
main()