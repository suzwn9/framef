document.addEventListener("DOMContentLoaded", function() {
    const shapes = document.querySelectorAll('.shape');
    const logo = document.querySelector('#logo1'); 
    let maxDelay = 0;

    shapes.forEach(shape => {
        shape.style.opacity = '0';
        const delay = Math.random() * 2000;
        maxDelay = Math.max(maxDelay, delay);

        setTimeout(() => {
            shape.style.opacity = '1';
        }, delay);
    });

    setTimeout(() => {
        logo.style.opacity = '1';
    }, maxDelay + 2000); 
});


