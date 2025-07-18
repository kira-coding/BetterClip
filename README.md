# BetterClip

Ever found yourself copying something useful, only to accidentally overwrite it with something else seconds later?

I've been there. Windows has a clipboard history feature built in — BUT it's limited, buggy, and doesn't quite do enough for real-world use.

👎 The built-in Windows clipboard:
- Stores only 25 items
- Clears everything on restart
- No search or categorization
- No support for files
- Misses to record things sometimes
- Does not have searchability
- Does not have categorization
- and a lot more
But we can do better — and we will.

## 🥅 Goal: To build a better clipboard manager. BetterClip will have:
- [x] Unlimited history
- [x] Copy on Click
- [x] Searchability
- [x] Persistent storage across reboots
- [x] Auto-deletion of old records
- [ ]  Restore on startup?
- [x] Support for text, images, files, URLs
- [x] Tabs for categorization [All | Texts | Images | Files | URLs | +]
- [x] Option to pin
- [x] Global hotkey to launch
- [x] Incognito mode to temporarily disable recording

## How to build the code

### Required tools

1. `Rust programming language`  get it at https://www.rust-lang.org/tools/install
2. `node.js` https://nodejs.org/en/download
3. `git`
4. `terminal| command port`

### build
- execute the following commands inside your terminal
1. clone the repository 
` git clone https://github.com/kira-coding/BetterClip`
2. go in side the repository
` cd BetterClip`
3. get the dependencies required to build the app
` npm i`
4. build the app for release. this will also download and build the rust dependencies. so it may take time, wait patiently.
`npm run tauri build`

@WeeklyCoder | Week 82

