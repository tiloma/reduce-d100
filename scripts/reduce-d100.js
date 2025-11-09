// Dieser Hook läuft, wenn Dice So Nice das Ergebnis fertig animiert hat.
Hooks.on("diceSoNiceRollComplete", (messageId) => {
  const message = game.messages.get(messageId);
  if (!message) return;

  const rolls = message.rolls;
  if (!rolls) return;

  let changed = false;

  // Alle Rolls in dieser Nachricht durchlaufen
  for (const roll of rolls) {
    for (const term of roll.terms) {
      // Wir suchen echte DiceTerms
      if (term instanceof Die && term.faces === 100) {

        for (const r of term.results) {
          if (typeof r.result === "number") {
            r.result = Math.max(1, r.result - 1);
            changed = true;
          }
        }
      }
    }
  }

  // Falls wir Ergebnisse geändert haben → Nachricht aktualisieren
  if (changed) {
    message.update({
      rolls: rolls.map(r => r.toJSON())
    });
  }
});
