let bulletHellNeo = null;

function bulletHell(actions, values = {}, exitAction = () => {}) {
    if (Object.keys(actions).length === 0) actions = {"none": {}}
    if ((options && options.bulletHellOff) || (player && player.tab && player.tab != "bh")) {
        if (player.bh.celestialite.health.lte(0)) return
        let amt = 0
        for (let i = 0; i < 3; i++) {if (player.bh.characters[i].id != "none" && Decimal.gt(player.bh.characters[i].health, 0)) amt++}
        let duration = values.duration ?? 10
        bhAttack(Decimal.mul(player.bh.celestialite.damage, duration/3), 3, 0, "allPlayer", "<span style='color:#aa2798'>[BH] </span>")
        exitAction()
        return
    }
    if (values.goal) {values.goalStart = values.goal == "cell" ? "maze" : values.goal}
    if (values.start) {values.pStart = values.start == "cell" ? "maze" : values.start}
    if (values.timed) {values.timer = true;values.timerTime = values.duration}
    if (values.transparent) {values.arenaTransparent = true}
    if (values.duration) {for (let i in actions) {if (!actions[i].duration) actions[i].duration = values.duration}}
    if (values.jumpMax) {values.pJumpMax = values.jumpMax}
    if (values.jumpMin) {values.pJumpMin = values.jumpMin}
    if (values.gravity) {values.pGravity = values.gravity}
    if (!bulletHellNeo || !bulletHellNeo.overlay) {
        bulletHellNeo = new BulletHell(values, actions, exitAction);
        bulletHellNeo.spawnArena();
    } else {
        bulletHellNeo.newAction(values, actions, exitAction)
    }
}

class BulletHell {
    constructor(values = {}, actions = {}, exitAction = () => {}) {
        this.running = false
        this.actions = actions
        for (let i in this.actions) {
            if (!this.actions[i].duration) this.actions[i].duration = -1000
        }
        this.exitActions = [exitAction]
        this.bullets = []
        this.prevScreenState = options.fullscreen
        this.time = Date.now()
        this.delta = 0

        // Arena Variables
        this.overlay = null
        this.enemyCanvas = null
        this.arenaCanvas = null
        this.arenaType = values.arenaType || "normal" // used for clickthrough arena
        this.arenaTransparent = values.arenaTransparent
        this.width = values.width || 700
        this.height = values.height || 500
        this.centerX = values.centerX || window.innerWidth / 2
        this.centerY = values.centerY || window.innerHeight / 2
        this.timer = values.timer || false
        this.timerTime = values.timerTime || 0
        this.duration = values.duration || -1000

        // Sub-arena Variables
        this.subArena = values.subArena || false
        if (this.subArena) {
            this.subWidth = values.subWidth || 400
            this.subHeight = values.subHeight || 300
            this.subStart = values.subStart || "random"
            switch (this.subStart) {
                case "custom":
                    this.subx = values.subx || 0
                    this.suby = values.suby || 0
                    break;
                case "left":
                    this.subx = 0
                    this.suby = (this.height - this.subHeight) / 2
                    break;
                case "right":
                    this.subx = this.width - this.subWidth
                    this.suby = (this.height - this.subHeight) / 2
                    break;
                case "top":
                    this.subx = (this.width - this.subWidth) / 2
                    this.suby = 0
                    break;
                case "bottom":
                    this.subx = (this.width - this.subWidth) / 2
                    this.suby = 0
                    break;
                case "center":
                    this.subx = (this.width - this.subWidth) / 2
                    this.suby = (this.height - this.subHeight) / 2
                    break;
                default:
                    this.subx = Math.random() * (this.width - this.subWidth)
                    this.suby = Math.random() * (this.height - this.subHeight)
                    break;
            }
            this.subSpeed = values.subSpeed || 2.5
            this.subMove = values.subMove || "bounce"
            let subAngle = 0
            switch (this.subMove) {
                case "bounce": case "random":
                    subAngle = Math.random() * 2 * Math.PI
                    break;
                case "left":
                    subAngle = Math.PI
                    break;
                case "down":
                    subAngle = Math.PI / 2
                    break;
                case "up":
                    subAngle = Math.PI * 1.5
                    break;
                case "custom":
                    subAngle = values.subAngle
                    break;
            }
            this.subvx = Math.cos(subAngle) * this.subSpeed
            this.subvy = Math.sin(subAngle) * this.subSpeed
        }

        // Maze Variables
        this.cellSize = values.cellSize || false
        if (this.cellSize) {
            this.mazeCols = Math.floor(this.width / this.cellSize)
            this.mazeRows = Math.floor(this.height / this.cellSize)
            this.maze = []
            for (let y = 0; y < this.mazeRows; y++) {
                this.maze[y] = [];
                for (let x = 0; x < this.mazeCols; x++) {
                    this.maze[y][x] = { x, y, visited: false, walls: [true, true, true, true] }; // top, right, bottom, left
                }
            }
            this.shuffle = (arr) => {
                for (let i = arr.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                }
                return arr;
            }
            this.carve = (x, y) => {
                this.maze[y][x].visited = true;
                const dirs = this.shuffle([[0, -1, 0], [1, 0, 1], [0, 1, 2], [-1, 0, 3]]); // [dx, dy, wall]
                for (const [dx, dy, wall] of dirs) {
                    const nx = x + dx, ny = y + dy;
                    if (ny >= 0 && ny < this.mazeRows && nx >= 0 && nx < this.mazeCols && !this.maze[ny][nx].visited) {
                        this.maze[y][x].walls[wall] = false;
                        this.maze[ny][nx].walls[(wall + 2) % 4] = false;
                        this.carve(nx, ny);
                    }
                }
            }
            this.carve(0, 0);
        }
        this.goalStart = values.goalStart || false
        this.goalSize = values.goalSize || 50
        this.goalAmt = values.goalAmt || 1
        this.goalAmtShow = values.goalAmtShow || false
        this.goalBehavior = values.goalBehavior || "normal"
        this.goalEnd = values.goalEnd || "leave"
        this.positionGoal()

        // Player Variables
        this.soul = values.soul || "red"
        this.invTime = 0.5
        this.pStart = values.pStart || (this.cellSize ? "maze" : "center")
        let curWidth = this.subArena ? this.subWidth : this.width
        let curHeight = this.subArena ? this.subHeight : this.height
        switch (this.pStart) {
            case "maze":
                this.px = this.cellSize / 2
                this.py = this.cellSize / 2
                break;
            case "custom":
                this.px = values.px || 25
                this.py = values.py || 25
            case "left":
                this.px = 25
                this.py = curHeight / 2
                break;
            case "right":
                this.px = curWidth - 25
                this.py = curHeight / 2
                break;
            case "top":
                this.px = curWidth / 2
                this.py = 25
                break;
            case "bottom":
                this.px = curWidth / 2
                this.py = curHeight - 25
                break;
            case "center":
                this.px = curWidth / 2
                this.py = curWidth / 2
                break;
            default:
                this.px = (Math.random() * (curWidth - 25)) + 25
                this.py = (Math.random() * (curHeight - 25)) + 25
                break
        }
        this.pvx = 0
        this.pvy = 0
        this.pr = values.pr || 18
        this.pSpeed = values.pSpeed || 5.5
        this.pGravity = values.gravity || 0.6
        this.pJumpStrength = values.jumpStrength || -12
        this.pJumpMin = values.pJumpMin || 40
        this.pJumpMax = values.pJumpMax || 220
        this.onGround = true

        // Control Variables
        this.pos = {x: 0, y: 0}
        this.keys = {up: false, down: false, left: false, right: false, shift: false}
    }

