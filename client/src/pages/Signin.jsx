import { useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import { Link, Navigate } from "react-router-dom";
import validator from "validator";

export const Signin = () => {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [invalidEmailMessage, setInvalidEmailMessage] = useState("");

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

  return (
    <div className='container-sm' style={{ maxWidth: "23rem" }}>
      <h2 className='text-center my-4'>Sign in</h2>
      <Form>
        <Stack gap={4}>
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
              <div
                className='position-absolute top-100 text-danger'
                style={{ fontSize: "0.8rem" }}
              >
                {invalidEmailMessage}
              </div>
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
        <Stack className='mt-4' gap={3}>
          <Button size='sm' type='submit'>
            Sign in
          </Button>
          <Link to={"/signup"}>Signup</Link>
        </Stack>
      </Form>
    </div>
  );
};
