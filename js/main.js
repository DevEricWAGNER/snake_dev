let canvas = document.getElementById('terrain');
let ctx = canvas.getContext('2d');

function getRandomInt(max)
{
	return Math.floor(Math.random()*max);
}
	
// Fonction générant une couleur aléatoire
function getRandomColor()
{
	const red   = Math.floor((Math.random()*256));
	const blue  = Math.floor((Math.random()*256));
	const green = Math.floor((Math.random()*256));
	return "rgb("+red+","+green+","+blue+")";
}

class Anneau { // * REPRESENTE LES ANNEAUX DU SERPENT
	constructor(ctx, i, j, color) {
		this.ctx = ctx;
		this.i = i;
		this.j = j;
        this.vi = 2;
        this.vj = 2;
		this.color = color;
		this.radius = 20;
	}

    draw() {
        this.ctx.fillStyle = this.color;
		this.ctx.fillRect(this.i*this.radius, this.j*this.radius, this.radius, this.radius);
    }

    move(d) {
        const canvasWidth = this.ctx.canvas.clientWidth;
		const canvasHeight = this.ctx.canvas.clientHeight;
        if (d === 0) { // * vers le HAUT
            this.j = this.j-1;
        } else if (d === 1) { // * vers la DROITE
            this.i = this.i-1;
        } else if (d === 2) { // * vers le BAS
            this.j = this.j+1;
        } else if (d === 3) { // * vers la GAUCHE
            this.i = this.i+1;
        }
        
        //  Detection de bord droit
        if (this.i >= canvasWidth/this.radius) {
			this.i =0;
		}
		// Detection de bord gauche.
		if (this.i <0) {
			this.i = canvasWidth/this.radius - 1;
		}
		// Detection de bord inférieur
		if (this.j >= canvasWidth/this.radius) {
			this.j = 0;
		}
		// Detection de bord supérieur.
		if (this.j <0) {
			this.j = canvasHeight/this.radius - 1;
		}
    }

    copy(a) {
        this.i = a.i;
        this.j = a.j;
    }
}

class Serpent { // * REPRESENTE LES SERPENTS
	constructor(ctx, i, j, dir) {
		this.ctx = ctx;
		this.lng = 3;
		this.i = i;
		this.j = j;
		this.dir = dir;
        this.annTab = [];
        this.head = "green";
        this.corpse = "pink";
        this.queue = "red";

        for (let x = 0; x < this.annTab.length; x++) {
            if (x == 0) {
                const mob = new Anneau(this.ctx, 8, 8, this.head);
                this.annTab.push(mob);
            } else if (x == this.lng-1) {
                const mob = new Anneau(this.ctx, 8, 6, this.queue);
                this.annTab.push(mob);
            } else {
                const mob = new Anneau(this.ctx, 8, 7, this.corpse);
                this.annTab.push(mob);
            }
            
        }
	}

    draw() {
        this.annTab.forEach(function(item) {
            item.draw();
        });
    }

    move() {
        this.annTab[0].move(this.dir);
        for (let x = 0; x < this.annTab; x++) {
            if (x != 0) {
                this.annTab[x].copy(this.annTab[x-1]);
            }
        }
    }
}

const serpent = new Serpent(ctx, 8, 8, 1);
serpent.draw();

// const mob1 = new Anneau(ctx, 1, 1);
// const mob2 = new Anneau(ctx, 2, 1);
// mob1.draw();
// mob2.draw();

document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '38') {
        //up arrow
        console.log(e.keyCode);
        ctx.clearRect(0,0,400,400);
        mob2.copy(mob1);
        mob1.move(0);
        mob1.draw();
        mob2.draw();
    }
    else if (e.keyCode == '40') {
        //down arrow
        console.log(e.keyCode);
        ctx.clearRect(0,0,400,400);
        mob2.copy(mob1);
        mob1.move(2);
        mob1.draw();
        mob2.draw();
    }
    else if (e.keyCode == '37') {
        //left arrow
        console.log(e.keyCode);
        ctx.clearRect(0,0,400,400);
        mob2.copy(mob1);
        mob1.move(1);
        mob1.draw();
        mob2.draw();
    }
    else if (e.keyCode == '39') {
        //right arrow
        console.log(e.keyCode);
        ctx.clearRect(0,0,400,400);
        mob2.copy(mob1);
        mob1.move(3);
        mob1.draw();
        mob2.draw();
    }

}
