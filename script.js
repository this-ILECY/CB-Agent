$(document).ready(() => {
    console.log(1);

});
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