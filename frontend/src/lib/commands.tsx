import { fetchApi } from "./api";
import { getIdentity, getAccessToken } from "./utils";
import { ChannelType } from "./type";

const randomId = () => {
  return Math.floor(Math.random() * 1000).toString();
};

function getUserType() {
  const userType = getAccessToken()
    ? "users"
    : "guests"
  return userType;
};

const getAllChannel = async (): Promise<ChannelType[]> => {
  const data = await fetchApi<ChannelType[]>("GET", "channels?visibility=public");
  return data.data;
};

const changeNick = async (id: string, name: string) => {
  const userType = getUserType();
  try {
    const guest = await fetch(`/api/${userType}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: name })
    });
    if (guest.status !== 200) {
      return "Pseudo déjà pris. Veuillez essayer un autre pseudo."
    } else {
      return `Pseudo remplacé avec succès par ${name}.`
    }
  } catch (error) {
    console.log(error);
  }
};

const searchChannel = async (name: string): Promise<ChannelType[]> => {
  const data = await fetchApi<ChannelType[]>("GET", `channels?name=${name}&search=true&visibility=public`);
  return data.data;
}

const joinChannel = async (nameChannel: string) => {
  const userType = getUserType();
  const user = getIdentity();

  const channel = await fetchApi("GET", `channels?name=${nameChannel}`);

  if (channel.status !== 200) {
    return "Channel non trouvé."
  }

  console.log(channel)
  const channelId = channel.data[0]._id;

  try {
    const post = await fetch(`/api/${userType}/${user}/channels`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelId })
    });

    if (post.status !== 200) {
      return "Impossible de rejoindre le channel. Veuillez réessayer."
    } else {
      return "Channel rejoins avec succès.";
    }
  } catch (error) {
    console.log(error);
  }
};

const getChannelInformations = async (id: string): Promise<ChannelType> => {
  const data = fetchApi<ChannelType>("GET", `channels/${id}`)
  return data;
};

const postChannel = async (
  body: { name: string; visibility: string; members: string[]; owner: string }
) => {
  const data = await fetch(`/api/channels`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  if (data.status !== 201) {
    return "Impossible de créer le channel. Veuillez réessayer."
  } else {
    return "Channel créé avec succès.";
  }
};

const deleteChannel = async (nameChannel: string) => {
  const channel = await fetchApi("GET", `channels?name=${nameChannel}`);

  if (channel.status !== 200) {
    return "Channel non trouvé."
  }

  const channelId = channel.data[0]._id;

  const response = await fetchApi("DELETE", `channels/${channelId}`);
  if (response.status !== 200) {
    return "Impossible de supprimer le channel. Veuillez réessayer."
  } else {
    return "Channel supprimé avec succès !"
  }
};

const getMembers = async (channelId: string): Promise<string[]> => {
  const members = await fetchApi<ChannelType>("GET", `channels/${channelId}?name=true`);
  return members.data.members;
};

const removeMember = async (channelname: string, memberId: string) => {
  const userType = getUserType();
  const searchchannel = await fetchApi("GET", `channels?name=${channelname}&search=true`);

  if (searchchannel.data.length === 0) {
    return "Impossible de trouver le channel. Vérifier son nom."
  }
  const channelId = (await searchchannel).data[0]._id
  const response = await fetch(`/api/${userType}/${memberId}/channels/${channelId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (response.status !== 200) {
    return "Impossible de supprimer le membre. Veuillez réessayer."
  } else {
    return "Vous avez bien quitté le channel.";
  }
};

const sendMessage = async (body: string) => {
  const usernameUser = body.split(" ")[0];
  const msgtxt = body.split(" ")[1];
  const otherUserId = getIdentity();

  const msgData = ({
    members: [otherUserId]
  });

  const data = await fetchApi("POST", `pmsgs?name=${usernameUser}`,
    msgData);

  console.log(data.status)
  if (data.status !== 201) {
    return "Erreur lors de l'envoie du message."
  }

  const msgcontent = ({
    text: msgtxt,
    authorId: otherUserId
  })
  const msg = await fetchApi("POST", `messages/${data.data.pmsg._id}`, msgcontent);

  if (msg.status !== 201) {
    return "Erreur lors de la création du messages."
  }
  return `Message privé envoyer avec succès. Rendez-vous dans l'onglet "Messages".`
}

export const onCommand = async (command: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, args: any, currentchannelId: string) => {

  switch (command) {
    case 'help':
      // Display help message
      return [
        {
          channelId: 'system',
          _id: `system-message-help-${randomId()}`,
          author: 'System',
          text: (
            <>
              Voici la liste des commandes disponibles : <br />
              - <strong>/nick <i>[nickname]</i></strong> : Définit le pseudo de l'utilisateur sur le serveur. <br />
              - <strong>/list <i>[string]</i></strong> : Liste les canaux disponibles du serveur. Si une chaîne est spécifiée, affiche uniquement ceux dont le nom contient la chaîne. <br />
              - <strong>/create <i>[channel]</i></strong> : Crée un canal avec le nom spécifié. <br />
              - <strong>/delete <i>[channel]</i></strong>: Supprime le canal avec le nom spécifié. <br />
              - <strong>/join <i>[channel]</i></strong>: Rejoint le canal spécifié. <br />
              - <strong>/quit <i>[channel]</i></strong>: Quitte le canal spécifié. <br />
              - <strong>/users</strong>: Liste les utilisateurs actuellement dans le canal. <br />
              - <strong>/msg <i>[nickname] [message]</i></strong>: Envoie un message privé au pseudo spécifié. <br />
              - <strong>message</strong>: Envoie un message à tous les utilisateurs sur le canal.
            </>
          ),
        },
      ];
    case 'nick':
      // Change user nickname
      if (!args) return [
        {
          channelId: 'system',
          _id: `system-message-help-${randomId()}`,
          author: 'System',
          text: (
            <>
              Veuillez spécifier un pseudo. <br />
              Exemple : <strong>/nick <i>[nickname]</i></strong>
            </>
          ),
        },
      ];
      const change = await changeNick(getIdentity() || '0000', args)
      return [
        {
          channelId: 'system',
          _id: `system-message-help-${randomId()}`,
          author: 'System',
          text: (
            <>
              {change}
            </>
          ),
        },
      ];
    case 'list':
      // List available channels
      if (args) {
        const channels = searchChannel(args);
        return [
          {
            channelId: 'system',
            _id: `system-message-help-${randomId()}`,
            author: 'System',
            username: 'System',
            text: (
              <>
                <div>
                  Voici la liste des canaux disponibles contenant la chaîne <strong>{args}</strong>: <br />
                  {(await channels).map((channel) => (
                    <div key={channel._id}>
                      <strong>#{channel.name}</strong> - <i>{channel._id}</i><br />
                    </div>
                  ))}
                </div>
              </>
            ),
          },
        ];
      }
      const channels = getAllChannel();
      return [
        {
          channelId: 'system',
          _id: `system-message-help-${randomId()}`,
          author: 'System',
          username: 'System',
          text: (
            <>
              <div>
                Voici la liste des canaux disponibles : <br />
                {(await channels).map((channel) => (
                  <div key={channel._id}>
                    <strong>#{channel.name}</strong> - <i>{channel._id}</i><br />
                  </div>
                ))}
              </div>
            </>
          ),
        },
      ];
    case 'create':
      // Create a new channel
      if (!args) return [
        {
          channelId: 'system',
          _id: `system-message-help-${randomId()}`,
          author: 'System',
          text: (
            <>
              Veuillez spécifier un nom de canal. <br />
              Exemple : <strong>/create <i>[channel]</i></strong>
            </>
          ),
        },
      ]
      const idUser = getIdentity() || '0000';
      const post = await postChannel({ name: args, visibility: 'public', members: [idUser], owner: idUser });
      return [
        {
          channelId: 'system',
          _id: `system-message-help-${randomId()}`,
          author: 'System',
          text: (
            <>
              {post}
            </>
          ),
        },
      ];
    case 'delete':
      // Delete a channel
      if (!args) return [
        {
          channelId: 'system',
          _id: `system-message-help-${randomId()}`,
          author: 'System',
          text: (
            <>
              Veuillez spécifier un ID de canal. <br />
              Exemple : <strong>/delete <i>[channel]</i></strong><br />
              <i>Pour connaître les IDs des channels, <strong>/list</strong>.</i>
            </>
          ),
        },
      ];

      const response = await deleteChannel(args);

      return [
        {
          channelId: 'system',
          _id: `system-message-help-${randomId()}`,
          author: 'System',
          text: (
            <>
              {response}
            </>
          ),
        },
      ];
    case 'join':
      // Join a channel
      if (!args) return [
        {
          channelId: 'system',
          _id: `system-message-help-${randomId()}`,
          author: 'System',
          text: (
            <>
              Veuillez spécifier un nom de canal. <br />
              Exemple : <strong>/join <i>[channel]</i></strong>
            </>
          ),
        },
      ];
      const join = await joinChannel(args)
      return [
        {
          channelId: 'system',
          _id: `system-message-help-${randomId()}`,
          author: 'System',
          text: (
            <>
              {join}
            </>
          ),
        },
      ];
    case 'quit':
      // Quit a channel
      if (!args) return [
        {
          channelId: 'system',
          _id: `system-message-help-${randomId()}`,
          author: 'System',
          text: (
            <>
              Veuillez spécifier un nom de canal. <br />
              Exemple : <strong>/quit <i>[channel]</i></strong>
            </>
          ),
        },
      ];

      const del = await removeMember(args, getIdentity());
      return [
        {
          channelId: 'system',
          _id: `system-message-help-${randomId()}`,
          author: 'System',
          text: (
            <>
              {del}
            </>
          ),
        },
      ];
    case 'users':
      // List users in the channel
      const membersChannel = await getMembers(currentchannelId);
      console.log("azer", currentchannelId)

      return [
        {
          channelId: 'system',
          _id: `system-message-help-${randomId()}`,
          author: 'System',
          text: (
            <>
              Voici la liste des membres dans le canal : <br />

              {(await membersChannel).map((member) => (
                <strong key={member}>- {member}<br /></strong>
              ))}
            </>
          ),
        },
      ];
    case 'msg':
      // Send a private message
      if (!args) return [
        {
          channelId: 'system',
          _id: `system-message-help-${randomId()}`,
          author: 'System',
          text: (
            <>
              Veuillez spécifier un pseudo et un message. <br />
              Exemple : <strong>/msg <i>[nickname] [message]</i></strong>
            </>
          ),
        },
      ];
      const message = await sendMessage(args);
      return [
        {
          channelId: 'system',
          _id: `system-message-help-${randomId()}`,
          author: 'System',
          text: (
            <>
              {message}
            </>
          ),
        },
      ];
    case 'informations':
      const data = await getChannelInformations(currentchannelId);
      const isOwner = data.owner === getIdentity();
      const owner = isOwner
        ? "Vous êtes le owner du channel."
        : "Vous n'êtes pas le owner du channel, vous avez donc pas de permissions."

      return [
        {
          channelId: 'system',
          _id: `system-message-help-${randomId()}`,
          author: 'System',
          text: (
            <>
              Le nom du channel est : <strong>{data.data.name}</strong><br />
              L'id de ce channel est : <strong>{currentchannelId}</strong>.<br />
              {owner}
            </>
          ),
        },
      ];
    default:
      // If command is not recognized
      return [
        {
          channelId: 'system',
          _id: `system-message-notfound-${randomId()}`,
          author: 'System',
          length: 0,
          text: (
            <>
              Commande <strong><i>/{command}</i></strong> non reconnue.<br />
              Tapez <strong>/help</strong> pour afficher la liste des commandes disponibles.
            </>
          ),
        },
      ];
  }
};