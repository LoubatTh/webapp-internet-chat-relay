import React, { useState } from "react";
import { cn } from "../lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "./ui/ui/navigation-menu";
import { fetchApi } from "../lib/api";
import { getIdentity } from "../lib/localstorage";

const joinChannel = async (channelId: string, userId: string) => {
  const response: Response = await fetchApi(
    "POST",
    `users/${userId}/channels`,
    { channelId }
  );
  console.log("response", response);
  if (response.status === 200) {
    console.log("User joined channel");
  } else {
    console.log("User not joined channel", response.status);
  }
};

const Header = () => {
  const channelsExist = window.location.href.includes("channels");
  const messagesExist = window.location.href.includes("messages");

  return (
    <NavigationMenu className="px-2 gap-2">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            href="/channels"
            active={channelsExist}
          >
            Channels
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            className={navigationMenuTriggerStyle()}
            href="/messages"
            active={messagesExist}
          >
            Messages
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Header;

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
