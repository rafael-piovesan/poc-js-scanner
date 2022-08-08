import { writeFileSync, mkdirSync } from "fs";
import { deobfuscate } from "js-deobfuscator";
import { logger } from "./logger.js";

export type Script = {
  script: string;
  hostname: string;
  filename: string;
  webpage: string;
};

const deobfuscationConfig = {
  verbose: false,
  arrays: {
    unpackArrays: true,
    removeArrays: true,
  },
  proxyFunctions: {
    replaceProxyFunctions: true,
    removeProxyFunctions: true,
  },
  expressions: {
    simplifyExpressions: true,
    removeDeadBranches: true,
  },
  miscellaneous: {
    beautify: true,
    simplifyProperties: true,
    renameHexIdentifiers: false,
  },
};

/**
 * Deobfuscate a given script and save the result to the `output` folder.
 * @param param an object containing the script, its source and the web page where
 * it was found.
 */
export function deobfuscateScript(param: Script): void {
  if (!param.script) {
    logger.warn(`received empty script [${param.filename}] from [${param.hostname}]`)
    return
  }

  try {
    const output = deobfuscate(param.script, deobfuscationConfig);
    param.script = output;
  } catch (e) {
    param.filename = `original_${param.filename}`;
    logger.warn(`could not deobfuscate script from [${param.hostname}]`, e);
  }

  try {
    const saveToDir = `output/${param.webpage}/${param.hostname}`;
    mkdirSync(saveToDir, { recursive: true });
    writeFileSync(`${saveToDir}/${param.filename.replace(/.js$/, "")}.js`, param.script);
  } catch(e) {
    logger.error(`could not save script [${param.filename}] from [${param.hostname}]`, e)
  }
}
