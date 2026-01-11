// JavaScript to display today's date
const dateElement = document.getElementById('date');
const today = new Date();
const options = { year: 'numeric', month: 'long', day: 'numeric' };
dateElement.textContent = `${today.toLocaleDateString('en-US', options)}`;

// JavaScript to display yesterday's date
const yesterdayDateElement = document.getElementById('yesterday-date');
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const yesterdayOptions = { year: 'numeric', month: 'long', day: 'numeric' };
yesterdayDateElement.textContent = `${yesterday.toLocaleDateString('en-US', yesterdayOptions)}`;

async function loadChallenges() {
    const response = await fetch('challenges.json');
    const challenges = await response.json();

    const formatDate = (date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const todayKey = formatDate(today);
    const yesterdayKey = formatDate(yesterday);

    console.log("Today key:", todayKey);
    console.log("Yesterday key:", yesterdayKey);

    // obtaining links to display on the site
    const todayLinkEl = document.getElementById('today-link');
    const yesterdayLinkEl = document.getElementById('yesterday-link');

    // display the href (if the link exists), else disable the href and show "not posted"
    if (challenges[todayKey]) {
        todayLinkEl.href = challenges[todayKey].link;
        todayLinkEl.querySelector("p").textContent = "Click to play today's challenge.";
        todayLinkEl.style.pointerEvents = 'auto';
        todayLinkEl.style.opacity = '1';
    } else {
        todayLinkEl.removeAttribute('href');
        todayLinkEl.querySelector("p").textContent = "Challenge not posted.";
        todayLinkEl.style.pointerEvents = 'none';
        todayLinkEl.style.opacity = '0.6';
    }
    
    if (challenges[yesterdayKey]) {
        yesterdayLinkEl.href = challenges[yesterdayKey].link;
        yesterdayLinkEl.querySelector("p").textContent = "Click to view results.";
        yesterdayLinkEl.style.pointerEvents = 'auto';
        yesterdayLinkEl.style.opacity = '1';
    } else {
        yesterdayLinkEl.removeAttribute('href');
        yesterdayLinkEl.textContent = "Challenge not posted.";
        yesterdayLinkEl.style.pointerEvents = 'none';
        yesterdayLinkEl.style.opacity = '0.6';
    }
}
loadChallenges();
    

    
// JS for calendar functionality
async function initCalendar() {
    // Array of JSON file paths
    const files = ['challenges.json', 'chal2025.json'];

    // Fetch all files in parallel
    const responses = await Promise.all(files.map(f => fetch(f)));
    const jsonData = await Promise.all(responses.map(r => r.json()));

    // Merge all JSON objects into one
    const challenges = Object.assign({}, ...jsonData);

    // Extract available dates
    const availableDates = Object.keys(challenges);

    // Get the button element
    const calendarLinkEl = document.getElementById("calendar-link");

    // Initialize button state before any date is selected
    calendarLinkEl.classList.remove("enabled");
    calendarLinkEl.removeAttribute("href");
    calendarLinkEl.textContent = "Select a date to view challenge";

    // Initialize Flatpickr
    flatpickr("#calendar", {
        dateFormat: "Y-m-d",
        maxDate: new Date(),
        enable: availableDates, // only allow selecting dates that have challenges
        onChange: function(selectedDates, dateStr) {
            calendarLinkEl.classList.remove("enabled");
            calendarLinkEl.removeAttribute("href");
            calendarLinkEl.textContent = "Select a date to view challenge";

            if (challenges[dateStr]) {
                calendarLinkEl.href = challenges[dateStr].link;
                calendarLinkEl.textContent = "View Challenge";
                calendarLinkEl.classList.add("enabled");
            }
        }
    });
}
initCalendar();