    spawnArena() {
        // Create a fullscreen overlay
        this.overlay = document.createElement("div")
        this.overlay.id = "bh-overlay"
        this.overlay.style.position = "fixed"
        this.overlay.style.left = "0"
        this.overlay.style.top = "0"
        this.overlay.style.width = "100vw"
        this.overlay.style.height = "100vh"
        this.overlay.style.background = "rgba(0,0,0,0.1)"
        this.overlay.style.zIndex = "99999"
        this.overlay.style.display = "flex"
        this.overlay.style.alignItems = "center"
        this.overlay.style.justifyContent = "center"
        this.overlay.style.touchAction = "none"

        // Create canvas for the enemies (Always full screen)
        this.enemyCanvas = document.createElement("canvas")
        this.enemyCanvas.width = window.innerWidth
        this.enemyCanvas.height = window.innerHeight
        this.enemyCanvas.style.position = "fixed"
        this.enemyCanvas.style.left = "0"
        this.enemyCanvas.style.top = "0"
        this.enemyCanvas.style.pointerEvents = "none"
        this.enemyCanvas.style.zIndex = "100002"
        this.overlay.appendChild(this.enemyCanvas)

        // Create arena canvas
        this.arenaCanvas = document.createElement("canvas")
        this.arenaCanvas.width = this.width
        this.arenaCanvas.height = this.height
        this.arenaCanvas.style.background = this.arenaTransparent ? "rgba(0,0,0,0)" : "#111"
        if (this.arenaCanvas.width != window.innerWidth && this.arenaCanvas.height != window.innerHeight) {
            this.arenaCanvas.style.border = "2px solid #fff"
            this.arenaCanvas.style.borderRadius = "16px"
        }
        if (!options.performanceMode) this.arenaCanvas.style.boxShadow = "0 0 32px #000"
        this.arenaCanvas.style.position = "absolute"
        this.arenaCanvas.style.left = `calc(50vw - ${this.width / 2}px)`
        this.arenaCanvas.style.top = `calc(50vh - ${this.height / 2}px)`
        this.arenaCanvas.style.zIndex = "100001"
        this.overlay.appendChild(this.arenaCanvas)

        // Append elements to document, and make canvas variables
        document.body.appendChild(this.overlay)
        this.enemyCtx = this.enemyCanvas.getContext("2d")
        this.arenaCtx = this.arenaCanvas.getContext("2d")

        // Box Coords
        this.boxLeft = this.arenaCanvas.getBoundingClientRect().left
        this.boxTop = this.arenaCanvas.getBoundingClientRect().top

        // Action setup and initial bullet spawn code
        for (let i in this.actions) {
            if (BHB[i].codeFunc) this.actions[i].codeFunc = BHB[i].codeFunc
            if (BHB[i].moveFunc) this.actions[i].moveFunc = BHB[i].moveFunc
            this.actions[i].lastTime = false

            if (this.actions[i].codeFunc) this.actions[i].codeFunc()
        }

        // Event Listeners
        if (!options.bhKeyboard) {
            window.addEventListener("mousemove", this.mouseHandler)
            window.addEventListener("touchmove", this.touchHandler)
            window.addEventListener("click", this.clickHandler)
        } else {
            window.addEventListener("keydown", this.keydownHandler)
            window.addEventListener("keyup", this.keyupHandler)
            window.addEventListener("click", this.clickHandler)
        }

        // Pause Universes to prevent problems
        if (this.running == false && (player.bh.celestialite.health.gt(0) || BHC[player.bh.celestialite.id].immortal)) {
            player.subtabs["bh"]["stuff"] = "bullet";
            if (!player.tempPaused) pauseUniverseAll(["BH"], "pause", true)
            options.fullscreen = true
        }

        // Run Loop
        this.running = true
        this.loop = setInterval(() => this.update(), 1000 / 60)
    }

    removeArena(damage = false, dead = false) {
        this.running = false;
        clearInterval(this.loop);
        for (let i = 0; i < this.exitActions.length; i++) {
            if (typeof this.exitActions[i] === "function") this.exitActions[i]()
        }
        if (!options.bhKeyboard) {
            window.removeEventListener('mousemove', this.mouseHandler);
            window.removeEventListener('touchmove', this.touchHandler);
            window.removeEventListener('click', this.clickHandler);
        } else {
            window.removeEventListener('keydown', this.keydownHandler);
            window.removeEventListener('keyup', this.keyupHandler);
            window.removeEventListener('click', this.clickHandler);
        }
        if (this.overlay) {
            document.body.removeChild(this.overlay)
            this.overlay = null
        }
        if (!dead) player.subtabs["bh"]["stuff"] = "battle"
        else player.subtabs["bh"]["stuff"] = "dead"
        if (player.tempPaused) pauseUniverseAll(["BH"], "unpause", true)
        player.universe = "U3"
        options.fullscreen = this.prevScreenState
        if (damage) bhAttack(Decimal.mul(player.bh.celestialite.damage, 3), 3, 0, "allPlayer", "<span style='color:#aa2798'>[BH] </span>")
    }

    newAction(values = {}, actions = {}, exitAction = () => {}) {
        // Modify arena
        if (values.arenaType) this.arenaType = values.arenaType
        this.arenaCanvas.style.background = values.arenaTransparent ? "rgba(0,0,0,0)" : "#111"
        if (!values.width) values.width = this.width
        if (!values.height) values.height = this.height
        this.width = values.width
        this.height = values.height
        this.arenaCanvas.width = values.width
        this.arenaCanvas.height = values.height
        this.arenaCanvas.style.left = `calc(50vw - ${values.width / 2}px)`
        this.arenaCanvas.style.top = `calc(50vh - ${values.height / 2}px)`
        if (this.arenaCanvas.width != window.innerWidth && this.arenaCanvas.height != window.innerHeight) {
            this.arenaCanvas.style.border = "2px solid #fff"
            this.arenaCanvas.style.borderRadius = "16px"
        } else {this.arenaCanvas.style.border = "0"; this.arenaCanvas.style.borderRadius = "0"}
        this.boxLeft = this.arenaCanvas.getBoundingClientRect().left
        this.boxTop = this.arenaCanvas.getBoundingClientRect().top

        // Misc Values
        if (values.timer) this.timer = values.timer
        if (values.timerTime) this.timerTime = values.timerTime

        // Subarena stuff
        this.subArena = values.subArena || false
        if (this.subArena) {
            this.subWidth = values.subWidth || 400
            this.subHeight = values.subHeight || 300
            this.subStart = values.subStart || "random"
            switch (this.subStart) {
                case "custom":
                    this.subx = values.subx || 0
                    this.suby = values.suby || 0
                    break;
                case "left":
                    this.subx = 0
                    this.suby = (this.height - this.subHeight) / 2
                    break;
                case "right":
                    this.subx = this.width - this.subWidth
                    this.suby = (this.height - this.subHeight) / 2
                    break;
                case "top":
                    this.subx = (this.width - this.subWidth) / 2
                    this.suby = 0
                    break;
                case "bottom":
                    this.subx = (this.width - this.subWidth) / 2
                    this.suby = 0
                    break;
                case "center":
                    this.subx = (this.width - this.subWidth) / 2
                    this.suby = (this.height - this.subHeight) / 2
                    break;
                default:
                    this.subx = Math.random() * (this.width - this.subWidth)
                    this.suby = Math.random() * (this.height - this.subHeight)
                    break;
            }
            this.subSpeed = values.subSpeed || 2.5
            this.subMove = values.subMove || "bounce"
            let subAngle = 0
            switch (this.subMove) {
                case "bounce": case "random":
                    subAngle = Math.random() * 2 * Math.PI
                    break;
                case "left":
                    subAngle = Math.PI
                    break;
                case "down":
                    subAngle = Math.PI / 2
                    break;
                case "up":
                    subAngle = Math.PI * 1.5
                    break;
                case "custom":
                    subAngle = values.subAngle
                    break;
            }
            this.subvx = Math.cos(subAngle) * this.subSpeed
            this.subvy = Math.sin(subAngle) * this.subSpeed
        } else {
            this.subWidth = null
            this.subHeight = null
            this.subStart = null
            this.subSpeed = null
            this.subMove = null
            this.subvx = null
            this.subvy = null
        }


        // Maze Moment
        if (!values.cellSize && this.cellSize) {
            this.cellSize = false
            this.maze = null
            this.mazeCols = null
            this.mazeRows = null
        } else if (values.cellSize && !this.cellSize || values.cellSize && values.cellSize != this.cellSize) {
            this.cellSize = values.cellSize
            this.mazeCols = Math.floor(this.width / this.cellSize)
            this.mazeRows = Math.floor(this.height / this.cellSize)
            this.maze = []
            for (let y = 0; y < this.mazeRows; y++) {
                this.maze[y] = [];
                for (let x = 0; x < this.mazeCols; x++) {
                    this.maze[y][x] = { x, y, visited: false, walls: [true, true, true, true] }; // top, right, bottom, left
                }
            }
            this.shuffle = (arr) => {
                for (let i = arr.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                }
                return arr;
            }
            this.carve = (x, y) => {
                this.maze[y][x].visited = true;
                const dirs = this.shuffle([[0, -1, 0], [1, 0, 1], [0, 1, 2], [-1, 0, 3]]); // [dx, dy, wall]
                for (const [dx, dy, wall] of dirs) {
                    const nx = x + dx, ny = y + dy;
                    if (ny >= 0 && ny < this.mazeRows && nx >= 0 && nx < this.mazeCols && !this.maze[ny][nx].visited) {
                        this.maze[y][x].walls[wall] = false;
                        this.maze[ny][nx].walls[(wall + 2) % 4] = false;
                        this.carve(nx, ny);
                    }
                }
            }
            this.carve(0, 0);
        }

        // Goalie
        this.goalSize = values.goalSize || 50
        this.goalAmt = values.goalAmt || 1
        this.goalAmtShow = values.goalAmtShow || false
        this.goalBehavior = values.goalBehavior || "normal"
        this.goalEnd = values.goalEnd || "leave"
        if (values.goalStart) {
            this.goalStart = values.goalStart
            this.positionGoal
        }

        // Modify Player
        if (values.soul) this.soul = values.soul
        if (values.pStart) {
            this.pStart = values.pStart
            let curWidth = this.subArena ? this.subWidth : this.width
            let curHeight = this.subArena ? this.subHeight : this.height
            switch (this.pStart) {
                case "maze":
                    this.px = this.cellSize / 2
                    this.py = this.cellSize / 2
                    break;
                case "custom":
                    this.px = values.px || 25
                    this.py = values.py || 25
                case "left":
                    this.px = 25
                    this.py = curHeight / 2
                    break;
                case "right":
                    this.px = curWidth - 25
                    this.py = curHeight / 2
                    break;
                case "top":
                    this.px = curWidth / 2
                    this.py = 25
                    break;
                case "bottom":
                    this.px = curWidth / 2
                    this.py = curHeight - 25
                    break;
                case "center":
                    this.px = curWidth / 2
                    this.py = curWidth / 2
                    break;
                default:
                    this.px = (Math.random() * (curWidth - 25)) + 25
                    this.py = (Math.random() * (curHeight - 25)) + 25
                    break
            }
        }
        if (values.pr) this.pr = values.pr
        if (values.pSpeed) this.pSpeed = values.pSpeed
        if (values.pGravity) this.pGravity = values.gravity
        if (values.jumpStrength) this.pJumpStrength = values.jumpStrength
        if (values.pJumpMin) this.pJumpMin = values.pJumpMin
        if (values.pJumpMax) this.pJumpMax = values.pJumpMax

        // Action setup and initial bullet spawn code
        Object.assign(this.actions, actions);
        for (let i in actions) {
            if (BHB[i].codeFunc) this.actions[i].codeFunc = BHB[i].codeFunc
            if (BHB[i].moveFunc) this.actions[i].moveFunc = BHB[i].moveFunc
            this.actions[i].lastTime = false

            if (this.actions[i].codeFunc) this.actions[i].codeFunc()
        }
        this.exitActions.push(exitAction)

        // Extend global duration if duration value
        if (values.duration) this.duration = this.duration + values.duration
    }

