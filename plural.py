import nltk
import random
from nltk.corpus import words
from nltk.tokenize import word_tokenize
from nltk.tag import pos_tag
import re


#Va chercher les données du dataset
list = words.words()
#print(list[:10])
#random.shuffle(list)


import inflect
engine = inflect.engine()


for w in list[:10]:
    w1 = word_tokenize(w)
    tagged_words = pos_tag(w1)
    #print(tagged_words)

mots = []
with open('auto2.txt', 'r', encoding='utf-8') as f:
    for i in range(22323):
        next(f)
    file_name_data = f.read().strip('\n').replace('\n', ' ').split('.')
    for x in file_name_data:
         for w in x.split(" "):
                    for word, pos in pos_tag(word_tokenize(w)):
                         if pos == 'VBZ':
                              print(word)
          
    

#print(mots[:25])
