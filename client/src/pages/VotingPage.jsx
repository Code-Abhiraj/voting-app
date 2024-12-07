import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useFetchCandidates from "@/hooks/useFetchCandidates";
import useCastVote from "@/hooks/useCastVote";

export default function VotingPage() {
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  // Use custom hooks
  const { candidates, error, loading: loadingCandidates } = useFetchCandidates(id);
  const { castVote, errorMessage, loading: loadingVote } = useCastVote(id);

  const handleVoteClick = (candidate) => {
    setSelectedCandidate(candidate);
    setShowWarning(true);
  };

  const handleConfirmVote = async () => {
    const status = await castVote(selectedCandidate.candidateID);

    if (status) {
      setShowWarning(false);
      navigate("/");
    } else {
      alert(errorMessage || "Failed to cast your vote. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Voting Page</h1>

      {/* Loading indicator while fetching candidates */}
      {loadingCandidates ? (
        <div>Loading candidates...</div>
      ) : (
        <Table className="w-full">
          <TableCaption>List of candidates in your constituency</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Party</TableHead>
              <TableHead className="text-right">Votes</TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.map((candidate, index) => (
              <TableRow key={index}>
                <TableCell>{candidate.party_name}</TableCell>
                <TableCell className="text-right">{candidate.voteCount}</TableCell>
                <TableCell className="text-center">
                  <button
                    onClick={() => handleVoteClick(candidate)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Vote
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Error message for fetching candidates */}
      {error && <div className="text-red-500">{error}</div>}

      {/* Warning Dialog */}
      {showWarning && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-md shadow-md">
            <p className="text-gray text-lg mb-4">
              Are you sure you want to vote for <strong>{selectedCandidate?.name}</strong>?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowWarning(false)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmVote}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={loadingVote} // Disable the button while voting
              >
                {loadingVote ? "Casting Vote..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
