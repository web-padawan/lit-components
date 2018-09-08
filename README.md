[![Build Status](https://travis-ci.org/web-padawan/lit-components.svg?branch=master)](https://travis-ci.org/web-padawan/lit-components)
[![Build status](https://ci.appveyor.com/api/projects/status/dgv5d6rqxargb8ud/branch/master?svg=true)](https://ci.appveyor.com/project/web-padawan/lit-components/branch/master)

# Lit Components

Prototyping components using [LitElement](https://github.com/Polymer/lit-element).
This is a personal research and experiment, not meant for publishing and production usage.
The goals of this the experiment are:

- test how difficult would it be to write set of components with LitElement
- identify which parts of code could be re-used by LitElement and Polymer 3
- investigate the possible styling and theming approaches for LitElement

## Installation

### Install dependencies

```sh
npm install
```

### Install packages

For OS X or Linux users:

```sh
npm run bootstrap
```

For Windows users:

```
call scripts\bootstrap-unreleased.bat
```

### Run tests
```sh
npm test
```

### Run ESLint
```sh
npm run lint
```

### Serve the project
```sh
npm run dev
````
