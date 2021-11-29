import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AppHeader } from "../appHeader/AppHeader";
import { Spinner } from "../spinner/Spinner";
// import { MainPage, ComicsPage, SingleComicsPage } from "../pages/";

const Page404 = lazy(() => import("../pages/404"));
const MainPage = lazy(() => import("../pages/MainPage"));
const ComicsPage = lazy(() => import("../pages/ComicsPage"));
const SingleCharacterLayout = lazy(() => import("../pages/singleCharcterLayout/SingleCharacterLayout"));
const SingleComicsLayout = lazy(() => import("../pages/singleComicsLayout/SingleComicsLayout"));
const SinglePage = lazy(() => import ('../pages/SinglePage'))

const App = () => {
  return (
    <Router>
      <div className="app">
        <AppHeader />
        <main>
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route path="/marveltest" element={<MainPage />} />
              <Route path="/comics" element={<ComicsPage />} />
              <Route path="/comics/:id" element={<SinglePage  Component={SingleComicsLayout} dataType='comics'/>} />
              <Route path="/characters/:id" element={<SinglePage Component={SingleCharacterLayout} dataType='character' />} />
              <Route path="*" element={<Page404 />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
};

export { App };
