"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NegativeEffectsChance {
    constructor() {
        this.config = require("../config/config.json");
    }
    postDBLoad(container) {
        const logger = container.resolve("WinstonLogger");
        const db = container.resolve("DatabaseServer");
        const tables = db.getTables();
        const buffs = tables.globals.config.Health.Effects.Stimulator.Buffs;
        const buffsToAdjust = this.config.buffsToAdjust;
        const effectsBelowZero = this.config.effectsToSubtractFromWithValuesBelowZero;
        const effectsAboveZero = this.config.effectsToSubtractWithValuesFromAboveZero;
        const effectsZero = this.config.effectsToSubtractWithValuesFromZero;
        const chanceSubtraction = this.config.chanceSubtraction;
        let stimsUpdate = 0;
        for (let sourceOfBuff in buffs) {
            try {
                if (this.config.debug) {
                    logger.info("[NegativeStimEffectsChance] found stimbuff with name " + sourceOfBuff);
                }
                if (buffsToAdjust.includes(sourceOfBuff)) {
                    for (let specificBuffIndex in buffs[sourceOfBuff]) {
                        let stimEffectUpdated = false;
                        const specificBuff = buffs[sourceOfBuff][specificBuffIndex];
                        if (effectsBelowZero.includes(specificBuff.BuffType) && specificBuff.Value < 0) {
                            specificBuff.Chance = Math.max(0, specificBuff.Chance - chanceSubtraction);
                            stimEffectUpdated = true;
                        }
                        if (effectsAboveZero.includes(specificBuff.BuffType) && specificBuff.Value > 0) {
                            specificBuff.Chance = Math.max(0, specificBuff.Chance - chanceSubtraction);
                            stimEffectUpdated = true;
                        }
                        if (effectsZero.includes(specificBuff.BuffType) && specificBuff.Value === 0) {
                            specificBuff.Chance = Math.max(0, specificBuff.Chance - chanceSubtraction);
                            stimEffectUpdated = true;
                        }
                        if (stimEffectUpdated) {
                            stimsUpdate++;
                        }
                    }
                }
            }
            catch (err) {
                logger.info("[NegativeStimEffectsChance] failed to update stimbuff with name " + sourceOfBuff);
                continue;
            }
        }
        logger.info("[NegativeStimEffectsChance] MusicManiac - NegativeStimEffectsChance Loaded:");
        if (stimsUpdate === 0) {
            logger.info("[NegativeStimEffectsChance] no stims were updated");
        }
        else {
            logger.info("[NegativeStimEffectsChance] " + stimsUpdate + " stim buffs had their stats adjusted");
        }
    }
}
module.exports = { mod: new NegativeEffectsChance() };
