var canvas = document.getElementById('canvas');
const L = 10;
const colors = ['red', 'pink', 'navy', '#5F9EA0', 'Silver', 'Salmon', 'SeaGreen', 'RosyBrown', 'Tomato', 'Violet', '#708090', '#9ACD32']
var context = canvas.getContext('2d');
const cols = canvas.width / L;
const rows = canvas.height / L;
var grid = [];

var current = null;
console.log(chrome.loadTimes());

var line = function (beginX, beginY, endX, endY) {
    context.beginPath();
    context.moveTo(beginX*L, beginY*L);
    context.lineTo(endX*L, endY*L);
    // context.lineWidth = 1;
    context.strokeStyle="#000"
    context.stroke();
}
var lineVisited = function (beginX, beginY, endX, endY) {
    context.beginPath();
    context.strokeStyle="navy"
    context.moveTo(beginX*L, beginY*L);
    context.lineTo(endX*L, endY*L);
    // context.lineWidth = 1;
    context.stroke();
}
var fill = function (x, y, L, L, color) {
    context.beginPath();
    context.fillStyle = color;
    context.rect(x*L, y*L, L, L);
    context.fill();
    context.closePath();
    
}
function Index(i, j) {
    if (i < 0 || j < 0 || i > cols - 1 || j > rows - 1) {
        return -1;
    }
    return i + j * cols;
}
function Cell(i, j) {
    var self = {
        x: i,
        y: j,
        visited: false,
        walls: [true, true, true, true]
    }
    self.checkNeighbors = function () {
        var neighbors = [];
        var top = grid[Index(self.x, self.y - 1)]; 
        var right = grid[Index(self.x + 1, self.y)]; 
        var bottom = grid[Index(self.x, self.y + 1)]; 
        var left = grid[Index(self.x - 1, self.y)]; 

        if (top && !top.visited) {
            neighbors.push(top);
        }

        if (right && !right.visited) {
            neighbors.push(right);
        }

        if (bottom && !bottom.visited) {
            neighbors.push(bottom);
        }

        if (left && !left.visited) {
            neighbors.push(left);
        }

        if (neighbors.length > 0) {
            const r = Math.floor(Math.random() * neighbors.length);
            return neighbors[r];
        } else {
            return undefined;
        }
    }
    self.draw = function () {

        if (self.walls[0]) {
            line(self.x, self.y, self.x + 1, self.y);
            // if(self.visited)lineVisited(self.x, self.y, self.x + 1, self.y);
        }

        if (self.walls[1]) {
            line(self.x + 1, self.y, self.x + 1, self.y + 1);
            // if(self.visited)lineVisited(self.x + 1, self.y, self.x + 1, self.y + 1);
        }

        if (self.walls[2]) {
            line(self.x + 1, self.y + 1, self.x, self.y + 1);
            // if(self.visited)lineVisited(self.x + 1, self.y + 1, self.x, self.y + 1);
        }

        if (self.walls[3]) {
            line(self.x, self.y + 1, self.x, self.y);
            // if(self.visited)lineVisited(self.x, self.y + 1, self.x, self.y);
        }


        if (self.visited) {
            fill(self.x, self.y, L, L, "#fff");
        } else {
            fill(self.x, self.y, L, L, "#5F9EA0");
        }
    }

    return self;
}
var createGrid = function () {
    grid = [];
    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            grid.push(new Cell(i, j));
        }
    }
    current = grid[0];
    return grid;
}
var  draw = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    grid.forEach(e => {
        e.draw();
    });
}

var removeWalls = function(current,next){
    console.log(current,next);
    
    if(current.y - next.y === -1){
        current.walls[2] = false;
        next.walls[0] = false;
    }else{
        if(current.y - next.y === 1){
            current.walls[0] = false;
            next.walls[2] = false;
        }
    }
    
    if(current.x - next.x === 1){
        current.walls[3] = false;
        next.walls[1] = false;
    }else{
        if(current.x - next.x === -1){
            current.walls[1] = false;
            next.walls[3] = false;
        }
    }
}
var stack = [];
var drawGrid = async function () {
    current.visited = true;
    stack.push(current);
    draw();
    var next = current.checkNeighbors();
    while (stack.length > 0) {
        if (next) {
            removeWalls(current,next);
            next.visited = true;
            current = next;
            stack.push(current);
            next = current.checkNeighbors();
            try{
                wait();
            }catch(e){
                // wait(1000);
            }
            await draw();
            await new Promise((resolve,reject)=>setTimeout(resolve,rows * cols*1000));
            fill(self.x, self.y, L, L, "black");
        } else {
            current = stack.pop();
            next = current.checkNeighbors();
        }
    }
}


grid = createGrid();
draw();
setInterval(function () {
    drawGrid();
}, 0);



