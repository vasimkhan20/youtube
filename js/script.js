// lets select all required tags or elements

const wrapper = document.querySelector('.wrapper'),
musicImg = wrapper.querySelector('.img-area img'),
musicName = wrapper.querySelector('.song-detials .name'),
muiscArtist = wrapper.querySelector('.song-detials .artist'),
mainAudio = wrapper.querySelector('#main-audio'),
playPauseBtn = wrapper.querySelector('.play-pause'),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressBar = wrapper.querySelector(".progress-bar"),
progressArea = wrapper.querySelector(".progress-area"),
current_time = wrapper.querySelector(".current"),
fullTime = wrapper.querySelector(".duration");

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

window.addEventListener("load",()=> {
    loadMusic(musicIndex);
    playingNow();
})

// load music function  

function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb-1].name;
    muiscArtist.innerText = allMusic[indexNumb-1].artist;
    musicImg.src = `images/${allMusic[indexNumb-1].img}.webp`;
    mainAudio.src = `music/${allMusic[indexNumb-1].src}.mp3`;
}

// play or music button event
let isPlay = false;
const playMusic = ()=> {
    isPlay = true;
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

const pauseMusic = ()=> {
    isPlay = false;
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}

playPauseBtn.addEventListener("click",()=> {
    isPlay ? pauseMusic() : playMusic();
});

const nextMusic = ()=> {
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

const prevMusic = ()=> {
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}

nextBtn.addEventListener("click",()=> {
    nextMusic();// calling next music
})

prevBtn.addEventListener("click",()=> {
    prevMusic();// calling previous music
})

// update progress bar according to song 

mainAudio.addEventListener("timeupdate",(e)=> {
    const {currentTime,duration} = e.srcElement;
    let progressWidth = (currentTime/duration)*100;
    progressBar.style.width = `${progressWidth}%`;

    let full_min =  Math.floor(duration/60);
    let full_sec =  Math.floor(duration%60);

    if(full_sec<10) {
        full_sec = `0${full_sec}`;
    }
    if(duration) {
        fullTime.textContent = `${full_min}:${full_sec}`;
    }

    let curr_min = Math.floor(currentTime/60);
    let curr_sec = Math.floor(currentTime%60);
    if(curr_sec<10) {
        curr_sec = `0${curr_sec}`;
    }
    current_time.textContent = `${curr_min}:${curr_sec}`;
});

progressArea.addEventListener("click",(e)=> {
    const{duration} = mainAudio;
    let progress_move = (e.offsetX /e.srcElement.clientWidth)*duration;
    mainAudio.currentTime = progress_move;
    playMusic();
})

// lets work on repeat button according to the icon

const repeatBtn = wrapper.querySelector("#repeat");
repeatBtn.addEventListener("click", ()=> {
    // first we get the innertext og the icon then we'll change accordingly
    let getText = repeatBtn.innerText;
    // lets do diffrent changes on different icon click using switch
    switch(getText) {
        case "repeat": // if this icon repeat then change it to repeat_one
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title","Song looped");
            break;
        case "repeat_one":// if icon is repeat_one  then change it to shuffle
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title","Playback shuffle");
            break;
        case "shuffle":// if icon is shuffle then change it to repeat
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title","Playlist looped");
            break;
            
    }
});

// above we just changed the icon ,now let's work on what to do after song ended
mainAudio.addEventListener("ended",()=> {
    // we'll do according to the icon means if user has set icon to loop song then we'll repeat the current song and will do further accordingly

    let getText = repeatBtn.innerText;
     // lets do diffrent changes on different icon click using switch
     switch(getText) {
        case "repeat": // if this icon repeat then simply we call the nextMusic function
            nextMusic();
            break;
        case "repeat_one":// if icon is repeat_one  then change it to shuffle
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":// if icon is shuffle then change it to repeat
            let rndmIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do {
                rndmIndex = Math.floor((Math.random() * allMusic.length) + 1);
            }while(musicIndex == rndmIndex);
            musicIndex = rndmIndex;
            loadMusic(musicIndex);
            playMusic();
            playingNow();
            break;      
    }
})

// show music playlist 

const musicList = wrapper.querySelector(".music-list")
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = musicList.querySelector("#close");

showMoreBtn.addEventListener("click", ()=> {
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", ()=> {
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

// let's create li according to the array length

for( let i = 0; i < allMusic.length; i++) {
    // let's pass the song name , artistfrom the array to li
    let liTag = `<li li-index="${i + 1}">
            <div class="row">
                <span>${allMusic[i].name}</span>
                <p>${allMusic[i].artist}</p>
            </div>
            <audio class="${allMusic[i].src}" src="music/${allMusic[i].src}.mp3"></audio>
            <span id="${allMusic[i].src}" class="audio_duration">3:34</span>
        </li>`;
        ulTag.insertAdjacentHTML("beforeend",liTag);
        let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
        let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

        liAudioTag.addEventListener("loadeddata",()=> {
            let audioDuration = liAudioTag.duration;
            let totalMin = Math.floor(audioDuration/60);
            let totalSec = Math.floor(audioDuration%60);
            if(totalSec<10) {
                totalSec = `0${totalSec}`;
            }

            liAudioDuration.innerText = `${totalMin}:${totalSec}`;
            liAudioDuration.setAttribute("t-duration",`${totalMin}:${totalSec}`);
        })
}

// //lets work on particular song on click
const allLiTags = ulTag.querySelectorAll("li");
function playingNow() {
    for(let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio_duration");

        if(allLiTags[j].classList.contains("playing")) {
            allLiTags[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }

        if(allLiTags[j].getAttribute("li-index") == musicIndex) {
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "playing";
        }
        allLiTags[j].setAttribute("onclick","clicked(this)");
    }
}
// lets play song on li click
function clicked(element) {
    // getting li indexof particular clicked li tag
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex; // passing that liindex to musicindex
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}