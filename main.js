// === SILOCRATE TERMINAL GAME ===
// Full version with rainbow progress scan bar and fixed logic

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
      case "scan": {
        if (!sessionConnected || !currentTarget) {
          safeWrite("Initiating network scan...");
        }

        safeWrite("Scanning local network...");

        let progress = 0;
        const total = 24;

        function updateBar() {
          if (progress <= total) {
            const rainbow = [
              "\x1b[31m",
              "\x1b[33m",
              "\x1b[32m",
              "\x1b[36m",
              "\x1b[34m",
              "\x1b[35m",
            ];
            const color = rainbow[progress % rainbow.length];
            const bar =
              color +
              "[" +
              "=".repeat(progress) +
              " ".repeat(total - progress) +
              "]\x1b[0m";
            term.write("\r\n" + bar);
            progress++;
            setTimeout(updateBar, 80);
          } else {
            safeWrite("Scan complete.\n");
            Object.entries(network).forEach(([ip, data]) => {
              const status = data.cracked ? "open" : "filtered";
              safeWrite(` - ${ip} (status: ${status})`);
            });
            prompt();
          }
        }

        setTimeout(updateBar, 300);
        return;
      }
      // all other commands continue...
    }
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
