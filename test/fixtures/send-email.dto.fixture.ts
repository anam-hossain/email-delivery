export const sendEmailDtoFixture: any = {
  to: [
    {
      email: 'foo@bar.com',
    },
  ],
  cc: [
    {
      email: 'bar@baz.com',
    },
  ],
  bcc: [
    {
      email: 'baz@foobar.com',
      name: 'baz',
    },
  ],
  subject: 'Email service',
  from: {
    email: 'foo@bar.com',
    name: 'foo bar',
  },
  content: 'Email Service test',
  queue: false,
};
