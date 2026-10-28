# PROTOCOLE TECHNIQUE D'ENCAISSEMENT DES COMMISSIONS — CAMEROUN
**Amazon Partenaires & Thomann Partner • Circuit 0 FCFA de Frais Inutiles**

---

## 1. LE PROBLÈME RÉEL DU CRÉATEUR AU CAMEROUN

Si vous essayez d'encaisser directement vos commissions depuis l'Europe ou les États-Unis vers un compte bancaire local camerounais :
1. **Rejet ou impossibilité technique** : Amazon.fr et Thomann exigent un compte **SEPA (IBAN européen)**. Les coordonnées bancaires camerounaises (RIB national / SWIFT zone CEMAC) sont refusées par leurs formulaires de virement direct automatisé.
2. **Le piège des chèques papier** : Un chèque envoyé par la poste à Yaoundé met 2 à 4 mois pour arriver, risque de se perdre, et les banques camerounaises facturent entre 15 000 et 35 000 FCFA de frais d'encaissement avec 45 jours de délai de compensation.
3. **Le piège des virements SWIFT internationaux directs** : Un virement international SWIFT direct depuis l'Europe vers le Cameroun engendre entre **25 € et 45 € de frais intermédiaires**, ce qui anéantit complètement un premier gain de 50 €.

---

## 2. LA SOLUTION ÉPROUVÉE : LE PONT VIRTUEL PAYONEER (SEPA + ACH)

```mermaid
flowchart TD
    subgraph Europe / USA
        AZ[Amazon Partenaires FR / US] -->|Virement SEPA / ACH gratuit| P_EUR[Payoneer - Compte Récepteur Virtuel EUR / USD]
        TH[Thomann Partner Program] -->|Virement SEPA gratuit| P_EUR
    end

    subgraph Hub Payoneer
        P_EUR -->|Solde disponible en devises| P_BAL[Solde Payoneer]
    end

    subgraph Cameroun (Retrait & Dépense)
        P_BAL -->|Option A : Virement local CEMAC (24-48h)| BANK[Compte Bancaire Cameroun : UBA / Afriland / Ecobank]
        P_BAL -->|Option B : Guichet automatique ATM| CARD[Carte Mastercard Payoneer - Retrait Cash FCFA]
        BANK -->|Option C : Passerelle mobile| MOMO[MTN Mobile Money / Orange Money]
    end
```

