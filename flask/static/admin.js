const status = document.getElementById('status')

const homeTouchdownBtn = document.getElementById('home-touchdown-btn')
const visitorTouchdownBtn = document.getElementById('visitor-touchdown-btn')

const rawHomeScore = document.getElementById('raw-home-score')
const rawVisitorScore = document.getElementById('raw-visitor-score')
const rawHomeTimeouts = document.getElementById('raw-home-timeouts')
const rawVisitorTimeouts = document.getElementById('raw-visitor-timeouts')
const rawHomePossesion = document.getElementById('raw-home-possesion')
const rawVisitorPossesion = document.getElementById('raw-visitor-possesion')
const rawClock = document.getElementById('raw-clock')
const rawPlay = document.getElementById('raw-play')
const rawQuarter = document.getElementById('raw-quarter')
const rawDown = document.getElementById('raw-down')
const rawToGo = document.getElementById('raw-to-go')
const rawBallOn = document.getElementById('raw-ball-on')
const rawFlag = document.getElementById('raw-flag')

const toggleFlagOff = document.getElementById("toggle-flag-off")
const toggleFlagOn = document.getElementById("toggle-flag-on")
const toggleFlagConsole = document.getElementById("toggle-flag-console")

const flagInput = document.getElementById('flag-input')
const homePenalty = document.getElementById('home-penalty')
const visitorPenalty = document.getElementById('visitor-penalty')

const toggleAlertOff = document.getElementById('toggle-alert-off')
const toggleAlertOn = document.getElementById('toggle-alert-on')
const toggleAlertModeHome = document.getElementById('toggle-alert-mode-home')
const toggleAlertModeVisitor = document.getElementById('toggle-alert-mode-visitor')
const toggleAlertModeNeutral = document.getElementById('toggle-alert-mode-neutral')
const alertInput = document.getElementById('alert-input')
const alertClear = document.getElementById('alert-clear')
const alertDisplay = document.getElementById('alert-display')
const alertPreview = document.getElementById('alert-preview')

const toggleDisplayLive = document.getElementById('toggle-display-live')
const toggleDisplayStart = document.getElementById('toggle-display-start')
const toggleDisplayFirst = document.getElementById('toggle-display-first')
const toggleDisplayHalf = document.getElementById('toggle-display-half')
const toggleDisplayThird = document.getElementById('toggle-display-third')
const toggleDisplayFinal = document.getElementById('toggle-display-final')

let statusObject = undefined

const socket = io()

socket.on('connect', () => {
    socket.emit('status-request', 'status')
})

socket.on('status', payload => {
    status.innerText = 'CONNECTED'
    status.classList.remove('error')
    statusObject = payload
    StatusUpdate()
})

socket.on('disconnect', () => {
    status.innerText = 'DISCONNECTED'
    status.classList.add('error')
})

homeTouchdownBtn.onclick = () => {
    socket.emit('touchdown', 'home')
}

visitorTouchdownBtn.onclick = () => {
    socket.emit('touchdown', 'visitor')
}

socket.on('update', payload => {
    rawHomeScore.innerText = payload.home_score
    rawVisitorScore.innerText = payload.visitor_score
    rawHomeTimeouts.innerText = payload.home_timeouts
    rawVisitorTimeouts.innerText = payload.visitor_timeouts
    rawHomePossesion.innerText = payload.home_possesion
    rawVisitorPossesion.innerText = payload.visitor_possesion
    rawClock.innerText = payload.clock
    rawPlay.innerText = payload.play
    rawQuarter.innerText = payload.quarter
    rawDown.innerText = payload.down
    rawToGo.innerText = payload.to_go
    rawBallOn.innerText = payload.ball_on
    rawFlag.innerText = payload.flag
})

function ClearFlagToggles() {
    toggleFlagConsole.classList.remove('toggled')
    toggleFlagOff.classList.remove('toggled')
    toggleFlagOn.classList.remove('toggled')
}

function SetFlagToggle(newState) {
    ClearFlagToggles()
    switch (newState)
    {
        case "on":
            toggleFlagOn.classList.add('toggled')
            break
        case "off":
            toggleFlagOff.classList.add('toggled')
            break
        case "console":
            toggleFlagConsole.classList.add('toggled')
            break
        default:
            break
    }
}

function FlagStatusChange(newState) {
    socket.emit('flag-status', newState)
}

