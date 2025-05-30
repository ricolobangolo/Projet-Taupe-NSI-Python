
from random import randint
cycle=0
monClic=False
touche=False
def mousePressed(): 
    global monClic
    monClic=True
def setup():
    size(605,400)
def draw():
    global posx,posy,diametre #On globalise les variables à tout le programme
    global cycle,touche, monClic
    background(169,218,255)
    if cycle%50==0: #Une nouvelle cible est crée tous les 100 cycles
        posx=randint(1,width)
        posy=randint(1,height)
        diametre=randint(10,50)
    square(posx,posy,diametre)
    
    cycle=cycle+1 #connaitre le numero du cycle
   
    if monClic:
        if posy<=mouseY<=posy+diametre and posx<=mouseX<=posx+diametre:
            touche=True
        else:
            touche=False
        monClic=False
        
    if touche==True:
        textSize(32) #taille
        text(u"Gagné", width/2-32, height/2-16)
    else:
        textSize(32) #taille
        text(u"Perdu", width/2-32, height/2-16)
