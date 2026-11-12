# Persönliche Wohnungssuche für Thomas

Im privaten Thomas-Chat ein Suchprofil mit eigenen Worten anlegen, ändern oder pausieren. „Suche jetzt mit meinem Profil“ beauftragt einen Durchlauf beim nächsten Wecktakt. „Suche täglich“ aktiviert für das gewählte Profil eine Suche ab 09:00 Uhr in Europe/Berlin. „Zeige mir meine Favoriten nochmal“ liest den persönlichen Verlauf. Ohne eigene Markierung kann Thomas frühere Empfehlungen zeigen.

Der Paket-Worker liest die reguläre Scout-Suchoberfläche textbasiert im isolierten Thomas-Chromium. Er bestätigt Gebiet und gegebenenfalls Umkreis, verfolgt sichtbare Folgeseiten und speichert seinen Fortschritt nach jeder Ergebnisseite. Pro Arbeitsabschnitt verarbeitet er höchstens drei Seiten und acht neue oder geänderte Exposés. Sichtbare Änderungen einer Trefferkarte oder ein geändertes Suchprofil lösen die Prüfung erneut aus. Änderungen ausschließlich im Detailtext eines unveränderten Listentreffers bleiben unentdeckt. Eine Zugriffssperre beendet den Lauf und erscheint im Profilstatus.

Die persönliche Datenhaltung und OAuth-Anmeldung stellt das Nachbarprojekt `apartment-search-package-service` bereit. Im Stammstack als Wheel installieren. Vom Paketverzeichnis aus:

```sh
uv build --wheel --out-dir dist
DOCKER_CONTEXT=desktop-linux THOMAS_BROWSER=1 ../portfolio-analyser/infrastructure/always-on/update_package.py --wheel dist/apartment_search-0.2.0-py3-none-any.whl
```

Danach im privaten Chat den persönlichen Connector verbinden und die eigenen Wünsche angeben. Der Tagesjob setzt laufenden Docker Desktop, Thomas und den persönlichen Dienst voraus.
