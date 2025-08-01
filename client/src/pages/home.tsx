import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Terminal, Search, Copy, Clock, Tag, Star, ArrowRight, X, Folder, Network, Settings, CheckCircle, AlertCircle, FileText, Plus, Download, Trash2 } from "lucide-react";
import type { Command } from "@shared/schema";

interface SearchResponse {
  commands: {
    id: number;
    command: string;
    description: string;
    syntax: string;
    category: string;
    difficulty: string;
    examples: string[] | null;
    detailed_description: string;
  }[];
  count: number;
  searchTime: number;
}

interface HealthResponse {
  status: string;
  database: string;
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [selectedCommands, setSelectedCommands] = useState<Command[]>([]);
  const [showGenerator, setShowGenerator] = useState(false);
  const [scriptName, setScriptName] = useState("moj_skrypt");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Health check query
  const { data: healthData } = useQuery<HealthResponse>({
    queryKey: ["/api/health"],
    refetchInterval: 30000, // Check every 30 seconds
  });

  // Search mutation
  const searchMutation = useMutation({
    mutationFn: async (query: string) => {
      const response = await apiRequest("POST", "/api/commands/search", { query });
      return response.json() as Promise<SearchResponse>;
    },
    onSuccess: () => {
      setHasSearched(true);
    },
    onError: (error: any) => {
      toast({
        title: "Błąd wyszukiwania",
        description: error.message || "Nie udało się przeszukać poleceń. Spróbuj ponownie.",
        variant: "destructive",
      });
    },
  });

  // Initial commands query (for when no search is performed)
  const { data: initialData, isLoading: initialLoading } = useQuery<SearchResponse>({
    queryKey: ["/api/commands"],
    enabled: !hasSearched && !searchMutation.data,
  });

