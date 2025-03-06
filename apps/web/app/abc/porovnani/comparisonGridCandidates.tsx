import CandidateComment from "./candidateComment";
import CandidateAnswer from "./candidateAnswer";

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
  // assign correct id to the candidate
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
        const answerGridNumber = number * 2;
        const commentGridNumber = number * 2 + 1;
        return (
          <>
            <div
              key={organization.shortName}
              className="sticky z-10"
              style={{ gridArea: `1 / ${(index + 1) * 2}` }}
            >
              <div className="flex size-20 items-center justify-center rounded-full bg-black p-2 text-white">
                <p className="text-center text-xs">
                  <strong>{organization.shortName}</strong>
                </p>
              </div>
            </div>
            <CandidateAnswer
              candidatesAnswers={candidatesAnswers}
              id={assignCandidateId(organization.id)}
              gridPosition={answerGridNumber}
            />
            {/* candidate comment cards */}
            <CandidateComment
              candidatesAnswers={candidatesAnswers}
              id={assignCandidateId(organization.id)}
              gridPosition={commentGridNumber}
            />
          </>
        );
      })}
    </>
  );
}
