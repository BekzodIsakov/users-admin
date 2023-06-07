import { useEffect, useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import { Link, Navigate, useNavigate } from "react-router-dom";
import validator from "validator";

export const Signin = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [invalidCredentialsMessage, setInvalidCredentialsMessage] =
    useState("");
  const [invalidEmailMessage, setInvalidEmailMessage] = useState();
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

  async function signinUser() {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userEmail,
        password: userPassword,
      }),
    });
    const result = await response.json();
    if (!response.ok) {
      setInvalidCredentialsMessage(result.message);
    } else {
      localStorage.setItem("token", result.token);
      navigateTo("/");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await signinUser();
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
      <h2 className='text-center my-4'>Sign in</h2>
      <Form onSubmit={handleSubmit}>
        <Stack gap={4} className='mb-4'>
          <Form.Group controlId='formGroupEmail'>
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
              {invalidEmailMessage && (
                <div
                  className='position-absolute top-100 text-danger'
                  style={{ fontSize: "0.8rem" }}
                >
                  {invalidEmailMessage}
                </div>
              )}
            </div>
          </Form.Group>
          <Form.Group controlId='formGroupPassword'>
            <Form.Label className='font-weight-bold'>Password</Form.Label>
            <Form.Control
              required
              type='password'
              placeholder='Password'
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
            />
          </Form.Group>
        </Stack>

        {invalidCredentialsMessage && (
          <div className='text-danger' style={{ fontSize: "0.8rem" }}>
            {invalidCredentialsMessage}
          </div>
        )}
        <Stack className='mt-2' gap={3}>
          <Button size='sm' type='submit' disabled={loading}>
            {loading ? "Processing" : "Sign in"}
          </Button>
          <Link to={"/signup"}>Signup</Link>
        </Stack>
      </Form>
    </div>
  );
};
