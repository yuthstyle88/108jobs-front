"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";
import { LanguageFile } from "@/constants/language";
import Loading from "@/components/Loading";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { usePublicFetch } from "@/hooks/api-hooks";
import { API_ROUTES } from "@/api/endpoints";
import { ServiceCatalogData } from "@/types/catalog";
import { useSession } from "next-auth/react";

const CreateJobPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const {
    data: jobBoardLanguageData,
    isLoading: isLanguageLoading,
    error: languageError,
  } = useGlobalTranslate(LanguageFile.JOB_BOARD);

  const {
    data: catalogData,
    isLoading: isCatalogLoading,
    error: catalogError,
  } = usePublicFetch<ServiceCatalogData>(API_ROUTES.catalog.get_all_catalog);
  
  const [formData, setFormData] = useState({
    service_catalog_id: "",
    job_title: "",
    description: "",
    is_english_required: false,
    example_url: "",
    budget: "",
    deadline: "",
    is_anonymous_post: false,
    working_from: "Freelance",
    intended_use: "Personal"
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  const handleRadioChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Job title validation
    if (!formData.job_title.trim()) {
      newErrors.job_title = "Job title is required";
    } else if (formData.job_title.trim().length < 5) {
      newErrors.job_title = "Job title must be at least 5 characters";
    }
    
    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Job description is required";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Job description must be at least 20 characters";
    }
    
    // Service category validation
    if (!formData.service_catalog_id) {
      newErrors.service_catalog_id = "Service catalog is required";
    }
    
    // Budget validation
    if (!formData.budget) {
      newErrors.budget = "Budget is required";
    } else if (parseFloat(formData.budget) <= 0) {
      newErrors.budget = "Budget must be greater than 0";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log(process.env.NEXT_PUBLIC_API_BASE_URL);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/job-post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`
        },
        body: JSON.stringify({
          service_catalog_id: formData.service_catalog_id,
          job_title: formData.job_title,
          description: formData.description,
          is_english_required: formData.is_english_required,
          example_url: formData.example_url || undefined,
          budget: parseFloat(formData.budget),
          deadline: formData.deadline || undefined,
          is_anonymous_post: formData.is_anonymous_post,
          working_from: formData.working_from,
          intended_use: formData.intended_use
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to create job post');
      }
      
      // Redirect to job board on success
      router.push("/job-board");
    } catch (error) {
      console.error("Error submitting job post:", error);
      // Here you would typically show an error message to the user
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLanguageLoading || isCatalogLoading) return <Loading />;
  if (languageError || catalogError) return <div>Error loading data</div>;

  return (
    <div className="bg-[#F6F9FE] min-h-screen py-8">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Post New Job</h1>
          
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
            <FontAwesomeIcon icon={faInfoCircle} className="text-blue-600 mt-1 mr-3" />
            <p className="text-blue-800">
              For <span className="font-medium">"Job Posting"</span> only. Self-promotion, contact information, or uses violating system terms are not allowed. Posts violating these terms will be removed immediately
            </p>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Job Title */}
            <div className="mb-6">
              <label htmlFor="job_title" className="block text-gray-700 font-medium mb-2">
                Job Title
              </label>
              <input
                type="text"
                id="job_title"
                name="job_title"
                value={formData.job_title}
                onChange={handleInputChange}
                placeholder="I am looking for"
                className={`w-full p-3 border ${errors.job_title ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                required
              />
              {errors.job_title && (
                <p className="mt-1 text-red-500 text-sm flex items-center">
                  <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                  {errors.job_title}
                </p>
              )}
            </div>
            
            {/* Working From Type */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Employment Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                  <input
                    type="radio"
                    id="freelance"
                    name="working_from"
                    value="Freelance"
                    checked={formData.working_from === "Freelance"}
                    onChange={() => handleRadioChange("working_from", "Freelance")}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor="freelance" className="ml-2 text-gray-700">
                    Freelance (project-based)
                  </label>
                </div>
                
                <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                  <input
                    type="radio"
                    id="contract"
                    name="working_from"
                    value="Contract"
                    checked={formData.working_from === "Contract"}
                    onChange={() => handleRadioChange("working_from", "Contract")}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor="contract" className="ml-2 text-gray-700">
                    Contract (monthly/yearly)
                  </label>
                </div>
                
                <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                  <input
                    type="radio"
                    id="parttime"
                    name="working_from"
                    value="Parttime"
                    checked={formData.working_from === "Parttime"}
                    onChange={() => handleRadioChange("working_from", "Parttime")}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor="parttime" className="ml-2 text-gray-700">
                    Part-time (hourly/daily)
                  </label>
                </div>
                
                <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                  <input
                    type="radio"
                    id="fulltime"
                    name="working_from"
                    value="Fulltime"
                    checked={formData.working_from === "Fulltime"}
                    onChange={() => handleRadioChange("working_from", "Fulltime")}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor="fulltime" className="ml-2 text-gray-700">
                    Full-time
                  </label>
                </div>
              </div>
            </div>
            
            {/* Job Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                Job Description
              </label>
              <p className="text-gray-500 text-sm mb-2">
                When someone is interested, you'll receive notifications through system contacts
              </p>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your job requirements, such as:
1. Job Info: Purpose, target audience, action plan, etc.
2. Details: Number of deliverables, scope, requirements, etc.

(Contact information such as email, phone, LINE, or other contact details are not allowed)"
                className={`w-full p-3 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px]`}
                required
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-red-500 text-sm flex items-center">
                  <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                  {errors.description}
                </p>
              )}
            </div>
            
            {/* English Required Checkbox */}
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_english_required"
                  name="is_english_required"
                  checked={formData.is_english_required}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 text-blue-600"
                />
                <label htmlFor="is_english_required" className="ml-2 text-gray-700">
                  An English-speaking seller is required.
                </label>
              </div>
            </div>
            
            {/* Example URL and Service Catalog */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="example_url" className="block text-gray-700 font-medium mb-2">
                  Example URL (Optional)
                </label>
                <input
                  type="url"
                  id="example_url"
                  name="example_url"
                  value={formData.example_url}
                  onChange={handleInputChange}
                  placeholder="e.g., https://example.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {/* Service Catalog */}
              <div>
                <label htmlFor="service_catalog_id" className="block text-gray-700 font-medium mb-2">
                  Service Catalog
                </label>
                <select
                  id="service_catalog_id"
                  name="service_catalog_id"
                  value={formData.service_catalog_id}
                  onChange={handleInputChange}
                  className={`w-full p-3 border ${errors.service_catalog_id ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                >
                  <option value="">Select a service category</option>
                  {catalogData?.service_catalogs?.map((catalog) => (
                    <option key={catalog.id} value={catalog.id}>
                      {catalog.name}
                    </option>
                  ))}
                </select>
                {errors.service_catalog_id && (
                  <p className="mt-1 text-red-500 text-sm flex items-center">
                    <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                    {errors.service_catalog_id}
                  </p>
                )}
              </div>
            </div>
            
            {/* Budget and Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="budget" className="block text-gray-700 font-medium mb-2">
                  Budget
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className={`w-full p-3 border ${errors.budget ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    THB
                  </div>
                </div>
                {errors.budget && (
                  <p className="mt-1 text-red-500 text-sm flex items-center">
                    <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" />
                    {errors.budget}
                  </p>
                )}
              </div>
              
              <div>
                <label htmlFor="deadline" className="block text-gray-700 font-medium mb-2">
                  Deadline (Optional)
                </label>
                <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {/* Intended Use */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Intended Use
              </label>
              <p className="text-gray-500 text-sm mb-2">
                To help freelancers propose suitable work
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                <div 
                  className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer ${formData.intended_use === 'Business' ? 'bg-blue-100 border border-blue-300' : 'bg-white border border-gray-200'}`}
                  onClick={() => handleRadioChange("intended_use", "Business")}
                >
                  <div className="text-blue-600 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Business Use</span>
                </div>
                
                <div 
                  className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer ${formData.intended_use === 'Personal' ? 'bg-blue-100 border border-blue-300' : 'bg-white border border-gray-200'}`}
                  onClick={() => handleRadioChange("intended_use", "Personal")}
                >
                  <div className="text-blue-600 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Personal Use</span>
                </div>
                
                <div 
                  className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer ${formData.intended_use === 'Unknown' ? 'bg-blue-100 border border-blue-300' : 'bg-white border border-gray-200'}`}
                  onClick={() => handleRadioChange("intended_use", "Unknown")}
                >
                  <div className="text-blue-600 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-700">Unknown</span>
                </div>
              </div>
            </div>
            
            {/* Anonymous Post Toggle */}
            <div className="mb-6 flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={formData.is_anonymous_post}
                  onChange={(e) => handleCheckboxChange({
                    target: {
                      name: 'is_anonymous_post',
                      checked: e.target.checked
                    }
                  } as React.ChangeEvent<HTMLInputElement>)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ms-3 text-gray-700">Anonymous post</span>
              </label>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 mt-10">
              <Link
                href="/job-board"
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                Back
              </Link>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateJobPage; 