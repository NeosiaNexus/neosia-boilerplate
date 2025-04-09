import { render } from '@react-email/render';

import MagicLinkEmail from '@/components/email/MagicLinkEmail';

import type { TemplateName, Templates } from './email-types';

const renderTemplate = <T extends TemplateName>(template: T, props: Templates[T]) => {
  if (template === 'magic-link') {
    return render(MagicLinkEmail({ url: props.url }));
  }

  throw new Error(`Email template "${template}" not found`);
};

export default renderTemplate;
