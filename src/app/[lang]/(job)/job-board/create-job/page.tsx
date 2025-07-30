"use client";
import { LanguageFile } from "@/constants/language";
import { getNamespace } from "@/utils/i18nHelper";
import React from "react";
import {CreatePostForm} from "@/components/Job/PostCreate";

const CreateJobPage = () => {
  const createJobLanguage = getNamespace(LanguageFile.JOB_BOARD_CREATE);


  return (
      <CreatePostForm createJobLanguage={createJobLanguage}/>
  );
};

export default CreateJobPage;