    updatePos(e, touch = false) {
        if (touch) e = e.touches[0]
        // Always track mouse position
        this.pos.x = e.clientX - this.boxLeft
        this.pos.y = e.clientY - this.boxTop
    }

    updateKeys(e, isDown) {
        if (["ArrowUp", "w", "W"].includes(e.key)) this.keys.up = isDown
        if (["ArrowDown", "s", "S"].includes(e.key)) this.keys.down = isDown
        if (["ArrowLeft", "a", "A"].includes(e.key)) this.keys.left = isDown
        if (["ArrowRight", "d", "D"].includes(e.key)) this.keys.right = isDown
        if (["Shift", "SHIFT"].includes(e.key)) this.keys.shift = isDown
    }

    mouseHandler(e) {
        if (bulletHellNeo) bulletHellNeo.updatePos(e)
        e.preventDefault()
    }

    touchHandler(e) {
        if (bulletHellNeo) bulletHellNeo.updatePos(e, true)
        e.preventDefault()
    }

    keydownHandler(e) {
        if (bulletHellNeo) {
            bulletHellNeo.updateKeys(e, true)
            if (e.key === "Control" || e.key === "control") {
                if (bulletHellNeo.soul == "blue") {
                    bulletHellNeo.soul = "red"
                } else if (bulletHellNeo.soul == "red") {
                    bulletHellNeo.soul = "blue"
                }
            }
            if (bulletHellNeo.soul == "blue" && bulletHellNeo.onGround && (e.code === "space" || e.key === " " || e.key === "Spacebar")) {
                const height = ((bulletHellNeo.pJumpMax ?? 220) - (bulletHellNeo.pJumpMin ?? 40));
                const g = Math.abs(bulletHellNeo.pGravity) || 0.6;
                const vy0 = Math.sqrt(2 * g * height);
                bulletHellNeo.pvy = -vy0;
                bulletHellNeo.onGround = false;
            }
        }
        e.preventDefault()
    }

    keyupHandler(e) {
        if (bulletHellNeo) bulletHellNeo.updateKeys(e, false)
        e.preventDefault()
    }

    clickHandler(e) {
        // Clicking jumps toward clicked horizontal position when in blueMode
        if (bulletHellNeo) {
            if (bulletHellNeo.soul == "blue") {
                const clickX = e.clientX - bulletHellNeo.boxLeft
                const clickY = e.clientY - bulletHellNeo.boxTop
                // vertical jump toward clicked Y using computed jump height
                if (bulletHellNeo.onGround) {
                    const dy = bulletHellNeo.py - clickY // positive if click is above
                    const absdy = Math.max(0, Math.min(dy, bulletHellNeo.height))
                    const factor = bulletHellNeo.height > 0 ? (absdy / bulletHellNeo.height) : 0
                    const jMin = bulletHellNeo.pJumpMin ?? 40
                    const jMax = bulletHellNeo.pJumpMax ?? 220
                    const height = jMin + factor * (jMax - jMin)
                    const g = Math.abs(bulletHellNeo.pGravity) || 0.6
                    const vy0 = Math.sqrt(2 * g * height)
                    bulletHellNeo.pvy = -vy0
                    bulletHellNeo.onGround = false
                }
                // nudge horizontal velocity toward click
                const dx = clickX - bulletHellNeo.px
                bulletHellNeo.pvx = (bulletHellNeo.pvx || 0) + dx * 0.08
                e.preventDefault()
                return
            }
            bulletHellNeo.updatePos(e)
        }
        e.preventDefault()
    }

