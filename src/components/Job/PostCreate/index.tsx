import React, {useCallback} from "react";
import {useRouter} from "next/navigation";
import {useHttpPost} from "@/hooks/useHttpPost";
import useNotification from "@/hooks/useNotification";
import {useHttpGet} from "@/hooks/useHttpGet";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {CreatePost, JobType,} from "@/lib/lemmy-js-client/src";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle, faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import LoadingCircle from "@/components/LoadingCircle";
import {z} from "zod";

import {LanguageDataType} from "@/store/useLanguageStore";


interface PostFormProps {
  redirectUrl?: string,
  history?: any,
  setApiError?: (err: string) => void,
  createJobLanguage?: LanguageDataType
}
const jobSchema = z.object({
  communityId: z.coerce.number().int().positive("Community ID ต้องเป็นเลขบวก"),
  jobTitle: z.string().min(5, "Job title ต้องมีอย่างน้อย 5 ตัวอักษร"),
  description: z.string().min(20, "รายละเอียดงานต้องมีอย่างน้อย 20 ตัวอักษร"),
  budget: z.string().min(1, "Budget is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Budget ต้องเป็นตัวเลขบวก",
  }),
  workingFrom: z.enum(["Freelance", "Contract", "PartTime", "FullTime"]),
  intendedUse: z.enum(["Business", "Personal", "Unknown"]),
});


