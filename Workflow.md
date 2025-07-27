# How to work on the project

## Environment

For convenience when working on the project, tools from **Node.js** and **npm** are used. All necessary settings have been made. Make sure that **Node.js** corresponding to the current version is installed on your work computer. The current version of **Node.js** is specified in the `package.json` file in the `node` field. After that, in the terminal, go to the project directory and run the command _once_:

```bash
npm install
```

This command will start the process of installing project dependencies from **npm**.

### Scripts

After creating the project, the following scripts are available to you.

#### Compiling the project

```bash
npm run compile
```

During the execution of project compilation instructions, a `dist` directory is created in the project root, into which the resulting files will be placed.

#### Cleaning the project

```bash
npm run clean
```

During the execution of the project cleaning instruction, the `dist` directory, which is intended for storing the resulting files, will be deleted.

#### Building the project

```bash
npm run build
```

During the application build process, the "Cleaning the project" and "Compiling the project" instructions will be executed.

#### Linter check

```bash
npm run lint
```

Launching a project check with the **ESLint** static code analyzer.

Code analysis is performed only in files that are located in the `src` directory.

**Please note** that when running this command, errors are output to the terminal.

#### Running REPL

```bash
npm run ts
```

Running `ts-node` allows you to directly execute TypeScript code on NodeJS without prior compilation.

#### Running the project

```bash
npm start
```

During the project startup process, the "Building the project" process will be executed and the resulting code will be launched.

## Project structure

### `src` directory

The source code of the project is located in this directory: components, modules, and so on. The structure of the `src` directory can be arbitrary.

### `Readme.md` file

A file containing instructions for working with the educational repository.

### `Contributing.md` file

A file containing tips and instructions for making changes to the educational repository.

### Everything else

All other files in the project are service files. Please do not delete or modify them on your own. Only if required by the assignment or mentor.
