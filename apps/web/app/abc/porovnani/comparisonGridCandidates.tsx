import CandidateComment from "./candidateComment";
import CandidateAnswer from "./candidateAnswer";
import ComparisonGridCandidateCircleBadge from "./comparisonGridCandidateCircleBadge";
import React from "react";

type ComparisonGridCandidatesProps = {
  organizations: any[];
  candidates: any[];
  candidatesAnswers: {};
};

export default function ComparisonGridCandidates({
  organizations,
  candidates,
  candidatesAnswers,
}: ComparisonGridCandidatesProps) {
  function assignCandidateId(organizationId: any) {
    const assignedId = candidates.filter(
      (candidate) => candidate.reference.id === organizationId,
    );
    return assignedId[0]?.id;
  }
  return (
    <>
      {organizations.map((organization, index) => {
        const number = index + 1;
        const answerGridCol = number * 2;
        const commentGridCol = number * 2 + 1;
        const candidateId = assignCandidateId(organization.id);
        return (
          // possible to avoid React Fragment when structured differently?
          <React.Fragment key={organization.id}>
            <ComparisonGridCandidateCircleBadge
              key={`${organization.id}-badge`}
              shortName={organization.shortName}
              gridCol={number * 2}
            />
            <CandidateAnswer
              key={`${organization.id}-answer`}
              candidatesAnswers={candidatesAnswers}
              id={candidateId}
              gridCol={answerGridCol}
            />
            <CandidateComment
              key={`${organization.id}-comment`}
              candidatesAnswers={candidatesAnswers}
              id={candidateId}
              gridCol={commentGridCol}
            />
          </React.Fragment>
        );
      })}
    </>
  );
}
