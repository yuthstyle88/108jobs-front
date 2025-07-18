import { TermAndConditionLanguage } from "@/types/language";

type Props = {
  language: Partial<TermAndConditionLanguage> | undefined | null;
};

const TermsAndCondition = ({ language }: Props) => {
  return (
    <div className="mb-0 text-text-primary font-sans leading-[1.5]">
      <p className="text-[24px] text-center mb-[1.5rem] leading-[1.5] ">
        <strong>{language?.termsAndConditionsTitle}</strong>
      </p>
      <ol className="mt-3 grid gap-2 pl-[48px] list-decimal">
        <li>
          <p className="mb-6 ">
            <strong>{language?.section1Title}</strong>
          </p>
          <ul className="mt-3 grid gap-2 pl-[48px] list-disc">
            <li>
              {language?.definition1} {language?.definition2}{" "}
              {language?.definition3} {language?.definition4}
            </li>
            <li>{language?.definition5}</li>
            <li>{language?.definition6}</li>
            <li>
              {language?.definition7} {language?.definition8}
            </li>
            <li>{language?.definition9}</li>
            <li>{language?.definition10}</li>
            <li>{language?.definition11}</li>
            <li>
              {language?.definition12} {language?.definition13}
            </li>
            <li>
              {language?.definition14} {language?.definition15}
            </li>
            <li>{language?.definition16}</li>
            <li>
              {language?.definition17} {language?.definition18}
            </li>
            <li>
              {language?.definition19} {language?.definition20}{" "}
              {language?.definition21}
            </li>
            <li>{language?.definition22}</li>
            <li>
              {language?.definition23} {language?.definition24}
            </li>
            <li>
              {language?.definition25} {language?.definition26}{" "}
              {language?.definition27}
            </li>
            <li>{language?.definition28}</li>
            <li>{language?.definition29}</li>
            <li>{language?.definition30}</li>
            <li>{language?.definition31}</li>
            <li>{language?.definition32}</li>
          </ul>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section2Title}</strong>
          </p>
          <p className="mb-6">{language?.generalTerms1}</p>
          <p className="mb-6">
            {language?.generalTerms2} {language?.generalTerms3}
          </p>
          <p className="mb-6">
            {language?.generalTerms4} {language?.generalTerms5}
          </p>
          <p className="mb-6">
            {language?.generalTerms6} {language?.generalTerms7}
          </p>
          <p className="mb-6">
            {language?.generalTerms8} {language?.generalTerms9}
          </p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section3Title}</strong>
          </p>
          <p className="mb-6">
            {language?.freelancerCommitment1}
            {language?.freelancerCommitment2}
          </p>
          <p className="mb-6">
            {language?.freelancerCommitment3}
            {language?.freelancerCommitment4}
          </p>
          <p className="mb-6">
            {language?.freelancerCommitment5}
            {language?.freelancerCommitment6}
          </p>
          <p className="mb-6">
            {language?.freelancerCommitment7}
            {language?.freelancerCommitment8}
          </p>
          <p className="mb-6">
            {language?.freelancerCommitment9}
            {language?.freelancerCommitment10}
          </p>
          <p className="mb-6">{language?.freelancerCommitment11}</p>
          <p className="mb-6">{language?.freelancerCommitment12}</p>
          <p className="mb-6">{language?.freelancerCommitment13}</p>
          <p className="mb-6">{language?.freelancerCommitment14}</p>
          <p className="mb-6">{language?.freelancerCommitment15}</p>
          <p className="mb-6">{language?.freelancerCommitment16}</p>
          <p className="mb-6">{language?.freelancerCommitment17}</p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section4Title}</strong>
          </p>
          <p className="mb-6">{language?.registration1}</p>
          <p className="mb-6">
            {language?.registration2} {language?.registration3}
          </p>
          <p className="mb-6">{language?.registration4}</p>
          <p className="mb-6">· {language?.registration5}</p>
          <p className="mb-6">· {language?.registration6}</p>
          <p className="mb-6">
            · {language?.registration7} {language?.registration8}
          </p>
          <p className="mb-6">
            · {language?.registration9} {language?.registration10}
          </p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section5Title}</strong> {language?.project1}{" "}
            {language?.project2} {language?.project3}
          </p>
          <p className="mb-6">
            {language?.project4} {language?.project5}
          </p>
          <p className="mb-6">
            {language?.project6} {language?.project7} {language?.project8}
          </p>
          <p className="mb-6">
            {language?.project9} {language?.project10}
          </p>
          <p className="mb-6">
            {language?.project11} {language?.project12}
          </p>
          <p className="mb-6">
            {language?.project13} {language?.project14}
          </p>
          <p className="mb-6">
            {language?.project15} {language?.project16}
          </p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section6Title}</strong>
          </p>
          <p className="mb-6">{language?.communication1}</p>
          <p className="mb-6">{language?.communication2}</p>
          <p className="mb-6">{language?.communication3}</p>
          <p className="mb-6">{language?.communication4}</p>
          <p className="mb-6">{language?.communication5}</p>
          <p className="mb-6">{language?.communication6}</p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section7Title}</strong>
          </p>
          <p className="mb-6">{language?.fees1}</p>
          <p className="mb-6">
            {language?.fees2} {language?.fees3}
          </p>
          <p className="mb-6">
            {language?.fees4} {language?.fees5}
          </p>
          <p className="mb-6">{language?.fees6}</p>
          <p className="mb-6">
            {language?.fees7} {language?.fees8}
          </p>
          <p className="mb-6">{language?.fees9}</p>
          <p className="mb-6">{language?.fees10}</p>
          <p className="mb-6">{language?.fees11}</p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section8Title}</strong>
          </p>
          <p className="mb-6">
            {language?.coins1} {language?.coins2} {language?.coins3}
          </p>
          <p className="mb-6">
            {language?.coins4} {language?.coins5} {language?.coins6}
          </p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section9Title}</strong>
          </p>
          <p className="mb-6">{language?.productService1}</p>
          <p className="mb-6">
            {language?.productService2} {language?.productService3}
          </p>
          <p className="mb-6">{language?.productService4}</p>
          <p className="mb-6">{language?.productService5}</p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section10Title}</strong>
          </p>
          <p className="mb-6">
            {language?.review1} {language?.review2}
          </p>
          <p className="mb-6">
            {language?.review3} {language?.review4}
          </p>
          <p className="mb-6">
            {language?.review5} {language?.review6}
          </p>
          <p className="mb-6">{language?.review7}</p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section11Title}</strong>
          </p>
          <p className="mb-6">{language?.projectStatus1}</p>
          <p className="mb-6">{language?.projectStatus2}</p>
          <p className="mb-6">{language?.projectStatus3}</p>
          <p className="mb-6">{language?.projectStatus4}</p>
          <p className="mb-6">{language?.projectStatus5}</p>
          <p className="mb-6">{language?.projectStatus6}</p>
        </li>
        <li>
          <p className="mb-6 ">
            <strong>{language?.section12Title}</strong>
          </p>
          <p className="mb-6 ">{language?.cancellationRestrictions1}</p>
          <p className="mb-6 ">{language?.cancellationRestrictions2}</p>
          <p className="mb-6 ">{language?.cancellationRestrictions3}</p>
          <p className="mb-6 ">{language?.cancellationRestrictions4}</p>
        </li>
        <li>
          <p className="mb-6 ">
            <strong>{language?.section13Title}</strong>
          </p>
          <p className="mb-6 ">{language?.accountSuspension1}</p>
          <p className="mb-6 ">{language?.accountSuspension2}</p>
          <p className="mb-6 ">{language?.accountSuspension3}</p>
          <ul className="mb-6 mt-3 grid gap-2 pl-[48px] list-disc">
            <li>{language?.accountSuspension4}</li>
            <li>{language?.accountSuspension5}</li>
            <li>{language?.accountSuspension6}</li>
            <li>{language?.accountSuspension7}</li>
            <li>{language?.accountSuspension8}</li>
            <li>{language?.accountSuspension9}</li>
            <li>{language?.accountSuspension10}</li>
            <li>{language?.accountSuspension11}</li>
            <li>{language?.accountSuspension12}</li>
          </ul>
          <p className="mb-6 ">{language?.accountSuspension13}</p>
          <p className="mb-6 ">{language?.accountSuspension14}</p>
          <p className="mb-6 ">{language?.accountSuspension15}</p>
        </li>
        <li>
          <p className="mb-6 ">
            <strong>{language?.section14Title}</strong>
          </p>
          <p className="mb-6 ">{language?.disputeResolution1}</p>
          <p className="mb-6">{language?.disputeResolution2}</p>
          <p className="mb-6">{language?.disputeResolution3}</p>
          <p className="mb-6">{language?.disputeResolution4}</p>
          <ul className="mb-6 mt-3 grid gap-2 pl-[48px] list-disc">
            <li>{language?.disputeResolution5}</li>
            <li>{language?.disputeResolution6}</li>
            <li>{language?.disputeResolution7}</li>
            <li>{language?.disputeResolution8}</li>
          </ul>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section15Title}</strong>
          </p>
          <p className="mb-6">
            {language?.indemnification1}
          </p>
          <ul className="mb-6 mt-3 grid gap-2 pl-[48px] list-disc">
            <li>
              {language?.indemnification2}
            </li>
            <li>
              {language?.indemnification3}
            </li>
            <li>
              {language?.indemnification4}
            </li>
            <li>
              {language?.indemnification5}
            </li>
          </ul>
          <p className="mb-6">
            {language?.indemnification6}
          </p>
          <p className="mb-6">
            {language?.indemnification7}
          </p>
          <p className="mb-6">
            {language?.indemnification8}
          </p>
          <p className="mb-6">
            {language?.indemnification9}
          </p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section16Title}</strong>
          </p>
          <p className="mb-6">
            {language?.companyLiability1}
          </p>
          <p className="mb-6">
            {language?.companyLiability2}
          </p>
          <ul className="mb-6 mt-3 grid gap-2 pl-[48px] list-disc">
            <li>{language?.companyLiability3}</li>
            <li>{language?.companyLiability4}</li>
            <li>{language?.companyLiability5}</li>
            <li>
              {language?.companyLiability6}
            </li>
          </ul>
          <p className="mb-6">
            {language?.companyLiability7}
          </p>
          <p className="mb-6">
            {language?.companyLiability8}
          </p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section17Title}</strong>
          </p>
          <p className="mb-6">
            {language?.intellectualProperty1}
          </p>
          <p className="mb-6">
            {language?.intellectualProperty2}
          </p>
          <p className="mb-6">
            {language?.intellectualProperty3}
          </p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section18Title}</strong>
          </p>
          <p className="mb-6">
           {language?.privacyPolicy1}
          </p>
          <p className="mb-6">
            {language?.privacyPolicy2}
          </p>
          <p className="mb-6">
            {language?.privacyPolicy3}
          </p>
          <p className="mb-6">
            {language?.privacyPolicy4}
          </p>
        </li>
        <li>
          <p className="mb-6">
            <strong>{language?.section19Title}</strong>
          </p>
          <p className="mb-6">
            {language?.contact1} 
          </p>
          <ul className="mb-6 mt-3 grid gap-2 pl-[48px] list-disc">
            <li>
              {language?.contact2}
            </li>
            <li>
              {language?.contact3}
            </li>
            <li>
              {language?.contact4}
            </li>
            <li>
              {language?.contact5}
            </li>
          </ul>
        </li>
      </ol>
    </div>
  );
};

export default TermsAndCondition;
