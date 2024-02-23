import { Fragment } from "react";
import { Card, CardContent, CardTitle } from "./ui/ui/card";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { getAccessToken, getIdentity } from "../lib/utils";
import { fetchApi } from "../lib/api";
import { redirect } from "react-router-dom";

type ChannelCardProps = {
  id: number;
  channelId: string;
  name: string;
  membersCount: number;
};

const ChannelCard = ({
  id,
  channelId,
  name,
  membersCount,
}: ChannelCardProps) => {
  const joinChannel = async () => {
    const identity = getIdentity();
    const token = getAccessToken();
    let isGuest: boolean = false;

    if (!token) {
      isGuest = true;
    }

    await fetchApi(
      "POST",
      `${isGuest ? "guests" : "users"}/${identity}/channels`,
      {
        channelId,
      }
    )
      .then((data) => {
        return data
          ? redirect(`/channels/${channelId}`)
          : console.log("Channel not joined");
      })
      .catch((error: Error) => {
        console.error(error.message);
      });
  };

  return (
    <Fragment key={id}>
      <Card className="grid grid-cols-3">
        <CardTitle className="text-start self-center ml-3">{name}</CardTitle>
        <CardContent className="text-end self-center mr-3">
          {membersCount > 1
            ? `${membersCount} members`
            : `${membersCount} member`}
        </CardContent>
        <CardContent
          className="flex flex-row justify-end text-center self-end mr-3 hover:font-semibold"
          onClick={() => joinChannel()}
        >
          join <OpenInNewWindowIcon className="self-center ml-2 h-4 w-4" />
        </CardContent>
      </Card>
    </Fragment>
  );
};

export default ChannelCard;
