let sketch = function(p) {
    let photo;
    let sortedData = [];
    let totalPixels;
    let imageGap = 10;
    let myImages = {};
    let strong; 
    let currentStrong;  
    let targetStrong;  
    let isAnimating = false; 
    let pot1, pot2, pot3, pot4;
    let easing = 0.05;
    let yearData = {
        "2013": { pot1: 6, pot2: 34, pot3: 39, pot4: 21 },
        "2016": { pot1: 5, pot2: 35, pot3: 40, pot4: 20 },
        "2019": { pot1: 5.21, pot2: 36.42, pot3: 39.13, pot4: 19.24 },
        "2022": { pot1: 5, pot2: 37, pot3: 39, pot4: 19 }
    };

    p.preload = function() {
        myImages["2013"] = p.loadImage('img/3dTest.jpg');
        myImages["2016"] = p.loadImage('img/3dTest.jpg');
        myImages["2019"] = p.loadImage('img/3dTest.jpg');
        myImages["2022"] = p.loadImage('img/3dTest.jpg');
    };

    p.setup = function() {
        let cnv = p.createCanvas(799, 968);
        cnv.parent('canvasContainer3'); 
        p.background(0);
        p.noLoop();
        p.draw = draw;
        p.mouseMoved = function() {
            p.redraw();
        };



        cnv.style('position', 'absolute');
        cnv.style('left', '504px');
        cnv.style('top', '50px');
        cnv.style('width', '801px');
        cnv.style('height', '970px');
        cnv.style('z-index', '3'); 

        setupYearButtons();
        setPotValues("2013");
        setImage();
        drawImage();
    }

    function setupYearButtons() {
        let buttons = document.querySelectorAll(".year-buttons button");
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                let selectedYear = this.getAttribute("data-year");
                setPotValues(selectedYear);
                setImage();
                p.clear();
                drawImage();
                updateCont3data2Text(selectedYear);
            });
        });
    }

    function updateCont3data2Text(year) {
        let potValues = yearData[year];
        let cont3data2Elem = document.getElementById("cont3data2");
        
        let potTexts = [];
        for (let pot in potValues) {
            potTexts.push(potValues[pot] + "%");
        }
        
        cont3data2Elem.innerHTML = potTexts.join('<br>');
    }

    function setPotValues(year) {
        pot1 = yearData[year].pot1;
        pot2 = yearData[year].pot2;
        pot3 = yearData[year].pot3;
        pot4 = yearData[year].pot4;
        photo = myImages[year];

        getpotion();
        setImage();
    }

    function applyWeight(value) {
        const weight = 1.5;
        return value * Math.pow(weight, (value / 100));
    }

    function setImage() {
        photo.resize(p.width, p.height);
        totalPixels = (p.width * p.height) / (imageGap * imageGap);
        photo.loadPixels();
        sortedData = [];

        for (let x = 0; x < p.width; x += imageGap) {
            for (let y = 0; y < p.height; y += imageGap) {
                let index = (x + y * p.width) * 4;
                let redC = photo.pixels[index];
                let greenC = photo.pixels[index + 1];
                let blueC = photo.pixels[index + 2];
                let brightness = redC * 0.299 + greenC * 0.587 + blueC * 0.114;

                let data = {
                    brightness: brightness,
                    x: x,
                    y: y,
                    currentX: x,
                    currentY: y
                };
                sortedData.push(data);
            }
        }
        sortedData.sort((a, b) => a.brightness - b.brightness);
    }

    function getpotion() {
        let pots = [
            { value: pot1, category: 'pot1' },
            { value: pot2, category: 'pot2' },
            { value: pot3, category: 'pot3' },
            { value: pot4, category: 'pot4' }
        ];
        pots.sort((a, b) => b.value - a.value);
    }

    function drawImage() {
        for (let i = 0; i < sortedData.length; i++) {
            let data = sortedData[i];
            let tempW = p.map(data.brightness, 0, 255, 40, 5);
            data.radius = tempW / 2;
            let category = getPotCategory(i);

            p.strokeWeight(1);  
            if (category === 'pot3') {
                p.noFill();
                p.stroke(0, 255, 255);
            } else if (category === 'pot2') {
                p.noFill();
                p.stroke(0, 13, 255);
            } else if (category === 'pot4') {
                p.noFill();
                p.stroke(128, 128, 128);
            } else if (category === 'pot1') {
                p.fill(255, 255, 255);
                p.stroke(255, 255, 255);
            }
            p.rect(data.currentX - tempW/2, data.currentY - tempW/2, tempW, tempW);
        }
    }

    function getPotCategory(index) {
        let break1 = Math.floor(sortedData.length * (pot1 / 100));
        let break2 = break1 + Math.floor(sortedData.length * (pot2 / 100));
        let break3 = break2 + Math.floor(sortedData.length * (pot3 / 100));
        let break4 = break3 + Math.floor(sortedData.length * (pot4 / 100));

        if (index < break1) {
            return 'pot1';
        } else if (index < break2) {
            return 'pot2';
        } else if (index < break3) {
            return 'pot3';
        } else if (index < break4) {
            return 'pot4';
        }
    }

    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        setImage();
        p.clear();
        drawImage();
    }

    function draw() {
        p.background(0);
    
        for (let data of sortedData) {
            updatePixelPositionWithMouse(data);
            data.currentX = p.lerp(data.currentX, data.x, 0.05);
            data.currentY = p.lerp(data.currentY, data.y, 0.05);
        }
        drawImage();
    }
    
    function updatePixelPositionWithMouse(data) {
        let distance = p.dist(p.mouseX, p.mouseY, data.currentX, data.currentY);
        let maxDistance = 60;
    
        if (distance < maxDistance) {
            let diffX = p.mouseX - data.currentX;
            let diffY = p.mouseY - data.currentY;
    
            let force = (1 - (distance / maxDistance)) * 20;
    
            data.currentX -= diffX * force / distance;
            data.currentY -= diffY * force / distance;
        }
    }
    
};

