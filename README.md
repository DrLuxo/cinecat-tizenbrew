# Cinecat TV — experimental TizenBrew module

Opens https://beta.cinecat.eu/tv using Cinecat's existing TV interface. Maps Samsung Return to Escape; leaves arrow navigation, selection and playback to the website.

This is an unofficial personal project. It is not affiliated with Cinecat or TizenBrew. Hardware compatibility and playback are not yet verified.

## Installation

In TizenBrew, use Module Manager → Add GitHub module and enter this repository's `owner/name@main`. Launch Cinecat TV. This module is not a standalone WGT or Smart Hub tile.

## Controls

Arrows move, Enter selects, and Samsung Return is translated to the website's Back key. Use the on-screen player controls; dedicated media keys are not implemented. Cross-origin embedded players may handle input separately.

## Compatibility

TizenBrew compatibility does not guarantee compatibility with Cinecat's JavaScript or media formats. Test navigation, text input, playback, seeking and subtitles on the actual TV. Website updates may require module changes.

No build step or dependencies are required. Keep `package.json` and `remote.js` at the repository root. The repository must be public for TizenBrew's jsDelivr loader. The package's private flag prevents accidental npm publication.
