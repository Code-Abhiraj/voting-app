import { useState, useEffect } from "react";

const useFetchCandidates = (voterId) => {
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      setLoading(true); 
      try {
        const response = await fetch("http://localhost:8000/api/voter/fetch", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ voterId }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch candidates.");
        }

        const data = await response.json();
        setCandidates(data.result || []);
      } catch (err) {
        setError(err.message || "An error occurred while fetching candidates.");
      } finally {
        setLoading(false); 
      }
    };

    if (voterId) {
      fetchCandidates();
    }
  }, [voterId]);

  return { candidates, error, loading };
};

export default useFetchCandidates;
