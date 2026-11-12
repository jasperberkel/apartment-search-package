---
name: apartment-search-profile
description: Persönliches Suchprofil für Mietwohnungen anlegen, ändern, aktivieren oder pausieren und tägliche Suchen verwalten. Auch für Feedback zu einem gespeicherten Wohnungsangebot.
---

Verwende den persönlichen Connector apartment_search im privaten Chat. Bei fehlender Verbindung den nativen OAuth-Anmeldelink anbieten. Die Nutzeridentität bestimmt der Connector.

1. Lies list_profiles. Für ein neues Profil speichere den ausdrücklich genannten Wunschtext wörtlich. Übernimm genannte Gebiete, Umkreis, Mindestzimmer, Fläche, Warm-/Kaltmiete und Budget in filters. Freitext wie „Altbau“ und „große Küche“ gehört in wishes. Erfinde keine Präferenzen. Ist eine Änderung gemeint, behalte den ursprünglichen Text und hänge die wörtliche Änderung chronologisch an. Spätere Aussagen ersetzen widersprechende ältere. Passe die strukturierten Werte an.
2. Verwende save_profile mit revision aus list_profiles, für Neuanlage 0. Bewahre nicht angesprochene Einstellungen. active gibt das Profil zur Suche frei. daily nur bei ausdrücklichem Tagesauftrag einschalten, sonst bei Neuanlage false. Pausieren setzt active=false, Aktivieren active=true. Bei Konflikt neu lesen.
3. Für einen Tagesauftrag binde mit bind_personal_wake das Paket apartment-search an diesen persönlichen Chat. Melde den tatsächlichen Status. Der lokale Worker sucht bei eingeschaltetem Stack ab 09:00 Europe/Berlin.
4. Für „gefällt mir“ das konkret zuordenbare, zuvor gezeigte Angebot mit like_listing markieren. Bei mehrdeutigem Bezug mit recall_listings eingrenzen und nach dem Angebot fragen. Eine Empfehlung oder ein Linkaufruf ist kein Gefallen. Ablehnungen mit reject_listing speichern. Für frühere Wohnungen nutze den Wiederabruf des Suchskills.
