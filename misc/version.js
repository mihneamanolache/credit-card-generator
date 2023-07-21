import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(filename)

const packageJsonPath = path.resolve(__dirname, '..', 'package.json')

const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

const versionParts = packageJson.version.split('.')

versionParts[2] = parseInt(versionParts[2])
versionParts[2]++

packageJson.version = versionParts.join('.')

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4), 'utf8')