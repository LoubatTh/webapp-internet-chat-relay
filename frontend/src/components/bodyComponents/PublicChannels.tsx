import { useEffect, useMemo, useState } from "react";
import { fetchApi } from "../../lib/api";
import { ChannelType } from "../../lib/type";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../ui/ui/pagination";

import ChannelCard from "../ChannelCard";

const PublicChannel = () => {
  const [publicChannels, setPublicChannels] = useState<ChannelType[]>([]);
  const [page, setPage] = useState(1);

  const pages = Math.ceil(publicChannels.length / 15);

  const items = useMemo(() => {
    const start = (page - 1) * 15;
    const end = start + 15;

    return publicChannels.slice(start, end);
  }, [page, publicChannels]);

  const fetchPublicChannels = async (): Promise<ChannelType[]> => {
    const data = await fetchApi<ChannelType[]>(
      "GET",
      `channels?visibility=public`
    );
    return data;
  };

  useEffect(() => {
    fetchPublicChannels()
      .then((data) => {
        setPublicChannels(data);
      })
      .catch((error: Error) => {
        console.error(error.message);
      });
  }, []);

  return (
    <>
      <p className="text-2xl my-4">Public Channels</p>
      <div className="container grid gap-3 mb-5">
        {items.map((channel, index) => (
          <ChannelCard
            id={index}
            channelId={channel._id}
            name={channel.name}
            membersCount={channel.members.length}
          />
        ))}
        {pages > 1 ? (
          <>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage(page - 1 >= 1 ? page - 1 : page)}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage(page + 1 <= pages ? page + 1 : page)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        ) : null}
      </div>
    </>
  );
};

export default PublicChannel;
