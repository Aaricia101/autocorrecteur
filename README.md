# Introduction au projet d'autocorrecteur

Le but de ce projet est simple. Nous allons créer un autocorrecteur qui va corriger les **fautes d'ortographe**, les **fautes de pluralités** et les **fautes de conjugaison** pour des textes en anglais. Le programme va avoir un système de rétroaction où l'utilisateur va pouvoir informer l'AI à propos des corrections proposés afin de savoir si elles sont bonnes ou mauvaises. De plus, si un mot n'est pas dans le dictionnaire, mais qu'il est réutiliser à plusieurs reprises, le programme doit être en mesure de s'adapter et d'accepter ce mot. Ainsi, le programme apprendra les habitudes grammaticales de l'utilisateur et de s'adapter à son écriture.

## Faute d'ortographe

Pour commencer, je vais me charger de trouver un algorithme qui va me permettre de trouver un ortographe erroné et de suggérer des corrections possibles. Je vais utiliser **(1) l'algorithme de distance de Levenshtein**, **(2) la similarité de Jaccard** et un **(3) algorithme de probabilité**.

### (1) L'algorithme de distance de Levenshtein

Pour cet algorithme, l'idée est de trouver le plus petit nombre de modification qu'il faut faire afin que le premier mot soi équivalant au deuxième mot. 

Il y a trois(3) modifications possibles:

1. Remplacer
2. Ajouter
3. Supprimer

Exemple 1 : Textse => Texte, c’est une modification (suppression de «s»)​


Exemple 2 : Gumbo => Gambol, c’est deux modifications («u» pour «a» et ajout de «l»)


Exemple 3 : Mamger => Manger, c’est une modification (remplace «m» par «n»)

Pour expliquer le code ci-dessous, je vais utiliser les mots « love » et « pova » comme exemple.

1) À la premier étape, il faut créer une matrice et l'initialiser à 0. Le mot « love » contient 4 lettres et « pova » contient 4 lettres donc nous aurons une matrice de 5x5 (la première case restera 0).
   
    ![image.png](attachment:30bb071a-f817-430f-a7d7-c1ae930d2ef7.png)
   

2) Maintenant, il faut remplir la première colonne et la première rangée avec des chiffres partant de 0 jusqu'à la taille complète du mot. (Les lettres ne font pas partie de la matrice. Ils sont présents seulement pour l'explication.)

    ![image.png](attachment:b32679c2-5958-4ad8-a414-8fbe45554772.png)

3) Ici, nous allons commencer à comparer les lettres. Voici les étapes:
     1. Si Mot[i] == Mot2[j], alors le coût est de 0
     2. Si Mot[i] != Mot2[j], alors le coût est de 1
  
     3. Entre les trois choix suivants, il faut trouver le plus petit nombre:
        - Matrix[i, j-1] + 1
        - Matrix[i-1, j] + 1
        - Matrix[i-1, j-1] + coût

        Ce nombre va être entreposé dans Matrix[i, j]
     
   
   Pour la première colonne, on va comparer les lettres du mots « LOVE » à la première lettre du mot « POVA ». Voici le résultat :

   ![image.png](attachment:079030c2-4f9f-4fca-a912-215733ca8992.png)

   En premier lieu, on a « L » comparé à « P ». Ces deux lettres sont différents donc le coût == 1.
   - Matrix[i, j-1] + 1 = 2
   - Matrix[i-1, j] + 1 = 2
   - Matrix[i-1, j-1] + coût = 1

  
   D'où Matrix[1, 1] = 1


   En deuxième lieu, on a « O » comparé à « P ». Le coût est 1.
   - Matrix[i, j-1] + 1 = 2
   - Matrix[i-1, j] + 1 = 3
   - Matrix[i-1, j-1] + coût = 1

  
   D'où Matrix[1, 2] = 2

   Il suffit de refaire les mêmes étapes jusqu'à la fin.

   ![image.png](attachment:e0ec457e-f248-4145-86d9-28bafd2de0e9.png)


4) Le dernière case nous illustre que la distance est de 2. En effet, on peut voir qu'il faut deux(2) modifications pour que « love » devient « pova ». Il suffit de changer le « l » pour un « p » et changer le « e » pour un « a ».​
