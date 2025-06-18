import { LuLayoutList } from "react-icons/lu";
import { HiOutlineColorSwatch } from "react-icons/hi";
import { TbFrame } from "react-icons/tb";
import { AiOutlineProduct } from "react-icons/ai";
import { RiUserCommunityLine } from "react-icons/ri";

export const SIDEBAR = [
  {
    name: "Frames",
    key: "frames",
    icon: TbFrame,
  },
  {
    name: "Appearance",
    key: "themes",
    icon: HiOutlineColorSwatch,
  },
  {
    name: "Company",
    key: "companydetails",
    icon: LuLayoutList,
  },
  {
    name: "Product",
    key: "product",
    icon: AiOutlineProduct,
  },
  {
    name: "Political",
    key: "political",
    icon: RiUserCommunityLine,
  },
];
