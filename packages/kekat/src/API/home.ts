import gql from 'graphql-tag';

export const ME_QUERY = gql`
  {
    getMe {
      id
      firstName
      lastName
      email
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation register($data: RegisterInput!) {
    register(data: $data) {
      firstName
      lastName
      email
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation login($data: LoginInput!) {
    login(data: $data)
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation logout {
    logout
  }
`;

export const CONFIRM_EMAIL_MUTATION = gql`
  mutation confirmEmail($uniqueId: String!) {
    confirmEmail(uniqueId: $uniqueId)
  }
`;

export const SEND_CONFIRM_EMAIL_MUTATION = gql`
  mutation sendConfirmEmail($email: String!) {
    sendConfirmEmail(email: $email)
  }
`;

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation forgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;
