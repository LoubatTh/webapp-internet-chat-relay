import useSidePanelStore from "../store/sidePanelStore";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./ui/ui/navigation-menu";
import { Link } from "react-router-dom";

const Header = () => {
  const [openSidePanel, setOpenSidePanel] = useSidePanelStore((state) => [
    state.openSidePanel,
    state.setOpenSidePanel,
  ]);
  const HandleOpenSidePanel = () => {
    setOpenSidePanel(!openSidePanel);
  };
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to={"channels"}>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Channels
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to={"messages"} onClick={HandleOpenSidePanel}>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Messages
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to={"/"} onClick={HandleOpenSidePanel}>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Welcome
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Header;
