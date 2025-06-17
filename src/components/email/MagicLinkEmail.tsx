import { Body, Html, Text } from '@react-email/components';

interface MagicLinkEmailProps {
  url: string;
}

const MagicLinkEmail = ({ url }: MagicLinkEmailProps): React.JSX.Element => {
  return (
    <Html>
      <Body>
        <Text>
          Vous avez demandé un lien de connexion. Cliquez sur le lien ci-dessous pour accéder à
          votre compte :
        </Text>
        <Text>
          Voici votre lien : <a href={url}>{url}</a>
        </Text>
      </Body>
    </Html>
  );
};

export default MagicLinkEmail;
