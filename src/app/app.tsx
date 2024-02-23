import styled from 'styled-components';
import { MapComponent } from './map/mapComponent';

const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  return (
    <StyledApp>
      <MapComponent />
    </StyledApp>
  );
}

export default App;
