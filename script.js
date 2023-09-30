
const base_data =
{
    ability: [20, 30, 40, 40, 55, 30, 60, 60],
    point: [5, 5, 7, 10, 10, 10, 15, 5, 10],
    cooldowns: [0, 0, 0, 0, 0, 0, 0, 0],
    originalCooldowns: [3, 3, 3, 3, 3, 3, 2, 2],
    remain: [900, 900, 900, 900, 900, 2, 2, 3],
    score: 10,
    isUsed: [false, false, false, false, false, false, false, false]
};



$(document).ready(() => {

    const player1Name = $(".player-1")[0].querySelector(".player-name").innerHTML
    const player2Name = $(".player-2")[0].querySelector(".player-name").innerHTML

    if (sessionStorage.getItem(player1Name) === null)
        sessionStorage.setItem(player1Name, JSON.stringify(base_data))

    if (sessionStorage.getItem(player2Name) === null)
        sessionStorage.setItem(player2Name, JSON.stringify(base_data))

    if (localStorage.getItem("data") === null)
        localStorage.setItem("data", JSON.stringify(base_data))

    if (sessionStorage.getItem(player1Name) !== null && sessionStorage.getItem(player2Name) !== null)
        initPage(JSON.parse(sessionStorage.getItem(player1Name)), JSON.parse(sessionStorage.getItem(player2Name)));
    else
        initPage(base_data, base_data);
});


