import nltk
import random
from nltk.corpus import words
from nltk.tokenize import word_tokenize
from nltk.tag import pos_tag

def plural(word):
     return {'last_letter': word[-1]}

#Va chercher les données du dataset
list = words.words()
#print(list[:100])
#random.shuffle(list)

for w in list[:10]:
    w1 = word_tokenize(w)
    tagged_words = pos_tag(w1)
    print(tagged_words)

    
    print(plural(w))
