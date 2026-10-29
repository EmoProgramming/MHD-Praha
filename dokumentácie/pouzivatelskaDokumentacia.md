# Užívateľská dokumentácia

**MHD PRAGUE** je webová aplikácia určená na zobrazovanie električkových tratí na mape a vyhľadávanie odchodov električiek z nástupíšť ľubovoľnej zastávky v zadanom čase. Používateľom zároveň umožňuje overiť si znalosti o pražských električkových tratiach prostredníctvom kvízu.

Aplikácia je dostupná vo webovom prehliadači na tejto adrese:

[https://www.ms.mff.cuni.cz/~granskye/mhdprague/index.php](https://www.ms.mff.cuni.cz/~granskye/mhdprague/index.php)

Aplikácia obsahuje tri hlavné časti.

## Home

Na stránke **Home** si používateľ môže vybrať ľubovoľnú električkovú linku. Po stlačení tlačidla **Update** sa trasa vybranej linky zobrazí na mape.

Používateľ si môže pozrieť názvy jednotlivých zastávok kliknutím na ľubovoľnú zastávku zobrazenú na mape.

## Quiz

Na stránke **Quiz** si používateľ môže zahrať kvíz zameraný na pražské električkové trasy. Pravidlá kvízu sa nachádzajú v spodnej časti stránky.

Kvíz sa začne po stlačení tlačidla **Start**. Následne sa náhodne vyberie električková linka a jej trasa sa zobrazí na mape. Úlohou používateľa je uhádnuť číslo linky podľa zobrazenej trasy.

Takto sa postupne zobrazujú električkové linky v Prahe. Na konci sa používateľ môže zapísať do výsledkovej listiny na stránke **Leaderboard**, ak získal aspoň jeden bod.

Cieľom je dosiahnuť čo najvyššie skóre, teda uhádnuť čo najviac trás v čo najkratšom čase.

## Departures

Na stránke **Departures** si používateľ môže vybrať konkrétny čas a deň cestovania, od pondelka do nedele.

Zastávku je možné vybrať dvoma spôsobmi:

1. **Výberom zo zoznamu zastávok** – používateľ vyberie zastávku zo zoznamu všetkých zastávok. Po stlačení tlačidla **Show** sa zobrazí 10 najbližších odchodov električiek zo zvolenej zastávky v určenom čase.
2. **Výberom nástupišťa na mape** – používateľ klikne na konkrétne nástupište zastávky priamo na mape.

Rozdiel medzi týmito spôsobmi je v rozsahu zobrazených odchodov. Pri výbere zastávky zo zoznamu sa zobrazujú odchody zo všetkých nástupíšť danej zastávky. Pri kliknutí na konkrétne nástupište na mape sa zobrazujú iba odchody z tohto nástupišťa.

Výber nástupišťa priamo na mape funguje až po zadaní konkrétneho času a dňa cestovania.

Pri prvom otvorení stránky **Departures** je potrebné počkať, kým sa zo servera načítajú potrebné dáta.
