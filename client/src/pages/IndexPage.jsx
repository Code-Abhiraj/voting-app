import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cross2Icon } from "@radix-ui/react-icons"
import { useFetchResults } from "../hooks/useFetchResults";
import { useOfficersData } from "../hooks/useOfficersData";

export default function IndexPage() {
  const navigate = useNavigate();
  const [selectedConstituency, setSelectedConstituency] = useState("all");
  const [voterID, setVoterID] = useState("");
  const [officerID, setOfficerID] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const { data, loading, error, fetchData } = useFetchResults();
  const { fetchOfficerData, isOfficerLoading, officerError } = useOfficersData();

  const constituencies = {
    all: "all",
    constituency1: "West Karenfort Constituency",
    constituency2: "Hernandezchester Constituency",
    constituency3: "North Danielchester Constituency",
    constituency4: "Timothyburgh Constituency",
    constituency5: "Wandaland Constituency",
  };

  useEffect(() => {
    if (selectedConstituency === "all") {
      fetchData("http://localhost:8000/api/results/parties", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
    } else if (selectedConstituency) {
      fetchData("http://localhost:8000/api/results/candidates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: selectedConstituency }),
      });
    }
  }, [selectedConstituency]);

  const handlePhoneNumberSubmit = (event) => {
    event.preventDefault();
    if (phoneNumber.length === 10) {
      setIsOtpVisible(true); 
    } else {
      alert("Please enter a valid phone number.");
    }
    setPhoneNumber("");
  };

  const handleOtpSubmit = (event) => {
    event.preventDefault();
    if (otp.length === 6) {
      alert("OTP verified successfully!");
      setIsOtpVisible(false);
      setIsModalOpen(false);
    } else {
      alert("Please enter a valid OTP.");
    }
    setOtp("");
  };

  const handleVoterIDSubmit = (event) => {
    event.preventDefault();
    setVoterID("");
    setIsModalOpen(true);
  };

  const handleOfficerIDSubmit = async (event) => {
    event.preventDefault();
    const data = await fetchOfficerData(officerID);
    console.log(data);
    setOfficerID("");

    if (data && data.token) {
      localStorage.setItem("token", data.token);
      alert('Officer Verified');
      navigate(`/officer/${data.token}`);
    } else {
      alert(officerError);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setOtp("");
    setPhoneNumber("");
  };

  return (
    <>
    <div className="p-4">
      <label htmlFor="constituency" className="block text-sm font-medium text-white mb-2">
        Select Constituency:
      </label>
      <select
        id="constituency"
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        value={selectedConstituency}
        onChange={(e) => setSelectedConstituency(e.target.value)}
      >
        {Object.values(constituencies).map((constituencyName) => (
          <option key={constituencyName} value={constituencyName}>
            {constituencyName}
          </option>
        ))}
      </select>
      </div>

      <div className="grid grid-cols-2 h-20vh text-justify">
      <div className="grid grid-cols-4 gap-4 p-4">
        {loading && <p className="col-span-4 text-center">Loading...</p>}
        {error && <p className="col-span-4 text-center text-black-500">{error}</p>}
        {!loading && !error && data.length > 0 ? (
          data.map((item, index) => (
             <Card key={index} className="mb-4">
                <CardHeader>
                  <CardTitle>{item.name || item.voterDetails || "Party: " + item.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {item.voteCount}
                 </CardDescription>
               </CardContent>
              </Card>
           ))
          ) : (
           !loading &&
           !error && (
             <p className="col-span-4 text-center">No data available</p>
           )
         )}
      </div>


        <div className="flex justify-center items-center">
          <Tabs
            defaultValue="account"
            className="w-[400px] bg-slate shadow-md rounded-md border border-gray-200 p-4"
          >
            <TabsList className="flex gap-2 border-b border-gray-300 mb-4">
              <TabsTrigger
                value="account"
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-t-md focus:outline-none focus:ring-2 focus:ring-blue-500 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
              >
                Voter
              </TabsTrigger>
              <TabsTrigger
                value="password"
                className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-t-md focus:outline-none focus:ring-2 focus:ring-blue-500 data-[state=active]:text-blue-600 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
              >
                Officer
              </TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="text-gray-700">
              <label
                htmlFor="voterID"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Enter your Voter ID
              </label>
              <input
                id="voterID"
                type="text"
                placeholder="Enter Voter ID"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={voterID}
                onChange={(e) => setVoterID(e.target.value)}
              />
              <button
                onClick={handleVoterIDSubmit}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Submit Voter ID
              </button>
            </TabsContent>
            <TabsContent value="password" className="text-gray-700">
              <label
                htmlFor="officerID"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Enter your Officer ID
              </label>
              <input
                id="officerID"
                type="text"
                placeholder="Enter Officer ID"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={officerID}
                onChange={(e) => setOfficerID(e.target.value)}
              />
              {!isOfficerLoading ? (<button
                onClick={handleOfficerIDSubmit}
                disabled={isOfficerLoading}
                className={`mt-4 px-4 py-2 text-white rounded-md ${
                  isOfficerLoading ? "bg-gray-400" : "bg-blue-600"
                }`}
              >
                Submit Officer ID
              </button>) : <>Loading....</>}
              {officerError && <p className="mt-2 text-black-500">{officerError}</p>}       
            </TabsContent>
          </Tabs>
        </div>
      </div>


      {isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-md shadow-md">
      {/* OTP Input */}
      {isOtpVisible ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
            <div>Content</div>
            <button 
              onClick={closeModal}
             style={{
                backgroundColor: 'transparent', 
                border: 'none', 
                padding: '10px', 
               cursor: 'pointer', 
               color: 'black',
               fontSize: '20px'
             }}
           >
             <Cross2Icon />
           </button>
          </div>
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-600 mt-4"
          >
            Enter OTP
          </label>
          <input
            id="otp"
            type="text"
            placeholder="Enter OTP"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none mt-2"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            onClick={handleOtpSubmit}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md"
          >
            Submit OTP
          </button>
        </>
      ) : (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
            <div>Content</div>
            <button 
              onClick={closeModal}
             style={{
                backgroundColor: 'transparent', 
                border: 'none', 
                padding: '10px', 
               cursor: 'pointer', 
               color: 'black',
               fontSize: '20px'
             }}
           >
             <Cross2Icon />
           </button>
          </div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-600 mt-4"
          >
            Enter your Phone Number
          </label>
          <input
            id="phoneNumber"
            type="text"
            placeholder="Enter Phone Number"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none mt-2"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <button
            onClick={handlePhoneNumberSubmit}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Submit Phone Number
          </button>
        </>
      )}
    </div>
  </div>
)}
    </>
  );
}
