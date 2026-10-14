import re
import json

raw_text = """
## 1. USA & ENGLAND
1. Stuck On You (F) – Lionel Richie  
2. All Night Long (C#)  
3. Hello (Am)  
4. Storm Is Over (Bb) – R Kelly  
5. Gotham City (F#)  
6. I’m Your Angel (C) – R Kelly feat. Céline Dion  
7. If I Could Turn (Ab)  
8. Spirit (Bb)  
9. Need An Angel (B)  
10. World’s Greatest (G)  
11. Have A Dream (G) – Westlife  
12. You Raise Me Up (Eb)  
13. My Love (C)  
14. You’re Still The One (Eb) – Shania Twain  
15. You’re Beautiful (Eb) – James Blunt  
16. Need You  
17. All Of Me (Fm) – John Legend  
18. Man’s Man’s Man’s World (C#M) – James Brown  
19. Wonderful World (F)  
20. Down On My Knees (Fm) – Ayo  
21. Slow Slow (Gm)  
22. We Are The World (E) – Michael Jackson  
23. Lost Children (F) – Michael Jackson  
24. Speechless (Bb) – Michael Jackson  
25. Earth Song (G#M) – Michael Jackson  
26. Liberian Girl (G#M) – Michael Jackson  
27. Give In To Me (Em) – Michael Jackson  
28. I’ll Always Love You (A) – Whitney Houston  
29. Hotel California (Bm) – Eagles  
30. Eh ! Jude (F)  
31. Let It Be (C)  
32. Love’s Divine (A) – Seal  
33. Kiss By A Rose (G) – Seal  
34. No One (E) – Alicia Keys  
35. Fallin’ – Alicia Keys  
36. Another Day In Paradise (Fm) – Phil Collins  
37. One More Night – Phil Collins  
38. Baby Can I Hold You (D) – Tracy Chapman  
39. Talking About The Revolution (G) – Tracy Chapman  
40. Walking Away (Am) – Craig David  
41. Rendez-Vous  
42. Ive Got A Woman (A) – Ray Charles  
43. Georgia On My Mind (F) – Ray Charles  
44. Sexual Healing (D) – Marvin Gaye  
45. Just The Two Of Us (C#) – Grover Washington Jr.  
46. Hello (Fm) – Adele  
47. Fantasy (Em9) – Earth, Wind & Fire  
48. Everything I Do (C#) – Bryan Adams  
49. Celebration (Dm) – Kool & The Gang  
50. Never Be The Same Again (Gm) – Mel C  
51. Angel (F#) – Shaggy  
52. Unleash The Dragon (G#M) – Sisqo  
53. Unbreak My Heart (D) – Toni Braxton  
54. Somewhere Over The Rainbow (C) – Frank Sinatra  
55. Sacrifice (C#) – Elton John  
56. Candle In The Wind (E) – Elton John  
57. Killing Me Softly (Ab) – Charles Fox  
58. Mr. Jailer (Am) – Asa  
59. U  

## 2. FRENCH WAVE
1. Maladie D’amour (Eb) – Michel Sardou  
2. Le Privilège (C)  
3. Attention Les Enfants (D)  
4. Should I Leave (F) – David Sharvet  
5. T’aime (Ab) – Patrick Fiori  
6. Le Temps Des Cathédrales (Cm) – Notre Dame De Paris  
7. Belle (Dm) – Garou  
8. Danse Mon Esméralda  
9. Lune  
10. Florence  
11. Demande Au Soleil (G)  
12. Sous Le Vent (F#M) – (Garou & Céline Dion)  
13. L’adieu  
14. Je N’attendais Que Vous  
15. Que L’amour Est Violent (C#)  
16. Seul (Gm)  
17. Femme Libérée  
18. Lady Melody  
19. L’enfant Du Pays (Bm) – Singuila  
20. Femme Pressée  
21. Ma Nature (Bm)  
22. Rossignol (E)  
23. Beleive In You (Em) – Céline Dion  
24. On Ne Change Pas (Dm) – Céline Dion  
25. S’il Suffisait (Gm) – Céline Dion  
26. Pour Que Tu M’aimes Encore (D) – Céline Dion  
27. To Love You More – Céline Dion  
28. Personne (Bm) – Pascal Obispo  
29. Tu Trouveras (Ebm) – (feat. Natasha St-Pier)  
30. L’île Aux Oiseaux (Cm)  
31. Parce Qu’on Vient De Loin (Bm) – Corneille  
32. L’encre De Tes Yeux (E) – Francis Cabrel  
33. 100 Ans (E)  
34. Emmenez-Moi (Am) – Aznavour  
35. La Bohème (Fm) – Aznavour  
36. Le Pornographe (Am) – Brassens  
37. Salut Les Amoureux (D) – Joe Dassin  
38. Ma Dernière Chanson (Bb)  
39. Aïcha (Gm) – Cheb Khaled  
40. C’est La Nuit (D)  
41. Hélène (Gm) – Roch Voisine  
42. Tellement (D) – De Palmas  
43. Une Seule Vie (C)  
44. J’en Rêve Encore (C#M)  
45. J’ Me Tire (C#M) – Gims  
46. Laissez Passer (Gm) – Gims  
47. Epuisé (Bm) – Gims  
48. Bella (Am) – Gims  
49. Une Nuit De Carnaval (Bm) – Julio Iglesias  
50. Le Monde Est Fou (Dm)  
51. Du Soleil (E) – Yannick Noah  
52. Les Lionnes (F#M) – Yannick Noah  
53. Métisse (Gm) – Yannick Noah  
54. Mon Plus Beau Noël (Am) – Johnny Hallyday  
55. Le Pénitencier (Am) – Johnny Hallyday  
56. D’en Haut (Bbm) – Grégory …  
57. Vivo Per Lei (E) – Bocelli  
58. De Ton Indifférence (C#m) – Laam  
59. Happy Birthday (C) – Matt Huston  
60. Né Quelque Part (Dm) – Maxime Le Forestier  
61. Trop Peu De Temps (B) – Nuttea  
62. Là-Bas (D) – Florent Pagny / Goldman  
63. Savoir Aimer (F#M) – Florent Pagny  
64. A Nos Actes Manqués (E) – JJ Goldman  
65. Ma Philosophie (Em) – Amel Bent  
66. Perce Les Nuages (A) – Isabelle Boulay  
67. Pour Mieux T’aimer (C) – Nana Mouskouri  
68. Siffler Sur La Colline (Dm) – (Joe Dassin ou Claude François)  
69. Belle Belle Belle (Ab) – Claude François  
70. Comme D’habitude (F) – Claude François  
71. Aline (Bb) – Christophe  
72. J’ai Tant Besoin De Toi (F)  

## 3. NAIJA & AFRO
1. Lovingjoytis (Gm) – Wizboyy feat. Teeyah  
2. Me And You (E)  
3. My Wife (Bb) – Don Tom  
4. Dance For Me (Bm) – J. Martins  
5. Ashaho (F#) – Flavour  
6. African Queen (Bb) – 2Face (ou Face)  
7. Grace A Toi Germaine (A) – JB Mpiana  
8. Feu De L’amour (D)  
9. Dis-Moi Amour (C#)  
10. 48 H (Bb)  
11. Villégiature  
12. Kobosanate (C) – Fally  
13. Sweet Life (G)  
14. Cadenas (C)  
15. Amour Assassin (C)  
16. Mon Amour (G)  
17. Nourrisson (Em)  
18. Prince De Southfork (Am)  
19. On Vous Connaît (C#M) – Patience Dabani  
20. L’amour D’une Mère (Am)  
21. Mario (D) – Franco  
22. Onynye (F#M) – P Square  
23. Collabo (B)  
24. Tchop My Money (F)  
25. Will You Marry Me (C) – Prince Chinedu  
26. Ada Ada (G) – Flavour  
27. Chiny Baby (F)  
28. Libérez Mon Pays (A) – Soum Bil  
29. Ngneze (Gm)  
30. L’un Pour L’autre (Am)  
31. Rêves D’enfance (Am) – Magic System  
32. 1er Gaou (Gm) – Magic System  
33. Tapez Dos (D)  
34. Secret Africain (C)  
35. M’ninda (Ab)  
36. Amoulanga (G)  
37. Abou Sagacité (Eb)  
38. Comment Ça Va (Cm) – Papou  
39. Associé (Bb) – (feat. Grace Decca) Kemayou  
40. Mika (B) – Teeyah  
41. Kutchi Kutchi (F)  
42. Voisin Voisine (F) – Daouda  
43. Bouquet De Fleurs (Ab)  
44. La Femme De Mon Patron (A)  
45. Mon Cœur Balance (F)  
46. François (C#) – Petit Sako  
47. David Contre Goliath (C)  
48. Ohypope (G) – Dj Leo  
49. Comment Te Dire (Em) – Bana C4  
50. Kedike (F) – Chidinma  
51. Sytia Loss (G) – Eddy Kenzo  
52. L’année De Mon Année (B) – Jc Pluriel  
53. Heros Des Temps (Bb)  
54. Move Dadass (C) – Bebi Phillip  
55. Balumba (A)  
56. Double Wahala (Eb) – Oritse Femi  
57. Naleli (B) – Lino Versace (feat. Borosangui)  
58. Na Gode (F) – Yemi Alade  
59. Johny (Gm) – Yemi Alade  
60. Kissing (F#) – Yemi Alade  
61. Diplôme (C) – Josey  
62. Fifi (E) – Awilo Longomba  
63. Mobimba (Dm)  
64. Coupé Dibamba (Em)  
65. Gâté Le Coin (G)  
66. Skelewu (Bbm) – Davido  
67. 2ème Mi-Temps (F#M) – Defao  
68. Nana (Eb) – Diamond Platnumz feat. Flavour  
69. Dans La Cité (Am) – Doug Saga  
70. Je T’aime (Bm) – Espoir 2000  
71. Série C (F#)  
72. Mascara (E) – Fabregas  
73. Kukere (Ebm) – Iyanya  
74. Toukou Toukou (C) – Koffi  
75. Super Sonic (A)  
76. Ultimatum (A)  
77. Premier Jour A Paris (F#M) – Petit Yodé  
78. Victoire (A)  

## 4. CAMER 237
1. Dipita (Dm) – Richard Bona  
2. Bisso Baba (Em)  
3. O Sen Sen (D) – Bebe Manga  
4. Kalabankoro (C#M)  
5. Mutula Muto (F) – X Maleya  
6. Eyala (C)  
7. Katy – Dipanda  
8. Elle Ne L’a Pas Vu (F)  
9. Coucou (Eb) – Dinastie  
10. Wandewè (C) – Longuè Longuè  
11. Kirikou (Bb)  
12. Temoignez moi (F)  
13. Quand l’homme est content  
14. Je Ne Mourrais Pas (F)  
15. Mekeladia (C) – Tchakounté  
16. Bepuna (C) – Fefe Bekombo  
17. Brigite (C)  
18. Nandegue (F) – Rigobert Samo  
19. La Femme C’est La Femme (A) – Fontanel  
20. Noa (Dm) – Sam Fan Thomas  
21. Associé (Bb) – Elvis Kemayou  
22. Maguy (C) – Andy  
23. Jumelles (F) – Belka Tobi  
24. Sollitude (F#)  
25. Amours Et Folies (C) – Sergeo Polo  
26. Solentine (Gm)  
27. Mundenguè (G) – Jacky Kingué  
28. Ayo Africa (E)  
29. Ossas (G) – Salla Bekono  
30. Alpha Et Omega (E)  
31. Mave Wa Ngan (F) – Labe’l  
32. Bessombock (C) – J P Ahanda  
33. Maman Odile (D) – Tonton Ebogo  
34. Dikom La Muto (D)  
35. Ekang (F) – Zanganlewa  
36. Doudou (C) – Diane Ndjayo  
37. Elégancia (A) – Narcis Prise  
38. Yondo (A) – Erico  
39. Ndjomboss (F)  
40. Shi Me Mi (F) – Stypak  
41. Papier Hygiénique (Ab) – Eboa Lotin  
42. Elimb’a Dikalo (Bb)  
43. Ebongwa Londo (B) – Nguea La Route  
44. Un Peu D’amour (Bb) – Grace Decca  
45. I Need Some Love (C)  
46. Va-T’en (D) – Tchana Pierre  
47. Il N’est Jamais Trop Tard (D)  
48. Aba Yok (G)  
49. My Bamenda (F#) – Dog Star  
50. Ho A Muto (Dm) – Henri Dikonguè  
51. Bulu Bo Windi Tengue (C#)  
52. Françoise (D)  
53. C’est La Vie (E)  
54. Simo (C) – Bissi Mag  
55. Amour Sincère (F) – Tsimi Toro  
56. Ça Me Fera Souffrir (E) – Ottou Marcelin  
57. L’orphelin (B) – Abdou Benito  
58. Sweet Mother (F) – Nico Mbarga  
59. Akié Special (Ab)  
60. Attends-Moi (Dm) – Eke Roosevelt  
61. Wagna Wagna (Dm)  
62. Babaa (Am) – Featurist  
63. Juventus – Axel Muna  

## 5. WEST INDIAN & ZUK
1. Ce Pa Pou Dat (Em) – Alan Cave  
2. Amour En Or (C) – David Ramen  
3. Ne Me Quitte Pas (G#) – Brel  
4. Remember Me (Bb) – Lucky Dube  
5. Prisoner (B) – Lucky Dube  
6. Femme Libérée (Gm) – Cookie Dingler  
7. Océan (B) – Thierry Cham  
8. Tant Pi (Em) – Medi Custo  
9. Rété (G) – Kassa’v  
10. De Ti Bo (F) – Coupé Cloué  
11. One Love (Bb) – Bob Marley  
12. Redemption Songs (G) – Bob Marley  
13. Stir It Up (A) – Bob Marley  
14. Get Up Stand Up (Cm) – Bob Marley  
15. Could You Be Loved (Cm) – Bob Marley  
16. No Woman No Cry (C#) – Bob Marley  
17. Au Mariage De Ma Femme (G) – Compagnie Créole  
18. Ça Fait Rire Les Oiseaux (F) – Compagnie Créole  
19. Le Bal Masqué (A) – Compagnie Créole  
20. Un Cadeau Du Ciel (C)  
21. Scandale Dans La Famille (E)  
22. Alice Ça Glisse (G#M) – Francky  
23. Balada Boa (Bm) – Gustavo Lima  
24. Ancré A Ton Port (Em)  
25. T’en Va Pas (F)  
26. Fallait Pas (G) – Jacky Rapon  
27. Emmene Moi (Eb) – Pierrette Adams  
28. La Belle Histoire (Am)  
29. Tu Es Mon Soleil (Em) – Princesse Lover  
30. Brulant Et Violent (Em) – Claudy Siar  
31. Mon Bébé (Bm) – Miguelito feat. Teeyah  
32. Brigadier Sabari (Bbm) – Alpha Blondy  
33. Sweet Fanta Dialo (Eb) – Alpha Blondy  
34. Travailler C’est Trop Dur (F)  
35. J’ai Peur (F#m) – Youri  
36. Je L’aime (Am) – Fanny  

## 6. JAZZY
1. Autumn Leaves  
2. All Of Me  
3. La Vie En Rose  
4. Yesterday  
5. Mademoiselle Chante Le Blues  
6. Mon Mec À Moi  
7. Feel Good  
8. Blue Bossa  
9. Take Five  
10. Bars Of Blues  
11. Summertime  
12. When I Fall In Love  
13. Only You  

## 7. AFRICA
1. My Hope (C) – Youssou Ndour  
2. Birima (Bb) – Youssou Ndour (?)  
3. Tajabone (Am) – Ismael Lo  
4. Yayedemin (Fm) – Mewey feat. Monique Seka  
5. Vis-A-Vis (A)  
6. Ancien Combattant (Am) – Zao  
7. L’amour (C) – Rico Campos  
8. Wazakoua (C) – Sesimè  
9. Vive Les Mariés (A) – Vickey G G  
10. Gentelman (A)  
11. Solutions (F) – All Bax  
12. Hongan (A) – Don Metok  
13. Très Incorrecte (C) – Sagbohan  
14. La Musica (Em) – Gnonnas Pedro  
15. Wombolo Wombolo (G) – Angélique Kidjo  
16. Yamore (C#m) – Salif Keita  
17. Mbifê (C)  
18. Samaone (G) – Dobet Gnaore  
19. Musiki (Eb)  
20. Baye (D) – Monique Seka  
21. Show Me The Way (Cm) – Papa Wemba  
22. Yolele (Bm) – Papa Wemba  
23. Vuli Ndela (F) – Brenda Fassie  
24. Très Impoli (F) – Franco  
25. Mario (D) – Franco  
26. (F) – Sewlan Aziza  
27. Beauté Africaine (F) – Jospinto  
28. Caballo Viego (Dm) – Roberto Torres  
29. Malaïka (D) – Miriam Makeba  
30. Sing Me A Song (C#)  
31. Sodad (Cm) – Cesaria Evora  
32. Petit Pays (Em) – Cesaria Evora  
33. Beleive In You (D) – Lokua Kanza  
34. Le Bonheur (Bm)  
35. On Va Faire Comment (Fm) – Fanicko  
36. Yéké Yéké (Cm) – Mory Kanté  

## 8. GOSPEL WAVE
1. Au Paradis (A) – Excell  
2. God Will Make A Way (G) – Don Moen  
3. God Is Good (D)  
4. Be Magnified (G)  
5. Seigneur Ne M’abandonne Pas (Em) – Harpe De David  
6. Louez L’éternel (E)  
7. Gnamien (C)  
8. Persévère (F#) – Olivier Tcheuwa  
9. Dieu Tout Puissant (Bb)  
10. Parfum (G)  
11. Si Tu Veux Le Louer (D) – Exo Eclat  
12. Du sein de ton agneau (F)  
13. Ça Va Aller (F) – Elysée  
14. Above All (F) – Women Of Faith  
15. Wonderful Merciful (A)  
16. Come And Make (G)  
17. My Redeemer Lives (E)  
18. Yes Lord (G)  
19. Igwé (A) – Midnight Crew  
20. Awesome God (Dm) – Donnie McClurkin  
21. Great Is Your Merci (Gm)  
22. Father, Can You Hear Me (Bb) – Tiffany Evans  
23. J’irai (D)  
24. He’ll Welcome Me (F) – John P Kee  
25. How It Used To Be (Am) – Kirk Franklin  
26. Down By River Side (G) – Louis Armstrong  
27. When The Saint (F)  
28. Happy Day (G)  
29. Dieu Ne Cessera (C) – Onel Mala  
30. Happy Day (G)  
31. All Honour (Dm) – Ron Kenolly  
32. Winna Man (F)  
33. Shilo (F) – Gael  
34. Moto Oyo (A) – Makoma  
35. Jésus est mon ami  
36. Jesus you love me too much  
37. Tu es tout pour moi  
38. Yaya eh  
39. Yeshua  
40. Compil 1  
41. Darling Jésus  
42. Merci Alléluia !  
43. Il y a Dieu dedan5n !  
44. Je ne vois dit pas  
45. Je dis non  
46. Ce que Dieu a fait pour moi  
47. Jésus t’es l’amour de ma vie  
48. Na Godé  
49. Je t’aime tu le sais  
50. Jésus nous sommes là… Yaya eh…  
51. Eh ….ah… en ce momoent  
52. Parle-moi de ton Jésus  

## 9. RAP
1. Tata Nzambe – Bisso Na Bisso  
2. Apres La Guerre  
3. Bisso Na Bisso  
4. Africa By Night  
5. Je Me Souviens – Menelik  
6. Avant Qu’elle Parte – Sexion d’Assaut  
7. Je Reste Debout  
8. Coller La Petite – Franko  
9. La vallee de Dana  
10. Je me souviens  

## 10. PLAYLIST 2020
1. Matta swag  
2. Babatchai  
3. Mafuzzy style  
4. Seconde chance  
5. Django  
6. J’ai dit non  
7. C’est lui  
8. Le temps1  
9. Party rock  
10. Danza kuduro  
11. La même  
12. Touché Coulé  
13. Yope  
14. C’est pas normal – Toofan  
15. Ona  
16. La victoire – KErozen  
17. Le temps  
18. Mon heure a sonné  
19. Organise  
20. Joha  
21. It’s plenty  
22. Soweto  
"""

