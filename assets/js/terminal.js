// === SILOCRATE TERMINAL GAME ===
// Updated to xterm.js v5 API — uses Terminal from @xterm/xterm

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
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    theme: {
      background: "#0d0d0d",
      foreground: "#39ff14",
      cursor: "#00ffff",
      selectionBackground: "rgba(255,20,147,0.4)",
    },
  });

  // xterm.js v5: use FitAddon for proper sizing
  const fitAddon = new FitAddon.FitAddon();
  term.loadAddon(fitAddon);
  term.open(terminalEl);
  fitAddon.fit();

  window.addEventListener("resize", () => fitAddon.fit());
  window.term = term;

  function safeWrite(s = "") {
    try { term.writeln(String(s)); } catch (e) { console.error("[safeWrite]", e); }
  }

  const motd = [
    "\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m",
    "\x1b[1;35m  SILOCRATE OPERATIVE TERMINAL  \x1b[0m\x1b[36mv2.1.0\x1b[0m",
    "\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m",
    "  Type \x1b[33mhelp\x1b[0m to list commands. Follow the white rabbit.",
    "",
  ];
  motd.forEach((line) => term.writeln(line));
  writePrompt();

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
        "readme.sh":  "#!/bin/bash\n# This machine is a honeypot. Congratulations, you found it.",
      },
    },
    "10.13.37.99": {
      cracked: false,
      files: {
        "vault.kdbx": "[encrypted binary block] -- no readable content",
        "flag.txt": "Encrypted content — decrypt with the correct password.",
        "notes.txt": "Try harder. Look deeper.",
        ".pwkey": "eel_binder99",
      },
    },
    "172.16.0.1": {
      cracked: false,
      files: {
        "flag.txt": "Encrypted content — decrypt with the correct password.",
        "syslog": "Too many failed logins from your IP. Blacklisting...",
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
          writePrompt();
        }
        inputBuffer = "";
        break;
      case "\u0003":
        term.write("^C");
        inputBuffer = "";
        writePrompt();
        break;
      case "\u007F":
        if (inputBuffer.length > 0) {
          inputBuffer = inputBuffer.slice(0, -1);
          term.write("\b \b");
        }
        break;
      case "\u001b[A":
        if (historyIndex > 0) { historyIndex--; replaceLine(commandHistory[historyIndex]); }
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

  function writePrompt() {
    const host = sessionConnected ? `\x1b[31m${currentTarget}\x1b[0m` : "\x1b[90mlocal\x1b[0m";
    term.write(`\r\n\x1b[35msilocrate\x1b[0m@${host} \x1b[33m$\x1b[0m `);
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
    const parts = raw.split(" ");
    const base = parts[0];
    const args = parts.slice(1);
    const argStr = args.join(" ");

    switch (base.toLowerCase()) {
      case "help":
        term.writeln("\n\x1b[33mAvailable commands:\x1b[0m");
        term.writeln("  \x1b[36mhelp\x1b[0m                Show this help menu");
        term.writeln("  \x1b[36mwhoami\x1b[0m              Show current operative handle");
        term.writeln("  \x1b[36muname\x1b[0m               Show system info");
        term.writeln("  \x1b[36mhistory\x1b[0m             Show command history");
        term.writeln("  \x1b[36mclear\x1b[0m               Clear the screen");
        term.writeln("  \x1b[36mscan\x1b[0m                Discover systems on the network");
        term.writeln("  \x1b[36mping \x1b[33m[ip]\x1b[0m          Ping a target");
        term.writeln("  \x1b[36mcrack \x1b[33m[ip]\x1b[0m         Brute-force a system");
        term.writeln("  \x1b[36mconnect \x1b[33m[ip]\x1b[0m       Connect to a cracked system");
        term.writeln("  \x1b[36mdisconnect\x1b[0m          Disconnect from current host");
        term.writeln("  \x1b[36mls \x1b[33m[-a]\x1b[0m            List files on connected host");
        term.writeln("  \x1b[36mcat \x1b[33m[file]\x1b[0m         Read a file");
        term.writeln("  \x1b[36mdecrypt \x1b[33m[file] [pw]\x1b[0m Decrypt a file");
        term.writeln("  \x1b[36mclaimprize \x1b[33m[flag]\x1b[0m  Claim your reward");
        break;

      case "whoami":
        term.writeln(randomHandle());
        break;

      case "uname":
        term.writeln(fakeUname());
        break;

      case "history":
        if (commandHistory.length === 0) {
          term.writeln("No commands in history.");
        } else {
          commandHistory.forEach((cmd, i) => term.writeln(`  ${i + 1}  ${cmd}`));
        }
        break;

      case "clear":
        term.clear();
        break;

      case "disconnect":
        if (!sessionConnected) {
          term.writeln("\x1b[31mNot connected to any host.\x1b[0m");
        } else {
          term.writeln(`Disconnected from \x1b[31m${currentTarget}\x1b[0m.`);
          sessionConnected = false;
          currentTarget = null;
        }
        break;

      case "scan": {
        safeWrite("\x1b[36mScanning local network...\x1b[0m");
        const delay = 800;
        setTimeout(() => safeWrite("  → 10.13.37.42  \x1b[32mopen\x1b[0m    (SSH, HTTP)"), delay);
        setTimeout(() => safeWrite("  → 10.13.37.99  \x1b[33mfiltered\x1b[0m (SMB, FTP)"), delay * 2);
        setTimeout(() => safeWrite("  → 172.16.0.1   \x1b[33mfiltered\x1b[0m (admin panel)"), delay * 3);
        setTimeout(() => { safeWrite("\x1b[36mScan complete. 3 hosts found.\x1b[0m"); writePrompt(); }, delay * 4);
        return;
      }

      case "ping": {
        if (!argStr) { term.writeln("Usage: ping [ip]"); break; }
        if (!network[argStr]) { term.writeln(`ping: ${argStr}: Network unreachable`); break; }
        term.writeln(`PING ${argStr}: 56 bytes of data.`);
        setTimeout(() => { safeWrite(`64 bytes from ${argStr}: icmp_seq=0 ttl=64 time=1.${Math.floor(Math.random()*9)}ms`); writePrompt(); }, 600);
        return;
      }

      case "crack":
        if (!argStr || !network[argStr]) {
          term.writeln("Usage: crack [ip] — target must exist on the network.");
        } else if (network[argStr].cracked) {
          term.writeln(`\x1b[32m${argStr} is already accessible.\x1b[0m`);
        } else {
          term.writeln(`\x1b[36mRunning credential spray against ${argStr}...\x1b[0m`);
          const bar = ["▓░░░░░░░░░", "▓▓░░░░░░░░", "▓▓▓░░░░░░░", "▓▓▓▓░░░░░░", "▓▓▓▓▓░░░░░", "▓▓▓▓▓▓░░░░", "▓▓▓▓▓▓▓░░░", "▓▓▓▓▓▓▓▓░░", "▓▓▓▓▓▓▓▓▓░", "▓▓▓▓▓▓▓▓▓▓"];
          let i = 0;
          const iv = setInterval(() => {
            term.write(`\r  [\x1b[32m${bar[i]}\x1b[0m] ${(i + 1) * 10}%`);
            i++;
            if (i >= bar.length) {
              clearInterval(iv);
              network[argStr].cracked = true;
              term.writeln(`\r  [\x1b[32m${bar[bar.length - 1]}\x1b[0m] 100%`);
              safeWrite(`\x1b[32mCrack successful.\x1b[0m Use 'connect ${argStr}'`);
              writePrompt();
            }
          }, 200);
          return;
        }
        break;

      case "connect":
        if (!argStr) {
          term.writeln("Usage: connect [ip]");
        } else if (!network[argStr]) {
          term.writeln(`Unable to connect: host \x1b[31m${argStr}\x1b[0m not found.`);
        } else if (!network[argStr].cracked) {
          term.writeln(`\x1b[31mConnection refused:\x1b[0m ${argStr} is protected. Try 'crack ${argStr}' first.`);
        } else {
          currentTarget = argStr;
          sessionConnected = true;
          term.writeln(`\x1b[32mConnected to ${argStr}.\x1b[0m Type 'ls' to list files.`);
        }
        break;

      case "ls":
        if (!sessionConnected || !currentTarget) {
          term.writeln("\x1b[31mNot connected to any host.\x1b[0m");
        } else {
          const showHidden = raw.includes("-a");
          const files = Object.keys(network[currentTarget].files).filter(
            (f) => showHidden || !f.startsWith(".")
          );
          files.forEach((f) => term.writeln(`  ${f}`));
        }
        break;

      case "cat":
        if (!sessionConnected || !currentTarget) {
          term.writeln("\x1b[31mNot connected to any host.\x1b[0m");
        } else if (!argStr) {
          term.writeln("Usage: cat [filename]");
        } else {
          const file = network[currentTarget].files[argStr];
          if (file) {
            if (argStr === "flag.txt" && !gameWon) {
              term.writeln("\x1b[33mflag.txt is encrypted. Use: decrypt flag.txt [password]\x1b[0m");
            } else {
              term.writeln(file);
            }
          } else {
            term.writeln(`\x1b[31mcat: ${argStr}: No such file\x1b[0m`);
          }
        }
        break;

      case "decrypt": {
        const [fileName, pw] = args;
        if (!sessionConnected || !currentTarget) {
          term.writeln("\x1b[31mNot connected to any host.\x1b[0m");
        } else if (!fileName || !pw) {
          term.writeln("Usage: decrypt [file] [password]");
        } else if (fileName !== "flag.txt") {
          term.writeln("Only 'flag.txt' can be decrypted in this context.");
        } else if (pw === network["10.13.37.99"].files[".pwkey"]) {
          term.writeln("\x1b[1;32mflag{sys_h4ck3d_w3ll_d0n3}\x1b[0m");
          gameWon = true;
        } else {
          term.writeln("\x1b[31mDecryption failed. Invalid password.\x1b[0m");
        }
        break;
      }

      case "claimprize":
        if (!argStr) {
          term.writeln("Usage: claimprize [flag]");
        } else if (argStr === "sys_h4ck3d_w3ll_d0n3") {
          if (prizeClaimed) {
            term.writeln("You already claimed your prize. Greedy.");
          } else {
            term.writeln("\n\x1b[35m✨✨✨ PRIZE CHAMBER ACCESSED ✨✨✨\x1b[0m");
            term.writeln("\x1b[38;2;255;105;180mClouds swirl...\x1b[0m");
            term.writeln("\x1b[38;2;173;216;230mRainbows gleam...\x1b[0m");
            term.writeln("\x1b[38;2;255;182;193mYou feel weightless.\x1b[0m");
            term.writeln("\n\x1b[1;36m>>> Your reward awaits in another life.  What a cop-out! <<<\x1b[0m");
            prizeClaimed = true;
          }
        } else {
          term.writeln("That flag does not grant access to the prize chamber.");
        }
        break;

      default:
        term.writeln(`\x1b[31mCommand not found: ${base}\x1b[0m  (try 'help')`);
    }

    writePrompt();
  }

  function randomHandle() {
    const handles = [
      "zero_day_squid", "void.$inject", "n0va-kidd",
      "gutter.sys", "crypt0_pastel", "xenoGhost",
      "r3aper.exe", "404_phantom", "silo_operative",
    ];
    return "\x1b[35m" + handles[Math.floor(Math.random() * handles.length)] + "\x1b[0m";
  }

  function fakeUname() {
    const distros = ["Arch", "Void", "Debian", "Scorpion", "Mongoose", "Silocrate"];
    const d = distros[Math.floor(Math.random() * distros.length)];
    return `${d} silocrate 6.9.66-l33t x86_64 GNU/Linux`;
  }
}
