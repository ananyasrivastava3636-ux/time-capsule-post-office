# 💌 Time Capsule Post Office

A cute, whimsical website for writing letters to your future self.
Write a letter, seal it with a wax stamp, and drop it in the postbox. It stays locked, with a live countdown, until the day you chose. Then it opens with an envelope animation.

🔗 **Live site:** https://ananyasrivastava3636-ux.github.io/time-capsule-post-office/

> 🚧 **Status:** being built in stages as a learning project. Currently on Stage 1 (writing and saving letters).

![Screenshot or GIF of the app](assets/screenshot.png)
<!-- Add a screenshot or screen recording later: upload it to the assets folder and keep this file name, or change the path above. -->

---

## ✨ What it does

**Write a letter**
- Letter-paper page with "Dear Future Me", your letter, your name, and an optional photo and song link
- Choose when it opens: in 1 week, 1 month, 6 months, 1 year, on your next birthday, or on a date you pick
- Choose a wax seal colour and a sticker postage stamp
- "Seal it": the letter folds, slides into an envelope, the wax seal presses down, and it flies into the postbox

**The postbox**
- All your sealed letters shown as envelopes
- Each envelope shows only the date it was sealed, the date it opens, and a live countdown ("Opens in 23 days, 4 hours ✨")
- Locked envelopes wiggle when tapped: "Not yet! Patience, future you 🌙"
- Ready letters glow: "A letter has arrived! 💌"

**Opening a letter**
- The wax seal cracks, the envelope opens, and the letter slides out and unfolds
- Shows the letter, photo, song link, and "Written on [date], [X days] ago"
- Read letters are kept in a "Read letters" drawer

**Extras**
- **Test mode:** pretend it's a future date to demo the opening animation without waiting
- **Export / Import:** download a backup file of your letters and restore it later
- **Sample letter:** a small sample letter that opens straight away, so first-time visitors can see how it works

---

## 🧭 How to use it

1. Open the live site on your phone or laptop.
2. Write your letter and sign it.
3. Choose when it should open.
4. Press **Seal it 💌**.
5. Come back on the opening day. Your letter will be waiting in the postbox.
6. Press **Export my letters** now and then to keep a backup.

---

## 💾 How your letters are saved

Letters are saved **only in your browser, on your device**, using `localStorage`. There's no server and no account, so nobody else can see them.

- **localStorage** is a small storage space (about 5 MB) that a browser gives each website. It only stores text, so letters are converted to text with JSON before saving.
- I chose it over **IndexedDB** (a bigger, more complex browser database) because letters are small and photos are shrunk before saving, so localStorage has plenty of room and is much simpler to use.
- ⚠️ **Back up your letters!** If you clear your browser data, switch browsers, or change devices, your letters won't be there. Use **Export my letters** to download a backup file, and **Import** to restore it.
- 🔓 **Honest note:** the lock is a *gentle lock* for fun, not real security. Someone who knows browser developer tools could peek at a letter early. Please don't store secrets in it.

---

## 🛠️ Tech used

- **HTML** for the page structure
- **CSS** for the design, using CSS variables for the colour palette, plus keyframe animations for sealing, wiggling, glowing and opening
- **JavaScript** (no frameworks) for saving letters, date maths, live countdowns, Test mode, and Export/Import
- **localStorage** with **JSON** for saving letters in the browser
- **Google Fonts:** Caveat (handwritten) and Nunito (clean and readable)
- **GitHub Pages** for free hosting, with everything written and edited directly on GitHub.com

### Project structure
```
time-capsule-post-office/
├── index.html       → structure of the page
├── style.css        → colours, fonts, layout and animations
├── script.js        → logic: saving, dates, countdowns, opening letters
├── README.md        → this file
└── assets/
    ├── background.jpg
    └── stickers/    → stickers used as postage stamps and decorations
```

### Colour palette
| Colour | Hex | Used for |
|---|---|---|
| Blackberry | `#48192E` | Headings, wax seals, buttons, all text |
| Meadow Flower | `#957083` | Accents, hover states, glow on ready letters |
| Copper Moon | `#C59C79` | Postbox, borders, soft sections |
| Pediment | `#D3CBC4` | Letter paper, envelopes, cards |

---

## 🎨 Credits

**Background:** *Almond Blossom* (1890) by Vincent van Gogh. Public domain. Original at the Van Gogh Museum, Amsterdam.

**Colour palette:** inspired by Wolf&Fox Studio's "Your Color Palette" series.

**Fonts:** [Caveat](https://fonts.google.com/specimen/Caveat) and [Nunito](https://fonts.google.com/specimen/Nunito) from Google Fonts.

---

Made with love (and a little patience) 🌙
