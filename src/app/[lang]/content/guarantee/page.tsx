import {Button} from "@/components/ui/Button";
import {Card} from "@/components/ui/Card";
import {CategoriesIcon, ContentIcon, JobDetailIcon} from "@/constants/icons";
import {CheckCircle, DollarSign, Facebook, HeadphonesIcon, Mail, Shield, Users, XCircle,} from "lucide-react";
import Image from "next/image";
import { getAppName } from "@/utils/appConfig";

const Guarantee = () => {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="md:text-left text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">{getAppName()} Guarantee</h1>
            <p className="text-base md:text-xl mb-4">
              Hiring freelancer through {getAppName()} platform gain every steps
              protection.
            </p>
            <p className="text-xl">
              End to end from starting to quality work delivery.
            </p>
          </div>
          <div className=" flex justify-center">
            <div className="w-32 h-32 md:w-80 md:h-80 relative">
              <Shield className="w-full h-full text-white opacity-20"/>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                  <Image
                    src={JobDetailIcon.guarantee}
                    alt="guaranteed"
                    width={500}
                    height={500}
                    className="w-16 h-16 md:w-24 md:h-24"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-primary mb-16">
            &quot;{getAppName()} Guarantee&quot; every steps hiring protection
          </h2>

          <div className="grid md:grid-cols-3 gap-8 text-text-primary">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary"/>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-text-primary">
                Verified freelancers
              </h3>
              <p className="text-gray-600">
                Standard verification for ID card, contact information, and
                portfolio
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-primary"/>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-text-primary">
                Guarantee money back in case no delivery
              </h3>
              <p className="text-gray-600">
                With escrow money protection system, money will be transferred
                to freelancer only when the final delivery is approved.
                Guarantee work delivery
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HeadphonesIcon className="w-8 h-8 text-primary"/>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-text-primary">
                Support team ready to serve customer and freelancer
              </h3>
              <p className="text-gray-600">
                Dispute and support team is ready to help in case of conflict.
                Investigate and judge the case fairly for both customer and
                freelancer
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-12">
            Terms and condition for Guarantee program. More confident in hiring.
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6 text-green-600">
                Protection
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"/>
                  <p className="text-gray-700">
                    Freelancer doesn&apos;t comply with contract described in
                    quotation
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"/>
                  <p className="text-gray-700">
                    The final work doesn&apos;t qualify as freelancer advertised in
                    the product or by agreement
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"/>
                  <p className="text-gray-700">
                    Freelancer disappear or cannot be contact
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"/>
                  <p className="text-gray-700">
                    Final has not been manually approved or auto approved in the
                    {getAppName()} Platform
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6 text-red-600">
                End of Protection
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"/>
                  <p className="text-gray-700">
                    Customer violate hiring contract described in quotation
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"/>
                  <p className="text-gray-700">
                    Customer didn&apos;t hire and payment through the {getAppName()}
                    Platform
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0"/>
                  <p className="text-gray-700">
                    Final has been manually approved or auto approved in the
                    {getAppName()} Platform
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="mt-8 p-6 bg-blue-50">
            <div className="flex items-center space-x-4">
              <Image
                src={CategoriesIcon.guaranteed}
                alt="guaranteed"
                width={500}
                height={500}
                className="w-16 h-16"
              />
              <div>
                <h3 className="text-xl font-semibold mb-2 text-text-primary">
                  Tell us more!
                </h3>
                <p className="text-gray-700 mb-2">
                  Additional feedback can be done after the final work has been
                  approved. Contact customer support when you found the hiring
                  problem or would like to give suggestion for improvement.
                </p>
                <a href="#" className="text-primary underline">
                  Contact Customer Support
                </a>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary mb-4">
            Confident in hiring with {getAppName()}. Freedom to choose to accept final
            work or request money back.
          </h2>

          <div className="flex justify-center mb-12">
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-primary">
                How to give review after approved the final work?
              </span>
              <div className="flex-1 h-1 bg-gray-300"></div>
              <span className="text-gray-600">
                For the non-approved work, how to initiate the dispute
              </span>
            </div>
          </div>

          <div className="space-y-16">
            {[1, 2, 3, 4].map((step, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row items-start gap-8"
              >
                <Image
                  src={
                    step === 1
                      ? ContentIcon.step1
                      : step === 2
                        ? ContentIcon.step2
                        : step === 3
                          ? ContentIcon.step3
                          : ContentIcon.step4
                  }
                  alt={`Step ${step}`}
                  width={320}
                  height={213}
                  className="rounded-lg flex-shrink-0"
                />

                <div>
                  <h3 className="text-xl font-semibold mb-3 text-text-primary">
                    {step === 1 && '1. Click "Evaluate" button in chat screen'}
                    {step === 2 &&
                      "2. Evaluate by giving score and comment regarding the final work"}
                    {step === 3 && "3. More confident with secret review"}
                    {step === 4 &&
                      "4. Give a score of how much would you like to recommend "+getAppName()+" to others"}
                  </h3>
                  <p className="text-gray-600">
                    {step === 1 &&
                      'Click button "Evaluate" in the bottom of the chat screen after you approved the final work. The evaluation form will be displayed.'}
                    {step === 2 &&
                      "Evaluate skill, quality, satisfaction, and comments to freelancer's work. This will be valuable information to other customer. The information in the first review page will be accumulative and display to freelance profile and product."}
                    {step === 3 &&
                      "Let us know your expectation with freelancer's work and service quality. No one will be able to access this secret review except key person at "+getAppName()+". This is critical for us to improve quality of our freelancer to serve you to the most satisfaction."}
                    {step === 4 &&
                      "You can share us the issue or problem you found while using the platform. You can also give comments and suggestions to the "+getAppName()+" team. We value all of your feedback and take it seriously for improvement."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Contact Customer Support
          </h2>
          <p className="text-gray-600 mb-8">
            Your problem is our priority. You can contact our customer support
            by the following channels.
          </p>

          <div className="flex justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Facebook className="w-8 h-8 text-primary"/>
              </div>
              <div className="text-sm font-medium text-text-primary">
                Facebook
              </div>
              <div className="text-sm text-gray-600 text-text-primary">
                Messenger
              </div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Mail className="w-8 h-8 text-primary"/>
              </div>
              <div className="text-sm font-medium text-text-primary">
                support@fastwork.co
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-8">
            <p>
              Our team is ready to serve you every day, Monday-Friday from 9:30
              - 22:00
            </p>
            <p>Saturday-Sunday, public holidays from 10:00 - 19:00</p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary mb-8">
            Start hiring today with ultimate protection
          </h2>
          <Button className="bg-primary hover:bg-[#063a68] text-white px-8 py-3">
            Search for freelancer
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Guarantee;
