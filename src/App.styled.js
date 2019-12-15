import styled from 'styled-components';
import { Form } from 'semantic-ui-react';

export const LoginContainer = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10em;

  & > div {
    margin-bottom: 1em;
  }

  & > button {
    margin-left: 8em !important;
  }

  & > h3 {
      margin-left: 6em;
  }

  & > h5 {
    color: red;
    margin: 0 0 1em 8em;
  }
`;

export const MainContainer = styled.div`
  padding: 2em;
`