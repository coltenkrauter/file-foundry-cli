oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g file-foundry-cli
$ file-foundry COMMAND
running command...
$ file-foundry (--version)
file-foundry-cli/0.0.0 darwin-arm64 node-v18.15.0
$ file-foundry --help [COMMAND]
USAGE
  $ file-foundry COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`file-foundry hello PERSON`](#file-foundry-hello-person)
* [`file-foundry hello world`](#file-foundry-hello-world)
* [`file-foundry help [COMMANDS]`](#file-foundry-help-commands)
* [`file-foundry plugins`](#file-foundry-plugins)
* [`file-foundry plugins:install PLUGIN...`](#file-foundry-pluginsinstall-plugin)
* [`file-foundry plugins:inspect PLUGIN...`](#file-foundry-pluginsinspect-plugin)
* [`file-foundry plugins:install PLUGIN...`](#file-foundry-pluginsinstall-plugin-1)
* [`file-foundry plugins:link PLUGIN`](#file-foundry-pluginslink-plugin)
* [`file-foundry plugins:uninstall PLUGIN...`](#file-foundry-pluginsuninstall-plugin)
* [`file-foundry plugins:uninstall PLUGIN...`](#file-foundry-pluginsuninstall-plugin-1)
* [`file-foundry plugins:uninstall PLUGIN...`](#file-foundry-pluginsuninstall-plugin-2)
* [`file-foundry plugins update`](#file-foundry-plugins-update)

## `file-foundry hello PERSON`

Say hello

```
USAGE
  $ file-foundry hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/coltenkrauter/file-foundry-cli/blob/v0.0.0/dist/commands/hello/index.ts)_

## `file-foundry hello world`

Say hello world

```
USAGE
  $ file-foundry hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ file-foundry hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [dist/commands/hello/world.ts](https://github.com/coltenkrauter/file-foundry-cli/blob/v0.0.0/dist/commands/hello/world.ts)_

## `file-foundry help [COMMANDS]`

Display help for file-foundry.

```
USAGE
  $ file-foundry help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for file-foundry.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.19/src/commands/help.ts)_

## `file-foundry plugins`

List installed plugins.

```
USAGE
  $ file-foundry plugins [--json] [--core]

FLAGS
  --core  Show core plugins.

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ file-foundry plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.8.0/src/commands/plugins/index.ts)_

## `file-foundry plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ file-foundry plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ file-foundry plugins add

EXAMPLES
  $ file-foundry plugins:install myplugin 

  $ file-foundry plugins:install https://github.com/someuser/someplugin

  $ file-foundry plugins:install someuser/someplugin
```

## `file-foundry plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ file-foundry plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ file-foundry plugins:inspect myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.8.0/src/commands/plugins/inspect.ts)_

## `file-foundry plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ file-foundry plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ file-foundry plugins add

EXAMPLES
  $ file-foundry plugins:install myplugin 

  $ file-foundry plugins:install https://github.com/someuser/someplugin

  $ file-foundry plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.8.0/src/commands/plugins/install.ts)_

## `file-foundry plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ file-foundry plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ file-foundry plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.8.0/src/commands/plugins/link.ts)_

## `file-foundry plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ file-foundry plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ file-foundry plugins unlink
  $ file-foundry plugins remove
```

## `file-foundry plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ file-foundry plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ file-foundry plugins unlink
  $ file-foundry plugins remove
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.8.0/src/commands/plugins/uninstall.ts)_

## `file-foundry plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ file-foundry plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ file-foundry plugins unlink
  $ file-foundry plugins remove
```

## `file-foundry plugins update`

Update installed plugins.

```
USAGE
  $ file-foundry plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v3.8.0/src/commands/plugins/update.ts)_
<!-- commandsstop -->
