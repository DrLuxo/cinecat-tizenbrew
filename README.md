# Cinecat TV — experimental TizenBrew module

Opens https://beta.cinecat.eu/tv using Cinecat's existing TV interface. Maps Samsung Return to Escape; leaves arrow navigation, selection and playback to the website.

This is an unofficial personal project. It is not affiliated with Cinecat or TizenBrew. Hardware compatibility and playback are not yet verified.

## Installation

In TizenBrew, use Module Manager → Add GitHub module and enter `DrLuxo/cinecat-tizenbrew@main`. Launch Cinecat TV. This module is not a standalone WGT or Smart Hub tile.

Use that same source for future updates. Old sources ending in commit IDs such as `@2c70393` are frozen snapshots and cannot receive fixes. Switch once to `@main`; after an update, fully reboot the TV to clear TizenBrew's in-memory script cache. CDN updates can also take time to propagate. If an older entry remains, remove it from Module Manager to avoid opening it accidentally.

## Controls

Arrows move, Enter selects, and Samsung Return is translated to the website's Back key. Use the on-screen player controls; dedicated media keys are not implemented. Cross-origin embedded players may handle input separately.

The first-run New/Classic chooser has a yellow focus border and supports arrows and OK. Version 0.1.3 removes the previous continuous button polling and the full-page scans on keypresses. It discovers the chooser at startup or when relevant content is inserted, caches its two buttons, and leaves the site's normal navigation alone. TV-mode button transitions are made immediate to remove their 260–300 ms animation delay. This removes measured adapter overhead; actual TV responsiveness and playback still depend on the website, hardware and network.

## Compatibility

TizenBrew compatibility does not guarantee compatibility with Cinecat's JavaScript or media formats. Test navigation, text input, playback, seeking and subtitles on the actual TV. Website updates may require module changes.

No build step or dependencies are required. Keep `package.json` and `remote.js` at the repository root. The repository must be public for TizenBrew's jsDelivr loader. The package's private flag prevents accidental npm publication.
