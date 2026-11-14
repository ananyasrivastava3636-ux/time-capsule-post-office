/*
  ============================================================
  script.js : the LOGIC of the Time Capsule Post Office
  ============================================================
  index.html builds the page, style.css makes it pretty, and this
  file makes it DO things:
    1. Work out the opening date from your choice (1 week, birthday...).
    2. Save each letter in your browser (localStorage) when you press "Seal it".
    3. Read the saved letters back and show them in the list.

  index.html loads this file at the very bottom with:
    <script src="script.js"></script>

  Stage 1 note: right now the list shows the full letter text.
  In Stage 2 we'll lock it away until the opening date.

  Honesty note: this is a "gentle lock" for fun, not real security.
  Anyone who knows how can peek at saved data in the browser's tools.
*/


/* ============================================================
   PART 1: FINDING THINGS ON THE PAGE
   ============================================================
   document.getElementById("some-id") finds the element in
   index.html that has id="some-id", so JavaScript can read it
   or change it. We find everything once, at the top, and keep
   them in clearly named variables.

   NEW CONCEPT: const
   "const" creates a variable that will always point to the same
   thing. Like writing a label on a jar: the label stays put,
   even if you change what's inside the jar.
*/
const letterForm = document.getElementById("letter-form");
const letterTextBox = document.getElementById("letter-text");
const writerNameBox = document.getElementById("writer-name");
const birthdayBox = document.getElementById("birthday-box");
const birthdayDateInput = document.getElementById("birthday-date");
const customBox = document.getElementById("custom-box");
const customDateInput = document.getElementById("custom-date");
const openPreview = document.getElementById("open-preview");
const formMessage = document.getElementById("form-message");
const lettersList = document.getElementById("letters-list");

/*
  The name of the "drawer" in localStorage where we keep letters.
  Writing it once here avoids typos like "timeCapsuleLeters" later.
*/
const STORAGE_KEY = "timeCapsuleLetters";


/* ============================================================
   PART 2: SAVING AND LOADING LETTERS
   ============================================================
   NEW CONCEPT: localStorage
   A small storage space inside your browser, just for this website.
   It stores text under a name (a "key"), and it stays there even
   after you close the tab or restart your phone.
   Real-life example: a labelled locker at the gym. You put things
   in under your locker number and they're still there next visit,
   but ONLY at that gym (this browser, this device).

   localStorage vs IndexedDB (you asked about this):
   - localStorage: super simple (save text, read text), but small:
     about 5 MB per website. Perfect for beginners.
   - IndexedDB: a real mini-database in the browser. Holds much
     more (hundreds of MB), but it's much more complicated to use.
   We choose localStorage. Letters are tiny (a long letter is
   maybe 5 KB, so 5 MB fits about a thousand of them). In Stage 5
   we'll SHRINK photos to roughly 50–100 KB each before saving, so
   even with photos there's room for dozens of letters. If you ever
   fill it up, the app will tell you, and Export saves a backup.

   NEW CONCEPT: array of objects
   An OBJECT is one thing described by labelled facts:
     { name: "Drishti", text: "Hi future me!" }
   An ARRAY is an ordered list: [ "a", "b", "c" ].
   An ARRAY OF OBJECTS is a list of described things, like a stack
   of index cards, each card with the same headings filled in.
   All our letters live in one array of objects.

   NEW CONCEPT: JSON
   localStorage can only store TEXT, not arrays or objects.
   JSON is a way to write an object as text, and turn it back.
     JSON.stringify(object) -> text   (packing a suitcase)
     JSON.parse(text)       -> object (unpacking it)
*/

