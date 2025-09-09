import { Card } from "@repo/design-system/server";
import { useState } from "react";

import type { CandidateViewModel } from "../../../view-models";
import { useCandidateAnswerComparison, useHasDirectAnswers } from "../../../view-models/candidate";

export type MatchCard = {
  candidate: CandidateViewModel;
  order?: number;
  match?: number;
};

export function MatchCard({ candidate, order, match }: MatchCard) {
  const [showAnswers, setShowAnswers] = useState(false);
  const hasDirectAnswers = useHasDirectAnswers(candidate.id);
  const answerComparisons = useCandidateAnswerComparison(candidate.id);

  return (
    <Card corner="topLeft">
      <div>
        <div>
          <div>{order !== undefined ? `${order}.` : "—"}</div>
        </div>
        <div>
          <div 
            onClick={() => hasDirectAnswers && setShowAnswers(!showAnswers)}
            style={{ 
              cursor: hasDirectAnswers ? 'pointer' : 'default',
              textDecoration: hasDirectAnswers ? 'underline' : 'none'
            }}
            title={hasDirectAnswers ? 'Click to see answer comparison' : ''}
          >
            {candidate.displayName}
          </div>
          {candidate.organization && <div>{candidate.organization}</div>}
        </div>
        <span>{match !== undefined ? `${match} %` : "—"}</span>
      </div>
      
      {/* Debug: Always show the comparison for now */}
      <div style={{ 
        marginTop: '1rem', 
        padding: '1rem', 
        backgroundColor: '#f0f0f0',
        borderRadius: '4px',
        border: '1px solid #ccc'
      }}>
        <h4 style={{ margin: '0 0 1rem 0' }}>Debug: Answer Comparison</h4>
        <div><strong>Has Direct Answers:</strong> {hasDirectAnswers ? 'Yes' : 'No'}</div>
        <div><strong>Candidate ID:</strong> {candidate.id}</div>
        <div><strong>Number of comparisons:</strong> {answerComparisons.length}</div>
        
        {answerComparisons.length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <h5>Comparisons:</h5>
            {answerComparisons.map((comparison, index) => (
              <div key={comparison.questionId} style={{ 
                padding: '0.5rem',
                backgroundColor: 'white',
                borderRadius: '4px',
                border: '1px solid #ddd',
                marginBottom: '0.5rem'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  Question {index + 1}
                  {comparison.isImportant && (
                    <span style={{ 
                      marginLeft: '0.5rem', 
                      fontSize: '0.8em', 
                      color: '#666',
                      fontStyle: 'italic'
                    }}>
                      (Important)
                    </span>
                  )}
                </div>
                <div style={{ marginBottom: '0.5rem', fontStyle: 'italic' }}>
                  {comparison.questionText}
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div>
                    <strong>You:</strong> {formatAnswer(comparison.userAnswer)}
                  </div>
                  <div>
                    <strong>Candidate:</strong> {formatAnswer(comparison.candidateAnswer)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

function formatAnswer(answer: boolean | null | undefined): string {
  if (answer === true) return "true";
  if (answer === false) return "false";
  if (answer === null) return "null";
  return "undefined";
}
