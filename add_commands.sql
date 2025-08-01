
-- Skrypt dodający 15 nowych poleceń CMD do tabeli polecenia_cmd

INSERT INTO polecenia_cmd (opis_krotki, polecenie, opis_szczegolowy, slowa_kluczowe, przyklady_uzycia) VALUES
('Wyświetla informacje o systemie', 'systeminfo', 'Polecenie systeminfo wyświetla szczegółowe informacje o konfiguracji komputera i jego systemie operacyjnym, w tym informacje o sprzęcie, sterownikach i poprawkach zabezpieczeń.', ARRAY['system', 'informacje', 'konfiguracja', 'sprzęt'], ARRAY['systeminfo', 'systeminfo > system_info.txt']),

('Wyświetla informacje o dyskach', 'wmic diskdrive list brief', 'Polecenie wyświetla podstawowe informacje o wszystkich dyskach twardych w systemie, w tym model, rozmiar i interfejs.', ARRAY['dysk', 'pamięć', 'wmic', 'lista'], ARRAY['wmic diskdrive list brief', 'wmic diskdrive list full']),

('Sprawdza stan baterii laptopa', 'powercfg /batteryreport', 'Generuje szczegółowy raport o stanie baterii laptopa, włączając w to historię użycia, pojemność i cykle ładowania.', ARRAY['bateria', 'laptop', 'zasilanie', 'raport'], ARRAY['powercfg /batteryreport', 'powercfg /batteryreport /output C:\battery_report.html']),

('Tworzy punkt przywracania systemu', 'wmic.exe /Namespace:\\root\default Path SystemRestore Call CreateRestorePoint', 'Tworzy punkt przywracania systemu, który można użyć do przywrócenia systemu do wcześniejszego stanu w przypadku problemów.', ARRAY['przywracanie', 'backup', 'system', 'punkt'], ARRAY['wmic.exe /Namespace:\\root\default Path SystemRestore Call CreateRestorePoint "Mój punkt przywracania", 100, 7']),

('Wyświetla historię poleceń', 'doskey /history', 'Wyświetla listę wszystkich poleceń wprowadzonych w bieżącej sesji wiersza poleceń.', ARRAY['historia', 'polecenia', 'doskey', 'cmd'], ARRAY['doskey /history', 'doskey /history > historia.txt']),

('Zmienia priorytety procesów', 'wmic process where name="notepad.exe" CALL setpriority 64', 'Zmienia priorytet określonego procesu w systemie. Można ustawić różne poziomy priorytetu od bardzo niskiego do bardzo wysokiego.', ARRAY['proces', 'priorytet', 'wydajność', 'wmic'], ARRAY['wmic process where name="notepad.exe" CALL setpriority 64', 'wmic process where processid=1234 CALL setpriority 32768']),

('Wyświetla informacje o procesorze', 'wmic cpu get name,numberofcores,numberoflogicalprocessors', 'Wyświetla szczegółowe informacje o procesorze, w tym nazwę, liczbę rdzeni fizycznych i logicznych.', ARRAY['procesor', 'cpu', 'rdzenie', 'informacje'], ARRAY['wmic cpu get name,numberofcores,numberoflogicalprocessors', 'wmic cpu list full']),

('Czyści bufor DNS', 'ipconfig /flushdns', 'Czyści lokalną pamięć podręczną DNS, co może pomóc w rozwiązaniu problemów z połączeniem internetowym.', ARRAY['dns', 'internet', 'sieć', 'bufor'], ARRAY['ipconfig /flushdns', 'ipconfig /displaydns']),

('Sprawdza integralność plików systemowych', 'sfc /verifyonly', 'Sprawdza integralność plików systemowych bez ich automatycznej naprawy. Wyświetla raport o znalezionych problemach.', ARRAY['sfc', 'pliki', 'system', 'integralność'], ARRAY['sfc /verifyonly', 'sfc /scannow']),

('Defragmentuje dysk', 'defrag C: /A', 'Analizuje stopień fragmentacji dysku i wyświetla raport bez wykonywania defragmentacji.', ARRAY['defragmentacja', 'dysk', 'optymalizacja', 'wydajność'], ARRAY['defrag C: /A', 'defrag C: /O']),

('Wyświetla szczegóły o zainstalowanych programach', 'wmic product get name,version', 'Wyświetla listę wszystkich programów zainstalowanych w systemie wraz z ich wersjami.', ARRAY['programy', 'aplikacje', 'lista', 'wersje'], ARRAY['wmic product get name,version', 'wmic product where name="Microsoft Office" get version']),

('Sprawdza połączenia sieciowe', 'netstat -an', 'Wyświetla wszystkie aktywne połączenia sieciowe oraz porty nasłuchujące w systemie.', ARRAY['sieć', 'połączenia', 'porty', 'netstat'], ARRAY['netstat -an', 'netstat -b', 'netstat -r']),

('Wyświetla zmienne środowiskowe', 'set', 'Wyświetla wszystkie zmienne środowiskowe systemu i ich wartości.', ARRAY['zmienne', 'środowisko', 'konfiguracja', 'system'], ARRAY['set', 'set PATH', 'set > zmienne.txt']),

('Sprawdza błędy dysku', 'chkdsk C: /f /r', 'Sprawdza system plików i metadane systemu plików na dysku pod kątem błędów logicznych i fizycznych oraz naprawia je.', ARRAY['dysk', 'błędy', 'naprawa', 'chkdsk'], ARRAY['chkdsk C: /f /r', 'chkdsk D: /f']),

('Tworzy skrót pliku lub folderu', 'mklink /D "C:\Skrót do folderu" "C:\Oryginalny folder"', 'Tworzy symboliczne łącza (skróty) do plików lub folderów w systemie Windows.', ARRAY['skrót', 'link', 'folder', 'mklink'], ARRAY['mklink /D "C:\Skrót" "C:\Folder"', 'mklink "plik.txt" "C:\oryginalny_plik.txt"']);
