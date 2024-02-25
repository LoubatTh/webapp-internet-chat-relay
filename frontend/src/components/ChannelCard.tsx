import { Card, CardContent, CardTitle } from "./ui/ui/card";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { getAccessToken, getIdentity } from "../lib/utils";
import { fetchApi } from "../lib/api";
import { Link } from "react-router-dom";
import React from "react";

type ChannelCardProps = {
  channelId: string;
  name: string;
  membersCount: number;
  isJoined: boolean;
};

const ChannelCard = ({
  channelId,
  name,
  membersCount,
  isJoined,
}: ChannelCardProps) => {
  const joinChannel = async () => {
    const identity = getIdentity();
    const token = getAccessToken();

    await fetchApi(
      "POST",
      `${token ? "users" : "guests"}/${identity}/channels`,
      {
        channelId,
      }
    )
      .then((data) => {
        return data ? (
          <Link to={`/channels/${channelId}`}></Link>
        ) : (
          console.error("Failed to join channel")
        );
      })
      .catch((error: Error) => {
        console.error(error.message);
      });
  };

  return (
    <React.Fragment>
      <Card
        className={`grid grid-cols-3 ${
          isJoined
            ? "bg-primary text-primary-foreground border-primary-foreground"
            : "bg-background text-foreground"
        }`}
      >
        <CardTitle className="text-start self-center ml-3">{name}</CardTitle>
        <CardContent className="text-end self-center mr-3">
          {membersCount > 1
            ? `${membersCount} members`
            : `${membersCount} member`}
        </CardContent>
        {isJoined ? (
          <CardContent className="flex flex-row justify-end text-center self-end mr-3 hover:font-semibold">
            <Link to={`channels/${channelId}`}>Already joined</Link>
          </CardContent>
        ) : (
          <CardContent
            className="flex flex-row justify-end text-center self-end mr-3 hover:font-semibold"
            onClick={() => joinChannel()}
          >
            join <OpenInNewWindowIcon className="self-center ml-2 h-4 w-4" />
          </CardContent>
        )}
      </Card>
    </React.Fragment>
  );
};

export default ChannelCard;
