import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Header from '../Header/Header'
import Dashboard from '../../Pages/Dashboard/Dashboard'
// import AddCategory from '../../Pages/Category/AddCategory'
// import EditCategory from '../../Pages/Category/EditCategory'
import AllProduct from '../../Pages/Products/AllProduct'
import AddProduct from '../../Pages/Products/AddProduct'
import AllTags from '../../Pages/Tags/AllTags'
import AddTag from '../../Pages/Tags/AddTag'
import EditTag from '../../Pages/Tags/EditTag'
import AllVoucher from '../../Pages/Vouchers/AllVoucher'
import CreateVoucher from '../../Pages/Vouchers/AddVoucher'
import AllOrder from '../../Pages/Orders/AllOrder'
import EditOrder from '../../Pages/Orders/EditOrder'
import AllUsers from '../../Pages/Users/AllUsers'
import AllSubCategory from '../../Pages/SubCategory/AllSubCategory'
import AddSubCategory from '../../Pages/SubCategory/AddSubCategory'
import EditSubCategory from '../../Pages/SubCategory/EditSubCategory'
import AllColor from '../../Pages/Color/AllColor'
import AddColor from '../../Pages/Color/AddColor'
import EditColor from '../../Pages/Color/EditColor'
import AllSize from '../../Pages/Size/AllSize'
import AddSize from '../../Pages/Size/AddSize'
import EditSize from '../../Pages/Size/EditSize'
import AllFlavour from '../../Pages/Flavour/AllFlavour'
import AddFlavour from '../../Pages/Flavour/AddFlavour'
import EditFlavour from '../../Pages/Flavour/EditFlavour'
import AllSBanner from '../../Pages/Banner/AllSBanner'
import AllShopBanner from '../../Pages/ShopsBanner/AllShopBanner'
import AddShopBanner from '../../Pages/ShopsBanner/AddShopBanner'
import EditShopBanner from '../../Pages/ShopsBanner/EditShopBanner'
import AddBanner from '../../Pages/Banner/AddBanner'
import EditBanner from '../../Pages/Banner/EditBanner'
import AllRefrenceCompany from '../../Pages/RefrenceCompany/AllRefrenceCompany'
import AddRefrenceCompany from '../../Pages/RefrenceCompany/AddRefrenceCompany'
import EditRefrenceCompany from '../../Pages/RefrenceCompany/EditRefrenceCompany'
import AllCategoryTitel from '../../Pages/CategoryTitel/AllCategoryTitel'
import AddCategoryTitel from '../../Pages/CategoryTitel/AddCategoryTitel'
import EditCategoryTitel from '../../Pages/CategoryTitel/EditCategoryTitel'
import EditProduct from '../../Pages/Products/EditProduct '
import AllInnerSubCategory from '../../Pages/InnerSubCategory/AllInnerSubCategory'
import AddInnerSubCategory from '../../Pages/InnerSubCategory/AddInnerSubCategory'
import EditInnerSubCategory from '../../Pages/InnerSubCategory/EditInnerSubCategory'
import AllProductTag from '../../Pages/ProductTag/AllProductTag'
import AddProductTag from '../../Pages/ProductTag/AddProductTag'
import EditProductTag from '../../Pages/ProductTag/EditProductTag'
import AllContactQuery from '../../Pages/ContactQuery/AllContactQuery'
import Login from '../auth/Login'
import AllDieses from '../../Pages/Dieses/AllDieses'
import AddCategory from '../../Pages/Dieses/AddCategory'
import EditCategory from '../../Pages/Dieses/EditCategory'
import Blog from '../../Pages/Blog/Blog'
import AddBlog from "../../Pages/Blog/AddBlog"
import About from '../../Pages/About/About'
import UpdateAbout from '../../Pages/About/UpdateAbout'
// import MindHealthTest from '../../Pages/MindHealthTest/AllMindHealthTest'
// import AddMindHealthTest from '../../Pages/MindHealthTest/AddMindHealthTest'
import AddTest from '../../Pages/MindHealthTest/AddTest'
import ViewTest from '../../Pages/MindHealthTest/ViewTest'
import NewsLetterForm from '../../Pages/NewsLetterForm/NewsLetterForm'
import ConsultDoctor from '../../Pages/ConsultDoctor/ConsultDoctor'
import SubDieses from '../../Pages/SubDieses/SubDieses'
import AddSubDisease from '../../Pages/SubDieses/AddSubDisease'
import AllHerba from '../../Pages/Herbs/AllHerbs'
import AddHerbs from '../../Pages/Herbs/AddHerbs'
import EditHerbs from '../../Pages/Herbs/EditHerbs'
import EditSubDisease from '../../Pages/SubDieses/EditSubDisease'
import EditBlog from '../../Pages/Blog/EditBlog'
import ResultsPage from '../../Pages/TestPageDommy/ResultsPage'
import AddCoupen from '../../Pages/Coupen/AddCoupen'
import AllCoupen from '../../Pages/Coupen/AllCoupen'
import EditCoupen from '../../Pages/Coupen/EditCoupen'
import AllConsultDoctor from '../../Pages/ManagConsult/AllConsultDoctor'
import AddConsultDoctor from '../../Pages/ManagConsult/AddConsultDoctor'
import EditConsultDoctor from '../../Pages/ManagConsult/EditConsultDoctor'
import AllReviews from '../../Pages/Reviews/AllReviews'
import AllCart from '../../Pages/Cart/AllCart'
import EditTest from '../../Pages/MindHealthTest/EditTest'

