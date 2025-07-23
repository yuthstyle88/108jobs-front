"use client";
import { useState } from 'react';
import { HttpService, RequestState } from '@/services/HttpService';
import { useAsyncLoading } from '@/hooks/useLoading';
import Loading from '@/components/Loading';
import LoadingCircle from '@/components/LoadingCircle';

/**
 * A demo component to showcase loading functionality
 */
export default function LoadingDemo() {
  // Example 1: Using useAsyncLoading hook with an API call
  const { 
    isLoading: isLoadingProfile, 
    data: profileData, 
    error: profileError,
    execute: refreshProfile
  } = useAsyncLoading(
    async () => await HttpService.client.getProfile(),
    [] // Empty dependency array means this runs once on mount
  );

  // Example 2: Manual loading state for a button action
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [buttonResult, setButtonResult] = useState<RequestState<any> | null>(null);

  const handleButtonClick = async () => {
    setIsButtonLoading(true);
    try {
      // Simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      const result = await HttpService.client.getSite();
      setButtonResult(result);
    } finally {
      setIsButtonLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Loading Demo</h1>
      
      {/* Example 1: Component-level loading */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Example 1: Component Loading</h2>
        
        {isLoadingProfile ? (
          <div className="flex justify-center items-center h-40">
            <LoadingCircle />
          </div>
        ) : profileError ? (
          <div className="text-red-500">
            Error loading profile: {profileError.message}
          </div>
        ) : (
          <div>
            <h3 className="font-medium">Profile Data:</h3>
            <pre className="bg-gray-100 p-3 rounded mt-2 overflow-auto max-h-40">
              {JSON.stringify(profileData, null, 2)}
            </pre>
          </div>
        )}
        
        <button 
          onClick={refreshProfile}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh Profile
        </button>
      </div>
      
      {/* Example 2: Button loading */}
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Example 2: Button Loading</h2>
        
        <button 
          onClick={handleButtonClick}
          disabled={isButtonLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isButtonLoading ? <LoadingCircle /> : "Load Site Data"}
        </button>
        
        {buttonResult && (
          <div className="mt-4">
            <h3 className="font-medium">Result:</h3>
            <pre className="bg-gray-100 p-3 rounded mt-2 overflow-auto max-h-40">
              {JSON.stringify(buttonResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}