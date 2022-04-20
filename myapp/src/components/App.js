import { BrowserRouter, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './Navbar';
import GlobalStyles from '../GlobalStyles';
import Home from './Home';
import ProfileEdit from './Form/ProfileEdit';
import FamilyCreate from './Form/FamilyCreate';
import FamilyList from './family/FamilyList';
import FamilyTree from './family/FamilyTree';
import MemberProfile from './family/MemberProfile';
import FamilyTree2 from './family/FamilyTree2';
import LoginMain from './Login/LoginMain';

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

          <Route exact path="/create" element={<FamilyCreate />} />
          <Route exact path="/edit" element={<ProfileEdit />} />
          <Route exact path="/edit/:memberId" element={<ProfileEdit />} />

          <Route exact path="/tree" element={<FamilyTree />} />
          <Route exact path="/tree2" element={<FamilyTree2 />} />

          <Route exact path="/login" element={<LoginMain />} />
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
