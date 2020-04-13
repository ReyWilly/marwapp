const api_key = "DEMO_KEY"
const api_url = `https://api.nasa.gov/insight_weather/?api_key=${api_key}&feedtype=json&ver=1.0`

const previousWeatherToggle = document.querySelector('.show-previous-weather');

const previousWeather = document.querySelector('.previous-weather')

const currentSol = document.querySelector("[data-current-sol]")

const currentDate = document.querySelector("[data-current-date]")

const currentTempHigh = document.querySelector("[data-current-temp-high]")

const currentTempLow = document.querySelector("[data-current-temp-low]")

const currentWindSpeed = document.querySelector("[data-wind-speed]")

const currentDirectionText = document.querySelector("[data-wind-direction-text]")

const currentDirectionArrow = document.querySelector("[data-wind-direction-arrow]")

previousWeatherToggle.addEventListener('click', () => {
    previousWeather.classList.toggle('show-weather')
} )

let selectedSolIndex

getWeather().then(sols => {
    selectedSolIndex = sols.length - 1
    displaySelectedSol(sols)
})

function displaySelectedSol (sols) {
    const selectedSol = sols[selectedSolIndex]
    currentSol.innerText = selectedSol.sol
    currentDate.innerText = displayDate(selectedSol.date)
    currentTempHigh.innerText = displayTemp(selectedSol.maxTemp)
    currentTempLow.innerText = displayTemp(selectedSol.minTemp)
    currentWindSpeed.innerText = displaySpeed(selectedSol.windSpeed)
    currentDirectionText.innerText = selectedSol.windDirectionDegrees
    currentDirectionArrow.style.setProperty("--direction", `${selectedSol.windDirectionDegrees}deg`)

}

function displayDate (date) {
    return date.toLocaleDateString(
        undefined,
        { day: "numeric", month: "long" }
    )
}

function displayTemp (temp) {
    return Math.round(temp)
}

function displaySpeed (speed) {
    return Math.round(speed)
}

function getWeather () {

    return fetch (api_url)

    .then (response => response.json())

    .then (data => {

        const { sol_keys, validity_checks, ...solData } = data

        return Object.entries(solData).map(([sol, data]) => {
            return {
                sol: sol,

                maxTemp: data.AT.mx,
                minTemp: data.AT.mn,

                windSpeed: data.HWS.av,

                windDirectionDegrees: data.WD.most_common.compass_degrees,
                windDirectionCardinal: data.WD.most_common.compass_point,

                date: new Date(data.First_UTC)
            }
        })
    })
}