type OtherUserMessageProps = {
  username: string;
  text: string | JSX.Element;
};

const OtherUserMessage = ({ username, text }: OtherUserMessageProps) => {
  return (
    <div className="flex flex-col mt-2 px-4 w-4/5">
      <h3 className="mb-2">{username}</h3>
      <div className="border-sm rounded-md p-2 bg-foreground text-primary-foreground w-fit">
        {text}
      </div>
    </div>
  );
};

export default OtherUserMessage;