def parse_line(line):
    line = line.strip()
    # match leading number
    m = re.match(r'^\d+\.\s*(.+)$', line)
    if not m:
        return None
    content = m.group(1).strip()
    
    # check for artist separated by – or -
    artist = None
    if '–' in content:
        parts = content.split('–', 1)
        song_part = parts[0].strip()
        artist = parts[1].strip()
    elif ' - ' in content:
        parts = content.split(' - ', 1)
        song_part = parts[0].strip()
        artist = parts[1].strip()
    else:
        song_part = content

    # check for key in parenthesis (e.g., (F), (C#M), (Gm), (Em9))
    key = None
    km = re.search(r'\(([A-G][b#]?[a-zA-Z0-9]*)\)', song_part)
    if km:
        key = km.group(1)
        title = song_part[:km.start()].strip() + song_part[km.end():].strip()
    else:
        title = song_part

    # clean trailing characters
    title = title.strip()
    if artist:
        artist = artist.strip()
        
    return {
        "title": title,
        "key": key,
        "artist": artist,
    }

categories = [
    ("usa-england", "USA & England", "Pop internationale, Soul, R&B, Rock & Ballades intemporelles"),
    ("french-wave", "French Wave", "Grandes chansons francophones, Variété noble & Auteurs-compositeurs"),
    ("naija-afro", "Naija & Afro", "Afropop, Afrobeats, Rumba congolaise, Coupé-décalé & Grooves panafricains"),
    ("camer-237", "Camer 237", "Trésors musicaux du Cameroun : Makossa, Bikutsi, Mangambeu, Rhapsodies & Ballades"),
    ("west-indian-zouk", "West Indian & Zouk", "Zouk rétro, Reggae, Rythmes des Antilles, Caraïbes & Océan Indien"),
    ("jazzy", "Jazzy & Standards", "Standards intemporels de jazz, swing, blues & Great American Songbook"),
    ("africa", "Grand Répertoire Africain", "Classiques panafricains, légendes mandingues, Cap-Vert & musiques du continent"),
    ("gospel-wave", "Gospel Wave", "Gospel contemporain, hymnes d’élévation, louange et célébration"),
    ("rap", "Rap & Pop Urbaine", "Rap populaire, classiques hip-hop francophones et africains"),
    ("playlist-2020", "Clubbing & Hits Actuels", "Hits contemporains, afrobeats récents et ambiances festives modernes"),
]

