import { useNavigate } from "react-router-dom";
import axios from "axios";

function Captcha() {
  const sitekey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
  const secretkey = import.meta.env.VITE_RECAPTCHA_SECRET_KEY;
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    grecaptcha.ready(function () {
      grecaptcha.execute(sitekey, { action: "submit" }).then(function (token) {
        // Use POST method
        axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secretkey}&response=${token}`)
        .then((res)=>{
            if(res.data.success === true){
                localStorage.setItem("auth",res.data.success)
              navigate("/photos");
            } else {
              alert("Failed to verify captcha");
            }  
        })
        .catch((error) => {
            console.error("Error:", error);
         });
      });
    });
  };

  return (
    <div>
      <form
        method="post"
        onSubmit={(event) => {
          handleSubmit(event);
        }}
      >
        <button type="submit">Verify</button>
      </form>
    </div>
  );
}

export default Captcha;
