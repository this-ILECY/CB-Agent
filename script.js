$(document).ready(() => {
    if (localStorage.getItem('data') == undefined) {
        // Convert the object to a JSON string
        const myObjectJSON = JSON.stringify(base_data);

        // Save the JSON string in local storage
        localStorage.setItem('data', myObjectJSON);
    } else {
        const data = JSON.parse(localStorage.getItem('data'));
        initPage(data);
    }
});

initPage = (data) => {


    debugger
    let counter = 0;
    Array.from(document.querySelectorAll(".ability-val")).forEach(el => {
        el.value = data.ability[counter];

        counter++;
    })
    counter = 0;
    Array.from(document.querySelectorAll(".remain-val")).forEach(el => {
        el.value = data.remain[counter];

        counter++;
    })
    counter = 0;
    Array.from(document.querySelectorAll(".cool-val")).forEach(el => {
        el.value = data.cooldowns[counter];

        counter++;
    })
    counter = 0;
    Array.from(document.querySelectorAll(".score-val")).forEach(el => {
        el.value = data.point[counter];

        counter++;
    })
}

// Create a function that returns a Promise
function waitForResponse() {


    return new Promise((resolve, reject) => {
        Array.from(document.querySelectorAll(".res")).forEach((selector) => { selector.addEventListener("click", resolve) });
    });
}

async function openLink() {

    $(".cb-modal")[0].classList.remove("d-none");

    let target = await waitForResponse();

    $(".cb-modal")[0].classList.add("d-none");

    switch (target.target.classList.contains("yes")) {
        case true: {
            return true;
        }
        case false: {
            return false;
        }
    }
}

// Call the function to set up the event listener
async function test() {
    let a = await openLink();
    console.log(a);
}

async function changeTurn() {
    let a = await openLink();
    if (a) {

        getAllData()
        setAllData()
    }
}

getAllData = () => {
    let data = {
        ability: [],
        point: [],
        cooldowns: [],
        originalCooldowns: [],
        remain: [],
        score: 0
    }
    Array.from(document.querySelectorAll(".ability-val")).forEach(el => {
        data.ability.push(el.value);
    })
    Array.from(document.querySelectorAll(".remain-val")).forEach(el => {
        data.remain.push(el.value);
    })
    Array.from(document.querySelectorAll(".cool-val")).forEach(el => {
        data.cooldowns.push(el.value);
    })
    Array.from(document.querySelectorAll(".score-val")).forEach(el => {
        data.point.push(el.value);
    })
    data.score = parseInt($(".score")[0].children[0].value);

    const playerName = $(".player-1")[0].querySelector(".player-name").innerHTML
    const dataJson = JSON.stringify(data)

    sessionStorage.setItem(playerName, dataJson);
}

setAllData = () => {
    const player1Name = $(".player-1")[0].querySelector(".player-name").innerHTML
    const player2Name = $(".player-2")[0].querySelector(".player-name").innerHTML

    const data1 = JSON.parse(sessionStorage.getItem(player1Name));
    const data2 = JSON.parse(sessionStorage.getItem(player2Name));
    debugger
    if (data2 !== null) {
        initPage(data2);

        $(".score2")[0].children[0].value = data1.score;
        $(".score")[0].children[0].value = data2.score;
    } else {
        initPage(base_data)

        $(".score")[0].children[0].value = parseInt($(".score2")[0].children[0].value);
        $(".score2")[0].children[0].value = data1.score;
    }
    $(".player-1")[0].querySelector(".player-name").innerHTML = player2Name;
    $(".player-2")[0].querySelector(".player-name").innerHTML = player1Name;


}

// Call the function to set up the event listener
async function doAbility(number, e) {

    const point = parseInt($(".ab-" + (number + 1))[0].querySelector(".ability-val").value)//is cost
    const score = parseInt($(".score")[0].children[0].value) //is player score
    const rem = document.querySelectorAll(".remain-val")[number].value
    let cool = document.querySelectorAll(".cool-val")[number].value

    if (rem == '0') return
    if (cool != '0') return
    if (score < point) return;

    let a = await openLink();
    if (a) {
        let rem = parseInt(document.querySelectorAll(".remain-val")[number].value) - 1;
        document.querySelectorAll(".remain-val")[number].value = rem;

        cool = base_data.originalCooldowns[number]
        document.querySelectorAll(".cool-val")[number].value = cool;

        scoreDecrease(point);

        if (rem == 0 || cool != 0) {

            e.target.classList.add("disable")
        }
    }
}

