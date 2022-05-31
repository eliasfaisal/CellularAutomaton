/*
    Conway's Game of Life
    =====================

    Created : 31 May 2022 | 15:24
    Author  : Elias Faisal
              github.com/eliasfaisal

    License : CC0-1.0 license
*/

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
var unitSize = 10;
var runing = false;
generateRandomData();

function generateRandomData(max=50) {
    let amount = Number(document.querySelector("#amount").value);
    let out = [];
    for (let i = 0; i < amount; i++) {
        out.push([Number((Math.random() * max).toFixed()), Number((Math.random() * max).toFixed())]);
    }
    window.data = out;
    render();
}

function filterAndKill(x, y) {
    let index = 'false';
    for (let i = 0; i < data.length; i++) {
        if (data[i][0] == x && data[i][1] == y) {
            index = i;
            data.splice(index, 1);
            // console.log(i,data)
            break;
        }
    }
    return index;
}

function render(size=unitSize) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 500, 500);
    ctx.fillStyle = '#000';
    for (let d of data) {
        ctx.fillRect(d[0] * size, d[1] * size, size, size);
    }
}

function alive(x, y) {
    let d = ctx.getImageData(x * unitSize, y * unitSize, 1, 1).data;
    let pixels = `${d[0]},${d[1]},${d[2]},${d[3]}`;
    if (pixels == '0,0,0,255') {
        // console.log('alive:',true)
        return true;
    } else {
        // console.log('alive:',false)
        return false;
    }
}

function getSurrouningAliveCount(x, y, size=unitSize) {
    let surrounding = [[(x - 1) * size, (y - 1) * size], [(x) * size, (y - 1) * size], [(x + 1) * size, (y - 1) * size], [(x - 1) * size, (y) * size], [(x + 1) * size, (y) * size], [(x - 1) * size, (y + 1) * size], [(x) * size, (y + 1) * size], [(x + 1) * size, (y + 1) * size]];
    let aliveCount = 0;

    for (let i = 0; i < surrounding.length; i++) {
        let d = ctx.getImageData(surrounding[i][0], surrounding[i][1], 1, 1).data;
        let pixels = `${d[0]},${d[1]},${d[2]},${d[3]}`;
        if (pixels == '0,0,0,255') {
            aliveCount++;
        }
    }
    return aliveCount;
}

function run() {
    let newData = [];
    for (let x = 0; x < 50; x++) {
        for (let y = 0; y < 50; y++) {
            let alives = getSurrouningAliveCount(x, y);
            if (alives == 3) {
                if (!alive(x, y)) {
                    newData.push([x, y]);
                }
            } else if (alives < 2 || alives > 3) {
                if (alive(x, y)) {
                    filterAndKill(x, y);
                }
            }
        }
    }
    data = data.concat(newData);
    //
    render();
    if (runing) {
        requestAnimationFrame(run)
    }
    ;
}

runbtn.onclick = (e)=>{
    let me = e.target;
    if (!runing) {

        me.innerText = "Stop";
        runing = true;
        requestAnimationFrame(run);
    } else {
        runing = false;
        me.innerText = "Run";
    }
}
