//------------- Fonctions utiles -------------

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
const largeur=20;
const hauteur=20;

var score = 0;

const score_text = document.getElementById('score_text');

//------ Récupération du canvas ------

const canvas = document.getElementById('terrain');
const ctx = canvas.getContext('2d');

// Taille du côté d'un anneau en pixels dans
const anneauSize = 20;

const gridWidth = Math.floor(canvas.width / anneauSize);
const gridHeight = Math.floor(canvas.height / anneauSize);


var numRows = canvas.height / anneauSize; // nombre de rangées
var numCols = canvas.width / anneauSize; // nombre de colonnes
var colors = ["#ccc", "#bbb"];


class CreateCollectibleItem {

	constructor() {
		this.i = getRandomInt(gridWidth);
		this.j = getRandomInt(gridHeight);
	}

	draw() {
		ctx.fillStyle = '#ff00ff';
		ctx.beginPath();
        ctx.arc(this.i * anneauSize + anneauSize / 2, this.j * anneauSize + anneauSize / 2, anneauSize / 2, 0, 2 * Math.PI);
        ctx.fill();
	}

	move() {
		this.i = getRandomInt(gridWidth);
		this.j = getRandomInt(gridHeight);
	}
}

class CreateRock {

	constructor() {
		this.i = getRandomInt(gridWidth);
		this.j = getRandomInt(gridHeight);
	}

	draw() {
		ctx.fillStyle = '#000000';
        // ctx.beginPath();
		ctx.fillRect(this.i * anneauSize, this.j * anneauSize, anneauSize, anneauSize);
		// ctx.arc(this.i * anneauSize, this.j * anneauSize, anneauSize, anneauSize);
	}

	move() {
		this.i = getRandomInt(gridWidth);
		this.j = getRandomInt(gridHeight);
	}
}


//---------- Classe Anneau ----------
	
class Anneau {
	constructor(i, j, color) {
		this.i = i;
		this.j = j;
		this.color = color;
	}
	
	draw() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.i * anneauSize, this.j * anneauSize, anneauSize, anneauSize);
	}
	// 2ème version avec switch case
	move(dir) {
		switch(dir) {
			// Déplacement vers le haut
			case 0: this.j--; if (this.j < 0) this.j = gridHeight - 1; break;
			// Déplacement vers la droite
			case 1: this.i++; if (this.i > gridWidth - 1) this.i = 0; break;
			// Déplacement vers le bas
			case 2: this.j++; if (this.j > gridHeight - 1) this.j = 0; break;
			// Déplacement vers la gauche
			case 3: this.i--; if (this.i < 0) this.i = gridWidth - 1; break;
		}	
	}
	
	copy(anneau) {
		this.i = anneau.i;
		this.j = anneau.j;
	}
}

//---------- Classe Serpent ----------

class Serpent {
	constructor(longueur, i, j, dir, color) {
		// Longueur du serpent
		this.longueur = longueur;
		// Direction initiale
		this.dir = dir;
		this.anneaux = [];
		// Création de l'anneau de tête
		const tete = new Anneau(i, j, '#ff0000');
		this.anneaux.push(tete);
		// Création des anneaux du reste du corps
		for (let l = 1; l < longueur - 1; l++) {
			let anneau = new Anneau(i - l, j, color);
			this.anneaux.push(anneau);
		}
		// Création de l'anneau de queue
		const queue = new Anneau(i - (longueur - 1), j, '#0000ff');
		this.anneaux.push(queue);
        this.lastMove = 0;
	}
	
	draw() {
		for (let l = 0; l < this.longueur; l++) {
			this.anneaux[l].draw();
		}
	}
	
	move() {
		// On déplace les anneaux qui précèdent la tête
		for (let l = 1; l < this.longueur; l++) {
			this.anneaux[this.longueur - l].copy(
				this.anneaux[this.longueur - l - 1]);
		}
		// On déplace la tête
		this.anneaux[0].move(this.dir);
	}
	randomMove() {

        this.lastMove++;

        if (this.lastMove > 5) {
            if (Math.random() < (.5 + (Number(this.lastMove - 5)) / 10)) {
                const randomMove = Math.floor(Math.random() * 4);

                if (randomMove === this.dir) {
                    return;
                }

                switch(randomMove) {
                    case 0 :
                        if (this.dir === 2) {
                            return;
                        }
                        break;
                    case 1 :
                        if (this.dir === 3) {
                            return;
                        }
                    case 2 :
                        if (this.dir === 0) {
                            return;
                        }
                        break;
                    case 3 :
                        if (this.dir === 1) {
                            return;
                        }
                        break;
                }

                this.dir = randomMove
                this.lastMove = 0;
            }
        }
    }
	
	changeDirection(dir) {
		if (s.dir == 0 && dir == 2) {

		} else if (s.dir == 1 && dir == 3) {

		} else if (s.dir == 2 && dir == 0) {
		
		} else if (s.dir == 3 && dir == 1) {

		} else {
			this.dir = dir;
		}
	}

