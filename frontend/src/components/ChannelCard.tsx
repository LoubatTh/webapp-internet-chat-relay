import { Card, CardContent, CardTitle } from "./ui/ui/card";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { getIdentity, isUser } from "../lib/utils";
import { fetchApi, fetchApiAuth } from "../lib/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "./ui/ui/use-toast";

const getChannel = async (userId: string, channelId: string) => {
  const response = isUser()
    ? await fetchApiAuth("POST", `users/${userId}/channels`, {
        channelId,
      })
    : await fetchApi("POST", `guests/${userId}/channels`, {
        channelId,
      });
  return response;
};

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
  const { toast } = useToast();
  const userId = getIdentity();
  const navigate = useNavigate();

  const joinChannel = async () => {
    if (!userId) return;
    const response = await getChannel(userId, channelId);
    const data = response.data;
    if (response.status === 200) {
      navigate(`/channels/${data.channel._id}`);
    } else {
      toast({
        variant: "error",
        description: `${data.message}`,
      });
    }
  };

  return (
    <>
      <Card
        onClick={() => joinChannel()}
        className={`grid grid-cols-3 ${
          isJoined
            ? "bg-primary text-primary-foreground border-primary-foreground"
            : "bg-background text-foreground hover:bg-secondary border-secondary-foreground cursor-pointer"
        }`}
      >
        <CardTitle className="text-start self-center ml-3">{name}</CardTitle>
        <CardContent className="text-end self-center mr-3">
          {membersCount > 1
            ? `${membersCount} members`
            : `${membersCount} member`}
        </CardContent>
        {isJoined ? (
          <CardContent className="flex flex-row justify-end text-center self-end mr-3">
            Already joined
          </CardContent>
        ) : (
          <CardContent className="flex flex-row justify-end text-center self-end mr-3 hover:font-semibold">
            join <OpenInNewWindowIcon className="self-center ml-2 h-4 w-4" />
          </CardContent>
        )}
      </Card>
    </>
  );
};

export default ChannelCard;