scoreDecrease = (cost) => {
    const score = parseInt($(".score")[0].children[0].value)
    console.log(score - cost);
    $(".score")[0].children[0].value = score - cost;
}

changeHeader = (number) => {
    switch (number) {
        case 1: {
            $(".ability-area")[0].classList.remove("d-none");
            $(".dice-area")[0].classList.add("d-none");
            $(".score-area")[0].classList.add("d-none");

            $(".ability")[0].classList.add("active");
            $(".dice")[0].classList.remove("active");
            $(".point")[0].classList.remove("active");

            break;
        }
        case 2: {
            $(".ability-area")[0].classList.add("d-none");
            $(".dice-area")[0].classList.remove("d-none");
            $(".score-area")[0].classList.add("d-none");

            $(".ability")[0].classList.remove("active");
            $(".dice")[0].classList.add("active");
            $(".point")[0].classList.remove("active");
            break;
        }
        case 3: {
            $(".ability-area")[0].classList.add("d-none");
            $(".dice-area")[0].classList.add("d-none");
            $(".score-area")[0].classList.remove("d-none");

            $(".ability")[0].classList.remove("active");
            $(".dice")[0].classList.remove("active");
            $(".point")[0].classList.add("active");
            break;
        }

        default:
            break;
    }
}

bluring = () => {

    if ($(".cansee")[0].classList.contains("d-none")) {

        $(".score")[0].classList.add("bluring")

        $(".cansee")[0].classList.remove("d-none");
        $(".cannotsee")[0].classList.add("d-none");
    } else {
        $(".score")[0].classList.remove("bluring")

        $(".cansee")[0].classList.add("d-none");
        $(".cannotsee")[0].classList.remove("d-none");
    }
}

bluring2 = () => {

    if ($(".cansee2")[0].classList.contains("d-none")) {

        $(".score2")[0].classList.add("bluring")

        $(".cansee2")[0].classList.remove("d-none");
        $(".cannotsee2")[0].classList.add("d-none");
    } else {
        $(".score2")[0].classList.remove("bluring")

        $(".cansee2")[0].classList.add("d-none");
        $(".cannotsee2")[0].classList.remove("d-none");
    }
}

const base_data =
{
    ability: [20, 30, 40, 40, 55, 30, 60, 60],
    point: [5, 5, 7, 10, 10, 10, 15, 5, 10],
    cooldowns: [0, 0, 0, 0, 0, 0, 0, 0],
    originalCooldowns: [2, 2, 2, 2, 2, 2, 1, 1],
    remain: [1, 1, 1, 1, 1, 2, 2, 3]
};


save = () => {
    // Your object
    const data = {
        ability: [],
        point: [],
        cooldowns: [],
        remain: []
    };

    let abs = [];

    Array.from(document.querySelectorAll(".ability-val")).forEach(el => {
        abs.push(parseInt(el.value));
    })

    let rem = [];

    Array.from(document.querySelectorAll(".remain-val")).forEach(el => {
        rem.push(parseInt(el.value));
    })

    let col = [];

    Array.from(document.querySelectorAll(".cool-val")).forEach(el => {
        col.push(parseInt(el.value));
    })

    let scr = [];

    Array.from(document.querySelectorAll(".score-val")).forEach(el => {
        scr.push(parseInt(el.value));
    })

    data.ability = abs;
    data.remain = rem;
    data.cooldowns = col;
    data.point = scr;

    // Convert the object to a JSON string
    const myObjectJSON = JSON.stringify(data);

    // Save the JSON string in local storage
    localStorage.setItem('data', myObjectJSON);

}

showInfo = (number) => {
    let abilityStack = document.querySelectorAll(".ab-" + number);
    console.log(abilityStack);

    if (!abilityStack[0].querySelector(".ability-info").classList.contains("active")) {

        abilityStack[0].querySelector(".ability-info").classList.add("active");
        abilityStack[1].classList.remove("d-none")
    } else {
        abilityStack[0].querySelector(".ability-info").classList.remove("active");
        abilityStack[1].classList.add("d-none")

    }
}