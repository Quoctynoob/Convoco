// src/components/debate/DebateArena.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Debate, DebateStatus } from '@/types/Debate';
import { Argument, AIAnalysis } from '@/types/Argument';
import { User } from '@/types/User';
import { ArgumentInput } from './ArgumentInput';
import { ArgumentDisplay } from './ArgumentDisplay';
import { AIAnalysisDisplay } from './AIAnalysis';
import { DebateResults } from './DebateResults';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { addArgument, getArgumentAnalysis, updateDebate } from '@/lib/firebase/firestore';
import { analyzeArgument } from '@/lib/gemini/api';

interface DebateArenaProps {
  debate: Debate;
  arguments: Argument[];
  creator: User;
  opponent: User | null;
  onJoinDebate: () => Promise<boolean>;
}

export const DebateArena: React.FC<DebateArenaProps> = ({
  debate,
  arguments: debateArguments,
  creator,
  opponent,
  onJoinDebate,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analyses, setAnalyses] = useState<AIAnalysis[]>([]);

  const isCreator = user?.id === debate.creatorId;
  const isOpponent = user?.id === debate.opponentId;
  const isParticipant = isCreator || isOpponent;
  const isMyTurn = user?.id === debate.currentTurn;
  
  useEffect(() => {
    // Load analyses for existing arguments
    const loadAnalyses = async () => {
      const analysisPromises = debateArguments.map(async (arg) => {
        try {
          const analysis = await getArgumentAnalysis(arg.id);
          return analysis;
        } catch (error) {
          console.error(`Error loading analysis for argument ${arg.id}:`, error);
          return null;
        }
      });
      
      const results = await Promise.all(analysisPromises);
      setAnalyses(results.filter((a): a is AIAnalysis => a !== null));
    };
    
    loadAnalyses();
  }, [debateArguments]);

  const handleJoin = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const success = await onJoinDebate();
      if (!success) {
        setError('Failed to join debate. Please try again.');
      }
    } catch (e) {
      setError('An unexpected error occurred.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitArgument = async (content: string) => {
    if (!user || !isMyTurn || !opponent) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Determine which side the user is on
      const side = isCreator ? 'creator' : 'opponent';
      
      // Create the new argument
      const newArgument: Omit<Argument, 'id' | 'createdAt'> = {
        debateId: debate.id,
        userId: user.id,
        content,
        round: debate.currentRound,
        side,
      };
      
      // Add argument to Firestore
      const argumentId = await addArgument(newArgument);
      const argument = { 
        id: argumentId, 
        ...newArgument, 
        createdAt: Date.now() 
      };
      
      // Get previous arguments for context
      const previousArgs = debateArguments.filter(
        arg => arg.round < debate.currentRound || 
        (arg.round === debate.currentRound && arg.userId !== user.id)
      );
      
      // Get AI analysis
      const analysis = await analyzeArgument(
        debate,
        argument,
        previousArgs,
        creator,
        opponent
      );
      
      // Determine next turn or complete debate
      let updates: Partial<Debate> = {};
      
      if (side === 'opponent' && debate.currentRound >= debate.rounds) {
        // Debate will be completed after determining winner
        updates = {
          status: DebateStatus.COMPLETED,
          currentTurn: undefined,
        };
      } else if (side === 'creator') {
        // Switch to opponent's turn
        updates = {
          currentTurn: debate.opponentId,
        };
      } else {
        // Switch back to creator's turn and increment round
        updates = {
          currentRound: debate.currentRound + 1,
          currentTurn: debate.creatorId,
        };
      }
      
      // Update debate status
      await updateDebate(debate.id, updates);
      
    } catch (e) {
      setError('Failed to submit argument. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderDebateStatus = () => {
    switch (debate.status) {
      case DebateStatus.PENDING:
        return (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <h3 className="text-lg font-medium text-yellow-800">Waiting for an opponent</h3>
            <p className="mt-2 text-sm text-yellow-700">
              This debate is waiting for someone to join. Share the link with others or wait for someone to discover it.
            </p>
            {!isCreator && user && (
              <Button
                onClick={handleJoin}
                disabled={loading}
                className="mt-4"
              >
                {loading ? 'Joining...' : 'Join This Debate'}
              </Button>
            )}
          </div>
        );
      
      case DebateStatus.ACTIVE:
        return (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
            <h3 className="text-lg font-medium text-green-800">
              Round {debate.currentRound} of {debate.rounds}
            </h3>
            <p className="mt-2 text-sm text-green-700">
              {isMyTurn 
                ? "It's your turn to present your argument." 
                : `Waiting for ${debate.currentTurn === creator.id ? creator.username : opponent?.username} to respond.`}
            </p>
          </div>
        );
      
      case DebateStatus.COMPLETED:
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <h3 className="text-lg font-medium text-blue-800">Debate Completed</h3>
            <p className="mt-2 text-sm text-blue-700">
              This debate has been completed and a winner has been determined.
            </p>
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderDebateContent = () => {
    if (debate.status === DebateStatus.COMPLETED && debate.winner) {
      return (
        <DebateResults
          debate={debate}
          arguments={debateArguments}
          analyses={analyses}
          creator={creator}
          opponent={opponent!}
          winnerId={debate.winner}
        />
      );
    }
    
    return (
      <div className="space-y-8">
        {debateArguments.map((argument) => {
          const analysis = analyses.find(a => a.argumentId === argument.id);
          const isCreatorArgument = argument.userId === creator.id;
          const user = isCreatorArgument ? creator : opponent;
          
          return (
            <div key={argument.id} className="space-y-4">
              <ArgumentDisplay
                argument={argument}
                user={user!}
                isCreator={isCreatorArgument}
              />
              {analysis && (
                <AIAnalysisDisplay 
                  analysis={analysis}
                  showCounterpoints={isParticipant && debate.currentTurn === user?.id}
                />
              )}
            </div>
          );
        })}
        
        {debate.status === DebateStatus.ACTIVE && isMyTurn && (
          <ArgumentInput 
            onSubmit={handleSubmitArgument}
            loading={loading}
            round={debate.currentRound}
            maxLength={5000}
          />
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderDebateStatus()}
      {renderDebateContent()}
    </div>
  );
};