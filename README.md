# Apartment Search Package

Dieses Repository enthält die Struktur des künftig öffentlichen Plugins für die Suche nach Mietwohnungen und Miethäusern. Der persönliche MCP-Dienst und seine SQLite-Daten gehören in das eigenständige Repository `apartment-search-package-service`.

Die Host-Manifeste liegen unter `plugins/apartment-search/`. Das Thomas-Manifest legt die Paket-ID fest. Die lokalen Marketplace-Manifeste verweisen auf dieses Plugin-Verzeichnis.

Unter `plugins/apartment-search/skills/` sollen die Skills für Suche, Kontaktaufnahme und Antwortzuordnung entstehen. Derzeit ist kein Skill implementiert. Es sind keine Werkzeuge, Verbindungen oder Weckaufträge registriert.
