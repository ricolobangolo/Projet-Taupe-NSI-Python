from random import randint
import time
cycle=0
monClic=0
touche=0
resultat=0
score=0
diambombe=0
proba=0
start=time.time()
def mousePressed(): 
    global monClic
    monClic=True

def setup():
    global img 
    size(700,600)
    strokeWeight(1)
    img = loadImage("image.png")
    


def draw():
    
    global CARREposx,CARREposy,BOMBEposx,BOMBEposy,diametre #On globalise les variables à tout le programme
    global cycle,touche, monClic,score,diambombe,proba
    global img1
        
    image(img,0,0,width,height)
    
    end=time.time()
    tps=end - start
    if cycle%50==0: #Une nouvelle cible est crée tous les 100 cycles
        CARREposx=randint(1,width)
        CARREposy=randint(1,height)
        BOMBEposx=randint(1,width)
        BOMBEposy=randint(1,height)
        diametre=randint(10,100)
        diambombe = 140
        resultat=False
        proba=randint(1,3)
    if proba==1:
        img1 = loadImage("bombe.png")
        image(img1,BOMBEposx,BOMBEposy,diambombe,diambombe)
    else:
        square(CARREposx,CARREposy,diametre)
    if monClic:
        if CARREposy<=mouseY<=CARREposy+diametre and CARREposx<=mouseX<=CARREposx+diametre:
            touche=True
            resultat=True
            score=score+1
        elif BOMBEposy<=mouseY<=BOMBEposy+diambombe and BOMBEposx<=mouseX<=BOMBEposx+diambombe:
            touche=True
            resultat=True
            score=score-5
        else:
            touche=False
            score=score-1
        monClic=False

    if touche==True:
        textSize(32) #taille
        text(u"Gagné", width/2-35, height/2)
    else:
        textSize(32) #taille
        text(u"Perdu", width/2-35, height/2)
    textSize(32)
    text(u"Score : ",10,30)
    text(score,120,30)
    text(tps, width/8, height/8)



    cycle=cycle+1
