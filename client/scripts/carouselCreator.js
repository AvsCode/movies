const carousel = function(containerId, carouselId){
    // Dom Items
    let container;
    let carousel;
    let carouselItems;
    let buttonLeft;
    let buttonRight;

    // Properties or attributes of the Carousel
    let availableWidth;
    let carouselWidth;
    let itemWidth;
    let shiftWidth;
    let shiftNumber;
    let shiftLocation = 0;

    setUp();

    function setUp(){

        container = document.getElementById(containerId);
        buttonLeft = document.createElement('button');
        buttonRight = document.createElement('button');
        carousel = document.createElement('div');

        container.classList.add('carouselContainer');
        buttonRight.classList.add('carouselBtn');
        buttonRight.classList.add('btnRight');
        buttonLeft.classList.add('carouselBtn');
        buttonLeft.classList.add('btnLeft');
        carousel.classList.add('carousel');

        if(carouselId){
            carousel.id = carouselId;
        }
        container.appendChild(buttonLeft);
        container.appendChild(carousel);
        container.appendChild(buttonRight);
        // container.setAttribute('style', 'position: relative; margin: 10px auto; overflow: hidden');
        // carousel.setAttribute('style', 'display: flex; position: relative; transition-duration: .5s; margin: 0 40px;');
        // buttonRight.setAttribute('style', 'position: absolute; z-index: 100;top: 10% ; height: 80%; width: 40px; right: 0; background-color: rgba(226, 226, 226, .5); border: none;');
        // buttonLeft.setAttribute('style', 'position: absolute; z-index: 100;top: 10%; height: 80%; width: 40px; left: 0; background-color: rgba(226, 226, 226, .5); border: none;');
        buttonLeft.innerHTML = '&#8678;';
        buttonRight.innerHTML = '&#8680;';

        let windowWidthTimeout = false;
        window.addEventListener("resize", ()=>{
            clearTimeout(windowWidthTimeout);
            windowWidthTimeout = setTimeout(setWidths, 300);
        });
        buttonRight.addEventListener('click', () => {
            shiftCarousel('right');
        });
        buttonLeft.addEventListener('click', () => {
            shiftCarousel('left');
        });
    }
    // Takes an array of DOM elements, and adds them to the carousel
    function addItems(items){
        for(let i = 0; i < items.length; i++){
            try{
                carousel.appendChild(items[i]);
            }
            catch(e){
                console.log(items[i]);
                console.log(e);
            }
        }
        setWidths();
    }

    function reset(){
        while(container.firstChild){
            container.removeChild(container.firstChild);
        }
    }

    function setWidths(){
        if(!carousel.hasChildNodes()){
            console.log('Items needed for carousel');
            return;
        }
        let itemStyle = getComputedStyle(carousel.childNodes[0], null);
        let itemOffsetWidth =  carousel.childNodes[0].offsetWidth;
        let itemMarginLeft = parseInt(itemStyle.marginLeft);
        let itemMarginRight = parseInt(itemStyle.marginRight);
        let buttons = document.getElementsByClassName('carouselBtn');
        let buttonWidth = buttons[0].offsetWidth;

        itemWidth = itemOffsetWidth + itemMarginLeft + itemMarginRight;
        availableWidth = window.innerWidth;
        carouselWidth = carousel.scrollWidth;
        shiftWidth = Math.floor(availableWidth / itemWidth) * itemWidth;
        shiftNumber = Math.ceil(carouselWidth / shiftWidth) - 1;
    }

    function shiftCarousel(direction){
        if(direction === 'right'){
            shiftLocation = shiftLocation != shiftNumber ? (shiftLocation + 1) : 0
        }
        else{
            shiftLocation = shiftLocation != 0 ? (shiftLocation - 1) : shiftNumber
        }
        carousel.setAttribute('style', `transform: translateX(${shiftWidth*shiftLocation*(-1)}px); margin: 0 40px;`);
    }

    return{
        addItems,
        reset
    }
}

const carouselCreator = function(){
    function createCarousel(containerId, carouselId){
        return new carousel(containerId, carouselId)
    }
    return{
        createCarousel
    }
}

export default new carouselCreator();