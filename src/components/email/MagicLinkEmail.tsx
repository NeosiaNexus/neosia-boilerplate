import { Body, Html, Text } from '@react-email/components';

const MagicLinkEmail = ({ url }: { url: string }) => {
  return (
    <Html>
      <Body>
        <Text>
          Voici votre lien : <a href={url}>{url}</a>
        </Text>
      </Body>
    </Html>
  );
};

export default MagicLinkEmail;