/*
  Reads all saved letters from localStorage and returns them as an array.
  If nothing has been saved yet, getItem gives back null (meaning
  "nothing here"), so we return an empty array [] instead.
  "try / catch" is a safety net: if the saved text is somehow broken
  (or storage is blocked), we don't crash, we just start with [].
*/
function getSavedLetters() {
  try {
    const savedText = localStorage.getItem(STORAGE_KEY);
    if (savedText === null) {
      return [];
    }
    return JSON.parse(savedText);
  } catch (error) {
    console.error("Could not read saved letters:", error);
    return [];
  }
}

/*
  Saves the whole array of letters into localStorage as JSON text.
  Returns true if it worked, false if it failed (for example, if
  storage is full), so the caller can show a friendly message.
*/
function saveLetters(lettersInPostbox) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lettersInPostbox));
    return true;
  } catch (error) {
    console.error("Could not save letters:", error);
    return false;
  }
}


/* ============================================================
   PART 3: DATES AND TIME MATHS
   ============================================================
   NEW CONCEPT: the Date object
   new Date() gives you "right now": the date AND the time, down
   to the millisecond, in your phone's time zone.
   Real-life example: like glancing at a clock-calendar on the wall.

   How JavaScript thinks about time:
   Inside, every Date is just ONE big number: the milliseconds
   since 1 January 1970 (a starting line programmers agreed on).
     1 second = 1000 ms
     1 minute = 60 × 1000 ms
     1 hour   = 60 × 60 × 1000 ms
     1 day    = 24 × 60 × 60 × 1000 ms = 86,400,000 ms
   So "how long until it opens?" is simply:
     openDate.getTime() - now.getTime()   -> milliseconds left
   and dividing by 86,400,000 turns that into days.
   (That subtraction is exactly how the countdown will work in Stage 2.)

   Useful Date tools:
     date.getFullYear()  -> 2026
     date.getMonth()     -> 0 to 11 (careful! January is 0, December is 11)
     date.getDate()      -> day of the month, 1 to 31
     date.setDate(n), date.setMonth(n), date.setFullYear(n) change those parts.
   A nice trick: setDate(40) on a 30-day month doesn't break;
   JavaScript just rolls forward into the next month.
*/

/* How many milliseconds are in one day. Named so the maths reads clearly. */
const MILLISECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;

/*
  Returns a copy of a date set to midnight (00:00) at the START of that day.
  We open letters at midnight, so "opens on 5 March" means the
  moment 5 March begins, not some random time of day.
  We make a COPY (new Date(date)) so we don't accidentally change the original.
*/
function startOfDay(date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0); // hours, minutes, seconds, milliseconds
  return copy;
}

/* Returns a new date that is "numberOfDays" days after the given date. */
function addDays(date, numberOfDays) {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + numberOfDays);
  return copy;
}

/*
  Returns a new date that is "numberOfMonths" months after the given date.
  Tricky case: 31 January + 1 month. There's no 31 February, so
  JavaScript would roll over to 3 March. To avoid that, if the
  day-of-month changed, we step back to the last day of the right
  month. setDate(0) means "the day before the 1st", i.e. the last
  day of the previous month. So 31 Jan + 1 month = 28 (or 29) Feb.
*/
function addMonths(date, numberOfMonths) {
  const copy = new Date(date);
  const originalDay = copy.getDate();
  copy.setMonth(copy.getMonth() + numberOfMonths);
  if (copy.getDate() !== originalDay) {
    copy.setDate(0);
  }
  return copy;
}

