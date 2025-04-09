import type { TemplateName, Templates } from './email-types';
import mailer from './mailer';
import renderTemplate from './templates';

type TemplateProps<T extends keyof Templates> = Parameters<typeof renderTemplate<T>>[1];

const sendEmail = async <T extends TemplateName>({
  to,
  subject,
  template,
  props,
}: {
  to: string;
  subject: string;
  template: T;
  props: TemplateProps<T>;
}) => {
  const html = await renderTemplate(template, props);

  await mailer.sendMail({
    from: `"TonApp" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;
