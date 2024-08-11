import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Toaster } from "@/components/ui/toaster"
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { setResource } from "./store/globalSlice";
import './App.css';
import Home from './views/Home';
import Landing from './views/Landing';
import Layout from './Layout';
import Login from './views/register/Login';
import RegisterFull from "./views/register/RegisterFull";
import Profile from "./views/Profile";
import Search from "./views/Search";
import MyProfile from "./views/me/MyProfile";
import SearchResult from "./views/Searchresult";
import Membership from "./views/Membership";
import Contact from "./views/Contact";
import Testimonial from "./views/Testimonial";
import ScrollToTop from "./hook/scrollToTop";
import EditProfile from "./views/me/EditProfile";
import AddPhoto from "./views/me/AddPhoto";
import Horoscope from "./views/Horoscope";
import AddHoroscope from "./views/me/AddHoroscope";
import ChangePassword from "./views/me/ChangePassword";
import PartnerPrefrence from "./views/me/PartnerPrefrence";
import Inbox from "./views/Inbox";
import Sortlist from "./views/me/Sortlist";
import Error404 from "./components/global/error404";
import Forget from "./views/register/Forget";
import Privacy from "./views/Privacy";
import Termofuse from "./views/Termofuse";
import Register2 from "./views/register/Register2";
import UploadProfile from "./views/register/UploadProfile";
import PaymentForm from "./views/PaymentForm";


function App() {

  const token = useSelector((state) => state.global.token);
  const user = useSelector((state) => state.global.user);
  const apiUrl = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();

  const getResourse = () => {
    if (!user) {
      dispatch(setToken(null));
      dispatch(setUser(null));
      dispatch(setName(null));
    }
    axios.get(apiUrl + 'htmlresources.php')
      .then(function (response) {
        if (response.data.status == "Ok") {
          dispatch(setResource(response.data.data));
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  useEffect(() => {
    getResourse();
  }, []);

  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route exact path="/" element={<Layout />} >
            <Route exact path="login" element={<Login />} />
            <Route exact path="register" element={<RegisterFull />} />
            <Route exact path="register-2" element={<Register2 />} />
            <Route exact path="upload-photo" element={<UploadProfile />} />
            <Route exact path="forget" element={<Forget />} />
            <Route exact path="/" element={user?.payload ? <Home /> : <Landing />} />
            <Route exact path='/search' element={<Search />} />
            <Route exact path='/search/searchresult/:page' element={<SearchResult />} />
            <Route exact path='/membership' element={<Membership />} />
            <Route exact path='/horoscope' element={<Horoscope />} />
            <Route exact path='/testimonial' element={<Testimonial />} />
            <Route exact path='/contact-us' element={<Contact />} />
            <Route exact path='/profile/:id' element={<Profile />} />
            <Route exact path='/privacy-policy' element={<Privacy />} />
            <Route exact path='/term-of-use' element={<Termofuse />} />
            {token.payload ?
              <>
                <Route exact path='/inbox' element={<Inbox />} />
                <Route exact path='/inbox/:page' element={<Inbox />} />
                <Route exact path='/me' element={<MyProfile />} />
                <Route exact path='/me/edit' element={<EditProfile />} />
                <Route exact path='/me/partner-prefrence' element={<PartnerPrefrence />} />
                <Route exact path='/me/add-photo' element={<AddPhoto />} />
                <Route exact path='/me/add-horoscope' element={<AddHoroscope />} />
                <Route exact path='/me/change-password' element={<ChangePassword />} />
                <Route exact path='/me/sortlist' element={<Sortlist />} />
                <Route exact path='/payment' element={<PaymentForm />} />
              </> : ""
            }
            <Route exact path="/*" element={<Error404 />} />
            {!token.payload && <Route path="/*" element={<Navigate to="/login" replace />} />}
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  )
}

export default App