  // Get suggestions for autocomplete
  const getSuggestions = useCallback(async (query: string) => {
    if (query.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await apiRequest("POST", "/api/commands/search", { query });
      const data = await response.json() as SearchResponse;
      const commandSuggestions = data.commands.slice(0, 8).map(cmd => cmd.command);
      setSuggestions(commandSuggestions);
      setShowSuggestions(commandSuggestions.length > 0);
    } catch (error) {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  // Debounce suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        getSuggestions(searchQuery.trim());
      } else {
        setShowSuggestions(false);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, getSuggestions]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchMutation.mutate(searchQuery.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
    setSuggestions([]);
    searchMutation.mutate(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        if (activeSuggestionIndex >= 0) {
          e.preventDefault();
          handleSuggestionClick(suggestions[activeSuggestionIndex]);
        } else if (showSuggestions) {
          setShowSuggestions(false);
          setActiveSuggestionIndex(-1);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
        break;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setActiveSuggestionIndex(-1);
  };

  const handleClear = () => {
    setSearchQuery("");
    setHasSearched(false);
    searchMutation.reset();
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Skopiowano!",
        description: "Polecenie zostało skopiowane do schowka",
      });
    } catch (error) {
      toast({
        title: "Błąd kopiowania",
        description: "Nie udało się skopiować do schowka",
        variant: "destructive",
      });
    }
  };

  const addToScript = (command: Command) => {
    if (!selectedCommands.find(cmd => cmd.id === command.id)) {
      setSelectedCommands([...selectedCommands, command]);
      toast({
        title: "Dodano do skryptu!",
        description: `Polecenie "${command.command}" zostało dodane do generatora skryptów`,
      });
    }
  };

  const removeFromScript = (commandId: number) => {
    setSelectedCommands(selectedCommands.filter(cmd => cmd.id !== commandId));
  };

  const generateBatchScript = () => {
    if (selectedCommands.length === 0) {
      toast({
        title: "Brak poleceń",
        description: "Dodaj przynajmniej jedno polecenie do skryptu",
        variant: "destructive",
      });
      return;
    }

    const scriptContent = `@echo off
REM Skrypt wygenerowany przez Wyszukiwarkę poleceń CMD
REM Data utworzenia: ${new Date().toLocaleString('pl-PL')}
REM Liczba poleceń: ${selectedCommands.length}

echo Uruchamianie skryptu: ${scriptName}.bat
echo.

${selectedCommands.map((cmd, index) => `
REM ${index + 1}. ${cmd.description}
echo Wykonuje: ${cmd.command}
${cmd.command}
echo.`).join('')}

echo Skrypt zakończony pomyślnie!
pause
`;

    // Create and download the file
    const blob = new Blob([scriptContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${scriptName}.bat`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Skrypt wygenerowany!",
      description: `Plik ${scriptName}.bat został pobrany`,
    });
  };

  const copyScriptToClipboard = () => {
    if (selectedCommands.length === 0) return;

    const scriptContent = `@echo off
REM Skrypt wygenerowany przez Wyszukiwarkę poleceń CMD
REM Data utworzenia: ${new Date().toLocaleString('pl-PL')}
REM Liczba poleceń: ${selectedCommands.length}

echo Uruchamianie skryptu: ${scriptName}.bat
echo.

${selectedCommands.map((cmd, index) => `
REM ${index + 1}. ${cmd.description}
echo Wykonuje: ${cmd.command}
${cmd.command}
echo.`).join('')}

echo Skrypt zakończony pomyślnie!
pause
`;

    copyToClipboard(scriptContent);
  };

  const data = searchMutation.data || initialData;
  const isLoading = searchMutation.isPending || initialLoading;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-primary rounded-lg p-2">
                <Terminal className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Wyszukiwarka poleceń CMD</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Baza poleceń Windows</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {healthData?.status === "connected" ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Baza połączona ({data?.count || 0} rekordów)
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-slate-600 dark:text-slate-300">Baza rozłączona</span>
                  </>
                )}
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Interface */}
        <Card className="mb-8 border-slate-200 dark:border-slate-700">
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Wyszukaj polecenia Windows CMD</h2>
              <p className="text-slate-600 dark:text-slate-400">Wprowadź opis lub słowo kluczowe, aby znaleźć odpowiednie polecenie wiersza poleceń Windows.</p>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Label htmlFor="search-query" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Zapytanie o polecenie
                </Label>
                <div className="relative">
                  <Input
                    id="search-query"
                    type="text"
                    placeholder="np. wylistuj wszystkie pliki w katalogu, kopiuj pliki, konfiguracja sieci..."
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => {
                      setShowSuggestions(false);
                      setActiveSuggestionIndex(-1);
                    }, 200)}
                    className="pl-11 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    autoComplete="off"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  type="submit" 
                  disabled={!searchQuery.trim() || isLoading}
                  className="flex-1 sm:flex-none"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {isLoading ? "Wyszukiwanie..." : "Szukaj poleceń"}
                </Button>
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={handleClear}
                  className="flex-1 sm:flex-none"
                >
                  <X className="w-4 h-4 mr-2" />
                  Wyczyść
                </Button>
              </div>
            </form>

            {/* Suggestions dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="relative mt-2">
                <div className="absolute z-50 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  <div className="px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-600">
                    Podpowiedzi poleceń:
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className={`px-4 py-3 cursor-pointer flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-slate-100 dark:border-slate-600 last:border-b-0 ${
                        index === activeSuggestionIndex 
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                          : ''
                      }`}
                    >
                      <Terminal className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                      <span className="font-mono text-sm text-slate-900 dark:text-slate-100 flex-grow">
                        {suggestion}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    </div>
                  ))}
                  <div className="px-3 py-2 text-xs text-slate-400 dark:text-slate-500 border-t bg-slate-50 dark:bg-slate-700">
                    Użyj strzałek ↑↓ do nawigacji, Enter do wyboru
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mb-8 border-slate-200 dark:border-slate-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Szybkie akcje</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <Button
                variant="outline"
                className="h-auto p-3 justify-start hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 border-slate-200 dark:border-slate-700"
                onClick={() => {
                  setSearchQuery("katalog");
                  searchMutation.mutate("katalog");
                }}
              >
                <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 p-2 rounded-lg mr-3">
                  <Folder className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-800 dark:text-slate-100">Katalogi</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Operacje na katalogach</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-3 justify-start hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 border-slate-200 dark:border-slate-700"
                onClick={() => {
                  setSearchQuery("plik");
                  searchMutation.mutate("plik");
                }}
              >
                <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 p-2 rounded-lg mr-3">
                  <Copy className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-800 dark:text-slate-100">Pliki</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Operacje na plikach</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-3 justify-start hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 border-slate-200 dark:border-slate-700"
                onClick={() => {
                  setSearchQuery("system");
                  searchMutation.mutate("system");
                }}
              >
                <div className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 p-2 rounded-lg mr-3">
                  <Settings className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-800 dark:text-slate-100">System</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Zarządzanie systemem</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-3 justify-start hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 border-slate-200 dark:border-slate-700"
                onClick={() => {
                  setSearchQuery("wyświetl");
                  searchMutation.mutate("wyświetl");
                }}
              >
                <div className="bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 p-2 rounded-lg mr-3">
                  <Terminal className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-800 dark:text-slate-100">Wyświetlanie</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Polecenia wyświetlające</p>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-3 justify-start hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border-slate-200 dark:border-slate-700"
                onClick={() => setShowGenerator(!showGenerator)}
              >
                <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-2 rounded-lg mr-3">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-800 dark:text-slate-100">Generator .bat</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Twórz skrypty batch</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Batch Script Generator */}
        {showGenerator && (
          <Card className="mb-8 border-slate-200 dark:border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Generator skryptów .bat</h3>
                  <p className="text-slate-600 dark:text-slate-400">Wybierz polecenia z wyników wyszukiwania, aby utworzyć skrypt batch</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowGenerator(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <Label htmlFor="script-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Nazwa skryptu
                    </Label>
                    <Input
                      id="script-name"
                      type="text"
                      value={scriptName}
                      onChange={(e) => setScriptName(e.target.value)}
                      placeholder="np. backup_system"
                      className="border-slate-200 dark:border-slate-700"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={generateBatchScript}
                      disabled={selectedCommands.length === 0}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Pobierz .bat
                    </Button>
                    <Button
                      variant="outline"
                      onClick={copyScriptToClipboard}
                      disabled={selectedCommands.length === 0}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Kopiuj kod
                    </Button>
                  </div>
                </div>

                {selectedCommands.length > 0 ? (
                  <div>
                    <h4 className="font-medium text-slate-800 dark:text-slate-100 mb-3">
                      Wybrane polecenia ({selectedCommands.length}):
                    </h4>
                    <div className="space-y-2">
                      {selectedCommands.map((command, index) => (
                        <div key={command.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <span className="text-sm font-medium text-slate-500 dark:text-slate-400 w-6">
                            {index + 1}.
                          </span>
                          <code className="font-mono text-sm bg-slate-900 dark:bg-slate-950 text-green-400 px-2 py-1 rounded">
                            {command.command}
                          </code>
                          <span className="text-sm text-slate-600 dark:text-slate-300 flex-1">
                            {command.description}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromScript(command.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Żadne polecenia nie zostały jeszcze dodane do skryptu</p>
                    <p className="text-sm">Użyj przycisków "Dodaj do skryptu" przy poleceniach poniżej</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Results */}
            {(data || isLoading) && (
              <div className="space-y-6">
                {/* Search Statistics */}
                <Card className="border-slate-200 dark:border-slate-700 animate-fade-in-up">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1">Wyniki wyszukiwania</h3>
                        {isLoading ? (
                          <Skeleton className="h-4 w-48 animate-shimmer" />
                        ) : (
                          <p className="text-slate-600 dark:text-slate-400 animate-slide-in-left">
                            Znaleziono {data?.count || 0} poleceń pasujących do zapytania
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                        <Clock className="w-4 h-4" />
                        {isLoading ? (
                          <Skeleton className="h-4 w-12 animate-shimmer" />
                        ) : (
                          <span className="animate-scale-in">{data?.searchTime?.toFixed(2) || 0}s</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

            {/* Command Results */}
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="border-slate-200 dark:border-slate-700">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <Skeleton className="h-6 w-24 mb-2" />
                          <Skeleton className="h-4 w-full mb-3" />
                        </div>
                        <Skeleton className="h-8 w-16" />
                      </div>
                      <Skeleton className="h-20 w-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : data?.commands?.length === 0 ? (
              <Card className="border-slate-200 dark:border-slate-700">
                <CardContent className="p-6 text-center">
                  <Search className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Nie znaleziono poleceń</h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Spróbuj użyć innych słów kluczowych lub sprawdź pisownię. Baza danych może nie zawierać poleceń pasujących do Twojego wyszukiwania.
                  </p>
                </CardContent>
              </Card>
            ) : (
              data?.commands?.map((command) => (
                <Card key={command.id} className="hover:shadow-md transition-shadow duration-200 border-slate-200 dark:border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-xl font-bold text-blue-600 dark:text-blue-400 font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-md">
                            {command.command}
                          </h4>
                          <Badge variant="secondary" className="text-xs">
                            {command.category}
                          </Badge>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 mb-3 text-base leading-relaxed">
                          {command.description}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(command.command)}
                          className="border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Kopiuj
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addToScript(command)}
                          disabled={selectedCommands.some(cmd => cmd.id === command.id)}
                          className="border-red-200 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          {selectedCommands.some(cmd => cmd.id === command.id) ? "Dodane" : "Do skryptu"}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {command.detailed_description && (
                        <div>
                          <h5 className="font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-blue-600" />
                            Szczegółowy opis:
                          </h5>
                          <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-lg p-4 border-l-4 border-blue-500">
                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                              {command.detailed_description}
                            </p>
                          </div>
                        </div>
                      )}

                      {command.examples && command.examples.length > 0 && (
                        <div>
                          <h5 className="font-semibold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
                            <Copy className="w-4 h-4 text-green-600" />
                            Przykłady użycia:
                          </h5>
                          <div className="space-y-2">
                            {command.examples.slice(0, 4).map((example: string, index: number) => (
                              <div key={index} className="bg-slate-900 dark:bg-slate-950 rounded-lg p-3 border">
                                <div className="flex items-center justify-between">
                                  <code className="text-green-400 font-mono text-sm flex-1">
                                    {example.split(' - ')[0]}
                                  </code>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => copyToClipboard(example.split(' - ')[0])}
                                    className="ml-2 h-6 w-6 p-0 hover:bg-slate-700"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                </div>
                                {example.split(' - ')[1] && (
                                  <p className="text-slate-400 text-xs mt-1">
                                    {example.split(' - ')[1]}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center space-x-1">
                          <Tag className="w-4 h-4" />
                          <span>ID: {command.id}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span>{command.difficulty}</span>
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(command.examples?.[0] || command.description)}
                          className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                          <Copy className="w-4 h-4 mr-1" />
                          Kopiuj opis
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-primary rounded-lg p-2">
                <Terminal className="text-white w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100">Wyszukiwarka poleceń CMD</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Baza poleceń Windows</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-6">
                <span>Status bazy: {healthData?.status === "connected" ? "Neon Database ✓" : "Rozłączona"}</span>
                <span>•</span>
                <span>Dostępnych poleceń: {data?.count || 0}</span>
                <span>•</span>
                <span>Tabela: polecenia_cmd</span>
              </div>
              <div className="flex items-center space-x-2">
                <span>•</span>
                <span>Autor: <span className="font-medium text-slate-600 dark:text-slate-300">netdark_1966</span></span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}