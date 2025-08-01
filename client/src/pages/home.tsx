import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Terminal, Search, Copy, Clock, Tag, Star, ArrowRight, X, Folder, Network, Settings, CheckCircle, AlertCircle } from "lucide-react";
import type { Command } from "@shared/schema";

interface SearchResponse {
  commands: Command[];
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
        title: "Search Failed",
        description: error.message || "Failed to search commands. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Initial commands query (for when no search is performed)
  const { data: initialData, isLoading: initialLoading } = useQuery<SearchResponse>({
    queryKey: ["/api/commands"],
    enabled: !hasSearched && !searchMutation.data,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchMutation.mutate(searchQuery.trim());
    }
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
        title: "Copied!",
        description: "Command copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const data = searchMutation.data || initialData;
  const isLoading = searchMutation.isPending || initialLoading;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-primary rounded-lg p-2">
                <Terminal className="text-white w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-800">CMD Search Tool</h1>
                <p className="text-sm text-slate-500">Windows Command Database</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {healthData?.status === "connected" ? (
                  <>
                    <CheckCircle className="w-2 h-2 text-green-500" />
                    <span className="text-sm text-slate-600">Database Connected</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-2 h-2 text-red-500" />
                    <span className="text-sm text-slate-600">Database Disconnected</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Interface */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">Search Windows CMD Commands</h2>
              <p className="text-slate-600">Enter a description or keyword to find the appropriate Windows command line instruction.</p>
            </div>

            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Label htmlFor="search-query" className="block text-sm font-medium text-slate-700 mb-2">
                  Command Query
                </Label>
                <div className="relative">
                  <Input
                    id="search-query"
                    type="text"
                    placeholder="e.g., list all files in directory, copy files, network configuration..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-11"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  type="submit" 
                  disabled={!searchQuery.trim() || isLoading}
                  className="flex-1 sm:flex-none"
                >
                  <Search className="w-4 h-4 mr-2" />
                  {isLoading ? "Searching..." : "Search Commands"}
                </Button>
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={handleClear}
                  className="flex-1 sm:flex-none"
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Search Results */}
        {(data || isLoading) && (
          <div className="space-y-6">
            {/* Search Statistics */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-1">Search Results</h3>
                    {isLoading ? (
                      <Skeleton className="h-4 w-48" />
                    ) : (
                      <p className="text-slate-600">
                        Found {data?.count || 0} commands matching your query
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    {isLoading ? (
                      <Skeleton className="h-4 w-12" />
                    ) : (
                      <span>{data?.searchTime?.toFixed(2) || 0}s</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Command Results */}
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
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
              <Card>
                <CardContent className="p-6 text-center">
                  <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-800 mb-2">No Commands Found</h3>
                  <p className="text-slate-600">
                    Try different keywords or check your spelling. The database might not contain commands matching your search.
                  </p>
                </CardContent>
              </Card>
            ) : (
              data?.commands?.map((command) => (
                <Card key={command.id} className="hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-slate-800 mb-2">{command.command}</h4>
                        <p className="text-slate-600 mb-3">{command.description}</p>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => copyToClipboard(command.command)}
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    
                    <div className="bg-slate-900 rounded-lg p-4 mb-4">
                      <code className="text-green-400 font-mono text-sm break-all">
                        {command.syntax}
                      </code>
                    </div>

                    {command.examples && command.examples.length > 0 && (
                      <div className="space-y-3">
                        <div>
                          <h5 className="font-medium text-slate-800 mb-2">Common Examples:</h5>
                          <div className="space-y-2">
                            {command.examples.slice(0, 2).map((example, index) => (
                              <div key={index} className="bg-slate-50 rounded-lg p-3">
                                <code className="text-slate-800 font-mono text-sm block mb-1">
                                  {example.split('|')[0]?.trim()}
                                </code>
                                {example.split('|')[1] && (
                                  <p className="text-slate-600 text-sm">
                                    {example.split('|')[1]?.trim()}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                      <div className="flex items-center space-x-4 text-sm text-slate-500">
                        <span className="flex items-center space-x-1">
                          <Tag className="w-4 h-4" />
                          <span>{command.category}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Star className="w-4 h-4" />
                          <span>{command.difficulty}</span>
                        </span>
                      </div>
                      <Button variant="link" size="sm" className="text-primary">
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto p-3 justify-start hover:border-primary hover:bg-primary/5"
                onClick={() => {
                  setSearchQuery("file operations");
                  searchMutation.mutate("file operations");
                }}
              >
                <div className="bg-blue-100 text-blue-700 p-2 rounded-lg mr-3">
                  <Folder className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-800">File Operations</p>
                  <p className="text-sm text-slate-500">Browse file commands</p>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-3 justify-start hover:border-primary hover:bg-primary/5"
                onClick={() => {
                  setSearchQuery("network");
                  searchMutation.mutate("network");
                }}
              >
                <div className="bg-green-100 text-green-700 p-2 rounded-lg mr-3">
                  <Network className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-800">Network Commands</p>
                  <p className="text-sm text-slate-500">Network troubleshooting</p>
                </div>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-3 justify-start hover:border-primary hover:bg-primary/5"
                onClick={() => {
                  setSearchQuery("system");
                  searchMutation.mutate("system");
                }}
              >
                <div className="bg-purple-100 text-purple-700 p-2 rounded-lg mr-3">
                  <Settings className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-slate-800">System Tools</p>
                  <p className="text-sm text-slate-500">System management</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-primary rounded-lg p-2">
                <Terminal className="text-white w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">CMD Search Tool</p>
                <p className="text-sm text-slate-500">Windows Command Database</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-slate-500">
              <span>Database Status: {healthData?.status === "connected" ? "Connected" : "Disconnected"}</span>
              <span>•</span>
              <span>Commands indexed: {data?.count || 0}</span>
              <span>•</span>
              <span>Last Updated: Today</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
