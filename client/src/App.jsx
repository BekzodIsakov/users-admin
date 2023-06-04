import { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  Form,
  Table,
} from "react-bootstrap";
import { Check2Circle, XCircle } from "react-bootstrap-icons";
import { formatDate } from "./utils/formatDate";

function deleteUsers(userIds) {
  const token = localStorage.getItem("token");
  // fetch(`${import.meta.env.VITE_BASE_URL}`, {
  //   method: 'DELETE',
  //   headers: {
  //             Authorization:
  //               "Bearer " + token,
  //           },
  //   body: {
  //     userIds
  //   }
  // })
  console.log({ token, userIds });
}

function setAccountStatus(userIds, isBlocked) {
  updateAccount({
    userIds,
    isBlocked,
  });
}

function updateAccount(body) {
  const token = localStorage.getItem("token");
  fetch(import.meta.env.VITE_BASE_URL, {
    method: "PATCH",
    headers: {
      Authorization: "Bearer " + token,
    },
    body,
  });
}

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  function handleUserCheckbox(isChecked, userId) {
    isChecked ? selectUser(userId) : unSelectUser(userId);
  }

  function selectUser(userId) {
    const updatedSelectedUserIds = [...selectedUserIds, userId];
    setSelectedUserIds(updatedSelectedUserIds);
  }

  function unSelectUser(userId) {
    const filteredUserIds = selectedUserIds.filter(
      (currUserId) => currUserId !== userId
    );
    setSelectedUserIds(filteredUserIds);
  }

  function handleSelectAllUserIds(isChecked) {
    const allUserIds = isChecked ? users.map((user) => user._id) : [];
    setSelectedUserIds(allUserIds);
  }

  console.log({ selectedUserIds });

  useEffect(() => {
    async function fetchUsers() {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}`, {
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
    <div className='container-xxl py-2'>
      <ButtonToolbar>
        <ButtonGroup className='me-2'>
          <Button
            size=''
            variant='danger'
            disabled={!selectedUserIds.length}
            onClick={() => setAccountStatus(selectedUserIds, true)}
          >
            Block
          </Button>
        </ButtonGroup>

        <ButtonGroup>
          <Button
            variant='light'
            title={`Unblock ${selectedUserIds.length > 1 ? "users" : "user"}`}
            disabled={!selectedUserIds.length}
            onClick={() => setAccountStatus(selectedUserIds, false)}
          >
            <Check2Circle color='green' />
          </Button>
          <Button
            variant='light'
            title={`Delete ${selectedUserIds.length > 1 ? "users" : "user"}`}
            disabled={!selectedUserIds.length}
            onClick={() => deleteUsers(selectedUserIds)}
          >
            <XCircle color='tomato' />
          </Button>
        </ButtonGroup>
      </ButtonToolbar>

      <Table striped bordered className='mt-2'>
        <thead>
          <tr>
            <th>
              <Form.Check
                type='checkbox'
                onChange={(e) => handleSelectAllUserIds(e.target.checked)}
              />
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
          {users.length
            ? users.map((user) => (
                <tr className='align-middle' key={user._id}>
                  <td>
                    <Form.Check
                      checked={selectedUserIds.includes(user._id)}
                      type='checkbox'
                      onChange={(e) =>
                        handleUserCheckbox(e.target.checked, user._id)
                      }
                    />
                  </td>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{formatDate(user.lastSignedAt)}</td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td
                    className={user.isBlocked ? "text-warning" : "text-success"}
                  >
                    {user.isBlocked ? "Blocked" : "Active"}
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </Table>
    </div>
  );
}

export default App;
