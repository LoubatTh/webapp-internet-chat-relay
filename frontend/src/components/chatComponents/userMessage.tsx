type UserMessageProps = {
  username: string;
  text: string | JSX.Element;
};

const UserMessage = ({ username, text }: UserMessageProps) => {
  return (
    <div className="flex flex-col my-4 px-4 w-4/5 float-right">
      <h3 className="mb-2">{username}</h3>
      <p className="border-sm rounded-md p-2 bg-primary text-primary-foreground w-fit self-end">
        {text}
      </p>
    </div>
  );
};

export default UserMessage;