//done
initPage = (data, data2) => {

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

    document.querySelector(".player-1").querySelector(".score").children[0].value = data.score;
    document.querySelector(".player-2").querySelector(".score2").children[0].value = data2.score;

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

////////////////////////////////////////
//change turn system
async function changeTurn() {
    let a = await openLink();
    if (!a) return;

    const player1Name = $(".player-1")[0].querySelector(".player-name").innerHTML
    const player2Name = $(".player-2")[0].querySelector(".player-name").innerHTML

    const data = JSON.parse(sessionStorage.getItem(player1Name));
    const data2 = JSON.parse(sessionStorage.getItem(player2Name));

    let coolist = []
    let counter = 0;
    data.cooldowns.forEach(cool => {
        if (cool > 0)
            coolist.push(cool - 1);
        else
            coolist.push(cool);



        if ((cool - 1) == 0)
            data.isUsed[counter] = false;

        counter++;
    })

    debugger

    data.cooldowns = coolist;
    data2.score = data2.score + 10;

    initPage(data2, data);

    sessionStorage.setItem(player1Name, JSON.stringify(data))
    sessionStorage.setItem(player2Name, JSON.stringify(data2))

    document.querySelector(".player-1").querySelector(".player-name").innerHTML = player2Name;
    document.querySelector(".player-2").querySelector(".player-name").innerHTML = player1Name;

    abilityDisabler(data2)
}

abilityDisabler = (playerData) => {

    let counter = 0;
    Array.from(document.querySelectorAll(".ability-btn")).forEach(element => {

        if (playerData.isUsed[counter])
            element.classList.add("disable");
        else
            element.classList.remove("disable");

        counter++;
    })
}


//////////////////////////////////////////////
//doing ability system
async function doAbility(number, e) {

    const playerName = $(".player-1")[0].querySelector(".player-name").innerHTML
    let playerData = JSON.parse(sessionStorage.getItem(playerName));

    let selectedAbility = e.target.parentElement;
    let abilityInfo = Array.from(document.querySelectorAll(".ab-" + number))[1];

    const abilityCost = selectedAbility.querySelector(".ability-val").value;

    if (playerData.score < abilityCost) return;
    if (abilityInfo.querySelector(".remain-val").value == '0') return;
    if (abilityInfo.querySelector(".cool-val").value != '0') return;

    let a = await openLink();
    if (!a) return;



    playerData = scoreDecrease(abilityCost, playerData)

    playerData = usedAbility(playerData, abilityInfo, number)

    sessionStorage.setItem(playerName, JSON.stringify(playerData))

}

scoreDecrease = (cost, playerData) => {
    const score = parseInt($(".score")[0].children[0].value)
    $(".score")[0].children[0].value = score - cost;

    playerData.score = score - cost;

    return playerData;

}


usedAbility = (playerData, abilityInfo, abilityNumber) => {

    playerData.isUsed[abilityNumber] = true;

    let remain = parseInt(abilityInfo.querySelector(".remain-val").value) - 1;
    let cool = base_data.originalCooldowns[abilityNumber];

    if (remain >= 0) {

        playerData.remain[abilityNumber] = remain;

        abilityInfo.querySelector(".remain-val").value = remain;

        playerData.cooldowns[abilityNumber] = cool;
    }

    return playerData;
}

///////////////////////////////////
//change score on changing the score input
changeScoreManual = (number, e) => {

    const playerName = $(".player-" + number)[0].querySelector(".player-name").innerHTML

    let data = JSON.parse(sessionStorage.getItem(playerName));

    data.score = parseInt(e.target.value);

    sessionStorage.setItem(playerName, JSON.stringify(data));
}

///////////////////////////////////
//change header system
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


//////////////////////////////
//bluring the score system
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


////////////////////////////////
//saving progress button
save = () => {
    saveMainData()
    savePlayerData()
}
saveMainData = () => {
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
savePlayerData = () => {

    let data = base_data;

    data.ability = []
    data.point = []
    data.cooldowns = []
    data.originalCooldowns = []
    data.remain = []
    data.score = []
    data.isUsed = []

    Array.from(document.querySelectorAll(".ability-val")).forEach(el => {
        data.ability.push(parseInt(el.value));
    })
    Array.from(document.querySelectorAll(".remain-val")).forEach(el => {
        data.remain.push(parseInt(el.value));
    })
    Array.from(document.querySelectorAll(".cool-val")).forEach(el => {
        data.cooldowns.push(parseInt(el.value));
    })
    Array.from(document.querySelectorAll(".score-val")).forEach(el => {
        data.point.push(parseInt(el.value));
    })
    Array.from(document.querySelectorAll(".ability-btn")).forEach(el => {
        data.isUsed.push((el.classList[1] === "true") ? true : false);
    })

    data.score = parseInt($(".score")[0].children[0].value);

    const playerName = $(".player-1")[0].querySelector(".player-name").innerHTML
    const dataJson = JSON.stringify(data)

    sessionStorage.removeItem(playerName);

    sessionStorage.setItem(playerName, dataJson);
}

/////////////////////////////////
//show info of ability system
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


/////////////////////////////
//dice click system
cycleEnd = false;

diceClick = (number, e) => {

    if (!cycleEnd) {
        Array.from(document.querySelectorAll(".dice-last-check")).forEach(element => element.classList.add("unchecked"));
        Array.from(document.querySelectorAll(".dice-no")).forEach(element => element.innerHTML = 0);
    }

    Array.from(document.querySelectorAll(".dice-btn-start")).forEach(element => element.classList.remove("toggle"));
    Array.from(document.querySelectorAll(".num")).forEach(element => element.classList.remove("active"));

    if (e.target.classList.contains("toggle"))
        e.target.classList.remove("toggle");
    else
        e.target.classList.add("toggle");

}

activeNumpad = (number, e) => {
    Array.from(document.querySelectorAll(".num")).forEach(element => element.classList.remove("active"));

    let list = Array.from(document.querySelectorAll(".dice-btn-start"));

    let counter = 0;

    if (list[0].classList.contains("toggle")) counter = 1;
    if (list[1].classList.contains("toggle")) counter = 2;

    if (counter === 0) return;

    if (e.target.classList.contains("active"))
        e.target.classList.remove("active");
    else
        e.target.classList.add("active");

    document.querySelector(".dice-no-" + counter).innerHTML = number;

    document.querySelector(".last-check-" + counter).classList.remove("unchecked");

    numPad = number;

}

numPad = 0;
lastDiceCheck = (number, e) => {

    if (e.target.parentElement.classList.contains("unchecked")) return;

    Array.from(document.querySelectorAll(".dice-btn-start")).forEach(element => element.classList.remove("toggle"));

    document.querySelector(".num-" + numPad).classList.remove("active");

    e.target.parentElement.classList.add("unchecked");

    cycleEnd = true;
}

async function addScore() {

    let a = await openLink();
    if (!a) return;

    debugger

    const playerName = $(".player-1")[0].querySelector(".player-name").innerHTML
    let playerData = JSON.parse(sessionStorage.getItem(playerName));

    let diceList = [];
    Array.from(document.querySelectorAll(".dice-no")).forEach(element => diceList.push(parseInt(element.innerHTML)));

    if (diceList[0] == 6) {
        playerData.score = playerData.score + 10;

    } else if (diceList[0] == diceList[1]) {
        playerData.score = playerData.score + 7;

    } else {
        playerData.score = playerData.score + Math.ceil((diceList[0] + diceList[1]) / 2);
    }

    $(".score")[0].children[0].value = playerData.score;

    sessionStorage.setItem(playerName, JSON.stringify(playerData));

    Array.from(document.querySelectorAll(".dice-no")).forEach(element => element.innerHTML = 0);
}


///////////////////////////////////////
//add point to score system
async function gainScore(number) {
    let a = await openLink();
    if (!a) return;

    const playerName = $(".player-1")[0].querySelector(".player-name").innerHTML
    let playerData = JSON.parse(sessionStorage.getItem(playerName));

    let point = parseInt(document.querySelector(".sc-" + number).querySelector(".score-val").value)

    playerData.score = playerData.score + point;

    $(".score")[0].children[0].value = playerData.score;

    sessionStorage.setItem(playerName, JSON.stringify(playerData));
}

/////////////////////////////////
//restart funtion system

async function restart() {

    const defaultQ = "Are you sure?";
    const defaultNO = "No, return";
    const defaultYES = "Do it!";

    document.querySelector(".cb-modal").querySelector(".question").innerHTML = "data will be ERASED!<br/>continue?";
    document.querySelector(".cb-modal").querySelector(".no").innerHTML = "delete data";
    document.querySelector(".cb-modal").querySelector(".yes").innerHTML = "Cancel";

    let a = await openLink();
    document.querySelector(".cb-modal").querySelector(".question").innerHTML = defaultQ;
    document.querySelector(".cb-modal").querySelector(".no").innerHTML = defaultNO;
    document.querySelector(".cb-modal").querySelector(".yes").innerHTML = defaultYES;
    if (a) return;

    sessionStorage.clear();
    localStorage.clear();

    location.reload();

}

window.onbeforeunload = function(e) {
    e.preventDefault();
    e.stopPropagation();
    e.stopimmediatepropagation();

    console.log('yaaay');
}
