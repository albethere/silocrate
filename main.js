// === SILOCRATE TERMINAL GAME ===
// Full version with working disconnect, hidden dotfile logic, prize claim, fake flag trap, and true game-winning path

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
      unlocked: false,
      files: {
        "vault.kdbx": "[encrypted binary block] -- no readable content",
        "flag.txt": "Encrypted content - please decrypt with correct password.",
        "notes.txt": "Try harder. Look deeper.",
        ".pwkey": "eel_binder99",
      },
    },
    "172.16.0.1": {
      cracked: false,
      unlocked: false,
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
        safeWrite("\nAvailable commands:");
        safeWrite("  help              Show this help menu");
        safeWrite("  whoami            Show current user");
        safeWrite("  uname             Show system info");
        safeWrite("  clear             Clear the screen");
        safeWrite("  scan              Discover systems");
        safeWrite("  crack [ip]        Attempt to brute-force a system");
        safeWrite("  connect [ip]      Connect to a target system");
        safeWrite("  disconnect        Disconnect from current host");
        safeWrite("  ls                List files on the current system");
        safeWrite("  cat [file]        Read file content");
        safeWrite("  decrypt [file] [password]  Attempt to decrypt a file");
        safeWrite("  claimprize [flag] Claim the final reward");
        break;

      case "disconnect":
        if (!sessionConnected) {
          safeWrite("Not connected to any host.");
        } else {
          sessionConnected = false;
          currentTarget = null;
          safeWrite("Disconnected from host.");
        }
        break;

      case "claimprize":
        if (
          argStr.trim() === "flag{the_eels_are_listening}" &&
          gameWon &&
          !prizeClaimed
        ) {
          prizeClaimed = true;
          safeWrite("Flag accepted. Claiming prize...\n");
          safeWrite("🌈✨🌥️ WELCOME TO THE CLOUD PRISM ✨🌈🌥️\n");
          safeWrite("You've pierced the vapor.\n");
          safeWrite("A cascade of rainbow bytes surrounds you.\n");
          safeWrite("Digital cherry blossoms fall in slow motion.\n");
          safeWrite("∞ Cloud elegance enabled. ∞\n");
          safeWrite("[ Insert your cosmic payload here ]\n");
          safeWrite("🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈🌈\n");
        } else {
          safeWrite("Invalid flag or prize already claimed.");
        }
        break;

      case "ls":
        if (!sessionConnected || !currentTarget) {
          safeWrite("Not connected to any host.");
        } else {
          const visible = Object.keys(network[currentTarget].files).filter(
            (f) => !f.startsWith("."),
          );
          visible.forEach((f) => safeWrite(f));
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
            safeWrite("Decryption complete.");
          } else {
            safeWrite("Decryption failed. Incorrect password.");
          }
        }
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
