import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
function AttendInterview() {
    const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  let name, value;
  const handleChange = (e) => {
    name = e.target.name;
    value = e.target.value;
    setUser({ ...user, [name]: value });
  };

  const postData = async (e) => {
    e.preventDefault();

    try{
      const res=await fetch('/validate',{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name:user.name,
          email: user.email,
          password:user.password
        }),
      });
      
      const data=await res.json();
     // const image=data.image;
      const image = encodeURIComponent(data.image);
      if(res.status===200)
      {
        navigate(`/verify/${image}`)
      }
    }catch(err){
      console.log(err);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center">
        <div className="col-md-6">
          <section className="signup">
            <div className="container mt-5">
              <div className="signup-content">
                <div className="signup-form">
                  <h2 className="form-title">Start Interview</h2>
                  <form
                    method="POST"
                    className="register-form"
                    id="register-form"
                  >
                    <div className="form-group mt-5" style={{ padding: 5 }}>
                      <label htmlFor="name">
                        <i className="zmdi zmdi-account material-icons-name mr-4"></i>
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={user.name}
                        onChange={handleChange}
                        autoComplete="off"
                        placeholder="Name"
                        style={{ padding: 5 }}
                      />
                    </div>

                    <div className="form-group" style={{ padding: 5 }}>
                      <label htmlFor="email">
                      <i className="zmdi zmdi-email material-icons-name mr-4"></i>
                      </label>
                      <input
                        type="text"
                        name="email"
                        id="email"
                        value={user.email}
                        onChange={handleChange}
                        autoComplete="off"
                        placeholder="Email"
                        style={{ padding: 5 }}
                      />
                    </div>

                    {/* Add password field */}
                    <div className="form-group" style={{ padding: 5 }}>
                      <label htmlFor="password">
                        <i className="zmdi zmdi-lock material-icons-name mr-4"></i>
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        value={user.password}
                        onChange={handleChange}
                        autoComplete="off"
                        placeholder="Password"
                        style={{ padding: 5 }}
                      />
                    </div>

                    <div
                      className="form-group form-button ml-5"
                      style={{ marginTop: 20 }}
                    >
                      <input
                        type="submit"
                        name="signup"
                        id="signup"
                        className="form-submit primary"
                        value="Start"
                        onClick={postData}
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AttendInterview;
