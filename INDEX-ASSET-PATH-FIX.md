# Index image path fix

The previous index used root-absolute URLs such as `/unify-music-assets/...`.
Those URLs fail when the site is previewed from a GitHub Pages repository subpath or opened locally.

This version uses relative URLs such as `unify-music-assets/...`, so the same files work on:
- `https://unifyplayer.online/`
- `https://username.github.io/repository/`
- a local/static preview server

Both main app artworks also include JPEG fallbacks behind WebP sources.