let myP5 = new p5(sketch);


//두번째 코드 

let sketch2 = function(p) {
    let photo;
    let imageGap = 10;
    let strong;

    p.preload = function() {
        photo = p.loadImage('aiMan2.jpg');
    }

    p.setup = function() {
        let cnv = p.createCanvas(630, 760);
        cnv.parent('canvasContainer4');  
        p.background(255);
        cnv.style('z-index', '3'); 

        
        photo.resize(p.width, p.height);
        p.image(photo, 0, 0);
    }
     p.draw = function() {
        // 현재 강도 값을 목표 강도 값으로 서서히 이동
        currentStrong += (targetStrong - currentStrong) * easing;

        p.background(255);
        strong = currentStrong;
        setImage();
    }

    p.setDistortion = function(role, strength) {
        p.background(255);
        strong = strength;
        setImage();
    }

    function setImage() {
        if (typeof strong === 'undefined') return;

        imageGap = p.map(strong, 0, 100, 20, 3);

        for (let x = 0; x < p.width; x += imageGap) {
            for (let y = 0; y < p.height; y += imageGap) {
                distortImage(x, y, imageGap + p.noise(x, y) * strong, imageGap + p.noise(y, x) * strong);
            }
        }
    }

    function distortImage(x, y, w, h) {
        let randomPosX = x + p.noise(x) * strong - strong / 2;
        let randomPosY = y + p.noise(y) * strong - strong / 2;

        randomPosX = p.constrain(randomPosX, 0, p.width - w);
        randomPosY = p.constrain(randomPosY, 0, p.height - h);

        p.image(photo, randomPosX, randomPosY, w, h, x, y, w, h);
    }
};

let myP52 = new p5(sketch2);

function createButtonsForSketch2() {
    let buttonData = [
        { label: '관리직', strength: 33.4 },
        { label: '전문직', strength: 47.4 },
        { label: '사무직', strength: 39.6 },
        { label: '서비스판매직', strength: 48.8 },
        { label: '기능직', strength: 48.4 },
        { label: '기계직', strength: 63.6 },
        { label: '노무직', strength: 81.7 }
    ];

    let container = document.getElementById('canvasContainer4');
    let buttonContainer = document.createElement('div');
    buttonContainer.className = 'buttonContainer';
    
    let strengthDiv = document.getElementById('strengthValue');
    
    // 페이지가 로드될 때 기본값을 "0"으로 설정
    strengthDiv.textContent = "0";

    buttonData.forEach(data => {
        let button = document.createElement('button');
        button.textContent = data.label;
        button.addEventListener('click', () => {
            myP52.setDistortion(data.label, data.strength);
            strengthDiv.textContent = data.strength;  // 숫자 값만 표시
        });
        buttonContainer.appendChild(button);
    });

    container.appendChild(buttonContainer);
}



// 페이지 로딩 후 버튼 생성
window.onload = function() {
    createButtonsForSketch2();
}

