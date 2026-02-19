# Eduable

**Natural language to terminal commands.** Built at CodeDay SF, May 2014.

Talk to your terminal in English. Eduable uses [Wit.ai](https://wit.ai/) to parse natural language and returns the corresponding shell commands.

```
"list all my files"          → ls -a
"go up a directory"          → cd ..
"navigate to root"           → cd /
"create a new branch called dev" → git checkout -b dev
"add all files to git"       → git add *
"delete server.js"           → rm server.js
"install archive.tar.gz"     → tar -xvzf archive.tar.gz && cd archive/ && ./configure && make && sudo make install
"create a rails app called blog" → rails new blog
```

Won **Honorable Mention** at CodeDay SF.

## Context

This was built in 2014 — a year before Siri got an API, three years before GPT-2, and a decade before AI code assistants became standard developer tools. The idea was simple: you shouldn't need to memorize commands to use a computer.

The NLP layer (Wit.ai) handled intent classification and entity extraction. The Express server mapped parsed intents to shell commands. No LLMs, no transformers — just pattern matching and a bet that natural language interfaces would matter.

## Stack

- **Runtime:** Node.js + Express 4
- **NLP:** Wit.ai (Facebook's open NLP platform)
- **Views:** Jade (now Pug)
- **Database:** MongoDB via Mongoose
- **CI:** Travis CI

## Running

```bash
npm install
node app.js
# → http://localhost:3000
```

Requires a [Wit.ai](https://wit.ai/) API token set as `WIT_AI_TOKEN` in your environment.

## License

MIT
