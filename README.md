# HeroesOfTheStorm_Gamedata_HTTP

A Cloudflare worker app to get data from https://github.com/jamiephan/HeroesOfTheStorm_Gamedata and transform to various formats with Badge endpoint support!

## API Specification:

Base Url: https://heroes-data.jamiephan.workers.dev

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
    - [/badge/mods/core.stormmod/base.stormdata/BuildId.txt](https://heroes-data.jamiephan.workers.dev/badge/mods/core.stormmod/base.stormdata/BuildId.txt)
  - Get the Abathur Ultimate Evolution cooldown on version [v2.55.7.93054](https://github.com/jamiephan/HeroesOfTheStorm_Gamedata/commit/f7740be66e8a111a4ffb927fd02731641a608464):
    - [/badge/mods/heroesdata.stormmod/base.stormdata/gamedata/heroes/abathurdata/abathurdata.xml?path=\$.Catalog.CAbilEffectTarget[?(@.\_attributes.id==%22AbathurUltimateEvolution%22)].Cost.Cooldown.\_attributes.TimeUse&version=v2.55.7.93054](<https://heroes-data.jamiephan.workers.dev/badge/mods/heroesdata.stormmod/base.stormdata/gamedata/heroes/abathurdata/abathurdata.xml?path=$.Catalog.CAbilEffectTarget[?(@._attributes.id==%22AbathurUltimateEvolution%22)].Cost.Cooldown._attributes.TimeUse&version=v2.55.7.93054>)

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
