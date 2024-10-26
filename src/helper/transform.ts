import * as xmljs from "xml-js";
import YAML from "yaml";

export const JSON_FORMAT = "json";
export const YAML_FORMAT = "yaml";
export const XML_FORMAT = "xml";
export const TXT_FORMAT = "txt";

export const CONTENT_TYPE = {
  [JSON_FORMAT]: "application/json",
  [YAML_FORMAT]: "application/yaml",
  [XML_FORMAT]: "application/xml",
  [TXT_FORMAT]: "text/plain",
};

export const PARSABLE_FORMATS = {
  xml: [TXT_FORMAT, XML_FORMAT, JSON_FORMAT, YAML_FORMAT],
  txt: [TXT_FORMAT],
  galaxy: [TXT_FORMAT],
  stormlayout: [TXT_FORMAT, XML_FORMAT, JSON_FORMAT, YAML_FORMAT],
  stormhotkeys: [TXT_FORMAT, XML_FORMAT, JSON_FORMAT, YAML_FORMAT],
  stormstyle: [TXT_FORMAT, XML_FORMAT, JSON_FORMAT, YAML_FORMAT],
  stormcutscene: [TXT_FORMAT, XML_FORMAT, JSON_FORMAT, YAML_FORMAT],
  stormcomponents: [TXT_FORMAT, XML_FORMAT, JSON_FORMAT, YAML_FORMAT],
  stormlocale: [TXT_FORMAT, XML_FORMAT, JSON_FORMAT, YAML_FORMAT],
};
export const ALLOWED_FORMATS = [
  TXT_FORMAT,
  JSON_FORMAT,
  XML_FORMAT,
  YAML_FORMAT,
];
export type FORMAT = (typeof ALLOWED_FORMATS)[number];

export interface ITransformedCode {
  code: string;
  format: FORMAT;
  contentType: string;
}

function getContentType(format: FORMAT): string {
  return (
    CONTENT_TYPE[format as keyof typeof CONTENT_TYPE] ||
    CONTENT_TYPE[TXT_FORMAT]
  );
}

export default function transform(
  path: string,
  code: string,
  format: FORMAT
): ITransformedCode {
  // Get the file extension
  const extension = path
    .split(".")
    .pop()
    ?.toLowerCase() as keyof typeof PARSABLE_FORMATS;

  // If the extension is not in the list of parsable formats, return the code as is
  if (!extension || !PARSABLE_FORMATS[extension].includes(format)) {
    return {
      code,
      format: TXT_FORMAT,
      contentType: getContentType(TXT_FORMAT),
    };
  }

  return {
    code: transformFormat(extension, format, code),
    format,
    contentType: getContentType(format),
  };
}

function transformFormat(
  currentFormatIn: string,
  targetFormat: FORMAT,
  code: string
): string {
  // If extension starts with "storm", treat it as XML
  let currentExt = currentFormatIn;
  if (currentFormatIn.startsWith("storm")) {
    currentExt = XML_FORMAT;
  }

  // if extension is "galaxy" treat it as TXT
  if (currentFormatIn === "galaxy") {
    currentExt = TXT_FORMAT;
  }

  // TXT only supports TXT
  if (currentExt === TXT_FORMAT) {
    return code;
  }

  // Now should be all XML..

  switch (targetFormat) {
    case TXT_FORMAT:
      return code;
    case JSON_FORMAT:
      return xmljs.xml2json(code, { compact: true });
    case XML_FORMAT:
      return code;
    case YAML_FORMAT:
      const json = xmljs.xml2json(code, { compact: true });
      return YAML.stringify(JSON.parse(json));
  }

  return code;
}
