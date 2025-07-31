import Advise from "./Advise";
import GraphicDesign from "./GraphicDesign";
import ImageAndSound from "./Image";
import Lifestyle from "./Lifestyle";
import Marketing from "./Marketing";
import PopularType from "./PopularType";
import Website from "./Website";
import Write from "./Write";


const SubMenu = () => {
  return (
    <div className="shadow-category-menu relative md:pt-12 lg:pt-0">
      <nav className="flex justify-center px-2 h-[3.5rem] text-text-primary bg-white">
        <div className="grid grid-flow-col gap-x-3 cursor-pointer">
          <PopularType/>
          <GraphicDesign/>
          <Website/>
          <Marketing/>
          <Write/>
          <ImageAndSound/>
          <Advise/>
          <Lifestyle/>
        </div>
      </nav>
    </div>
  );
};

export default SubMenu;
