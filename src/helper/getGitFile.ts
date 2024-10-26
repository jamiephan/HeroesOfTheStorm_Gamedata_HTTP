const host = "https://raw.githubusercontent.com";
const username = "jamiephan";
const repo = "HeroesOfTheStorm_Gamedata";

export interface status {
  code: number;
  message: string;
  data: string;
}

export default async function (
  version: string = "",
  path: string = ""
): Promise<status> {
  if (!path) {
    return {
      code: 404,
      message: "Not Found",
      data: "",
    };
  }

  const isLatest =
    version === "latest" ||
    version === "master" ||
    version === "main" ||
    !version;
  let url;

  if (isLatest) {
    url = `${host}/${username}/${repo}/master/${path}`;
  } else {
    // Check if version starts with "v". if not return 404
    const isVersion = version.startsWith("v");
    if (isVersion) {
      url = `${host}/${username}/${repo}/${version}/${path}`;
    } else {
      return {
        code: 404,
        message: "Not Found",
        data: "",
      };
    }
  }

  console.log(url);

  try {
    const dataFetch = await fetch(url);
    const data = await dataFetch.text();

    return {
      code: dataFetch.status,
      message: dataFetch.statusText,
      data,
    };
  } catch (error) {
    return {
      code: 404,
      message: "Not Found",
      data: "",
    };
  }
}
