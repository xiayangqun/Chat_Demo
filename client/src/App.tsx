import { BrowserRouter } from 'react-router-dom';
import { ApolloProviderWrapper } from './app/providers/ApolloProvider';
import { SocketProvider } from './app/providers/SocketProvider';
import { AuthGate } from './features/auth/components/AuthGate';
import { AppShell } from './features/chat/components/AppShell';

function App() {
  return (
    <BrowserRouter>
      <ApolloProviderWrapper>
        <SocketProvider>
          <AuthGate>
            <AppShell />
          </AuthGate>
        </SocketProvider>
      </ApolloProviderWrapper>
    </BrowserRouter>
  );
}

export default App;