toggleFlagConsole.onclick = () => {FlagStatusChange('console')}
toggleFlagOff.onclick = () => {FlagStatusChange('off')}
toggleFlagOn.onclick = () => {FlagStatusChange('on')}

function StatusUpdate() {
    SetFlagToggle(statusObject.flag)
    SetAlertModeToggle(statusObject.alert_mode)
    SetAlertVisibilityToggle(statusObject.alert_visibility)
    alertPreview.innerText = statusObject.alert_text
    SetDisplayToggle(statusObject.display_mode)
}

function AssignPenalty(team) {
    let offense = flagInput.value
    if (offense.length > 0)
    {
        let payload = {
            team: team,
            offense: offense
        }
        socket.emit('flag-alert', payload)
    }
    flagInput.value = ""
}

homePenalty.onclick = () => {AssignPenalty('home')}
visitorPenalty.onclick = () => {AssignPenalty('visitor')}

function ClearAlertModeToggles() {
    toggleAlertModeHome.classList.remove('toggled')
    toggleAlertModeNeutral.classList.remove('toggled')
    toggleAlertModeVisitor.classList.remove('toggled')
}

function SetAlertModeToggle(newState) {
    ClearAlertModeToggles()
    switch (newState)
    {
        case "home":
            toggleAlertModeHome.classList.add('toggled')
            break
        case "visitor":
            toggleAlertModeVisitor.classList.add('toggled')
            break
        case "neutral":
            toggleAlertModeNeutral.classList.add('toggled')
            break
        default:
            break
    }
}

function AlertModeStatusChange(newState) {
    socket.emit('alert-mode-status', newState)
}

toggleAlertModeHome.onclick = () => {AlertModeStatusChange('home')}
toggleAlertModeVisitor.onclick = () => {AlertModeStatusChange('visitor')}
toggleAlertModeNeutral.onclick = () => {AlertModeStatusChange('neutral')}

function ClearAlertVisibilityToggles() {
    toggleAlertOff.classList.remove('toggled')
    toggleAlertOn.classList.remove('toggled')
}

function SetAlertVisibilityToggle(newState) {
    ClearAlertVisibilityToggles()
    switch (newState)
    {
        case "on":
            toggleAlertOn.classList.add('toggled')
            break
        case "off":
            toggleAlertOff.classList.add('toggled')
            break
        default:
            break
    }
}

function AlertVisibilityStatusChange(newState) {
    socket.emit('alert-visibility-status', newState)
}

toggleAlertOn.onclick = () => {AlertVisibilityStatusChange('on')}
toggleAlertOff.onclick = () => {AlertVisibilityStatusChange('off')}

alertClear.onclick = () => {alertInput.value = ''}
alertDisplay.onclick = () => {
    if (alertInput.value.length > 0)
    {
        socket.emit('alert-text-status', alertInput.value)
        alertInput.value = ''
    }
}

function ClearDisplayToggles() {
    toggleDisplayLive.classList.remove('toggled')
    toggleDisplayStart.classList.remove('toggled')
    toggleDisplayFirst.classList.remove('toggled')
    toggleDisplayHalf.classList.remove('toggled')
    toggleDisplayThird.classList.remove('toggled')
    toggleDisplayFinal.classList.remove('toggled')
}

function SetDisplayToggle(newState) {
    ClearDisplayToggles()
    switch (newState)
    {
        case "live":
            toggleDisplayLive.classList.add('toggled')
            break
        case "start":
            toggleDisplayStart.classList.add('toggled')
            break
        case "first":
            toggleDisplayFirst.classList.add('toggled')
            break
        case "half":
            toggleDisplayHalf.classList.add('toggled')
            break
        case "third":
            toggleDisplayThird.classList.add('toggled')
            break
        case "final":
            toggleDisplayFinal.classList.add('toggled')
            break
        default:
            break
    }
}

function DisplayStatusChange(newState) {
    socket.emit('display-mode-status', newState)
}

toggleDisplayLive.onclick = () => {DisplayStatusChange('live')}
toggleDisplayStart.onclick = () => {DisplayStatusChange('start')}
toggleDisplayFirst.onclick = () => {DisplayStatusChange('first')}
toggleDisplayHalf.onclick = () => {DisplayStatusChange('half')}
toggleDisplayThird.onclick = () => {DisplayStatusChange('third')}
toggleDisplayFinal.onclick = () => {DisplayStatusChange('final')}