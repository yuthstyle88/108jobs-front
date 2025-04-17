import { ProfileImage } from "@/constants/images";
import { faEdit, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

const UserProfile = () => {
  return (
    <main>
      <div className="relative bg-primary h-[200px]"></div>
      <div className="grid grid-cols-[1fr_1216px_1fr] w-full pb-16">
        <div className="col-start-2 col-end-3 gap-x-[4rem] flex items-start ">
          <aside>
            <div className="w-[320px] mt-[-128px] relative py-8 border-[0.0625rem] border-border_primary bg-white rounded-[0.25rem]">
              <div className="flex items-center justify-center">
                <Image
                  src={ProfileImage.avatar}
                  alt="avatar"
                  className="rounded-full w-[175px] object-cover"
                />
              </div>
              <p className="text-[28px] font-medium text-text_primary text-center pt-2">
                uykpfzno
              </p>
              <div className="flex items-center justify-center pt-2">
                {[1, 2, 3, 4, 5].map((_, index) => (
                  <FontAwesomeIcon
                    icon={faStar}
                    key={index}
                    className="text-[14px] text-[#D6DAE1] "
                  />
                ))}
              </div>
              <div className="flex flex-row justify-between pt-10 gap-4 px-6">
                <p className="text-[14px] text-text_primary">
                  Become a member when
                </p>
                <p className="text-[14px] text-third">February 15, 2025</p>
              </div>
              <div>
                <FontAwesomeIcon
                  icon={faEdit}
                  className="text-[18px] text-text_secondary absolute top-5 right-3"
                />
              </div>
            </div>
          </aside>
          <section className="w-full">
            <h2 className="py-[3rem] text-[28px] font-medium text-text_primary w-full">
              The work of uykpfzno
            </h2>
            <div className="grid grid-cols-[1fr_1fr_1fr] border-b-[2px] border-b-border_primary">
              <div className="relative border-b-2 border-border_primary hover:text-third duration-150 flex justify-center items-center cursor-pointer px-1 py-3 font-bold text-third  after:absolute after:bottom-[-3px] after:h-[2px] after:w-full after:bg-third">
                Reviews from freelancers
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default UserProfile;
