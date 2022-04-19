import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './Navbar';
import GlobalStyles from '../GlobalStyles';
import Home from './Home';
import ProfileEdit from './Form/ProfileEdit';
import Upload from './Form/Upload';
import FamilyCreate from './Form/FamilyCreate';
import FamilyList from './family/FamilyList';
import FamilyTree from './family/FamilyTree';
import MemberProfile from './family/MemberProfile';
import FamilyTree2 from './family/FamilyTree2';

function App() {
  return (
    <>
    <GlobalStyles />
    
    <BrowserRouter>
      <Navbar />
      <Container>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/members" element={<FamilyList />} />
          <Route exact path="/member/:memberId" element={<MemberProfile />} />
          <Route exact path="/tree" element={<FamilyTree />} />
          <Route exact path="/create" element={<FamilyCreate />} />
          <Route exact path="/edit" element={<ProfileEdit />} />
          <Route exact path="/edit/:memberId" element={<ProfileEdit />} />
          <Route exact path="/upload" element={<Upload />} />
          <Route exact path="/tree2" element={<FamilyTree2 />} />
        </Routes>
      </Container>
    </BrowserRouter>
    </>
  );
}
const Container = styled.nav`
  font-family: overpass;
`;

export default App;
