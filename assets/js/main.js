// >_ footer trigger: click 3 times within 2 seconds
let clicks = 0, timer;
document.getElementById('terminal-trigger').addEventListener('click', (e) => {
  e.preventDefault();
  clicks++;
  clearTimeout(timer);
  timer = setTimeout(() => { clicks = 0; }, 2000);
  if (clicks >= 3) window.location.href = '/terminal.html';
});

// Konami code
const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIdx = 0;
document.addEventListener('keydown', (e) => {
  if (e.key === konami[konamiIdx]) {
    konamiIdx++;
    if (konamiIdx === konami.length) window.location.href = '/terminal.html';
  } else {
    konamiIdx = 0;
  }
});

// Waitlist form — prevent default and show feedback
const form = document.getElementById('waitlist-form');
if (form) {
  form.addEventListener('submit', (e) => {
    const email = form.querySelector('input[type="email"]').value;
    if (email) {
      e.preventDefault();
      window.location.href = `mailto:hello@silocrate.com?subject=Early%20Access%20Request&body=Please%20add%20me%20to%20the%20waitlist%3A%20${encodeURIComponent(email)}`;
    }
  });
}
