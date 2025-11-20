const currentDateEl = document.getElementById('currentDate');
const currentTimeEl = document.getElementById('currentTime');

function pad(n){ return n < 10 ? '0' + n : '' + n }

function updateDateTime(){
    const now = new Date();
    const dateOpts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateEl.textContent = now.toLocaleDateString(undefined, dateOpts);
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());
    currentTimeEl.textContent = `${hours} : ${minutes} : ${seconds} ${ampm}`;
}
updateDateTime();
setInterval(updateDateTime, 1000);

const timerBtn = document.getElementById('timerBtn');
const timerResetBtn = document.getElementById('timerReset');
const minInput = document.getElementById('min');
const secInput = document.getElementById('sec');
const timerDisplay = document.getElementById('timerDisplay');

let timerInterval = null;
let remainingSec = 0;

function renderTimer(){
    const m = Math.floor(remainingSec / 60);
    const s = remainingSec % 60;
    timerDisplay.textContent = `${pad(m)} : ${pad(s)}`;
}

timerBtn.addEventListener('click', () => {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        timerBtn.textContent = 'Resume';
    } else {
        if (remainingSec <= 0) {
            const m = parseInt(minInput.value || 0, 10);
            const s = parseInt(secInput.value || 0, 10);
            remainingSec = Math.max(0, (isNaN(m) ? 0 : m) * 60 + (isNaN(s) ? 0 : s));
            if (remainingSec <= 0) {
                timerDisplay.classList.add('done');
                setTimeout(() => timerDisplay.classList.remove('done'), 700);
                return;
            }
        }
        timerBtn.textContent = 'Pause';
        timerInterval = setInterval(() => {
            remainingSec -= 1;
            renderTimer();
            if (remainingSec <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
                timerBtn.textContent = 'Start';
                timerDisplay.classList.add('done');
                const prev = document.title;
                document.title = '⏰ Time is up!';
                setTimeout(() => document.title = prev, 3500);
            }
        }, 1000);
    }
});

timerResetBtn.addEventListener('click', () => {
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    remainingSec = 0;
    minInput.value = '';
    secInput.value = '';
    renderTimer();
    timerBtn.textContent = 'Start';
});

remainingSec = 0;
renderTimer();

const stopwatchBtn = document.getElementById('stopwatchBtn');
const stopwatchReset = document.getElementById('stopwatchReset');
const stopwatchDisplay = document.getElementById('stopwatchDisplay');

let swRunning = false;
let swStartTime = 0;
let swElapsed = 0;
let swInterval = null;

function renderStopwatch(ms){
    const totalSec = Math.floor(ms / 1000);
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;
    stopwatchDisplay.textContent = `${pad(hours)} : ${pad(minutes)} : ${pad(seconds)}`;
}

stopwatchBtn.addEventListener('click', () => {
    if (swRunning) {
        swRunning = false;
        clearInterval(swInterval);
        swInterval = null;
        swElapsed += Date.now() - swStartTime;
        stopwatchBtn.textContent = 'Start';
    } else {
        swRunning = true;
        swStartTime = Date.now();
        stopwatchBtn.textContent = 'Stop';
        swInterval = setInterval(() => {
            const current = Date.now();
            renderStopwatch(swElapsed + (current - swStartTime));
        }, 200);
    }
});

stopwatchReset.addEventListener('click', () => {
    if (swRunning) { swRunning = false; clearInterval(swInterval); swInterval = null; stopwatchBtn.textContent = 'Start'; }
    swElapsed = 0;
    swStartTime = 0;
    renderStopwatch(0);
});

renderStopwatch(0);

[minInput, secInput].forEach(inp => inp.addEventListener('keydown', e => { if (e.key === 'Enter') timerBtn.click(); }));
