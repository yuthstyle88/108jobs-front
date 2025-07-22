"use client";
import { Button } from "@/components/ui/Button";
import { ProfileImage } from "@/constants/images";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, ArrowLeft, Info, Paperclip } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const jobApplicationSchema = z.object({
  whyHireYou: z.string().min(100, "Minimum 100 characters required"),
  portfolioUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  portfolioFiles: z.any().optional(),
  price: z.coerce.number().min(1, "Price is required"),
  timeline: z.coerce.number().min(1, "Timeline is required"),
  service: z.string().min(1, "Please select a service"),
});

type JobApplicationFormData = z.infer<typeof jobApplicationSchema>;

const JobApplication = () => {
  const route = useRouter();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<JobApplicationFormData>({
    resolver: zodResolver(jobApplicationSchema),
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const onSubmit = (data: JobApplicationFormData) => {
    console.log("Form submitted:", data);

    const formData = new FormData();
    formData.append("whyHireYou", data.whyHireYou);
    formData.append("portfolioUrl", data.portfolioUrl || "");
    formData.append("price", data.price.toString());
    formData.append("timeline", data.timeline.toString());
    formData.append("service", data.service);

    if (selectedFiles.length > 0) {
      selectedFiles.forEach((file) => {
        formData.append("portfolioFiles", file);
      });
    }

    // TODO: Gửi formData qua API
    console.log("FormData ready to submit:", formData);
    route.back();
  };

  return (
    <div className="min-h-screen bg-[#f6f9fe]">
      <div className="max-w-[1280px] w-[88vw] mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => route.back()}>
            <ArrowLeft className="w-[26px] h-[26px] text-text-primary" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[441px_1fr] gap-8">
          <div>
            <h1 className="text-[32px] text-text-primary font-bold">
              Increase Your Hiring Chances! With Relevant Experience and
              Portfolio
            </h1>
            <p className="text-text-secondary mb-6">
              Most clients choose freelancers based on work history and
              portfolio samples
            </p>
            <div className="w-full flex justify-center items-center">
              <Image
                src={ProfileImage.proposal}
                alt="proposal"
                width={275}
                height={180}
              />
            </div>
          </div>

          <div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-yellow-800">
                Warning: Inviting clients to make payments outside the Fastjob
                system is against the terms of use and will result in account
                suspension.
              </p>
            </div>
            <div className="bg-white">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  All information will be publicly visible (except &apos;Proposed
                  Price&apos;)
                </p>
              </div>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 px-4 pt-5 pb-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why Clients Should Hire You
                  </label>
                  <textarea
                    {...register("whyHireYou")}
                    placeholder="e.g. Relevant portfolio / Work history / Work process details"
                    className="text-text-primary w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />

                  {errors.whyHireYou ? (
                    <p className="text-red-500 text-sm">
                      {errors.whyHireYou.message}
                    </p>
                  ) : (
                    <div className="text-xs text-gray-500 text-right mt-1">
                      {watch("whyHireYou")?.length || 0} / Minimum 100
                      characters
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio URL (Optional)
                  </label>
                  <input
                    type="url"
                    {...register("portfolioUrl")}
                    placeholder="e.g. https://example.com"
                    className="text-text-primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {errors.portfolioUrl && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.portfolioUrl.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Portfolio Samples (Optional)
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Max 25MB per file, up to 10 files
                  </p>
                  <input
                    type="file"
                    multiple
                    hidden
                    id="portfolio-files"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="portfolio-files">
                    <Button variant="outline" type="button" className="w-full text-text-primary">
                      <Paperclip className="w-4 h-4 mr-2 text-text-primary" />
                      Select Portfolio Files
                    </Button>
                  </label>
                  {selectedFiles.length > 0 && (
                    <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                      {selectedFiles.map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (Visible to client only)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        {...register("price", { valueAsNumber: true })}
                        placeholder="0"
                        className="text-text-primary w-full px-3 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        BATH
                      </span>
                    </div>
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timeline
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        {...register("timeline", { valueAsNumber: true })}
                        placeholder="0"
                        className="text-text-primary w-full px-3 py-2 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        days
                      </span>
                    </div>
                    {errors.timeline && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.timeline.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Your Service
                  </label>
                  <select
                    {...register("service")}
                    className="text-text-primary w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Your Service</option>
                    <option value="web-development">Web Development</option>
                    <option value="mobile-development">
                      Mobile Development
                    </option>
                    <option value="backend-development">
                      Backend Development
                    </option>
                    <option value="ui-ux-design">UI/UX Design</option>
                    <option value="photoshop">Photoshop</option>
                  </select>
                  {errors.service && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.service.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4 text-text-primary">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => route.back()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Submit
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobApplication;
