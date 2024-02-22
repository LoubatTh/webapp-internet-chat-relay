import { fetchApi } from "./api";
import { getIdentity } from "./localstorage";
import { ChannelPostType, ChannelType, GuestType, UserType, UserTypeUsername } from "./type";


const randomId = () => {
  return Math.floor(Math.random() * 1000).toString();
};

const getAllChannel = async (): Promise<ChannelType[]> => {
  const data = await fetchApi<ChannelType[]>("GET", "channels");
  return data;
};

const changeNick = async (id: string, name: string) => {

  try{
    const guest = await fetch(`/api/guests/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if(guest.status != 200){
      const user = await fetch(`/api/users/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if(user.status != 200){
        return "User not found";
      } 
      await fetchApi<UserTypeUsername>("PUT", `/users/${id}`,{username: name});
    }
    await fetchApi<UserTypeUsername>("PUT",`/guests/${id}`, {username: name})
  } catch(error){
    console.log(error);
  }
};

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

const getAllChannelNames = async (): Promise<string[]> => {
  try {
    const channels = await getAllChannel();
    const names = channels.map((channel) => channel.name);
    return names;
  } catch (error) {
    console.error("Erreur lors de la récupération des noms de chaînes :", error);
    throw error;
  }
};


const getMembers = async (id: string): Promise<string[]> => {
  try {
    const channel = await fetchApi<ChannelType>("GET", `channels/${id}`);
    const members: string[] = channel.members;
    return members;
  } catch (error) {
    console.error("Erreur lors de la récupération des membres du canal :", error);
    throw error;
  }
}


export const onCommand = async (command: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, args: any) => {
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
      changeNick(getIdentity(), args)
      return [
        {
          channelId: 'system',
          _id: `system-message-help-${randomId()}`,
          author: 'System',
          text: (
            <>
              Votre pseudo à été changé avec succès !!
            </>
          ),
        },
      ];
    case 'list':
      // List available channels
      const channels = getAllChannelNames();

      console.log(channels);
      return [
        {
          channelId: 'system',
          _id: `system-message-help-${randomId()}`,
          author: 'System',
          text: (
            <>
              Voici la liste des canaux disponibles : <br />

              {(await channels).map((channel) => (
                <strong key={channel}>#{channel}<br /></strong>
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
              Veuillez spécifier un nom de canal. <br />
              Exemple : <strong>/delete <i>[channel]</i></strong>
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
      const membersChannel = await getMembers("65d4975649b64dda1934fe59");

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