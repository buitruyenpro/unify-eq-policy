# Favicon deployment

Google Search supports one favicon per hostname. Because both apps use
`unifyplayer.online`, Google Search will use the shared UNIFY family favicon
from the root `index.html`.

The individual app pages still contain their own app-specific favicon:
- UNIFY EQ pages use the Equalizer icon.
- UNIFY Music pages use the Music icon.

This gives each app the correct browser-tab, bookmark, shortcut and manifest
icon, while Google Search receives one stable, crawlable site icon.

For two different icons directly in Google Search results, deploy the apps on
different hostnames, for example:
- `eq.unifyplayer.online`
- `music.unifyplayer.online`

After deployment, request indexing for:
- `https://unifyplayer.online/`
- `https://unifyplayer.online/unify-eq-home-page.html`
- `https://unifyplayer.online/unify-music-home-page.html`
