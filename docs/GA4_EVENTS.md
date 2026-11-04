# Documentation des Événements GA4 & Conversions

Ce document détaille les événements Google Analytics 4 (GA4) et Meta Pixel configurés sur **https://hervenanfang.art** pour le suivi des 4 parcours stratégiques de conversion (Piano-bar live, Conférences & Masterclasses, A Laiz Academy, Conseil & IA).

Conformément à la politique de confidentialité et aux standards éthiques d'Hervé Nanfang, **aucune donnée personnelle sensible** (nom, email, téléphone, contenu du message) n'est transmise aux plateformes d'analyse tierces.

---

## 1. Événements de Conversion Principaux

| Nom de l'événement | Déclencheur | Paramètres transmis | Plateformes |
| :--- | :--- | :--- | :--- |
| `form_view` | Affichage du formulaire de contact interactif | `form_id`: 'contact_form'<br>`motive`: identifiant du parcours présélectionné<br>`page`: URL de la page courante | GA4, Meta Pixel |
| `form_start` | Première interaction / focus dans un champ du formulaire | `form_id`: 'contact_form'<br>`motive`: identifiant du parcours<br>`page`: URL de la page courante | GA4, Meta Pixel |
| `form_submit_success` | Soumission réussie d'une demande de contact / devis | `form_id`: 'contact_form'<br>`motive`: identifiant du parcours validé<br>`page`: URL de la page courante | GA4, Meta Pixel |
| `form_submit_error` | Erreur lors de la validation ou de la soumission du formulaire | `form_id`: 'contact_form'<br>`error_category`: catégorie de l'erreur<br>`page`: URL de la page courante | GA4, Meta Pixel |
| `Lead` (Standard) | Soumission réussie (événement d'objectif commercial) | `content_category`: catégorie du lead<br>`content_name`: motif ou parcours choisi<br>`currency`: 'XAF'<br>`value`: 0 | GA4, Meta Pixel |

---

## 2. Événements d'Engagement Direct (WhatsApp & Téléphone)

| Nom de l'événement | Déclencheur | Paramètres transmis | Plateformes |
| :--- | :--- | :--- | :--- |
| `contact_method_click` | Clic sur un bouton d'action WhatsApp ou d'appel téléphonique direct | `method`: 'whatsapp' \| 'phone' \| 'email'<br>`offer_type`: contexte ou motif ('booking', 'hero_fast', etc.)<br>`page`: URL de la page courante | GA4, Meta Pixel |
| `cta_click` | Clic sur l'un des boutons de parcours du Hero ou des sections clés | `cta_id`: identifiant du bouton ('hero_booking', etc.)<br>`offer_type`: parcours cible<br>`placement`: zone ('hero', 'live_section', etc.)<br>`page`: URL de la page courante | GA4, Meta Pixel |

---

## 3. Cartographie des 4 Parcours et Motifs

| Parcours | Valeur `motive` / `offer_type` | Cible d'ancrage | Destination WhatsApp préremplie |
| :--- | :--- | :--- | :--- |
| **01. Le Pianobariste** | `booking` | `/contact#booking` | Demande de prestation live (mariages, hôtels, galas) |
| **02. Conférences & Masterclasses** | `conference` | `/contact#conference` | Invitation institutions, festivals, écoles supérieures |
| **03. A Laiz Academy** | `formation` | `/contact#formation` | Cursus instrumentaux, Permis de Jouer™, formation continue |
| **04. Conseil & IA** | `conseil` | `/contact#conseil` | Accompagnement Musicien Augmenté™, stratégie sonore & IA |

---

## 4. Implémentation Technique

Le déclencheur centralisé réside dans [`src/lib/ad-pixels.ts`](file:///c:/HN_MARQUE/herve-nanfang/src/lib/ad-pixels.ts).  
Chaque appel utilise de manière non bloquante `window.gtag('event', ...)` et `window.fbq('track', ...)`.

