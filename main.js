// === SILOCRATE TERMINAL GAME ===
// Full version with rainbow progress scan bar and full game logic

const bootLines = [
  "Initializing network stack...",
  "Mounting quantum drives...",
  "Loading core memory sectors...",
  "Decrypting access layer...",
  "Access granted. Welcome, SILOCRATE operative.\n",
];

const bootEl = document.getElementById("boot-sequence");
const terminalEl = document.getElementById("terminal-container");

function typeBootLines(lines, index = 0) {
  if (index >= lines.length) {
    setTimeout(() => {
      bootEl.style.display = "none";
      terminalEl.style.display = "block";
      initTerminal();
    }, 1000);
    return;
  }

  const line = lines[index];
  let charIndex = 0;

  const typer = setInterval(() => {
    if (charIndex < line.length) {
      bootEl.textContent += line[charIndex++];
    } else {
      clearInterval(typer);
      bootEl.textContent += "\n";
      setTimeout(() => typeBootLines(lines, index + 1), 500);
    }
  }, 40);
}

window.addEventListener("DOMContentLoaded", () => {
  bootEl.style.display = "block";
  terminalEl.style.display = "none";
  typeBootLines(bootLines);
});

function initTerminal() {
  const term = new Terminal({
    cursorBlink: true,
    fontSize: 16,
    theme: {
      background: "#0d0d0d",
      foreground: "#39ff14",
    },
  });
  term.open(document.getElementById("terminal-container"));

  const banner = [
    "Welcome to SILOCRATE.",
    "Follow the white rabbit...",
    "",
    "Type 'help' for available commands.",
  ];
  banner.forEach((line) => term.writeln(line));
  prompt();

  let inputBuffer = "";
  let sessionConnected = false;
  let currentTarget = null;
  let gameWon = false;
  let prizeClaimed = false;

  const commandHistory = [];
  let historyIndex = -1;

  const network = {
    "10.13.37.42": {
      cracked: true,
      files: {
        "flag.txt": "flag{this_is_a_decoy_flag}",
        "notes.txt": "Nothing to see here... or is there?",
      },
    },
    "10.13.37.99": {
      cracked: false,
      files: {
        "vault.kdbx": "[encrypted binary block] -- no readable content",
        "flag.txt": "Encrypted content - please decrypt with correct password.",
        "notes.txt": "Try harder. Look deeper.",
        ".pwkey": "eel_binder99",
      },
    },
    "172.16.0.1": {
      cracked: false,
      files: {
        "flag.txt": "Encrypted content - please decrypt with correct password.",
        syslog: "Too many failed logins from your IP.",
      },
    },
  };

  term.onData((key) => {
    switch (key) {
      case "\r":
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
      case "\u0003":
        term.write("^C");
        inputBuffer = "";
        prompt();
        break;
      case "\u007F":
        if (inputBuffer.length > 0) {
          inputBuffer = inputBuffer.slice(0, -1);
          term.write("\b \b");
        }
        break;
      case "\u001b[A":
        if (historyIndex > 0) {
          historyIndex--;
          replaceLine(commandHistory[historyIndex]);
        }
        break;
      case "\u001b[B":
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

  function handleCommand(raw) {
    const [base, ...args] = raw.split(" ");
    const argStr = args.join(" ");

    switch (base.toLowerCase()) {
      case "help":
        term.writeln("\nAvailable commands:");
        term.writeln("  help              Show this help menu");
        term.writeln("  whoami            Show current user");
        term.writeln("  uname             Show system info");
        term.writeln("  clear             Clear the screen");
        term.writeln("  scan              Discover systems");
        term.writeln("  crack [ip]        Attempt to brute-force a system");
        term.writeln("  connect [ip]      Connect to a target system");
        term.writeln("  disconnect        Disconnect from current host");
        term.writeln("  ls                List files on the current system");
        term.writeln("  ls -a             List all files (including hidden)");
        term.writeln("  cat [file]        Read file content");
        term.writeln("  decrypt [file] [password]  Attempt to decrypt a file");
        term.writeln("  claimprize [flag] Claim the final reward");
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

      case "disconnect":
        sessionConnected = false;
        currentTarget = null;
        term.writeln("Disconnected from host.");
        break;

      case "scan":
        safeWrite("Initiating network scan...");
        let scanBarLine = term.buffer.active.cursorY + 1;
        term.write("\n"); // Reserve line for bar
        let progress = 0;
        const barLength = 30;

        const scanInterval = setInterval(() => {
          const filled = "=".repeat(progress);
          const empty = " ".repeat(barLength - progress);
          const bar = `[${filled}${empty}]`;

          // Move cursor up to scan bar line and overwrite
          term.write(`\x1b[${term.buffer.active.cursorY - scanBarLine + 1}A`);
          term.write(`\r${bar}`);
          term.write(`\x1b[${term.buffer.active.cursorY - scanBarLine + 1}B`);

          progress++;

          if (progress > barLength) {
            clearInterval(scanInterval);
            term.writeln(""); // Move past progress bar
            safeWrite("Scan complete.\n");
            Object.entries(network).forEach(([ip, data]) => {
              const status = data.cracked ? "open" : "filtered";
              safeWrite(` - ${ip} (status: ${status})`);
            });
            prompt();
          }
        }, 50);
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
            term.writeln(`Crack successful. You may now 'connect ${argStr}'`);
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
          const showHidden = raw.includes("-a");
          const files = Object.keys(network[currentTarget].files).filter((f) =>
            showHidden ? true : !f.startsWith("."),
          );
          files.forEach((f) => term.writeln(f));
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
            if (argStr === "flag.txt" && !gameWon) {
              term.writeln(
                "flag.txt is encrypted. Use: decrypt flag.txt [password]",
              );
            } else {
              term.writeln(file);
            }
          } else {
            term.writeln(`cat: ${argStr}: No such file`);
          }
        }
        break;

      case "decrypt":
        const [fileName, pw] = args;
        if (!sessionConnected || !currentTarget) {
          term.writeln("Not connected to any host.");
        } else if (!fileName || !pw) {
          term.writeln("Usage: decrypt [file] [password]");
        } else if (fileName !== "flag.txt") {
          term.writeln("Only 'flag.txt' can be decrypted.");
        } else if (pw === network["10.13.37.99"].files[".pwkey"]) {
          term.writeln("\x1b[1;32mflag{sys_h4ck3d_w3ll_d0n3}\x1b[0m");
          gameWon = true;
        } else {
          term.writeln("Decryption failed. Invalid password.");
        }
        break;

      case "claimprize":
        if (!argStr) {
          term.writeln("Usage: claimprize [flag]");
        } else if (argStr === "flag{sys_h4ck3d_w3ll_d0n3}") {
          if (prizeClaimed) {
            term.writeln("You already claimed your prize.");
          } else {
            term.writeln("\n\x1b[35m✨✨✨ CLAIMING PRIZE ✨✨✨\x1b[0m");
            term.writeln("Welcome to the prize chamber.\n");
            term.writeln("\x1b[38;2;255;105;180mClouds swirl...\x1b[0m");
            term.writeln("\x1b[38;2;173;216;230mRainbows gleam...\x1b[0m");
            term.writeln("\x1b[38;2;255;182;193mYou feel weightless.\x1b[0m");
            term.writeln(
              "\n\x1b[1;36m>>> Your reward awaits in another life <<<\x1b[0m",
            );
            prizeClaimed = true;
          }
        } else {
          term.writeln("That flag does not grant access to the prize.");
        }
        break;

      default:
        term.writeln(`Command not found: ${base}`);
    }

    prompt();
  }

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
    const distros = ["Arch", "Void", "Debian", "Scorpion", "Mongoose"];
    return `${distros[Math.floor(Math.random() * distros.length)]} silocrate 6.9.66-l33t x86_64 GNU/Linux`;
  }
}