	extends() {
		const dernier_anneau = this.anneaux[this.longueur-1];
		const avant_dernier_anneau = this.anneaux[this.longueur-2];
		const nouvelle_position = {
			x: dernier_anneau.i + (dernier_anneau.i - avant_dernier_anneau.i),
			y: dernier_anneau.j + (dernier_anneau.j - avant_dernier_anneau.j)
		};
		const nouvel_anneau = new Anneau(nouvelle_position.x, nouvelle_position.y, dernier_anneau.color);
		dernier_anneau.color = avant_dernier_anneau.color;
		this.anneaux.push(nouvel_anneau);
		this.longueur++;
	}
	
}

// Création d'un objet de la classe Serpent
const item = new CreateCollectibleItem();
const rock = new CreateRock();
const rock1 = new CreateRock();
const rock2 = new CreateRock();
const rock3 = new CreateRock();
const s = new Serpent(6, 10, 9, 1, '#00ff00');
const s1 = new Serpent(5, 5, 15, 1, getRandomColor());
const s2 = new Serpent(3, 18, 5, 1, getRandomColor());
const s3 = new Serpent(8, 14, 12, 1, getRandomColor());
const s4 = new Serpent(3, 3, 9, 1, getRandomColor());
const s5 = new Serpent(3, 15, 4, 1, getRandomColor());
const s6 = new Serpent(5, 8, 2, 1, getRandomColor());
const play_game = document.getElementById('play_game');

let snakeList = [s1, s2, s3, s4, s5, s6];
let rockList = [rock, rock1, rock2, rock3];

play_game.addEventListener('click', function() {
	startRAF();
})

//---------- Gestion de l'animation ----------

// Fonction animant le serpent s
function anim() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (var row = 0; row < numRows; row++) {
		for (var col = 0; col < numCols; col++) {
		  var colorIndex = (row + col) % 2; // alterne les couleurs pour chaque case
		  var color = colors[colorIndex];
		  ctx.fillStyle = color;
		  ctx.fillRect(col * anneauSize, row * anneauSize, anneauSize, anneauSize);
		}
	}
	
	s.move();
	s.draw();

	snakeList.forEach(sRandom => {
		sRandom.draw();
		sRandom.move();
		sRandom.randomMove();
	})

	rockList.forEach(rocks => {
		rocks.draw();
	})

	item.draw();
	score_text.innerText = "Score : " + score;
	
	// console.log(item.i, item.j, s.anneaux[0].i, s.anneaux[0].j);
	
	snakeList.forEach(sRandom => {
		if (item.i == sRandom.i && item.j == sRandom.j) {
			sRandom.extends();
			item.move();
			item.draw();
		}
	})


	if (item.i == s.anneaux[0].i && item.j == s.anneaux[0].j) {
		s.extends();
		item.move();
		item.draw();
		score = score + 1;
		score_text.innerText = "Score : " + score;
		// console.log(score);
	}	
	
	for (let i = 1; i < s.anneaux.length; i++) {
		// console.log(s.anneaux[i].i);
		// console.log(s.anneaux[i].j);
		if (s.anneaux[0].i == s.anneaux[i].i && s.anneaux[0].j == s.anneaux[i].j) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			stopRAF();
			// enregistrerScore();
		}
	}


	rockList.forEach(rocks => {
		if (rocks.i == s.anneaux[0].i && rocks.j == s.anneaux[0].j) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			stopRAF();
		}
	});
}

// Identifiant du "timer"
let animationTimer = 0;
let starttime = 0;
// Fréquence d'affichage maximum
const maxfps = 10;
const interval = 1000 / maxfps;

// Fonction permettant de démarrer l'animation
function startRAF(timestamp = 0) {
	animationTimer = requestAnimationFrame(startRAF);
	if (starttime === 0) starttime = timestamp;
	let delta = timestamp - starttime;
	if (delta >= interval) {
		// Appel à la fonction d'animation
		anim();
		starttime = timestamp - (delta % interval);
	}
}

// Fonction permettant d'arrêter l'animation
function stopRAF() {
	cancelAnimationFrame(animationTimer);
	animationTimer = 0;
	alert('Vous avez perdu avec un score égal à :' + score);
	reset();
}

function reset() {
	score = 0;
	location.reload();
}


// Déclenchement de l'animation
// startRAF();

document.addEventListener('keydown', function(event) {
    if(event.key == "ArrowLeft") {
        // alert('La flèche de gauche a été préssée');
        s.changeDirection(3);
    }
    else if(event.key == "ArrowRight") {
        // alert('La flèche de droite a été préssée');
        s.changeDirection(1);
    }
    else if(event.key == "ArrowUp") {
        // alert('La flèche du haut a été préssée');
        s.changeDirection(0);
    }
    else if(event.key == "ArrowDown") {
        // alert('La flèche du bas a été préssée');
        s.changeDirection(2);
    }
});