import { useState, useEffect } from "react";
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

  function validateUserEmail() {
    if (userEmail) {
      let message = validator.isEmail(userEmail) ? "" : "Invalid email";
      setInvalidEmailMessage(message);
    } else {
      setInvalidEmailMessage("");
    }
  }

  async function signupUser() {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: userName,
        email: userEmail,
        password: userPassword,
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      setInvalidEmailMessage(result.message);
    } else {
      localStorage.setItem("token", result.token);
      navigateTo("/");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await signupUser();
    setLoading(false);
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      return <Navigate to={"/"} replace />;
    }
  }, []);

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
            <div>
              <Form.Control
                required
                type='email'
                placeholder='Enter email'
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                onBlur={validateUserEmail}
              />
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

        <div className='text-danger mt-4' style={{ fontSize: "0.8rem" }}>
          {invalidEmailMessage}
        </div>

        <Stack className='mt-2' gap={3}>
          <Button size='sm' type='submit' disabled={loading}>
            {loading ? "Processing..." : "Sign up"}
          </Button>
          <Link to={"/signin"}>Signin</Link>
        </Stack>
      </Form>
    </div>
  );
};
