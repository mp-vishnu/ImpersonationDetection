import React, { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    image: null
  });
//const [password,setPassword]=useState({});
  let name, value;
  const handleChange = (e) => {
    name = e.target.name;
    value = e.target.value;
    setUser({ ...user, [name]: value });
  };

  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setUser({ ...user, image: imageFile });
  };

  const postData = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", user.image);
    formData.append("name", user.name);
    formData.append("email", user.email);

    const { name, email, image } = user;
    if (!name || !email || !image) {
      alert("Fill in all fields");
    } else {
      try {
        const res = await fetch("/password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: user.email,
          }),
        });

        const data = await res.json();
        console.log("---data---",data);
        console.log(data.password);
         console.log("type of",typeof(data.password));
        //  let password;
        // setUser((user) => ({
        //   ...user,
        //   [password]:data.password,
        // }));
        // setPassword({password:data.password});
         console.log("password",data.password);
        if (res.status === 200) {
          formData.append("password", data.password);
          console.log("formdata---",formData);
          const res1 = await fetch("/email", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              password: data.password,
            }),
          });

          if (res1.status === 200) {
            const res2 = await fetch("/register", {
              method: "POST",
              body: formData,
            });
            const data1 = await res2.json();
            console.log("data1---------", data1.data);
            if (res2.status === 200) {
              alert(
                `Registration successful, and a confirmation mail has been sent to ${user.email}`
              );
              navigate("/attend");
            } else {
              alert("Failed");
            }
          } else {
            alert("Registration failed");
          }
        } else {
          alert("Registration failed");
        }
      } catch (error) {
        console.error("Error:", error);
        alert("Internal Server Error");
      }
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
                  <h2 className="form-title">Register</h2>
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

                    <div className="form-group mt-3">
                      <label
                        htmlFor="image"
                        style={{
                          display: "block",
                          fontSize: "0.9em",
                          marginBottom: "0.5em",
                        }}
                      >
                        <i className="zmdi zmdi-image material-icons-name mr-4"></i>
                        Upload Photo
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        name="image"
                        id="image"
                        onChange={handleImageChange}
                        style={{ padding: "0.8em" }}
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
                        value="Register"
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
};

export default Register;
