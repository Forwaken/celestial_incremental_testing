addLayer("sins", {
    name() {return "Sins"},
    symbol: "Si", // Decides what text appears on the node.
    universe: "UA",
    tooltip: "Sins", // Decides the nodes tooltip
    color: "#628B62", // Decides the nodes color.
    nodeStyle: {background: "radial-gradient(#628B62, #395537)", borderColor: "#1D2B1B", color: "#1D2B1B"}, // Decides the nodes style, in CSS format.
    branches: ["hpw"], // Decides the nodes branches.
    startData() { return {
        wrath: [new Decimal(1), new Decimal(1), new Decimal(1)],
        lust: [new Decimal(1), new Decimal(1), new Decimal(1)],
    }},
    update (delta) {
        player.sins.wrath[0] = Decimal.pow(Decimal.div(13, player.h.stage), player.hcu.curses.add(1).log(666).pow(0.5))
        player.sins.wrath[1] = player.hcu.curses.add(1).log(666).div(10).add(1)
        player.sins.wrath[2] = player.hcu.curses.add(1).log(666).div(5).add(1)
        player.sins.lust[0] = Decimal.pow(Decimal.div(13, player.h.stage), player.hpu.totalPurity.pow(0.7))
        player.sins.lust[1] = player.hpu.totalPurity.pow(1.3).div(10).add(1)
        player.sins.lust[2] = player.hpu.totalPurity.pow(1.3).div(5).add(1)
    },
    clickables: {
        "wrath": {
            title() {return player.sins.clickables["wrath"] ? "Disable" : "Enable"},
            canClick() {return player.hpw.upgTotal.gte(7) || player.sins.clickables["wrath"]},
            unlocked: true,
            onClick() {
                if (player.sins.clickables["wrath"]) {
                    player.sins.clickables["wrath"] = false
                } else {
                    if (confirm("Are you sure you want to do a power reset?")) {
                        if (player.hbl.blessings.gte(Decimal.pow10(player.h.stage.sub(1)).mul(player.h.stage))) {
                            player.hpw.power = player.hpw.power.add(player.hpw.powerGain)
                            player.hpw.totalPower = player.hpw.totalPower.add(player.hpw.powerGain)
                        }

                        layers.hpw.powerReset(0)
                    }
                    player.sins.clickables["wrath"] = true
                }
            },
            style() {
                let look = {width: "212px", minHeight: "53px", fontSize: "16px", color: "rgba(0,0,0,0.6)", borderTop: "6px solid #4b2d2d", borderLeft: "6px solid #4b2d2d", borderRight: "6px solid #4b2d2d", borderRadius: "20px 20px 100px 100px"}
                !this.canClick() ? "#bf8f8f" : !player.sins.clickables["wrath"] ? look.background = "#ccc" : look.background = "gray"
                return look
            },
        },
        "lust": {
            title() {return player.sins.clickables["lust"] ? "Disable" : "Enable"},
            canClick() {return player.hpw.upgTotal.gte(14) || player.sins.clickables["lust"]},
            unlocked: true,
            onClick() {
                if (player.sins.clickables["lust"]) {
                    player.sins.clickables["lust"] = false
                } else {
                    if (confirm("Are you sure you want to do a power reset?")) {
                        if (player.hbl.blessings.gte(Decimal.pow10(player.h.stage.sub(1)).mul(player.h.stage))) {
                            player.hpw.power = player.hpw.power.add(player.hpw.powerGain)
                            player.hpw.totalPower = player.hpw.totalPower.add(player.hpw.powerGain)
                        }

                        layers.hpw.powerReset(0)
                    }
                    player.sins.clickables["lust"] = true
                }
            },
            style() {
                let look = {width: "212px", minHeight: "53px", fontSize: "16px", color: "rgba(0,0,0,0.6)", borderTop: "6px solid #5f474b", borderLeft: "6px solid #5f474b", borderRight: "6px solid #5f474b", borderRadius: "20px 20px 100px 100px"}
                !this.canClick() ? "#bf8f8f" : !player.sins.clickables["lust"] ? look.background = "#ccc" : look.background = "gray"
                return look
            },
        },
        "envy": {
            title() {return player.sins.clickables["envy"] ? "Disable" : "Enable"},
            canClick() {return player.hpw.upgTotal.gte(21) || player.sins.clickables["envy"]},
            unlocked: true,
            onClick() {
                if (player.sins.clickables["envy"]) {
                    player.sins.clickables["envy"] = false
                } else {
                    if (confirm("Are you sure you want to do a power reset?")) {
                        if (player.hbl.blessings.gte(Decimal.pow10(player.h.stage.sub(1)).mul(player.h.stage))) {
                            player.hpw.power = player.hpw.power.add(player.hpw.powerGain)
                            player.hpw.totalPower = player.hpw.totalPower.add(player.hpw.powerGain)
                        }

                        layers.hpw.powerReset(0)
                    }
                    player.sins.clickables["envy"] = true
                }
            },
            style() {
                let look = {width: "212px", minHeight: "53px", fontSize: "16px", color: "rgba(0,0,0,0.6)", borderTop: "6px solid #314531", borderLeft: "6px solid #314531", borderRight: "6px solid #314531", borderRadius: "20px 20px 100px 100px"}
                !this.canClick() ? "#bf8f8f" : !player.sins.clickables["envy"] ? look.background = "#ccc" : look.background = "gray"
                return look
            },
        },
        "gluttony": {
            title() {return player.sins.clickables["gluttony"] ? "Disable" : "Enable"},
            canClick() {return player.hpw.upgTotal.gte(28) || player.sins.clickables["gluttony"]},
            unlocked: true,
            onClick() {
                if (player.sins.clickables["gluttony"]) {
                    player.sins.clickables["gluttony"] = false
                } else {
                    if (confirm("Are you sure you want to do a power reset?")) {
                        if (player.hbl.blessings.gte(Decimal.pow10(player.h.stage.sub(1)).mul(player.h.stage))) {
                            player.hpw.power = player.hpw.power.add(player.hpw.powerGain)
                            player.hpw.totalPower = player.hpw.totalPower.add(player.hpw.powerGain)
                        }

                        layers.hpw.powerReset(0)
                    }
                    player.sins.clickables["gluttony"] = true
                }
            },
            style() {
                let look = {width: "212px", minHeight: "53px", fontSize: "16px", color: "rgba(0,0,0,0.6)", borderTop: "6px solid #5f4839", borderLeft: "6px solid #5f4839", borderRight: "6px solid #5f4839", borderRadius: "20px 20px 100px 100px"}
                !this.canClick() ? "#bf8f8f" : !player.sins.clickables["gluttony"] ? look.background = "#ccc" : look.background = "gray"
                return look
            },
        },
        "sloth": {
            title() {return player.sins.clickables["sloth"] ? "Disable" : "Enable"},
            canClick() {return player.hpw.upgTotal.gte(35) || player.sins.clickables["sloth"]},
            unlocked: true,
            onClick() {
                if (player.sins.clickables["sloth"]) {
                    player.sins.clickables["sloth"] = false
                } else {
                    if (confirm("Are you sure you want to do a power reset?")) {
                        if (player.hbl.blessings.gte(Decimal.pow10(player.h.stage.sub(1)).mul(player.h.stage))) {
                            player.hpw.power = player.hpw.power.add(player.hpw.powerGain)
                            player.hpw.totalPower = player.hpw.totalPower.add(player.hpw.powerGain)
                        }

                        layers.hpw.powerReset(0)
                    }
                    player.sins.clickables["sloth"] = true
                }
            },
            style() {
                let look = {width: "212px", minHeight: "53px", fontSize: "16px", color: "rgba(0,0,0,0.6)", borderTop: "6px solid #314545", borderLeft: "6px solid #314545", borderRight: "6px solid #314545", borderRadius: "20px 20px 100px 100px"}
                !this.canClick() ? "#bf8f8f" : !player.sins.clickables["sloth"] ? look.background = "#ccc" : look.background = "gray"
                return look
            },
        },
        "greed": {
            title() {return player.sins.clickables["greed"] ? "Disable" : "Enable"},
            canClick() {return player.hpw.upgTotal.gte(42) || player.sins.clickables["greed"]},
            unlocked: true,
            onClick() {
                if (player.sins.clickables["greed"]) {
                    player.sins.clickables["greed"] = false
                } else {
                    if (confirm("Are you sure you want to do a power reset?")) {
                        if (player.hbl.blessings.gte(Decimal.pow10(player.h.stage.sub(1)).mul(player.h.stage))) {
                            player.hpw.power = player.hpw.power.add(player.hpw.powerGain)
                            player.hpw.totalPower = player.hpw.totalPower.add(player.hpw.powerGain)
                        }

                        layers.hpw.powerReset(0)
                    }
                    player.sins.clickables["greed"] = true
                }
            },
            style() {
                let look = {width: "212px", minHeight: "53px", fontSize: "16px", color: "rgba(0,0,0,0.6)", borderTop: "6px solid #5f5939", borderLeft: "6px solid #5f5939", borderRight: "6px solid #5f5939", borderRadius: "20px 20px 100px 100px"}
                !this.canClick() ? "#bf8f8f" : !player.sins.clickables["greed"] ? look.background = "#ccc" : look.background = "gray"
                return look
            },
        },
        "pride": {
            title() {return player.sins.clickables["pride"] ? "Disable" : "Enable"},
            canClick() {return player.hpw.upgTotal.gte(49) || player.sins.clickables["pride"]},
            unlocked: true,
            onClick() {
                if (player.sins.clickables["pride"]) {
                    player.sins.clickables["pride"] = false
                } else {
                    if (confirm("Are you sure you want to do a power reset?")) {
                        if (player.hbl.blessings.gte(Decimal.pow10(player.h.stage.sub(1)).mul(player.h.stage))) {
                            player.hpw.power = player.hpw.power.add(player.hpw.powerGain)
                            player.hpw.totalPower = player.hpw.totalPower.add(player.hpw.powerGain)
                        }

                        layers.hpw.powerReset(0)
                    }
                    player.sins.clickables["pride"] = true
                }
            },
            style() {
                let look = {width: "212px", minHeight: "53px", fontSize: "16px", color: "rgba(0,0,0,0.6)", borderTop: "6px solid #38314c", borderLeft: "6px solid #38314c", borderRight: "6px solid #38314c", borderRadius: "20px 20px 100px 100px"}
                !this.canClick() ? "#bf8f8f" : !player.sins.clickables["pride"] ? look.background = "#ccc" : look.background = "gray"
                return look
            },
        },
    },
    tabFormat: [
        ["row", [
            ["raw-html", () => {return "You have <h3>" + format(player.h.hexPoint) + "</h3> " + player.h.stageName[1] + " points."}, {color: "white", fontSize: "24px", fontFamily: "monospace"}],
            ["raw-html", () => {return player.h.hexPointGain.eq(0) ? "" : player.h.hexPointGain.gt(0) ? "(+" + format(player.h.hexPointGain) + "/s)" : "<span style='color:red'>(" + format(player.h.hexPointGain) + "/s)</span>"}, {color: "white", fontSize: "24px", fontFamily: "monospace", marginLeft: "10px"}],
            ["raw-html", () => {return (inChallenge("hrm", 14) || player.h.hexPointGain.gte(1e308)) ? "[SOFTCAPPED]" : "" }, {color: "red", fontSize: "24px", fontFamily: "monospace", marginLeft: "10px"}],
        ]],
        ["style-row", [["raw-html", () => {return layers.h.effects()}, {color: "#f88", fontSize: "16px", fontFamily: "monospace"}]], {lineHeight: "1"}],
        ["raw-html", () => {return inChallenge("hrm", 15) ? "Time Remaining: " + formatTime(player.hrm.dreamTimer) : ""}, {color: "white", fontSize: "20px", fontFamily: "monospace"}],
        ["blank", "10px"],
        ["style-column", [
            ["raw-html", () => {return player.h.stageName[0] + " of Sins"}, {color: "white", fontSize: "30px", fontFamily: "monospace"}],
        ], {width: "800px", height: "50px", backgroundColor: "#1d291d", border: "3px solid white", borderRadius: "20px"}],
        ["blank", "10px"],
        ["row", [
            ["style-column", [
                ["style-row", [
                    ["raw-html", "WRATH", {color: "rgba(0,0,0,0.6)", fontSize: "30px", fontFamily: "monospace"}],
                ], {width: "200px", height: "47px", background: "#693e3e", borderLeft: "6px solid #4b2d2d", borderRight: "6px solid #4b2d2d", borderBottom: "6px solid #4b2d2d", borderRadius: "100px 100px 20px 20px"}],
                ["style-column", [
                    ["style-column", [
                        ["raw-html", "Debuff", {color: "rgba(0,0,0,0.6)", fontSize: "20px", fontFamily: "monospace"}],
                        ["raw-html", "/6 Jinx Cap", {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                    ], {width: "225px", height: "45px", background: "#784848", borderRadius: "10px"}],
                    ["blank", "5px"],
                    ["style-column", [
                        ["raw-html", "Buffs", {color: "rgba(0,0,0,0.6)", fontSize: "20px", fontFamily: "monospace"}],
                        ["raw-html", () => {return "x" + formatSimple(player.sins.wrath[0]) + " Power Gain"}, {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                        ["raw-html", () => {return "x" + formatSimple(player.sins.wrath[1]) + " Radioactive Fragment Score"}, {color: "rgba(0,0,0,0.6)", fontSize: "12px", fontFamily: "monospace"}],
                        ["raw-html", () => {return "x" + formatSimple(player.sins.wrath[2]) + " Radioactive Pylon Energy"}, {color: "rgba(0,0,0,0.6)", fontSize: "12px", fontFamily: "monospace"}],
                        ["raw-html", () => {return "(Based on Curses)"}, {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                    ], {width: "225px", height: "90px", background: "#784848", borderRadius: "10px"}],
                ], () => {return player.hpw.upgTotal.gte(7) ? {width: "250px", height: "150px", lineHeight: "0.9"} : {display: "none !important"}}],
                ["style-column", [
                    ["raw-html", () => {return Decimal.sub(7, player.hpw.upgTotal).eq(1) ? "Unlocked in 1 Power Upgrade" : "Unlocked in " + formatWhole(Decimal.sub(7, player.hpw.upgTotal)) + " Power Upgrades"}, {color: "rgba(0,0,0,0.6)", fontSize: "24px", fontFamily: "monospace"}],
                ], () => {return player.hpw.upgTotal.lt(7) ? {width: "250px", height: "150px"} : {display: "none !important"}}],
                ["hoverless-clickable", "wrath"],
            ], () => {
                let look = {width: "250px", height: "250px", background: "#965A5A", border: "6px solid #4b2d2d", borderRadius: "125px 125px 125px 125px / 50px 50px 50px 50px", overflow: "hidden"}
                if (player.hpw.upgTotal.lt(7)) {look.filter = "brightness(50%)", look.userSelect = "none"}
                return look
            }],
            ["blank", ["10px", "10px"]],
            ["style-column", [
                ["style-row", [
                    ["raw-html", "LUST", {color: "rgba(0,0,0,0.6)", fontSize: "30px", fontFamily: "monospace"}],
                ], {width: "200px", height: "47px", background: "#856469", borderLeft: "6px solid #5f474b", borderRight: "6px solid #5f474b", borderBottom: "6px solid #5f474b", borderRadius: "100px 100px 20px 20px"}],
                ["style-column", [
                    ["style-column", [
                        ["raw-html", "Debuff", {color: "rgba(0,0,0,0.6)", fontSize: "20px", fontFamily: "monospace"}],
                        ["raw-html", "/6 Purifier Effectiveness", {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                    ], {width: "225px", height: "45px", background: "#987278", borderRadius: "10px"}],
                    ["blank", "5px"],
                    ["style-column", [
                        ["raw-html", "Buffs", {color: "rgba(0,0,0,0.6)", fontSize: "20px", fontFamily: "monospace"}],
                        ["raw-html", () => {return "x" + formatSimple(player.sins.lust[0]) + " Power Gain"}, {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                        ["raw-html", () => {return "x" + formatSimple(player.sins.lust[1]) + " Natural Fragment Score"}, {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                        ["raw-html", () => {return "x" + formatSimple(player.sins.lust[2]) + " Natural Pylon Energy"}, {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                        ["raw-html", () => {return "(Based on Purity)"}, {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                    ], {width: "225px", height: "90px", background: "#987278", borderRadius: "10px"}],
                ], () => {return player.hpw.upgTotal.gte(14) ? {width: "250px", height: "150px", lineHeight: "0.9"} : {display: "none !important"}}],
                ["style-column", [
                    ["raw-html", () => {return Decimal.sub(14, player.hpw.upgTotal).eq(1) ? "Unlocked in 1 Power Upgrade" : "Unlocked in " + formatWhole(Decimal.sub(14, player.hpw.upgTotal)) + " Power Upgrades"}, {color: "rgba(0,0,0,0.6)", fontSize: "24px", fontFamily: "monospace"}],
                ], () => {return player.hpw.upgTotal.lt(14) ? {width: "250px", height: "150px"} : {display: "none !important"}}],
                ["hoverless-clickable", "lust"],
            ], () => {
                let look = {width: "250px", height: "250px", background: "#BF8F97", border: "6px solid #5f474b", borderRadius: "125px 125px 125px 125px / 50px 50px 50px 50px", overflow: "hidden"}
                if (player.hpw.upgTotal.lt(14)) {look.filter = "brightness(50%)", look.userSelect = "none"}
                return look
            }],
        ]],
        ["row", [
            ["style-column", [
                ["style-row", [
                    ["raw-html", "ENVY", {color: "rgba(0,0,0,0.6)", fontSize: "30px", fontFamily: "monospace"}],
                ], {width: "200px", height: "47px", background: "#446144", borderLeft: "6px solid #314531", borderRight: "6px solid #314531", borderBottom: "6px solid #314531", borderRadius: "100px 100px 20px 20px"}],
                ["style-column", [
                    ["style-column", [
                        ["raw-html", "Debuff", {color: "rgba(0,0,0,0.6)", fontSize: "20px", fontFamily: "monospace"}],
                        ["raw-html", "/6 Provenance Effectiveness", {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                    ], {width: "225px", height: "45px", background: "#4e6f4e", borderRadius: "10px"}],
                    ["blank", "5px"],
                    ["style-column", [
                        ["raw-html", "Buffs", {color: "rgba(0,0,0,0.6)", fontSize: "20px", fontFamily: "monospace"}],
                        ["raw-html", "^1.05 Power Gain", {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                        ["raw-html", "x1 Cosmic Fragment Score", {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                        ["raw-html", "x1 Cosmic Pylon Energy", {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                        ["raw-html", "(Based on Provenances)", {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                    ], {width: "225px", height: "90px", background: "#4e6f4e", borderRadius: "10px"}],
                ], () => {return player.hpw.upgTotal.gte(21) ? {width: "250px", height: "150px", lineHeight: "0.9"} : {display: "none !important"}}],
                ["style-column", [
                    ["raw-html", () => {return Decimal.sub(21, player.hpw.upgTotal).eq(1) ? "Unlocked in 1 Power Upgrade" : "Unlocked in " + formatWhole(Decimal.sub(21, player.hpw.upgTotal)) + " Power Upgrades"}, {color: "rgba(0,0,0,0.6)", fontSize: "24px", fontFamily: "monospace"}],
                ], () => {return player.hpw.upgTotal.lt(21) ? {width: "250px", height: "150px"} : {display: "none !important"}}],
                ["hoverless-clickable", "envy"],
            ], () => {
                let look = {width: "250px", height: "250px", background: "#628B62", border: "6px solid #314531", borderRadius: "125px 125px 125px 125px / 50px 50px 50px 50px", overflow: "hidden"}
                if (player.hpw.upgTotal.lt(21)) {look.filter = "brightness(50%)", look.userSelect = "none"}
                return look
            }],
            ["blank", ["10px", "10px"]],
            ["style-column", [
                ["style-row", [
                    ["raw-html", "GLUTTONY", {color: "rgba(0,0,0,0.6)", fontSize: "30px", fontFamily: "monospace"}],
                ], {width: "200px", height: "47px", background: "#85654f", borderLeft: "6px solid #5f4839", borderRight: "6px solid #5f4839", borderBottom: "6px solid #5f4839", borderRadius: "100px 100px 20px 20px"}],
                ["style-column", [
                    ["style-column", [
                        ["raw-html", "Debuff", {color: "rgba(0,0,0,0.6)", fontSize: "20px", fontFamily: "monospace"}],
                        ["raw-html", "x1.6 Refinement Scaling", {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                    ], {width: "225px", height: "45px", background: "#98745b", borderRadius: "10px"}],
                    ["blank", "5px"],
                    ["style-column", [
                        ["raw-html", "Buffs", {color: "rgba(0,0,0,0.6)", fontSize: "20px", fontFamily: "monospace"}],
                        ["raw-html", "^1.05 Power Gain", {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                        ["raw-html", "x1 Paradox Fragment Score", {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                        ["raw-html", "^1 Paradox Pylon Energy", {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                        ["raw-html", () => {return "(Based on Refinements)"}, {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                    ], {width: "225px", height: "90px", background: "#98745b", borderRadius: "10px"}],
                ], () => {return player.hpw.upgTotal.gte(28) ? {width: "250px", height: "150px", lineHeight: "0.9"} : {display: "none !important"}}],
                ["style-column", [
                    ["raw-html", () => {return Decimal.sub(28, player.hpw.upgTotal).eq(1) ? "Unlocked in 1 Power Upgrade" : "Unlocked in " + formatWhole(Decimal.sub(28, player.hpw.upgTotal)) + " Power Upgrades"}, {color: "rgba(0,0,0,0.6)", fontSize: "24px", fontFamily: "monospace"}],
                ], () => {return player.hpw.upgTotal.lt(28) ? {width: "250px", height: "150px"} : {display: "none !important"}}],
                ["hoverless-clickable", "gluttony"],
            ], () => {
                let look = {width: "250px", height: "250px", background: "#BF9172", border: "6px solid #5f4839", borderRadius: "125px 125px 125px 125px / 50px 50px 50px 50px", overflow: "hidden"}
                if (player.hpw.upgTotal.lt(28)) {look.filter = "brightness(50%)", look.userSelect = "none"}
                return look
            }],
            ["blank", ["10px", "10px"]],
            ["style-column", [
                ["style-row", [
                    ["raw-html", "SLOTH", {color: "rgba(0,0,0,0.6)", fontSize: "30px", fontFamily: "monospace"}],
                ], {width: "200px", height: "47px", background: "#446161", borderLeft: "6px solid #314545", borderRight: "6px solid #314545", borderBottom: "6px solid #314545", borderRadius: "100px 100px 20px 20px"}],
                ["style-column", [
                    ["style-column", [
                        ["raw-html", "Debuff", {color: "rgba(0,0,0,0.6)", fontSize: "20px", fontFamily: "monospace"}],
                        ["raw-html", "/666 Uni-Alpha Tickspeed", {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                    ], {width: "225px", height: "45px", background: "#4e6f6f", borderRadius: "10px"}],
                    ["blank", "5px"],
                    ["style-column", [
                        ["raw-html", "Buffs", {color: "rgba(0,0,0,0.6)", fontSize: "20px", fontFamily: "monospace"}],
                        ["raw-html", "^1.05 Power Gain", {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                        ["raw-html", "x1 Temporal Fragment Score", {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                        ["raw-html", "x1 Temporal Pylon Energy", {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                        ["raw-html", () => {return "(Based on " + player.h.stageName[0] + " Points)"}, {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                    ], {width: "225px", height: "90px", background: "#4e6f6f", borderRadius: "10px"}],
                ], () => {return player.hpw.upgTotal.gte(35) ? {width: "250px", height: "150px", lineHeight: "0.9"} : {display: "none !important"}}],
                ["style-column", [
                    ["raw-html", () => {return Decimal.sub(35, player.hpw.upgTotal).eq(1) ? "Unlocked in 1 Power Upgrade" : "Unlocked in " + formatWhole(Decimal.sub(35, player.hpw.upgTotal)) + " Power Upgrades"}, {color: "rgba(0,0,0,0.6)", fontSize: "24px", fontFamily: "monospace"}],
                ], () => {return player.hpw.upgTotal.lt(35) ? {width: "250px", height: "150px"} : {display: "none !important"}}],
                ["hoverless-clickable", "sloth"],
            ], () => {
                let look = {width: "250px", height: "250px", background: "#628B8B", border: "6px solid #314545", borderRadius: "125px 125px 125px 125px / 50px 50px 50px 50px", overflow: "hidden"}
                if (player.hpw.upgTotal.lt(35)) {look.filter = "brightness(50%)", look.userSelect = "none"}
                return look
            }],
        ]],
        ["row", [
            ["style-column", [
                ["style-row", [
                    ["raw-html", "GREED", {color: "rgba(0,0,0,0.6)", fontSize: "30px", fontFamily: "monospace"}],
                ], {width: "200px", height: "47px", background: "#857d4f", borderLeft: "6px solid #5f5939", borderRight: "6px solid #5f5939", borderBottom: "6px solid #5f5939", borderRadius: "100px 100px 20px 20px"}],
                ["style-column", [
                    ["style-column", [
                        ["raw-html", "Debuff", {color: "rgba(0,0,0,0.6)", fontSize: "20px", fontFamily: "monospace"}],
                        ["raw-html", "/666 Blessings", {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                    ], {width: "225px", height: "45px", background: "#988f5b", borderRadius: "10px"}],
                    ["blank", "5px"],
                    ["style-column", [
                        ["raw-html", "Buffs", {color: "rgba(0,0,0,0.6)", fontSize: "20px", fontFamily: "monospace"}],
                        ["raw-html", "^1.05 Power Gain", {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                        ["raw-html", "x1 Technological Fragment Score", {color: "rgba(0,0,0,0.6)", fontSize: "12px", fontFamily: "monospace"}],
                        ["raw-html", "x1 Technological Pylon Energy", {color: "rgba(0,0,0,0.6)", fontSize: "12px", fontFamily: "monospace"}],
                        ["raw-html", () => {return "(Based on Blessings)"}, {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                    ], {width: "225px", height: "90px", background: "#988f5b", borderRadius: "10px"}],
                ], () => {return player.hpw.upgTotal.gte(42) ? {width: "250px", height: "150px", lineHeight: "0.9"} : {display: "none !important"}}],
                ["style-column", [
                    ["raw-html", () => {return Decimal.sub(42, player.hpw.upgTotal).eq(1) ? "Unlocked in 1 Power Upgrade" : "Unlocked in " + formatWhole(Decimal.sub(42, player.hpw.upgTotal)) + " Power Upgrades"}, {color: "rgba(0,0,0,0.6)", fontSize: "24px", fontFamily: "monospace"}],
                ], () => {return player.hpw.upgTotal.lt(42) ? {width: "250px", height: "150px"} : {display: "none !important"}}],
                ["hoverless-clickable", "greed"],
            ], () => {
                let look = {width: "250px", height: "250px", background: "#BFB372", border: "6px solid #5f5939", borderRadius: "125px 125px 125px 125px / 50px 50px 50px 50px", overflow: "hidden"}
                if (player.hpw.upgTotal.lt(42)) {look.filter = "brightness(50%)", look.userSelect = "none"}
                return look
            }],
            ["blank", ["10px", "10px"]],
            ["style-column", [
                ["style-row", [
                    ["raw-html", "PRIDE", {color: "rgba(0,0,0,0.6)", fontSize: "30px", fontFamily: "monospace"}],
                ], {width: "200px", height: "47px", background: "#4e456b", borderLeft: "6px solid #38314c", borderRight: "6px solid #38314c", borderBottom: "6px solid #38314c", borderRadius: "100px 100px 20px 20px"}],
                ["style-column", [
                    ["style-column", [
                        ["raw-html", "Debuff", {color: "rgba(0,0,0,0.6)", fontSize: "20px", fontFamily: "monospace"}],
                        ["raw-html", "/666 Pre-Power Resources", {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                    ], {width: "225px", height: "45px", background: "#594f7a", borderRadius: "10px"}],
                    ["blank", "5px"],
                    ["style-column", [
                        ["raw-html", "Buffs", {color: "rgba(0,0,0,0.6)", fontSize: "20px", fontFamily: "monospace"}],
                        ["raw-html", "^1.05 Power Gain", {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                        ["raw-html", "x1 Ancient Fragment Score", {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                        ["raw-html", "^1 Ancient Pylon Energy", {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                        ["raw-html", () => {return "(Based on Curses)"}, {color: "rgba(0,0,0,0.6)", fontSize: "14px", fontFamily: "monospace"}],
                    ], {width: "225px", height: "90px", background: "#594f7a", borderRadius: "10px"}],
                ], () => {return player.hpw.upgTotal.gte(49) ? {width: "250px", height: "150px", lineHeight: "0.9"} : {display: "none !important"}}],
                ["style-column", [
                    ["raw-html", () => {return Decimal.sub(49, player.hpw.upgTotal).eq(1) ? "Unlocked in 1 Power Upgrade" : "Unlocked in " + formatWhole(Decimal.sub(49, player.hpw.upgTotal)) + " Power Upgrades"}, {color: "rgba(0,0,0,0.6)", fontSize: "24px", fontFamily: "monospace"}],
                ], () => {return player.hpw.upgTotal.lt(49) ? {width: "250px", height: "150px"} : {display: "none !important"}}],
                ["hoverless-clickable", "pride"],
            ], () => {
                let look = {width: "250px", height: "250px", background: "#706399", border: "6px solid #38314c", borderRadius: "125px 125px 125px 125px / 50px 50px 50px 50px", overflow: "hidden"}
                if (player.hpw.upgTotal.lt(49)) {look.filter = "brightness(50%)", look.userSelect = "none"}
                return look
            }],
        ]],
        ["blank", "10px"],
        ["style-column", [
            ["raw-html", "Enabling a sin does a power reset.", {color: "rgba(0,0,0,0.6)", fontSize: "20px", fontFamily: "monospace"}],
        ], {width: "450px", height: "35px", backgroundColor: "#60765e", border: "3px solid rgba(0,0,0,0.5)", borderRadius: "20px"}],
        ["blank", "25px"],
    ],
    layerShown() { return player.h.stage.eq(7) }, // Decides if this node is shown or not.
});