export const CreatePostForm: React.FC<PostFormProps> = ({
  redirectUrl: propRedirectUrl,
  history,
  setApiError,
  createJobLanguage
}) => {

  const router = useRouter();


  const {execute: createJob, isMutating} = useHttpPost("createPost");

  const {successMessage, errorMessage} = useNotification();

  const {state, data: catalogData, isMutating: isCatalogLoading} = useHttpGet("listCommunities");

  const formMethods = useForm<z.infer<typeof jobSchema>>({
    resolver: zodResolver(jobSchema), // Validation โดย schema
    mode: "onChange",
    criteriaMode: "all",
    defaultValues: {
      communityId: 0,  // ตรวจสอบว่าค่าไม่ใช่ undefined
      jobTitle: "",
      description: "",
      budget: "",
      workingFrom: JobType.Freelance,
      intendedUse: "Personal",
    },
  });


  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: {isValid, errors, isSubmitting}
  } = formMethods;

  const handleCreateSuccess = useCallback( async() => {
      router.replace("/job-board");
    },
    [ router]);

  const onSubmit = useCallback(async (data: any) => {

    try {
        console.log("Form submitted: ", data); // Logs รูปแบบข้อมูลที่ส่งจากฟอร์ม
        alert("Submitted Payload: " + JSON.stringify(data, null, 2)); // ดูข้อมูลสาธิต
        const payload: CreatePost = {
            name: data.jobTitle,
            body: data.description,
            jobType: data.workingFrom,
            communityId: data.communityId,
            deadline: data.deadline,
            isEnglishRequired: data.isEnglishRequired,
            url: data.exampleUrl,
            intendedUse: data.intendedUse,
            budget: data.budget,
        };

      if (!payload.deadline) {
        delete (payload as { deadline?: typeof payload.deadline }).deadline;
      }

      await createJob(payload); // ฟังก์ชัน createJob ต้องตรวจสอบว่าส่งค่าได้ถูกต้อง
        successMessage(null,null,"Success!");
    } catch (error) {
        console.error("Error creating job: ", error);
        errorMessage(null,null,"Submission failed!");
    }
}, [createJob,handleCreateSuccess, successMessage, errorMessage]);
  return (
    <div className="bg-[#F6F9FE] min-h-screen py-8">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {createJobLanguage?.pageTitle}
          </h1>

          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
            <FontAwesomeIcon
              icon={faInfoCircle}
              className="text-blue-600 mt-1 mr-3"
            />
            <p className="text-blue-800">
              {createJobLanguage?.jobPostingNotice}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} method="POST" >
            {/* Job Title */}
            <div className="mb-6">
              <label
                htmlFor="jobTitle"
                className="block text-gray-700 font-medium mb-2"
              >
                {createJobLanguage?.jobTitleLabel}
              </label>
              <input
                id="jobTitle"
                {...register("jobTitle")}
                placeholder={createJobLanguage?.jobTitlePlaceholder}
                className={`w-full text-text-primary placeholder:text-text-secondary placeholder:font-sans p-3 border rounded-lg focus:outline-none focus:ring-1 ${
                  errors.jobTitle
                    ? "border-red-200 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />

              {errors.jobTitle && (
                <p className="mt-1 text-red-500 text-sm flex items-center">
                  <FontAwesomeIcon
                    icon={faExclamationCircle}
                    className="mr-1"
                  />
                  {errors.jobTitle.message}
                </p>
              )}
            </div>

            {/* Working From */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                {createJobLanguage?.employmentTypeLabel}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                  <input
                    type="radio"
                    id="jopType"
                    value={JobType.Freelance}
                    {...register("workingFrom")}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor="freelance" className="ml-2 text-gray-700">
                    {createJobLanguage?.employmentTypeFreelance}
                  </label>
                </div>

                <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                  <input
                    type="radio"
                    id="jopType"
                    value={JobType.Contract}
                    {...register("workingFrom")}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor="contract" className="ml-2 text-gray-700">
                    {createJobLanguage?.employmentTypeContract}
                  </label>
                </div>

                <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                  <input
                    type="radio"
                    id="jopType"
                    value={JobType.PartTime}
                    {...register("workingFrom")}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor="parttime" className="ml-2 text-gray-700">
                    {createJobLanguage?.employmentTypePartTime}
                  </label>
                </div>

                <div className="flex items-center p-3 border border-gray-300 rounded-lg">
                  <input
                    type="radio"
                    id="jopType"
                    value={JobType.FullTime}
                    {...register("workingFrom")}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor="fulltime" className="ml-2 text-gray-700">
                    {createJobLanguage?.employmentTypeFullTime}
                  </label>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-gray-700 font-medium mb-2"
              >
                {createJobLanguage?.jobDescriptionLabel}
              </label>
              <p className="text-gray-500 text-sm mb-2">
                {createJobLanguage?.jobDescriptionNotice}
              </p>
              <textarea
                id="description"
                {...register("description")}
                placeholder={createJobLanguage?.jobDescriptionDetails}
                className={`text-text-primary placeholder:text-text-secondary placeholder:font-sans w-full p-3 border rounded-lg focus:outline-none focus:ring-1 min-h-[200px] ${
                  errors.description
                    ? "border-red-200 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />

              {errors.description && (
                <p className="mt-1 text-red-500 text-sm flex items-center">
                  <FontAwesomeIcon
                    icon={faExclamationCircle}
                    className="mr-1"
                  />
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* English Required Checkbox */}
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isEnglishRequired"
                  className="h-4 w-4 text-blue-600"
                />
                <label
                  htmlFor="isEnglishRequired"
                  className="ml-2 text-gray-700"
                >
                  {createJobLanguage?.englishSpeakerLabel}
                </label>
              </div>
            </div>

            {/* Example URL and Service Catalog */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="exampleUrl"
                  className="block text-gray-700 font-medium mb-2"
                >
                  {createJobLanguage?.exampleUrl}
                </label>
                <input
                  id="exampleUrl"
                  placeholder={
                    createJobLanguage?.serviceCategoryPlaceholderUrl
                  }
                  className={`text-text-primary placeholder:text-text-secondary placeholder:font-sans w-full p-3 border rounded-lg focus:outline-none focus:ring-1`}
                />

              </div>

              <div>
                <label
                  htmlFor="communityId"
                  className="block text-gray-700 font-medium mb-2"
                >
                  {createJobLanguage?.serviceCategoryLabel}
                </label>
                <select
                  id="communityId"
                  {...register("communityId")}
                  className={`text-text-primary placeholder:text-text-secondary placeholder:font-sans w-full p-3 border rounded-lg focus:outline-none focus:ring-1 ${
                    errors.communityId
                      ? "border-red-200 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                >
                  <option disabled value="">
                    {createJobLanguage?.serviceCategoryPlaceholderSelect}
                  </option>
                  {catalogData?.communities
                  ?.filter((catalog) => catalog.community.name !== "popular-service")
                  .map((catalog) => (
                    <option key={catalog.community.id} value={catalog.community.id}>
                      {catalog.community.name}
                    </option>
                  ))}
                </select>

                {errors.communityId && (
                  <p className="mt-1 text-red-500 text-sm flex items-center">
                    <FontAwesomeIcon
                      icon={faExclamationCircle}
                      className="mr-1"
                    />
                    {errors.communityId.message}
                  </p>
                )}
              </div>
            </div>

            {/* Budget and Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label
                  htmlFor="budget"
                  className="block text-gray-700 font-medium mb-2"
                >
                  {createJobLanguage?.budgetLabel}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="budget"
                    {...register("budget")}
                    placeholder="0"
                    className={`text-text-primary placeholder:text-text-secondary placeholder:font-sans w-full p-3 border rounded-lg focus:outline-none focus:ring-1 ${
                      errors.budget
                        ? "border-red-200 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />

                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    THB
                  </div>
                </div>
                {errors.budget && (
                  <p className="mt-1 text-red-500 text-sm flex items-center">
                    <FontAwesomeIcon
                      icon={faExclamationCircle}
                      className="mr-1"
                    />
                    {errors.budget.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="deadline"
                  className="block text-gray-700 font-medium mb-2"
                >
                  {createJobLanguage?.deadlineLabel}
                </label>
                <input
                  type="date"
                  id="deadline"
                  min={new Date().toISOString().split("T")[0]}
                  className="text-text-primary placeholder:text-text-secondary placeholder:font-sans w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Intended Use */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                {createJobLanguage?.intendedUseLabel}
              </label>
              <p className="text-gray-500 text-sm mb-2">
                {createJobLanguage?.intendedUseNotice}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                <div
                  className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer ${
                    watch("intendedUse") === "Business"
                      ? "bg-blue-100 border border-blue-300"
                      : "bg-white border border-gray-200"
                  }`}
                  onClick={() => setValue("intendedUse", "Business")}
                >
                  <div className="text-blue-600 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    {createJobLanguage?.intendedUseBusiness}
                  </span>
                </div>

                <div
                  className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer ${
                    watch("intendedUse") === "Personal"
                      ? "bg-blue-100 border border-blue-300"
                      : "bg-white border border-gray-200"
                  }`}
                  onClick={() => setValue("intendedUse", "Personal")}
                >
                  <div className="text-blue-600 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    {createJobLanguage?.intendedUsePersonal}
                  </span>
                </div>

                <div
                  className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer ${
                    watch("intendedUse") === "Unknown"
                      ? "bg-blue-100 border border-blue-300"
                      : "bg-white border border-gray-200"
                  }`}
                  onClick={() => setValue("intendedUse", "Unknown")}
                >
                  <div className="text-blue-600 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    {createJobLanguage?.intendedUseUnknown}
                  </span>
                </div>
              </div>
            </div>

            {/* Anonymous Post */}
            <div className="mb-6 flex items-center">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                <span className="ml-3 text-gray-700">
                  {createJobLanguage?.anonymousPostLabel}
                </span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-4 mt-10">
              <Link prefetch={false}
                    href="/job-board"
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                {createJobLanguage?.previewButton}
              </Link>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
                disabled={isMutating}
              >
                {isMutating ? (
                  <LoadingCircle />
                ) : (
                  createJobLanguage?.submitButton
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};