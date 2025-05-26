import { TermAndConditionLanguage } from "@/types/language";

type Props = {
  language: Partial<TermAndConditionLanguage> | undefined | null;
};

const TermsAndCondition = ({ language }: Props) => {
  return (
    <div className="mb-0 text-text_primary font-sans leading-[1.5]">
      <p className="text-[24px] text-center mb-[1.5rem] leading-[1.5] ">
        <strong>{language?.terms_and_conditions_title}</strong>
      </p>
      <ol className="mt-3 grid gap-2 pl-[48px] list-decimal">
        <li>
          <p className="mb-6 ">
            <strong>{language?.section_1_title}</strong>
          </p>
          <ul className="mt-3 grid gap-2 pl-[48px] list-disc">
            <li>
              {language?.definition_1} {language?.definition_2}{" "}
              {language?.definition_3} {language?.definition_4}
            </li>
            <li>{language?.definition_5}</li>
            <li>{language?.definition_6}</li>
            <li>
              {language?.definition_7} {language?.definition_8}
            </li>
            <li>{language?.definition_9}</li>
            <li>{language?.definition_10}</li>
            <li>{language?.definition_11}</li>
            <li>
              {language?.definition_12} {language?.definition_13}
            </li>
            <li>
              {language?.definition_14} {language?.definition_15}
            </li>
            <li>{language?.definition_16}</li>
            <li>
              {language?.definition_17} {language?.definition_18}
            </li>
            <li>
              {language?.definition_19} {language?.definition_20}{" "}
              {language?.definition_21}
            </li>
            <li>{language?.definition_22}</li>
            <li>
              {language?.definition_23} {language?.definition_24}
            </li>
            <li>
              {language?.definition_25} {language?.definition_26}{" "}
              {language?.definition_27}
            </li>
            <li>{language?.definition_28}</li>
            <li>{language?.definition_29}</li>
            <li>{language?.definition_30}</li>
            <li>{language?.definition_31}</li>
            <li>{language?.definition_32}</li>
          </ul>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section_2_title}</strong>
          </p>
          <p className="mb-6">{language?.general_terms_1}</p>
          <p className="mb-6">
            {language?.general_terms_2} {language?.general_terms_3}
          </p>
          <p className="mb-6">
            {language?.general_terms_4} {language?.general_terms_5}
          </p>
          <p className="mb-6">
            {language?.general_terms_6} {language?.general_terms_7}
          </p>
          <p className="mb-6">
            {language?.general_terms_8} {language?.general_terms_9}
          </p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section_3_title}</strong>
          </p>
          <p className="mb-6">
            {language?.freelancer_commitment_1}
            {language?.freelancer_commitment_2}
          </p>
          <p className="mb-6">
            {language?.freelancer_commitment_3}
            {language?.freelancer_commitment_4}
          </p>
          <p className="mb-6">
            {language?.freelancer_commitment_5}
            {language?.freelancer_commitment_6}
          </p>
          <p className="mb-6">
            {language?.freelancer_commitment_7}
            {language?.freelancer_commitment_8}
          </p>
          <p className="mb-6">
            {language?.freelancer_commitment_9}
            {language?.freelancer_commitment_10}
          </p>
          <p className="mb-6">{language?.freelancer_commitment_11}</p>
          <p className="mb-6">{language?.freelancer_commitment_12}</p>
          <p className="mb-6">{language?.freelancer_commitment_13}</p>
          <p className="mb-6">{language?.freelancer_commitment_14}</p>
          <p className="mb-6">{language?.freelancer_commitment_15}</p>
          <p className="mb-6">{language?.freelancer_commitment_16}</p>
          <p className="mb-6">{language?.freelancer_commitment_17}</p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section_4_title}</strong>
          </p>
          <p className="mb-6">{language?.registration_1}</p>
          <p className="mb-6">
            {language?.registration_2} {language?.registration_3}
          </p>
          <p className="mb-6">{language?.registration_4}</p>
          <p className="mb-6">· {language?.registration_5}</p>
          <p className="mb-6">· {language?.registration_6}</p>
          <p className="mb-6">
            · {language?.registration_7} {language?.registration_8}
          </p>
          <p className="mb-6">
            · {language?.registration_9} {language?.registration_10}
          </p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section_5_title}</strong> {language?.project_1}{" "}
            {language?.project_2} {language?.project_3}
          </p>
          <p className="mb-6">
            {language?.project_4} {language?.project_5}
          </p>
          <p className="mb-6">
            {language?.project_6} {language?.project_7} {language?.project_8}
          </p>
          <p className="mb-6">
            {language?.project_9} {language?.project_10}
          </p>
          <p className="mb-6">
            {language?.project_11} {language?.project_12}
          </p>
          <p className="mb-6">
            {language?.project_13} {language?.project_14}
          </p>
          <p className="mb-6">
            {language?.project_15} {language?.project_16}
          </p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section_6_title}</strong>
          </p>
          <p className="mb-6">{language?.communication_1}</p>
          <p className="mb-6">{language?.communication_2}</p>
          <p className="mb-6">{language?.communication_3}</p>
          <p className="mb-6">{language?.communication_4}</p>
          <p className="mb-6">{language?.communication_5}</p>
          <p className="mb-6">{language?.communication_6}</p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section_7_title}</strong>
          </p>
          <p className="mb-6">{language?.fees_1}</p>
          <p className="mb-6">
            {language?.fees_2} {language?.fees_3}
          </p>
          <p className="mb-6">
            {language?.fees_4} {language?.fees_5}
          </p>
          <p className="mb-6">{language?.fees_6}</p>
          <p className="mb-6">
            {language?.fees_7} {language?.fees_8}
          </p>
          <p className="mb-6">{language?.fees_9}</p>
          <p className="mb-6">{language?.fees_10}</p>
          <p className="mb-6">{language?.fees_11}</p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section_8_title}</strong>
          </p>
          <p className="mb-6">
            {language?.coins_1} {language?.coins_2} {language?.coins_3}
          </p>
          <p className="mb-6">
            {language?.coins_4} {language?.coins_5} {language?.coins_6}
          </p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section_9_title}</strong>
          </p>
          <p className="mb-6">{language?.product_service_1}</p>
          <p className="mb-6">
            {language?.product_service_2} {language?.product_service_3}
          </p>
          <p className="mb-6">{language?.product_service_4}</p>
          <p className="mb-6">{language?.product_service_5}</p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section_10_title}</strong>
          </p>
          <p className="mb-6">
            {language?.review_1} {language?.review_2}
          </p>
          <p className="mb-6">
            {language?.review_3} {language?.review_4}
          </p>
          <p className="mb-6">
            {language?.review_5} {language?.review_6}
          </p>
          <p className="mb-6">{language?.review_7}</p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section_11_title}</strong>
          </p>
          <p className="mb-6">{language?.project_status_1}</p>
          <p className="mb-6">{language?.project_status_2}</p>
          <p className="mb-6">{language?.project_status_3}</p>
          <p className="mb-6">{language?.project_status_4}</p>
          <p className="mb-6">{language?.project_status_5}</p>
          <p className="mb-6">{language?.project_status_6}</p>
        </li>
        <li>
          <p className="mb-6 ">
            <strong>{language?.section_12_title}</strong>
          </p>
          <p className="mb-6 ">{language?.cancellation_restrictions_1}</p>
          <p className="mb-6 ">{language?.cancellation_restrictions_2}</p>
          <p className="mb-6 ">{language?.cancellation_restrictions_3}</p>
          <p className="mb-6 ">{language?.cancellation_restrictions_4}</p>
        </li>
        <li>
          <p className="mb-6 ">
            <strong>{language?.section_13_title}</strong>
          </p>
          <p className="mb-6 ">{language?.account_suspension_1}</p>
          <p className="mb-6 ">{language?.account_suspension_2}</p>
          <p className="mb-6 ">{language?.account_suspension_3}</p>
          <ul className="mb-6 mt-3 grid gap-2 pl-[48px] list-disc">
            <li>{language?.account_suspension_4}</li>
            <li>{language?.account_suspension_5}</li>
            <li>{language?.account_suspension_6}</li>
            <li>{language?.account_suspension_7}</li>
            <li>{language?.account_suspension_8}</li>
            <li>{language?.account_suspension_9}</li>
            <li>{language?.account_suspension_10}</li>
            <li>{language?.account_suspension_11}</li>
            <li>{language?.account_suspension_12}</li>
          </ul>
          <p className="mb-6 ">{language?.account_suspension_13}</p>
          <p className="mb-6 ">{language?.account_suspension_14}</p>
          <p className="mb-6 ">{language?.account_suspension_15}</p>
        </li>
        <li>
          <p className="mb-6 ">
            <strong>{language?.section_14_title}</strong>
          </p>
          <p className="mb-6 ">{language?.dispute_resolution_1}</p>
          <p className="mb-6">{language?.dispute_resolution_2}</p>
          <p className="mb-6">{language?.dispute_resolution_3}</p>
          <p className="mb-6">{language?.dispute_resolution_4}</p>
          <ul className="mb-6 mt-3 grid gap-2 pl-[48px] list-disc">
            <li>{language?.dispute_resolution_5}</li>
            <li>{language?.dispute_resolution_6}</li>
            <li>{language?.dispute_resolution_7}</li>
            <li>{language?.dispute_resolution_8}</li>
          </ul>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section_15_title}</strong>
          </p>
          <p className="mb-6">
            {language?.indemnification_1}
          </p>
          <ul className="mb-6 mt-3 grid gap-2 pl-[48px] list-disc">
            <li>
              {language?.indemnification_2}
            </li>
            <li>
              {language?.indemnification_3}
            </li>
            <li>
              {language?.indemnification_4}
            </li>
            <li>
              {language?.indemnification_5}
            </li>
          </ul>
          <p className="mb-6">
            {language?.indemnification_6}
          </p>
          <p className="mb-6">
            {language?.indemnification_7}
          </p>
          <p className="mb-6">
            {language?.indemnification_8}
          </p>
          <p className="mb-6">
            {language?.indemnification_9}
          </p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section_16_title}</strong>
          </p>
          <p className="mb-6">
            {language?.company_liability_1}
          </p>
          <p className="mb-6">
            {language?.company_liability_2}
          </p>
          <ul className="mb-6 mt-3 grid gap-2 pl-[48px] list-disc">
            <li>{language?.company_liability_3}</li>
            <li>{language?.company_liability_4}</li>
            <li>{language?.company_liability_5}</li>
            <li>
              {language?.company_liability_6}
            </li>
          </ul>
          <p className="mb-6">
            {language?.company_liability_7}
          </p>
          <p className="mb-6">
            {language?.company_liability_8}
          </p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section_17_title}</strong>
          </p>
          <p className="mb-6">
            {language?.intellectual_property_1}
          </p>
          <p className="mb-6">
            {language?.intellectual_property_2}
          </p>
          <p className="mb-6">
            {language?.intellectual_property_3}
          </p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section_18_title}</strong>
          </p>
          <p className="mb-6">
           {language?.privacy_policy_1}
          </p>
          <p className="mb-6">
            {language?.privacy_policy_2}
          </p>
          <p className="mb-6">
            {language?.privacy_policy_3}
          </p>
          <p className="mb-6">
            {language?.privacy_policy_4}
          </p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section_19_title}</strong>
          </p>
          <p className="mb-6">
            {language?.contact_1} 
          </p>
          <ul className="mb-6 mt-3 grid gap-2 pl-[48px] list-disc">
            <li>
              {language?.contact_2}
            </li>
            <li>
              {language?.contact_3}
            </li>
            <li>
              {language?.contact_4}
            </li>
            <li>
              {language?.contact_5}
            </li>
          </ul>
        </li>
      </ol>
    </div>
  );
};

export default TermsAndCondition;
