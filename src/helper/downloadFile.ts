import Throw from "./Throw";
import CONFIG from "../config";

export default async function (
  version: string = "",
  path: string = "",
  kv: KVNamespace<string>
): Promise<string | void> {
  let parsedVersion = version;

  if (!path) {
    Throw.NOT_FOUND();
  }

  const isLatest =
    version === "latest" ||
    version === "master" ||
    version === "main" ||
    !version;

  parsedVersion = isLatest ? "master" : parsedVersion;

  const url = `${CONFIG.HOST}/${CONFIG.USERNAME}/${CONFIG.REPO}/${parsedVersion}/${path}`;

  if (!isLatest && !version.startsWith("v")) return Throw.NOT_FOUND();

  try {
    // Check if cache exist and not expired
    const cache = await kv.get(`${parsedVersion}-${path}`);
    if (cache) {
      console.log("Cache Hit for ", parsedVersion, path);
      return cache;
    }

    console.log("Downloading for ", parsedVersion, path);

    const dataFetch = await fetch(url);
    // Check 200
    if (!dataFetch.ok) {
      return Throw.NOT_FOUND();
    }

    const data = await dataFetch.text();
    // Cache the data
    await kv.put(`${parsedVersion}-${path}`, data, {
      expirationTtl: CONFIG.EXPIRE_TIME,
    });

    return data;
  } catch (error) {
    console.error(error);
    return Throw.NOT_FOUND();
  }
}
