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

<div style="display: flex; align-items: center; gap: 15px;">
  <img src="logo.png" alt="Icon" width="70">
  <div style="display: flex; align-items: center; gap: 10px;">
    <span>netdark_1966</span>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
    </svg>
    <a href="mailto:netdark_1966@op.pl">netdark_1966</a>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
    <a href="https://github.com/Darek1966">GitHub — Darek1966</a>
  </div>
</div>

---
