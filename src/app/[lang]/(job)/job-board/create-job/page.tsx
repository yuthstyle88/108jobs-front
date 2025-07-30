"use client";
import Loading from "@/components/Loading";
import { LanguageFile } from "@/constants/language";
import { getNamespace } from "@/utils/i18nHelper";
import React from "react";
import {CreatePostForm} from "@/components/Job/PostCreate";
import { useGlobalTranslate } from "@/hooks/translation/useGlobalTranslate";

const CreateJobPage = () => {
  const {
    data: createJobLanguage,
    isLoading: isLanguageLoading,
    error: languageError,
  } = useGlobalTranslate(LanguageFile.JOB_BOARD_CREATE);

  if (isLanguageLoading || isLanguageLoading) return <Loading />;
  if (languageError) return <div>Error loading data</div>;

  return (
      <CreatePostForm createJobLanguage={createJobLanguage}/>
  );
};

export default CreateJobPage;
