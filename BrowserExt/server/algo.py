#Problème 1: L'application est en français mais le texte est corrigé en anglais
#Problème 2: Entrez quoi si le mot est présent
#Problème 3: Comment gèrer si l'utilisateur écrit un déterminant et un nom ou plusieurs mots différents (Exemple: the rat)

import pandas as pd
import numpy as np
import textdistance
import re
from collections import Counter
import sys
import os
import pathlib

pathdir = pathlib.Path(__file__).parent.resolve()
os.chdir(pathdir)

def levenshtein_distance(word1, word2):
    # Initialize a matrix with zeros
    matrix = [[0] * (len(word2) + 1) for _ in range(len(word1) + 1)]

    # Fill the first row and column of the matrix
    for i in range(len(word1) + 1):
        matrix[i][0] = i
    for j in range(len(word2) + 1):
        matrix[0][j] = j

    # Calculate the Levenshtein distance
    for i in range(1, len(word1) + 1):
        for j in range(1, len(word2) + 1):
            cost = 0 if word1[i - 1] == word2[j - 1] else 1
            matrix[i][j] = min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost)

    # Return the Levenshtein distance
    return matrix[len(word1)][len(word2)]

mots = []
with open('auto.txt', 'r', encoding='utf-8') as f:
    file_name_data = f.read()
    file_name_data=file_name_data.lower()
    mots = re.findall('\w+', file_name_data)

#lire les nouveau mots
with open('newWords.txt', 'r', encoding='utf-8') as f:
    file_name_data = f.read()
    file_name_data=file_name_data.lower()
    mots += re.findall('\w+', file_name_data)

V = set(mots)

mot_freq = {}  
mot_freq = Counter(mots)


#algo de probabilité
probs = {}     
Total = sum(mot_freq.values())    
for k in mot_freq.keys():
    probs[k] = mot_freq[k]/Total

global motCorrect
motCorrect = True

def my_autocorrect(mot, index):
    mot = mot.lower()
    if mot in V:
            return('Le mot est bon')
    else:
        motCorrect = False

        sim = [1-(textdistance.Jaccard(qval=2).distance(v,mot)) for v in mot_freq.keys()]
        df = pd.DataFrame.from_dict(probs, orient='index').reset_index()
        df = df.rename(columns={'index':'Word', 0:'Prob'})
        df['Similarity'] = sim
        distance = [levenshtein_distance(mot, v) for v in mot_freq.keys()] 
        df['distance_Lenv'] = distance 
      
        output = df.sort_values(by=['distance_Lenv','Similarity', 'Prob'], ascending=[True, False, False])[index*5:index*5+5]

        mots_possible = output['Word'].tolist()
        
        #print('Quel mot vous voulez dire?' + str(list(mots_possible)))
        return(output)

index = 0
mots = str(sys.argv[1]).split()
resultats = []
for mot in mots:
    print(my_autocorrect(mot, index))
    print("------------------------")

    if motCorrect == False:
        reponse = 0#input("Entrez un nombre correspondant (0 si le mot n'est pas présent et -1 si le mot est personnalisé):")

# voir les 5 prochains mots
        while(reponse =='0'):
            index +=1
            print(my_autocorrect(mot, index))  
            print("------------------------")
sys.stdout.flush()