### Pourquoi Payoneer est la clé :
- **100 % légal et gratuit** à l'ouverture pour les résidents camerounais.
- Fournit un **IBAN européen (Allemagne/Irlande)** et un **numéro de compte américain (ACH)** émis sous votre nom légal : **Hervé Nanfang**.
- Pour Amazon et Thomann, vous êtes payé comme si vous aviez un compte bancaire local en Europe (0 € de frais d'émission).

---

## 3. ÉTAPE 1 : OUVERTURE ET CONFIGURATION DU COMPTE PAYONEER

1. **Inscription** :
   - Rendez-vous sur [Payoneer.com](https://www.payoneer.com).
   - Choisissez le profil : **Freelance / Créateur de contenu / Vendeur en ligne**.
   - Type de compte : **Particulier (Individual)**.
2. **Identité légale** :
   - Nom et prénom : **Hervé Nanfang** (identique à votre CNI ou passeport).
   - Pays de résidence : **Cameroun**.
   - Adresse physique : Votre adresse réelle (Yaoundé / Douala).
3. **Documents de vérification (KYC)** :
   - Photo nette de votre Carte Nationale d'Identité (CNI) camerounaise ou Passeport.
   - Justificatif de domicile (facture Eneo/CDE, relevé bancaire local ou attestation de résidence).
4. **Liaison bancaire locale initiale** :
   - Renseignez les coordonnées de votre compte bancaire camerounais (UBA, Afriland First Bank, Ecobank, Société Générale, BICEC).
5. **Récupération des coordonnées SEPA / ACH** :
   - Une fois le compte validé, allez dans l'onglet **Recevoir** > **Comptes récepteurs (Receiving Accounts / Global Payment Service)**.
   - Notez précisément :
     * **Compte EUR** : Nom de la banque partenaire (ex. Citibank Europe ou Banking Circle), code BIC/SWIFT, et l'**IBAN** commençant par `DE` (Allemagne) ou `IE` (Irlande).
     * **Compte USD** : Routing Number (ABA) à 9 chiffres, Account Number et type (Checking).

---

## 4. ÉTAPE 2 : CONFIGURATION D'AMAZON PARTENAIRES (FRANCE)

1. **Création du compte** :
   - Rendez-vous sur [Partenaires Amazon France](https://partenaires.amazon.fr).
   - Renseignez votre identité réelle et l'URL de votre site : `https://hervenanfang.vercel.app`.
   - Décrivez votre site : *« Média d'analyse acoustique, de production musicale et d'ingénierie sonore fondé par Hervé Nanfang, avec guides d'achat de matériel home studio et MAO »*.
2. **Questionnaire fiscal (Tax Interview)** :
   - Statut : **Particulier / Non assujetti à la TVA**.
   - Pays de résidence fiscale : **Cameroun**.
   - Convention fiscale / Formulaire W-8BEN (si Amazon US) : Attestation de non-résidence américaine -> **0 % de retenue à la source**.
3. **Mode de versement (Payment Method)** :
   - Cliquez sur **Paramètres du compte** > **Modifier le mode de paiement**.
   - Cochez **Paiement par virement bancaire direct (Direct Deposit)**.
   - Sélectionnez le pays de la banque : **Allemagne (Germany)** ou **Irlande (Ireland)** (selon ce qu'indique votre compte EUR Payoneer).
   - Renseignez l'IBAN et le BIC fournis par Payoneer.
   - Nom du titulaire : **Hervé Nanfang**.
   - **Seuil minimum de paiement** : **25 €** (automatiquement versé chaque mois dès que 25 € sont atteints).
   - Délai de paiement : Fin de mois à J+60 (les commissions de janvier sont payées fin mars).

---

## 5. ÉTAPE 3 : CONFIGURATION DE THOMANN PARTNER PROGRAM

1. **Candidature** :
   - Rendez-vous sur la section partenaire de Thomann : [Thomann Affiliate Program](https://www.thomann.de).
   - Candidature sous le statut de créateur musical / webmaster.
   - Présentez votre site `https://hervenanfang.vercel.app` et votre profil d'ingénieur du son / formateur RMA.
2. **Rémunération & Taux** :
   - **3,5 % à 4,5 %** sur le matériel audio pro, claviers maîtres, micros, cartes son et synthétiseurs.
   - Durée du cookie : **14 jours**.
3. **Paramétrage du paiement** :
   - Plateforme de gestion des partenaires Thomann (interface Clickfire).
   - Mode de versement : **Virement bancaire (Bank Transfer)**.
   - Saisissez les coordonnées SEPA de votre compte EUR Payoneer (IBAN + BIC).
   - **Seuil de paiement** : **50 €**.
   - Dès 50 € cumulés, Thomann effectue un virement SEPA européen gratuit vers votre compte Payoneer.

---

## 6. ÉTAPE 4 : RETRAIT DE L'ARGENT VERS LE CAMEROUN EN FCFA

Dès que vos commissions arrivent sur votre solde Payoneer :

### Option A : Virement direct vers votre banque camerounaise (Recommandé)
- Dans Payoneer : **Retirer** > **Vers un compte bancaire**.
- Sélectionnez votre compte UBA / Afriland / Ecobank.
- Montant minimum : 50 $ / 50 €.
- Les devises (EUR/USD) sont converties en Francs CFA (XAF) au taux officiel avec une commission transparente de 2 %.
- Délai : 24 à 48 heures ouvrées sur votre compte à Yaoundé ou Douala.

### Option B : Carte Mastercard Payoneer (Retrait Cash aux DAB)
- Dès que vous avez reçu 100 $ d'encaissements cumulés sur Payoneer, vous pouvez commander la **Carte de débit Payoneer Mastercard**.
- La carte physique est expédiée au Cameroun (via DHL ou boîte postale).
- Vous pouvez retirer des espèces (FCFA) directement à tous les distributeurs automatiques du Cameroun (GAB UBA, Ecobank, SG, Afriland) ou payer dans les supermarchés et commerces.

---

## 7. CHECKLIST DE CONFORMITÉ & SÉCURITÉ

- [ ] Ne jamais utiliser de VPN avec une fausse géolocalisation lors de la création d'Amazon ou Payoneer.
- [ ] Votre nom complet doit être strictement identique partout : **Hervé Nanfang** (CNI, Payoneer, compte bancaire local, compte Amazon, compte Thomann).
- [ ] Sur votre site `hervenanfang.vercel.app`, afficher la mention de transparence légale : *« En tant que Partenaire Amazon / Thomann, Hervé Nanfang réalise un bénéfice sur les achats remplissant les conditions requises. »*
- [ ] Ne jamais cliquer vous-même sur vos propres liens d'affiliation pour acheter du matériel (détection d'adresses IP et annulation immédiate de compte par Amazon).
