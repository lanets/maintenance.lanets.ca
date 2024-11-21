var startDate = new Date("2024-12-23T00:00:00Z");
var fumes = [];

Vue.component('rocket', {
    template: '#rocket',
    data() {
        return {
            flying: null,
            start: null,
            counting: null,
            countdown: 3,
            space: {}
        }
    },
    methods: {
        launchRocket() {
            this.flying = true;
            document.getElementById("ground-wrap").style.display = "none";
        },
        initcountdown() {

            const countingdown = setInterval(() => {
                this.countdown--;
                if (this.countdown === 0) {
                    this.counting = false;
                    this.flying = true;
                    clearInterval(countingdown);
                }
            }, 1000);
        },
        generateStars() {
            const field = 2;
            const distanceLayer = 3;
            const galaxy = this.$el.getElementsByClassName('galaxy')[0];

            for (let i = 0; i < distanceLayer; i++) {
                this.$set(this.space, 'field' + i, {});
                for (let j = 0; j < field; j++) {
                    this.$set(this.space['field' + i], 'distance-layer' + j, []);

                    for (let k = 0; k < 10; k++) {
                        const star = {
                            "left": galaxy.clientWidth * Math.random(),
                            "top": galaxy.clientHeight / 2 * Math.random()
                        };

                        this.$set(this.space['field' + i]['distance-layer' + j], k, star);
                    }
                }
            }
        }
    },
    mounted() {
        fumes = document.getElementsByTagName("li")[0].textContent.replaceAll(" ", "0").replaceAll(" ", "1").split("").map(x => x === "1");
        this.$nextTick(() => {

            const currentDate = new Date();
            let countdown = Math.floor((startDate - currentDate) / 1000);
            countdown = (countdown - 3) * 1000;
            setTimeout(() => {
                this.counting = true;
                this.initcountdown();
            }, 1000000);

            setTimeout(() => {
                this.generateStars();
            }, 0)
        });
    }
});
// Code for the rocket component has been found at: https://codepen.io/snoo/pen/BROjLW

Vue.component("city", {
    template: "#city",
    data() {
        return {
            buildingsA: [],
            buildingsB: []
        }
    },
    methods: {
        generateBuildings() {
            const width = document.getElementById("ground-wrap").offsetWidth;
            const buildingCount = Math.floor((width * 0.7) / 90);
            for (let i = 0; i < buildingCount / 2; i++) {
                const floorCount = Math.floor(Math.random() * 5) + 3;
                const heightInPx = floorCount * 20;
                const pointy = Math.random() < 0.40;
                const building = { height: heightInPx, windows: [], pointy };
                const windowsCount = floorCount * 3;
                for (let j = 0; j < windowsCount; j++) {
                    let isOn = fumes.shift();
                    if (isOn === undefined) {
                        isOn = Math.random() > 0.5;
                    }
                    // no light on ground floor
                    if (j >= windowsCount - 3) {
                        fumes.unshift(isOn);
                        isOn = false;
                    }
                    building.windows.push({ light: isOn });
                }
                this.$set(this.buildingsA, i, building);
            }
            for (let i = 0; i < buildingCount / 2; i++) {
                const floorCount = Math.floor(Math.random() * 5) + 3;
                const heightInPx = floorCount * 20;
                const pointy = Math.random() < 0.40;
                const building = { height: heightInPx, windows: [], pointy };
                const windowsCount = floorCount * 3;
                for (let j = 0; j < windowsCount; j++) {
                    let isOn = fumes.shift();
                    if (isOn === undefined) {
                        isOn = Math.random() > 0.5;
                    }
                    // no light on ground floor
                    if (j >= windowsCount - 3) {
                        fumes.unshift(isOn);
                        isOn = false;
                    }
                    building.windows.push({ light: isOn });
                }
                this.$set(this.buildingsB, i, building);
            }
        }
    },
    mounted() {
        this.generateBuildings();
    }
})

new Vue({
    el: '#app',
});

/**
 * 
 * @param {number} value 
 * @returns 
 */
function precissionParse(value) {
    return value.toString().padStart(2, "0");
}

async function initcountdown() {

    const data = await fetch("https://cloudflare-dns.com/dns-query?name=date.lanets.ca&type=TXT", { headers: { "Accept": "application/dns-json" } });
    const bodyJson = await data.json();
    const dataString = bodyJson.Answer[0].data.replace(/"/g, "");
    if (dataString === " ") {
        const container = document.getElementById("timer").parentElement;
        container.removeChild(document.getElementById("timer"));
        document.getElementsByClassName("lanets-container")[0].style.fontSize = "3rem";
        return;
    }
    startDate = new Date(dataString);


    var countDownDate = startDate.getTime();
    const daysElement = document.getElementById("days");
    const hoursElement = document.getElementById("hours");
    const minutesElement = document.getElementById("minutes");
    const secondsElement = document.getElementById("seconds");

    function updateCountdown() {
        let now = new Date().getTime();
        let distance = countDownDate - now;

        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysElement.textContent = precissionParse(days);
        hoursElement.textContent = precissionParse(hours);
        minutesElement.textContent = precissionParse(minutes);
        secondsElement.textContent = precissionParse(seconds);
    }

    updateCountdown();
    // Update the count down every 1 second
    setInterval(() => {
        updateCountdown();
    }, 1000);
}



initcountdown();