const Home = () => {

  const login = sessionStorage.getItem("login")

  return (
    <>

      {
        login ? (
          <>
            <Header />
            <div className="rightside">
              <Routes>
                <Route path={"/"} element={<Dashboard />} />


                <Route path={"/news-letter"} element={<NewsLetterForm />} />

                {/* Consult Doctor */}
                <Route path={"/patient-details"} element={<ConsultDoctor />} />
                <Route path={"/all-consult-doctor"} element={<AllConsultDoctor />} />
                <Route path={"/add-consult-doctor"} element={<AddConsultDoctor />} />
                <Route path={"/edit-consult-doctor/:id"} element={<EditConsultDoctor />} />

                {/* subCategory  */}
                <Route path={"/sub-diseases"} element={<SubDieses />} />
                <Route path={"/add-sub-diseases"} element={<AddSubDisease />} />
                <Route path={"/edit-sub-diseases/:id"} element={<EditSubDisease />} />

                {/* about us  */}
                <Route path={"/about"} element={<About />} />
                <Route path={"/update-about"} element={<UpdateAbout />} />
                {/* mind health test  */}
                <Route path={"/add-test"} element={<AddTest />} />
                <Route path={"/view-test"} element={<ViewTest />} />
                <Route path={"/Edit-test/:id"} element={<EditTest />} />

                {/* <Route path={"/add-mind-health-test"} element={<AddMindHealthTest />} />
                <Route path={"/mind-health-test"} element={<MindHealthTest />} /> */}
                <Route path={"/update-about"} element={<UpdateAbout />} />
                {/* Subcategory */}
                <Route path={"/all-subcategory"} element={<AllSubCategory />} />
                <Route path={"/add-subcategory"} element={<AddSubCategory />} />
                <Route path={"/edit-subcategory/:id"} element={<EditSubCategory />} />

                {/* Color */}
                <Route path={"/all-color"} element={<AllColor />} />
                <Route path={"/add-color"} element={<AddColor />} />
                <Route path={"/edit-color/:id"} element={<EditColor />} />

                {/* Size */}
                <Route path={"/all-size"} element={<AllSize />} />
                <Route path={"/add-size"} element={<AddSize />} />
                <Route path={"/edit-size/:id"} element={<EditSize />} />

                {/* Flover */}
                <Route path={"/all-flower"} element={<AllFlavour />} />
                <Route path={"/add-flover"} element={<AddFlavour />} />
                <Route path={"/edit-flover/:id"} element={<EditFlavour />} />


                <Route path={"/all-ref-companies"} element={<AllRefrenceCompany />} />
                <Route path={"/add-ref-company"} element={<AddRefrenceCompany />} />
                <Route path={"/edit-ref-company/:id"} element={<EditRefrenceCompany />} />

                {/* Product --  */}
                <Route path={"/all-products"} element={<AllProduct />} />
                <Route path={"/add-product"} element={<AddProduct />} />
                <Route path={"/edit-product/:id"} element={<EditProduct />} />

                {/* Herbs --  */}
                <Route path={"/All-Herbs-For-Natural"} element={<AllHerba />} />
                <Route path={"/add-Herbs"} element={<AddHerbs />} />
                <Route path={"/edit-Herbs/:id"} element={<EditHerbs />} />

                {/* Category --  */}
                <Route path={"/all-dieses"} element={<AllDieses />} />
                <Route path={"/add-category"} element={<AddCategory />} />
                <Route path={"/edit-category/:id"} element={<EditCategory />} />

                {/* blogs -- */}
                <Route path={"/all-blogs"} element={<Blog />} />
                <Route path={"/add-blog"} element={<AddBlog />} />
                <Route path={"/edit-blog/:id"} element={<EditBlog />} />

                {/* --- Orders --- */}
                <Route path={"/all-users"} element={<AllUsers />} />

                <Route path={"/all-contact-query"} element={<AllContactQuery />} />


                {/* --- Vouchers --- */}
                <Route path={"/all-voucher"} element={<AllVoucher />} />   {/* // All Vouchers */}
                <Route path={"/add-voucher"} element={<CreateVoucher />} />

                {/* --- Tags --- */}
                <Route path={"/all-tags"} element={<AllTags />} />
                <Route path={"/add-tag"} element={<AddTag />} />
                <Route path={"/edit-tag/:id"} element={<EditTag />} />

                {/* --- Banners --- */}
                <Route path={"/all-shop-banners"} element={<AllShopBanner />} />
                <Route path={"/add-shop-banner"} element={<AddShopBanner />} />
                <Route path={"/edit-shop-banner/:id"} element={<EditShopBanner />} />

                {/* --- Banners --- */}
                <Route path={"/all-banners"} element={<AllSBanner />} />
                <Route path={"/add-banner"} element={<AddBanner />} />
                <Route path={"/edit-banner/:id"} element={<EditBanner />} />

                {/* --- Orders --- */}
                <Route path={"/all-orders"} element={<AllOrder />} />
                <Route path={"/order-details/:id"} element={<EditOrder />} />

                <Route path={"/all-coupen"} element={<AllCoupen />} />
                <Route path={"/edit-coupon/:id"} element={<EditCoupen />} />
                <Route path={"/add-coupen"} element={<AddCoupen />} />

                <Route path={"/all-category-titel"} element={<AllCategoryTitel />} />
                <Route path={"/add-category-titel"} element={<AddCategoryTitel />} />
                <Route path={"/edit-category-titel/:id"} element={<EditCategoryTitel />} />



                <Route path={"/all-inner-subcategory"} element={<AllInnerSubCategory />} />
                <Route path={"/add-innersubcategory"} element={<AddInnerSubCategory />} />
                <Route path={"/edit-innersubcategory/:id"} element={<EditInnerSubCategory />} />


                <Route path={"/all-product-tag"} element={<AllProductTag />} />
                <Route path={"/add-product-tag"} element={<AddProductTag />} />
                <Route path={"/edit-product-tag/:id"} element={<EditProductTag />} />

                <Route path={"/result"} element={<ResultsPage />} />


                {/* all-Reviews */}

                <Route path={'all-reviews'} element={<AllReviews />} />
                <Route path={'All-carts'} element={<AllCart />} />

              </Routes>
            </div>
          </>
        ) : (
          <Routes>
            <Route path="/*" element={<Login />} />
          </Routes>
        )}
    </>
  )
}

export default Home