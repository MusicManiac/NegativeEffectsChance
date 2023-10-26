"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class NegativeEffectsChance {
    config = require("../config/config.json");
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
        const nonLinearSubstraction = Math.pow((1 - this.config.chanceSubtraction), this.config.nonLinearSubtractionRepeats);
        let stimsUpdate = 0;
        for (let sourceOfBuff in buffs) {
            try {
                if (this.config.debug) {
                    logger.info("[NegativeStimEffectsChance] found stimbuff with name " + sourceOfBuff);
                }
                if (sourceOfBuff == "Buffs_Obdolbos" && this.config.OGObdolbos) {
                    logger.info("[NegativeStimEffectsChance] Obdolbos was reset to normal state");
                    obdolbosOverwrite(buffs[sourceOfBuff]);
                }
                if (sourceOfBuff == "Buffs_Meldonin" && this.config.OGMeldonin) {
                    logger.info("[NegativeStimEffectsChance] Meldonin was reset to great state");
                    meldoninOverwrite(buffs[sourceOfBuff]);
                }
                if (buffsToAdjust.includes(sourceOfBuff)) {
                    for (let specificBuffIndex in buffs[sourceOfBuff]) {
                        let stimEffectUpdated = false;
                        const specificBuff = buffs[sourceOfBuff][specificBuffIndex];
                        if (effectsBelowZero.includes(specificBuff.BuffType) && specificBuff.Value < 0) {
                            if (this.config.nonLinearSubtraction) {
                                specificBuff.Chance = Math.max(0, specificBuff.Chance * nonLinearSubstraction);
                            }
                            else {
                                specificBuff.Chance = Math.max(0, specificBuff.Chance - chanceSubtraction);
                            }
                            stimEffectUpdated = true;
                        }
                        if (effectsAboveZero.includes(specificBuff.BuffType) && specificBuff.Value > 0) {
                            if (this.config.nonLinearSubtraction) {
                                specificBuff.Chance = Math.max(0, specificBuff.Chance * nonLinearSubstraction);
                            }
                            else {
                                specificBuff.Chance = Math.max(0, specificBuff.Chance - chanceSubtraction);
                            }
                            stimEffectUpdated = true;
                        }
                        if (effectsZero.includes(specificBuff.BuffType) && specificBuff.Value === 0) {
                            if (this.config.nonLinearSubtraction) {
                                specificBuff.Chance = Math.max(0, specificBuff.Chance * nonLinearSubstraction);
                            }
                            else {
                                specificBuff.Chance = Math.max(0, specificBuff.Chance - chanceSubtraction);
                            }
                            stimEffectUpdated = true;
                        }
                        if (specificBuff.BuffType === "SkillRate" && specificBuff.SkillName === "Strength" && specificBuff.Value > this.config.maxStrenghtBuffPossible) {
                            specificBuff.Value = this.config.maxStrenghtBuffPossible;
                            stimEffectUpdated = true;
                        }
                        if (specificBuff.BuffType === "SkillRate" && specificBuff.SkillName === "Endurance" && specificBuff.Value > this.config.maxEnduranceBuffPossible) {
                            specificBuff.Value = this.config.maxEnduranceBuffPossible;
                            stimEffectUpdated = true;
                        }
                        if (specificBuff.BuffType === "SkillRate" && specificBuff.SkillName === "Metabolism" && specificBuff.Value > this.config.maxMetabolismBuffPossible) {
                            specificBuff.Value = this.config.maxEnduranceBuffPossible;
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
function obdolbosOverwrite(buffs) {
    buffs.length = 0;
    buffs.push({
        "BuffType": "StaminaRate",
        "Chance": 1,
        "Delay": 1,
        "Duration": 1800,
        "Value": 0.5,
        "AbsoluteValue": true,
        "SkillName": ""
    }, {
        "BuffType": "SkillRate",
        "Chance": 1,
        "Delay": 1,
        "Duration": 1800,
        "Value": 10,
        "AbsoluteValue": true,
        "SkillName": "Endurance"
    }, {
        "BuffType": "SkillRate",
        "Chance": 1,
        "Delay": 1,
        "Duration": 1800,
        "Value": 10,
        "AbsoluteValue": true,
        "SkillName": "Strength"
    }, {
        "BuffType": "SkillRate",
        "Chance": 1,
        "Delay": 1,
        "Duration": 1800,
        "Value": 20,
        "AbsoluteValue": true,
        "SkillName": "StressResistance"
    }, {
        "BuffType": "SkillRate",
        "Chance": 1,
        "Delay": 1,
        "Duration": 1800,
        "Value": 20,
        "AbsoluteValue": true,
        "SkillName": "Charisma"
    }, {
        "BuffType": "SkillRate",
        "Chance": 1,
        "Delay": 1,
        "Duration": 1800,
        "Value": -20,
        "AbsoluteValue": true,
        "SkillName": "Memory"
    }, {
        "BuffType": "SkillRate",
        "Chance": 1,
        "Delay": 1,
        "Duration": 1800,
        "Value": -20,
        "AbsoluteValue": true,
        "SkillName": "Intellect"
    }, {
        "BuffType": "SkillRate",
        "Chance": 1,
        "Delay": 1,
        "Duration": 1800,
        "Value": -20,
        "AbsoluteValue": true,
        "SkillName": "Attention"
    }, {
        "BuffType": "Pain",
        "Chance": 0.25,
        "Delay": 1,
        "Duration": 1800,
        "Value": 0,
        "AbsoluteValue": false,
        "SkillName": ""
    }, {
        "BuffType": "StomachBloodloss",
        "Chance": 0.25,
        "Delay": 1,
        "Duration": 1800,
        "Value": 0,
        "AbsoluteValue": false,
        "SkillName": ""
    }, {
        "BuffType": "HydrationRate",
        "Chance": 0.25,
        "Delay": 1,
        "Duration": 1800,
        "Value": -0.05,
        "AbsoluteValue": true,
        "SkillName": ""
    }, {
        "BuffType": "EnergyRate",
        "Chance": 0.25,
        "Delay": 1,
        "Duration": 1800,
        "Value": -0.05,
        "AbsoluteValue": true,
        "SkillName": ""
    }, {
        "BuffType": "DamageModifier",
        "Chance": 0.25,
        "Delay": 1,
        "Duration": 1800,
        "Value": 0.2,
        "AbsoluteValue": false,
        "SkillName": ""
    }, {
        "BuffType": "QuantumTunnelling",
        "Chance": 0.25,
        "Delay": 1,
        "Duration": 1800,
        "Value": 0,
        "AbsoluteValue": false,
        "SkillName": ""
    });
}
function meldoninOverwrite(buffs) {
    buffs.length = 0;
    buffs.push({
        "BuffType": "DamageModifier",
        "Chance": 1,
        "Delay": 1,
        "Duration": 900,
        "Value": -0.1,
        "AbsoluteValue": false,
        "SkillName": ""
    }, {
        "AbsoluteValue": true,
        "BuffType": "SkillRate",
        "Chance": 1,
        "Delay": 1,
        "Duration": 900,
        "SkillName": "Strength",
        "Value": 10
    }, {
        "AbsoluteValue": true,
        "BuffType": "SkillRate",
        "Chance": 1,
        "Delay": 1,
        "Duration": 900,
        "SkillName": "Endurance",
        "Value": 20
    }, {
        "AbsoluteValue": true,
        "BuffType": "StaminaRate",
        "Chance": 1,
        "Delay": 1,
        "Duration": 900,
        "SkillName": "",
        "Value": 0.5
    }, {
        "AbsoluteValue": true,
        "BuffType": "HydrationRate",
        "Chance": 1,
        "Delay": 30,
        "Duration": 900,
        "SkillName": "",
        "Value": -0.1
    }, {
        "AbsoluteValue": true,
        "BuffType": "EnergyRate",
        "Chance": 1,
        "Delay": 30,
        "Duration": 900,
        "SkillName": "",
        "Value": -0.1
    });
}
module.exports = { mod: new NegativeEffectsChance() };
