let bulletHellNeo = null;

class BulletHell {
    constructor(values = {}) {
        this.running = false
        this.actions = {}
        this.exitActions = []
        this.bullets = []
        this.prevScreenState = options.fullscreen
        this.time = Date.now()
        this.delta = 0

        // Arena Variables
        this.overlay = null
        this.enemyCanvas = null
        this.arenaCanvas = null
        this.arenaType = values.arenaType || "normal"
        this.arenaTransparent = false
        this.width = values.width || 700
        this.height = values.height || 500
        this.centerX = values.centerX || window.innerWidth / 2
        this.centerY = values.centerY || window.innerHeight / 2

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
            info.carve(0, 0);
        }
        this.goalStart = values.goalStart || false
        this.goalSize = values.goalSize || 50
        this.goalAmt = values.goalAmt || 1
        this.goalBehavior = values.goalBehavior || "end"
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

        // Player Variables
        this.soul = values.soul || "red"
        this.invTime = 0
        this.pStart = values.pStart || "center"
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

            if (this.actions[i].codeFunc) info = this.actions[i].codeFunc(this, i)
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
        if (this.running == false) {
            if (player.bh.celestialite.health.lte(0)) return
            player.subtabs["bh"]["stuff"] = "bullet";
            if (!player.uni.CH.paused) pauseUniverseAll(["BH"], "pause", true)
            options.fullscreen = true
        }

        // Run Loop
        this.running = true
        this.loop = setInterval(() => this.update(), 1000 / 60)
    }

    removeArena() {
        this.running = false;
        clearInterval(this.loop);
        if (!options.bhKeyboard) {
            window.removeEventListener('mousemove', this.mouseHandler);
            window.removeEventListener('touchmove', this.touchHandler);
            window.removeEventListener('click', this.clickHandler);
        } else {
            window.removeEventListener('keydown', this.keydownHandler);
            window.removeEventListener('keyup', this.keyupHandler);
            window.removeEventListener('click', this.clickHandler);
        }
        if (this.overlay) document.body.removeChild(this.overlay)
        player.subtabs["bh"]["stuff"] = "battle"
        if (player.tempPaused) pauseUniverseAll(["BH"], "unpause", true)
        player.universe = "U3"
        options.fullscreen = this.prevScreenState
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
        if (bulletHellNeo) bulletHellNeo.updatePos(e)
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
                // Horizontal movement influenced by mouse X (info.pos.x) and keyboard arrows
                let targetX = this.pos.x || this.px;
                if (options.bhKeyboard) {
                    targetX = this.px
                    if (this.keys.left) targetX = this.px - 180;
                    if (this.keys.right) targetX = this.px + 180;
                }
                // Smooth horizontal movement plus velocity
                this.px += ((targetX - this.px) * 0.035 + (this.pvx || 0)) * 60 * this.delta;

                // Apply gravity
                this.pvy = (this.pvy || 0) + ((this.gravity || 0.6) * 0.65 * 60 * this.delta);
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
                if (!options.bhKeyboard) {
                    dx = this.pos.x - this.px
                    dy = this.pos.y - this.py
                } else {
                    if (this.keys.up) dy -= 5
                    if (this.keys.down) dy += 5
                    if (this.keys.left) dx -= 5
                    if (this.keys.right) dx += 5
                }
                let angle = Math.atan2(dy, dx)
                if (dx < -3 || dx > 3 || dy < -3 || dy > 3) {
                    let speed = this.keys.shift ? this.pSpeed / 2 : this.pSpeed
                    if (false) {

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
            
        }

        // Move bullets
        for (let b of this.bullets) {
            b.x += b.vx * 60 * this.delta;
            b.y += b.vy * 60 * this.delta;
        }

        // Remove bullets that go off screen
        this.bullets = this.bullets.filter(b => {
            if (b.offScreen) {
                return b.x > this.boxLeft && b.x < this.boxLeft + this.width && b.y > this.boxTop && b.y < this.boxTop + this.height
            }
            if (b.name && (b.name == "bomb" || b.name == "minibomb") && b.exploded) return false
            if (b.name && (b.name == "knife" || b.name == "bigKnife")) {
                return b.x > -b.r && b.x < this.width + b.r && b.y > -b.r && b.y < this.height + b.r
            }
            return b.x > -b.r && b.x < window.innerWidth + b.r && b.y > -b.r && b.y < window.innerHeight + b.r
        });

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

        // Draw arena bullets
        this.arenaCtx.save()
        for (let b of this.bullets) {
            if (b.boxRender) {
                b.draw(b, this.arenaCtx)
            }
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
}