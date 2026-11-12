---
name: apartment-search-run
description: Passende Mietwohnungen auf ImmoScout24 mit dem aktiven Suchprofil suchen, frühere Vorschläge oder Favoriten aus dem persönlichen Verlauf wiederzeigen und explizites Gefallen speichern.
---

Nutze den persönlichen Connector apartment_search. Entscheide anhand des Anliegens.

**Wiederabruf** Bei „Gib mir nochmal die coolen Apartments“ oder „Was hattest du mir gezeigt?“ direkt recall_listings verwenden. Für „cool“, „meine Favoriten“ oder „gefielen mir“ zuerst liked_only=true. Fehlen Markierungen, sage das und biete mit liked_only=false die früheren Empfehlungen an. Führe dafür keine Suche aus. Zeige belegte gespeicherte Eckdaten, damalige Begründung und Original-Link. Nutze query und Pagination bei Bedarf. Nur liked=true als vom Nutzer gemocht bezeichnen. Die Quittung belegt, dass Thomas das Angebot gezeigt hat. Ein Besuch des Exposés ist unbekannt. Bei eindeutigem explizitem Gefallen like_listing verwenden, bei Ablehnung reject_listing.

**Neue Suche** Lies list_profiles. Fehlt ein aktives Profil, verwende apartment-search-profile. Binde im privaten Chat mit bind_personal_wake das Paket apartment-search, dann request_search für das gewählte Profil. Dies startet denselben Worker wie der Tagesjob beim nächsten Wecktakt (ca. fünf Minuten). Bestätige die Anfrage als vorgemerkt. Ohne ausdrücklich gewünschten Tagesauftrag bleibt daily unverändert. Für Status list_profiles lesen. Zugriffsblockaden, fehlende Ortsauswahl und begrenzte Abdeckung offen benennen. Treffer kommen nach Prüfung privat. Keine Vermieteransprache.
