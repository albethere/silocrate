const term = new Terminal({
  cursorBlink: true,
  fontSize: 16,
  theme: {
    background: "#0d0d0d",
    foreground: "#39ff14",
  },
});
term.open(document.getElementById("terminal-container"));

// Intro banner
const banner = [
  "Welcome to \x1b[1mSILOCRATE\x1b[0m.",
  "Type \x1b[1;36mhelp\x1b[0m to list commands.",
  "",
];
banner.forEach((line) => term.writeln(line));
prompt();

// --- Game & Terminal State ---
let inputBuffer = "";
let sessionConnected = false;
let currentTarget = null;
let gameWon = false;

const commandHistory = [];
let historyIndex = -1;

const network = {
  "10.13.37.42": {
    cracked: true,
    files: {
      "flag.txt": "flag{the_eels_are_listening}",
      "secret.png": "[binary data]",
      "readme.md": "Welcome to the honeypot.",
    },
  },
  "10.13.37.99": {
    cracked: false,
    files: {
      "vault.kdbx": "[encrypted blob]",
      "flag.txt": "flag{winners_never_quit}",
      "notes.txt": "admin password is in the vault",
    },
  },
  "172.16.0.1": {
    cracked: false,
    files: {
      "flag.txt": "flag{you_should_not_be_here}",
      syslog: "Too many failed logins from your IP.",
    },
  },
};

// --- Terminal Input Handling ---
term.onData((key) => {
  switch (key) {
    case "\r": // Enter
      term.write("\r\n");
      if (inputBuffer.trim() !== "") {
        commandHistory.push(inputBuffer);
        historyIndex = commandHistory.length;
        handleCommand(inputBuffer.trim());
      } else {
        prompt();
      }
      inputBuffer = "";
      break;

    case "\u0003": // Ctrl+C
      term.write("^C");
      inputBuffer = "";
      prompt();
      break;

    case "\u007F": // Backspace
      if (inputBuffer.length > 0) {
        inputBuffer = inputBuffer.slice(0, -1);
        term.write("\b \b");
      }
      break;

    case "\u001b[A": // ↑ Arrow
      if (historyIndex > 0) {
        historyIndex--;
        replaceLine(commandHistory[historyIndex]);
      }
      break;

    case "\u001b[B": // ↓ Arrow
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        replaceLine(commandHistory[historyIndex]);
      } else {
        historyIndex = commandHistory.length;
        replaceLine("");
      }
      break;

    default:
      if (key >= " " && key <= "~") {
        inputBuffer += key;
        term.write(key);
      }
  }
});

function prompt() {
  term.write("\r\n> ");
}

function replaceLine(text) {
  while (inputBuffer.length > 0) {
    term.write("\b \b");
    inputBuffer = inputBuffer.slice(0, -1);
  }
  inputBuffer = text;
  term.write(inputBuffer);
}

// --- Command Parser ---
function handleCommand(raw) {
  const [base, ...args] = raw.split(" ");
  const argStr = args.join(" ");

  switch (base.toLowerCase()) {
    case "help":
      term.writeln("\nAvailable commands:");
      term.writeln("  help            Show this help menu");
      term.writeln("  whoami          Random hacker handle");
      term.writeln("  uname           Fake system info");
      term.writeln("  clear           Clear the screen");
      term.writeln("  scan            Discover fake systems");
      term.writeln("  crack [ip]      Attempt to break into a system");
      term.writeln("  connect [ip]    Connect to a target system");
      term.writeln("  ls              List files on the current system");
      term.writeln("  cat [file]      Read file content");
      break;

    case "whoami":
      term.writeln(randomHandle());
      break;

    case "uname":
      term.writeln(fakeUname());
      break;

    case "clear":
      term.clear();
      break;

    case "scan":
      term.writeln("Scanning local network...");
      setTimeout(() => {
        Object.keys(network).forEach((ip) => {
          const status = network[ip].cracked ? "open" : "filtered";
          term.writeln(` - ${ip} (status: ${status})`);
        });
        prompt();
      }, 600);
      return;

    case "crack":
      if (!argStr || !network[argStr]) {
        term.writeln("Usage: crack [IP] — target must exist.");
      } else if (network[argStr].cracked) {
        term.writeln(`${argStr} is already accessible.`);
      } else {
        term.writeln(`Running crack tool against ${argStr}...`);
        setTimeout(() => {
          network[argStr].cracked = true;
          term.writeln(`Access granted. You may now 'connect ${argStr}'`);
          prompt();
        }, 1000);
        return;
      }
      break;

    case "connect":
      if (!argStr) {
        term.writeln("Usage: connect [IP]");
      } else if (!network[argStr]) {
        term.writeln(`Unable to connect: host ${argStr} not found.`);
      } else if (!network[argStr].cracked) {
        term.writeln(`Connection refused: host ${argStr} is protected.`);
      } else {
        currentTarget = argStr;
        sessionConnected = true;
        term.writeln(`Connected to ${argStr}. Use 'ls' to list files.`);
      }
      break;

    case "ls":
      if (!sessionConnected || !currentTarget) {
        term.writeln("Not connected to any host.");
      } else {
        Object.keys(network[currentTarget].files).forEach((f) =>
          term.writeln(f),
        );
      }
      break;

    case "cat":
      if (!sessionConnected || !currentTarget) {
        term.writeln("Not connected to any host.");
      } else if (!argStr) {
        term.writeln("Usage: cat [filename]");
      } else {
        const file = network[currentTarget].files[argStr];
        if (file) {
          term.writeln(file);
          if (argStr === "flag.txt" && !gameWon) {
            term.writeln("\n\x1b[1;32m>>> FLAG CAPTURED <<<\x1b[0m");
            gameWon = true;
          }
        } else {
          term.writeln(`cat: ${argStr}: No such file`);
        }
      }
      break;

    default:
      term.writeln(`Command not found: ${base}`);
  }

  prompt();
}

// --- Utility Output Generators ---
function randomHandle() {
  const handles = [
    "zero_day_squid",
    "void.$inject",
    "n0va-kidd",
    "gutter.sys",
    "crypt0_pastel",
    "xenoGhost",
    "r3aper.exe",
    "404_phantom",
  ];
  return handles[Math.floor(Math.random() * handles.length)];
}

function fakeUname() {
  const distros = ["Arch", "Void", "Debian", "Gentoo", "Slackware"];
  return `${distros[Math.floor(Math.random() * distros.length)]} silocrate 6.9.66-l33t x86_64 GNU/Linux`;
}
