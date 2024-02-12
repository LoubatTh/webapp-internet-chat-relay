const randomId = () => {
    return Math.floor(Math.random() * 1000).toString();
  };
  
  export const onCommand = (command: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, args: any) => {
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
            length: 0,
            text: (
              <>
                Veuillez spécifier un pseudo. <br />
                Exemple : <strong>/nick <i>[nickname]</i></strong>
              </>
            ),
          },
        ];
        return [
          {
            channelId: 'system',
            _id: `system-message-help-${randomId()}`,
            length: 0,
            author: 'System',
            text: (
              <>
                Commande /nick non implémentée.
              </>
            ),
          },
        ];
      // ... (rest of the cases)
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