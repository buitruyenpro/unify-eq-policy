# Chrome favicon fix

Version token: `20260716-2`

Why Chrome showed a white globe:
- Chrome had cached the earlier favicon result or a failed favicon URL.
- App favicon URLs were nested under asset folders, so missing-folder deployment could cause 404 responses.
- Chrome favicon cache is separate from normal page cache and may survive a standard refresh.

Changes in this package:
- App-specific favicon files are now also placed directly in the repository root.
- UNIFY Music pages use `/unify-music-favicon.*`.
- UNIFY EQ pages use `/unify-eq-favicon.*`.
- Every favicon URL includes `?v=20260716-2` to force Chrome to fetch a fresh file.
- 16, 32 and 48 px versions are explicitly declared for browser tabs.
- The root site favicon remains `/favicon.ico`.

After uploading:
1. Preserve all files exactly as provided.
2. Open the app page in a new tab.
3. Close the old tab that still shows the globe.
4. If needed, open `chrome://settings/content/all`, search for `unifyplayer.online`, delete its stored site data, and reopen the site.