/*
  Turns the text from a date box ("2027-03-05") into a Date at
  midnight in YOUR time zone.

  Why not just new Date("2027-03-05")? Surprise gotcha: JavaScript
  reads that format as midnight in LONDON (UTC time), not in India.
  In India (5½ hours ahead) your letter would open at 5:30 am
  instead of midnight. Building the date from its parts avoids that.

  .split("-") cuts the text at each "-": "2027-03-05" -> ["2027","03","05"]
  .map(Number) turns each piece of text into a real number.
  We subtract 1 from the month because JavaScript months start at 0.
*/
function dateFromInputText(inputText) {
  const [year, month, day] = inputText.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/*
  Works out the date of your NEXT birthday, from any birthday date
  (the year you type doesn't matter, only the month and day).
  1. Try your birthday in THIS year.
  2. If that day is today or already gone, use NEXT year instead.
  (Born on 29 Feb? In non-leap years JavaScript rolls it to 1 March.)
*/
function nextBirthday(birthdayText) {
  const birthday = dateFromInputText(birthdayText);
  const today = startOfDay(new Date());

  const birthdayThisYear = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());

  if (birthdayThisYear <= today) {
    return new Date(today.getFullYear() + 1, birthday.getMonth(), birthday.getDate());
  }
  return birthdayThisYear;
}

