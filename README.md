# CmdHelper

## Opis

CmdHelper to aplikacja webowa służąca jako interaktywny asystent poleceń wiersza poleceń. Narzędzie umożliwia szybkie wyszukiwanie, przeglądanie i uczenie się poleceń CMD/PowerShell wraz z ich składnią, przykładami użycia i szczegółowymi opisami. Projekt został stworzony, aby ułatwić pracę z wierszem poleceń zarówno początkującym, jak i zaawansowanym użytkownikom.

## Funkcje

- **Wyszukiwanie poleceń** - szybkie znajdowanie poleceń na podstawie słów kluczowych
- **Szczegółowe opisy** - każde polecenie zawiera dokładny opis funkcjonalności
- **Przykłady użycia** - praktyczne przykłady zastosowania poleceń
- **Kategoryzacja** - polecenia pogrupowane według kategorii i poziomu trudności
- **Sugestie wyszukiwania** - podpowiedzi podczas wpisywania zapytań
- **Responsywny interfejs** - dostosowany do urządzeń mobilnych i desktopowych

## Instalacja

Aby uruchomić projekt lokalnie, wykonaj następujące kroki:

```bash
# Klonowanie repozytorium
git clone https://github.com/twoj-username/CmdHelper.git
cd CmdHelper

# Instalacja zależności
npm install

# Konfiguracja bazy danych
# 1. Utwórz bazę danych PostgreSQL
# 2. Skonfiguruj połączenie w pliku .env (skopiuj .env.example do .env)
# 3. Uruchom migracje
npx drizzle-kit push

# Opcjonalnie: Załaduj przykładowe dane
psql -d twoja_baza_danych -f add_commands.sql

# Uruchomienie w trybie deweloperskim
npm run dev
```

## Użycie

1. **Wyszukiwanie poleceń** :
   * Wpisz zapytanie w pole wyszukiwania
   * Wybierz z listy sugestii lub naciśnij Enter, aby wyszukać
2. **Przeglądanie wyników** :
   * Wyniki są wyświetlane w formie listy z podstawowymi informacjami
   * Kliknij na polecenie, aby zobaczyć szczegółowy opis, składnię i przykłady
3. **Filtrowanie wyników** :
   * Możliwość filtrowania według kategorii i poziomu trudności
   * Sortowanie według różnych kryteriów

## Technologie

* **Frontend** :
  * React
  * TypeScript
  * Tailwind CSS
  * React Query
  * Radix UI (komponenty dostępności)
  * Vite (bundler)
* **Backend** :
  * Node.js
  * Express
  * TypeScript
  * Drizzle ORM
  * PostgreSQL / Neon Database
* **Narzędzia** :
  * ESBuild
  * Zod (walidacja)
  * Cross-env (zmienne środowiskowe)

## Współpraca nad projektem

Zachęcamy do współpracy nad rozwojem CmdHelper! Oto jak możesz się zaangażować:

1. **Zgłaszanie błędów i propozycji** :
   * Utwórz nowy Issue w repozytorium GitHub
   * Opisz dokładnie problem lub propozycję funkcjonalności
2. **Rozwój kodu** :
   * Wykonaj fork repozytorium
   * Utwórz nową gałąź dla swojej funkcjonalności (`git checkout -b nowa-funkcja`)
   * Wprowadź zmiany i przetestuj je lokalnie
   * Wyślij Pull Request z opisem zmian
3. **Dodawanie nowych poleceń** :
   * Możesz rozszerzyć bazę poleceń, dodając nowe wpisy do bazy danych
   * Upewnij się, że nowe polecenia zawierają wszystkie wymagane pola

## Licencja

Projekt jest udostępniany na licencji MIT.

Pełna treść licencji znajduje się w pliku [LICENSE](vscode-webview://1qd8v1tula0u43gou3ukfl0snpfh7dthaabr622qdvjsb150mmrk/LICENSE).

[![Licencja MIT](https://img.shields.io/badge/Licencja-MIT-blue.svg)](vscode-webview://1qd8v1tula0u43gou3ukfl0snpfh7dthaabr622qdvjsb150mmrk/LICENSE)

## Kontakt

[![Email](https://img.shields.io/badge/Email-Napisz%20do%20mnie-blue?style=for-the-badge&logo=gmail&logoColor=white)](mailto:netdark_1966@op.pl)

[![GitHub](https://img.shields.io/badge/GitHub-Darek1966-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Darek1966)
---
