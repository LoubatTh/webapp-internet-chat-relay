import React, { useEffect } from "react";
import { PmsgType } from "../../lib/type";
import { ScrollArea } from "../ui/ui/scroll-area";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchApi } from "../../lib/api";
import { useToast } from "../ui/ui/use-toast";
import { getIdentity, isUser } from "../../lib/utils";
import usePmsgStorageStore from "../../store/pmsgStorage";
import Pmsg from "./PrivateMessagesDisplay";

type PmsgTypeResponse = {
  data: PmsgType[];
  status: number;
};

const getPM = async (): Promise<PmsgTypeResponse> => {
  const response = await fetchApi<PmsgType[]>(
    "GET",
    `${isUser() ? "users" : "guests"}/${getIdentity()}/pmsgs`
  );
  return response;
};

const PrivateMessagesSidePannel = () => {
  const { toast } = useToast();
  const { pmsgs, setPmsgs } = usePmsgStorageStore();
  const navigate = useNavigate();
  const { channelId } = useParams();

  const getPmsg = async () => {
    const response = await getPM();
    const data = response.data;
    if (response.status === 200) {
      if (!data.find((pmsg) => pmsg._id === channelId)) {
        navigate("/messages");
      }
      setPmsgs(data);
    } else {
      toast({
        variant: "error",
        description: `${data.message}`,
      });
    }
  };

  const getPmsgName = (pmsg: PmsgType) => {
    const identity = getIdentity();
    const usernames = pmsg.name.split("-");
    let index = 0;

    if (identity) {
      const checkUserIndex = pmsg.members.indexOf(identity);
      index = checkUserIndex === 0 ? 1 : 0;
    }

    return usernames[index];
  };

  useEffect(() => {
    getPmsg();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <ScrollArea className="h-[calc(100%-50px)]">
        {pmsgs.length > 0 &&
          pmsgs.map((pmsg) => (
            <React.Fragment key={pmsg._id}>
              <Link to={`/messages/${pmsg._id}`}>
                <Pmsg id={pmsg._id} name={getPmsgName(pmsg)} />
              </Link>
            </React.Fragment>
          ))}
      </ScrollArea>
    </>
  );
};

export default PrivateMessagesSidePannel;
