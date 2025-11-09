Hooks.on("preCreateChatMessage", (message, data, options, userId) => {

  // Falls keine Rolls vorhanden sind → ignorieren
  if (!data.rolls || !Array.isArray(data.rolls)) return;

  // Jede Roll in der Nachricht durchgehen
  data.rolls = data.rolls.map(rollData => {
    const roll = Roll.fromData(rollData);

    // Alle DiceTerms traversieren
    roll.terms.forEach(term => {
      // Nur echte Würfel: 1d100, 2d100 ...
      if (term instanceof Die && term.faces === 100) {

        term.results = term.results.map(r => {
          if (typeof r.result === "number") {
            return {
              ...r,
              result: Math.max(0, r.result - 1)
            };
          }
          return r;
        });
      }
    });

    // Roll wieder zurück in JSON
    return roll.toJSON();
  });

});
