import React from 'react';
import styled from 'styled-components';
import LoginForm from '../../components/loginform';

// Styled component with background image
const PageContainer = styled.div`
  background-image: url(${'https://wallpaperaccess.com/full/10767352.jpg'});
  background-size: cover;
  background-position: center;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginPage: React.FC = () => {
  return (
    <PageContainer>
      <LoginForm />
    </PageContainer>
  );
};

export default LoginPage;
