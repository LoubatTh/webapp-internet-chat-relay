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

const createChannel = async (channelName: string, user: string) => {
  const response: Response = await fetchApi("POST", "channels", {
    name: channelName,
    members: [user],
    visibility: "public",
  });
  if (response.status === 200) {
    console.log("Channel created");
  } else {
    console.log("Channel not created");
  }
};

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
  const [channelSelected, setChannelSelected] = useState<string>("");
  const [channelCreation, setChannelCreation] = useState<string>("");
  const channelsExist = window.location.href.includes("channels");
  const messagesExist = window.location.href.includes("messages");

  const handleChannelSelectValue = (event) => {
    setChannelSelected(event.target.value);
  };

  const handleChannelCreationValue = (event) => {
    setChannelCreation(event.target.value);
  };

  const handleCreateChannel = () => {
    const user = getIdentity();
    if (!user) {
      return;
    }
    createChannel(channelCreation, user);
  };

  const handleJoinChannel = () => {
    const user = getIdentity();
    if (!user) {
      return;
    }
    joinChannel(channelSelected, user);
  };

  const components: { title: string; href: string; description: string }[] = [
    {
      title: "Create a new channel",
      href: "/channels/create",
      description: "Create a new channel",
    },
    {
      title: "Delete a channel",
      href: "/channels/delete",
      description: "Create a new channel",
    },
    {
      title: "Join a Channel",
      href: "/channels/join",
      description: "Create a new channel",
    },
    {
      title: "Quit a channel",
      href: "/channels/quit",
      description: "Create a new channel",
    },
  ];

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
          {/* <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent> */}
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
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink className={navigationMenuTriggerStyle()} href="/">
            Welcome
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
      <div>
        <input
          type="text"
          value={channelSelected}
          onChange={handleChannelSelectValue}
        />
        <button onClick={handleJoinChannel}>Join</button>
      </div>
      <div>
        <input
          type="text"
          value={channelCreation}
          onChange={handleChannelCreationValue}
        />
        <button onClick={handleCreateChannel}>Create</button>
      </div>
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
