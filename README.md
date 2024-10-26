# HeroesOfTheStorm_Gamedata_HTTP

A Cloudflare worker app to get data from https://github.com/jamiephan/HeroesOfTheStorm_Gamedata and transform to various formats with Badge endpoint support!

## API Specification:

Base Url: https://heroes-data.jamiephan.workers.dev

> A cache has been setup for up to an hour for repeated request for the same file & version.

### `GET /mods/:path?version=xx&format=xx`

Get the file under `mods` folder in https://github.com/jamiephan/HeroesOfTheStorm_Gamedata.

- URL Params:
  - `path`: The file path under `mods` folder in https://github.com/jamiephan/HeroesOfTheStorm_Gamedata.
- Query Params:
  - `version`
    - Required: `false` (default=`latest`)
    - Example: `v2.55.7.93054`, `latest`
    - Get which version of the game. Any valid tags (https://github.com/jamiephan/HeroesOfTheStorm_Gamedata/tags) starts with `v`. You can also omit (or use value `latest`) to always get the latest version.
  - `format`
    - Required: `false` (default=`txt`)
    - Example: `json`, `yaml`, `xml`, `txt`
    - Convert the file format version. This will also affect the `Content-Type` output. For valid formats, please refer to https://github.com/jamiephan/HeroesOfTheStorm_Gamedata_HTTP/blob/main/src/helper/transform.ts#L16. Incorrect format will just return `txt` version instead.
- Examples:
  - Get the latest build number:
    - [/mods/core.stormmod/base.stormdata/BuildId.txt](https://heroes-data.jamiephan.workers.dev/mods/core.stormmod/base.stormdata/BuildId.txt)
  - Get the Abathur data in JSON format on version [v2.55.7.93054](https://github.com/jamiephan/HeroesOfTheStorm_Gamedata/commit/f7740be66e8a111a4ffb927fd02731641a608464):
    - [/mods/heroesdata.stormmod/base.stormdata/gamedata/heroes/abathurdata/abathurdata.xml?format=json&version=v2.55.7.93054](https://heroes-data.jamiephan.workers.dev/mods/heroesdata.stormmod/base.stormdata/gamedata/heroes/abathurdata/abathurdata.xml?format=json&version=v2.55.7.93054)

### `GET /badge/mods/:path?path=xx`

Generate a [shields.io badge endpoint](https://shields.io/badges/endpoint-badge) with supplied [JSONPath Query](https://en.wikipedia.org/wiki/JSONPath).

> Note: Badge Endpoint currently only supports `.txt` / `.xml` / `.storm*` files.

- URL Params:
  - `path`: The file path under `mods` folder in https://github.com/jamiephan/HeroesOfTheStorm_Gamedata.
- Query Params:
  - `version`
    - Required: `false` (default=`latest`)
    - Example: `v2.55.7.93054`, `latest`
    - Get which version of the game. Any valid tags (https://github.com/jamiephan/HeroesOfTheStorm_Gamedata/tags) starts with `v`. You can also omit (or use value `latest`) to always get the latest version.
  - `path`
    - Required **only if the file type is `.xml` / `.storm*`**.
      - `.txt` will just output the content.
    - Example: `$.Catalog.CAbilEffectTarget[?(@._attributes.id=="AbathurUltimateEvolution")].Cost.Cooldown._attributes.TimeUse`
    - The [JSONPath Query](https://en.wikipedia.org/wiki/JSONPath) language to obtain a specific data and output to the `message` field of the badge endpoint.
  - `label`
    - Required: `false` (default=`Heroes Game Data`)
    - Example: `Abathur Ultimate Evolution cooldown`
    - The `label` field for the badge endpoint.
- Examples:
  - Get the latest build number:
    - [/badge/mods/core.stormmod/base.stormdata/BuildId.txt?label=Build](https://heroes-data.jamiephan.workers.dev/badge/mods/core.stormmod/base.stormdata/BuildId.txt?label=Build)
  - Get the Abathur Ultimate Evolution cooldown on version [v2.55.7.93054](https://github.com/jamiephan/HeroesOfTheStorm_Gamedata/commit/f7740be66e8a111a4ffb927fd02731641a608464):
    - [/badge/mods/heroesdata.stormmod/base.stormdata/gamedata/heroes/abathurdata/abathurdata.xml?path=\$.Catalog.CAbilEffectTarget[?(@.\_attributes.id==%22AbathurUltimateEvolution%22)].Cost.Cooldown.\_attributes.TimeUse&version=v2.55.7.93054](<https://heroes-data.jamiephan.workers.dev/badge/mods/heroesdata.stormmod/base.stormdata/gamedata/heroes/abathurdata/abathurdata.xml?path=$.Catalog.CAbilEffectTarget[?(@._attributes.id==%22AbathurUltimateEvolution%22)].Cost.Cooldown._attributes.TimeUse&version=v2.55.7.93054>)

### Badge Endpoint Demo

| Description                                                          | Badge                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Get the latest build number                                          | ![Endpoint Badge](https://img.shields.io/endpoint?url=https%3A%2F%2Fheroes-data.jamiephan.workers.dev%2Fbadge%2Fmods%2Fcore.stormmod%2Fbase.stormdata%2FBuildId.txt%3Flabel%3DBuild)                                                                                                                                                                                                                                                                         |
| Get the Abathur Ultimate Evolution cooldown on version v2.55.7.93054 | ![Endpoint Badge](<https://img.shields.io/endpoint?url=https%3A%2F%2Fheroes-data.jamiephan.workers.dev%2Fbadge%2Fmods%2Fheroesdata.stormmod%2Fbase.stormdata%2Fgamedata%2Fheroes%2Fabathurdata%2Fabathurdata.xml%3Fpath%3D%24.Catalog.CAbilEffectTarget%255B%25253F(%40._attributes.id%3D%3D%2522AbathurUltimateEvolution%2522)%255D.Cost.Cooldown._attributes.TimeUse%26version%3Dv2.55.7.93054%26label%3DAbathur%2520Ultimate%2520Evolution%2520cooldown>) |
| Get Maiev's Fan of Knives (Q) Damage                                 | ![Endpoint Badge](<https://img.shields.io/endpoint?url=https%3A%2F%2Fheroes-data.jamiephan.workers.dev%2Fbadge%2Fmods%2Fheromods%2Fmaiev.stormmod%2Fbase.stormdata%2Fgamedata%2Fmaievdata.xml%3Fpath%3D%24.Catalog.CEffectDamage%255B%25253F(%40._attributes.id%3D%3D%2522MaievFanOfKnivesDamage%2522)%255D.Amount._attributes.value%26label%3DMaiev%2520Q%2520Damage>)                                                                                      |
| Get the Bolt of the Storm (tp) Range                                 | ![Endpoint Badge](<https://img.shields.io/endpoint?url=https%3A%2F%2Fheroes-data.jamiephan.workers.dev%2Fbadge%2Fmods%2Fheroesdata.stormmod%2Fbase.stormdata%2Fgamedata%2Fabildata.xml%3Fpath%3D%24.Catalog.CAbilEffectTarget%255B%25253F(%40._attributes.id%3D%3D%2522FlashoftheStorms%2522)%255D.Range._attributes.value%26label%3DBolt%2520Range>)                                                                                                        |

## Development

### Local Setup

```
yarn install
yarn run dev
```

### Deploy

```
npm run deploy
```
