
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import Mainpage from "./component/Mainpage";
import Login from "./component/Login"
import Signup from "./component/Signup"
import Option from "./component/Option";
import Finance from "./component/Finance"
import ExpandManage from "./component/ExpandManage"
import Revenue from "./component/Revenue"
import Hroption from "./component/Hroption"
import Employeedetail from "./component/Employeedetail"
import Attendance from "./component/Attendance"
import Salerydetail from "./component/Salerydetail"
import Employeevancey from "./component/Employeevancey"
import Projectdata from "./component/Projectdata"
function App() {
 

  return (
    <>
      <Router>
        <Routes>
          {/* <Route path='/' element={<Mainpage />} /> */}
          <Route path='/' element={<Login />} />
          <Route path='/signup' element={<Signup/>} />
          <Route path='/option' element={<Option/>} />
          <Route path='/finance' element={<Finance/>} />
          <Route path='/expandmanage' element={<ExpandManage/>} />
          <Route path='/revenue' element={<Revenue/>} />
          <Route path='/hroption' element={<Hroption/>} />
          <Route path='/employeedetail' element={<Employeedetail/>} />
          <Route path='/attendance' element={<Attendance/>} />
          <Route path='/salerydetail' element={<Salerydetail/>} />
          <Route path='/employeevancey' element={<Employeevancey/>} />
          <Route path='/projectdata' element={<Projectdata/>} />
          
        </Routes>
      </Router>
    </>
  )
}

export default App
