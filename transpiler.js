const CARDS = ["bandit","pekka","ewiz","log","skarmy","princess","miner","arrows","valk","hunter","marcher","tesla","fireball","loon","giant","witch","prince","sparky","xbow","golem","rocket","zap","knight","bomber"];
const DECKS = ["bait","beatdown","control"];
const CARD_INIT = "let [bandit,pekka,ewiz,log,skarmy,princess,miner,arrows,valk,hunter,marcher,tesla,fireball,loon,giant,witch,prince,sparky,xbow,golem,rocket,zap,knight,bomber]=[3,7,4,2,3,3,3,3,4,4,4,4,4,5,5,5,5,6,6,8,6,2,3,2];";
const SETUP = CARD_INIT + "const memory=[];for(let i=0;i<10;i++)memory.push([]);elixir=0;"
function DeckEntry(name = "", params = []) {
    this.name = name, this.params = params;
    this.closed = false;
}
function transpile(source = "", extensions = "") {
    const state = {
        deckRegistry: [],
        loopDepth: 0,
        chatEnabled: false
    };
    
    const lines = source.split("\n");

    let outLines = "";
    
    for(let i = 0; i < lines.length; i++) {
        const strippedLine = lines[i].split("//")[0].trim();
        if(strippedLine.length === 0) continue;
        if(strippedLine.startsWith("chat ")) {
            if(state.chatEnabled) outLines += `for(let i=0;i<${strippedLine.length-5};i++){memory[elixir].push([${strippedLine.slice(5).split("").map(c => c.charCodeAt(0)).join(",")}][i])}`;
            else throw `You need to join a clan first (line ${i+1})`;
            continue;
        }
        for(let line of strippedLine.split(",")) {
            try {
                outLines += translate(line.trim(), state);
            } catch (error) {
                throw error + ` (Line ${i+1})`;
            }
        }
    }
    
    return SETUP + extensions + outLines;
}

function expectEnd(token = undefined, customMsg = false) {
    if(token === undefined) return;
    throw customMsg? customMsg : `Unexpected "${token}"`;
}