    update() {
        let now = Date.now()
        this.delta = (now - this.time) / 1e3
        this.time = now

        // Check and end arena early if celestialite or all characters are dead
        if (player.tab == "bh") {
            if (player.bh.celestialite.id == "none" || (player.bh.celestialite.health.lte(0) && !BHC[player.bh.celestialite.id].immortal)) {this.removeArena()}
            if (this.allCharactersDead()) this.removeArena(false, true)
        }

        // Update arena position coordinates
        this.boxLeft = this.arenaCanvas.getBoundingClientRect().left
        this.boxTop = this.arenaCanvas.getBoundingClientRect().top

        // Move sub-arena (with DVD bounce logic)
        if (this.subArena) {
            this.subx += (this.subvx * 60 * this.delta);
            this.suby += (this.subvy * 60 * this.delta);
            if (this.subx <= 0) { this.subx = 0; this.subvx = Math.abs(this.subvx); }
            if (this.subx >= this.width - this.subWidth) { this.subx = this.width - this.subWidth; this.subvx = -Math.abs(this.subvx); }
            if (this.suby <= 0) { this.suby = 0; this.subvy = Math.abs(this.subvy); }
            if (this.suby >= this.height - this.subHeight) { this.suby = this.height - this.subHeight; this.subvy = -Math.abs(this.subvy); }
        }

        // Player Movement Code
        switch (this.soul) {
            case "blue":
                // Horizontal movement influenced by mouse X (this.pos.x) and keyboard arrows
                let targetX = this.pos.x || this.px;
                if (options.bhKeyboard) {
                    targetX = this.px
                    if (this.keys.left) targetX = this.px - 180;
                    if (this.keys.right) targetX = this.px + 180;
                }
                // Smooth horizontal movement plus velocity
                this.px += ((targetX - this.px) * 0.035 + (this.pvx || 0)) * 60 * this.delta;

                // Apply gravity
                this.pvy = (this.pvy || 0) + ((this.pGravity || 0.6) * 0.65 * 60 * this.delta);
                this.py += (this.pvy * 60 * this.delta);

                // Floor collision (respect subArena if used)
                let groundY = this.subArena ? (this.subHeight - this.pr) : (this.height - this.pr);
                if (this.py >= groundY) {
                    this.py = groundY;
                    this.pvy = 0;
                    this.onGround = true;
                } else {
                    this.onGround = false;
                }

                // Friction on horizontal velocity
                this.pvx *= 0.9;

                // Clamp positions
                if (this.subArena) {
                    if (options.bhKeyboard) {
                        this.px = Math.max(this.pr, Math.min(this.subWidth - this.pr, this.px));
                        this.py = Math.max(this.pr, Math.min(this.subHeight - this.pr, this.py))
                    } else {
                        this.px = Math.max(this.pr + this.subx, Math.min(this.subWidth + this.subx - this.pr, this.px));
                        this.py = Math.max(this.pr + this.suby, Math.min(this.subHeight + this.suby - this.pr, this.py))

                    }
                } else {
                    this.px = Math.max(this.pr, Math.min(this.arenaCanvas.width - this.pr, this.px));
                    this.py = Math.max(this.pr, Math.min(this.arenaCanvas.height - this.pr, this.py))
                }
                break;
            default:
                let dx = 0; let dy = 0;
                let timeMult = 60 * this.delta
                if (!options.bhKeyboard) {
                    dx = this.pos.x - this.px
                    dy = this.pos.y - this.py
                } else {
                    if (this.keys.up) dy -= (5 * timeMult)
                    if (this.keys.down) dy += (5 * timeMult)
                    if (this.keys.left) dx -= (5 * timeMult)
                    if (this.keys.right) dx += (5 * timeMult)
                }
                let angle = Math.atan2(dy, dx)
                if (dx < -3 * timeMult || dx > 3 * timeMult || dy < -3 * timeMult || dy > 3 * timeMult) {
                    let speed = this.keys.shift ? this.pSpeed / 2 : this.pSpeed
                    if (this.cellSize) {
                        let npx = this.px + Math.cos(angle) * speed, npy = this.py + Math.sin(angle) * speed;
                        // Try moving in both axes, then x only, then y only
                        if (this.canMoveTo(npx, npy)) {
                            this.px = npx; this.py = npy
                        } else if (this.canMoveTo(npx, this.py)) {
                            this.px = npx;
                        } else if (this.canMoveTo(this.px, npy)) {
                            this.py = npy
                        }
                    } else {
                        this.px += (Math.cos(angle) * speed * 60 * this.delta)
                        this.py += (Math.sin(angle) * speed * 60 * this.delta)
                    }
                    if (this.subArena) {
                        if (options.bhKeyboard) {
                            this.px = Math.max(this.pr, Math.min(this.subWidth - this.pr, this.px))
                            this.py = Math.max(this.pr, Math.min(this.subHeight - this.pr, this.py))
                        } else {
                            this.px = Math.max(this.pr + this.subx, Math.min(this.subWidth + this.subx - this.pr, this.px))
                            this.py = Math.max(this.pr + this.suby, Math.min(this.subHeight + this.suby - this.pr, this.py))
                        }
                    } else {
                        this.px = Math.max(this.pr, Math.min(this.arenaCanvas.width - this.pr, this.px))
                        this.py = Math.max(this.pr, Math.min(this.arenaCanvas.height - this.pr, this.py))
                    }
                }
                break;
        }

        // Check for reaching goal
        if (this.goalStart) {
            if (this.goalStart == "maze") {
                this.distToGoal = Math.sqrt((this.px - (this.goal.x * this.goal.d + this.goal.d / 2)) ** 2 + (this.py - (this.goal.y * this.goal.d + this.goal.d / 2)) ** 2);
            } else {
                if (this.subArena) {
                    this.distToGoal = Math.sqrt((this.px + this.subx - this.goal.x) ** 2 + (this.py + this.suby - this.goal.y) ** 2);
                } else {
                    this.distToGoal = Math.sqrt((this.px - this.goal.x) ** 2 + (this.py - this.goal.y) ** 2);
                }
            }
            if (this.distToGoal < this.goalRadius) {
                switch (this.goalBehavior) {
                    case "heal":
                        bhHeal(player.bh.celestialite.damage, 3, 0, "randomPlayer")
                        break;
                    case "damage":
                        bhAttack(player.bh.celestialite.damage.mul(0.5), 3, 0, "randomPlayer", "<span style='color:#aa2798'>[BH] </span>")
                        break;
                }
                if (this.goalAmt <= 1) {
                    if (this.goalEnd == "leave") {this.removeArena()}
                    else {this.goalStart = null; this.goal = null}
                } else {
                    this.goalAmt -= 1
                    this.positionGoal()
                }
            }
        }

        // Action update functions
        for (let i in this.actions) {
            if (this.actions[i].moveFunc) this.actions[i].moveFunc()
            if (this.actions[i].duration && this.actions[i].duration >= -999) {
                if (this.actions[i].duration <= 0) {
                    if (this.actions[i].endAction) this.actions[i].endAction()
                    delete this.actions[i]
                } else if (this.actions[i].duration > 0) Math.max(this.actions[i].duration -= this.delta, 0)
            }
        }
        if (Object.keys(this.actions).length <= 0) this.removeArena()

        // Move bullets and do generic actions
        for (let b of this.bullets) {
            b.x += b.vx * 60 * this.delta;
            b.y += b.vy * 60 * this.delta;
            let boxL = b.boxRender ? 0 : this.boxLeft, boxT = b.boxRender ? 0 : this.boxTop
            if (b.bouncy) {
                // Bounce off walls
                if (b.x < b.r + boxL) {b.x = b.r + boxL; b.vx *= -1; if (b.angle) b.angle = Math.PI-b.angle}
                if (b.x > bulletHellNeo.width - b.r + boxL) {b.x = bulletHellNeo.width - b.r + boxL; b.vx *= -1; if (b.angle) b.angle = Math.PI-b.angle}
                if (b.y < b.r + boxT) {b.y = b.r + boxT; b.vy *= -1; if (b.angle) b.angle = -b.angle}
                if (b.y > bulletHellNeo.height - b.r + boxT) {b.y = bulletHellNeo.height - b.r + boxT; b.vy *= -1; if (b.angle) b.angle = -b.angle}
            }
        }

        // Remove bullets that go off screen
        this.bullets = this.bullets.filter(b => {
            if (b.offScreen) {
                let leeway = b.leeway ? b.leeway + b.r : b.r
                return b.x > -this.boxLeft - leeway && b.x < this.boxLeft + this.width + leeway && b.y > -this.boxTop - leeway && b.y < this.boxTop + this.height + leeway
            }
            if (b.name && (b.name == "bomb" || b.name == "minibomb") && b.exploded) return false
            if (b.name && (b.name == "knife" || b.name == "bigKnife")) {
                return b.x > -b.r && b.x < this.width + b.r && b.y > -b.r && b.y < this.height + b.r
            }
            return b.x > -b.r && b.x < window.innerWidth + b.r && b.y > -b.r && b.y < window.innerHeight + b.r
        });

        // Only call takeDamage once per frame if hit
        let playerHit = false;
        let hitByBigKnife = false;

        // Check collision between player and each bullet
        for (let b of this.bullets) {
            let playerX = this.px
            let playerY = this.py
            if (this.subArena && options.bhKeyboard) {playerX += this.subx; playerY += this.suby}
            if (b.name && b.name == "knife") {
                // Knife is a rectangle, check if player is within knife's rectangle (approximate as line segment + width)
                const cx = b.x + Math.cos(b.angle) * b.r / 2;
                const cy = b.y + Math.sin(b.angle) * b.r / 2;
                const dx = Math.cos(b.angle), dy = Math.sin(b.angle);
                // Project player onto knife axis
                const t = ((playerX - b.x) * dx + (playerY - b.y) * dy);
                if (t >= -b.r+this.pr && t <= b.r - this.pr) {
                    // Perpendicular distance
                    const perp = Math.abs((playerX - b.x) * dy - (playerY - b.y) * dx);
                    if (perp < this.pr + b.width / 2) {
                        playerHit = true;
                        break;
                    }
                }
            } else if (b.name && b.name == "bigKnife") {
                const playerGlobalX = this.boxLeft + playerX;
                const playerGlobalY = this.boxTop + playerY;
                const x1 = (Math.cos(b.angle) * (-(b.r + this.pr) / 2)) - (Math.sin(b.angle) * (-(b.width + this.pr) / 2)) + b.x;
                const y1 = (Math.sin(b.angle) * (-(b.r + this.pr) / 2)) + (Math.cos(b.angle) * (-(b.width + this.pr) / 2)) + b.y;
                const x2 = (Math.cos(b.angle) * ((b.r + this.pr) / 2)) + b.x;
                const y2 = (Math.sin(b.angle) * ((b.r + this.pr) / 2)) + b.y;
                const x3 = (Math.cos(b.angle) * (-(b.r + this.pr) / 2)) - (Math.sin(b.angle) * ((b.width + this.pr) / 2)) + b.x;
                const y3 = (Math.sin(b.angle) * (-(b.r + this.pr) / 2)) + (Math.cos(b.angle) * ((b.width + this.pr) / 2)) + b.y;
                const dist = this.pointToTriangleDistance(playerGlobalX, playerGlobalY, x1, y1, x2, y2, x3, y3);
                if (dist <= this.pr) {
                    playerHit = true;
                    hitByBigKnife = true;
                    break;
                }
            } else if (b.boxRender) {
                const dx = playerX - b.x;
                const dy = playerY - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist <= (this.pr + b.r)) {
                    playerHit = true;
                    break;
                }
            } else {
                const dx = (this.boxLeft + playerX) - b.x;
                const dy = (this.boxTop + playerY) - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist <= (this.pr + b.r)) {
                    playerHit = true;
                    break;
                }
            }
        }

        // Consider platform/spike hits set by attacks
        if (this.platformHit) {
            playerHit = true;
            this.platformHit = false;
        }

        // Take damage (only when in a BH stage)
        if (playerHit && player && player.bh && player.bh.currentStage && player.bh.currentStage != "none" && this.invTime <= 0) {
            this.invTime = 0.3
            bhAttack(player.bh.celestialite.damage.mul(0.25), 3, 0, "randomPlayer", "<span style='color:#aa2798'>[BH] </span>")
        }
        if (this.invTime > 0) Math.max(this.invTime -= this.delta, 0)

        // Timer Stuff
        if (this.timer) {
            if (this.timerTime <= 0) {
                if (this.timer == "endDamage") this.removeArena(true)
                if (this.timer == "end") this.removeArena()
            }
            if (this.timerTime > 0) Math.max(this.timerTime -= this.delta, 0)
        }

        // Duration Stuff
        if (this.duration >= -999) {
            if (this.duration <= 0) this.removeArena()
            if (this.duration > 0) Math.max(this.duration -= this.delta, 0)
        }

        this.draw()
    }

    draw() {
        // =-- Start enemy canvas draw --=
        this.enemyCtx.clearRect(0, 0, this.enemyCanvas.width, this.enemyCanvas.height)

        // Draw enemy canvas bullets
        this.enemyCtx.save()
        if (!options.performanceMode) this.enemyCtx.shadowColor = "#fff"
        if (!options.performanceMode) this.enemyCtx.shadowBlur = 8
        for (let b of this.bullets) {
            if (b.boxRender) continue
            b.draw(b, this.enemyCtx)
        }
        this.enemyCtx.restore()

        // =-- Start arena canvas draw --=
        this.arenaCtx.clearRect(0, 0, this.arenaCanvas.width, this.arenaCanvas.height)

        // Draw Sub Arena
        if (this.subArena) {
            // Draw the full arena border (Large arena, dashed and glowing)
            this.arenaCtx.save()
            this.arenaCtx.strokeStyle = "#fff"
            this.arenaCtx.lineWidth = 4
            if (!options.performanceMode) this.arenaCtx.shadowColor = "#fff"
            if (!options.performanceMode) this.arenaCtx.shadowBlur = 12
            this.arenaCtx.setLineDash([16, 12])
            this.arenaCtx.strokeRect(0, 0, this.width, this.height)
            this.arenaCtx.setLineDash([])
            this.arenaCtx.restore()

            // Draw the sub-arena (solid, glowing)
            this.arenaCtx.save()
            this.arenaCtx.strokeStyle = "#0ff"
            this.arenaCtx.lineWidth = 4
            if (!options.performanceMode) this.arenaCtx.shadowColor = "#0ff"
            if (!options.performanceMode) this.arenaCtx.shadowBlur = 16
            this.arenaCtx.strokeRect(this.subx, this.suby, this.subWidth, this.subHeight)
            this.arenaCtx.restore()
        }

        // Draw maze
        if (this.cellSize) {
            this.arenaCtx.save();
            this.arenaCtx.strokeStyle = this.soul == "blue" ? "#888" : "#fff";
            this.arenaCtx.lineWidth = this.soul == "blue" ? 2 : 3;
            for (let y = 0; y < this.mazeRows; y++) {
                for (let x = 0; x < this.mazeCols; x++) {
                    const cell = this.maze[y][x];
                    const sx = x * this.cellSize, sy = y * this.cellSize;
                    if (cell.walls[0]) { // top
                        this.arenaCtx.beginPath(); this.arenaCtx.moveTo(sx, sy); this.arenaCtx.lineTo(sx + this.cellSize, sy); this.arenaCtx.stroke();
                    }
                    if (cell.walls[1]) { // right
                        this.arenaCtx.beginPath(); this.arenaCtx.moveTo(sx + this.cellSize, sy); this.arenaCtx.lineTo(sx + this.cellSize, sy + this.cellSize); this.arenaCtx.stroke();
                    }
                    if (cell.walls[2]) { // bottom
                        this.arenaCtx.beginPath(); this.arenaCtx.moveTo(sx + this.cellSize, sy + this.cellSize); this.arenaCtx.lineTo(sx, sy + this.cellSize); this.arenaCtx.stroke();
                    }
                    if (cell.walls[3]) { // left
                        this.arenaCtx.beginPath(); this.arenaCtx.moveTo(sx, sy + this.cellSize); this.arenaCtx.lineTo(sx, sy); this.arenaCtx.stroke();
                    }
                }
            }
        }

        // Draw Goal
        if (this.goalStart) {
            if (this.goalStart == "maze") {
                this.arenaCtx.save();
                this.arenaCtx.beginPath();
                this.arenaCtx.arc(this.goal.x * this.goal.d + this.goal.d / 2, this.goal.y * this.goal.d + this.goal.d / 2, this.goalRadius, 0, 2 * Math.PI);
                this.arenaCtx.fillStyle = "#2f4";
                if (!options.performanceMode) this.arenaCtx.shadowColor = "#2f4";
                if (!options.performanceMode) this.arenaCtx.shadowBlur = 16;
                this.arenaCtx.fill();
                this.arenaCtx.restore();
            } else {
                this.arenaCtx.save();
                this.arenaCtx.beginPath();
                this.arenaCtx.arc(this.goal.x, this.goal.y, this.goalRadius, 0, 2 * Math.PI);
                let goalColor = "#2f4"
                if (this.goalBehavior == "heal") goalColor = "#8f8"
                if (this.goalBehavior == "damage") goalColor = "#cfc"
                this.arenaCtx.fillStyle = goalColor;
                if (!options.performanceMode) this.arenaCtx.shadowColor = goalColor;
                if (!options.performanceMode) this.arenaCtx.shadowBlur = 16;
                this.arenaCtx.fill();
                this.arenaCtx.restore();
            }
            if (this.goalAmtShow) {
                this.arenaCtx.save();
                this.arenaCtx.font = 'bold 24px monospace';
                this.arenaCtx.textAlign = 'left';
                this.arenaCtx.textBaseline = 'top';
                this.arenaCtx.fillStyle = '#fff';
                if (!options.performanceMode) this.arenaCtx.shadowColor = '#000';
                if (!options.performanceMode) this.arenaCtx.shadowBlur = 6;
                this.arenaCtx.fillText(`Goals: ${formatWhole(this.goalAmtShow - this.goalAmt)}/${formatWhole(this.goalAmtShow)}`, 10, 10);
                this.arenaCtx.restore();
                this.arenaCtx.restore();
            }
        }
        
        // Draw Timer
        if (this.timer) {
            this.arenaCtx.save();
            this.arenaCtx.font = 'bold 32px monospace';
            this.arenaCtx.textAlign = 'center';
            this.arenaCtx.textBaseline = 'top';
            this.arenaCtx.fillStyle = this.timerTime <= 3 ? '#f44' : '#fff';
            if (!options.performanceMode) this.arenaCtx.shadowColor = '#000';
            if (!options.performanceMode) this.arenaCtx.shadowBlur = 6;
            this.arenaCtx.fillText(`Time Left: ${format(this.timerTime)}s`, this.width / 2, 10);
            this.arenaCtx.restore();
            this.arenaCtx.restore();
        }

        // Draw arena bullets
        this.arenaCtx.save()
        for (let b of this.bullets) {
            if (b.boxRender) {
                b.draw(b, this.arenaCtx)
            }
        }

        // Draw sliding platforms and ground spikes if present
        if (this.platforms && this.platforms.length) {
            for (let p of this.platforms) {
                this.arenaCtx.save();
                this.arenaCtx.fillStyle = p.color || '#888';
                if (!options.performanceMode) {
                    this.arenaCtx.shadowColor = '#000';
                    this.arenaCtx.shadowBlur = 8;
                }
                this.arenaCtx.fillRect(p.x, p.y, p.w, p.h);
                // Draw spikes on top of platform if present
                if (p.hasSpikes) {
                    this.arenaCtx.fillStyle = p.spikeColor || '#ddd';
                    const spW = p.spikeW || 12;
                    const spH = p.spikeH || 12;
                    for (let sx = p.x; sx < p.x + p.w; sx += spW) {
                        this.arenaCtx.beginPath();
                        this.arenaCtx.moveTo(sx, p.y);
                        this.arenaCtx.lineTo(Math.min(sx + spW / 2, p.x + p.w), p.y - spH);
                        this.arenaCtx.lineTo(Math.min(sx + spW, p.x + p.w), p.y);
                        this.arenaCtx.closePath();
                        this.arenaCtx.fill();
                    }
                }
                this.arenaCtx.restore();
            }
        }
        if (this.spikes && this.spikes.length) {
            this.arenaCtx.save();
            this.arenaCtx.fillStyle = '#ddd';
            for (let s of this.spikes) {
                const sx = s.x, sy = s.y, sw = s.w, sh = s.h;
                this.arenaCtx.beginPath();
                this.arenaCtx.moveTo(sx, sy + sh);
                this.arenaCtx.lineTo(sx + sw / 2, sy);
                this.arenaCtx.lineTo(sx + sw, sy + sh);
                this.arenaCtx.closePath();
                this.arenaCtx.fill();
            }
            this.arenaCtx.restore();
        }

        // Draw player in arena
        if (this.subArena && options.bhKeyboard) {
            this.arenaCtx.translate(this.subx + this.px, this.suby + this.py)
        } else {
            this.arenaCtx.translate(this.px, this.py)
        }
        if (this.invTime > 0) this.arenaCtx.scale(0.9, 0.9)
        this.arenaCtx.rotate(Math.PI / 2)
        this.arenaCtx.beginPath()
        this.arenaCtx.moveTo(0, -this.pr)
        this.arenaCtx.lineTo(this.pr, 0)
        this.arenaCtx.lineTo(0, this.pr)
        this.arenaCtx.lineTo(-this.pr, 0)
        this.arenaCtx.closePath()
        // Decide player color
        let color = ["#e22", "#a61717", "#811", "#5f0b0b"]
        if (this.soul == "blue") color = ["#22a", "#171776", "#116", "#0b0b47"]
        // Finish player drawing
        this.arenaCtx.fillStyle = this.invTime > 0 ? color[2] : color[0]
        this.arenaCtx.strokeStyle = this.invTime > 0 ? color[3] : color[1]
        this.arenaCtx.lineWidth = this.pr / 9
        if (!options.performanceMode) this.arenaCtx.shadowColor = this.invTime > 0 ? color[2] : color[0]
        if (!options.performanceMode) this.arenaCtx.shadowBlur = this.pr / 2;
        this.arenaCtx.fill()
        this.arenaCtx.stroke()
        this.arenaCtx.restore()
    }

    // Function that figures out if death is yes
    allCharactersDead = () => {
        if (!player || !player.bh || !player.bh.characters) return true;
        for (let i = 0; i < 3; i++) {
            if (player.bh.characters[i].id != "none" && Decimal.gt(player.bh.characters[i].health, 0)) return false
        }
        return true;
    }

    // Function to position the goal
    positionGoal() {
        switch (this.goalStart) {
            case false:
                break;
            case "maze":
                this.goal = {x: this.mazeCols - 1, y: this.mazeRows - 1, d: this.cellSize}
                this.goalRadius = this.cellSize / 2 - 6
                break;
            case "custom":
                this.goal = {x: values.goalx || this.goalSize, y: values.goaly || this.goalSize, d: this.goalSize}
                this.goalRadius = this.goalSize / 2 - 6
                break;
            case "left":
                this.goal = {x: this.goalSize, y: this.height / 2, d: this.goalSize}
                this.goalRadius = this.goalSize / 2 - 6
                break;
            case "right":
                this.goal = {x: this.width - (this.goalSize*2), y: this.height / 2, d: this.goalSize}
                this.goalRadius = this.goalSize / 2 - 6
                break;
            case "top":
                this.goal = {x: this.width / 2, y: this.goalSize, d: this.goalSize}
                this.goalRadius = this.goalSize / 2 - 6
                break;
            case "bottom":
                this.goal = {x: this.width / 2, y: this.height - (this.goalSize*2), d: this.goalSize}
                this.goalRadius = this.goalSize / 2 - 6
                break;
            case "center":
                this.goal = {x: this.width / 2, y: this.height / 2, d: this.goalSize}
                this.goalRadius = this.goalSize / 2 - 6
                break;
            default:
                this.goal = {x: (Math.random() * (this.width - (this.goalSize*2)) + this.goalSize), y: (Math.random() * (this.height - (this.goalSize*2)) + this.goalSize), d: this.goalSize}
                this.goalRadius = this.goalSize / 2 - 6
                break;
        }
    }

    // Functions to calculate accurate triangle collision
    triangleArea = (x1, y1, x2, y2, x3, y3) => {
        return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2);
    }
    isPointInTriangle = (px, py, x1, y1, x2, y2, x3, y3) => {
        const originalArea = this.triangleArea(x1, y1, x2, y2, x3, y3);

        const area1 = this.triangleArea(px, py, x2, y2, x3, y3);
        const area2 = this.triangleArea(x1, y1, px, py, x3, y3);
        const area3 = this.triangleArea(x1, y1, x2, y2, px, py);

        return Math.abs(originalArea - (area1 + area2 + area3)) < 10;
    }
    pointToSegmentDist = (px, py, x1, y1, x2, y2) => {
        const vx = x2 - x1, vy = y2 - y1;
        const wx = px - x1, wy = py - y1;
        const c = (vx * wx + vy * wy) / (vx * vx + vy * vy || 1);
        const t = Math.max(0, Math.min(1, c));
        const qx = x1 + vx * t, qy = y1 + vy * t;
        const dx = px - qx, dy = py - qy;
        return Math.sqrt(dx * dx + dy * dy);
    }
    pointToTriangleDistance = (px, py, x1, y1, x2, y2, x3, y3) => {
        if (this.isPointInTriangle(px, py, x1, y1, x2, y2, x3, y3)) return 0;
        const d1 = this.pointToSegmentDist(px, py, x1, y1, x2, y2);
        const d2 = this.pointToSegmentDist(px, py, x2, y2, x3, y3);
        const d3 = this.pointToSegmentDist(px, py, x3, y3, x1, y1);
        return Math.min(d1, d2, d3);
    }

    // Function for pixel-perfect wall collision in maze
    canMoveTo(nx, ny) {
        // nx,ny: new player center (float, px)
        if (nx - this.pr < 0 || nx + this.pr > this.width || ny - this.pr < 0 || ny + this.pr > this.height) return false;
        // Find which cell the center is in
        let cx = Math.floor(nx / this.cellSize), cy = Math.floor(ny / this.cellSize);
        if (cx < 0 || cy < 0 || cx >= this.mazeCols || cy >= this.mazeRows) return false;
        const cell = this.maze[cy][cx];
        // Check each direction for wall collision
        // Top wall
        if (cell.walls[0] && ny - this.pr < cy * this.cellSize) return false;
        // Bottom wall
        if (cell.walls[2] && ny + this.pr > (cy + 1) * this.cellSize) return false;
        // Left wall
        if (cell.walls[3] && nx - this.pr < cx * this.cellSize) return false;
        // Right wall
        if (cell.walls[1] && nx + this.pr > (cx + 1) * this.cellSize) return false;
        // Also check adjacent cells if overlapping their walls
        // Up
        if (ny - this.pr < cy * this.cellSize && cy > 0) {
            const upCell = this.maze[cy - 1][cx];
            if (upCell.walls[2]) return false;
        }
        // Down
        if (ny + this.pr > (cy + 1) * this.cellSize && cy < this.mazeRows - 1) {
            const downCell = this.maze[cy + 1][cx];
            if (downCell.walls[0]) return false;
        }
        // Left
        if (nx - this.pr < cx * this.cellSize && cx > 0) {
            const leftCell = this.maze[cy][cx - 1];
            if (leftCell.walls[1]) return false;
        }
        // Right
        if (nx + this.pr > (cx + 1) * this.cellSize && cx < this.mazeCols - 1) {
            const rightCell = this.maze[cy][cx + 1];
            if (rightCell.walls[3]) return false;
        }
        return true;
    }

    // Function to shoot a bullet that goes towards the player at coordinates
    shootAtPlayer = (bx, by, id, speed = 5, bulletType = "ball") => {
        // Calculate direction from boss to player (relative to the box)
        let playerGlobalX = this.boxLeft + this.px;
        let playerGlobalY = this.boxTop + this.py;
        if (this.subArena && options.bhKeyboard) {
            playerGlobalX += this.subx
            playerGlobalY += this.suby
        }
        const dx = playerGlobalX - bx;
        const dy = playerGlobalY - by;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const bulletRadius = this.actions[id].bulletRadius ?? 10
        if (dist === 0) return;
        switch (bulletType) {
            case "ball":
                this.bullets.push({
                    x: bx,
                    y: by,
                    vx: (dx / dist) * speed,
                    vy: (dy / dist) * speed,
                    r: bulletRadius,
                    draw(b, bossCtx) {
                        bossCtx.beginPath();
                        bossCtx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);
                        bossCtx.fillStyle = "#fff";
                        bossCtx.fill();
                    },
                });
                break;
            case "spike":
                this.bullets.push({
                    x: bx,
                    y: by,
                    vx: (dx / dist) * speed,
                    vy: (dy / dist) * speed,
                    r: bulletRadius,
                    draw(b, bossCtx) {
                        bossCtx.save();
                        bossCtx.translate(b.x, b.y);
                        bossCtx.rotate(Math.atan2(b.vy, b.vx));
                        // triangle
                        bossCtx.beginPath();
                        bossCtx.moveTo(b.r, 0);
                        bossCtx.lineTo(-b.r * 0.6, b.r * 0.7);
                        bossCtx.lineTo(-b.r * 0.6, -b.r * 0.7);
                        bossCtx.closePath();
                        bossCtx.fillStyle = "#fff";
                        bossCtx.fill();
                        bossCtx.lineWidth = 2;
                        bossCtx.strokeStyle = "#000";
                        bossCtx.stroke();
                        bossCtx.restore();
                    }
                });

        }
    }

    // Function to fire a radial burst at coordinates
    fireRadialBurst = (bx, by, id) => {
        for (let i = 0; i < this.actions[id].bulletsPerBurst; i++) {
            const angle = (2 * Math.PI * i) / this.actions[id].bulletsPerBurst;
            this.bullets.push({
                x: bx,
                y: by,
                vx: Math.cos(angle) * this.actions[id].bulletSpeed,
                vy: Math.sin(angle) * this.actions[id].bulletSpeed,
                r: 12,
                draw(b, bossCtx) {
                    bossCtx.beginPath();
                    bossCtx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);
                    bossCtx.fillStyle = "#fff";
                    bossCtx.fill();
                },
            });
        }
    }

    // Function to fire a radial burst of spikes at coordinates
    fireDiceSpikeRadialBurst = (bx, by, id) => {
        for (let i = 0; i < this.actions[id].bulletsPerBurst; i++) {
            const angle = (2 * Math.PI * i) / this.actions[id].bulletsPerBurst;
            this.bullets.push({
                x: bx,
                y: by,
                vx: Math.cos(angle) * this.actions[id].bulletSpeed,
                vy: Math.sin(angle) * this.actions[id].bulletSpeed,
                r: 30,
                // triangular spike that points along velocity
                color: Math.random() < 0.5 ? '#000' : '#fff',
                draw(b, bossCtx) {
                    const angle = Math.atan2(b.vy, b.vx);
                    bossCtx.save();
                    bossCtx.translate(b.x, b.y);
                    bossCtx.rotate(angle);
                    // triangle
                    bossCtx.beginPath();
                    bossCtx.moveTo(b.r, 0);
                    bossCtx.lineTo(-b.r * 0.6, b.r * 0.7);
                    bossCtx.lineTo(-b.r * 0.6, -b.r * 0.7);
                    bossCtx.closePath();
                    bossCtx.fillStyle = b.color;
                    bossCtx.fill();
                    bossCtx.lineWidth = 2;
                    bossCtx.strokeStyle = (b.color === '#000') ? '#fff' : '#000';
                    bossCtx.stroke();
                    bossCtx.restore();
                }
            });
        }
    }

    // Function that shoots spread of bullets at coordinates
    shootSpreadAtPlayer = (bx, by, id) => {
        let dx = this.px - bx + this.boxLeft;
        let dy = this.py - by + this.boxTop;
        let baseAngle = Math.atan2(dy, dx);
        for (let i = 0; i < this.actions[id].spreadCount; i++) {
            let angle = baseAngle + (i - (this.actions[id].spreadCount - 1) / 2) * (this.actions[id].spreadAngle / (this.actions[id].spreadCount - 1));
            let vx = Math.cos(angle) * this.actions[id].bulletSpeed;
            let vy = Math.sin(angle) * this.actions[id].bulletSpeed;
            this.bullets.push({
                x: bx,
                y: by,
                r: 12,
                vx: vx,
                vy: vy,
                draw(b, bossCtx) {
                    bossCtx.beginPath();
                    bossCtx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);
                    bossCtx.fillStyle = "#fff";
                    bossCtx.fill();
                }
            });
        }
    }

    // Function that shoots spiral from coordinates
    spawnSpiralProjectile = (bx, by, br, id) => {
        // Alternate between bullet and knife
        let isKnife = this.actions[id].spiralKnives && (!this.actions[id].spiralBullets || (Math.floor(this.actions[id].spiralAngle/(Math.PI*2)) % 2 === 0));
        let angle = this.actions[id].spiralAngle;
        let speed = this.actions[id].bulletSpeed;
        let x = bx + Math.cos(angle) * br;
        let y = by + Math.sin(angle) * br;
        if (isKnife) {
            let bname = "knife"
            if (this.actions[id].knifeLength >= 100 || this.actions[id].knifeWidth >= 25) bname = "bigKnife"
            this.bullets.push({
                name: bname,
                x: x,
                y: y,
                r: this.actions[id].knifeLength,
                width: this.actions[id].knifeWidth,
                angle: angle,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                draw(b, bossCtx) {
                    // Draw path line (red, thin)
                    bossCtx.save();
                    bossCtx.strokeStyle = '#f22';
                    bossCtx.lineWidth = 2;
                    bossCtx.beginPath();
                    bossCtx.moveTo(b.x, b.y);
                    // Draw line in the direction of the knife, long enough to cross the arena
                    let farX = b.x + Math.cos(b.angle) * (this.width + this.height);
                    let farY = b.y + Math.sin(b.angle) * (this.width + this.height);
                    bossCtx.lineTo(farX, farY);
                    bossCtx.stroke();
                    bossCtx.restore();
                    // Draw knife
                    bossCtx.save();
                    bossCtx.translate(b.x, b.y);
                    bossCtx.rotate(b.angle);
                    bossCtx.beginPath();
                    bossCtx.moveTo(-b.r / 2, -b.width / 2);
                    bossCtx.lineTo(b.r / 2, 0);
                    bossCtx.lineTo(-b.r / 2, b.width / 2);
                    bossCtx.closePath();
                    bossCtx.fillStyle = '#ccc';
                    if (!options.performanceMode) bossCtx.shadowColor = '#fff';
                    if (!options.performanceMode) bossCtx.shadowBlur = 6;
                    bossCtx.fill();
                    bossCtx.restore();
                },
            })
        } else {
            this.bullets.push({
                x: x,
                y: y,
                r: 12,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                draw(b, bossCtx) {
                    bossCtx.beginPath();
                    bossCtx.arc(b.x, b.y, b.r, 0, 2 * Math.PI);
                    bossCtx.fillStyle = "#fff";
                    bossCtx.fill();
                },
            })
        }
    }

    // Function that spawns a knife at arena border
    spawnKnife = (id) => {
        // Pick a random edge and a random point on that edge
        const edge = Math.floor(Math.random() * 4); // 0=top, 1=right, 2=bottom, 3=left
        let bx, by, angle;
        if (edge === 0) { // top
            bx = Math.random() * this.width;
            by = -this.actions[id].knifeLength;
            angle = Math.random() * Math.PI + Math.PI / 2; // downwards, but can be angled
        } else if (edge === 1) { // right
            bx = this.width + this.actions[id].knifeLength;
            by = Math.random() * this.height;
            angle = Math.random() * Math.PI + Math.PI; // leftwards
        } else if (edge === 2) { // bottom
            bx = Math.random() * this.width;
            by = this.height + this.actions[id].knifeLength;
            angle = Math.random() * Math.PI - Math.PI / 2; // upwards
        } else { // left
            bx = -this.actions[id].knifeLength;
            by = Math.random() * this.height;
            angle = Math.random() * Math.PI; // rightwards
        }
        // Optionally, bias angle toward player
        if (Math.random() < 0.7) {
            let dx = this.px - bx;
            let dy = this.py - by;
            if (this.subArena && options.bhKeyboard) {
                dx += this.subx
                dy += this.suby
            }
            angle = Math.atan2(dy, dx);
        }
        // Store initial spawn for path line
        let bname = "knife"
        if (this.actions[id].knifeLength >= 100 || this.actions[id].knifeWidth >= 25) bname = "bigKnife"
        this.bullets.push({
            name: bname,
            boxRender: true, // RENDER IN BOX
            x: bx,
            y: by,
            angle: angle,
            r: this.actions[id].knifeLength,
            width: this.actions[id].knifeWidth,
            vx: Math.cos(angle) * this.actions[id].enemySpeed,
            vy: Math.sin(angle) * this.actions[id].enemySpeed,
            draw(b, bossCtx) {
                // Draw path line (red, thin)
                bossCtx.save();
                bossCtx.strokeStyle = '#f22';
                bossCtx.lineWidth = 2;
                bossCtx.beginPath();
                bossCtx.moveTo(b.x, b.y);
                // Draw line in the direction of the knife, long enough to cross the arena
                let farX = b.x + Math.cos(b.angle) * (this.width + this.height);
                let farY = b.y + Math.sin(b.angle) * (this.width + this.height);
                bossCtx.lineTo(farX, farY);
                bossCtx.stroke();
                bossCtx.restore();
                // Draw knife
                bossCtx.save();
                bossCtx.translate(b.x, b.y);
                bossCtx.rotate(b.angle);
                bossCtx.beginPath();
                bossCtx.moveTo(-b.r / 2, -b.width / 2);
                bossCtx.lineTo(b.r / 2, 0);
                bossCtx.lineTo(-b.r / 2, b.width / 2);
                bossCtx.closePath();
                bossCtx.fillStyle = '#ccc';
                if (!options.performanceMode) bossCtx.shadowColor = '#fff';
                if (!options.performanceMode) bossCtx.shadowBlur = 6;
                bossCtx.fill();
                bossCtx.restore();
            }
        })
    }

    // Function that fires a knife burst at player from arena borders
    fireKnifeBurst = (id) => {
        // Knives are thrown from far outside the arena, all aimed at the current player position
        let centerX = this.px;
        let centerY = this.py;
        if (this.subArena && options.bhKeyboard) {
            centerX += this.subx
            centerY += this.suby
        }
        const spawnRadius = Math.max(this.width, this.height) * 0.75 + 200; // farther than arena edge
        for (let i = 0; i < this.actions[id].bulletsPerBurst; i++) {
            const angle = (2 * Math.PI * i) / this.actions[id].bulletsPerBurst;
            // Spawn far away in a ring
            const spawnX = centerX + Math.cos(angle) * spawnRadius;
            const spawnY = centerY + Math.sin(angle) * spawnRadius;
            // Aim at the current player position
            const dx = centerX - spawnX;
            const dy = centerY - spawnY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const knifeAngle = Math.atan2(dy, dx);
            let bname = "knife"
            if (this.actions[id].knifeLength >= 100 || this.actions[id].knifeWidth >= 25) bname = "bigKnife"
            this.bullets.push({
                name: bname,
                boxRender: true, // RENDER IN BOX
                offScreen: true, // Bullets can be off screen
                leeway: 200, // Offscreen lee-way for bullets
                x: spawnX,
                y: spawnY,
                angle: knifeAngle,
                r: this.actions[id].knifeLength,
                width: this.actions[id].knifeWidth,
                vx: (dx / dist) * this.actions[id].enemySpeed,
                vy: (dy / dist) * this.actions[id].enemySpeed,
                timer: Date.now() - 500,
                draw(b, bossCtx) {
                    // Draw path line (red, thin) if knife is on screen, or if it left within the last 500ms
                    let knifeOnScreen = (
                        b.x > 0 && b.x < this.width &&
                        b.y > 0 && b.y < this.height
                    );
                    if (knifeOnScreen) {
                        b.timer = Date.now();
                    }
                    if (Date.now() - b.timer < 500) {
                        // Draw path line (red, thin)
                        bossCtx.save();
                        bossCtx.strokeStyle = '#f22';
                        bossCtx.lineWidth = 2;
                        bossCtx.beginPath();
                        bossCtx.moveTo(b.x, b.y);
                        // Draw line in the direction of the knife, long enough to cover the screen
                        let farX = b.x + Math.cos(b.angle) * 5000;
                        let farY = b.y + Math.sin(b.angle) * 5000;
                        bossCtx.lineTo(farX, farY);
                        bossCtx.stroke();
                        bossCtx.restore();
                    }
                    // Draw knife
                    bossCtx.save();
                    bossCtx.translate(b.x, b.y);
                    bossCtx.rotate(b.angle);
                    bossCtx.beginPath();
                    bossCtx.moveTo(-b.r / 2, -b.width / 2);
                    bossCtx.lineTo(b.r / 2, 0);
                    bossCtx.lineTo(-b.r / 2, b.width / 2);
                    bossCtx.closePath();
                    bossCtx.fillStyle = '#ccc';
                    if (!options.performanceMode) bossCtx.shadowColor = '#fff';
                    if (!options.performanceMode) bossCtx.shadowBlur = 6;
                    bossCtx.fill();
                    bossCtx.restore();
                }
            });
        }
    }
}