# ClashLang Cheatsheet

## Cards

| Card | Cost |
|---|---|
| Bandit | 3 |
| PEKKA | 7 |
| Ewiz | 4 |
| Log | 2 |
| Skarmy | 3 |
| Princess | 3 |
| Miner | 3 |
| Arrows | 3 |
| Valk | 4 |
| Hunter | 4 |
| Marcher | 4 |
| Tesla | 4 |
| Fireball | 4 |
| Loon | 5 |
| Giant | 5 |
| Witch | 5 |
| Prince | 5 |
| Sparky | 6 |
| Xbow | 6 |
| Golem | 8 |
| Rocket | 6 |
| Zap | 2 |
| Knight | 3 |
| Bomber | 2 |

## Commands

| Command | Effect |
|---|---|
| `buff <card>` | Increments card |
| `nerf <card>` | Decrements card |
| `predict <card>` | Zeros card |
| `<card> op` | Negative values -> zero |
| `<card1> defends <card2>` | Card1 += card2 |
| `<card1> kills <card2>` | Card1 -= card2 |
| `<card1> ignores <card2>` | Card1 *= card2 |
| `<card1> counters <card2>` | Card1 /= card2 |
| `leak elixir` | Decrements elixir |
| `save elixir` | Increments elixir |
| `spam <card>` | Pushes card onto array |
| `play <card>` | Pops top of array into card |
| `<card1> kites <card2>` | Sets card1 to to the value at card2's position |
| `elixir for <card>` | Gives card the array length |
| `emote` | Pops the top value and displays as an ASCII char |
| `spectate` | Pushes user-entered characters until "enter" |
| `peek <card>` | Displays card numerical value |
| `join clan` | Enables chats |
| `chat <text>` | Pushes text char by char into array |

## Control flow

| Line | Effect |
|---|---|
| `cycle <card>` | Loops until card is zero |
| `gg` | Ends cycle block |
| `<deckname> deck` | Define a deck with a name consisting of a main card and deck type |
| `<deckname> deck with <card1> <card2> ...` | Define a deck that takes card1, card2... as parameters |
| `ez` | End deck definition |
| `run <deckname` (`with <card1>...`) | Run a deck with parameters as required |

## Punctuation

| Punctuation | Use |
|---|---|
| any whitespace | Ignored at the start or end of a line |
| `//` | Comments |
| `,` | Separates multiple commands on one line |