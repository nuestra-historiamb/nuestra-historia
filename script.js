const $=s=>document.querySelector(s);
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function boot(){
  const steps=[
    [12,"Buscando a Martín..."],
    [35,"Martín encontrado ✓"],
    [56,"Buscando a Bárbara..."],
    [78,"Bárbara encontrada ✓"],
    [92,"Sincronizando corazones..."],
    [100,"Conexión establecida ❤️"]
  ];
  for(const [n,t] of steps){
    $("#progress").style.width=n+"%"; $("#percent").textContent=n+"%"; $("#status").textContent=t;
    await sleep(650);
  }
  await sleep(700); $("#loader").classList.add("hidden"); $("#story").classList.remove("hidden");
  document.querySelector(".hero .reveal").classList.add("visible");
}
boot();

const bgMusic=$("#bgMusic"), musicToggle=$("#musicToggle");
let musicWasPlaying=false;
function updateMusicButton(){musicToggle.textContent=bgMusic.paused?"♫":"❚❚";musicToggle.classList.toggle("playing",!bgMusic.paused);}
$("#startBtn").addEventListener("click",async()=>{bgMusic.volume=.32;try{await bgMusic.play();musicToggle.classList.remove("hidden");updateMusicButton();}catch(e){}document.querySelectorAll(".chapter")[0].scrollIntoView({behavior:"smooth"});});
musicToggle.addEventListener("click",async()=>{if(bgMusic.paused){try{await bgMusic.play()}catch(e){}}else bgMusic.pause();updateMusicButton();});
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.18});
document.querySelectorAll(".reveal").forEach(el=>io.observe(el));

let callTimerStarted = false;
const callTarget = 8*3600 + 17*60;
const callDuration = 10000;

function startCallTimer(){
  if(callTimerStarted) return;
  callTimerStarted = true;
  const startedAt = performance.now();

  function animateCallTimer(now){
    const elapsed = Math.min(now - startedAt, callDuration);
    const progress = elapsed / callDuration;
    const secs = Math.floor(callTarget * progress);

    const h=String(Math.floor(secs/3600)).padStart(2,"0"),
          m=String(Math.floor(secs%3600/60)).padStart(2,"0"),
          s=String(secs%60).padStart(2,"0");
    $("#callTimer").textContent=`${h}:${m}:${s}`;

    if(progress < 1){
      requestAnimationFrame(animateCallTimer);
    } else {
      $("#callTimer").textContent="08:17:00";
    }
  }
  requestAnimationFrame(animateCallTimer);
}

const callObserver = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      startCallTimer();
      callObserver.disconnect();
    }
  });
},{threshold:.65});

callObserver.observe($("#callTimer"));

const audio=$("#barbaraAudio");
$("#heartBtn").addEventListener("click",async()=>{
  $("#audioBox").classList.remove("hidden");
  $("#audioBox").scrollIntoView({behavior:"smooth",block:"center"});
  musicWasPlaying=!bgMusic.paused;
  if(musicWasPlaying){bgMusic.pause();updateMusicButton();}
  try{await audio.play()}catch(e){}
});
audio.addEventListener("ended",async()=>{
  if(musicWasPlaying){try{bgMusic.volume=.20;await bgMusic.play();updateMusicButton();let v=.20;const fade=setInterval(()=>{v=Math.min(.32,v+.01);bgMusic.volume=v;if(v>=.32)clearInterval(fade)},120)}catch(e){}}
  setTimeout(()=>{$("#afterAudio").classList.remove("hidden");$("#afterAudio").scrollIntoView({behavior:"smooth",block:"center"})},1800)
});
$("#moreBtn").addEventListener("click",()=>{$("#secret").classList.remove("hidden");$("#moreBtn").classList.add("hidden");$("#secret").scrollIntoView({behavior:"smooth",block:"center"})});