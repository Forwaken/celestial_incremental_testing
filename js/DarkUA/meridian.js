const MERIDIANS = {
    0: {
        name: "Hara",
        exponential: true,
        base: [new Decimal(1000)],
        scale: [new Decimal(10)],
        resource() {return [player.mse.ki]},
        resourceName: ["Ki"],
        effect() {return [
            Decimal.pow(1.5, player.mme.meridian[0].level),
            Decimal.pow(1.01, player.mme.meridian[0].level),
        ]},
        effectDisplay() {
            let eff = this.effect()
            return "x" + formatSimple(eff[0]) + " Source Energy<small> [Next: x" + formatSimple(Decimal.pow(1.5, player.mme.meridian[0].level.add(player.mme.meridian[0].gain))) + "]</small>" +
            "<br>^" + formatSimple(eff[1], 3) + " Ki<small> [Next: ^" + formatSimple(Decimal.pow(1.01, player.mme.meridian[0].level.add(player.mme.meridian[0].gain)), 3) + "]</small>"
        },
        mBase: new Decimal(1),
        mScale: new Decimal(10), // mult increase per
        reset() {
            player.mse.ki = new Decimal(0)
            player.mse.kiPerSec = new Decimal(0)
            for (let i = 1; i < 21; i++) {player.mme.meridian[i].level = new Decimal(0); player.mme.meridian[i].gain = new Decimal(0)}
        },
    },
    1: {
        name: "Lung Point",
        base: [new Decimal(1)],
        scale: [new Decimal(1.5)],
        resource() {return [player.mse.ki]},
        resourceName: ["Ki"],
        effect() {return player.mme.meridian[1].level.pow(1.1).div(3).add(1)},
        effectDisplay() {return "x" + formatSimple(this.effect(), 2) + " Ki<small> [Next: x" + formatSimple(player.mme.meridian[1].level.add(player.mme.meridian[1].gain).pow(1.1).div(3).add(1), 2) + "]"},
        mBase: new Decimal(0.1),
        mScale: new Decimal(1.1),
        reset() {
            player.mse.ki = new Decimal(0)
            player.mse.kiPerSec = new Decimal(0)
        },
    },
    2: {
        name: "Heart Point",
        base: [new Decimal(3)],
        scale: [new Decimal(1.45)],
        resource() {return [player.mme.meridian[1].level]},
        resourceName: ["Lu:P Levels"],
        effect() {return player.mme.meridian[2].level.pow(1.12).div(2).add(1)},
        effectDisplay() {return "x" + formatSimple(this.effect(), 2) + " Ki<small> [Next: x" + formatSimple(player.mme.meridian[2].level.add(player.mme.meridian[2].gain).pow(1.12).div(2).add(1), 2) + "]"},
        mBase: new Decimal(0.2),
        mScale: new Decimal(1.12), // mult increase per magnitude
        reset() {
            player.mse.ki = new Decimal(0)
            player.mse.kiPerSec = new Decimal(0)
            player.mme.meridian[1].level = new Decimal(0)
            player.mme.meridian[1].gain = new Decimal(0)
        },
    },
    3: {
        name: "Yang Linking Vessel",
        base: [new Decimal(10)],
        scale: [new Decimal(2.5)],
        resource() {return [player.mme.meridian[2].level]},
        resourceName: ["He:P Levels"],
        effect() {return player.mme.meridian[3].level.div(20).add(1)},
        effectDisplay() {return "/" + formatSimple(this.effect(), 2) + " Meridian Penalty<small> [Next: /" + formatSimple(player.mme.meridian[3].level.add(player.mme.meridian[3].gain).div(20).add(1), 2) + "]"},
        mBase: new Decimal(0.1),
        mScale: new Decimal(1.15), // mult increase per magnitude
        reset() {
            player.mse.ki = new Decimal(0)
            player.mse.kiPerSec = new Decimal(0)
            for (let i = 1; i < 3; i++) {player.mme.meridian[i].level = new Decimal(0); player.mme.meridian[i].gain = new Decimal(0)}
        },
    },
    4: {
        name: "Yang Heel Vessel",
        exponential: true,
        base: [new Decimal(27)],
        scale: [new Decimal(3)],
        resource() {return [player.mme.meridian[3].level]},
        resourceName: ["YaL:V Levels"],
        effect() {return player.mme.meridian[4].level.div(50).add(1)},
        effectDisplay() {return "/" + formatSimple(this.effect(), 2) + " Meridian Reqs<small> [Next: /" + formatSimple(player.mme.meridian[4].level.add(player.mme.meridian[4].gain).div(50).add(1), 2) + "]"},
        mBase: new Decimal(3),
        mScale: new Decimal(1.5), // mult increase per magnitude
        reset() {
            player.mse.ki = new Decimal(0)
            player.mse.kiPerSec = new Decimal(0)
            for (let i = 1; i < 4; i++) {player.mme.meridian[i].level = new Decimal(0); player.mme.meridian[i].gain = new Decimal(0)}
        },
    },
    5: {
        name: "Pericardium Point",
        base: [new Decimal(100)],
        scale: [new Decimal(1.6)],
        resource() {return [player.mse.ki]},
        resourceName: ["Ki"],
        effect() {return player.mme.meridian[5].level.pow(1.08).div(4).add(1)},
        effectDisplay() {return "x" + formatSimple(this.effect(), 2) + " Ki<small> [Next: x" + formatSimple(player.mme.meridian[5].level.add(player.mme.meridian[5].gain).pow(1.08).div(4).add(1), 2) + "]"},
        mBase: new Decimal(0.15),
        mScale: new Decimal(1.08), // mult increase per magnitude
        reset() {
            player.mse.ki = new Decimal(0)
            player.mse.kiPerSec = new Decimal(0)
        },
    },
    6: {
        name: "Triple Burner Point",
        base: [new Decimal(6), new Decimal(4)],
        scale: [new Decimal(1.45), new Decimal(1.5)],
        resource() {return [player.mme.meridian[2].level, player.mme.meridian[5].level]},
        resourceName: ["He:P Levels", "Pe:P Levels"],
        effect() {return player.mme.meridian[6].level.pow(1.14).div(1.5).add(1)},
        effectDisplay() {return "x" + formatSimple(this.effect(), 2) + " Ki<small> [Next: x" + formatSimple(player.mme.meridian[6].level.add(player.mme.meridian[6].gain).pow(1.14).div(1.5).add(1), 2) + "]"},
        mBase: new Decimal(0.3),
        mScale: new Decimal(1.14), // mult increase per magnitude
        reset() {
            player.mse.ki = new Decimal(0)
            player.mse.kiPerSec = new Decimal(0)
            for (let i = 1; i < 6; i++) {
                if (i == 3 || i == 4) continue
                player.mme.meridian[i].level = new Decimal(0); player.mme.meridian[i].gain = new Decimal(0)
            }
        },
    },
    7: {
        name: "Penetrating Vessel",
        base: [new Decimal(27)],
        scale: [new Decimal(3)],
        resource() {return [player.mme.meridian[6].level]},
        resourceName: ["TB:P Levels"],
        mBase: new Decimal(0.1),
        mScale: new Decimal(1.15), // mult increase per magnitude
        reset() {
            player.mse.ki = new Decimal(0)
            player.mse.kiPerSec = new Decimal(0)
            for (let i = 1; i < 7; i++) {
                if (i == 3 || i == 4) continue
                player.mme.meridian[i].level = new Decimal(0); player.mme.meridian[i].gain = new Decimal(0)
            }
        },
    },
    8: {
        name: "Girdle Vessel",
        base: [new Decimal(9), new Decimal(18)],
        scale: [new Decimal(2.4), new Decimal(1.8)],
        resource() {return [player.mme.meridian[7].level, player.mme.meridian[9].level]},
        resourceName: ["Pe:V Levels", "SI:P Levels"],
        mBase: new Decimal(0.1),
        mScale: new Decimal(1.2), // mult increase per magnitude
        reset() {
            player.mse.ki = new Decimal(0)
            player.mse.kiPerSec = new Decimal(0)
            for (let i = 1; i < 10; i++) {
                if (i == 3 || i == 4 || i == 8) continue
                player.mme.meridian[i].level = new Decimal(0); player.mme.meridian[i].gain = new Decimal(0)
            }
        },
    },
    9: {
        name: "Small Intestine Point",
        base: [new Decimal(9)],
        scale: [new Decimal(1.4)],
        resource() {return [player.mme.meridian[6].level]},
        resourceName: ["TB:P Levels"],
        effect() {return player.mme.meridian[9].level.pow(1.16).add(1)},
        effectDisplay() {return "x" + formatSimple(this.effect(), 2) + " Ki<small> [Next: x" + formatSimple(player.mme.meridian[9].level.add(player.mme.meridian[9].gain).pow(1.16).add(1), 2) + "]"},
        mBase: new Decimal(0.4),
        mScale: new Decimal(1.16), // mult increase per magnitude
        reset() {
            player.mse.ki = new Decimal(0)
            player.mse.kiPerSec = new Decimal(0)
            for (let i = 1; i < 7; i++) {
                if (i == 3 || i == 4) continue
                player.mme.meridian[i].level = new Decimal(0); player.mme.meridian[i].gain = new Decimal(0)
            }
        },
    },
    10: {
        name: "Large Intestine Point",
        base: [new Decimal(12)],
        scale: [new Decimal(1.37)],
        resource() {return [player.mme.meridian[9].level]},
        resourceName: ["SI:P Levels"],
        effect() {return player.mme.meridian[10].level.pow(1.18).mul(1.3).add(1)},
        effectDisplay() {return "x" + formatSimple(this.effect(), 2) + " Ki<small> [Next: x" + formatSimple(player.mme.meridian[10].level.add(player.mme.meridian[10].gain).pow(1.18).mul(1.3).add(1), 2) + "]"},
        mBase: new Decimal(0.45),
        mScale: new Decimal(1.18), // mult increase per magnitude
        reset() {
            player.mse.ki = new Decimal(0)
            player.mse.kiPerSec = new Decimal(0)
            for (let i = 1; i < 10; i++) {
                if (i == 3 || i == 4 || i == 7 || i == 8) continue
                player.mme.meridian[i].level = new Decimal(0); player.mme.meridian[i].gain = new Decimal(0)
            }
        },
    },
    11: {
        name: "Spleen Point",
        base: [new Decimal(15)],
        scale: [new Decimal(1.38)],
        resource() {return [player.mme.meridian[9].level]},
        resourceName: ["SI:P Levels"],
        effect() {return player.mme.meridian[11].level.pow(1.2).mul(1.6).add(1)},
        effectDisplay() {return "x" + formatSimple(this.effect(), 2) + " Ki<small> [Next: x" + formatSimple(player.mme.meridian[11].level.add(player.mme.meridian[11].gain).pow(1.2).mul(1.6).add(1), 2) + "]"},
        mBase: new Decimal(0.5),
        mScale: new Decimal(1.2), // mult increase per magnitude
        reset() {
            player.mse.ki = new Decimal(0)
            player.mse.kiPerSec = new Decimal(0)
            for (let i = 1; i < 10; i++) {
                if (i == 3 || i == 4 || i == 7 || i == 8) continue
                player.mme.meridian[i].level = new Decimal(0); player.mme.meridian[i].gain = new Decimal(0)
            }
        },
    },
    12: {
        name: "Kidney Point",
        base: [new Decimal(1e10)],
        scale: [new Decimal(2)],
        resource() {return [player.mse.ki]},
        resourceName: ["Ki"],
        effect() {return player.mme.meridian[12].level.pow(1.06).div(5).add(1)},
        effectDisplay() {return "x" + formatSimple(this.effect(), 2) + " Ki<small> [Next: x" + formatSimple(player.mme.meridian[9].level.add(player.mme.meridian[9].gain).pow(1.06).div(5).add(1), 2) + "]"},
        mBase: new Decimal(0.5),
        mScale: new Decimal(1.06), // mult increase per magnitude
        reset() {
            player.mse.ki = new Decimal(0)
            player.mse.kiPerSec = new Decimal(0)
        },
    },
    13: {
        name: "Liver Point",
        base: [new Decimal(25), new Decimal(20), new Decimal(100)],
        scale: [new Decimal(1.5), new Decimal(1.5), new Decimal(2.5)],
        resource() {return [player.mme.meridian[10].level, player.mme.meridian[11].level, player.mme.meridian[12].level]},
        resourceName: ["LI:P Levels", "Sp:P Levels", "Kd:P Levels"],
        effect() {return player.mme.meridian[11].level.pow(1.22).mul(2).add(1)},
        effectDisplay() {return "x" + formatSimple(this.effect(), 2) + " Ki<small> [Next: x" + formatSimple(player.mme.meridian[9].level.add(player.mme.meridian[9].gain).pow(1.22).mul(2).add(1), 2) + "]"},
        mBase: new Decimal(0.6),
        mScale: new Decimal(1.22), // mult increase per magnitude
    },
    14: {
        name: "Yin Linking Vessel",
        base: [new Decimal(1)],
        scale: [new Decimal(1.6)],
        resource() {return [player.mme.meridian[11].level]},
        resourceName: ["Sp:P Levels"],
        mBase: new Decimal(0.1),
        mScale: new Decimal(2), // mult increase per magnitude
    },
    15: {
        name: "Yin Heel Vessel",
        base: [new Decimal(1)],
        scale: [new Decimal(1.6)],
        resource() {return [player.mme.meridian[14].level]},
        resourceName: ["YiL:V Levels"],
        mBase: new Decimal(0.1),
        mScale: new Decimal(2.5), // mult increase per magnitude
    },
    16: {
        name: "Gall Bladder Point",
        base: [new Decimal(1)],
        scale: [new Decimal(1.6)],
        resource() {return [player.mme.meridian[13].level]},
        resourceName: ["Lr:P Levels"],
        mBase: new Decimal(0.1),
        mScale: new Decimal(1.3), // mult increase per magnitude
    },
    17: {
        name: "Conception Vessel",
        base: [new Decimal(1)],
        scale: [new Decimal(1.6)],
        resource() {return [player.mme.meridian[16].level]},
        resourceName: ["GB:P Levels"],
        mBase: new Decimal(0.1),
        mScale: new Decimal(1.3), // mult increase per magnitude
    },
    18: {
        name: "Urinary Bladder Point",
        base: [new Decimal(1)],
        scale: [new Decimal(1.6)],
        resource() {return [player.mme.meridian[16].level]},
        resourceName: ["GB:P Levels"],
        mBase: new Decimal(0.1),
        mScale: new Decimal(1.3), // mult increase per magnitude
    },
    19: {
        name: "Governing Vessel",
        base: [new Decimal(1)],
        scale: [new Decimal(1.6)],
        resource() {return [player.mme.meridian[18].level]},
        resourceName: ["UB:P Levels"],
        mBase: new Decimal(0.1),
        mScale: new Decimal(1.3), // mult increase per magnitude
    },
    20: {
        name: "Stomach Point",
        base: [new Decimal(1)],
        scale: [new Decimal(1.6)],
        resource() {return [player.mme.meridian[18].level]},
        resourceName: ["UB:P Levels"],
        mBase: new Decimal(0.1),
        mScale: new Decimal(1.3), // mult increase per magnitude
    },
}
addLayer("mme", {
    name: "Meridian", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "ME", // This appears on the layer's node. Default is the id with the first letter capitalized
    universe: "DA",
    row: 1,
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,

        meridian: {
            0: {
                level: new Decimal(0),
                gain: new Decimal(0),
                effect: [new Decimal(1), new Decimal(1)],
            },
            1: {
                level: new Decimal(0),
                gain: new Decimal(0),
                effect: new Decimal(1),
            },
            2: {
                level: new Decimal(0),
                gain: new Decimal(0),
                effect: new Decimal(1),
            },
            3: {
                level: new Decimal(0),
                gain: new Decimal(0),
                effect: new Decimal(1),
            },
            4: {
                level: new Decimal(0),
                gain: new Decimal(0),
                effect: new Decimal(1),
            },
            5: {
                level: new Decimal(0),
                gain: new Decimal(0),
                effect: new Decimal(1),
            },
            6: {
                level: new Decimal(0),
                gain: new Decimal(0),
                effect: new Decimal(1),
            },
            7: {
                level: new Decimal(0),
                gain: new Decimal(0),
                effect: new Decimal(1),
            },
            8: {
                level: new Decimal(0),
                gain: new Decimal(0),
                effect: new Decimal(1),
            },
            9: {
                level: new Decimal(0),
                gain: new Decimal(0),
                effect: new Decimal(1),
            },
            10: {
                level: new Decimal(0),
                gain: new Decimal(0),
                effect: new Decimal(1),
            },
            11: {
                level: new Decimal(0),
                gain: new Decimal(0),
                effect: new Decimal(1),
            },
            12: {
                level: new Decimal(0),
                gain: new Decimal(0),
                effect: new Decimal(1),
            },
            13: {
                level: new Decimal(0),
                gain: new Decimal(0),
                effect: new Decimal(1),
            },
            14: {
                level: new Decimal(0),
                gain: new Decimal(0),
                effect: new Decimal(1),
            },
            15: {
                level: new Decimal(0),
                gain: new Decimal(0),
                effect: new Decimal(1),
            },
            16: {
                level: new Decimal(0),
                gain: new Decimal(0),
                effect: new Decimal(1),
            },
            17: {
                level: new Decimal(0),
                gain: new Decimal(0),
                effect: new Decimal(1),
            },
            18: {
                level: new Decimal(0),
                gain: new Decimal(0),
                effect: new Decimal(1),
            },
            19: {
                level: new Decimal(0),
                gain: new Decimal(0),
                effect: new Decimal(1),
            },
            20: {
                level: new Decimal(0),
                gain: new Decimal(0),
                effect: new Decimal(1),
            },
        },
        meridianDiv: new Decimal(1),
        penaltyDiv: new Decimal(1),
        meridianEffect: new Decimal(1),

        meridianSelect: 0,
    }},
    automate() {},
    nodeStyle() {
        return {
            background: "radial-gradient(#ff77c9, #be6eec)",
            backgroundOrigin: "border-box",
            borderColor: "#4c229f",
            color: "rgba(0,0,0,0.6)",
        };
    },
    tooltip: "Meridian",
    branches: [],
    color: "#be6eec",
    update(delta) {
        let onepersec = new Decimal(1)

        player.mme.meridianDiv = new Decimal(1)
        player.mme.meridianDiv = player.mme.meridianDiv.mul(player.mme.meridian[4].effect)

        player.mme.penaltyDiv = new Decimal(1)
        player.mme.penaltyDiv = player.mme.penaltyDiv.div(player.mme.meridian[3].effect)

        player.mme.meridianEffect = new Decimal(1)
        for (let i = 0; i < 21; i++) {
            let merGains = []
            if (MERIDIANS[i].exponential) {
                for (let j = 0; j < 3; j++) {
                    if (run(MERIDIANS[i].base, MERIDIANS[i])[j]) merGains.push(run(MERIDIANS[i].resource, MERIDIANS[i])[j].max(1).mul(player.mme.meridianDiv).div(run(MERIDIANS[i].base, MERIDIANS[i])[j]).ln().div(run(MERIDIANS[i].scale, MERIDIANS[i])[j].max(1).ln()).add(1).sub(player.mme.meridian[i].level).max(0))
                }
            } else {
                for (let j = 0; j < 3; j++) {
                    if (run(MERIDIANS[i].base, MERIDIANS[i])[j]) merGains.push(layers.h.hexGain(run(MERIDIANS[i].resource, MERIDIANS[i])[j], run(MERIDIANS[i].base, MERIDIANS[i])[j], run(MERIDIANS[i].scale, MERIDIANS[i])[j], player.mme.meridianDiv).sub(player.mme.meridian[i].level).max(0))
                }
            }
            for (let k = 0; k < merGains.length; ) {
                if (k == 0) {k++; continue}
                if (merGains[k].gte(merGains[k-1])) merGains.splice(k, 1)
                else merGains.splice(k-1, 1)
            }
            player.mme.meridian[i].gain = merGains[0].floor()
            if (MERIDIANS[i].effect) player.mme.meridian[i].effect = run(MERIDIANS[i].effect, MERIDIANS[i])
            if (i > 0)player.mme.meridianEffect = player.mme.meridianEffect.mul(Decimal.pow(1.05, player.mme.meridian[i].level.add(1).log(10)))
        }
    },
    levelup(index) {
        if (MERIDIANS[index].exponential) {
            player.mse.miasma = player.mse.miasma.add(Decimal.sumGeometricSeries(player.mme.meridian[index].gain.mul(player.mme.meridianDiv), MERIDIANS[index].mBase, MERIDIANS[index].mScale, player.mme.meridian[index].level).div(player.mme.penaltyDiv))
        } else {
            player.mse.miasma = player.mse.miasma.add(player.mme.meridian[index].level.add(player.mme.meridian[index].gain).pow(MERIDIANS[index].mScale).mul(MERIDIANS[index].mBase).sub(player.mme.meridian[index].level.pow(MERIDIANS[index].mScale).mul(MERIDIANS[index].mBase)).div(player.mme.penaltyDiv))
        }
        player.mme.meridian[index].level = player.mme.meridian[index].level.add(player.mme.meridian[index].gain)
        if (!layers.mse.resetCheck() && MERIDIANS[index].reset) MERIDIANS[index].reset()
    },
    tooltipDisplay(index) {
        let str = "Lv." + formatShortWhole(player.mme.meridian[index].level) + " " + MERIDIANS[index].name + " (+" + formatShortWhole(player.mme.meridian[index].gain) + ")<hr>"
        if (MERIDIANS[index].effectDisplay) str = str.concat(run(MERIDIANS[index].effectDisplay, MERIDIANS[index]) + "<hr>")
        str = str.concat("Next Req:")
        if (MERIDIANS[index].exponential) {
            if (MERIDIANS[index].base[0]) str = str.concat(" " + formatSimple(Decimal.pow(MERIDIANS[index].scale[0], player.mme.meridian[index].level.add(player.mme.meridian[index].gain)).mul(MERIDIANS[index].base[0]).div(player.mme.meridianDiv)) + " " + MERIDIANS[index].resourceName[0])
            if (MERIDIANS[index].base[1]) str = str.concat(",<br>" + formatSimple(Decimal.pow(MERIDIANS[index].scale[1], player.mme.meridian[index].level.add(player.mme.meridian[index].gain)).mul(MERIDIANS[index].base[1]).div(player.mme.meridianDiv)) + " " + MERIDIANS[index].resourceName[1])
            if (MERIDIANS[index].base[2]) str = str.concat(",<br>" + formatSimple(Decimal.pow(MERIDIANS[index].scale[2], player.mme.meridian[index].level.add(player.mme.meridian[index].gain)).mul(MERIDIANS[index].base[2]).div(player.mme.meridianDiv)) + " " + MERIDIANS[index].resourceName[2])
        } else {
            if (MERIDIANS[index].base[0]) str = str.concat(" " + formatSimple(layers.h.hexReq(player.mme.meridian[index].level.add(player.mme.meridian[index].gain), MERIDIANS[index].base[0], MERIDIANS[index].scale[0], player.mme.meridianDiv)) + " " + MERIDIANS[index].resourceName[0])
            if (MERIDIANS[index].base[1]) str = str.concat(",<br>" + formatSimple(layers.h.hexReq(player.mme.meridian[index].level.add(player.mme.meridian[index].gain), MERIDIANS[index].base[1], MERIDIANS[index].scale[1], player.mme.meridianDiv)) + " " + MERIDIANS[index].resourceName[1])
            if (MERIDIANS[index].base[2]) str = str.concat(",<br>" + formatSimple(layers.h.hexReq(player.mme.meridian[index].level.add(player.mme.meridian[index].gain), MERIDIANS[index].base[2], MERIDIANS[index].scale[2], player.mme.meridianDiv)) + " " + MERIDIANS[index].resourceName[2])
        }
        if (MERIDIANS[index].exponential) str = str.concat("<br>Penalty: +" + formatSimple(Decimal.sumGeometricSeries(player.mme.meridian[index].gain, MERIDIANS[index].mBase, MERIDIANS[index].mScale, player.mme.meridian[index].level).div(player.mme.penaltyDiv), 2) + " Miasma")
        else str = str.concat("<br>Penalty: +" + formatSimple(player.mme.meridian[index].level.add(player.mme.meridian[index].gain).pow(MERIDIANS[index].mScale).mul(MERIDIANS[index].mBase).sub(player.mme.meridian[index].level.pow(MERIDIANS[index].mScale).mul(MERIDIANS[index].mBase)).div(player.mme.penaltyDiv), 2) + " Miasma")
        return str
    },
    clickables: {
        1: {
            title() {
                if (player.mme.meridianSelect == 0) return "Level Up<br><small>[Resets Ki and Meridians]"
                if (player.mme.meridianSelect == 1 || player.mme.meridianSelect == 5 || player.mme.meridianSelect == 12) return "Level Up<br><small>[Resets Ki]"
                return "Level Up<br><small>[Resets Ki and Previous Branches]"
            },
            canClick() { return player.mme.meridian[player.mme.meridianSelect].gain.gt(0) && player.mse.ki.gt(0) },
            unlocked: true,
            onClick() {
                layers.mme.levelup(player.mme.meridianSelect)
            },
            style() {
                let look = {width: "349px", minHeight: "37px", color: "white", lineHeight: "0.8", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0px", fontSize: '10px'}
                !this.canClick() ? look.backgroundColor = "#361e1e" : look.backgroundColor = "#444"
                return look
            },
        },
        2: {
            title() {return "???"},
            canClick() { return false },
            unlocked: true,
            onClick() {

            },
            style() {
                let look = {width: "348px", minHeight: "37px", color: "white", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0px", fontSize: '12px'}
                true ? look.background = "#111" : !this.canClick() ? look.backgroundColor = "#361e1e" : look.backgroundColor = "#444"
                return look
            },
        },
        3: {
            title() {return player.mme.clickables[3] ? "Gain Highlighting: [ENABLED]" : "Gain Highlighting: [DISABLED]"},
            canClick() { return true },
            unlocked: true,
            onClick() {
                if (player.mme.clickables[3]) {
                    player.mme.clickables[3] = false
                } else {
                    player.mme.clickables[3] = true
                }
            },
            style() {
                let look = {width: "349px", minHeight: "37px", color: "white", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0px 0px 0px 17px"}
                player.mme.clickables[3] ? look.backgroundColor = "#666" : look.backgroundColor = "#444"
                return look
            },
        },
        4: {
            title() {return player.mme.clickables[4] ? "Node Click Leveling: [ENABLED]" : "Node Click Leveling: [DISABLED]"},
            canClick() { return true },
            unlocked: true,
            onClick() {
                if (player.mme.clickables[4]) {
                    player.mme.clickables[4] = false
                } else {
                    player.mme.clickables[4] = true
                }
            },
            style() {
                let look = {width: "348px", minHeight: "37px", color: "white", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "0px 0px 17px 0px"}
                player.mme.clickables[4] ? look.backgroundColor = "#666" : look.backgroundColor = "#444"
                return look
            },
        },
        100: {
            title() {return (Number(player.mme.meridian[0].level)+1) + "%"},
            tooltip() {return layers.mme.tooltipDisplay(0)},
            canClick() {return player.mme.clickables[4] ? player.mme.meridian[0].gain.gt(0) && player.mse.ki.gt(0) : true},
            unlocked: true,
            onClick() {
                if (player.mme.clickables[4]) layers.mme.levelup(0)
                else player.mme.meridianSelect = 0
            },
            style() {
                let look = {position: "absolute", left: "275px", top: "20px", width: "150px", minHeight: "150px", color: "#ccc", fontSize: "30px", textShadow: "0px 2px 0px #000,0px 0px 2px #ccc",
                    background: "radial-gradient(rgba(" + (40+(player.mme.meridian[0].level/1.5)) + "," + (40+Number(player.mme.meridian[0].level)) + "," + (40+Number(player.mme.meridian[0].level)) + "), rgba(" + (60+(player.mme.meridian[0].level/1.5)) + "," + (60+Number(player.mme.meridian[0].level)) + "," + (60+Number(player.mme.meridian[0].level)) + "), rgba(" + (40+(player.mme.meridian[0].level/1.5)) + "," + (40+Number(player.mme.meridian[0].level)) + "," + (40+Number(player.mme.meridian[0].level)) + "))",
                    boxShadow: "0 0 20px #161616", border: "10px solid #161616", borderRadius: "75px"}
                if (player.mme.meridian[0].gain.gt(0) && player.mme.clickables[3]) {look.borderColor = "rgba(" + (80+(player.mme.meridian[0].level/1.5)) + "," + (120+Number(player.mme.meridian[0].level)) + "," + (120+Number(player.mme.meridian[0].level)) + ")"; look.boxShadow = "0 0 20px rgba(" + (80+(player.mme.meridian[0].level/1.5)) + "," + (120+Number(player.mme.meridian[0].level)) + "," + (120+Number(player.mme.meridian[0].level)) + ")"}
                if (!this.canClick()) look.filter = "brightness(0.7)"
                if (!player.mme.clickables[4] && player.mme.meridianSelect == 0) look.outline = "4px solid white"
                return look
            },
        },
        101: {
            title() {return "<div style='height:5px'></div>Lu:P<br><small style='font-size:12px'>Lv" + formatShortWhole(player.mme.meridian[1].level) + "</small>"},
            tooltip() {return layers.mme.tooltipDisplay(1)},
            canClick() {return player.mme.clickables[4] ? player.mme.meridian[1].gain.gt(0) && player.mse.ki.gt(0) : true},
            unlocked: true,
            branches: [[100, "#4d1d1d"]],
            onClick() {
                if (player.mme.clickables[4]) layers.mme.levelup(1)
                else player.mme.meridianSelect = 1
            },
            style() {
                let look = {position: "absolute", left: "170px", top: "40px", width: "80px", minHeight: "80px", color: "#ccc", lineHeight: "10px", fontSize: "15px", textShadow: "0px 1px 0px #000,0px 0px 1px #ccc",
                    background: "radial-gradient(#202a33, #171e24)", boxShadow: "0 0 20px #222", border: "4px solid rgba(0,0,0,0.5)", borderRadius: "50%"}
                if (player.mme.meridian[1].gain.gt(0) && player.mme.clickables[3]) {look.boxShadow = "0 0 15px #888"}
                if (!this.canClick()) look.filter = "brightness(0.7)"
                if (!player.mme.clickables[4] && player.mme.meridianSelect == 1) look.outline = "2px solid white"
                return look
            },
        },
        102: {
            title() {return "<div style='height:5px'></div>He:P<br><small style='font-size:12px'>Lv" + formatShortWhole(player.mme.meridian[2].level) + "</small>"},
            tooltip() {return layers.mme.tooltipDisplay(2)},
            canClick() {return player.mme.clickables[4] ? player.mme.meridian[2].gain.gt(0) && player.mse.ki.gt(0) : true},
            unlocked: true,
            branches: [[101, "#4d1d1d"]],
            onClick() {
                if (player.mme.clickables[4]) layers.mme.levelup(2)
                else player.mme.meridianSelect = 2
            },
            style() {
                let look = {position: "absolute", left: "120px", top: "140px", width: "80px", minHeight: "80px", color: "#ccc", lineHeight: "10px", fontSize: "15px", textShadow: "0px 1px 0px #000,0px 0px 1px #ccc",
                    background: "radial-gradient(#460a00, #2e0600)", boxShadow: "0 0 20px #222", border: "4px solid rgba(0,0,0,0.5)", borderRadius: "50%"}
                if (player.mme.meridian[2].gain.gt(0) && player.mme.clickables[3]) {look.boxShadow = "0 0 15px #888"}
                if (!this.canClick()) look.filter = "brightness(0.7)"
                if (!player.mme.clickables[4] && player.mme.meridianSelect == 2) look.outline = "2px solid white"
                return look
            },
        },
        103: {
            title() {return "<div style='height:5px'></div>YaL:V<br><small style='font-size:10px'>Lv" + formatShortWhole(player.mme.meridian[3].level) + "</small>"},
            tooltip() {return layers.mme.tooltipDisplay(3)},
            canClick() {return player.mme.clickables[4] ? player.mme.meridian[3].gain.gt(0) && player.mse.ki.gt(0) : true},
            unlocked: true,
            branches: [[102, "#4d1d1d", 10]],
            onClick() {
                if (player.mme.clickables[4]) layers.mme.levelup(3)
                else player.mme.meridianSelect = 3
            },
            style() {
                let look = {position: "absolute", left: "30px", top: "220px", width: "70px", minHeight: "70px", color: "#ccc", lineHeight: "8px", fontSize: "11px", textShadow: "0px 1px 0px #000,0px 0px 1px #ccc",
                    background: "linear-gradient(#463a1c, #3b3017)", boxShadow: "0 0 20px #222", border: "4px solid rgba(0,0,0,0.5)", borderRadius: "50%"}
                if (player.mme.meridian[3].gain.gt(0) && player.mme.clickables[3]) {look.boxShadow = "0 0 15px #888"}
                if (!this.canClick()) look.filter = "brightness(0.7)"
                if (!player.mme.clickables[4] && player.mme.meridianSelect == 3) look.outline = "2px solid white"
                return look
            },
        },
        104: {
            title() {return "<div style='height:5px'></div>YaH:V<br><small style='font-size:10px'>Lv" + formatShortWhole(player.mme.meridian[4].level) + "</small>"},
            tooltip() {return layers.mme.tooltipDisplay(4)},
            canClick() {return player.mme.clickables[4] ? player.mme.meridian[4].gain.gt(0) && player.mse.ki.gt(0) : true},
            unlocked: true,
            branches: [[103, "#4d1d1d", 10]],
            onClick() {
                if (player.mme.clickables[4]) layers.mme.levelup(4)
                else player.mme.meridianSelect = 4
            },
            style() {
                let look = {position: "absolute", left: "40px", top: "80px", width: "70px", minHeight: "70px", color: "#ccc", lineHeight: "8px", fontSize: "11px", textShadow: "0px 1px 0px #000,0px 0px 1px #ccc",
                    background: "linear-gradient(#4e411f, #342b15)", boxShadow: "0 0 20px #222", border: "4px solid rgba(0,0,0,0.5)", borderRadius: "50%"}
                if (player.mme.meridian[4].gain.gt(0) && player.mme.clickables[3]) {look.boxShadow = "0 0 15px #888"}
                if (!this.canClick()) look.filter = "brightness(0.7)"
                if (!player.mme.clickables[4] && player.mme.meridianSelect == 4) look.outline = "2px solid white"
                return look
            },
        },
        105: {
            title() {return "<div style='height:5px'></div>Pe:P<br><small style='font-size:12px'>Lv" + formatShortWhole(player.mme.meridian[5].level) + "</small>"},
            tooltip() {return layers.mme.tooltipDisplay(5)},
            canClick() {return player.mme.clickables[4] ? player.mme.meridian[5].gain.gt(0) && player.mse.ki.gt(0) : true},
            unlocked: true,
            branches: [[100, "#4d1d1d"]],
            onClick() {
                if (player.mme.clickables[4]) layers.mme.levelup(5)
                else player.mme.meridianSelect = 5
            },
            style() {
                let look = {position: "absolute", left: "250px", top: "200px", width: "80px", minHeight: "80px", color: "#ccc", lineHeight: "10px", fontSize: "15px", textShadow: "0px 1px 0px #000,0px 0px 1px #ccc",
                    background: "radial-gradient(#4c2600, #331900)", boxShadow: "0 0 20px #222", border: "4px solid rgba(0,0,0,0.5)", borderRadius: "50%"}
                if (player.mme.meridian[5].gain.gt(0) && player.mme.clickables[3]) {look.boxShadow = "0 0 15px #888"}
                if (!this.canClick()) look.filter = "brightness(0.7)"
                if (!player.mme.clickables[4] && player.mme.meridianSelect == 5) look.outline = "2px solid white"
                return look
            },
        },
        106: {
            title() {return "<div style='height:5px'></div>TB:P<br><small style='font-size:12px'>Lv" + formatShortWhole(player.mme.meridian[6].level) + "</small>"},
            tooltip() {return layers.mme.tooltipDisplay(6)},
            canClick() {return player.mme.clickables[4] ? player.mme.meridian[6].gain.gt(0) && player.mse.ki.gt(0) : true},
            unlocked: true,
            branches: [[102, "#4d1d1d"], [105, "#4d1d1d"]],
            onClick() {
                if (player.mme.clickables[4]) layers.mme.levelup(6)
                else player.mme.meridianSelect = 6
            },
            style() {
                let look = {position: "absolute", left: "160px", top: "250px", width: "80px", minHeight: "80px", color: "#ccc", lineHeight: "10px", fontSize: "15px", textShadow: "0px 1px 0px #000,0px 0px 1px #ccc",
                    background: "radial-gradient(#4c2d2d, #331e1e)", boxShadow: "0 0 20px #222", border: "4px solid rgba(0,0,0,0.5)", borderRadius: "50%"}
                if (player.mme.meridian[6].gain.gt(0) && player.mme.clickables[3]) {look.boxShadow = "0 0 15px #888"}
                if (!this.canClick()) look.filter = "brightness(0.7)"
                if (!player.mme.clickables[4] && player.mme.meridianSelect == 6) look.outline = "2px solid white"
                return look
            },
        },
        107: {
            title() {return "<div style='height:5px'></div>Pe:V<br><small style='font-size:10px'>Lv" + formatShortWhole(player.mme.meridian[7].level) + "</small>"},
            tooltip() {return true ? "" : layers.mme.tooltipDisplay(7)},
            canClick() {
                if (true) return false
                else if (player.mme.clickables[4]) return player.mme.meridian[7].gain.gt(0) && player.mse.ki.gt(0)
                else return true
            },
            unlocked: true,
            branches: [[106, "#4d1d1d", 10]],
            onClick() {
                if (player.mme.clickables[4]) layers.mme.levelup(7)
                else player.mme.meridianSelect = 7
            },
            style() {
                let look = {position: "absolute", left: "60px", top: "320px", width: "70px", minHeight: "70px", color: "#ccc", lineHeight: "8px", fontSize: "13px", textShadow: "0px 1px 0px #000,0px 0px 1px #ccc",
                    background: "linear-gradient(#413933, #2b2622)", boxShadow: "0 0 20px #222", border: "4px solid rgba(0,0,0,0.5)", borderRadius: "50%"}
                if (player.mme.meridian[7].gain.gt(0) && player.mme.clickables[3]) {look.boxShadow = "0 0 15px #888"}
                if (true) look.filter = "brightness(0.3)"
                else if (!this.canClick()) look.filter = "brightness(0.7)"
                if (!player.mme.clickables[4] && player.mme.meridianSelect == 7) look.outline = "2px solid white"
                return look
            },
        },
        108: {
            title() {return "<div style='height:5px'></div>Gi:V<br><small style='font-size:10px'>Lv" + formatShortWhole(player.mme.meridian[8].level) + "</small>"},
            tooltip() {return true ? "" : layers.mme.tooltipDisplay(8)},
            canClick() {
                if (true) return false
                else if (player.mme.clickables[4]) return player.mme.meridian[8].gain.gt(0) && player.mse.ki.gt(0)
                else return true
            },
            unlocked: true,
            branches: [[107, "#4d1d1d", 10], [109, "#4d1d1d", 10]],
            onClick() {
                if (player.mme.clickables[4]) layers.mme.levelup(8)
                else player.mme.meridianSelect = 8
            },
            style() {
                let look = {position: "absolute", left: "100px", top: "450px", width: "70px", minHeight: "70px", color: "#ccc", lineHeight: "8px", fontSize: "13px", textShadow: "0px 1px 0px #000,0px 0px 1px #ccc",
                    background: "linear-gradient(#4b392c, #3c2d23)", boxShadow: "0 0 20px #222", border: "4px solid rgba(0,0,0,0.5)", borderRadius: "50%"}
                if (player.mme.meridian[8].gain.gt(0) && player.mme.clickables[3]) {look.boxShadow = "0 0 15px #888"}
                if (true) look.filter = "brightness(0.3)"
                else if (!this.canClick()) look.filter = "brightness(0.7)"
                if (!player.mme.clickables[4] && player.mme.meridianSelect == 8) look.outline = "2px solid white"
                return look
            },
        },
        109: {
            title() {return "<div style='height:5px'></div>SI:P<br><small style='font-size:12px'>Lv" + formatShortWhole(player.mme.meridian[9].level) + "</small>"},
            tooltip() {return true ? "" : layers.mme.tooltipDisplay(9)},
            canClick() {
                if (true) return false
                else if (player.mme.clickables[4]) return player.mme.meridian[9].gain.gt(0) && player.mse.ki.gt(0)
                else return true
            },
            unlocked: true,
            branches: [[106, "#4d1d1d"]],
            onClick() {
                if (player.mme.clickables[4]) layers.mme.levelup(9)
                else player.mme.meridianSelect = 9
            },
            style() {
                let look = {position: "absolute", left: "180px", top: "360px", width: "80px", minHeight: "80px", color: "#ccc", lineHeight: "10px", fontSize: "15px", textShadow: "0px 1px 0px #000,0px 0px 1px #ccc",
                    background: "radial-gradient(#493741, #30242b)", boxShadow: "0 0 20px #222", border: "4px solid rgba(0,0,0,0.5)", borderRadius: "50%"}
                if (player.mme.meridian[9].gain.gt(0) && player.mme.clickables[3]) {look.boxShadow = "0 0 15px #888"}
                if (true) look.filter = "brightness(0.3)"
                else if (!this.canClick()) look.filter = "brightness(0.7)"
                if (!player.mme.clickables[4] && player.mme.meridianSelect == 9) look.outline = "2px solid white"
                return look
            },
        },
        110: {
            title() {return "<div style='height:5px'></div>LI:P<br><small style='font-size:12px'>Lv" + formatShortWhole(player.mme.meridian[10].level) + "</small>"},
            tooltip() {return true ? "" : layers.mme.tooltipDisplay(10)},
            canClick() {
                if (true) return false
                else if (player.mme.clickables[4]) return player.mme.meridian[10].gain.gt(0) && player.mse.ki.gt(0)
                else return true
            },
            unlocked: true,
            branches: [[109, "#4d1d1d"]],
            onClick() {
                if (player.mme.clickables[4]) layers.mme.levelup(10)
                else player.mme.meridianSelect = 10
            },
            style() {
                let look = {position: "absolute", left: "280px", top: "300px", width: "80px", minHeight: "80px", color: "#ccc", lineHeight: "10px", fontSize: "15px", textShadow: "0px 1px 0px #000,0px 0px 1px #ccc",
                    background: "radial-gradient(#484341, #363231)", boxShadow: "0 0 20px #222", border: "4px solid rgba(0,0,0,0.5)", borderRadius: "50%"}
                if (player.mme.meridian[10].gain.gt(0) && player.mme.clickables[3]) {look.boxShadow = "0 0 15px #888"}
                if (true) look.filter = "brightness(0.3)"
                else if (!this.canClick()) look.filter = "brightness(0.7)"
                if (!player.mme.clickables[4] && player.mme.meridianSelect == 10) look.outline = "2px solid white"
                return look
            },
        },
        111: {
            title() {return "<div style='height:5px'></div>Sp:P<br><small style='font-size:12px'>Lv" + formatShortWhole(player.mme.meridian[11].level) + "</small>"},
            tooltip() {return true ? "" : layers.mme.tooltipDisplay(11)},
            canClick() {
                if (true) return false
                else if (player.mme.clickables[4]) return player.mme.meridian[11].gain.gt(0) && player.mse.ki.gt(0)
                else return true
            },
            unlocked: true,
            branches: [[109, "#4d1d1d"]],
            onClick() {
                if (player.mme.clickables[4]) layers.mme.levelup(11)
                else player.mme.meridianSelect = 11
            },
            style() {
                let look = {position: "absolute", left: "300px", top: "400px", width: "80px", minHeight: "80px", color: "#ccc", lineHeight: "10px", fontSize: "15px", textShadow: "0px 1px 0px #000,0px 0px 1px #ccc",
                    background: "radial-gradient(#4c332a, #39261f)", boxShadow: "0 0 20px #222", border: "4px solid rgba(0,0,0,0.5)", borderRadius: "50%"}
                if (player.mme.meridian[11].gain.gt(0) && player.mme.clickables[3]) {look.boxShadow = "0 0 15px #888"}
                if (true) look.filter = "brightness(0.3)"
                else if (!this.canClick()) look.filter = "brightness(0.7)"
                if (!player.mme.clickables[4] && player.mme.meridianSelect == 11) look.outline = "2px solid white"
                return look
            },
        },
        112: {
            title() {return "<div style='height:5px'></div>Kd:P<br><small style='font-size:12px'>Lv" + formatShortWhole(player.mme.meridian[12].level) + "</small>"},
            tooltip() {return true ? "" : layers.mme.tooltipDisplay(12)},
            canClick() {
                if (true) return false
                else if (player.mme.clickables[4]) return player.mme.meridian[12].gain.gt(0) && player.mse.ki.gt(0)
                else return true
            },
            unlocked: true,
            branches: [[100, "#4d1d1d"]],
            onClick() {
                if (player.mme.clickables[4]) layers.mme.levelup(12)
                else player.mme.meridianSelect = 12
            },
            style() {
                let look = {position: "absolute", left: "380px", top: "190px", width: "80px", minHeight: "80px", color: "#ccc", lineHeight: "10px", fontSize: "15px", textShadow: "0px 1px 0px #000,0px 0px 1px #ccc",
                    background: "radial-gradient(#2c3a5c, #161d2e)", boxShadow: "0 0 20px #222", border: "4px solid rgba(0,0,0,0.5)", borderRadius: "50%"}
                if (player.mme.meridian[12].gain.gt(0) && player.mme.clickables[3]) {look.boxShadow = "0 0 15px #888"}
                if (true) look.filter = "brightness(0.3)"
                else if (!this.canClick()) look.filter = "brightness(0.7)"
                if (!player.mme.clickables[4] && player.mme.meridianSelect == 12) look.outline = "2px solid white"
                return look
            },
        },
        113: {
            title() {return "<div style='height:5px'></div>Lr:P<br><small style='font-size:12px'>Lv" + formatShortWhole(player.mme.meridian[13].level) + "</small>"},
            tooltip() {return true ? "" : layers.mme.tooltipDisplay(13)},
            canClick() {
                if (true) return false
                else if (player.mme.clickables[4]) return player.mme.meridian[13].gain.gt(0) && player.mse.ki.gt(0)
                else return true
            },
            unlocked: true,
            branches: [[110, "#4d1d1d"], [111, "#4d1d1d"], [112, "#4d1d1d"]],
            onClick() {
                if (player.mme.clickables[4]) layers.mme.levelup(13)
                else player.mme.meridianSelect = 13
            },
            style() {
                let look = {position: "absolute", left: "390px", top: "310px", width: "80px", minHeight: "80px", color: "#ccc", lineHeight: "10px", fontSize: "15px", textShadow: "0px 1px 0px #000,0px 0px 1px #ccc",
                    background: "radial-gradient(#36441e, #283316)", boxShadow: "0 0 20px #222", border: "4px solid rgba(0,0,0,0.5)", borderRadius: "50%"}
                if (player.mme.meridian[13].gain.gt(0) && player.mme.clickables[3]) {look.boxShadow = "0 0 15px #888"}
                if (true) look.filter = "brightness(0.3)"
                else if (!this.canClick()) look.filter = "brightness(0.7)"
                if (!player.mme.clickables[4] && player.mme.meridianSelect == 13) look.outline = "2px solid white"
                return look
            },
        },
        114: {
            title() {return "<div style='height:5px'></div>YiL:V<br><small style='font-size:10px'>Lv" + formatShortWhole(player.mme.meridian[14].level) + "</small>"},
            tooltip() {return true ? "" : layers.mme.tooltipDisplay(14)},
            canClick() {
                if (true) return false
                else if (player.mme.clickables[4]) return player.mme.meridian[14].gain.gt(0) && player.mse.ki.gt(0)
                else return true
            },
            unlocked: true,
            branches: [[111, "#4d1d1d", 10]],
            onClick() {
                if (player.mme.clickables[4]) layers.mme.levelup(14)
                else player.mme.meridianSelect = 14
            },
            style() {
                let look = {position: "absolute", left: "420px", top: "420px", width: "70px", minHeight: "70px", color: "#ccc", lineHeight: "8px", fontSize: "11px", textShadow: "0px 1px 0px #000,0px 0px 1px #ccc",
                    background: "linear-gradient(#491c74, #360f5a)", boxShadow: "0 0 20px #222", border: "4px solid rgba(0,0,0,0.5)", borderRadius: "50%"}
                if (player.mme.meridian[14].gain.gt(0) && player.mme.clickables[3]) {look.boxShadow = "0 0 15px #888"}
                if (true) look.filter = "brightness(0.3)"
                else if (!this.canClick()) look.filter = "brightness(0.7)"
                if (!player.mme.clickables[4] && player.mme.meridianSelect == 14) look.outline = "2px solid white"
                return look
            },
        },
        115: {
            title() {return "<div style='height:5px'></div>YiH:V<br><small style='font-size:10px'>Lv" + formatShortWhole(player.mme.meridian[15].level) + "</small>"},
            tooltip() {return true ? "" : layers.mme.tooltipDisplay(15)},
            canClick() {
                if (true) return false
                else if (player.mme.clickables[4]) return player.mme.meridian[15].gain.gt(0) && player.mse.ki.gt(0)
                else return true
            },
            unlocked: true,
            branches: [[114, "#4d1d1d", 10]],
            onClick() {
                if (player.mme.clickables[4]) layers.mme.levelup(15)
                else player.mme.meridianSelect = 15
            },
            style() {
                let look = {position: "absolute", left: "530px", top: "410px", width: "70px", minHeight: "70px", color: "#ccc", lineHeight: "8px", fontSize: "11px", textShadow: "0px 1px 0px #000,0px 0px 1px #ccc",
                    background: "linear-gradient(#402d4c, #2b1e33)", boxShadow: "0 0 20px #222", border: "4px solid rgba(0,0,0,0.5)", borderRadius: "50%"}
                if (player.mme.meridian[15].gain.gt(0) && player.mme.clickables[3]) {look.boxShadow = "0 0 15px #888"}
                if (true) look.filter = "brightness(0.3)"
                else if (!this.canClick()) look.filter = "brightness(0.7)"
                if (!player.mme.clickables[4] && player.mme.meridianSelect == 15) look.outline = "2px solid white"
                return look
            },
        },
        116: {
            title() {return "<div style='height:5px'></div>GB:P<br><small style='font-size:12px'>Lv" + formatShortWhole(player.mme.meridian[16].level) + "</small>"},
            tooltip() {return true ? "" : layers.mme.tooltipDisplay(16)},
            canClick() {
                if (true) return false
                else if (player.mme.clickables[4]) return player.mme.meridian[16].gain.gt(0) && player.mse.ki.gt(0)
                else return true
            },
            unlocked: true,
            branches: [[113, "#4d1d1d"]],
            onClick() {
                if (player.mme.clickables[4]) layers.mme.levelup(16)
                else player.mme.meridianSelect = 16
            },
            style() {
                let look = {position: "absolute", left: "500px", top: "250px", width: "80px", minHeight: "80px", color: "#ccc", lineHeight: "10px", fontSize: "15px", textShadow: "0px 1px 0px #000,0px 0px 1px #ccc",
                    background: "radial-gradient(#114422, #0d361b)", boxShadow: "0 0 20px #222", border: "4px solid rgba(0,0,0,0.5)", borderRadius: "50%"}
                if (player.mme.meridian[16].gain.gt(0) && player.mme.clickables[3]) {look.boxShadow = "0 0 15px #888"}
                if (true) look.filter = "brightness(0.3)"
                else if (!this.canClick()) look.filter = "brightness(0.7)"
                if (!player.mme.clickables[4] && player.mme.meridianSelect == 16) look.outline = "2px solid white"
                return look
            },
        },
        117: {
            title() {return "<div style='height:5px'></div>Co:V<br><small style='font-size:10px'>Lv" + formatShortWhole(player.mme.meridian[17].level) + "</small>"},
            tooltip() {return true ? "" : layers.mme.tooltipDisplay(17)},
            canClick() {
                if (true) return false
                else if (player.mme.clickables[4]) return player.mme.meridian[17].gain.gt(0) && player.mse.ki.gt(0)
                else return true
            },
            unlocked: true,
            branches: [[116, "#4d1d1d", 10]],
            onClick() {
                if (player.mme.clickables[4]) layers.mme.levelup(17)
                else player.mme.meridianSelect = 17
            },
            style() {
                let look = {position: "absolute", left: "600px", top: "320px", width: "70px", minHeight: "70px", color: "#ccc", lineHeight: "8px", fontSize: "13px", textShadow: "0px 1px 0px #000,0px 0px 1px #ccc",
                    background: "linear-gradient(#454e46, #2e342f)", boxShadow: "0 0 20px #222", border: "4px solid rgba(0,0,0,0.5)", borderRadius: "50%"}
                if (player.mme.meridian[17].gain.gt(0) && player.mme.clickables[3]) {look.boxShadow = "0 0 15px #888"}
                if (true) look.filter = "brightness(0.3)"
                else if (!this.canClick()) look.filter = "brightness(0.7)"
                if (!player.mme.clickables[4] && player.mme.meridianSelect == 17) look.outline = "2px solid white"
                return look
            },
        },
        118: {
            title() {return "<div style='height:5px'></div>UB:P<br><small style='font-size:12px'>Lv" + formatShortWhole(player.mme.meridian[18].level) + "</small>"},
            tooltip() {return true ? "" : layers.mme.tooltipDisplay(18)},
            canClick() {
                if (true) return false
                else if (player.mme.clickables[4]) return player.mme.meridian[18].gain.gt(0) && player.mse.ki.gt(0)
                else return true
            },
            unlocked: true,
            branches: [[116, "#4d1d1d"]],
            onClick() {
                if (player.mme.clickables[4]) layers.mme.levelup(18)
                else player.mme.meridianSelect = 18
            },
            style() {
                let look = {position: "absolute", left: "550px", top: "150px", width: "80px", minHeight: "80px", color: "#ccc", lineHeight: "10px", fontSize: "15px", textShadow: "0px 1px 0px #000,0px 0px 1px #ccc",
                    background: "radial-gradient(#1e2950, #121830)", boxShadow: "0 0 20px #222", border: "4px solid rgba(0,0,0,0.5)", borderRadius: "50%"}
                if (player.mme.meridian[18].gain.gt(0) && player.mme.clickables[3]) {look.boxShadow = "0 0 15px #888"}
                if (true) look.filter = "brightness(0.3)"
                else if (!this.canClick()) look.filter = "brightness(0.7)"
                if (!player.mme.clickables[4] && player.mme.meridianSelect == 18) look.outline = "2px solid white"
                return look
            },
        },
        119: {
            title() {return "<div style='height:5px'></div>Go:V<br><small style='font-size:10px'>Lv" + formatShortWhole(player.mme.meridian[19].level) + "</small>"},
            tooltip() {return true ? "" : layers.mme.tooltipDisplay(19)},
            canClick() {
                if (true) return false
                else if (player.mme.clickables[4]) return player.mme.meridian[19].gain.gt(0) && player.mse.ki.gt(0)
                else return true
            },
            unlocked: true,
            branches: [[118, "#4d1d1d", 10]],
            onClick() {
                if (player.mme.clickables[4]) layers.mme.levelup(19)
                else player.mme.meridianSelect = 19
            },
            style() {
                let look = {position: "absolute", left: "460px", top: "80px", width: "70px", minHeight: "70px", color: "#ccc", lineHeight: "8px", fontSize: "13px", textShadow: "0px 1px 0px #000,0px 0px 1px #ccc",
                    background: "linear-gradient(#441122, #331111)", boxShadow: "0 0 20px #222", border: "4px solid rgba(0,0,0,0.5)", borderRadius: "50%"}
                if (player.mme.meridian[19].gain.gt(0) && player.mme.clickables[3]) {look.boxShadow = "0 0 15px #888"}
                if (true) look.filter = "brightness(0.3)"
                else if (!this.canClick()) look.filter = "brightness(0.7)"
                if (!player.mme.clickables[4] && player.mme.meridianSelect == 19) look.outline = "2px solid white"
                return look
            },
        },
        120: {
            title() {return "<div style='height:5px'></div>St:P<br><small style='font-size:12px'>Lv" + formatShortWhole(player.mme.meridian[20].level) + "</small>"},
            tooltip() {return true ? "" : layers.mme.tooltipDisplay(20)},
            canClick() {
                if (true) return false
                else if (player.mme.clickables[4]) return player.mme.meridian[20].gain.gt(0) && player.mse.ki.gt(0)
                else return true
            },
            unlocked: true,
            branches: [[118, "#4d1d1d"]],
            onClick() {
                if (player.mme.clickables[4]) layers.mme.levelup(20)
                else player.mme.meridianSelect = 20
            },
            style() {
                let look = {position: "absolute", left: "580px", top: "40px", width: "80px", minHeight: "80px", color: "#ccc", lineHeight: "10px", fontSize: "15px", textShadow: "0px 1px 0px #000,0px 0px 1px #ccc",
                    background: "radial-gradient(#423328, #31261e)", boxShadow: "0 0 20px #222", border: "4px solid rgba(0,0,0,0.5)", borderRadius: "50%"}
                if (player.mme.meridian[20].gain.gt(0) && player.mme.clickables[3]) {look.boxShadow = "0 0 15px #888"}
                if (true) look.filter = "brightness(0.3)"
                else if (!this.canClick()) look.filter = "brightness(0.7)"
                if (!player.mme.clickables[4] && player.mme.meridianSelect == 20) look.outline = "2px solid white"
                return look
            },
        },
    },
    tabFormat: [
        ["style-row", [
            ["style-column", [
                ["raw-html", () => {return layers.mse.effects()}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
            ], {width: "350px", height: "40px", lineHeight: "0.8", background: "#1b2a29", border: "3px solid #283f3e", borderRightWidth: "2px", borderRadius: "20px 0 0 20px"}],
            ["layer-proxy", ["mse", [["bar", "miasmaBar"]]]],
        ], {width: "710px", height: "46px"}],
        ["blank", "25px"],
        ["style-column", [
            ["style-column", [
                ["style-column", [
                    ["raw-html", () => {return "Lv." + formatShortWhole(player.mme.meridian[player.mme.meridianSelect].level) + " " + MERIDIANS[player.mme.meridianSelect].name + " (+" + formatShortWhole(player.mme.meridian[player.mme.meridianSelect].gain) + ")"}, {color: "white", fontSize: "24px", fontFamily: "monospace"}],
                ], {width: "600px", height: "37px", borderBottom: "3px solid #853D89"}],
                ["style-column", [
                    ["raw-html", () => {return MERIDIANS[player.mme.meridianSelect].effectDisplay ? run(MERIDIANS[player.mme.meridianSelect].effectDisplay, MERIDIANS[player.mme.meridianSelect]) : ""}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
                ], {width: "600px", height: "60px", lineHeight: "1", borderBottom: "3px solid #853D89"}],
                ["style-column", [
                    ["row", [
                        ["raw-html", () => {
                            if (MERIDIANS[player.mme.meridianSelect].base[0]) {
                                if (MERIDIANS[player.mme.meridianSelect].exponential) return "Next Req: " + formatSimple(Decimal.pow(MERIDIANS[player.mme.meridianSelect].scale[0], player.mme.meridian[player.mme.meridianSelect].level.add(player.mme.meridian[player.mme.meridianSelect].gain)).mul(MERIDIANS[player.mme.meridianSelect].base[0]).div(player.mme.meridianDiv)) + " " + MERIDIANS[player.mme.meridianSelect].resourceName[0]
                                else return "Next Req: " + formatSimple(layers.h.hexReq(player.mme.meridian[player.mme.meridianSelect].level.add(player.mme.meridian[player.mme.meridianSelect].gain), MERIDIANS[player.mme.meridianSelect].base[0], MERIDIANS[player.mme.meridianSelect].scale[0], player.mme.meridianDiv)) + " " + MERIDIANS[player.mme.meridianSelect].resourceName[0]
                            } else return "Next Req: "
                        }, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                        ["raw-html", () => {
                            if (MERIDIANS[player.mme.meridianSelect].base[1]) {
                                if (MERIDIANS[player.mme.meridianSelect].exponential) return ", " + formatSimple(Decimal.pow(MERIDIANS[player.mme.meridianSelect].scale[1], player.mme.meridian[player.mme.meridianSelect].level.add(player.mme.meridian[player.mme.meridianSelect].gain)).mul(MERIDIANS[player.mme.meridianSelect].base[1]).div(player.mme.meridianDiv)) + " " + MERIDIANS[player.mme.meridianSelect].resourceName[1]
                                else return ", " + formatSimple(layers.h.hexReq(player.mme.meridian[player.mme.meridianSelect].level.add(player.mme.meridian[player.mme.meridianSelect].gain), MERIDIANS[player.mme.meridianSelect].base[1], MERIDIANS[player.mme.meridianSelect].scale[1], player.mme.meridianDiv)) + " " + MERIDIANS[player.mme.meridianSelect].resourceName[1]
                            } else return ""
                        }, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                        ["raw-html", () => {
                            if (MERIDIANS[player.mme.meridianSelect].base[2]) {
                                if (MERIDIANS[player.mme.meridianSelect].exponential) return ", " + formatSimple(Decimal.pow(MERIDIANS[player.mme.meridianSelect].scale[2], player.mme.meridian[player.mme.meridianSelect].level.add(player.mme.meridian[player.mme.meridianSelect].gain)).mul(MERIDIANS[player.mme.meridianSelect].base[2]).div(player.mme.meridianDiv)) + " " + MERIDIANS[player.mme.meridianSelect].resourceName[2]
                                else return ", " + formatSimple(layers.h.hexReq(player.mme.meridian[player.mme.meridianSelect].level.add(player.mme.meridian[player.mme.meridianSelect].gain), MERIDIANS[player.mme.meridianSelect].base[2], MERIDIANS[player.mme.meridianSelect].scale[2], player.mme.meridianDiv)) + " " + MERIDIANS[player.mme.meridianSelect].resourceName[2]
                            } else return ""
                        }, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                    ]],
                    ["raw-html", () => {
                        if (MERIDIANS[player.mme.meridianSelect].exponential) return "Penalty: +" + formatSimple(Decimal.sumGeometricSeries(player.mme.meridian[player.mme.meridianSelect].gain, MERIDIANS[player.mme.meridianSelect].mBase, MERIDIANS[player.mme.meridianSelect].mScale, player.mme.meridian[player.mme.meridianSelect].level).div(player.mme.penaltyDiv), 2) + " Miasma"
                        else return "Penalty: +" + formatSimple(player.mme.meridian[player.mme.meridianSelect].level.add(player.mme.meridian[player.mme.meridianSelect].gain).pow(MERIDIANS[player.mme.meridianSelect].mScale).mul(MERIDIANS[player.mme.meridianSelect].mBase).sub(player.mme.meridian[player.mme.meridianSelect].level.pow(MERIDIANS[player.mme.meridianSelect].mScale).mul(MERIDIANS[player.mme.meridianSelect].mBase)).div(player.mme.penaltyDiv), 2) + " Miasma"
                    }, {color: "white", fontSize: "16px", fontFamily: "monospace"}],
                ], {width: "700px", height: "50px"}],
            ], {width: "700px", height: "157px", background: "#ff77c922", borderBottom: "3px solid #853D89", borderRadius: "17px 17px 0 0"}],
            ["style-row", [
                ["clickable", 1], ["style-row", [], {width: "3px", height: "37px", background: "#853D89"}], ["clickable", 2],
            ], {width: "700px", height: "37px", background: "#33172844", borderBottom: "3px solid #853D89"}],
            ["style-column", [
                ["bt-clickable", 120], ["bt-clickable", 119], ["bt-clickable", 118], ["bt-clickable", 117], ["bt-clickable", 116],
                ["bt-clickable", 115], ["bt-clickable", 114], ["bt-clickable", 113], ["bt-clickable", 112], ["bt-clickable", 111],
                ["bt-clickable", 110], ["bt-clickable", 109], ["bt-clickable", 108], ["bt-clickable", 107], ["bt-clickable", 106],
                ["bt-clickable", 105], ["bt-clickable", 103], ["bt-clickable", 102], ["bt-clickable", 101], ["bt-clickable", 104],
                ["bt-clickable", 100], // Order is weird because CSS lmao
            ], {position: "relative", width: "700px", height: "560px", background: "radial-gradient(#be6eec00, #be6eec22)"}],
            ["style-row", [
                ["clickable", 3], ["style-row", [], {width: "3px", height: "37px", background: "#853D89"}], ["clickable", 4],
            ], {width: "700px", height: "37px", background: "#33172844", borderTop: "3px solid #853D89", borderRadius: "0 0 17px 17px"}],
        ], {width: "700px", height: "800px", border: "3px solid #853D89", borderRadius: "20px"}],
        ["blank", "25px"],
    ],
    layerShown() { return player.sma.inStarmetalChallenge },
    deactivated() { return !player.sma.inStarmetalChallenge},
});