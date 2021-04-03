const scorebox = document.getElementById('scorebox')

const homeScore = document.getElementById('home-score')
const visitorScore = document.getElementById('visitor-score')
const gameClock = document.getElementById('game-clock')
const shotClock = document.getElementById('shot-clock')
const period = document.getElementById('period')

const homeSummaryScore = document.getElementById('home-summary-score')
const visitorSummaryScore = document.getElementById('visitor-summary-score')
const summaryTag = document.getElementById('summary-tag')

const scorestate = document.getElementById('scorestate')

const homeAlert = document.getElementById('home-alert')
const visitorAlert = document.getElementById('visitor-alert')
const neutralAlert = document.getElementById('neutral-alert')

let statusObject = undefined

const socket = io()

socket.on('connect', () => {
    socket.emit('status-request', 'status')
})

socket.on('status', payload => {
    statusObject = payload
    StatusUpdate()
})

socket.on('update', payload => {
    homeScore.innerText = payload.home_score
    visitorScore.innerText = payload.visitor_score
    gameClock.innerText = payload.clock
    shotClock.innerText = parseInt(payload.play)

    if (parseInt(payload.play) <= 5)
    {
        shotClock.classList.add('red')
    }
    else
    {
        shotClock.classList.remove('red')
    }

    if (payload.quarter != 0)
    {
        period.innerText = payload.quarter
    }
    else
    {
        period.innerText = ''
    }
    
    if (payload.down != '' && payload.down != '   ')
    {
        downs.innerText = `${payload.down} & ${payload.to_go}`
    }
    else
    {
        downs.innerText = ''
    }

})

function StatusUpdate() {
    if (statusObject.alert_visibility == 'off')
    {
        HideAlerts()
    }
    else {
        if (statusObject.alert_visibility == 'on')
        {
            ProcessAlert()
        }
    }
    
    ProcessDisplayMode()
}

function HideAlerts() {
    visitorAlert.classList.add('hidden')
    homeAlert.classList.add('hidden')
    neutralAlert.classList.add('hidden')
}

function ProcessAlert() {
    HideAlerts()
    switch (statusObject.alert_mode)
    {
        case 'home':
            homeAlert.innerText = statusObject.alert_text
            homeAlert.classList.remove('hidden')
            break
        case 'visitor':
            visitorAlert.innerText = statusObject.alert_text
            visitorAlert.classList.remove('hidden')
            break
        case 'neutral':
            neutralAlert.innerText = statusObject.alert_text
            neutralAlert.classList.remove('hidden')
            break
        default:
            break
    }
}

function ScoreBoxOut() {
    scorebox.classList.add('out')
    neutralAlert.classList.add('out')
    homeAlert.classList.add('out')
    visitorAlert.classList.add('out')

    scorestate.classList.remove('out')
}

function ScoreBoxIn() {
    scorebox.classList.remove('out')
    neutralAlert.classList.remove('out')
    homeAlert.classList.remove('out')
    visitorAlert.classList.remove('out')

    scorestate.classList.add('out')
}

function ProcessDisplayMode() {
    homeSummaryScore.innerText = homeScore.innerText
    visitorSummaryScore.innerText = visitorScore.innerText

    if (statusObject.display_mode == 'live')
    {
        ScoreBoxIn()
    }
    else
    {
        switch (statusObject.display_mode)
        {
            case 'start':
                summaryTag.innerText = 'Starting Soon'
                break
            case 'first':
                summaryTag.innerText = 'End of 1st'
                break
            case 'half':
                summaryTag.innerText = 'Halftime'
                break
            case 'third':
                summaryTag.innerText = 'End of 3rd'
                break
            case 'final':
                summaryTag.innerText = 'Final'
                break
            default:
                break
        }
        ScoreBoxOut()
    }
}