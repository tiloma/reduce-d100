const MODULE_ID = "reduce-d100";

Hooks.once("init", () => {
  const DieTerm = CONFIG.Dice?.terms?.d;
  if (!DieTerm) return console.error(`[${MODULE_ID}] Die term not found`);

  // Wrap die.roll so we can post-process *each* d100 result immediately.
  libWrapper.register(
    MODULE_ID,
    "CONFIG.Dice.terms.d.prototype.roll",
    function (wrapped, ...args) {
      // Let Foundry roll first
      const out = wrapped.apply(this, args);

      // Only touch real d100 dice (not d%) and only active results
      if (this.faces === 100 && Array.isArray(this.results)) {
        for (const r of this.results) {
          if (r?.active && typeof r.result === "number") {
            // reduce by 1, but not below 1
            r.result = Math.max(1, r.result - 1);
          }
        }
      }
      return out;
    },
    "WRAPPER"
  );
});
