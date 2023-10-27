let isP5Animating = false; 

const wrap = document.getElementsByClassName('wrap')[0];
const container = document.getElementsByClassName('container');
let page = 0;
const lastPage = container.length - 1;
let isAnimating = false; 


function startAnimation() {
    const po1 = document.getElementById('po1');
    const po2 = document.getElementById('po2');
    
    setTimeout(() => {
        po1.style.opacity = 1;
        setTimeout(() => {
            po1.style.opacity = 0; 
            po2.style.opacity = 1; 
        }, 2000);
    }, 1000);
}


window.addEventListener('wheel', (e) => {
    e.preventDefault();
    
    if(e.deltaY > 0){
        page++;
    }else if(e.deltaY < 0){
        page--;
    }
    if(page < 0){
        page=0;
    }else if(page > lastPage){
        page = lastPage;
    }
    wrap.style.top = page * -100 + 'vh';
    
    
    if (page === 1 && !isAnimating) {
        isAnimating = true;
        startAnimation(); 
    }

    
    if (page === 2 && !isP5Animating) {
        isP5Animating = true;  
        myP5.loop();  
    } else if (page !== 2 && isP5Animating) {
        isP5Animating = false;  
        myP5.noLoop();  
    }
}, {passive: false});

