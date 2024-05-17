import nltk
import random
from nltk.corpus import words
from nltk.tokenize import word_tokenize
from nltk.tag import pos_tag
import re
import inflect
engine = inflect.engine()

is_noun = lambda pos: pos[:2] == 'NN'

mots = []
with open('auto.txt', 'r', encoding='utf-8') as f:
    for i in range(22323):
        next(f)
    s = f.read().strip('\n').replace('\n', ' ').split('.')
    sentence = ''.join(s)
    tokens = nltk.word_tokenize(sentence)
    pos_tags = nltk.pos_tag(tokens)

    correction = []
    for token, pos in pos_tags:
        if pos == 'NN' and token != 'more':
            plural_token = engine.plural(token)
        else:
            plural_token = token
        correction.append(plural_token)
    
          
print(f"Pluralized: {' '.join(correction)}")

#print(mots[:25])
