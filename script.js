/*
    Conway's Game of Life Simulation With JavaScript
    ================================================

    Created : 31 May 2022 | 15:24
    Author  : Elias Faisal
              github.com/eliasfaisal

    License : MIT Licence
*/

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

var grid_data = generateGridCells(100, 1000);
var FPS = 30;
var viewPortSize = 100;
var cellSize = 5;

var gridLines = false;
var running = false;

onload = ()=>{
    render();
}

function cellState(x, y) {
    if( x<0 || x > viewPortSize-1 || y<0 || y > viewPortSize-1 ){
        return 0;
    }
    return grid_data[y][x];
}

function changeState(x, y, newState){
    grid_data[y][x] = newState;
}

function emptyGridCells(gridSize = viewPortSize) {
    let y = [];
    let x = [];

    //Fill
    for(let i = 0; i < gridSize; i++){
        for(let j = 0; j < gridSize; j++){
            x.push(0);
        }
        y.push(x);
        x = [];
    }

    return y;
}

function generateGridCells(gridSize = viewPortSize, amount = 50) {
    let y = [];
    let x = [];

    //Fill
    for(let i = 0; i < gridSize; i++){
        for(let j = 0; j < gridSize; j++){
            x.push(0);
        }
        y.push(x);
        x = [];
    }

    //Spread the amount of alive cells
    for(let i = 0; i < amount; i++){
        let xPos = parseInt((Math.random()*gridSize));
        let yPos = parseInt((Math.random()*gridSize));
        y[ yPos ][ xPos ] = 1;
    }

    return y;
}

function mergeGridData(newData) {
    for(let i = 0; i < newData.length; i++){
        let x = newData[i][0];
        let y = newData[i][1];
        grid_data[y][x] = 1;
    }
}

function get_alive_surrounding(x,y) {
    let aliveCount = 0;
    aliveCount += cellState(x-1,y-1);
    aliveCount += cellState(x-1,y  );
    aliveCount += cellState(x-1,y+1);

    aliveCount += cellState(x  ,y-1);
    aliveCount += cellState(x  ,y+1);

    aliveCount += cellState(x+1,y-1);
    aliveCount += cellState(x+1,y  );
    aliveCount += cellState(x+1,y+1);

    return aliveCount;
}

function getNextGeneration(x,y) {
    let state = cellState(x,y);
    let alive_surrounding = get_alive_surrounding(x,y);

    if( alive_surrounding == 3){
        //recover cell
        return [x,y,1];

    }else if (alive_surrounding < 2 || alive_surrounding > 3) {
        //kill cell
        return [x,y,0];
    }

    return [x,y,state];
}

function lifeCycle() {
    let newGenerationData = [];

    for(let x = 0; x < viewPortSize; x++){
        for(let y = 0; y < viewPortSize; y++){
            newGenerationData.push(getNextGeneration(x,y));
        }
    }

    for(let i = 0; i < newGenerationData.length; i++){
        let x = newGenerationData[i][0];
        let y = newGenerationData[i][1];
        let z = newGenerationData[i][2];
        grid_data[y][x] = z;
    }
}

function renderGridLines(){
    ctx.fillStyle = '#e9e9e9';
    for(let i = 0; i < viewPortSize; i++){
        for(let j = 0; j < viewPortSize; j++){
            ctx.fillRect(i*cellSize, j*cellSize, (viewPortSize*cellSize) ,1);
            ctx.fillRect(i*cellSize, j*cellSize, 1 ,(viewPortSize*cellSize))
        }
    }
}

function render() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 500, 500);

    if(gridLines){
        renderGridLines();
    }

    ctx.fillStyle = '#000';

    for(let x = 0; x < viewPortSize; x++){
        for(let y = 0; y < viewPortSize; y++){
            if(cellState(x,y) == 1){
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
}

function run() {
    if(!running){
        return false;
    }
    render();
    lifeCycle();
    setTimeout(()=>{requestAnimationFrame(run)}, 1000/FPS );
}

function simState(state) {
    running = !!state;
}

//mouse events

var drawnCell = [];
var isDown = false;
var draw = false;

canvas.onmousedown = ()=>{
    isDown = true;
}

onmouseup = ()=>{
    isDown = false;
    if(drawnCell.length > 0){
        mergeGridData(drawnCell);
        drawnCell = [];
    }
}

canvas.onmousemove = (e)=>{
    if(!isDown || !draw){
        return false;
    }

    let x = Number((e.offsetX / cellSize).toFixed())*cellSize;
    let y = Number((e.offsetY / cellSize).toFixed())*cellSize;

    drawnCell.push([x/5,y/5]);

    ctx.fillRect(x ,y ,cellSize,cellSize);
}

//touch screen events
canvas.addEventListener('touchmove',(e)=>{
    if(!draw){
        return false;
    }

    e.preventDefault();

    let x = Number((e.touches[0].clientX / cellSize).toFixed())*cellSize;
    let y = Number((e.touches[0].clientY / cellSize).toFixed())*cellSize;

    drawnCell.push([x/5,y/5]);

    ctx.fillRect(x ,y ,cellSize,cellSize);
});

//buttons events

runbtn.onclick = ()=>{
    if(!running){
        runbtn.innerText = 'Stop';
        simState(1);
        run();
    }else{
        runbtn.innerText = 'Run';
        simState(0);
    }
}

randbtn.onclick = ()=>{
    grid_data = generateGridCells(viewPortSize, Number(rndCellsAmount.value));
    render();
}

drbtn.onclick = ()=>{
    if(!draw){
        drbtn.innerText = '?? Draw';
        canvas.style.cursor = 'cell';
        draw = true;
    }else{
        drbtn.innerText = 'Draw';
        draw = false;
        canvas.style.cursor = 'default';
    }
}

clrbtn.onclick = ()=>{
    grid_data = emptyGridCells(viewPortSize);
    render();
}

stepbtn.onclick = ()=>{
    lifeCycle();
    render();
}

iRenderGrids.onchange = ()=>{
    gridLines = iRenderGrids.checked;
    render();
}

// inputs events

iVPS.onchange = ()=>{
    viewPortSize = Number(iVPS.value);
}

iFPS.onchange = ()=>{
    FPS = Number(iFPS.value);
}

iCellSize.onchange = ()=>{
    cellSize = Number(iCellSize.value);
}
