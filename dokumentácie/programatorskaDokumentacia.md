# Programátorská dokumentácia

Vytvoril som webovú aplikáciu, ktorá z PID GTFS ([PID Open Data](https://pid.cz/en/opendata/)) čerpá dáta o spojeniach pražskej MHD. Konkrétne filtruje dáta o električkových spojoch. Zároveň používam JavaScript knižnicu [Leaflet](https://leafletjs.com/), ktorá umožňuje vykresliť mapu a ďalej s ňou pracovať.

## Funkcionalita aplikácie

### Home

Stránka Home umožňuje používateľovi vybrať si ľubovoľnú trasu električky a následne danú trasu vykreslí na Leaflet mapu.

[Otvoriť stránku Home](https://www.ms.mff.cuni.cz/~granskye/mhdprague/index.php)

### Departures

Stránka Departures umožňuje používateľovi vybrať si konkrétny dátum, čas a zastávku. Aplikácia následne na základe zvolených kritérií zobrazí niekoľko nadchádzajúcich spojov električiek.

[Otvoriť stránku Departures](https://www.ms.mff.cuni.cz/~granskye/mhdprague/departures_arrivals.php)

### Quiz

Stránka Quiz funguje ako kvíz na hádanie električkových liniek. Na stránke sa nachádza tlačidlo **Start**. Po jeho stlačení sa vykreslí náhodná električková trasa a používateľ má za cieľ uhádnuť číslo danej linky. Nasleduje niekoľko ďalších podobných otázok.

Na konci si používateľ môže, ak získal aspoň 1 bod, zapísať dosiahnuté skóre spolu so svojou prezývkou (*nickname*) do tabuľky všetkých výsledkov (*leaderboard*).

[Otvoriť stránku Quiz](https://www.ms.mff.cuni.cz/~granskye/mhdprague/quiz.php)

### Leaderboard

Stránka Leaderboard obsahuje tabuľku všetkých výsledkov hráčov, ktorí sa zapojili do kvízu. Výsledky sú zoradené zostupne podľa počtu bodov. Pri rovnakom počte bodov rozhoduje čas strávený hraním kvízu; kratší čas znamená vyššie umiestnenie.

[Otvoriť stránku Leaderboard](https://www.ms.mff.cuni.cz/~granskye/mhdprague/leaderboard.php)

## Východzie súbory

Veľkú časť aplikácie tvorí práca s dátami. Dáta sa čerpajú zo štyroch súborov PID GTFS:

- `stops.txt`
- `route_stops.txt`
- `stop_times.txt`
- `trips.txt`

### `stops.txt`

Súbor obsahuje všetky električkové zastávky v Prahe a informácie o nich. Každá zastávka je identifikovaná jedinečným `stop_id`.

Pre aplikáciu sú kľúčové tieto údaje:

- `stop_id` – identifikátor zastávky
- `stop_name` – názov zastávky
- `stop_lat` – zemepisná šírka
- `stop_lon` – zemepisná dĺžka

### `route_stops.txt`

Súbor obsahuje všetky „bežné“ trasy električiek. Pri každej trase sú uvedené všetky zastávky a smer jazdy.

Každá linka má spravidla dve bežné trasy, ktoré vedú opačnými smermi. Napríklad linka 10 má tieto trasy:

- `Sídliště Řepy – Sídliště Ďáblice`
- `Sídliště Ďáblice – Sídliště Řepy`

Pri prvej trase môže byť smer jazdy označený hodnotou `0` a pri druhej hodnotou `1`.

Linka 10 môže mať aj neštandardné trasy, napríklad pri jazde do vozovne alebo z nej.

### `stop_times.txt`

Súbor obsahuje údaje o zastávkach a časoch všetkých električkových jázd. Používa sa identifikátor `trip_id`. Pre každý `trip_id` sú uvedené všetky zastávky, ktorými trasa prechádza, spolu s časom odchodu električky z každej zastávky.

Z tohto súboru je možné získať všetky jazdy konkrétnej linky, napríklad linky 10, počas celého dňa.

### `trips.txt`

Súbor obsahuje všetky jazdy jednotlivých električiek. Každá jazda (`trip_id`) má priradený identifikátor `service_id`, ktorý určuje, v ktoré dni daný spoj premáva.

## Formátovanie dát

Všetky uvedené zdrojové súbory sú vo formáte CSV. Pomocou Python skriptu sa vyfiltrujú potrebné údaje a vytvoria sa z nich súbory JSON. Tieto súbory sa následne umiestnia na server, odkiaľ sa načítavajú pomocou JavaScript funkcie `fetch()` a ďalej sa používajú v aplikácii.

Python skript vytvára nasledujúce štyri súbory JSON.

### `stops.json`

Kľúčom je `stop_id` a hodnotou sú údaje `stop_name`, `stop_lat` a `stop_lon`.

Táto štruktúra umožňuje jednoducho získať názov zastávky a jej geografickú polohu iba pomocou `stop_id`. To je užitočné najmä pri vykresľovaní zastávok na mape.

### `routes.json`

Kľúč tvorí číslo linky spolu so smerom jazdy. Hodnotou je zoznam všetkých zastávok, ktorými linka v danom smere prechádza, vrátane informácií o jednotlivých zastávkach.

Tento súbor sa používa na vykresľovanie trás liniek, napríklad v kvíze.

### `stop_times.json`

Kľúčom je `stop_id`. Hodnotou je zoznam všetkých odchodov električiek z danej zastávky, zoradený vzostupne podľa času.

Každý odchod má priradený aj `trip_id`, pomocou ktorého je možné určiť, ku ktorej jazde patrí. V kombinácii s údajmi v `trips.json` možno zistiť aj cieľovú zastávku.

Tento súbor umožňuje vyhľadávať najbližšie odchody z konkrétnej zastávky v zadanom čase.

### `trips.json`

Kľúčom je `trip_id`. Hodnotou je zoznam všetkých zastávok na trase spolu s príslušnými časmi, kedy električka na jednotlivé zastávky prichádza alebo z nich odchádza, podľa údajov v zdrojovom súbore.

Pri vyhľadávaní odchodov sa tento súbor používa spolu so súborom `stop_times.json` na určenie cieľovej zastávky a zostavenie celej trasy jazdy.

### Filtrovanie a generovanie dát

Dáta sa spracúvajú jednoduchými prechodmi cez zdrojové súbory.

Zdrojové súbory obsahujú informácie nielen o električkách, ale aj o metre, autobusoch a trolejbusoch. Počas spracovania sa preto ponechávajú iba údaje týkajúce sa električiek. Filtrovanie sa vykonáva pomocou regulárnych výrazov (*regex*), keďže čísla električkových liniek sú známe.

Počas prechádzania súborov sa postupne vytvárajú uvedené JSON súbory podľa požadovanej štruktúry.

## Logika na serveri

Na serveri sa nachádzajú tri JavaScript súbory, ktoré riadia vykresľovanie mapy, priebeh kvízu a vyhľadávanie odchodov:

- `script.js`
- `quiz.js`
- `departures.js`

### `script.js`

Tento súbor zabezpečuje inicializáciu a vykreslenie mapy a zobrazenie vybranej električkovej trasy.

Keďže súbor `routes.json` obsahuje údaje o jednotlivých trasách, stačí vybrať konkrétnu linku a smer. Následne sa načítajú zastávky danej trasy spolu s príslušnými informáciami.

Tieto údaje sa použijú na vykreslenie zastávok v podobe kruhov na mape a na zakreslenie čiar, ktoré ich spájajú a znázorňujú trasu električky.

### `quiz.js`

Tento súbor riadi priebeh kvízu. Zabezpečuje správu stavov hry, počítanie skóre, časovač, náhodný výber električkovej trasy a na konci aj odoslanie výsledku.

### `departures.js`

Tento súbor zabezpečuje vyhľadávanie odchodov električiek zo zastávok.

Používateľ si môže vybrať konkrétnu zastávku, presný čas a deň v týždni. Aplikácia na základe týchto údajov vyhľadá najbližšie odchody a zobrazí nasledujúcich 10 spojov.

Vyhľadávanie prebieha prechodom cez údaje priradené vybranej zastávke v súbore `stop_times.json`. Tieto údaje tvoria zoznam odchodov zoradených podľa času.

Aplikácia prechádza zoznamom, kým nenájde odchody po požadovanom čase. Pri každom kandidátnom odchode skontroluje príslušný `service_id`, aby overila, či spoj v zvolený deň premáva. Ak premáva, odchod sa pridá do výsledného zoznamu. Proces pokračuje, kým sa nenájde 10 najbližších platných odchodov.

Zastávku je možné vybrať dvoma spôsobmi:

1. **Výberom zo zoznamu zastávok** – používateľ vyberie zastávku z ponuky všetkých zastávok. Keďže jedna zastávka môže obsahovať viacero nástupíšť, zobrazí sa 10 najbližších odchodov zo všetkých nástupíšť danej zastávky.
2. **Kliknutím na mapu** – používateľ klikne na zastávku na mape a môže vybrať konkrétne nástupište. V takom prípade sa zobrazí 10 najbližších odchodov iba z vybraného nástupišťa.

Vyhľadávanie odchodov funguje až po výbere dátumu a času cestovania.
