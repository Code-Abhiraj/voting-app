import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";

const OfficersPage = () => {
  const [voterData, setVoterData] = useState({
    totalVoters: 0,
    votedVoters: 0,
    pendingVoters: 0,
    candidates: 0,
  });
  const [officerDetails, setOfficerDetails] = useState({});
  const [constituency, setConstituency] = useState({});

  const [loading, setLoading] = useState(true);
  const officerToken = localStorage.getItem('token');
  console.log('token:', officerToken);
  // Function to fetch data
  const fetchData = async (endpoint) => {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'token': officerToken 
      },
    });
    console.log(response);
    if (!response.ok) {
      throw new Error(`Error fetching data from ${endpoint}`);
    }
    return await response.json();
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Fetch all the data concurrently
        const allVotersResponse = await fetchData('http://localhost:8000/api/officer/all');
        const totalVoters = allVotersResponse.voters.length;

        const votedVotersResponse = await fetchData('http://localhost:8000/api/officer/voted');
        const votedVoters = votedVotersResponse.voters.length;

        const pendingVotersResponse = await fetchData('http://localhost:8000/api/officer/pending');
        const pendingVoters = pendingVotersResponse.voters.length;

        const candidatesResponse = await fetchData('http://localhost:8000/api/officer/candidates');
        const candidates = candidatesResponse.candidates.length;

        const officerResponse = await fetchData('http://localhost:8000/api/officer/details');

        setVoterData({
          totalVoters,
          votedVoters,
          pendingVoters,
          candidates
        });

        setOfficerDetails(officerResponse.details);
        setConstituency(officerResponse.constituency);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
    <div className="mb-6 p-4 border rounded-lg shadow">
        <h2 className="text-lg font-bold">Officer Details</h2>
        <p><strong>Officer ID:</strong> {officerDetails.officerID || 'N/A'}</p>
        <p><strong>Constituency:</strong> {constituency || 'N/A'}</p>
    </div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="card">
        <CardTitle>Total Voters</CardTitle>
        <br/>
        <CardContent>
          <CardDescription>{voterData.totalVoters}</CardDescription>
        </CardContent>
      </Card>
      
      <Card className="card">
        <CardTitle>Voted Voters</CardTitle>
        <br/>
        <CardContent>
          <CardDescription>{voterData.votedVoters}</CardDescription>
        </CardContent>
      </Card>
      
      <Card className="card">
        <CardTitle>Pending Voters</CardTitle>
        <br/>
        <CardContent>
          <CardDescription>{voterData.pendingVoters}</CardDescription>
        </CardContent>
      </Card>
      
      <Card className="card">
        <CardTitle>Candidates</CardTitle>
        <br/>
        <CardContent>
          <CardDescription>{voterData.candidates}</CardDescription>
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default OfficersPage;
