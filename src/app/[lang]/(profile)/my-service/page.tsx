"use client";
import {API_ROUTES_SELLER} from "@/api/endpoints";
import LoadingMultiCircle from "@/components/LoadingMultiCircle";
import {SellerImage} from "@/constants/images";
import {LanguageFile} from "@/constants/language";
import {useDynamicPrivatePut, usePrivateDelete, usePrivateFetch,} from "@/hooks/api-hooks";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import useNotification from "@/hooks/useNotification";
import {JobListResponse} from "@/types/job";
import {getNamespace} from "@/utils/i18nHelper";
import {interpolateDouble} from "@/utils/interpolate";
import {ClockAlert, Eye, EyeOff, Info, Pencil, Plus, Trash2,} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {useState} from "react";
import ConfirmDeleteModal from "./_components/ConfirmDeleteModal";
import JobCreatedStatus from "./_components/JobCreatedStatus";

const MyServices = () => {
  const {successMessage} = useNotification();

  const {profileState, person} = useMyUser();

  const notVerified = person?.isVerified === "Pending";

  const {
    data: jobsData,
    isLoading,
    mutate,
  } = usePrivateFetch<JobListResponse>(API_ROUTES_SELLER.job.getJob);

  const sellerMyServiceLanguage = getNamespace(LanguageFile.SELLER_MY_SERVICE);

  const global = getNamespace(LanguageFile.GLOBAL);

  const lengthOfJobs = jobsData?.jobs.length || 0;

  const [selectedJob, setSelectedJob] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [mutatingJobId, setMutatingJobId] = useState<string | null>(null);

  const {isMutating, trigger: deleteJob} = usePrivateDelete(
    API_ROUTES_SELLER.job.getJob + "/" + selectedJob?.id
  );

  const {isMutating: isDisplayMutating, trigger: toggleJobVisibility} =
    useDynamicPrivatePut();

  const handleOpenModal = (jobId: string, jobName: string) => {
    setSelectedJob({id: jobId, name: jobName});
  };
  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  const handleConfirmDelete = async() => {
    if (selectedJob) {
      await deleteJob();
      setSelectedJob(null);
      await mutate();
    }
  };

  const handleToggleVisibility = async(
    jobId: string,
    currentShow: boolean
  ) => {
    try {
      setMutatingJobId(jobId);
      await toggleJobVisibility({
        url: `${API_ROUTES_SELLER.job.displayJob}/${jobId}`,
        data: {show: !currentShow},
      });
      await mutate();
      successMessage("service",
        currentShow ? "hideJob" : "showJob");
    } catch (error) {
      console.error("Toggle visibility failed:",
        error);
    } finally {
      setMutatingJobId(null);
    }
  };

  return (
    <div className="p-4 md:p-0">
      <div className="my-service-gradient rounded-lg shadow-sm p-6 mb-8 flex justify-between items-center hover:shadow-job-card duration-300">
        <div className="flex-1">
          <h2 className="text-lg font-medium mb-2 text-text-primary">
            {sellerMyServiceLanguage?.serviceFeeTitle}
          </h2>
          <p className="text-gray-600 text-sm">
            {sellerMyServiceLanguage?.serviceFeeDescription}
          </p>
          <Link prefetch={false} href="/content/commission">
            <button className="mt-4 bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded">
              {sellerMyServiceLanguage?.serviceFeeButton}
            </button>
          </Link>
        </div>
        <div>
          <Image
            src={SellerImage.calculation}
            alt="SellerImage"
            className="max-h-[165px] max-w-[160px] object-cover"
          />
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-medium text-text-primary">
          {interpolateDouble(sellerMyServiceLanguage?.myServicesTitle || "",
            {
              n: lengthOfJobs || 0,
              max: 5,
            })}
        </h2>
        <Link prefetch={false} href="/manage-product/create">
          <button
            disabled={lengthOfJobs >= 5 || notVerified}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4"/>
            {sellerMyServiceLanguage?.addNewService}
          </button>
        </Link>
      </div>
      {notVerified && (
        <div className="bg-orange-100 border border-blue-100 rounded-lg p-4 mb-4 flex items-start">
          <Info className="w-5 h-5 text-orange-600 mr-3 mt-0.5 flex-shrink-0"/>
          <div className="text-sm">
            <span className="text-gray-700">
              You are currently pending approval by Fastjob. You will be able
              to post jobs once you are approved.
            </span>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-start">
        <ClockAlert className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0"/>
        <div className="text-sm">
          <span className="text-gray-700">
            {sellerMyServiceLanguage?.approvalNote}
          </span>
        </div>
      </div>

      <div className="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full table-auto text-left text-sm">
          <thead className="bg-gray-50 text-gray-700 font-medium">
          <tr>
            <th className="p-4">{sellerMyServiceLanguage?.columnService}</th>
            <th className="p-4">
              {sellerMyServiceLanguage?.columnFeePercent}
            </th>
            <th className="p-4">{sellerMyServiceLanguage?.columnStatus}</th>
            <th className="p-4">
              {sellerMyServiceLanguage?.columnVisibility}
            </th>
            <th className="p-4">{sellerMyServiceLanguage?.columnManage}</th>
          </tr>
          </thead>
          <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="p-6 text-center">
                <LoadingMultiCircle/>
              </td>
            </tr>
          ) : jobsData?.jobs?.length ? (
            jobsData.jobs.map((job) => (
              <tr key={job.id} className="border-t border-gray-200">
                <td className="p-4 flex items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden mr-3 flex-shrink-0">
                    <Image
                      src={job.user.avatarUrl || SellerImage.calculation}
                      alt={job.title}
                      className="w-full h-full object-cover"
                      width={48}
                      height={48}
                    />
                  </div>
                  <div className="font-medium text-text-primary">
                    {job.title}
                  </div>
                </td>
                <td className="p-4 text-text-primary">15%</td>
                <td className="p-4">
                  <JobCreatedStatus
                    languageMap={sellerMyServiceLanguage}
                    status={job.status}
                  />
                </td>
                <td className="p-4">
                  <button
                    disabled={isDisplayMutating}
                    onClick={() => handleToggleVisibility(job.id,
                      job.show)}
                  >
                    {job.show ? (
                      <Eye
                        className={`w-5 h-5 ${
                          mutatingJobId === job.id
                            ? "text-gray-400"
                            : "text-gray-700"
                        }`}
                      />
                    ) : (
                      <EyeOff
                        className={`w-5 h-5 ${
                          mutatingJobId === job.id
                            ? "text-gray-400"
                            : "text-gray-700"
                        }`}
                      />
                    )}
                  </button>
                </td>
                <td className="p-4 space-x-2">
                  <Link prefetch={false} href={`/manage-product/${job.id}`}>
                    <button className="p-1 text-gray-500 hover:text-gray-700">
                      <Pencil className="w-4 h-4"/>
                    </button>
                  </Link>
                  <button
                    onClick={() => handleOpenModal(job.id,
                      job.title)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <Trash2 className="w-4 h-4"/>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="p-6 text-center text-gray-500">
                {sellerMyServiceLanguage?.noService}
              </td>
            </tr>
          )}
          </tbody>
        </table>
      </div>

      <div className="block md:hidden overflow-hidden">
        <div className="space-y-4">
          {isLoading ? (
            <div className="w-full flex justify-center items-center py-6">
              <LoadingMultiCircle/>
            </div>
          ) : jobsData?.jobs?.length ? (
            jobsData.jobs.map((job) => (
              <div
                key={job.id}
                className="relative border border-gray-200 rounded-lg px-4 pt-4 bg-white shadow-sm"
              >
                <div className="absolute top-2 right-2">
                  <JobCreatedStatus
                    status={job.status}
                    languageMap={sellerMyServiceLanguage}
                  />
                </div>

                <div className="flex flex-col gap-3 mb-2">
                  <div className="w-10 h-10 rounded-md overflow-hidden mr-3 flex-shrink-0 bg-gray-100">
                    <Image
                      src={job.user.avatarUrl || SellerImage.calculation}
                      alt={job.title}
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  </div>
                  <div className="font-sans text-sm font-semibold text-text-primary line-clamp-2">
                    {job.title}
                  </div>
                </div>

                <div className="inline-block bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded">
                  {sellerMyServiceLanguage?.columnFeePercent} 15%
                </div>

                <div className="pb-4 border-b-1 border-border-secondary w-full font-sans">
                  <div className="text-sm text-text-secondary flex flex-row justify-between items-center pt-4">
                    <p>{sellerMyServiceLanguage?.columnVisibility}</p>
                    <Eye className="w-4 h-4 text-text-secondary"/>
                  </div>

                  <Link prefetch={false}
                        href={`/manage-product/${job.id}`}
                        className="text-sm text-text-secondary flex flex-row justify-between items-center pt-4"
                  >
                    <p>{global.buttonEdit}</p>
                    <Pencil className="w-4 h-4 text-gray-400"/>
                  </Link>
                </div>

                <div className="flex items-center justify-end py-3">
                  <button
                    onClick={() => handleOpenModal(job.id,
                      job.title)}
                    className="font-sans text-red-500 text-sm font-medium flex items-center gap-1 hover:underline"
                  >
                    <Trash2 className="w-4 h-4"/>
                    {global.buttonDelete}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full flex justify-center items-center py-6">
              Chưa có dịch vụ nào
            </div>
          )}
        </div>
      </div>

      <ConfirmDeleteModal
        isDeleteLoading={isMutating}
        isOpen={!!selectedJob}
        jobName={selectedJob?.name || ""}
        onClose={handleCloseModal}
        handleConfirmChange={handleConfirmDelete}
      />
    </div>
  );
};

export default MyServices;