lines = raw_text.split('\n')
cur_cat_idx = -1
cat_songs = {c[0]: [] for c in categories}

for line in lines:
    line = line.strip()
    if not line:
        continue
    if line.startswith('## 1.'):
        cur_cat_idx = 0
    elif line.startswith('## 2.'):
        cur_cat_idx = 1
    elif line.startswith('## 3.'):
        cur_cat_idx = 2
    elif line.startswith('## 4.'):
        cur_cat_idx = 3
    elif line.startswith('## 5.'):
        cur_cat_idx = 4
    elif line.startswith('## 6.'):
        cur_cat_idx = 5
    elif line.startswith('## 7.'):
        cur_cat_idx = 6
    elif line.startswith('## 8.'):
        cur_cat_idx = 7
    elif line.startswith('## 9.'):
        cur_cat_idx = 8
    elif line.startswith('## 10.'):
        cur_cat_idx = 9
    elif cur_cat_idx >= 0:
        parsed = parse_line(line)
        if parsed:
            cat_id = categories[cur_cat_idx][0]
            cat_songs[cat_id].append(parsed)

total = sum(len(v) for v in cat_songs.values())
print(f"Total parsed: {total}")
for c in categories:
    print(f"{c[1]}: {len(cat_songs[c[0]])}")

# Output TypeScript file
ts_output = """/**
 * Répertoire officiel — Hervé Nanfang · Le PianoBariste™
 *
 * Catalogue consigné de 441 titres maîtrisés, répartis en 10 univers musicaux.
 * Ce corpus atteste l'étendue du répertoire joué en live lors des prestations
 * (palaces, réceptions diplomatiques, galas de prestige, mariages et concerts privés).
 */

export interface RepertoireSong {
  id: string
  title: string
  key?: string
  artist?: string
  category: string
  categoryLabel: string
}

export interface RepertoireCategory {
  id: string
  num: string
  label: string
  description: string
  count: number
  songs: RepertoireSong[]
}

export const REPERTOIRE_CATEGORIES: RepertoireCategory[] = [
"""

