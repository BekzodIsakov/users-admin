import { useEffect, useState } from "react";
import { Form, Table } from "react-bootstrap";
import { formatDate } from "./utils/formatDate";


function App() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch("http://localhost:8080", {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0N2FkOTIzZjYxZmExNGYwNWNjNTM4NiIsImlhdCI6MTY4NTc3MjU3OX0.Htgrb45EmWkGyk8NY-PQQk14BrtWthdCed46z-hMol8",
        },
      });
      const data = await response.json();
      setUsers(data);
    }

    fetchUsers();
  }, []);
  return (
    <>
      <Table striped bordered>
        <thead>
          <tr>
            <th>
              <Form.Check type='checkbox' />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Last login</th>
            <th>Registration date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.length ?
            users.map((user) => (
              <tr className='align-middle' key={user._id}>
                <td>
                  <Form.Check type='checkbox' />
                </td>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{formatDate(user.lastSignedAt)}</td>
                <td>{formatDate(user.createdAt)}</td>
                <td className='text-success'>
                  {user.isBlocked ? "Blocked" : "Active"}
                </td>
              </tr>
            )) : null}
        </tbody>
      </Table>
    </>
  );
}

export default App;
