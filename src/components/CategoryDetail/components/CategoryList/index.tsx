import Link from "next/link";

type CategoryItem = {
  title: string;
  new?: boolean;
};

type CategoryListProps = {
  title: string;
  items: CategoryItem[];
};

const CategoryList: React.FC<CategoryListProps> = ({ title, items }) => {
  return (
    <div className="min-w-[12rem] max-w-[12rem]">
      <div className="px-2 font-semibold m-0 p-0">{title}</div>
      <ul className="mt-2 text-[0.875rem] p-0 m-0 list-none ">
        {items.map((item, index) => (
          <li
            key={index}
            className="hover:bg-[#e3edfd] text-text_secondary hover:text-third"
          >
            <Link href="#" className="block px-2 py-[6px] rounded-[4px] font-sans">
              <span>{item.title}</span>
              {item.new && (
                <div className="inline-block bg-third text-white text-[0.6875rem] rounded-[4px] font-bold px-1 py-[1px] ml-1">
                  New
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryList;
