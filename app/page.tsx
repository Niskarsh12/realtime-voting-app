"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { PlusCircle, Trophy } from "lucide-react";
import AddCandidateDialog from "@/components/AddCandidateDialog";
import { useToast } from "@/components/ui/use-toast";

interface Candidate {
  id: string;
  name: string;
  photoUrl: string;
  votes: number;
}

export default function Home() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const totalVotes = candidates.reduce((sum, candidate) => sum + candidate.votes, 0);

  const handleAddCandidate = (name: string, photoUrl: string) => {
    const newCandidate: Candidate = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      photoUrl,
      votes: 0,
    };
    setCandidates([...candidates, newCandidate]);
    toast({
      title: "Candidate Added",
      description: `${name} has been added to the ballot.`,
    });
  };

  const handleVote = (candidateId: string) => {
    setCandidates(
      candidates.map((candidate) =>
        candidate.id === candidateId
          ? { ...candidate, votes: candidate.votes + 1 }
          : candidate
      )
    );
    toast({
      title: "Vote Recorded",
      description: "Your vote has been successfully counted.",
    });
  };

  const getVotePercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return (votes / totalVotes) * 100;
  };

  const sortedCandidates = [...candidates].sort((a, b) => b.votes - a.votes);
  const leader = sortedCandidates[0];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Live Voting Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Cast your vote and watch the results in real-time
          </p>
          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-primary hover:bg-primary/90"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Candidate
          </Button>
        </div>

        {leader && (
          <Card className="mb-8 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-yellow-200 dark:border-yellow-800 rounded-2xl shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center text-amber-800 dark:text-amber-200">
                <Trophy className="mr-2 h-6 w-6 text-yellow-500" />
                Current Leader
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20 ring-4 ring-yellow-200 dark:ring-yellow-500/20">
                  <AvatarImage src={leader.photoUrl} alt={leader.name} />
                  <AvatarFallback>{leader.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {leader.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {leader.votes} votes ({getVotePercentage(leader.votes).toFixed(1)}%)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sortedCandidates.map((candidate) => (
            <Card 
              key={candidate.id} 
              className="overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-lg hover:scale-[1.02] bg-white dark:bg-gray-800/50 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-24 w-24 ring-2 ring-primary/20">
                    <AvatarImage src={candidate.photoUrl} alt={candidate.name} />
                    <AvatarFallback>{candidate.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {candidate.name}
                    </h3>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {candidate.votes} votes
                      </span>
                      <span className="text-sm font-medium text-gray-400 dark:text-gray-500">
                        ({getVotePercentage(candidate.votes).toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={getVotePercentage(candidate.votes)}
                    className="h-2 w-full rounded-full"
                  />
                  <Button
                    onClick={() => handleVote(candidate.id)}
                    className="w-full"
                    variant="secondary"
                  >
                    Vote
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {candidates.length === 0 && (
          <Card className="mt-8 text-center p-12 rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                No candidates yet. Add some candidates to start the voting!
              </p>
            </CardContent>
          </Card>
        )}

        <AddCandidateDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onAdd={handleAddCandidate}
        />
      </div>
    </main>
  );
}