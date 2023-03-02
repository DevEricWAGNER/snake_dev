//------------- Fonctions utiles -------------

// Fonction générant des nombres pseudo-aléatoires entiers
// entre 0 et max (max non compris)
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
	//return "rgba("+red+","+green+","+blue+",0.5)";
}

//------ Récupération du canvas ------

const canvas = document.getElementById('terrain');
const ctx = canvas.getContext('2d');

// Taille du côté d'un anneau en pixels dans
const anneauSize = 20;
// Taille de la grille du terrain en nombre de cellules
// (on suppose que canvas.width et canvas.height sont
// divisibles par anneauSize)
const gridWidth = Math.floor(canvas.width / anneauSize);
const gridHeight = Math.floor(canvas.height / anneauSize);

//---------- Classe Anneau ----------
	
class Anneau {
	constructor(i, j, color) {
		this.i = i;
		this.j = j;
		this.color = color;
	}
	
	draw() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.i * anneauSize, this.j * anneauSize,
		anneauSize, anneauSize);
	}
	
	/*
	// 1ère version avec des if
	move(dir) {
		if (dir == 0) {
			// Déplacement vers le haut
			if (this.j == 0) {
				this.j = gridHeight - 1;
			}
			else this.j--;
		}
		else if (dir == 1) {
			// Déplacement vers la droite
			if (this.i == gridWidth - 1) {
				this.i = 0;
			}
			else this.i++;
		}
		else if (dir == 2) {
			// Déplacement vers le bas
			if (this.j == gridHeight - 1) {
				this.j = 0;
			}
			else this.j++;
		}
		else if (dir == 3) {
			// Déplacement vers la gauche
			if (this.i == 0) {
				this.i = gridWidth - 1;
			}
			this.i--;
		}
	}
	*/
	
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
	constructor(longueur, i, j, dir) {
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
			let anneau = new Anneau(i - l, j, '#00ff00');
			this.anneaux.push(anneau);
		}
		// Création de l'anneau de queue
		const queue = new Anneau(i - (longueur - 1), j, '#0000ff');
		this.anneaux.push(queue);
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
	
	changeDirection(dir) {
		this.dir = dir;
	}
}

// Création d'un objet de la classe Serpent
const s = new Serpent(10, 10, 9, 1);

//---------- Gestion de l'animation ----------

// Fonction animant le serpent s
function anim() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	s.move();
	s.draw();
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
}

// Déclenchement de l'animation
startRAF();
