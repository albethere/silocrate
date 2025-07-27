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

  function safeWrite(text) {
    const sanitized = text
      .replace(/\x1b/g, "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    term.writeln(sanitized);
  }

  const banner = ["Welcome to SILOCRATE.", "Follow the white rabbit...", ""];
  banner.forEach((line) => safeWrite(line));
  prompt();

  // Game state
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
      unlocked: false,
      files: {
        "vault.kdbx":
          "[encrypted binary] xJ9z::meta_start::garbageData::pw=eel_binder99::authheader::junk",
        "flag.txt": "Encrypted content - please decrypt with correct password.",
        "notes.txt": "admin password is in the vault",
        ".pwkey": "password = eel_binder99",
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
      case "\u001b[A": // ↑
        if (historyIndex > 0) {
          historyIndex--;
          replaceLine(commandHistory[historyIndex]);
        }
        break;
      case "\u001b[B": // ↓
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
        safeWrite("\nAvailable commands:");
        safeWrite("  help              Show this help menu");
        safeWrite("  whoami            Show current user");
        safeWrite("  uname             Show system info");
        safeWrite("  clear             Clear the screen");
        safeWrite("  scan              Discover systems");
        safeWrite("  crack [ip]        Attempt to brute-force a system");
        safeWrite("  connect [ip]      Connect to a target system");
        safeWrite("  ls                List files on the current system");
        safeWrite("  cat [file]        Read file content");
        safeWrite("  decrypt [file] [password]  Attempt to decrypt a file");
        break;

      case "whoami":
        safeWrite(randomHandle());
        break;

      case "uname":
        safeWrite(fakeUname());
        break;

      case "clear":
        term.clear();
        break;

      case "scan":
        safeWrite("Scanning local network...");
        setTimeout(() => {
          Object.keys(network).forEach((ip) => {
            const status = network[ip].cracked ? "open" : "filtered";
            safeWrite(` - ${ip} (status: ${status})`);
          });
          prompt();
        }, 600);
        return;

      case "crack":
        if (!argStr || !network[argStr]) {
          safeWrite("Usage: crack [IP] — target must exist.");
        } else if (network[argStr].cracked) {
          safeWrite(`${argStr} is already accessible.`);
        } else {
          safeWrite(`Running crack tool against ${argStr}...`);
          setTimeout(() => {
            network[argStr].cracked = true;
            safeWrite(`Crack successful. You may now 'connect ${argStr}'`);
            prompt();
          }, 1000);
          return;
        }
        break;

      case "connect":
        if (!argStr) {
          safeWrite("Usage: connect [IP]");
        } else if (!network[argStr]) {
          safeWrite(`Unable to connect: host ${argStr} not found.`);
        } else if (!network[argStr].cracked) {
          safeWrite(`Connection refused: host ${argStr} is protected.`);
        } else {
          currentTarget = argStr;
          sessionConnected = true;
          safeWrite(`Connected to ${argStr}.`);
        }
        break;

      case "ls":
        if (!sessionConnected || !currentTarget) {
          safeWrite("Not connected to any host.");
        } else {
          const files = Object.keys(network[currentTarget].files).filter(
            (f) => !f.startsWith("."),
          );
          files.forEach((f) => safeWrite(f));
        }
        break;

      case "ls -a":
        if (!sessionConnected || !currentTarget) {
          safeWrite("Not connected to any host.");
        } else {
          Object.keys(network[currentTarget].files).forEach((f) =>
            safeWrite(f),
          );
        }
        break;

      case "cat":
        if (!sessionConnected || !currentTarget) {
          safeWrite("Not connected to any host.");
        } else if (!argStr) {
          safeWrite("Usage: cat [filename]");
        } else {
          const target = network[currentTarget];
          const file = target.files[argStr];
          if (file) {
            if (argStr === "flag.txt" && !target.unlocked) {
              safeWrite(
                "flag.txt is encrypted. Use: decrypt flag.txt [password]",
              );
            } else {
              safeWrite(file);
              if (argStr === "flag.txt" && !gameWon && target.unlocked) {
                term.writeln("\n\x1b[1;32m>>> FLAG CAPTURED <<<\x1b[0m");
                gameWon = true;
              }
            }
          } else {
            safeWrite(`cat: ${argStr}: No such file`);
          }
        }
        break;

      case "decrypt":
        if (!sessionConnected || !currentTarget) {
          safeWrite("Not connected to any host.");
        } else if (!argStr) {
          safeWrite("Usage: decrypt [filename] [password]");
        } else {
          const [fileArg, password] = argStr.split(" ");
          if (fileArg !== "flag.txt") {
            safeWrite("Only flag.txt can be decrypted.");
          } else if (
            password === "eel_binder99" &&
            currentTarget === "10.13.37.99"
          ) {
            network[currentTarget].unlocked = true;
            safeWrite("Decryption complete. You may now cat flag.txt.");
          } else {
            safeWrite("Decryption failed. Incorrect password.");
          }
        }
        break;

      default:
        safeWrite(`Command not found: ${base}`);
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
    const distros = ["Arch", "Void", "Debian", "Gentoo", "Slackware"];
    return `${distros[Math.floor(Math.random() * distros.length)]} silocrate 6.9.66-l33t x86_64 GNU/Linux`;
  }
}
