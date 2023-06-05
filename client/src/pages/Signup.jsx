import { useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import validator from "validator";

export const Signup = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [invalidEmailMessage, setInvalidEmailMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigateTo = useNavigate();

  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to={"/"} replace />;
  }

  function validateUserEmail() {
    if (userEmail) {
      let message = validator.isEmail(userEmail) ? "" : "Invalid email";
      setInvalidEmailMessage(message);
    } else {
      setInvalidEmailMessage("");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    fetch(`${import.meta.env.VITE_BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: userName,
        email: userEmail,
        password: userPassword,
      }),
    })
      .then((res) => res.json())
      .then((user) => {
        localStorage.setItem("token", user.token);
        navigateTo("/");
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }

  return (
    <div className='container-sm' style={{ maxWidth: "23rem" }}>
      <h2 className='text-center my-4'>Sign up</h2>
      <Form onSubmit={(e) => handleSubmit(e)}>
        <Stack gap={4}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type='text'
              placeholder='Enter name'
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <div className='position-relative'>
              <Form.Control
                required
                type='email'
                placeholder='Enter email'
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                onBlur={validateUserEmail}
              />
              <div
                className='position-absolute top-100 text-danger'
                style={{ fontSize: "0.8rem" }}
              >
                {invalidEmailMessage}
              </div>
            </div>
          </Form.Group>
          <Form.Group controlId='formGroupPassword'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type='password'
              placeholder='Password'
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
            />
          </Form.Group>
        </Stack>
        <Stack className='mt-4' gap={3}>
          <Button size='sm' type='submit' disabled={loading}>
            {loading ? "Processing..." : "Sign up"}
          </Button>
          <Link to={"/signin"}>Signin</Link>
        </Stack>
      </Form>
    </div>
  );
};
