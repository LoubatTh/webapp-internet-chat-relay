import { fetchApi } from "./api";
import { getIdentity, getAccessToken } from "./utils";
import { ChannelPostType, ChannelType, GuestType, UserType, UserTypeUsername } from "./type";

const randomId = () => {
  return Math.floor(Math.random() * 1000).toString();
};

function getUserType() {
  if (getAccessToken()) {
    return "users";
  } else {
    return "guests";
  }
}
const getAllChannel = async (): Promise<ChannelType[]> => {
  const data = await fetchApi<ChannelType[]>("GET", "channels?visibility=public");
  return data;
};

const changeNick = async (id: string, name: string) => {
  const userType = getUserType();
  try {
    const guest = await fetch(`/api/${userType}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: name })
    });
    if (guest.status !== 400) {
      return `Pseudo remplacé avec succès par ${name}.`
    } else {
      return "Pseudo déjà pris. Veuillez essayer un autre pseudo."
    }
  } catch (error) {
    console.log(error);
  }
};

const getChannelInformations = async (id: string): Promise<ChannelType> => {
  const data = await fetchApi<ChannelType>("GET", `channels/${id}`);
  return data;
}

const postChannel = async (
  body: { name: string; visibility: string; members: string[]; owner: string }
): Promise<ChannelPostType> => {
  const data = await fetchApi<ChannelPostType>(
    "POST",
    `channels`,
    body
  );
  return data;
};

const getIdChannelByName = async (name: string): Promise<ChannelType> => {
  const data = await fetchApi<ChannelType>("GET", `channels/n/${name}`);
  return data;
}

const deleteChannel = async (id: string) => {
  await fetchApi("DELETE", `channels/${id}`);
};

const getAllChannelNames = async (): Promise<ChannelType[]> => {
  try {
    const channels = await getAllChannel();
    const names = channels.map((channel) => channel);
    return names;
  } catch (error) {
    console.error("Erreur lors de la récupération des noms de chaînes :", error);
    throw error;
  }
};


const getMembers = async (channelId: string): Promise<string[]> => {
  const members = await fetchApi<ChannelType>("GET", `channels/${channelId}?name=true`);
  return members.members;
}

export const onCommand = async (command: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, args: any, channelId: string) => {
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
      const channels = getAllChannel();

      console.log(channels);
      return [
        {
          channelId: 'system',
          _id: `system-message-help-${randomId()}`,
          author: 'System',
          username: 'System',
          text: (
            <>
              Voici la liste des canaux disponibles : <br />

              {(await channels).map((channel) => (
                <div key={channel._id}>
                  <strong key={channel._id}>#{channel.name}</strong> - {channel._id}<br />
                </div>
              ))}
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
      try {
        const idUser = getIdentity() || '0000';
        postChannel({ name: args, visibility: 'public', members: [idUser], owner: idUser });
      } catch (error) {
        console.error("Erreur lors de la création du canal :", error);
        return [
          {
            channelId: 'system',
            _id: `system-message-help-${randomId()}`,
            author: 'System',
            text: (
              <>
                Erreur lors de la création du canal : {error}
              </>
            ),
          },
        ];
      }
      return [
        {
          channelId: 'system',
          _id: `system-message-help-${randomId()}`,
          author: 'System',
          text: (
            <>
              Canal <strong><i>#{args}</i></strong> créé avec succès.
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
      let text = `Canal ${args} supprimé avec succès.`;
      try {
        const channel = await getIdChannelByName(args);
        deleteChannel(channel._id);
      } catch (error) {
        console.error("Erreur lors de la suppression du canal :", error);
        text = `Erreur lors de la suppression du canal : ${args}`;
      }
      return [
        {
          channelId: 'system',
          _id: `system-message-help-${randomId()}`,
          author: 'System',
          text: (
            <>
              {text}
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
      return [
        {
          channelId: 'system',
          _id: `system-message-help-${randomId()}`,
          author: 'System',
          text: (
            <>
              Commande /join non implémentée.
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
      return [
        {
          channelId: 'system',
          _id: `system-message-help-${randomId()}`,
          author: 'System',
          text: (
            <>
              Commande /quit non implémentée.
            </>
          ),
        },
      ];
    case 'users':
      // List users in the channel
      const membersChannel = await getMembers(channelId);
      console.log(membersChannel)

      return [
        {
          channelId: 'system',
          _id: `system-message-help-${randomId()}`,
          author: 'System',
          text: (
            <>
              Voici la liste des membres dans le canal : <br />

              {(await membersChannel).map((member) => (
                <strong key={member}>{member}<br /></strong>
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
    case 'informations':
      const data = await getChannelInformations(channelId);
      const isOwner = data.owner === getIdentity();
      const owner = isOwner
        ? "Vous êtes le owner du channel."
        : "Vous n'êtes pas le owner du channel, vous avez donc pas de permissions."

      console.log(data)
      return [
        {
          channelId: 'system',
          _id: `system-message-help-${randomId()}`,
          author: 'System',
          text: (
            <>
              Le nom du channel est : <strong>{data.name}</strong><br />
              L'id de ce channel est : <strong>{channelId}</strong>.<br />
              {owner}
            </>
          ),
        },
      ];
      return [
        {
          channelId: 'system',
          _id: `system-message-help-${randomId()}`,
          author: 'System',
          text: (
            <>
              Commande /msg non implémentée.
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