function translate(line = "", state = { deckRegistry: [], loopDepth: 0, chatEnabled: false }) {
    if(line.length === 0) throw "Expected some clash action, didn't get any";
    
    const tokens = line.split(" ");

    switch(tokens[0]) {
        case "emote":
            expectEnd(tokens[1]);
            return `process.stdout.write(String.fromCharCode(Math.floor(Math.abs(memory[elixir].pop()||0))%256));`;
        case "spectate":
            expectEnd(tokens[1]);
            return `for(const c of prompt(">").split(""))memory[elixir].push(c.charCodeAt(0));`;
        case "gg":
            expectEnd(tokens[1]);
            state.loopDepth--;
            if(state.loopDepth < 0) throw "There's no 'gg' if you ain't cycling";
            return `}`;
        case "ez":
            expectEnd(tokens[1]);
            if(state.deckRegistry.length === 0 || state.deckRegistry[0].closed) throw "You didn't tell us how to win ez";
            state.deckRegistry[0].closed = true;
            return `return [${state.deckRegistry[0].params.join(",")}];}`;
        case "run":
            if(!CARDS.includes(tokens[1]) || !DECKS.includes(tokens[2])) throw "That's not a proper deck name";
            const deckName = tokens[1] + tokens[2];
            let found = -1;
            for(let i = 0; i < state.deckRegistry.length; i++) {
                if(state.deckRegistry[i].name === deckName) {
                    found = i;
                    break;
                }
            }
            if(found === -1) throw `You haven't told us how to run ${tokens[1]} ${tokens[2]}`;
            if(tokens[3] !== "with") {
                expectEnd(tokens[3]);
                if(state.deckRegistry[found].params.length) throw "Which cards are you running it with";
                return `${deckName}();`;
            } else {
                const params = tokens.slice(4, tokens.length);
                for(const p of params) {
                    if(!CARDS.includes(p)) throw `${p} is not a card`;
                }
                if(params.length !== state.deckRegistry[found].params.length) throw `You need ${state.deckRegistry[found].params.length} cards to run ${tokens[1]} ${tokens[2]} but you supplied ${params.length}`;
                return `[${params.join(",")}]=${deckName}(${params.join(",")});`;
            }
        case "join":
            if(tokens[1] !== "clan") throw "What are you joining";
            expectEnd(tokens[2]);
            state.chatEnabled = true;
            return "";
        case "save":
            if(tokens[1] !== "elixir") throw "What are you saving";
            expectEnd(tokens[2]);
            return "elixir=Math.min(9,elixir+1);";
        case "leak":
            if(tokens[1] !== "elixir") throw "What are you leaking";
            expectEnd(tokens[2]);
            return "elixir=Math.max(0,elixir-1);";
        case "cycle":
            if(!CARDS.includes(tokens[1])) throw "You need to cycle a card";
            expectEnd(tokens[2]);
            state.loopDepth++;
            return `while(${tokens[1]}){`;
        case "elixir":
            if(tokens[1] !== "for") throw "I don't know what you're doing with your elixir";
            if(!CARDS.includes(tokens[2])) throw "Specify what card you need elixir for";
            expectEnd(tokens[3]);
            return `${tokens[2]}=memory[elixir].length;`;
        case "peek":
            if(!CARDS.includes(tokens[1])) throw "Hold a card to peek at it's stats";
            expectEnd(tokens[2]);
            return `console.log(${tokens[1]}.toString());`;
        case "buff":
            if(!CARDS.includes(tokens[1])) throw "Which cards needs a buff";
            expectEnd(tokens[2]);
            return `${tokens[1]}++;`;
        case "nerf":
            if(!CARDS.includes(tokens[1])) throw "Tell supercell which card to nerf";
            expectEnd(tokens[2]);
            return `${tokens[1]}--;`;
        case "predict":
            if(!CARDS.includes(tokens[1])) throw "What did you predict";
            expectEnd(tokens[2]);
            return `${tokens[1]}=0;`;
        case "spam":
            if(!CARDS.includes(tokens[1])) throw `I can't spam ${tokens[1]}`;
            expectEnd(tokens[2]);
            return `memory[elixir].push(${tokens[1]});`;
        case "play":
            if(!CARDS.includes(tokens[1])) throw `What's ${tokens[1]}`;
            expectEnd(tokens[2]);
            return `${tokens[1]}=memory[elixir].pop()||0;`;
        default:
            if(!CARDS.includes(tokens[0])) throw "I don't know what you're doing here";
    }

    switch(tokens[1]) {
        case "op":
            expectEnd(tokens[2]);
            return `${tokens[0]}=Math.max(0,${tokens[0]});`;
        case "defends":
            if(!CARDS.includes(tokens[2])) throw `${tokens[0]} defends who`;
            expectEnd(tokens[3]);
            return `${tokens[0]}+=${tokens[2]};`;
        case "kills":
            if(!CARDS.includes(tokens[2])) throw `${tokens[0]} kills who though`;
            expectEnd(tokens[3]);
            return `${tokens[0]}-=${tokens[2]};`;
        case "ignores":
            if(!CARDS.includes(tokens[2])) throw `Who is ${tokens[0]} ignoring`;
            expectEnd(tokens[3]);
            return `${tokens[0]}*=${tokens[2]};`;
        case "counters":
            if(!CARDS.includes(tokens[2])) throw `Who was countered`;
            expectEnd(tokens[3]);
            return `${tokens[0]}/=${tokens[2]};`;
        case "kites":
            if(!CARDS.includes(tokens[2])) throw `You need to tell us who's getting kited`;
            expectEnd(tokens[3]);
            return `${tokens[0]}=memory[elixir][${tokens[2]}]||0;`;
        default:
            if(tokens[2] !== "deck") throw `What exactly is ${tokens[0]} doing`;
            if(!DECKS.includes(tokens[1])) throw "That's not a kind of deck";
            if(state.deckRegistry.length > 0 && !state.deckRegistry[0]?.closed) throw "First finish telling us about that other deck";
            const deckName = tokens[0] + tokens[1];
            if(tokens[3] !== "with") {
                expectEnd(tokens[3]);
                state.deckRegistry.unshift(new DeckEntry(deckName, []));
                return `function ${deckName}(){${CARD_INIT}`;
            } else {
                const params = tokens.slice(4, tokens.length);
                for(const p of params) {
                    if(!CARDS.includes(p)) throw `${p} is not a card`;
                }
                state.deckRegistry.unshift(new DeckEntry(deckName, params));
                const INparams = "IN"+params.join(",IN");
                return `function ${deckName}(${INparams}){${CARD_INIT}[${params.join(",")}]=[${INparams}];`;
            }
    }
}