/*
  Turns a Date into friendly text like "14 November 2026".
  toLocaleDateString formats dates the way people in a region
  write them; "en-IN" = English as written in India (day first).
*/
function formatDate(date) {
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/*
  Reads which "When should it open?" option is chosen and returns:
    - the opening Date, or
    - null if a date is still missing or isn't valid.
  "input[name='open-in']:checked" means "the radio button in the
  open-in group that is currently ticked".
*/
function calculateOpenDate() {
  const chosenOption = document.querySelector("input[name='open-in']:checked").value;
  const today = startOfDay(new Date());

  if (chosenOption === "1-week") {
    return addDays(today, 7);
  }
  if (chosenOption === "1-month") {
    return addMonths(today, 1);
  }
  if (chosenOption === "6-months") {
    return addMonths(today, 6);
  }
  if (chosenOption === "1-year") {
    return addMonths(today, 12);
  }
  if (chosenOption === "birthday") {
    // An empty date box gives "" (empty text), which counts as false.
    if (!birthdayDateInput.value) {
      return null;
    }
    return nextBirthday(birthdayDateInput.value);
  }
  if (chosenOption === "custom") {
    if (!customDateInput.value) {
      return null;
    }
    const pickedDate = dateFromInputText(customDateInput.value);
    // A letter to the future must open AFTER today.
    if (pickedDate <= today) {
      return null;
    }
    return pickedDate;
  }
  return null;
}


/* ============================================================
   PART 4: UPDATING WHAT YOU SEE
   ============================================================ */

/*
  Shows or hides the extra date boxes, and updates the little
  preview line ("Opens on 21 November 2026 (in 7 days)").
  We run this every time you change any option.
*/
function updateOpenChoice() {
  const chosenOption = document.querySelector("input[name='open-in']:checked").value;

  // Show a box only when its option is picked. hidden = true hides it.
  birthdayBox.hidden = chosenOption !== "birthday";
  customBox.hidden = chosenOption !== "custom";

  const openDate = calculateOpenDate();

  if (openDate === null) {
    if (chosenOption === "birthday") {
      openPreview.textContent = "Pick your birthday to see when it opens 🎂";
    } else {
      openPreview.textContent = "Pick a date after today 📅";
    }
    return;
  }

  // Time maths in action: difference in ms, divided by ms-per-day.
  // Math.round tidies up tiny wobbles (for example, daylight-saving days).
  const daysUntilOpen = Math.round((openDate - startOfDay(new Date())) / MILLISECONDS_IN_A_DAY);
  openPreview.textContent = `Opens on ${formatDate(openDate)} (in ${daysUntilOpen} days) ✨`;
}

/*
  Builds the list of saved letters on the page.

  We create each piece with document.createElement and fill it with
  .textContent. Why not just paste HTML text? Because if a letter
  happened to contain something like <b>, the browser would treat it
  as code. textContent always shows it as plain words. Safe habit!
*/
function showLetters() {
  const lettersInPostbox = getSavedLetters();

  // Empty the list first, so we don't show every letter twice.
  lettersList.innerHTML = "";

  // If there are no letters yet, show a friendly line instead.
  if (lettersInPostbox.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.className = "small-text";
    emptyMessage.textContent = "No letters yet. Write your first one above! ✉️";
    lettersList.appendChild(emptyMessage);
    return;
  }

  // Sort so the letter that opens soonest is at the top.
  // sort compares two letters (a and b) at a time; a negative answer puts a first.
  lettersInPostbox.sort((a, b) => new Date(a.opensAt) - new Date(b.opensAt));

  /*
    NEW CONCEPT: forEach
    Runs the same steps once for EACH item in an array.
    Real-life example: "for each guest on the list, write a name card".
  */
  lettersInPostbox.forEach((letter) => {
    const listItem = document.createElement("li");
    listItem.className = "letter-item";

    const datesLine = document.createElement("p");
    datesLine.className = "small-text";
    datesLine.textContent =
      `Sealed ${formatDate(new Date(letter.sealedAt))} · Opens ${formatDate(new Date(letter.opensAt))}`;

    const bodyLine = document.createElement("p");
    bodyLine.className = "letter-body";
    bodyLine.textContent = `Dear Future Me,\n${letter.text}\n\nLove, ${letter.writerName}`;

    // Put the two lines inside the list item, and the item inside the list.
    listItem.appendChild(datesLine);
    listItem.appendChild(bodyLine);
    lettersList.appendChild(listItem);
  });
}


/* ============================================================
   PART 5: REACTING TO WHAT YOU DO (event listeners)
   ============================================================
   NEW CONCEPT: event listener
   An event listener waits for something to happen (a click, a
   typed letter, a form being sent) and then runs your code.
   Real-life example: a doorbell. Nothing happens until someone
   presses it; then it rings.
     element.addEventListener("what happened", whatToDo)
*/

/*
  "change" happens whenever any box or radio inside the form changes.
  So picking a new option or a new date updates the preview straight away.
*/
letterForm.addEventListener("change", updateOpenChoice);

/*
  "submit" happens when you press "Seal it".
  event.preventDefault() stops the browser's old-fashioned behaviour
  of reloading the whole page when a form is sent.
*/
letterForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const openDate = calculateOpenDate();
  if (openDate === null) {
    formMessage.textContent = "Please choose a valid opening date first 📅";
    return;
  }

  /*
    Build ONE letter object. Dates are saved as text using
    toISOString(), e.g. "2026-11-21T18:30:00.000Z", because JSON
    can't store Date objects directly. new Date(thatText) turns it
    back into a Date later.
    .trim() removes accidental spaces at the start and end.
    Date.now() (milliseconds since 1970) makes a handy unique id.
  */
  const newLetter = {
    id: String(Date.now()),
    text: letterTextBox.value.trim(),
    writerName: writerNameBox.value.trim(),
    sealedAt: new Date().toISOString(),
    opensAt: openDate.toISOString(),
  };

  // Load the existing letters, add the new one at the end, save them all again.
  const lettersInPostbox = getSavedLetters();
  lettersInPostbox.push(newLetter);
  const savedOk = saveLetters(lettersInPostbox);

  if (!savedOk) {
    formMessage.textContent = "Oh no, your letter couldn't be saved. Is storage full or blocked? 😢";
    return;
  }

  // Success! Clear the form, say so, and refresh the list.
  letterForm.reset();
  updateOpenChoice();
  formMessage.textContent = `Sealed! It opens on ${formatDate(openDate)} 💌`;
  showLetters();
});


/* ============================================================
   PART 6: WHEN THE PAGE FIRST LOADS
   ============================================================ */

/*
  The custom date box shouldn't let you pick today or the past.
  The "min" setting greys out earlier days in the calendar.
  It needs text like "2026-11-15", so we build that from tomorrow's date.
  padStart(2, "0") turns "5" into "05".
*/
const tomorrow = addDays(startOfDay(new Date()), 1);
customDateInput.min =
  `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;

// Show the opening-date preview and any saved letters straight away.
updateOpenChoice();
showLetters();
