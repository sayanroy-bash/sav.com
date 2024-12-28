import { useNavigate } from "react-router-dom";


function ProtectedRoute({children}) {

    const auth=localStorage.getItem('auth');
    const navigate=useNavigate();

    if(auth){
        return children;
    }else{
        navigate("/");
    }

}

export default ProtectedRoute