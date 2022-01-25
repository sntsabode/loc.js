<h1 align="center">loc.js 📝</h1>
<p>
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg" />
  </a>
  <a href="https://badge.fury.io/js/@snts.abode%2Floc.js">
    <img src="https://badge.fury.io/js/@snts.abode%2Floc.js.svg" alt="npm version" />
  </a>
  <img alt="Maintenance" src="https://img.shields.io/badge/Maintained-yes-blue.svg" />
  <a href="#" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen" />
  </a>
  <a href="https://github.com/sntsabode/loc.js/actions/workflows/test.yaml" target="_blank">
    <img alt="loc.js-test" src="https://github.com/sntsabode/loc.js/actions/workflows/test.yaml/badge.svg" />
  </a>
</p>

***loc.js*** is a simple, no dependencies command line tool that counts the number of lines in a project.

<img src="assets/sc.gif" />

## Prerequisites

***Use other verions at own risk***

* node >= 12.x.x

## Installation

### Install from ***npm***

```sh
npm i -g @snts.abode/loc.js
```

Might have to use sudo on ***unix systems***

```sh
sudo npm i -g @snts.abode/loc.js
```

### Install from source

```sh
cd loc.js

yarn i
```

If the above command doesn't work due to admin privileges ***(unix system)***, try

```sh
cd loc.js

yarn i:sudo
```

## Usage

```sh
cd my-project

loc.js <options>
```

### Options:

* `-y` or `--yes` - (`boolean`): Don't ask any questions.

* `-p` or `--paths` - (`string[]`): Enter paths ***loc*** should work in, relative to the cwd.

* `-l` or `--log` - (`y`|`n`): Whether or not the process should log.

## Author

👤 **Sihle Masebuku <snts.abode@gmail.com>**

## Show your support

Give a ⭐️ if this project helped you!
