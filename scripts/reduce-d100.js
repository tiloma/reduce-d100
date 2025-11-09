Hooks.on("preCreateChatMessage", (msg, data, options, userId) => {
  try {
    // Prüfen ob die Nachricht überhaupt eine Würfelrolle enthält
    if (!data.rolls) return;

    for (let r of data.rolls) {
      const roll = Roll.fromJSON(r);

      // Iteriere durch alle Terms
      roll.terms.forEach(term => {
        // Nur DiceTerm (z.B. 1d100)
        if (term instanceof Die && term.faces === 100) {

          // Ergebnisse anpassen
          term.results = term.results.map(res => {
            if (typeof res.result === "number") {
              return {
                ...res,
                result: Math.max(1, res.result - 1)  // verhindert 0 oder negatives Ergebnis
              };
            }
            return res;
          });
        }
      });

      // zurückschreiben
      r = roll.toJSON();
    }
  } catch (err) {
    console.error("reduce-d100 | Fehler beim Verarbeiten des Wurfes:", err);
  }
});