song_id_counter = 1
all_songs = []

for idx, (cat_id, label, desc) in enumerate(categories):
    songs = cat_songs[cat_id]
    num_str = f"{idx + 1:02d}"
    ts_output += f"  {{\n    id: '{cat_id}',\n    num: '{num_str}',\n    label: {json.dumps(label, ensure_ascii=False)},\n    description: {json.dumps(desc, ensure_ascii=False)},\n    count: {len(songs)},\n    songs: [\n"
    for s in songs:
        s_id = f"rep-{song_id_counter:03d}"
        song_id_counter += 1
        key_val = f"'{s['key']}'" if s['key'] else "undefined"
        artist_val = json.dumps(s['artist'], ensure_ascii=False) if s['artist'] else "undefined"
        title_val = json.dumps(s['title'], ensure_ascii=False)
        ts_output += f"      {{ id: '{s_id}', title: {title_val}, key: {key_val}, artist: {artist_val}, category: '{cat_id}', categoryLabel: {json.dumps(label, ensure_ascii=False)} }},\n"
        all_songs.append({
            "id": s_id,
            "title": s['title'],
            "key": s['key'],
            "artist": s['artist'],
            "category": cat_id,
            "categoryLabel": label
        })
    ts_output += "    ],\n  },\n"

ts_output += "]\n\n"
ts_output += "export const ALL_REPERTOIRE_SONGS: RepertoireSong[] = REPERTOIRE_CATEGORIES.flatMap((c) => c.songs)\n"
ts_output += f"export const REPERTOIRE_TOTAL_COUNT = {len(all_songs)}\n"

with open("src/data/repertoire.ts", "w", encoding="utf-8") as f:
    f.write(ts_output)

print("src/data/repertoire.ts generated successfully!")
