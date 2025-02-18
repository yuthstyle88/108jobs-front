import Architecture from "./Architecture";
import Business from "./Business";
import GraphicDesign from "./GraphicDesign";
import ImageAndSound from "./Image";
import Lifestyle from "./Lifestyle";
import Marketing from "./Marketing";
import PopularType from "./PopularType";
import Website from "./Website";
import Write from "./Write";


const SubMenu = () => {
  return (
    <div className="shadow-categoryMenu relative">
      <nav className="flex justify-center px-2 h-[3.5rem] text-text_primary bg-white">
        <div className="grid grid-flow-col gap-x-3 cursor-pointer">
          <PopularType />
          <GraphicDesign />
          <Architecture />
          <Website />
          <Marketing/>
          <Write/>
          <ImageAndSound/>
          <Business/>
          <Lifestyle/>
        </div>
      </nav>
    </div>
  );
};

export default SubMenu;
