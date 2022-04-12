import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';

import Navbar from './Navbar';
import Home from './Home';
import ProfileEdit from './Form/ProfileEdit';
import Upload from './Form/Upload';
import FamilyCreate from './Form/FamilyCreate';
import FamilyList from './family/FamilyList';

const Container = styled.nav`
  font-family: overpass;
`;

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Container>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/members" element={<FamilyList />} />
          <Route exact path="/create" element={<FamilyCreate />} />
          <Route exact path="/edit" element={<ProfileEdit />} />
          <Route exact path="/upload" element={<Upload />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
